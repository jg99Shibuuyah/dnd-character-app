const CustomBackground = require('../models/customBackground.model');

const SOURCES = ['5E', '5.5E', 'Homebrew'];

function list(req, res) {
  res.json(CustomBackground.list());
}

function create(req, res) {
  const { name, source, data } = req.body;
  if (!name || !data) return res.status(400).json({ error: 'Missing background name or data' });
  const src = SOURCES.includes(source) ? source : 'Homebrew';
  const id = CustomBackground.upsert(String(name).trim(), src, data);
  res.json({ id });
}

function remove(req, res) {
  const removed = CustomBackground.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Background not found' });
  res.json({ ok: true });
}

module.exports = { list, create, remove };
