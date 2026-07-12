const CustomClass = require('../models/customClass.model');

const SOURCES = ['5E', '5.5E', 'Homebrew'];

function list(req, res) {
  res.json(CustomClass.list());
}

function create(req, res) {
  const { name, source, data } = req.body;
  if (!name || !data) return res.status(400).json({ error: 'Missing class name or data' });
  const src = SOURCES.includes(source) ? source : 'Homebrew';
  const id = CustomClass.upsert(String(name).trim(), src, data);
  res.json({ id });
}

function remove(req, res) {
  const removed = CustomClass.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Class not found' });
  res.json({ ok: true });
}

module.exports = { list, create, remove };
