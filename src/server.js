const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log(`\n  Character sheet running at http://localhost:${config.port}\n  Database file: ${config.dbFile}\n`);
});
