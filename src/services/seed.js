const User = require('../models/user.model');
const { hashPassword } = require('../services/password');

// Local testing convenience: make sure a default account exists so the app is
// usable straight after boot. It also adopts any pre-multi-user (ownerless)
// characters, so a migrating single-user install keeps its roster under
// admin. Disable with SEED_DEFAULT_USER=false if the server is ever exposed
// beyond the local network.
const DEFAULT_PASSWORD = 'testing';
const DEFAULT_USERNAMES = ['admin', 'admin2'];

function seedDefaultUser() {
  if (process.env.SEED_DEFAULT_USER === 'false') return;
  for (const username of DEFAULT_USERNAMES) {
    if (User.findByUsername(username)) continue;
    const id = User.create(username, `${username}@localhost.local`, hashPassword(DEFAULT_PASSWORD));
    // Only the primary account adopts pre-multi-user (ownerless) characters.
    if (username === 'admin') User.adoptOrphanCharacters(id);
    console.log(`  Seeded default local account — username: ${username}, password: ${DEFAULT_PASSWORD}`);
  }
}

module.exports = { seedDefaultUser };
