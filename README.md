# Express Basic starter

A small Express 5 application: a home page with one form that saves short
notes to SQLite and lists the newest ones. No accounts. Generated with
`express-generator` 4.16.1 (`--view=ejs`), moved to Express 5.3 and trimmed.

This repository's application branches:

- [basic](https://github.com/vibe64-dev/seed-express/tree/basic): notes app with SQLite.

## Run locally

Install Node.js 24 or newer (the database uses the built-in `node:sqlite`) and Git.

```sh
npm ci
npm run dev-secret
npm run migrate
npm run dev
```

Open http://127.0.0.1:3000. `npm run dev` restarts the server when source
changes; `npm start` runs it once. `HOST` and `PORT` choose the address
(default `127.0.0.1:3000`). `DB_DATABASE` names the SQLite file (default
`app.sqlite3`, untracked). `npm run dev-secret` writes an untracked
`.dev-secret` once; the server uses it to sign the form's CSRF cookie unless
`SESSION_SECRET` is set.

## Use through Genesis or Vibe64

See [starting the app](docs/colleague-usage/starting-app.md).

Install `genesis-compiler` and `genesis-stack`, run `genesis init` in an empty
Git repository, then choose `official:express/basic` with
`genesis templates apply`. Vibe64 offers the same starter when you add a
project. Genesis preserves the destination's history and authored project
context; ordinary Git commits or Vibe64 Save keep your new source.

The starter owns its dependencies and the setup, output, deployment and
verification commands in `genesis/stack.md`. Genesis describes those
requirements; Vibe64 runs the declared operations. Workspace setup installs
the locked dependencies, creates the development secret and applies
migrations before the web output starts. A host may supply the SQLite filename
through `DB_DATABASE`; the starter never invents one in source.

## Proxy and production

The server trusts `X-Forwarded-Host`, `X-Forwarded-Port` and
`X-Forwarded-Proto` only from a loopback reverse proxy, so secure cookies and
`req.protocol`/`req.host` follow the browser-facing address. Keep it bound to
loopback.

Production installs with `npm ci --omit=dev`, runs `npm run migrate`, then
serves `node bin/www`, which reads `HOST`/`PORT` and closes on `SIGTERM`. Set
`NODE_ENV=production`, `DB_DATABASE` (a persistent file outside the release
directory; required in production) and `SESSION_SECRET` (generate it with
`openssl rand -base64 32`; without it open forms expire on every restart)
through your deployment's environment facility.

## Check changes

```sh
npm test
```

`test/notes.test.js` covers validation, listing and migrations;
`test/http.test.js` drives the real HTTP server through forwarded proxy
headers, including the CSRF-protected form POST.

## Keep dependencies current

`package.json` pins every direct dependency exactly and `package-lock.json`
locks the rest. Review `npm outdated`, update with
`npm install --save-exact <package>@<version>`, run the tests, and commit both
files. Schema changes append a migration to `lib/database.js`.
