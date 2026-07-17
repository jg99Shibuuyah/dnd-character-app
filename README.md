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
npm install
npm start
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
- **Server:** [Express](https://expressjs.com/) 4, with [EJS](https://ejs.co/)
  for server-rendered views
- **Database:** [SQLite](https://www.sqlite.org/) via
  [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) — a single
  `characters.db` file, no external database service
- **Frontend:** vanilla JavaScript (no framework) — `public/app.js` plus ES
  modules in `public/modules/`, talking to a REST API with `fetch()`
- **Packaging:** Docker (`Dockerfile` + `docker-compose.yml`)

See [Architecture](https://github.com/jg99Shibuuyah/dnd-character-app/wiki/Architecture)
in the wiki for the code layout and REST API, and
[Features](https://github.com/jg99Shibuuyah/dnd-character-app/wiki/Features)
for what the sheet can do.
