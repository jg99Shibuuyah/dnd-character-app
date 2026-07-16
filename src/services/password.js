const crypto = require('crypto');

// scrypt via node's crypto — no external dependency. Stored format:
// scrypt:N:r:p:<salt hex>:<hash hex>, so parameters can be raised later
// without invalidating existing hashes.
const PARAMS = { N: 16384, r: 8, p: 1 };
const KEYLEN = 64;

function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, KEYLEN, PARAMS);
  return `scrypt:${PARAMS.N}:${PARAMS.r}:${PARAMS.p}:${salt.toString('hex')}:${hash.toString('hex')}`;
}

function verifyPassword(password, stored) {
  try {
    const [scheme, N, r, p, saltHex, hashHex] = String(stored).split(':');
    if (scheme !== 'scrypt') return false;
    const expected = Buffer.from(hashHex, 'hex');
    const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length, {
      N: Number(N), r: Number(r), p: Number(p)
    });
    return crypto.timingSafeEqual(actual, expected);
  } catch (e) {
    return false;
  }
}

// Opaque random tokens (login sessions, password resets) are stored hashed so a
// leaked database file can't be replayed as a live credential.
function newToken() {
  return crypto.randomBytes(32).toString('hex');
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { hashPassword, verifyPassword, newToken, hashToken };
