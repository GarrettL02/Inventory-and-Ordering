#!/usr/bin/env node
/* eslint-disable */
'use strict';

// =====================================================================
// Database migration runner
//
//   npm run db:migrate   -> create/upgrade the database
//   npm run db:status    -> show applied and pending migrations
//
// How it works
//   - Fresh database (no schemaMigrations table yet):
//       runs src/backend/DatabaseSchema.sql, which already contains every
//       change, then records every file in src/backend/migrations as applied
//       without running it.
//   - Existing database:
//       runs only the migration files not yet listed in schemaMigrations,
//       in numeric order, and records each one after it succeeds.
//
// Connection settings come from .env (same variables the app uses):
//   DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME, and optionally DB_PORT (3306)
// If the database named in DB_NAME does not exist it is created.
//
// Plain JavaScript on purpose: it needs no build step or dev dependencies, so
// it can run on a server or in CI with just `npm ci --omit=dev`.
// =====================================================================

const fs = require('node:fs');
const path = require('node:path');
const mysql = require('mysql2/promise');

const BACKEND_DIR = path.resolve(__dirname, '..', 'src', 'backend');
const BASELINE_FILE = path.join(BACKEND_DIR, 'DatabaseSchema.sql');
const MIGRATIONS_DIR = path.join(BACKEND_DIR, 'migrations');
const MIGRATION_FILE_PATTERN = /^(\d+)_.+\.sql$/;

