const CustomSubclass = require('../models/customSubclass.model');

const SOURCES = ['5E', '5.5E', 'Homebrew'];

function list(req, res) {
  res.json(CustomSubclass.list());
}

function create(req, res) {
  const { parent, name, source, data } = req.body;
  if (!parent || !name || !data) {
    return res.status(400).json({ error: 'Missing parent class, subclass name, or data' });
  }
  const src = SOURCES.includes(source) ? source : 'Homebrew';
  const id = CustomSubclass.upsert(String(parent).trim(), String(name).trim(), src, data);
  res.json({ id });
}

function remove(req, res) {
  const removed = CustomSubclass.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Subclass not found' });
  res.json({ ok: true });
}

module.exports = { list, create, remove };
