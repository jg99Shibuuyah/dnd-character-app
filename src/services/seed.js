const User = require('../models/user.model');
const { hashPassword } = require('../services/password');

// Local testing convenience: make sure a default account exists so the app is
// usable straight after boot. It also adopts any pre-multi-user (ownerless)
// characters, so a migrating single-user install keeps its roster under
// admin. Disable with SEED_DEFAULT_USER=false if the server is ever exposed
// beyond the local network.
const DEFAULT_USERNAME = 'admin';
const DEFAULT_PASSWORD = 'testing';

function seedDefaultUser() {
  if (process.env.SEED_DEFAULT_USER === 'false') return;
  if (User.findByUsername(DEFAULT_USERNAME)) return;
  const id = User.create(DEFAULT_USERNAME, 'admin@localhost.local', hashPassword(DEFAULT_PASSWORD));
  User.adoptOrphanCharacters(id);
  console.log(`  Seeded default local account — username: ${DEFAULT_USERNAME}, password: ${DEFAULT_PASSWORD}`);
}

module.exports = { seedDefaultUser };
