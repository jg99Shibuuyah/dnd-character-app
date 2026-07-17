const Character = require('../models/character.model');
const GameSession = require('../models/gameSession.model');

const DEFAULT_NAME = 'Unnamed Adventurer';

// List the signed-in user's profiles (lightweight: id/name/class/level/race only)
function list(req, res) {
  const summaries = Character.listByUser(req.user.id).map(row => {
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

// Owners read their own characters; a DM may also read any character attached
// to a session they run, and a player may read a host character they've
// claimed from a session's loaner pool. Only owners and claimants may write
// (`editable` tells the sheet which mode to open in).
function get(req, res) {
  const row = Character.findById(req.params.id);
  if (!row) return res.status(404).json({ error: 'Character not found' });
  const owned = row.user_id === req.user.id;
  const borrowed = !owned && GameSession.borrowerCanEditCharacter(req.user.id, row.id);
  if (!owned && !borrowed && !GameSession.dmCanViewCharacter(req.user.id, row.id)) {
    return res.status(403).json({ error: 'This character belongs to another player' });
  }
  res.json({
    id: row.id, name: row.name, data: JSON.parse(row.data), updatedAt: row.updated_at,
    owned, editable: owned || borrowed
  });
}

function create(req, res) {
  const { name, data } = req.body;
  if (!data) return res.status(400).json({ error: 'Missing character data' });
  const id = Character.create(name || DEFAULT_NAME, data, req.user.id);
  res.json({ id });
}

function requireOwned(req, res) {
  const row = Character.findById(req.params.id);
  if (!row) {
    res.status(404).json({ error: 'Character not found' });
    return null;
  }
  if (row.user_id !== req.user.id) {
    res.status(403).json({ error: 'This character belongs to another player' });
    return null;
  }
  return row;
}

// Owner, or a player who claimed this character from a session's loaner pool.
function requireEditable(req, res) {
  const row = Character.findById(req.params.id);
  if (!row) {
    res.status(404).json({ error: 'Character not found' });
    return null;
  }
  if (row.user_id !== req.user.id && !GameSession.borrowerCanEditCharacter(req.user.id, row.id)) {
    res.status(403).json({ error: 'This character belongs to another player' });
    return null;
  }
  return row;
}

function update(req, res) {
  const { name, data } = req.body;
  if (!data) return res.status(400).json({ error: 'Missing character data' });
  const row = requireEditable(req, res);
  if (!row) return;
  Character.update(row.id, name || DEFAULT_NAME, data);
  res.json({ ok: true });
}

// The copy always lands in the requester's account — that's how a player
// keeps a host's loaner character after the session.
function duplicate(req, res) {
  const row = requireEditable(req, res);
  if (!row) return;
  const data = JSON.parse(row.data);
  const newName = (data.name || row.name) + ' (Copy)';
  data.name = newName;
  const id = Character.create(newName, data, req.user.id);
  res.json({ id });
}

function remove(req, res) {
  const row = requireOwned(req, res);
  if (!row) return;
  Character.remove(row.id);
  res.json({ ok: true });
}

module.exports = { list, get, create, update, duplicate, remove };
