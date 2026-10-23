# SQL Migrations

`../DatabaseSchema.sql` is the starting database. This folder holds every change made **after** it.

## Running

```
npm run db:migrate   # create or upgrade the database
npm run db:status    # list applied / pending migrations
```

Connection settings come from `.env` (`DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, optional `DB_PORT`). The database is created if it doesn't exist.

- **Fresh database:** runs `DatabaseSchema.sql`, then records every file in this folder as applied (the baseline already includes them).
- **Existing database:** runs only the files not yet recorded in `schemaMigrations`, in order.

## Adding a change

1. Create the next numbered file: `001_addSomething.sql`, `002_...`, and so on. The number decides the order, and numbers can't repeat.
2. Put only the change in it (`ALTER TABLE ...`), keeping each file small and single-purpose. MySQL commits DDL immediately, so a file that fails halfway can't be rolled back.
3. Update `../DatabaseSchema.sql` so it shows the full latest schema. Fresh databases are built from it, so if you skip this step they will be missing your change.
4. Run `npm run db:migrate`.

## Rules

- Never edit a migration that has been applied to any database. Add a new one instead.
- Use `npm run db:migrate` rather than running `DatabaseSchema.sql` by hand once migrations exist. A hand-run baseline isn't recorded, so existing migration files would be applied a second time.
- Table names are camelCase and MySQL on Linux is case-sensitive, so keep the exact casing in every query.
