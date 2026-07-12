# D&D Character Ledger — local server

A dynamic 5e character sheet with multiple saved profiles, backed by a
local SQLite database. Runs entirely on your own machine.

## Requirements

- [Node.js](https://nodejs.org) 18 or newer

## Setup

```bash
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

That's it — a file called `characters.db` will be created in this folder
the first time you run it. That file *is* your database; back it up or
copy it elsewhere if you want to keep a snapshot of your characters.

## What you get

- A profile bar at the top of the sheet: switch between characters, create
  a new one, duplicate one, or delete one.
- A cyberpunk terminal look: neon-on-black, monospace type, CRT scanlines.
- The sheet is organized into tabs: **Character** (abilities, saves, skills,
  combat, attacks), **Inventory** (currency and items), **Spells** (slots,
  spell library, known spells), **Features & Traits** (class features and
  personality), **Actions** — a read-only combat reference generated
  from the other tabs: your attacks, class abilities, which spells you can
  still cast given your remaining slots, usable items in your inventory,
  and the standard 5e actions — and **Settings**, where you edit identity,
  pick a class and level, and toggle skill proficiencies.
- Picking a class applies its saving-throw proficiencies and hit dice
  automatically; save and skill bonuses on the Character tab are computed
  (no checkboxes). Classes include the 5e SRD roster plus the homebrew
  **Jaeger** (from World Anvil), which comes with its full level 1–20
  feature reference and its Focus Arts / Finishers surfaced on the
  Actions tab.
- Multiclassing: add any number of classes in Settings, each with its own
  level. Total level drives the proficiency bonus, hit dice are pooled per
  die size (e.g. `5d8 + 2d6`), saving throws come from the primary (first)
  class per the PHB, ability-score prerequisites are checked per class,
  and a combined multiclass caster level is computed for the PHB slot
  table. The Features and Actions tabs show each class's features gated
  by that class's own level.
- Every edit (ability scores, HP, inventory, spells, everything) autosaves
  to the database about half a second after you stop typing. The "Saving…
  / Saved" indicator on the profile bar tells you the state.
- All your characters live in one `characters.db` file — no accounts, no
  cloud, no external network calls.

## How it's built

- `src/` — a small Express server, split into conventional layers:
  - `src/server.js` — entry point; starts the HTTP server
  - `src/app.js` — Express app wiring (middleware, static files, routes)
  - `src/config.js` — port, database file path, and other settings
  - `src/db.js` — SQLite connection and schema setup
  - `src/routes/characters.routes.js` — REST API route definitions
  - `src/controllers/characters.controller.js` — request/response handling
  - `src/models/character.model.js` — database queries
  - `src/middleware/error-handler.js` — JSON error responses
- The REST API:
  - `GET /api/characters` — list all saved characters (summary only)
  - `GET /api/characters/:id` — full data for one character
  - `POST /api/characters` — create a new character
  - `PUT /api/characters/:id` — update an existing character
  - `POST /api/characters/:id/duplicate` — clone a character
  - `DELETE /api/characters/:id` — delete a character
- `characters.db` — a SQLite database (via `better-sqlite3`), created
  automatically on first run. One table, `characters`, storing an id,
  name, and a JSON blob of the full character data.
- `public/index.html` — the character sheet itself. Pure HTML/CSS/JS,
  talks to the API above with `fetch()`.

## Extending it

- Want to run this on a home server so multiple people can reach it from
  other devices? Change `app.listen(config.port, ...)` in `src/server.js` to
  `app.listen(config.port, '0.0.0.0', ...)` and open the right port on your
  network/firewall. There's no authentication built in, so only do this
  on a network you trust.
- Want per-user accounts instead of a shared list of profiles? That would
  mean adding a `users` table, a login flow, and a `user_id` column on
  `characters` — a bigger change, happy to help if you want to go there.
