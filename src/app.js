const express = require('express');
const config = require('./config');
const charactersRouter = require('./routes/characters.routes');
const classesRouter = require('./routes/classes.routes');
const speciesRouter = require('./routes/species.routes');
const errorHandler = require('./middleware/error-handler');

const app = express();

app.use(express.json({ limit: config.jsonBodyLimit }));
app.use(express.static(config.publicDir));

app.use('/api/characters', charactersRouter);
app.use('/api/classes', classesRouter);
app.use('/api/species', speciesRouter);

app.use(errorHandler);

module.exports = app;
