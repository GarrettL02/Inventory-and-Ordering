#!/usr/bin/env node
/* eslint-disable */
'use strict';

// =====================================================================
// Create a user (or reset a password) in the users table.
//
//   npm run user:create -- <username>             create a normal user
//   npm run user:create -- <username> --admin     create an admin
//   npm run user:create -- <username> --reset     set a new password for an existing user
//
// The password is typed at a hidden prompt, so it never ends up in shell history.
// Uses the same .env database settings as db:migrate.
//
// The hash format (scrypt$N$r$p$salt$hash) must match src/backend/auth/password.ts.
// =====================================================================

const readline = require('node:readline');
const { randomBytes, scrypt } = require('node:crypto');
const { loadEnv, getConfig, connect } = require('./migrate');

const KEY_LENGTH = 64;
const COST = 16384;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;
const MIN_PASSWORD_LENGTH = 8;

function hashPassword(plainPassword) {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16);
    scrypt(
      plainPassword,
      salt,
      KEY_LENGTH,
      { N: COST, r: BLOCK_SIZE, p: PARALLELIZATION },
      (err, key) => {
        if (err) return reject(err);
        resolve(
          [
            'scrypt',
            COST,
            BLOCK_SIZE,
            PARALLELIZATION,
            salt.toString('base64'),
            key.toString('base64'),
          ].join('$'),
        );
      },
    );
  });
}

// Ask a question without echoing what the user types
function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });
    let muted = false;
    const originalWrite = rl._writeToOutput.bind(rl);
    rl._writeToOutput = (text) => {
      if (!muted) originalWrite(text);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write('\n');
      resolve(answer);
    });
    muted = true;
  });
}

async function main() {
  const args = process.argv.slice(2);
  const reset = args.includes('--reset');
  const makeAdmin = args.includes('--admin');
  const username = args.find((arg) => !arg.startsWith('--'));

  if (!username || username.length > 100) {
    throw new Error(
      'Usage: npm run user:create -- <username> [--admin] [--reset]',
    );
  }

  const password = await promptHidden(`Password for "${username}": `);
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  }
  const confirm = await promptHidden('Confirm password: ');
  if (confirm !== password) {
    throw new Error('Passwords did not match.');
  }

  loadEnv();
  const conn = await connect(getConfig(), false);

  try {
    const passwordHash = await hashPassword(password);

    if (reset) {
      const [result] = await conn.query(
        'UPDATE users SET passwordHash = ? WHERE username = ?',
        [passwordHash, username],
      );
      if (result.affectedRows === 0) {
        throw new Error(`User "${username}" not found.`);
      }
      console.log(`Password updated for "${username}".`);
      return;
    }

    try {
      await conn.query(
        'INSERT INTO users (username, passwordHash, role) VALUES (?, ?, ?)',
        [username, passwordHash, makeAdmin ? 'admin' : 'user'],
      );
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new Error(
          `User "${username}" already exists. Use --reset to change the password.`,
        );
      }
      if (err.code === 'ER_NO_SUCH_TABLE') {
        throw new Error('The users table does not exist. Run "npm run db:migrate" first.');
      }
      throw err;
    }
    console.log(`Created ${makeAdmin ? 'admin' : 'user'} "${username}".`);
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  const parts = err.errors && err.errors.length > 0 ? err.errors : [err];
  console.error(
    `\n${parts.map((e) => [e.code, e.message].filter(Boolean).join(': ')).join('\n')}`,
  );
  process.exitCode = 1;
});
