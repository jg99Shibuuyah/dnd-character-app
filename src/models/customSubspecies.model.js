const db = require('../db');

// Imported subspecies (subraces), each attached to a parent species by name.
// Unique on (parent, name) so re-importing the same subspecies for the same
// species updates it in place, while the same subspecies name can exist under
// different parents. Mirrors custom_subclasses.
const statements = {
  list: db.prepare('SELECT id, parent, name, source, data FROM custom_subspecies ORDER BY parent, name'),
  upsert: db.prepare(
    `INSERT INTO custom_subspecies (parent, name, source, data) VALUES (?, ?, ?, ?)
     ON CONFLICT(parent, name) DO UPDATE SET source = excluded.source, data = excluded.data, updated_at = datetime('now')`
  ),
  idByPair: db.prepare('SELECT id FROM custom_subspecies WHERE parent = ? AND name = ?'),
  remove: db.prepare('DELETE FROM custom_subspecies WHERE id = ?')
};

function list() {
  return statements.list.all().map(r => ({
    id: r.id,
    parent: r.parent,
    name: r.name,
    source: r.source,
    data: JSON.parse(r.data)
  }));
}

function upsert(parent, name, source, data) {
  statements.upsert.run(parent, name, source, JSON.stringify(data));
  return statements.idByPair.get(parent, name).id;
}

function remove(id) {
  return statements.remove.run(id).changes > 0;
}

module.exports = { list, upsert, remove };
