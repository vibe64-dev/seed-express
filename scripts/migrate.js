'use strict';

// Applies pending schema migrations to the configured SQLite database.
const { databaseFile } = require('../lib/config');
const { openDatabase, migrate } = require('../lib/database');

const file = databaseFile();
const db = openDatabase(file);
const applied = migrate(db);
db.close();
console.log(applied ? `Applied ${applied} migration(s) to ${file}.` : `${file} is up to date.`);
