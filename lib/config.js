'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEV_SECRET_FILE = path.join(PROJECT_ROOT, '.dev-secret');
const DEV_DATABASE_FILE = path.join(PROJECT_ROOT, 'app.sqlite3');

// Reads the server's settings from the environment.
function loadConfig(env = process.env) {
  return {
    host: env.HOST || '127.0.0.1',
    port: Number(env.PORT || 3000),
    databaseFile: databaseFile(env),
    sessionSecret: sessionSecret(env)
  };
}

// DB_DATABASE names the SQLite file. Outside production a project-local,
// untracked file is used when it is not set.
function databaseFile(env = process.env) {
  if (env.DB_DATABASE) return path.resolve(PROJECT_ROOT, env.DB_DATABASE);
  if (env.NODE_ENV === 'production') throw new Error('DB_DATABASE must name the SQLite file in production.');
  return DEV_DATABASE_FILE;
}

// SESSION_SECRET signs cookies. Development falls back to the untracked
// .dev-secret file so open forms survive restarts; without either, a random
// per-process secret is used and open forms expire on restart.
function sessionSecret(env) {
  if (env.SESSION_SECRET) return env.SESSION_SECRET;
  if (env.NODE_ENV !== 'production') {
    try {
      return fs.readFileSync(DEV_SECRET_FILE, 'utf8').trim();
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  }
  console.warn('SESSION_SECRET is not set; using a per-process secret, so open forms expire on restart.');
  return crypto.randomBytes(32).toString('base64');
}

module.exports = { loadConfig, databaseFile, DEV_SECRET_FILE };
