const path = require('path');

module.exports = {
  port: process.env.PORT || 3000,
  dbFile: process.env.DB_FILE || path.join(__dirname, '..', 'characters.db'),
  publicDir: path.join(__dirname, '..', 'public'),
  jsonBodyLimit: '2mb',
  // SKIP_AUTH=true signs every request in as the seeded default user (admin)
  // so local dev/testing never sees the login screen. Never enable on a
  // server anyone else can reach.
  skipAuth: ['true', '1', 'yes'].includes(String(process.env.SKIP_AUTH || '').toLowerCase())
};
