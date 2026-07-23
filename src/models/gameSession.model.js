const db = require('../db');

const statements = {
  insert: db.prepare('INSERT INTO game_sessions (name, code, dm_user_id) VALUES (?, ?, ?)'),
  byId: db.prepare('SELECT * FROM game_sessions WHERE id = ?'),
  byCode: db.prepare('SELECT * FROM game_sessions WHERE code = ?'),
  remove: db.prepare('DELETE FROM game_sessions WHERE id = ?'),
  listForUser: db.prepare(`
    SELECT g.id, g.name, g.code, g.dm_user_id, g.created_at, m.role,
           (SELECT COUNT(*) FROM session_members WHERE session_id = g.id) AS member_count
    FROM game_sessions g
    JOIN session_members m ON m.session_id = g.id
    WHERE m.user_id = ?
    ORDER BY g.created_at DESC
  `),
  members: db.prepare(`
    SELECT m.user_id, m.role, m.character_id, u.username,
           c.name AS character_name, c.data AS character_data
    FROM session_members m
    JOIN users u ON u.id = m.user_id
    LEFT JOIN characters c ON c.id = m.character_id
    WHERE m.session_id = ?
    ORDER BY CASE m.role WHEN 'dm' THEN 0 ELSE 1 END, u.username COLLATE NOCASE
  `),
  membership: db.prepare('SELECT * FROM session_members WHERE session_id = ? AND user_id = ?'),
  addMember: db.prepare(
    'INSERT INTO session_members (session_id, user_id, character_id, role) VALUES (?, ?, ?, ?)'
  ),
  removeMember: db.prepare('DELETE FROM session_members WHERE session_id = ? AND user_id = ?'),
  setMemberCharacter: db.prepare(
    'UPDATE session_members SET character_id = ? WHERE session_id = ? AND user_id = ?'
  ),
  // A DM may read any character attached to a session they run.
  dmCanViewCharacter: db.prepare(`
    SELECT 1 FROM session_members m
    JOIN game_sessions g ON g.id = m.session_id
    WHERE m.character_id = ? AND g.dm_user_id = ?
    LIMIT 1
  `),
  // The host's loaner pool, with whoever currently has each character claimed.
  hostCharacters: db.prepare(`
    SELECT sc.character_id, c.name AS character_name, c.data AS character_data,
           m.user_id AS claimed_by_user_id, u.username AS claimed_by
    FROM session_characters sc
    JOIN characters c ON c.id = sc.character_id
    LEFT JOIN session_members m ON m.session_id = sc.session_id AND m.character_id = sc.character_id
    LEFT JOIN users u ON u.id = m.user_id
    WHERE sc.session_id = ?
    ORDER BY c.name COLLATE NOCASE
  `),
  isHostCharacter: db.prepare(
    'SELECT 1 FROM session_characters WHERE session_id = ? AND character_id = ? LIMIT 1'
  ),
  addHostCharacter: db.prepare(
    'INSERT OR IGNORE INTO session_characters (session_id, character_id) VALUES (?, ?)'
  ),
  removeHostCharacter: db.prepare(
    'DELETE FROM session_characters WHERE session_id = ? AND character_id = ?'
  ),
  claimant: db.prepare(
    'SELECT user_id FROM session_members WHERE session_id = ? AND character_id = ? LIMIT 1'
  ),
  releaseClaims: db.prepare(
    'UPDATE session_members SET character_id = NULL WHERE session_id = ? AND character_id = ?'
  ),
  // A player using a host character from the session pool may read AND edit it.
  borrowerCanEditCharacter: db.prepare(`
    SELECT 1 FROM session_members m
    JOIN session_characters sc ON sc.session_id = m.session_id AND sc.character_id = m.character_id
    WHERE m.user_id = ? AND m.character_id = ?
    LIMIT 1
  `),
  getNotes: db.prepare('SELECT dm_notes FROM game_sessions WHERE id = ?'),
  setNotes: db.prepare('UPDATE game_sessions SET dm_notes = ? WHERE id = ?'),
  getCombat: db.prepare('SELECT combat FROM game_sessions WHERE id = ?'),
  setCombat: db.prepare('UPDATE game_sessions SET combat = ? WHERE id = ?')
};

const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O/1/I/L lookalikes

function generateCode() {
  let code;
  do {
    code = Array.from({ length: 6 }, () =>
      CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]
    ).join('');
  } while (statements.byCode.get(code));
  return code;
}

const createWithDm = db.transaction((name, dmUserId) => {
  const code = generateCode();
  const info = statements.insert.run(name, code, dmUserId);
  statements.addMember.run(info.lastInsertRowid, dmUserId, null, 'dm');
  return info.lastInsertRowid;
});

function create(name, dmUserId) {
  return createWithDm(name, dmUserId);
}

function findById(id) {
  return statements.byId.get(id);
}

function findByCode(code) {
  return statements.byCode.get(code);
}

function listForUser(userId) {
  return statements.listForUser.all(userId);
}

function members(sessionId) {
  return statements.members.all(sessionId);
}

function membership(sessionId, userId) {
  return statements.membership.get(sessionId, userId);
}

function addMember(sessionId, userId, characterId) {
  statements.addMember.run(sessionId, userId, characterId, 'player');
}

function removeMember(sessionId, userId) {
  statements.removeMember.run(sessionId, userId);
}

function setMemberCharacter(sessionId, userId, characterId) {
  statements.setMemberCharacter.run(characterId, sessionId, userId);
}

function remove(id) {
  statements.remove.run(id);
}

function dmCanViewCharacter(dmUserId, characterId) {
  return !!statements.dmCanViewCharacter.get(characterId, dmUserId);
}

function hostCharacters(sessionId) {
  return statements.hostCharacters.all(sessionId);
}

function isHostCharacter(sessionId, characterId) {
  return !!statements.isHostCharacter.get(sessionId, characterId);
}

function addHostCharacter(sessionId, characterId) {
  statements.addHostCharacter.run(sessionId, characterId);
}

// Pulling a character from the pool also releases whoever was using it.
const removeHostCharacter = db.transaction((sessionId, characterId) => {
  statements.releaseClaims.run(sessionId, characterId);
  statements.removeHostCharacter.run(sessionId, characterId);
});

function claimant(sessionId, characterId) {
  const row = statements.claimant.get(sessionId, characterId);
  return row ? row.user_id : null;
}

function borrowerCanEditCharacter(userId, characterId) {
  return !!statements.borrowerCanEditCharacter.get(userId, characterId);
}

function getNotes(sessionId) {
  const row = statements.getNotes.get(sessionId);
  if (!row || !row.dm_notes) return [];
  try { return JSON.parse(row.dm_notes); } catch (e) { return []; }
}

function setNotes(sessionId, notes) {
  statements.setNotes.run(JSON.stringify(notes || []), sessionId);
}

function getCombat(sessionId) {
  const row = statements.getCombat.get(sessionId);
  const empty = { combatants: [], activeIndex: 0, round: 1 };
  if (!row || !row.combat) return empty;
  try { return { ...empty, ...JSON.parse(row.combat) }; } catch (e) { return empty; }
}

function setCombat(sessionId, combat) {
  statements.setCombat.run(JSON.stringify(combat || {}), sessionId);
}

module.exports = {
  create, findById, findByCode, listForUser, members, membership,
  addMember, removeMember, setMemberCharacter, remove, dmCanViewCharacter,
  hostCharacters, isHostCharacter, addHostCharacter, removeHostCharacter,
  claimant, borrowerCanEditCharacter,
  getNotes, setNotes, getCombat, setCombat
};
