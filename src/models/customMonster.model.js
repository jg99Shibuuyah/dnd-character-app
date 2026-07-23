const db = require('../db');

// Imported/homebrew monsters live in their own table, shared across the app but
// surfaced only through the DM Screen library. `name` is unique: re-importing a
// monster with the same name updates it rather than creating a duplicate.
const statements = {
  list: db.prepare('SELECT id, name, source, data FROM custom_monsters ORDER BY name'),
  upsert: db.prepare(
    `INSERT INTO custom_monsters (name, source, data) VALUES (?, ?, ?)
     ON CONFLICT(name) DO UPDATE SET source = excluded.source, data = excluded.data, updated_at = datetime('now')`
  ),
  idByName: db.prepare('SELECT id FROM custom_monsters WHERE name = ?'),
  remove: db.prepare('DELETE FROM custom_monsters WHERE id = ?')
};

function list() {
  return statements.list.all().map(r => ({
    id: r.id, name: r.name, source: r.source, data: JSON.parse(r.data)
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
