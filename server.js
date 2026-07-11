const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ---- Database setup ----
const db = new Database(path.join(__dirname, 'characters.db'));
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    data TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// ---- API routes ----

// List all profiles (lightweight: id/name/class/level/updated_at only)
app.get('/api/characters', (req, res) => {
  const rows = db.prepare('SELECT id, name, data, updated_at FROM characters ORDER BY updated_at DESC').all();
  const summaries = rows.map(r => {
    let parsed = {};
    try { parsed = JSON.parse(r.data); } catch (e) {}
    return {
      id: r.id,
      name: r.name,
      class: parsed.class || '',
      level: parsed.level || 1,
      race: parsed.race || '',
      updatedAt: r.updated_at
    };
  });
  res.json(summaries);
});

// Get a single full character
app.get('/api/characters/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM characters WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Character not found' });
  res.json({ id: row.id, name: row.name, data: JSON.parse(row.data), updatedAt: row.updated_at });
});

// Create a new character
app.post('/api/characters', (req, res) => {
  const { name, data } = req.body;
  if (!data) return res.status(400).json({ error: 'Missing character data' });
  const info = db.prepare('INSERT INTO characters (name, data) VALUES (?, ?)')
    .run(name || 'Unnamed Adventurer', JSON.stringify(data));
  res.json({ id: info.lastInsertRowid });
});

// Update an existing character
app.put('/api/characters/:id', (req, res) => {
  const { name, data } = req.body;
  if (!data) return res.status(400).json({ error: 'Missing character data' });
  const result = db.prepare(
    `UPDATE characters SET name = ?, data = ?, updated_at = datetime('now') WHERE id = ?`
  ).run(name || 'Unnamed Adventurer', JSON.stringify(data), req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Character not found' });
  res.json({ ok: true });
});

// Duplicate a character
app.post('/api/characters/:id/duplicate', (req, res) => {
  const row = db.prepare('SELECT * FROM characters WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Character not found' });
  const data = JSON.parse(row.data);
  const newName = (data.name || row.name) + ' (Copy)';
  data.name = newName;
  const info = db.prepare('INSERT INTO characters (name, data) VALUES (?, ?)')
    .run(newName, JSON.stringify(data));
  res.json({ id: info.lastInsertRowid });
});

// Delete a character
app.delete('/api/characters/:id', (req, res) => {
  const result = db.prepare('DELETE FROM characters WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Character not found' });
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`\n  Character sheet running at http://localhost:${PORT}\n  Database file: ${path.join(__dirname, 'characters.db')}\n`);
});
