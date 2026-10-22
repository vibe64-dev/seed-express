'use strict';

const express = require('express');
const { MAX_LENGTH, validateNote, addNote, recentNotes } = require('../lib/notes');

function notesRouter(db) {
  const router = express.Router();

  router.get('/', (req, res) => {
    res.render('home', { notes: recentNotes(db), saved: req.query.saved === '1', error: null, text: '', maxLength: MAX_LENGTH });
  });

  router.post('/', (req, res) => {
    const { text, error } = validateNote(req.body.text);
    if (error) {
      res.status(422).render('home', { notes: recentNotes(db), saved: false, error, text: req.body.text || '', maxLength: MAX_LENGTH });
      return;
    }
    addNote(db, text);
    res.redirect(303, '/?saved=1');
  });

  return router;
}

module.exports = { notesRouter };
