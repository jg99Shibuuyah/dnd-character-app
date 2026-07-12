const express = require('express');
const config = require('./config');
const charactersRouter = require('./routes/characters.routes');
const errorHandler = require('./middleware/error-handler');

const app = express();

app.use(express.json({ limit: config.jsonBodyLimit }));
app.use(express.static(config.publicDir));

app.use('/api/characters', charactersRouter);

app.use(errorHandler);

module.exports = app;
