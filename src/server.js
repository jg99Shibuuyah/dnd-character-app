const app = require('./app');
const config = require('./config');
const { seedDefaultUser } = require('./services/seed');

seedDefaultUser();

app.listen(config.port, () => {
  console.log(`\n  Character sheet running at http://localhost:${config.port}\n  Database file: ${config.dbFile}\n`);
});
