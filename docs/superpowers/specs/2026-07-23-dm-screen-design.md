# DM Screen — Design Spec

**Date:** 2026-07-23
**Status:** Approved, pending implementation plan
**Branch context:** `react-refactor`

## Summary

Give the DM of a session a dedicated screen, opened from the Sessions page, that
combines four tools: a reference/library search that also finds **monsters**
(monsters appear only here, never on the public Library), **snapshots** of the
party's character sheets (frozen at open, refreshable), a **turn-order tracker**
for running combat, and a persisted per-session **notepad** modeled on the
character Journal tab.

Supporting this requires a new server-side monster model with its own import
flow, and per-session storage for DM notes and combat state.

## Goals

- The DM opens a screen from within a session that behaves like the Library and
  the character sheet combined.
- The DM can open read-only snapshots of each attached character showing the
  main tab: ability scores + derived stats + combat block. Snapshots load frozen
  at open with a Refresh button that re-fetches and flags any changes.
- The DM can look up monsters through this screen's library. Monsters are
  lookup-restricted to the DM Screen; they never surface on the public Library.
- Anyone can create/import monsters (a new model + import form).
- The DM has a free-form, persisted turn-order / initiative tracker for running
  combat, reached from a clear, prominent **Turn Order** button. Combatants carry
  interactive legendary-action and resource counters.
- The DM has a freeform, persisted notepad scoped to the session.

## Non-Goals (YAGNI)

- No editing of character snapshots from the DM Screen (read-only).
- No sharing of monsters, notes, or the tracker with players (all DM-only).
- No auto-live snapshots — snapshots are frozen at open and updated only by the
  Refresh button.
- No auto-rolled initiative or automated monster AI — the tracker is free-form
  (the DM types combatants), though a monster statblock can seed a combatant.

## Part A — Monster model & import

### Storage

New table `custom_monsters`, mirroring `custom_spells` exactly:

