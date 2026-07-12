const db = require('../db');

// Imported/homebrew playable species, shared across every character (mirrors
// the custom_classes table). `name` is unique so re-importing updates in place.
const statements = {
  list: db.prepare('SELECT id, name, source, data FROM custom_species ORDER BY name'),
  upsert: db.prepare(
    `INSERT INTO custom_species (name, source, data) VALUES (?, ?, ?)
     ON CONFLICT(name) DO UPDATE SET source = excluded.source, data = excluded.data, updated_at = datetime('now')`
  ),
  idByName: db.prepare('SELECT id FROM custom_species WHERE name = ?'),
  remove: db.prepare('DELETE FROM custom_species WHERE id = ?')
};

function list() {
  return statements.list.all().map(r => ({
    id: r.id,
    name: r.name,
    source: r.source,
    data: JSON.parse(r.data)
  }));
}

function upsert(name, source, data) {
  statements.upsert.run(name, source, JSON.stringify(data));
  return statements.idByName.get(name).id;
}

function remove(id) {
  return statements.remove.run(id).changes > 0;
}

module.exports = { list, upsert, remove };
