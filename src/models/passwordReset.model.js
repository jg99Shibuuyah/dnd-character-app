const db = require('../db');

const statements = {
  insert: db.prepare(
    `INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, datetime('now', '+1 hour'))`
  ),
  findValid: db.prepare(
    `SELECT * FROM password_resets WHERE token_hash = ? AND used = 0 AND expires_at > datetime('now')`
  ),
  markUsed: db.prepare('UPDATE password_resets SET used = 1 WHERE token_hash = ?'),
  prune: db.prepare(`DELETE FROM password_resets WHERE expires_at <= datetime('now')`)
};

function create(tokenHash, userId) {
  statements.prune.run();
  statements.insert.run(tokenHash, userId);
}

function findValid(tokenHash) {
  return statements.findValid.get(tokenHash);
}

function markUsed(tokenHash) {
  statements.markUsed.run(tokenHash);
}

module.exports = { create, findValid, markUsed };
