const User = require('../models/user.model');
const AuthSession = require('../models/authSession.model');
const PasswordReset = require('../models/passwordReset.model');
const { hashPassword, verifyPassword, newToken, hashToken } = require('../services/password');
const { COOKIE_NAME, SESSION_TTL_DAYS } = require('../middleware/auth');

const USERNAME_RE = /^[A-Za-z0-9_-]{3,32}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

function startSession(res, userId) {
  const token = newToken();
  AuthSession.create(hashToken(token), userId, SESSION_TTL_DAYS);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60 * 1000
  });
}

function register(req, res) {
  const { username, email, password } = req.body || {};
  if (!USERNAME_RE.test(username || '')) {
    return res.status(400).json({ error: 'Username must be 3–32 letters, digits, dashes or underscores' });
  }
  if (!EMAIL_RE.test(email || '')) {
    return res.status(400).json({ error: 'A valid email is required (used for password recovery)' });
  }
  if (typeof password !== 'string' || password.length < MIN_PASSWORD) {
    return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD} characters` });
  }
  if (User.findByUsername(username)) return res.status(409).json({ error: 'That username is taken' });
  if (User.findByEmail(email)) return res.status(409).json({ error: 'That email is already registered' });

  const firstUser = User.count() === 0;
  const id = User.create(username, email, hashPassword(password));
  if (firstUser) User.adoptOrphanCharacters(id); // migrating single-user install keeps its characters
  startSession(res, id);
  res.json({ id, username });
}

function login(req, res) {
  const { username, password } = req.body || {};
  // Accept the username or the email in the same field.
  const user = User.findByUsername(username || '') || User.findByEmail(username || '');
  if (!user || !verifyPassword(password || '', user.password_hash)) {
    return res.status(401).json({ error: 'Wrong username or password' });
  }
  startSession(res, user.id);
  res.json({ id: user.id, username: user.username });
}

function logout(req, res) {
  const token = require('../middleware/auth').parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (token) AuthSession.remove(hashToken(token));
  res.clearCookie(COOKIE_NAME, { path: '/' });
  res.json({ ok: true });
}

function me(req, res) {
  if (!req.user) return res.status(401).json({ error: 'Not signed in' });
  res.json({ ...req.user, settings: User.getSettings(req.user.id) });
}

// Persist per-account preferences (theme, custom colors). Merges over whatever
// is stored so a partial update never clobbers unrelated keys.
function updateSettings(req, res) {
  const patch = req.body && req.body.settings;
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
    return res.status(400).json({ error: 'settings must be an object' });
  }
  const merged = { ...User.getSettings(req.user.id), ...patch };
  User.setSettings(req.user.id, merged);
  res.json({ settings: merged });
}

// No SMTP in a self-hosted install: the reset link is printed to the server
// console. Response is identical whether or not the account exists.
function forgot(req, res) {
  const { identifier } = req.body || {};
  const user = User.findByUsername(identifier || '') || User.findByEmail(identifier || '');
  if (user) {
    const token = newToken();
    PasswordReset.create(hashToken(token), user.id);
    const url = `${req.protocol}://${req.get('host')}/reset?token=${token}`;
    console.log(`[password reset] ${user.username} <${user.email}> — link valid 1 hour:\n  ${url}`);
  }
  res.json({ ok: true, message: 'If that account exists, a reset link was generated — check the server console.' });
}

function reset(req, res) {
  const { token, password } = req.body || {};
  if (typeof password !== 'string' || password.length < MIN_PASSWORD) {
    return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD} characters` });
  }
  const row = token && PasswordReset.findValid(hashToken(token));
  if (!row) return res.status(400).json({ error: 'Reset link is invalid or expired' });
  User.setPassword(row.user_id, hashPassword(password));
  PasswordReset.markUsed(hashToken(token));
  AuthSession.removeForUser(row.user_id); // sign out everywhere
  res.json({ ok: true });
}

module.exports = { register, login, logout, me, updateSettings, forgot, reset };
