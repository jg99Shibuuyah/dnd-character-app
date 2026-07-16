const db = require('../db');

const statements = {
  insert: db.prepare(
    `INSERT INTO auth_sessions (token_hash, user_id, expires_at) VALUES (?, ?, datetime('now', ?))`
  ),
  findValid: db.prepare(
    `SELECT * FROM auth_sessions WHERE token_hash = ? AND expires_at > datetime('now')`
  ),
  remove: db.prepare('DELETE FROM auth_sessions WHERE token_hash = ?'),
  removeForUser: db.prepare('DELETE FROM auth_sessions WHERE user_id = ?'),
  prune: db.prepare(`DELETE FROM auth_sessions WHERE expires_at <= datetime('now')`)
};

function create(tokenHash, userId, ttlDays) {
  statements.prune.run(); // opportunistic cleanup of expired rows
  statements.insert.run(tokenHash, userId, `+${ttlDays} days`);
}

function findValid(tokenHash) {
  return statements.findValid.get(tokenHash);
}

function remove(tokenHash) {
  statements.remove.run(tokenHash);
}

// Used after a password reset: sign the user out everywhere.
function removeForUser(userId) {
  statements.removeForUser.run(userId);
}

module.exports = { create, findValid, remove, removeForUser };
