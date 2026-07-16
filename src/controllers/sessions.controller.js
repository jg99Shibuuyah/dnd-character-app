const GameSession = require('../models/gameSession.model');
const Character = require('../models/character.model');

function characterSummary(row) {
  if (!row.character_id) return null;
  let parsed = {};
  try { parsed = JSON.parse(row.character_data); } catch (e) {}
  return {
    id: row.character_id,
    name: row.character_name,
    class: parsed.class || '',
    level: parsed.level || 1,
    race: parsed.race || ''
  };
}

// Sessions the signed-in user belongs to, with their role in each.
function list(req, res) {
  res.json(GameSession.listForUser(req.user.id).map(s => ({
    id: s.id,
    name: s.name,
    code: s.code,
    role: s.role,
    memberCount: s.member_count,
    createdAt: s.created_at
  })));
}

function create(req, res) {
  const name = (req.body && req.body.name || '').trim();
  if (!name) return res.status(400).json({ error: 'Session needs a name' });
  const id = GameSession.create(name, req.user.id); // creator becomes the DM
  res.json({ id });
}

function join(req, res) {
  const code = (req.body && req.body.code || '').trim().toUpperCase();
  const characterId = req.body && req.body.characterId;
  const session = code && GameSession.findByCode(code);
  if (!session) return res.status(404).json({ error: 'No session with that code' });
  if (GameSession.membership(session.id, req.user.id)) {
    return res.status(409).json({ error: 'You are already in that session' });
  }
  let charId = null;
  if (characterId) {
    const row = Character.findById(characterId);
    if (!row || row.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only bring your own character' });
    }
    charId = row.id;
  }
  GameSession.addMember(session.id, req.user.id, charId);
  res.json({ id: session.id });
}

// Member list. Players see only a summary of everyone's character (name /
// class / level / race); character sheet links (ids) are exposed to the DM
// and to each member for their own character. Full-sheet reads are enforced
// separately in characters.controller.get.
function detail(req, res) {
  const session = GameSession.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  const mine = GameSession.membership(session.id, req.user.id);
  if (!mine) return res.status(403).json({ error: 'You are not in that session' });
  const isDm = session.dm_user_id === req.user.id;
  const members = GameSession.members(session.id).map(m => {
    const character = characterSummary(m);
    if (character && !isDm && m.user_id !== req.user.id) delete character.id;
    return { username: m.username, role: m.role, isYou: m.user_id === req.user.id, character };
  });
  res.json({ id: session.id, name: session.name, code: session.code, role: mine.role, isDm, members });
}

// Change which of your characters is attached to the session.
function setCharacter(req, res) {
  const session = GameSession.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (!GameSession.membership(session.id, req.user.id)) {
    return res.status(403).json({ error: 'You are not in that session' });
  }
  const characterId = req.body && req.body.characterId;
  let charId = null;
  if (characterId) {
    const row = Character.findById(characterId);
    if (!row || row.user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only attach your own character' });
    }
    charId = row.id;
  }
  GameSession.setMemberCharacter(session.id, req.user.id, charId);
  res.json({ ok: true });
}

function leave(req, res) {
  const session = GameSession.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.dm_user_id === req.user.id) {
    return res.status(400).json({ error: 'The DM cannot leave — delete the session instead' });
  }
  GameSession.removeMember(session.id, req.user.id);
  res.json({ ok: true });
}

function remove(req, res) {
  const session = GameSession.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.dm_user_id !== req.user.id) {
    return res.status(403).json({ error: 'Only the DM can delete the session' });
  }
  GameSession.remove(session.id);
  res.json({ ok: true });
}

module.exports = { list, create, join, detail, setCharacter, leave, remove };
