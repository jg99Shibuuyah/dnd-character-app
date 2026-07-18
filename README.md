# D&D Character Ledger

A dynamic 5e character sheet with multiple saved profiles and user accounts,
backed by a local SQLite database. Runs entirely on your own machine — no
cloud, no external network calls.

📖 **Full documentation is in the [project wiki](https://github.com/jg99Shibuuyah/dnd-character-app/wiki)** — features, architecture, configuration, accounts, and backups.

## Install & run

Requires [Node.js](https://nodejs.org) **24 or newer** (a C++ toolchain is
needed to compile the `better-sqlite3` native module — see the wiki for
platform specifics), **or** [Docker](https://www.docker.com/) if you'd rather
not install Node.

### With Node.js

```bash
npm install       # server dependencies
npm run build     # install + build the React client into client/dist
npm start
```

For frontend development, run the server and the Vite dev server side by side
(the client proxies `/api` to the server):

```bash
SKIP_AUTH=true npm start   # API on :3000
npm run client:dev         # Vite on :5174 with hot reload
```

### With Docker

```bash
docker compose up -d
```

Either way, open **http://localhost:3000** and log in with the seeded local
account (`admin` / `testing`).

For per-platform setup (Windows/macOS/Linux), Docker details, environment
variables, and data backups, see the wiki:

- [Local Setup](https://github.com/jg99Shibuuyah/dnd-character-app/wiki/Local-Setup)
- [Docker Setup](https://github.com/jg99Shibuuyah/dnd-character-app/wiki/Docker-Setup)
- [Configuration](https://github.com/jg99Shibuuyah/dnd-character-app/wiki/Configuration)
- [Accounts and Data](https://github.com/jg99Shibuuyah/dnd-character-app/wiki/Accounts-and-Data)

## Technologies

- **Runtime:** [Node.js](https://nodejs.org) 24+
- **Server:** [Express](https://expressjs.com/) 4 (a JSON REST API; EJS renders
  only the `login`/`reset` pages)
- **Database:** [SQLite](https://www.sqlite.org/) via
  [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — a single
  `characters.db` file, no external database service
- **Frontend:** [React](https://react.dev/) 19 + [Vite](https://vitejs.dev/) in
  `client/`, built to static files (`client/dist`) that Express serves. Pure
  rules logic lives in `client/src/rules/` with unit tests (`npm run
  test:client`); builtin game data stays in `public/resources/`.
- **Packaging:** Docker (`Dockerfile` + `docker-compose.yml`) — the image builds
  the client, then runs the server

See [Architecture](https://github.com/jg99Shibuuyah/dnd-character-app/wiki/Architecture)
in the wiki for the code layout and REST API, and
[Features](https://github.com/jg99Shibuuyah/dnd-character-app/wiki/Features)
for what the sheet can do.
