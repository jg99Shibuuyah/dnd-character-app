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
- Every edit (ability scores, HP, inventory, spells, everything) autosaves
  to the database about half a second after you stop typing. The "Saving…
  / Saved" indicator on the profile bar tells you the state.
- All your characters live in one `characters.db` file — no accounts, no
  cloud, no external network calls.

## How it's built

- `server.js` — a small Express server with a REST API:
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
  other devices? Change `app.listen(PORT, ...)` in `server.js` to
  `app.listen(PORT, '0.0.0.0', ...)` and open the right port on your
  network/firewall. There's no authentication built in, so only do this
  on a network you trust.
- Want per-user accounts instead of a shared list of profiles? That would
  mean adding a `users` table, a login flow, and a `user_id` column on
  `characters` — a bigger change, happy to help if you want to go there.
