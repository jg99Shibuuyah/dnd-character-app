# D&D Character Ledger — local server

A dynamic 5e character sheet with multiple saved profiles, backed by a
local SQLite database. Runs entirely on your own machine.

## Requirements

- [Node.js](https://nodejs.org) 24 or newer — **or** [Docker](https://www.docker.com/) (see [Running with Docker](#running-with-docker) below, no Node install needed)

## Install & run

```bash
npm install
npm start
```

Then open **http://localhost:3000** in your browser.

That's it — a file called `characters.db` will be created in this folder
the first time you run it. That file *is* your database; back it up or
copy it elsewhere if you want to keep a snapshot of your characters.

These environment variables are recognized (all optional):

| Variable    | Default              | Purpose                       |
|-------------|----------------------|-------------------------------|
| `PORT`      | `3000`               | HTTP port the server binds to |
| `DB_FILE`   | `./characters.db`    | Path to the SQLite database   |
| `SKIP_AUTH` | `false`              | `true` skips the sign-in screen: every request runs as the seeded `admin` account (`npm run start:noauth`). Local use only — never on a shared server |

### Platform-specific setup

#### Windows

1. **Install Node.js** 24+ from [nodejs.org](https://nodejs.org) (pick the LTS version)
   - During installation, check the box: *"Automatically install the necessary tools needed for Native Modules"*
2. **Open PowerShell or Command Prompt** and navigate to the project folder:
   ```powershell
   cd path\to\dnd-character-app
   npm install
   npm start
   ```
3. Open **http://localhost:3000** in your browser

> If `npm install` fails with a C++ compilation error, install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) and select the *"Desktop development with C++"* workload.

#### macOS

1. **Install Xcode command-line tools**:
   ```bash
   xcode-select --install
   ```
2. **Install Node.js** 24+ via Homebrew (if not already installed):
   ```bash
   brew install node
   ```
3. **Navigate to the project folder and start:**
   ```bash
   cd path/to/dnd-character-app
   npm install
   npm start
   ```
4. Open **http://localhost:3000** in your browser

#### Linux (Ubuntu/Debian)

1. **Install build dependencies**:
   ```bash
   sudo apt update
   sudo apt install build-essential python3 git
   ```
2. **Install Node.js** 24+:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
   sudo apt install nodejs
   ```
3. **Navigate to the project folder and start:**
   ```bash
   cd path/to/dnd-character-app
   npm install
   npm start
   ```
4. Open **http://localhost:3000** in your browser

> For other Linux distributions, ensure you have a C++ compiler (`g++`), Python 3, and Node.js 24+ installed, then run `npm install && npm start`.

## Running with Docker

If you'd rather not install Node.js (or the C++ build tools that
`better-sqlite3` needs), the included `Dockerfile` and
`docker-compose.yml` run the whole thing in a container. You only need
[Docker](https://docs.docker.com/get-docker/) (Docker Desktop on
Windows/macOS, or Docker Engine with the compose plugin on Linux).

### With Docker Compose (recommended)

```bash
docker compose up -d
```

Then open **http://localhost:3000**. The database is stored in a named
Docker volume (`dnd-data`), so your characters survive rebuilds and
container restarts.

Useful commands:

```bash
docker compose logs -f     # watch server logs
docker compose down        # stop (data is kept in the volume)
docker compose up -d --build   # rebuild after pulling new code
```

To use a different host port, edit the `ports` mapping in
`docker-compose.yml` (e.g. `"8080:3000"`).

### With plain `docker`

```bash
docker build -t dnd-character-app .
docker run -d --name dnd-character-app \
  -p 3000:3000 \
  -v dnd-data:/data \
  --restart unless-stopped \
  dnd-character-app
```

The image sets `DB_FILE=/data/characters.db`, so mounting a volume (or a
host folder) at `/data` is what persists your characters. To keep the
database in a folder on your machine instead of a named volume, use
`-v /path/on/your/machine:/data`.

### Backing up / moving your data

The database is the single file `characters.db` inside the `/data`
volume. To copy it out of a running container:

```bash
docker compose cp app:/data/characters.db ./characters-backup.db
```

## What you get

- A profile bar at the top of the sheet: switch between characters, create
  a new one, duplicate one, or delete one.
- A cyberpunk terminal look: neon-on-black, monospace type, CRT scanlines.
- The sheet is organized into tabs: **Character** (abilities, saves, skills,
  combat, attacks), **Inventory & Equipment** (currency, items, and equipped
  gear together), **Spells** (slots, spell library, known spells),
  **Features & Traits** (class features and personality), **Actions** — a
  read-only combat reference generated
  from the other tabs: your attacks, class abilities, which spells you can
  still cast given your remaining slots, usable items in your inventory,
  and the standard 5e actions — **Settings**, where you edit identity, pick a
  species, class(es) and level(s), and toggle skill proficiencies, and
  **Library**, where you import homebrew/official classes and species.
- Equipment tab: gear cards with a name, description, and an **Equipped**
  toggle. Everything added here is listed in your Inventory automatically
  (read-only rows tagged Equipped/Packed — click one to jump to the
  Equipment tab), and usable gear (potions, wands, scrolls…) shows up
  under Actions → Usable Items. Optional effect fields per item feed the rest of the sheet while
  the item is equipped: an attack line (to-hit + damage) appears in the
  Character tab's attack panel and on the Actions tab; ability-score
  effects (`+2` bonus or `=19` set-score, à la Gauntlets of Ogre Power)
  flow into every derived stat — modifiers, saves, skills, initiative —
  with the badge glowing green/red and a tooltip showing base vs. gear;
  per-skill bonuses (e.g. Cloak of Elvenkind, Stealth +2) add to skill
  totals; and granted spells show up under Known Spells and Actions →
  Spellcasting tagged with the item that grants them. Unequip and every
  effect disappears instantly; your typed base scores are never modified.
- Picking a class applies its saving-throw proficiencies and hit dice
  automatically; save and skill bonuses on the Character tab are computed
  (no checkboxes). Classes include the 5e SRD roster plus the homebrew
  **Jaeger** (from World Anvil), which comes with its full level 1–20
  feature reference and its Focus Arts / Finishers surfaced on the
  Actions tab.
- Multiclassing: add any number of classes in Settings, each with its own
  level. Total level drives the proficiency bonus, hit dice are pooled per
  die size (e.g. `5d8 + 2d6`), saving throws come from the primary (first)
  class per the PHB, and ability-score prerequisites are checked per class.
  Three things auto-fill from the class list:
  - **Spell slots** — the Spells tab fills leveled slots from the PHB tables
    (full/half single-class, or the combined multiclass caster level when you
    mix casters), with Warlock **Pact Magic** slots tracked on their own row.
    Spent slots are preserved when levels change; a toggle switches to manual
    entry if you'd rather set them by hand.
  - **Actions** — the Actions tab lists each class's active abilities
    (reactions, bonus actions, limited-use features) across the whole
    multiclass, with use/cost badges.
  - **Class features** — the Features & Traits tab shows every class's
    features gated by that class's own level.
- Library tab: a dedicated page for importing homebrew or official content.
  - **Import Class** — the same fields as the built-in Jaeger (hit die, saves,
    skills, subclasses, spellcasting, and level-by-level features) plus an
    advanced "paste JSON" option. Imported classes appear in the class picker
    on the Settings tab.
  - **Import Species** — add a playable species / lineage (size, walk speed,
    darkvision, ability-score summary, languages, and traits), also with a
    "paste JSON" option. Imported species appear in the **Species** picker on
    the Settings tab; picking one applies its speed and lists its traits on the
    Features & Traits tab. A handful of core 5E species ship built in.
  - **Import Subclass** — attach a subclass to any existing **parent class**
    (built-in or imported) with its own level-gated features. It becomes
    selectable per class in the Classes & Levels picker, and its features show
    on the Features & Traits and Actions tabs, gated by your class level.
  - Classes, species, and subclasses are tagged by source — **5E**, **5.5E**,
    or **Homebrew** — and stored server-side (in `custom_classes`,
    `custom_species`, and `custom_subclasses` tables) so they're shared across
    every character and survive reloads. The class picker also has a source
    filter.
- Every edit (ability scores, HP, inventory, spells, everything) autosaves
  to the database about half a second after you stop typing. The "Saving…
  / Saved" indicator on the profile bar tells you the state.
- All your characters live in one `characters.db` file — no accounts, no
  cloud, no external network calls.

## How it's built

- `src/` — a small Express server, split into conventional layers:
  - `src/server.js` — entry point; starts the HTTP server
  - `src/app.js` — Express app wiring (middleware, static files, views, routes)
  - `src/config.js` — port, database file path, and other settings
  - `src/db.js` — SQLite connection and schema setup
  - `src/routes/*.routes.js` — route definitions (characters, classes, species, subclasses)
  - `src/controllers/*.controller.js` — request/response handling
  - `src/models/*.model.js` — database queries (character, customClass, customSpecies, customSubclass)
  - `src/middleware/error-handler.js` — JSON error responses
  - `src/views/index.html` — the server-rendered character sheet view
- `public/` — static browser assets served by Express:
  - `public/styles.css` — page styling
  - `public/app.js` — client-side logic for the sheet
- The REST API:
  - `GET /api/characters` — list all saved characters (summary only)
  - `GET /api/characters/:id` — full data for one character
  - `POST /api/characters` — create a new character
  - `PUT /api/characters/:id` — update an existing character
  - `POST /api/characters/:id/duplicate` — clone a character
  - `DELETE /api/characters/:id` — delete a character
  - `GET /api/classes` — list imported (custom) classes
  - `POST /api/classes` — import/update a class by name (upsert)
  - `DELETE /api/classes/:id` — remove an imported class
  - `GET /api/species` — list imported (custom) species
  - `POST /api/species` — import/update a species by name (upsert)
  - `DELETE /api/species/:id` — remove an imported species
  - `GET /api/subclasses` — list imported (custom) subclasses
  - `POST /api/subclasses` — import/update a subclass by (parent, name) (upsert)
  - `DELETE /api/subclasses/:id` — remove an imported subclass
- `characters.db` — a SQLite database (via `better-sqlite3`), created
  automatically on first run. A `characters` table stores an id, name, and a
  JSON blob of the full character data; `custom_classes`, `custom_species`,
  and `custom_subclasses` tables store imported content (source tag + JSON
  definition, keyed by unique name — subclasses by unique parent+name).
- The main UI is rendered from `src/views/index.html` and talks to the API
  above with `fetch()`.

## Extending it

- Want to run this on a home server so multiple people can reach it from
  other devices? Change `app.listen(config.port, ...)` in `src/server.js` to
  `app.listen(config.port, '0.0.0.0', ...)` and open the right port on your
  network/firewall. There's no authentication built in, so only do this
  on a network you trust.
- Want per-user accounts instead of a shared list of profiles? That would
  mean adding a `users` table, a login flow, and a `user_id` column on
  `characters` — a bigger change, happy to help if you want to go there.
