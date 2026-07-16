const AuthSession = require('../models/authSession.model');
const User = require('../models/user.model');
const { hashToken } = require('../services/password');

const COOKIE_NAME = 'ledger_session';
const SESSION_TTL_DAYS = 30;

function parseCookies(header) {
  const out = {};
  if (!header) return out;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

// Resolves the login cookie to a user (or null) on every request.
function attachUser(req, res, next) {
  req.user = null;
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (token) {
    const session = AuthSession.findValid(hashToken(token));
    if (session) {
      const user = User.findById(session.user_id);
      if (user) req.user = { id: user.id, username: user.username, email: user.email };
    }
  }
  next();
}

function requireAuthPage(req, res, next) {
  if (!req.user) return res.redirect('/login');
  next();
}

function requireAuthApi(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Not signed in' });
  next();
}

module.exports = { attachUser, requireAuthPage, requireAuthApi, parseCookies, COOKIE_NAME, SESSION_TTL_DAYS };
