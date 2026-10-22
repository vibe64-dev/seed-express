'use strict';

// Drives the real HTTP server the way a loopback reverse proxy does: the
// Host header is the loopback address and the browser-facing address
// arrives in X-Forwarded-* headers.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { once } = require('node:events');
const { openDatabase, migrate } = require('../lib/database');
const { createApp } = require('../app');

const FORWARDED = {
  'x-forwarded-host': 'notes.example.test',
  'x-forwarded-proto': 'https',
  'x-forwarded-port': '443'
};

test('the notes form saves through the proxy with a CSRF token', async (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'seed-express-'));
  const db = openDatabase(path.join(directory, 'test.sqlite3'));
  migrate(db);
  const server = createApp({ db, sessionSecret: 'test-secret', log: false }).listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => {
    server.close();
    await once(server, 'close');
    db.close();
    fs.rmSync(directory, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${server.address().port}`;

  const health = await fetch(`${base}/health`);
  assert.equal(health.status, 200);

  const page = await fetch(`${base}/`, { headers: FORWARDED });
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.match(html, /No notes yet\./);
  const token = html.match(/name="_csrf" value="([^"]+)"/)[1];
  const cookie = page.headers.get('set-cookie');
  assert.match(cookie, /; Secure/, 'the forwarded https request gets a Secure cookie');
  const cookieHeader = cookie.split(';')[0];

  const form = (fields) => ({
    method: 'POST',
    redirect: 'manual',
    headers: { ...FORWARDED, cookie: cookieHeader, 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(fields).toString()
  });

  const rejected = await fetch(`${base}/`, form({ text: 'no token' }));
  assert.equal(rejected.status, 403);

  const invalid = await fetch(`${base}/`, form({ _csrf: token, text: '   ' }));
  assert.equal(invalid.status, 422);

  const saved = await fetch(`${base}/`, form({ _csrf: token, text: 'Hello from the proxy' }));
  assert.equal(saved.status, 303);
  assert.equal(saved.headers.get('location'), '/?saved=1');

  const after = await (await fetch(`${base}/?saved=1`, { headers: { ...FORWARDED, cookie: cookieHeader } })).text();
  assert.match(after, /Note saved\./);
  assert.match(after, /Hello from the proxy/);
  assert.doesNotMatch(after, /no token/);
});
