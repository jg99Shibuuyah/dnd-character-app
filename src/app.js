const path = require('path');
const express = require('express');
const config = require('./config');
const charactersRouter = require('./routes/characters.routes');
const classesRouter = require('./routes/classes.routes');
const speciesRouter = require('./routes/species.routes');
const backgroundsRouter = require('./routes/backgrounds.routes');
const subclassesRouter = require('./routes/subclasses.routes');
const subspeciesRouter = require('./routes/subspecies.routes');
const spellsRouter = require('./routes/spells.routes');
const authRouter = require('./routes/auth.routes');
const sessionsRouter = require('./routes/sessions.routes');
const { attachUser, requireAuthPage, requireAuthApi } = require('./middleware/auth');
const errorHandler = require('./middleware/error-handler');

const app = express();

// EJS renders only the two pre-auth pages (login, reset). Every signed-in page
// is served by the React client in client/dist (see the SPA fallback below).
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

const clientDist = path.join(__dirname, '..', 'client', 'dist');

app.use(express.json({ limit: config.jsonBodyLimit }));
// Shared static assets used by both the React app and the login/reset pages:
// styles.css, /resources/* (builtin game data), and login.js.
app.use(express.static(config.publicDir, { index: false }));
// Built React assets (/assets/*, favicon, etc.). index:false so the SPA
// fallback route below controls when index.html is served (behind auth).
app.use(express.static(clientDist, { index: false }));

app.use(attachUser);

// ---- Auth pages (the only pages that don't require a login) ----
app.get('/login', (req, res) => {
  if (req.user) return res.redirect('/');
  res.render('login');
});

app.get('/reset', (req, res) => {
  res.render('reset');
});

app.use('/api/auth', authRouter);

// Everything below is per-user data or gameplay — sign-in required.
app.use('/api', requireAuthApi);
app.use('/api/characters', charactersRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/classes', classesRouter);
app.use('/api/species', speciesRouter);
app.use('/api/backgrounds', backgroundsRouter);
app.use('/api/subclasses', subclassesRouter);
app.use('/api/subspecies', subspeciesRouter);
app.use('/api/spells', spellsRouter);

// ---- React SPA fallback ----
// Any non-API GET that isn't login/reset serves the React shell; the client
// router (/, /import, /library, /sessions) takes over. requireAuthPage keeps
// the app behind sign-in and redirects to /login when signed out.
app.get('*', requireAuthPage, (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(clientDist, 'index.html'));
});

app.use(errorHandler);

module.exports = app;
