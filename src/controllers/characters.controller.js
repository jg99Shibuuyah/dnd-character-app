const Character = require('../models/character.model');

const DEFAULT_NAME = 'Unnamed Adventurer';

// List all profiles (lightweight: id/name/class/level/race/updated_at only)
function list(req, res) {
  const summaries = Character.list().map(row => {
    let parsed = {};
    try { parsed = JSON.parse(row.data); } catch (e) {}
    return {
      id: row.id,
      name: row.name,
      class: parsed.class || '',
      level: parsed.level || 1,
      race: parsed.race || '',
      updatedAt: row.updated_at
    };
  });
  res.json(summaries);
}

function get(req, res) {
  const row = Character.findById(req.params.id);
  if (!row) return res.status(404).json({ error: 'Character not found' });
  res.json({ id: row.id, name: row.name, data: JSON.parse(row.data), updatedAt: row.updated_at });
}

function create(req, res) {
  const { name, data } = req.body;
  if (!data) return res.status(400).json({ error: 'Missing character data' });
  const id = Character.create(name || DEFAULT_NAME, data);
  res.json({ id });
}

function update(req, res) {
  const { name, data } = req.body;
  if (!data) return res.status(400).json({ error: 'Missing character data' });
  const updated = Character.update(req.params.id, name || DEFAULT_NAME, data);
  if (!updated) return res.status(404).json({ error: 'Character not found' });
  res.json({ ok: true });
}

function duplicate(req, res) {
  const row = Character.findById(req.params.id);
  if (!row) return res.status(404).json({ error: 'Character not found' });
  const data = JSON.parse(row.data);
  const newName = (data.name || row.name) + ' (Copy)';
  data.name = newName;
  const id = Character.create(newName, data);
  res.json({ id });
}

function remove(req, res) {
  const removed = Character.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Character not found' });
  res.json({ ok: true });
}

module.exports = { list, get, create, update, duplicate, remove };
