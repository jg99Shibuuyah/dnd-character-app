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
  `)
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

module.exports = {
  create, findById, findByCode, listForUser, members, membership,
  addMember, removeMember, setMemberCharacter, remove, dmCanViewCharacter
};
