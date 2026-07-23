# DM Screen — Design Spec

**Date:** 2026-07-23
**Status:** Approved, pending implementation plan
**Branch context:** `react-refactor`

## Summary

Give the DM of a session a dedicated screen, opened from the Sessions page, that
combines three tools: a reference/library search that also finds **monsters**
(monsters appear only here, never on the public Library), read-only **snapshots**
of the party's character sheets, and a persisted per-session **notepad** modeled
on the character Journal tab.

Supporting this requires a new server-side monster model with its own import
flow, and per-session DM-notes storage.

## Goals

- The DM opens a screen from within a session that behaves like the Library and
  the character sheet combined.
- The DM can open read-only snapshots of each attached character showing the
  main tab: ability scores + derived stats + combat block.
- The DM can look up monsters through this screen's library. Monsters are
  lookup-restricted to the DM Screen; they never surface on the public Library.
- Anyone can create/import monsters (a new model + import form).
- The DM has a freeform, persisted notepad scoped to the session.

## Non-Goals (YAGNI)

- No initiative/combat tracker or turn order.
- No editing of character snapshots from the DM Screen (read-only).
- No sharing of monsters with players.
- No legendary-action / resource counters on monster statblocks.
- No frozen point-in-time snapshots — snapshots are always live reads.

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
  lore                  // optional flavor/description
}
```

### Import

New "Monsters" tab on the Import page (`client/src/pages/ImportPage.jsx`),
following the Spells tab pattern:

- Form fields for the scalar attributes above.
- Text-line fields for `traits` / `actions` / `reactions` / `legendary`, parsed
  with the existing `name | desc` line parser (`parseTraitLines` in
  `client/src/rules/import-forms.js`).
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
  the `companionStatsHtml`-style markup, extended for monster-only fields).

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
- A refresh control re-fetches to show live values.

`CharacterTab` is tightly bound to `useCharacter`/`update`, so `SnapshotSheet`
renders its own static markup from fetched data rather than reusing that
component directly.

### Region 3 — DM notepad

Mirrors the Journal tab (`client/src/components/sheet/JournalTab.jsx`):

- Compose box (title + textarea + "Add entry").
- Card grid of entries.
- Edit/delete detail modal.
- Entries: `{ id, title, text, created, updated }`.
- Persisted server-side per session (Part C). Client autosaves changes,
  debounced, like the character store's autosave.

## Part C — DM notes persistence

- Add a `dm_notes` TEXT column (JSON array) to `game_sessions` via the migration
  pattern already at the bottom of `src/db.js` (PRAGMA `table_info` → conditional
  `ALTER TABLE`).
- `gameSession.model.js`: `getNotes(sessionId)` / `setNotes(sessionId, json)`.
- `sessions.controller.js`: `getNotes` / `setNotes`, both gated to
  `session.dm_user_id === req.user.id`.
- Routes: `GET /api/sessions/:id/dm-notes`, `PUT /api/sessions/:id/dm-notes`.
- Client API: `getDmNotes(id)` / `setDmNotes(id, notes)` in
  `client/src/api/client.js`.

## Data flow summary

- **Monsters:** Import page → `POST /api/monsters` → `custom_monsters` →
  registry `reload()` → merged with `public/resources/monsters.js` → DM library
  index (`includeMonsters=true`).
- **Snapshots:** DM Screen → `GET /api/characters/:id` (DM-authorized) →
  `deriveCharacter` → read-only render.
- **Notes:** DM Screen → `GET/PUT /api/sessions/:id/dm-notes` (DM-only) →
  `dm_notes` column.

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
    public Library.
  - A snapshot shows correct live numbers, read-only, and refreshes.
  - The notepad persists across a page reload.

## Affected files

**Server**
- `src/db.js` — `custom_monsters` table + `dm_notes` column migration.
- `src/models/customMonster.model.js` — new.
- `src/models/gameSession.model.js` — notes get/set.
- `src/controllers/monsters.controller.js` — new.
- `src/controllers/sessions.controller.js` — notes get/set.
- `src/routes/monsters.routes.js` — new.
- `src/routes/sessions.routes.js` — notes routes.
- `src/app.js` — register monster routes.

**Client**
- `client/src/App.jsx` — `/dm/:sessionId` route.
- `client/src/pages/DmScreenPage.jsx` — new.
- `client/src/pages/SessionsPage.jsx` — "Open DM Screen" button.
- `client/src/pages/LibraryPage.jsx` — use shared `LibrarySearch`.
- `client/src/pages/ImportPage.jsx` — Monsters tab.
- `client/src/components/LibrarySearch.jsx` — new (extracted).
- `client/src/components/MonsterDetail.jsx` — new.
- `client/src/components/SnapshotSheet.jsx` — new.
- `client/src/rules/notes-index.js` — monsters in the index (guarded).
- `client/src/rules/import-forms.js` — monster parse/serialize helpers.
- `client/src/api/client.js` — monster + dm-notes API.
- `public/resources/monsters.js` — new (Adult Copper Dragon seed).
- `public/styles.css` — DM Screen / statblock styling as needed.
