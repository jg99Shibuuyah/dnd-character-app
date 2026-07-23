const CustomMonster = require('../models/customMonster.model');

const SOURCES = ['5E', '5E (legacy)', '5.5E', 'Homebrew'];

function list(req, res) {
  res.json(CustomMonster.list());
}

function create(req, res) {
  const { name, source, data } = req.body || {};
  if (!name || !data) return res.status(400).json({ error: 'Missing monster name or data' });
  const src = SOURCES.includes(source) ? source : 'Homebrew';
  const id = CustomMonster.upsert(String(name).trim(), src, data);
  res.json({ id });
}

function remove(req, res) {
  const removed = CustomMonster.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Monster not found' });
  res.json({ ok: true });
}

module.exports = { list, create, remove };
