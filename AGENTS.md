# App Agent Instructions

Use current project context and the official Express 5 documentation as the
source of truth: `https://expressjs.com/en/5x/api.html`. Templates use EJS
(`https://ejs.co/`); the database uses Node's built-in `node:sqlite`
(`https://nodejs.org/api/sqlite.html`).

Keep the CommonJS module system, `express.Router` modules in `routes/`, and the
middleware order in `app.js`: proxy trust, `/health`, logging, static files,
body parsing, cookies, CSRF, routers, 404, then the error handler. Every form
that posts includes `<input type="hidden" name="_csrf" value="<%= csrfToken %>">`.

Change the schema by appending a migration to `MIGRATIONS` in
`lib/database.js`; never edit an applied one. Add packages with an exact
version (`npm install --save-exact`) and commit `package-lock.json`.

Keep secrets out of source: `SESSION_SECRET` comes from the environment, or
in development from the untracked `.dev-secret`. Keep the server bound to the
supplied `HOST` and `PORT`.

Pages start with useful content and actions. Do not add a page header, welcome
heading, or standalone title unless the user asks for one. Keep changes scoped
to the user request and run `npm test`.
