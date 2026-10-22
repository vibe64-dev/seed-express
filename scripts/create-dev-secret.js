'use strict';

// Creates the untracked development secret once and keeps an existing one.
// Development reads SESSION_SECRET first and falls back to this file;
// production never reads it.
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { DEV_SECRET_FILE } = require('../lib/config');

try {
  fs.writeFileSync(DEV_SECRET_FILE, crypto.randomBytes(32).toString('base64') + '\n', { flag: 'wx', mode: 0o600 });
  console.log(`Created ${path.basename(DEV_SECRET_FILE)}.`);
} catch (error) {
  if (error.code !== 'EEXIST') throw error;
  console.log(`Keeping ${path.basename(DEV_SECRET_FILE)}.`);
}
