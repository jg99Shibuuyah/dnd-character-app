const db = require('../db');

const statements = {
  listByUser: db.prepare(
    'SELECT id, name, data, updated_at FROM characters WHERE user_id = ? ORDER BY updated_at DESC'
  ),
  get: db.prepare('SELECT * FROM characters WHERE id = ?'),
  insert: db.prepare('INSERT INTO characters (name, data, user_id) VALUES (?, ?, ?)'),
  update: db.prepare(
    `UPDATE characters SET name = ?, data = ?, updated_at = datetime('now') WHERE id = ?`
  ),
  remove: db.prepare('DELETE FROM characters WHERE id = ?')
};

// Characters are always listed per owner; ownership checks for get/update/
// remove live in the controller, which needs the loaded row anyway.
function listByUser(userId) {
  return statements.listByUser.all(userId);
}

function findById(id) {
  return statements.get.get(id);
}

function create(name, data, userId) {
  const info = statements.insert.run(name, JSON.stringify(data), userId);
  return info.lastInsertRowid;
}

function update(id, name, data) {
  const result = statements.update.run(name, JSON.stringify(data), id);
  return result.changes > 0;
}

function remove(id) {
  const result = statements.remove.run(id);
  return result.changes > 0;
}

module.exports = { listByUser, findById, create, update, remove };
