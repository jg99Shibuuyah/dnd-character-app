const path = require('path');

module.exports = {
  port: process.env.PORT || 3000,
  dbFile: process.env.DB_FILE || path.join(__dirname, '..', 'characters.db'),
  publicDir: path.join(__dirname, '..', 'public'),
  jsonBodyLimit: '2mb'
};
