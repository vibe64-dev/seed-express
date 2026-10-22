'use strict';

const crypto = require('node:crypto');

const COOKIE = 'csrf';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

// Signed double-submit token: the token lives in a cookie signed with the
// session secret (cookie-parser) and must come back in the form's _csrf field.
function csrfProtection() {
  return function csrf(req, res, next) {
    let token = req.signedCookies[COOKIE];
    if (!token) {
      token = crypto.randomBytes(32).toString('base64url');
      res.cookie(COOKIE, token, { signed: true, httpOnly: true, sameSite: 'lax', secure: req.secure, path: '/' });
    }
    res.locals.csrfToken = token;
    if (SAFE_METHODS.has(req.method)) return next();
    const submitted = req.body && typeof req.body._csrf === 'string' ? req.body._csrf : '';
    if (req.signedCookies[COOKIE] && sameToken(submitted, req.signedCookies[COOKIE])) return next();
    const error = new Error('The form expired. Reload the page and try again.');
    error.status = 403;
    next(error);
  };
}

function sameToken(a, b) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

module.exports = { csrfProtection };
