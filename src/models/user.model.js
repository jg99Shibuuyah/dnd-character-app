const db = require('../db');

const statements = {
  insert: db.prepare('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'),
  byId: db.prepare('SELECT * FROM users WHERE id = ?'),
  byUsername: db.prepare('SELECT * FROM users WHERE username = ?'),
  byEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  count: db.prepare('SELECT COUNT(*) AS n FROM users'),
  setPassword: db.prepare('UPDATE users SET password_hash = ? WHERE id = ?'),
  adoptOrphanCharacters: db.prepare('UPDATE characters SET user_id = ? WHERE user_id IS NULL'),
  getSettings: db.prepare('SELECT settings FROM users WHERE id = ?'),
  setSettings: db.prepare('UPDATE users SET settings = ? WHERE id = ?')
};

function create(username, email, passwordHash) {
  const info = statements.insert.run(username, email, passwordHash);
  return info.lastInsertRowid;
}

function findById(id) {
  return statements.byId.get(id);
}

function findByUsername(username) {
  return statements.byUsername.get(username);
}

function findByEmail(email) {
  return statements.byEmail.get(email);
}

function count() {
  return statements.count.get().n;
}

function setPassword(id, passwordHash) {
  statements.setPassword.run(passwordHash, id);
}

// Characters created before multi-user support have no owner; the first
// registered user inherits them so a migrating single-user install keeps
// its existing roster.
function adoptOrphanCharacters(userId) {
  statements.adoptOrphanCharacters.run(userId);
}

// Preferences JSON (or {} when unset / unparseable).
function getSettings(id) {
  const row = statements.getSettings.get(id);
  if (!row || !row.settings) return {};
  try { return JSON.parse(row.settings); } catch { return {}; }
}

function setSettings(id, settings) {
  statements.setSettings.run(JSON.stringify(settings || {}), id);
}

module.exports = { create, findById, findByUsername, findByEmail, count, setPassword, adoptOrphanCharacters, getSettings, setSettings };
