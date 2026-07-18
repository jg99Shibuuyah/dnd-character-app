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

### Phase 1 — Extract pure logic out of app.js (the big de-risker) ✅
1. Rules functions extracted into `client/src/rules/` as plain exported modules: `core.js`, `equipment.js`, `abilities.js` (incl. `deriveStats`, the compute half of `recalc()`), `spellcasting.js`, `classes.js`, `companions.js`. Functions take the character and an optional game-data bundle explicitly (no globals).
2. The `api*()` fetch wrappers became `client/src/api/client.js`.
3. **Adaptation:** the legacy frontend turned out to be all classic scripts (no ES modules), so it cannot import the extracted code without a build step. Legacy keeps its copies untouched until Phase 4 deletes it; the historic branch + unit tests guard parity instead. Builtin game data stays classic-script globals shared by both frontends (`client/src/rules/builtin-data.js` bridges them into ESM; tests load the real data files via `node:vm`).
4. 25 node:test unit tests cover AC stacking, gear ability effects, multiclass slot math, pact magic, granted proficiencies, feature-choice pruning, and companion context (`npm test` in `client/`).

**Done when:** ~~app.js shrinks~~ (superseded by the adaptation) → extracted modules exist, browser + Node agree on the math, tests pass. ✅

### Phase 2 — Port the small pages first (learn the patterns cheap) ✅
Each ported as a React route under `/next/`, legacy left in place until Phase 4:
1. **Sessions page** ✅ — `SessionsPage.jsx` (create/join/preview, member table, DM loaner pool).
2. **Library page** ✅ — `LibraryPage.jsx` + `rules/notes-index.js` (searchable index) + `notes-windows.js` (the floating draggable/snappable detail windows, kept imperative outside React) + `state/registry.js` (merges DB-imported content into cloned builtin registries).
3. **Import page** ✅ — `ImportPage.jsx` (six forms + bulk import + JSON reference) + `rules/import-forms.js` (pure parsers/bulk pipeline). Deep links from the Library (`?edit=type:key`) supported.

Also built the shared React shell: `components/Layout.jsx` (sidebar + page bar), `components/OptionsMenu.jsx` + `theme.js` (full theme system, same localStorage keys as legacy).

**Done when:** three pages are React routes, verified in-browser. ✅ (legacy JS still present — deleted in Phase 4)

### Phase 3 — The character sheet, tab by tab ✅
1. **Shell + store** ✅ — `state/characterStore.jsx`: `update(mutator)` clones-mutates-commits and schedules the same 500ms debounced autosave (`save()`/`setSaveStatus()` ported); derived AC/saves/skills/slots via `useMemo` over the Phase 1 rules, replacing `refreshEffects()`/`recalc()` chains. `SheetPage` wires sidebar, `ProfileBar`, `Hero`, tab bar.
2. **All eight tabs** ✅ — Character (abilities/combat/companions), Skills, Inventory & Equipment (+ item modal), Journal (+ detail modal), Features & Traits (+ shared choice control/modal), Settings (identity/multiclass picker/skill picker), Spells (slots/library/known), Actions (attacks/reactions/resources/class abilities). Class edits run `applyClassesToState` in the mutator so derived fields persist.
3. **Shared widgets** ✅ — item modal, choice control + modal, resource modal, the floating dice roller (logs to the roll log), and the reused `notes-windows.js` detail windows.
4. Each tab verified in-browser against the loaded character (derived numbers, cross-tab reactivity, DB round-trips).

**Done when:** sheet fully functional in React; a character round-trips (load → edit → save → reload). ✅ (remaining chrome: journal quick-note FAB + skills quick popup — optional, deferred)

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
