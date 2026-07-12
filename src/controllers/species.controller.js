const CustomSpecies = require('../models/customSpecies.model');

const SOURCES = ['5E', '5.5E', 'Homebrew'];

function list(req, res) {
  res.json(CustomSpecies.list());
}

function create(req, res) {
  const { name, source, data } = req.body;
  if (!name || !data) return res.status(400).json({ error: 'Missing species name or data' });
  const src = SOURCES.includes(source) ? source : 'Homebrew';
  const id = CustomSpecies.upsert(String(name).trim(), src, data);
  res.json({ id });
}

function remove(req, res) {
  const removed = CustomSpecies.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Species not found' });
  res.json({ ok: true });
}

module.exports = { list, create, remove };
