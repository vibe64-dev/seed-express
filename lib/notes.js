'use strict';

const MAX_LENGTH = 280;
const RECENT_LIMIT = 20;

// Returns the trimmed note text, or an error message when it cannot be saved.
function validateNote(input) {
  const text = typeof input === 'string' ? input.trim() : '';
  if (!text) return { error: 'Write something first.' };
  if (text.length > MAX_LENGTH) return { error: `Keep notes to ${MAX_LENGTH} characters.` };
  return { text };
}

function addNote(db, text) {
  db.prepare('INSERT INTO notes (text) VALUES (?)').run(text);
}

function recentNotes(db) {
  return db.prepare('SELECT id, text, created_at FROM notes ORDER BY id DESC LIMIT ?').all(RECENT_LIMIT);
}

module.exports = { MAX_LENGTH, validateNote, addNote, recentNotes };
