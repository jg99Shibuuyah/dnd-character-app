# React Migration Plan

Goal: retire the 5,468-line `public/app.js` by moving the frontend to React, incrementally, without ever breaking the working app.

## What we're starting from

- **Backend (unchanged by this plan):** Express + better-sqlite3, JSON API routes under `src/routes/` (characters, classes, species, backgrounds, subclasses, subspecies, spells, sessions, auth). It already works as a pure API — the frontend talks to it through ~15 thin `api*()` fetch wrappers.
- **Pages:** 6 server-rendered EJS pages — `login`, `reset`, `index` (character sheet), `import`, `library`, `sessions`. All frontend behaviour lives in `public/app.js` plus small modules (`dice.js`, `journal.js`, `sessions.js`).
- **State:** one global `state` object (the character), mutated directly, re-rendered via ~90 `buildXxx()`/`renderXxx()` functions doing ~500 direct DOM operations. This is the part React replaces.
- **Rules data:** static JS files in `public/resources/builtin/` (classes, spells, species…). Framework-agnostic — reused as-is.
- **Styling:** one `styles.css` driven by CSS variables (the theme system). Reused as-is; React components keep the same class names.

Key insight from auditing `app.js`: roughly a third of it is **pure D&D rules logic with no DOM in it** — `mod`, `profBonus`, `computeAC`, `effectiveAbilities`, `computeSpellSlots`, `multiclassCasterLevel`, equipment/attack derivation, feature-choice pruning, etc. That code doesn't need React; it needs to be extracted into plain modules that both the old and new frontends can import. This is Phase 1, it shrinks `app.js` before React even enters the picture, and it de-risks everything after.

## Architecture target

```
client/                  ← new Vite + React app
  src/
    api/                 ← fetch client (ported api*() functions)
    rules/               ← pure D&D logic (extracted in Phase 1)
    state/               ← character store (useReducer or Zustand)
    components/          ← shared: modals, dice roller, tag pickers…
    pages/               ← Sheet, Import, Library, Sessions
src/                     ← Express server, unchanged; serves client/dist in prod
public/                  ← legacy frontend, deleted at the end
```

- **Dev:** Vite dev server proxies `/api/*` and auth to Express (`SKIP_AUTH=true` for solo testing).
- **Prod:** `vite build` → Express serves `client/dist` static files. No SSR; EJS remains only for `login`/`reset` until the end.
- **Language:** JSX + JSDoc types to start (no TS learning curve); TypeScript is an easy later upgrade since Vite supports mixed files.

## Phases

### Phase 0 — Scaffold (small)
1. Create `client/` with Vite + React; add `dev` / `build` scripts and Express static serving of `client/dist` behind a route prefix (e.g. `/next/`) so old and new UIs run side by side.
2. Add a `.claude/launch.json` entry for the Vite dev server.
3. Symlink/import `public/resources/builtin/` and `styles.css` into the client.

**Done when:** a React "hello" page renders at `/next/` with live data from `GET /api/characters`.

### Phase 1 — Extract pure logic out of app.js (the big de-risker)
1. Move rules functions into `client/src/rules/` as plain exported modules, grouped: `abilities.js`, `ac.js`, `spellcasting.js`, `equipment.js`, `features.js`, `companions.js`.
2. Move the `api*()` fetch wrappers into `client/src/api/client.js`.
3. Legacy `app.js` imports these (it already uses ES modules via `public/modules/`), deleting its local copies.
4. Add unit tests for the extracted rules (node:test is enough) — AC stacking, multiclass slots, proficiency, save/skill math. These tests are the parity safety net for every later phase.

**Done when:** `app.js` drops to roughly ~3,500 lines, old app still works identically, rules tests pass.

### Phase 2 — Port the small pages first (learn the patterns cheap)
Order by size and risk, each one deleting its legacy JS when done:
1. **Sessions page** (`sessions.js`, ~320 lines) — list + CRUD, ideal first component.
2. **Library page** (search, alignment, mastery partials + notes-index code) — read-mostly.
3. **Import page** (all `bindXxxImport`/`fillXxxForm`/bulk-import code, ~1,200 lines of `app.js`) — forms map naturally to controlled components; this is the single biggest lump of `app.js` outside the sheet.

**Done when:** those three pages are React routes, legacy versions removed, `app.js` is down to sheet-only code (~2,000 lines).

### Phase 3 — The character sheet, tab by tab
1. **Shell first:** page bar, hero header, tab bar, profile bar, sidebar, options/theme menu. Character state moves into a store: `useReducer` with actions like `setAbility`, `equipItem`, `chooseFeature`; derived values (AC, saves, slots) computed via Phase 1 rules functions — no more manual `refreshEffects()` chains.
2. **Autosave:** port `save()`/`setSaveStatus()` as a store subscriber with the same debounce.
3. **Tabs, easiest → hardest:** Settings → Skills → Inventory/Equipment → Features (choice modals) → Actions (resources/meters) → Spells (library, slots, tag pickers) → Journal (port `journal.js`) → Companions.
4. **Shared widgets as they come up:** detail modal, item modal, choice modal, dice roller, corner launcher, notes floating windows (the `nr*` drag/snap system — hardest single widget, saved for last).
5. Parity check per tab: load the same character in old and new UI, compare exported JSON and displayed derived numbers.

**Done when:** sheet fully functional in React; a character round-trips (load → edit → save → reload) with identical JSON.

### Phase 4 — Cutover and cleanup
1. Serve React at `/` instead of `/next/`; convert or keep `login`/`reset` EJS (fine to keep — they're tiny and pre-auth).
2. Delete `public/app.js`, `public/modules/`, legacy `public/index.html`, and the EJS sheet/import/library/sessions views + partials.
3. Update README, Dockerfile (add build step), and launch configs.

## Risk notes

- **Highest-risk widgets:** notes floating windows (drag/snap), the theme editor (writes CSS vars — port nearly as-is), and spell slot auto-calculation across multiclassing. All are isolated; none block other work.
- **Rollback:** every phase leaves the legacy app runnable until Phase 4; a phase can ship half-done because old and new UIs coexist.
- **No data risk:** the DB schema and API are untouched throughout.

## Effort shape (rough, in working sessions)

| Phase | Sessions |
|---|---|
| 0 Scaffold | 1 |
| 1 Extract rules + tests | 2–3 |
| 2 Small pages | 2–3 |
| 3 Sheet tabs | 5–8 |
| 4 Cutover | 1 |