```sql
CREATE TABLE IF NOT EXISTS custom_monsters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL DEFAULT 'Homebrew',
  data TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

Added to the `db.exec(...)` block in `src/db.js`. `name` is unique so
re-importing a monster with the same name updates rather than duplicates
(same convention as spells).

Model `src/models/customMonster.model.js` with `list() / upsert(name, source,
data) / remove(id)`, copied from `customSpell.model.js`.

Controller `src/controllers/monsters.controller.js` and route
`src/routes/monsters.routes.js` exposing:

- `GET /api/monsters` — list (used by the registry / DM library).
- `POST /api/monsters` — upsert (auth required, like other imports).
- `DELETE /api/monsters/:id` — remove.

Registered in `src/app.js` alongside the other content routes.

### `data` shape

The monster stat block extends the companion stat shape already used by
`companionStatsHtml` in `client/src/rules/notes-index.js`, plus monster-only
fields:

```
{
  size,                 // "Gargantuan"
  type,                 // "Dragon (Metallic)"
  alignment,            // "Chaotic Good"
  ac, acNote,           // 19, "natural armor"
  hpMax, hpFormula,     // 184, "16d12 + 80"
  speed,                // "40 ft., climb 40 ft., fly 80 ft."
  abilities: { str, dex, con, int, wis, cha },
  saves,                // "Dex +2, Con +9, Wis +6, Cha +8"
  skills,               // "Deception +8, Perception +11, Stealth +2"
  resistances,          // free text
  immunities,           // "Acid" (damage immunities)
  vulnerabilities,
  conditionImmunities,
  senses,               // "Blindsight 60 ft., Darkvision 120 ft., PP 21"
  languages,            // "Common, Draconic"
  cr,                   // "14"
  pb,                   // "+5"
  xp,                   // "11,500"
  traits:    [{ name, desc }],   // Amphibious, Legendary Resistance…
  actions:   [{ name, desc }],   // Multiattack, Bite, Breath Weapons…
  reactions: [{ name, desc }],
  legendary: [{ name, desc }],
  legendaryNote,        // "The dragon can take 3 legendary actions…"
  legendaryCount,       // 3 — seeds the tracker's legendary counter
  items:     [{ name, desc }],   // generic gear/loot list (swords, etc.)
  lore                  // optional flavor/description
}
```

### Import

New "Monsters" tab on the Import page (`client/src/pages/ImportPage.jsx`),
following the Spells tab pattern:

- Form fields for the scalar attributes above.
- Text-line fields for `traits` / `actions` / `reactions` / `legendary` /
  `items`, parsed with the existing `name | desc` line parser (`parseTraitLines`
  in `client/src/rules/import-forms.js`).
- Shared `SubmitRow` with the paste-JSON override and Delete-loaded-entry.
- On submit → `POST /api/monsters` → registry `reload()` re-merges.

Any logged-in user may import (decided: monster *lookup* is DM-only, but monster
*creation* is open and consistent with all other content).

### Built-in seed: Adult Copper Dragon

Ships as `public/resources/monsters.js`, a classic-script global following the
`public/resources/companions.js` pattern. Built-in monsters and imported
(`custom_monsters`) monsters are merged in the DM library index, the same way
built-in and custom spells are merged today.

**Copyright note:** The linked D&D Beyond page is paywalled and its text is
WotC-copyrighted, so it is **not** scraped. The Adult Copper Dragon is Open Game
Content in the SRD 5.1; the built-in statblock is built from the SRD entry. The
URL is used only to confirm which fields the model needs.

## Part B — DM Screen page

### Route & entry point

- New client route `/dm/:sessionId` → `client/src/pages/DmScreenPage.jsx`
  (registered in `client/src/App.jsx`).
- In `SessionDetail` (`client/src/pages/SessionsPage.jsx`), add an **"Open DM
  Screen"** button, rendered only when `detail.isDm`.
- The page loads session detail and guards on DM ownership; a non-DM sees a
  "not authorized" notice.
- The page exposes four regions: reference search, party snapshots, a
  prominently-labeled **Turn Order** button/tracker, and the DM notepad.

### Region 1 — Reference search (with monsters)

Refactor the search core out of `LibraryPage.jsx` into a shared component
`client/src/components/LibrarySearch.jsx` containing: the search box, the two
`FilterBar` rows, results grouping/paging, and the `SheetWindow` window-manager
(open/close/navigate/Esc/close-all).

- `LibraryPage` renders `<LibrarySearch includeMonsters={false} />`.
- `DmScreenPage` renders `<LibrarySearch includeMonsters={true} />`.
- `buildNotesIndex(data, customSpells, monsters?)` gains an optional monsters
  argument. Monster entries (`type: 'Monsters'`) are added to the index **only**
  when monsters are passed, so they never appear on the public Library.
- `NOTES_TYPES` gains `'Monsters'` for the DM Screen's filter row; the public
  Library's type list stays as-is (the shared component takes the type list, or
  filters `'Monsters'` out when `includeMonsters` is false).
- Monster results open in a `SheetWindow` via a new
  `client/src/components/MonsterDetail.jsx` that renders the statblock (reusing
  the `companionStatsHtml`-style markup, extended for monster-only fields:
  resistances/vulnerabilities/condition immunities, CR/PB/XP, legendary actions,
  and the `items` list).
- The statblock includes an **"Add to turn order"** button that seeds a
  free-form combatant in the tracker, pre-filled with the monster's name, HP, and
  legendary-action count (`legendaryCount`). This links monster lookup to the
  tracker without hard-linking records.

### Region 2 — Party snapshots

- A row of the session's attached characters (from session detail members +
  host pool). Clicking one opens a read-only snapshot in a `SheetWindow`.
- New `client/src/components/SnapshotSheet.jsx`: a read-only rendering of the
  character "main tab" — ability scores, derived (proficiency bonus, AC,
  initiative), and combat (AC, current/max/temp HP, speed, hit dice, death
  saves). No inputs, no `update`.
- Data fetched via `api.getCharacter(id)` (the DM is already authorized by
  `GameSession.dmCanViewCharacter`), then run through the existing
  `deriveCharacter` rules for computed values.
- **Frozen at open:** the fetched data is captured when the window opens and does
  not auto-update. A **Refresh** button re-fetches; if the character changed since
  the captured copy (compared via the character's `updated_at` / a key-field
  diff), the button flags "changes available" and applies them on click.

`CharacterTab` is tightly bound to `useCharacter`/`update`, so `SnapshotSheet`
renders its own static markup from fetched data rather than reusing that
component directly.

### Region 3 — Turn-order tracker

A free-form initiative tracker for running combat, opened from a clear,
prominent **Turn Order** button on the DM Screen. New
`client/src/components/TurnOrderTracker.jsx`.

- **Combatants** are free-form: the DM types `name`, `initiative`, and `hp`
  (current + max). Rows are not hard-linked to character or monster records, but
  a monster statblock's "Add to turn order" (Region 1) can seed a row, and party
  snapshots can offer the same.
- The list sorts by `initiative` descending, with a **current-turn** marker and a
  **round** counter. Controls: **Next turn** (advances the marker; wrapping past
  the last combatant increments the round and resets each combatant's
  legendary counter), **Previous turn**, **Add combatant**, **Remove combatant**,
  and **Clear/Reset**.
- **Interactive counters per combatant:**
  - Legendary actions — `legendaryMax` / `legendaryUsed`, spent/restored by the
    DM and auto-reset at the start of each round.
  - Resource counters — an arbitrary list `resources: [{ name, max, used }]` the
    DM can add to any combatant (e.g. Legendary Resistance 3/day, spell slots).
- Combatant shape:
  `{ id, name, initiative, hp, hpMax, legendaryMax, legendaryUsed,
     resources: [{ name, max, used }], note }`.
- Tracker state — `{ combatants, activeIndex, round }` — persists to the session
  (Part C) and reloads intact.

### Region 4 — DM notepad

Mirrors the Journal tab (`client/src/components/sheet/JournalTab.jsx`):

- Compose box (title + textarea + "Add entry").
- Card grid of entries.
- Edit/delete detail modal.
- Entries: `{ id, title, text, created, updated }`.
- Persisted server-side per session (Part C). Client autosaves changes,
  debounced, like the character store's autosave.

## Part C — DM notes & combat persistence

Both blobs are DM-only, per-session JSON, stored on `game_sessions` and gated to
`session.dm_user_id === req.user.id`.

- Add two TEXT columns to `game_sessions` via the migration pattern already at
  the bottom of `src/db.js` (PRAGMA `table_info` → conditional `ALTER TABLE`):
  - `dm_notes` — JSON array of notepad entries.
  - `combat` — JSON `{ combatants, activeIndex, round }` for the tracker.
- `gameSession.model.js`: `getNotes/setNotes` and `getCombat/setCombat`.
- `sessions.controller.js`: `getNotes/setNotes` and `getCombat/setCombat`, all
  DM-gated (403 otherwise).
- Routes: `GET|PUT /api/sessions/:id/dm-notes`, `GET|PUT /api/sessions/:id/combat`.
- Client API: `getDmNotes/setDmNotes` and `getCombat/setCombat` in
  `client/src/api/client.js`. Both regions autosave changes, debounced, like the
  character store's autosave.

## Data flow summary

- **Monsters:** Import page → `POST /api/monsters` → `custom_monsters` →
  registry `reload()` → merged with `public/resources/monsters.js` → DM library
  index (`includeMonsters=true`).
- **Snapshots:** DM Screen → `GET /api/characters/:id` (DM-authorized) →
  `deriveCharacter` → read-only render, frozen at open; Refresh re-fetches.
- **Notes:** DM Screen → `GET/PUT /api/sessions/:id/dm-notes` (DM-only) →
  `dm_notes` column.
- **Combat:** DM Screen tracker → `GET/PUT /api/sessions/:id/combat` (DM-only) →
  `combat` column; a monster statblock's "Add to turn order" seeds a combatant.

## Error handling

- New endpoints return **403** (non-DM / unauthorized), **404** (missing session
  or monster), **400** (invalid body) — matching existing controllers.
- Import form validates like other tabs; paste-JSON parse errors surface inline
  via the shared `Msg` component.
- Snapshot fetch failure shows an in-window notice; a detached character (no id)
  is not openable.

## Testing

- **Rules unit tests** (`client/src/rules/__tests__`, node:test): the monster
  statblock HTML builder and any monster line-parser helper are pure and
  unit-tested, matching the existing suite. Run with `npm run test:client`.
- **Browser verification:**
  - "Open DM Screen" appears for a DM and not for a player.
  - An imported monster appears in the DM library search and is absent from the
    public Library; its statblock shows the `items` list and legendary actions.
  - A snapshot shows correct numbers read-only, stays frozen, and the Refresh
    button flags + applies changes made to the character afterward.
  - The Turn Order tracker sorts by initiative, advances turns/rounds, resets
    legendary counters on a new round, and persists across a page reload.
  - "Add to turn order" from a monster statblock seeds a combatant with HP and
    legendary count.
  - The notepad persists across a page reload.

## Affected files

**Server**
- `src/db.js` — `custom_monsters` table + `dm_notes` and `combat` column migrations.
- `src/models/customMonster.model.js` — new.
- `src/models/gameSession.model.js` — notes + combat get/set.
- `src/controllers/monsters.controller.js` — new.
- `src/controllers/sessions.controller.js` — notes + combat get/set.
- `src/routes/monsters.routes.js` — new.
- `src/routes/sessions.routes.js` — notes + combat routes.
- `src/app.js` — register monster routes.

**Client**
- `client/src/App.jsx` — `/dm/:sessionId` route.
- `client/src/pages/DmScreenPage.jsx` — new.
- `client/src/pages/SessionsPage.jsx` — "Open DM Screen" button.
- `client/src/pages/LibraryPage.jsx` — use shared `LibrarySearch`.
- `client/src/pages/ImportPage.jsx` — Monsters tab.
- `client/src/components/LibrarySearch.jsx` — new (extracted).
- `client/src/components/MonsterDetail.jsx` — new (+ "Add to turn order").
- `client/src/components/SnapshotSheet.jsx` — new (frozen + refresh).
- `client/src/components/TurnOrderTracker.jsx` — new.
- `client/src/rules/notes-index.js` — monsters in the index (guarded).
- `client/src/rules/import-forms.js` — monster parse/serialize helpers.
- `client/src/api/client.js` — monster + dm-notes + combat API.
- `public/resources/monsters.js` — new (Adult Copper Dragon seed).
- `public/styles.css` — DM Screen / statblock / tracker styling as needed.
