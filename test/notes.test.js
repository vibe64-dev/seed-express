'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { openDatabase, migrate, assertMigrated } = require('../lib/database');
const { validateNote, addNote, recentNotes } = require('../lib/notes');

function memoryDatabase() {
  const db = openDatabase(':memory:');
  migrate(db);
  return db;
}

test('validateNote trims text and rejects blank or over-long notes', () => {
  assert.deepEqual(validateNote('  hello  '), { text: 'hello' });
  assert.ok(validateNote('   ').error);
  assert.ok(validateNote(undefined).error);
  assert.ok(validateNote('x'.repeat(281)).error);
  assert.deepEqual(validateNote('x'.repeat(280)), { text: 'x'.repeat(280) });
});

test('recentNotes lists the newest twenty notes first', () => {
  const db = memoryDatabase();
  for (let index = 1; index <= 25; index += 1) addNote(db, `note ${index}`);
  const notes = recentNotes(db);
  assert.equal(notes.length, 20);
  assert.equal(notes[0].text, 'note 25');
  assert.equal(notes[19].text, 'note 6');
});

test('migrate is repeatable and assertMigrated refuses an empty schema', () => {
  const db = openDatabase(':memory:');
  assert.throws(() => assertMigrated(db), /npm run migrate/);
  assert.equal(migrate(db), 1);
  assert.equal(migrate(db), 0);
  assertMigrated(db);
});
