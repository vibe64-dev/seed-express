'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('node:path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { csrfProtection } = require('./lib/csrf');
const { notesRouter } = require('./routes/index');

function createApp({ db, sessionSecret, log = true }) {
  const app = express();

  // Trust only the loopback reverse proxy so req.protocol, req.host and
  // req.secure describe the browser-facing request.
  app.set('trust proxy', 'loopback');
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');

  app.get('/health', (req, res) => {
    res.type('text').send('ok');
  });

  if (log) app.use(logger('dev'));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser(sessionSecret));
  app.use(csrfProtection());

  app.use('/', notesRouter(db));

  app.use((req, res, next) => {
    next(createError(404));
  });

  app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });

  return app;
}

module.exports = { createApp };
