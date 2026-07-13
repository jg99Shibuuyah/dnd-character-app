const CustomSpell = require('../models/customSpell.model');

const SOURCES = ['5E', '5.5E', 'Homebrew'];

function list(req, res) {
  res.json(CustomSpell.list());
}

function create(req, res) {
  const { name, source, data } = req.body;
  if (!name || !data) return res.status(400).json({ error: 'Missing spell name or data' });
  const src = SOURCES.includes(source) ? source : 'Homebrew';
  const id = CustomSpell.upsert(String(name).trim(), src, data);
  res.json({ id });
}

function remove(req, res) {
  const removed = CustomSpell.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Spell not found' });
  res.json({ ok: true });
}

module.exports = { list, create, remove };
