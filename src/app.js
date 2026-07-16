const path = require('path');
const express = require('express');
const config = require('./config');
const charactersRouter = require('./routes/characters.routes');
const classesRouter = require('./routes/classes.routes');
const speciesRouter = require('./routes/species.routes');
const subclassesRouter = require('./routes/subclasses.routes');
const subspeciesRouter = require('./routes/subspecies.routes');
const spellsRouter = require('./routes/spells.routes');
const authRouter = require('./routes/auth.routes');
const sessionsRouter = require('./routes/sessions.routes');
const { attachUser, requireAuthPage, requireAuthApi } = require('./middleware/auth');
const errorHandler = require('./middleware/error-handler');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.json({ limit: config.jsonBodyLimit }));
// index:false — otherwise public/index.html (the legacy monolith page) would
// shadow the modular EJS view rendered by the '/' route below.
app.use(express.static(config.publicDir, { index: false }));

app.use(attachUser);

// ---- Auth pages (the only pages that don't require a login) ----
app.get('/login', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('login');
});

app.get('/reset', (req, res) => {
  res.render('reset');
});

// ---- App pages — every render passes { user } for the sidebar footer ----
app.get('/', requireAuthPage, (req, res) => {
  res.render('index', { user: req.user });
});

// The import forms (formerly "Library").
app.get('/import', requireAuthPage, (req, res) => {
  res.render('import', { user: req.user });
});

// The rules reference + search (formerly "Notes").
app.get('/library', requireAuthPage, (req, res) => {
  res.render('library', { user: req.user });
});

// Game sessions: create/join campaigns; the creator is the DM.
app.get('/sessions', requireAuthPage, (req, res) => {
  res.render('sessions', { user: req.user });
});

app.use('/api/auth', authRouter);

// Everything below is per-user data or gameplay — sign-in required.
app.use('/api', requireAuthApi);
app.use('/api/characters', charactersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/classes', classesRouter);
app.use('/api/species', speciesRouter);
app.use('/api/subclasses', subclassesRouter);
app.use('/api/subspecies', subspeciesRouter);
app.use('/api/spells', spellsRouter);

app.use(errorHandler);

module.exports = app;
