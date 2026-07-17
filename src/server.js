const app = require('./app');
const config = require('./config');
const { seedDefaultUser } = require('./services/seed');

seedDefaultUser();

app.listen(config.port, () => {
  console.log(`\n  Character sheet running at http://localhost:${config.port}\n  Database file: ${config.dbFile}\n`);
  if (config.skipAuth) {
    console.log('  ⚠ SKIP_AUTH is on — every request runs as the "admin" account. Local use only.\n');
  }
});
