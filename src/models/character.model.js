const db = require('../db');

const statements = {
  list: db.prepare('SELECT id, name, data, updated_at FROM characters ORDER BY updated_at DESC'),
  get: db.prepare('SELECT * FROM characters WHERE id = ?'),
  insert: db.prepare('INSERT INTO characters (name, data) VALUES (?, ?)'),
  update: db.prepare(
    `UPDATE characters SET name = ?, data = ?, updated_at = datetime('now') WHERE id = ?`
  ),
  remove: db.prepare('DELETE FROM characters WHERE id = ?')
};

function list() {
  return statements.list.all();
}

function findById(id) {
  return statements.get.get(id);
}

function create(name, data) {
  const info = statements.insert.run(name, JSON.stringify(data));
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

module.exports = { list, findById, create, update, remove };
