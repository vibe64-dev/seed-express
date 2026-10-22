# Notes home

Visitors write short notes and see the most recent ones.

## Sources

- Main: `routes/index.js`
- `lib/notes.js`
- `lib/csrf.js`
- `views/home.ejs`
- `views/error.ejs`
- `views/partials/head.ejs`
- `views/partials/foot.ejs`
- `public/stylesheets/style.css`
- `test/notes.test.js`
- `test/http.test.js`

## Public contract

`GET /` shows the note form and up to twenty most recent notes, newest first,
or "No notes yet." when there are none.

`POST /` with a CSRF token and `text` saves a note of 1 to 280 characters after
trimming surrounding whitespace, then redirects (303) to `/?saved=1`, which
confirms "Note saved." Blank or over-long text re-renders the form with an
error (422) and saves nothing. A POST without a valid CSRF token is rejected
with 403.
