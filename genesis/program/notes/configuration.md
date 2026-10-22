# Server configuration

Start the Express server on the supplied address, open and migrate the
database, and sign cookies.

## Sources

- Main: `app.js`
- `bin/www`
- `lib/config.js`
- `lib/database.js`
- `scripts/migrate.js`
- `scripts/create-dev-secret.js`
- `package.json`

## Public contract

`bin/www` listens on `HOST` (default `127.0.0.1`) and `PORT` (default `3000`),
fails when the port is taken, refuses to start until the schema is migrated,
and closes on `SIGTERM`. `GET /health` answers `200` before logging, static
files, body parsing and CSRF checks.

The app trusts `X-Forwarded-Host`, `X-Forwarded-Port` and `X-Forwarded-Proto`
only from a loopback reverse proxy, so `req.protocol`, `req.host` and secure
cookies follow the browser-facing request.

`DB_DATABASE` names the SQLite file; without it a checkout outside production
uses the untracked `app.sqlite3`, and production refuses to start.
`npm run migrate` applies the numbered migrations in `lib/database.js`,
recording progress in `PRAGMA user_version`.

`SESSION_SECRET` signs the CSRF cookie. Outside production the untracked
`.dev-secret` that `npm run dev-secret` creates once is the fallback; without
either, a per-process secret is used and open forms expire on restart.