///////////////////////////////////////////////////////////
//
//  loadEnv()
//  Load .env into process.env (needs Node 20.12+/21.7+).
//  Variables already set in the environment (CI, server) are kept.
//
///////////////////////////////////////////////////////////
function loadEnv() {
  if (typeof process.loadEnvFile !== 'function') return;
  try {
    process.loadEnvFile(path.resolve(__dirname, '..', '.env'));
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

///////////////////////////////////////////////////////////
//
//  getConfig()
//  Read and validate the connection settings
//
///////////////////////////////////////////////////////////
function getConfig() {
  const env = process.env;
  const missing = ['DB_HOST', 'DB_USERNAME', 'DB_NAME'].filter((k) => !env[k]);
  if (missing.length > 0) {
    throw new Error(
      `Missing environment variable(s): ${missing.join(', ')}. Set them in .env.`,
    );
  }
  return {
    host: env.DB_HOST,
    port: env.DB_PORT ? Number(env.DB_PORT) : 3306,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD ?? '',
    database: env.DB_NAME,
  };
}

///////////////////////////////////////////////////////////
//
//  listMigrationFiles()
//  Migration files sorted by their numeric prefix
//
///////////////////////////////////////////////////////////
function listMigrationFiles(dir = MIGRATIONS_DIR) {
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((name) => MIGRATION_FILE_PATTERN.test(name))
    .map((name) => ({
      name,
      number: Number(name.match(MIGRATION_FILE_PATTERN)[1]),
    }))
    .sort((a, b) => a.number - b.number || a.name.localeCompare(b.name));

  // Two files with the same number would make the order ambiguous
  for (let i = 1; i < files.length; i++) {
    if (files[i].number === files[i - 1].number) {
      throw new Error(
        `Duplicate migration number: ${files[i - 1].name} and ${files[i].name}`,
      );
    }
  }

  return files.map((f) => f.name);
}

///////////////////////////////////////////////////////////
//
//  connect()
//  Connect to the database. If it does not exist yet, create it
//  (unless createIfMissing is false).
//
///////////////////////////////////////////////////////////
async function connect(config, createIfMissing = true) {
  const { database, ...serverOptions } = config;
  const options = {
    ...serverOptions,
    charset: 'utf8mb4',
    multipleStatements: true, // needed to run whole .sql files
  };

  try {
    return await mysql.createConnection({ ...options, database });
  } catch (err) {
    if (err.code !== 'ER_BAD_DB_ERROR' || !createIfMissing) throw err;

    const server = await mysql.createConnection(options);
    try {
      const safeName = database.replace(/`/g, '``');
      await server.query(
        `CREATE DATABASE \`${safeName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
      );
      console.log(`Created database "${database}".`);
    } finally {
      await server.end();
    }
    return mysql.createConnection({ ...options, database });
  }
}

///////////////////////////////////////////////////////////
//
//  getAppliedMigrations()
//  Set of applied migration filenames, or null when the
//  schemaMigrations table does not exist (fresh database)
//
///////////////////////////////////////////////////////////
async function getAppliedMigrations(conn) {
  try {
    const [rows] = await conn.query(
      'SELECT filename FROM schemaMigrations ORDER BY filename',
    );
    return new Set(rows.map((row) => row.filename));
  } catch (err) {
    if (err.code === 'ER_NO_SUCH_TABLE') return null;
    throw err;
  }
}

///////////////////////////////////////////////////////////
//
//  runSqlFile()
//  Execute every statement in a .sql file
//
///////////////////////////////////////////////////////////
async function runSqlFile(conn, filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  if (sql.trim() === '') {
    console.warn(`  (skipped, file is empty: ${path.basename(filePath)})`);
    return false;
  }
  await conn.query(sql);
  return true;
}

///////////////////////////////////////////////////////////
//
//  recordMigration()
//  Mark a migration file as applied
//
///////////////////////////////////////////////////////////
async function recordMigration(conn, filename) {
  await conn.query(
    'INSERT IGNORE INTO schemaMigrations (filename) VALUES (?)',
    [filename],
  );
}

///////////////////////////////////////////////////////////
//
//  migrate()
//  Create the schema on a fresh database, or apply pending migrations
//
///////////////////////////////////////////////////////////
async function migrate(conn, files) {
  let applied = await getAppliedMigrations(conn);

  if (applied === null) {
    console.log('Fresh database: applying DatabaseSchema.sql ...');
    const ran = await runSqlFile(conn, BASELINE_FILE);
    if (!ran) {
      throw new Error(
        'DatabaseSchema.sql is empty, so there is nothing to create.',
      );
    }

    // The baseline already includes every migration, so only record them
    for (const file of files) {
      await recordMigration(conn, file);
    }
    console.log(
      `Schema created. Recorded ${files.length} existing migration file(s) as applied.`,
    );
    return;
  }

  const pending = files.filter((file) => !applied.has(file));
  if (pending.length === 0) {
    console.log('Database is up to date. Nothing to apply.');
    return;
  }

  for (const file of pending) {
    console.log(`Applying ${file} ...`);
    try {
      await runSqlFile(conn, path.join(MIGRATIONS_DIR, file));
      await recordMigration(conn, file);
    } catch (err) {
      // MySQL commits DDL statements immediately, so a failed file can be
      // partly applied. Fix the database by hand, then re-run.
      throw new Error(`Migration ${file} failed: ${err.message}`);
    }
  }
  console.log(`Applied ${pending.length} migration(s).`);
}

///////////////////////////////////////////////////////////
//
//  status()
//  Print applied and pending migrations
//
///////////////////////////////////////////////////////////
async function status(conn, files) {
  const applied = await getAppliedMigrations(conn);

  if (applied === null) {
    console.log(
      'Database has no schemaMigrations table yet. Run "npm run db:migrate".',
    );
    return;
  }

  for (const file of files) {
    console.log(`${applied.has(file) ? '[applied]' : '[pending]'} ${file}`);
  }
  for (const name of applied) {
    if (!files.includes(name)) {
      console.warn(`[warning] ${name} is recorded as applied but missing on disk`);
    }
  }
  if (files.length === 0 && applied.size === 0) {
    console.log('No migration files yet (DatabaseSchema.sql is the baseline).');
  }
}

///////////////////////////////////////////////////////////
//
//  main()
//
///////////////////////////////////////////////////////////
async function main() {
  const statusOnly = process.argv.includes('--status');

  loadEnv();
  const config = getConfig();
  const files = listMigrationFiles();

  const conn = await connect(config, !statusOnly);
  try {
    if (statusOnly) {
      await status(conn, files);
    } else {
      await migrate(conn, files);
    }
  } finally {
    await conn.end();
  }
}

///////////////////////////////////////////////////////////
//
//  describeError()
//  Readable error text. Node reports a refused "localhost" connection as
//  an AggregateError (one error per address tried) with an empty message.
//
///////////////////////////////////////////////////////////
function describeError(err) {
  const parts = err.errors && err.errors.length > 0 ? err.errors : [err];
  let text = parts
    .map((e) => [e.code, e.message].filter(Boolean).join(': ') || String(e))
    .join('\n');

  if (parts.some((e) => e.code === 'ECONNREFUSED')) {
    text +=
      `\n\nCould not connect to MySQL at ${process.env.DB_HOST}:${process.env.DB_PORT || 3306}.` +
      '\nIs the MySQL server running, and are DB_HOST / DB_PORT in .env correct?';
  }
  return text;
}

if (require.main === module) {
  main().catch((err) => {
    console.error(`\n${describeError(err)}`);
    process.exitCode = 1;
  });
}

module.exports = { listMigrationFiles, getConfig, loadEnv, connect };
