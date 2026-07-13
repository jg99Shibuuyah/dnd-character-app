const path = require('path');
const express = require('express');
const config = require('./config');
const charactersRouter = require('./routes/characters.routes');
const classesRouter = require('./routes/classes.routes');
const speciesRouter = require('./routes/species.routes');
const subclassesRouter = require('./routes/subclasses.routes');
const spellsRouter = require('./routes/spells.routes');
const errorHandler = require('./middleware/error-handler');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.json({ limit: config.jsonBodyLimit }));
// index:false — otherwise public/index.html (the legacy monolith page) would
// shadow the modular EJS view rendered by the '/' route below.
app.use(express.static(config.publicDir, { index: false }));

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/api/characters', charactersRouter);
app.use('/api/classes', classesRouter);
app.use('/api/species', speciesRouter);
app.use('/api/subclasses', subclassesRouter);
app.use('/api/spells', spellsRouter);

app.use(errorHandler);

module.exports = app;
