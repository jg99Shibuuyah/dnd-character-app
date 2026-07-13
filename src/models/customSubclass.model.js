const db = require('../db');

// Imported subclasses, each attached to a parent class by name. Unique on
// (parent, name) so re-importing the same subclass for the same class updates
// it in place, while the same subclass name can exist under different parents.
const statements = {
  list: db.prepare('SELECT id, parent, name, source, data FROM custom_subclasses ORDER BY parent, name'),
  upsert: db.prepare(
    `INSERT INTO custom_subclasses (parent, name, source, data) VALUES (?, ?, ?, ?)
     ON CONFLICT(parent, name) DO UPDATE SET source = excluded.source, data = excluded.data, updated_at = datetime('now')`
  ),
  idByPair: db.prepare('SELECT id FROM custom_subclasses WHERE parent = ? AND name = ?'),
  remove: db.prepare('DELETE FROM custom_subclasses WHERE id = ?')
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
