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

// Resolve a join/attach request to a character id, or null for "no character".
// Players may bring their own character, or claim an unclaimed one from the
// host's loaner pool (which grants them read/edit on it). Writes an error to
// `res` and returns undefined when the request isn't allowed.
function resolveCharacterChoice(req, res, session) {
  const { characterId, hostCharacterId } = req.body || {};
  if (hostCharacterId) {
    if (!GameSession.isHostCharacter(session.id, hostCharacterId)) {
      return void res.status(403).json({ error: 'That character is not offered by the host' });
    }
    const holder = GameSession.claimant(session.id, hostCharacterId);
    if (holder && holder !== req.user.id) {
      return void res.status(409).json({ error: 'Another player is already using that character' });
    }
    return Number(hostCharacterId);
  }
  if (characterId) {
    const row = Character.findById(characterId);
    if (!row || row.user_id !== req.user.id) {
      return void res.status(403).json({ error: 'You can only bring your own character' });
    }
    return row.id;
  }
  return null;
}

// Look up a session by join code before joining: name, DM, and which loaner
// characters are up for grabs. Knowing the code is what authorizes a join, so
// it also authorizes this summary.
function preview(req, res) {
  const code = (req.body && req.body.code || '').trim().toUpperCase();
  const session = code && GameSession.findByCode(code);
  if (!session) return res.status(404).json({ error: 'No session with that code' });
  const alreadyIn = !!GameSession.membership(session.id, req.user.id);
  const hostCharacters = GameSession.hostCharacters(session.id).map(row => ({
    ...characterSummary(row),
    available: !row.claimed_by_user_id
  }));
  res.json({ name: session.name, alreadyIn, hostCharacters });
}

function join(req, res) {
  const code = (req.body && req.body.code || '').trim().toUpperCase();
  const session = code && GameSession.findByCode(code);
  if (!session) return res.status(404).json({ error: 'No session with that code' });
  if (GameSession.membership(session.id, req.user.id)) {
    return res.status(409).json({ error: 'You are already in that session' });
  }
  const charId = resolveCharacterChoice(req, res, session);
  if (charId === undefined) return;
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
  const hostIds = new Set(GameSession.hostCharacters(session.id).map(r => r.character_id));
  const members = GameSession.members(session.id).map(m => {
    const character = characterSummary(m);
    if (character) character.borrowed = hostIds.has(character.id);
    if (character && !isDm && m.user_id !== req.user.id) delete character.id;
    return { username: m.username, role: m.role, isYou: m.user_id === req.user.id, character };
  });
  // The loaner pool: ids are visible to every member (needed to claim one),
  // but full-sheet reads stay gated in characters.controller.get.
  const hostCharacters = GameSession.hostCharacters(session.id).map(row => ({
    ...characterSummary(row),
    claimedBy: row.claimed_by || null,
    claimedByYou: row.claimed_by_user_id === req.user.id
  }));
  res.json({
    id: session.id, name: session.name, code: session.code,
    role: mine.role, isDm, members, hostCharacters
  });
}

// Change which character is attached to you in the session: one of your own,
// one claimed from the host's pool, or none.
function setCharacter(req, res) {
  const session = GameSession.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (!GameSession.membership(session.id, req.user.id)) {
    return res.status(403).json({ error: 'You are not in that session' });
  }
  const charId = resolveCharacterChoice(req, res, session);
  if (charId === undefined) return;
  GameSession.setMemberCharacter(session.id, req.user.id, charId);
  res.json({ ok: true });
}

// DM-only: offer one of your characters to players (add to the loaner pool).
function addHostCharacter(req, res) {
  const session = GameSession.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.dm_user_id !== req.user.id) {
    return res.status(403).json({ error: 'Only the DM can offer characters' });
  }
  const row = req.body && req.body.characterId && Character.findById(req.body.characterId);
  if (!row || row.user_id !== req.user.id) {
    return res.status(403).json({ error: 'You can only offer your own characters' });
  }
  GameSession.addHostCharacter(session.id, row.id);
  res.json({ ok: true });
}

// DM-only: withdraw a character from the pool (releases any player using it).
function removeHostCharacter(req, res) {
  const session = GameSession.findById(req.params.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.dm_user_id !== req.user.id) {
    return res.status(403).json({ error: 'Only the DM can withdraw characters' });
  }
  GameSession.removeHostCharacter(session.id, Number(req.params.characterId));
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

module.exports = {
  list, create, preview, join, detail, setCharacter, leave, remove,
  addHostCharacter, removeHostCharacter
};
