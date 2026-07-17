# Built-in game content

The static reference tables the sheet is seeded with, one file per content
type (split from the old single `builtins.js`). Kept out of `app.js` so that
file holds behaviour and these hold data.

Every file is a classic script: its top-level `const`s are globals visible to
`/app.js` and the `/modules` scripts. The views (`src/views/*.html`) must load
them **before** `/app.js`, in this order — later files read or mutate globals
defined by earlier ones:

1. `spells.js` — `SPELL_DATA`, `SPELL_CLASSES`, `SPELL_DETAILS`
2. `actions.js` — `STANDARD_ACTIONS`, `USABLE_ITEM_WORDS`
3. `alignments.js` — `ALIGNMENTS`
4. `weapon-mastery.js` — `MASTERY_PROPERTIES`
5. `abilities-skills.js` — `ABILITIES`, `SKILLS`, `SKILL_DESC`, `PASSIVE_SENSE_INFO`
6. `classes.js` — `FEATURE_INFO`, `P()`, `CLASS_DATA`, `CLASS_SOURCES`
7. `species.js` — `SPECIES_DATA`
8. `backgrounds.js` — `BACKGROUND_DATA`
9. `subclasses.js` — `SUBCLASS_DATA`, `subclassNamesForClass` (reads `CLASS_DATA`)
10. `subspecies.js` — `SUBSPECIES_DATA`, `subspeciesNamesForSpecies` (reads `SPECIES_DATA`)
11. `spell-slots.js` — `FULL_SLOTS`, `HALF_SLOTS`, `PACT_SLOTS`
12. `fighting-styles.js` — `FIGHTING_STYLES`; attaches style choices onto
    `CLASS_DATA`/`SUBCLASS_DATA` feature rows
13. `snapshots.js` — **must be last**: `BUILTIN_*` deep copies of the tagged
    registries (used to restore a built-in shadowed by a deleted custom
    import), plus `MC_REQS`

User-imported ("custom") content is DB-backed and merged into these registries
at startup by `app.js`. `companions.js` (sibling directory) stays separate and
loads after these, still before `app.js`.
