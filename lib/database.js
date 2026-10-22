'use strict';

const { DatabaseSync } = require('node:sqlite');

// Each entry upgrades the schema by one version; PRAGMA user_version records
// how many have been applied. Append new migrations, never edit applied ones.
const MIGRATIONS = [
  `CREATE TABLE notes (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     text TEXT NOT NULL CHECK (length(text) BETWEEN 1 AND 280),
     created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
   )`
];

function openDatabase(file) {
  const db = new DatabaseSync(file, { timeout: 5000 });
  db.exec('PRAGMA foreign_keys = ON');
  if (file !== ':memory:') db.exec('PRAGMA journal_mode = WAL');
  return db;
}

function migrate(db) {
  const { user_version: current } = db.prepare('PRAGMA user_version').get();
  for (let version = current; version < MIGRATIONS.length; version += 1) {
    db.exec('BEGIN');
    try {
      db.exec(MIGRATIONS[version]);
      db.exec(`PRAGMA user_version = ${version + 1}`);
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  }
  return MIGRATIONS.length - current;
}

function assertMigrated(db) {
  const { user_version: current } = db.prepare('PRAGMA user_version').get();
  if (current !== MIGRATIONS.length) {
    throw new Error(`Database schema is at version ${current} of ${MIGRATIONS.length}; run \`npm run migrate\`.`);
  }
}

module.exports = { openDatabase, migrate, assertMigrated };
