# Import Auto-Linking — Design

Date: 2026-07-24
Status: Approved

## Problem

A character JSON stores references by name only (class, subclass, species,
subspecies, background, known spells). `importCharacterJson`
(client/src/state/characterStore.jsx) imports the character verbatim without
checking whether those names exist in the registry. Near-miss names ("Flame
Bolt" vs "Flamebolt") silently dangle, and references to homebrew content the
account doesn't have simply fail to resolve at render time.

## Solution overview

Add a resolution step to the character-import flow: exact matches link
silently, near matches get a review modal where the user picks the intended
entry, and missing references can create minimal Homebrew stub library
entries so the character links cleanly now and the entry is fleshed out later.
Import is never blocked; Cancel aborts with nothing created.

## Scope

Runs on character JSON import from ProfileBar. Reference types checked:

| Type | Character field | Resolves against |
|---|---|---|
| class | `classes[].name` (+ legacy `class` string) | `classData` keys |
| subclass | `classes[].subclass` | subclass names scoped to resolved parent class |
| species | `race` | `speciesData` keys |
| subspecies | `subrace` | subspecies for the resolved species |
| background | `background` | `backgroundData` keys |
| spell | `knownSpells[].name` | builtin `spellData` (all classes) + `customSpells` |

Non-goals: external formats (D&D Beyond etc.), bundling library entries into
exports, auditing already-saved characters. The resolver takes any character
object, so a post-import audit can be added later at low cost.

## Components

### 1. Resolver module — `client/src/rules/import-linking.js`

Pure, no DOM, unit-tested like the other rules modules.

- `collectReferences(character)` → deduped list of `{type, name, parent?}`.
  Empty names skipped; duplicate references (same type + normalized name)
  collapse to one entry whose decision applies to all occurrences.
- `resolveReferences(character, data, customSpells)` → report entries
  `{type, name, status, candidates}`, status `exact` | `near` | `missing`.
  Matching ladder: exact → normalized (lowercase, trim, collapse whitespace,
  strip punctuation) → edit distance ≤ 2. Candidates ranked, capped at 3.
  Classes resolve before subclasses and species before subspecies so children
  scope to the resolved parent name.
- `applyResolutions(character, decisions)` → clone with chosen names
  rewritten everywhere they appear, including the legacy `class` string when
  it matches the old name.

### 2. Review modal — `client/src/components/ImportReviewModal.jsx`

Opens only when the report contains near or missing entries; an all-exact
import proceeds silently (today's behavior). Grouped by reference type:

- Near-match row: original name + select of candidates (best pre-selected)
  plus a "keep original name" option.
- Missing row: "create stub library entry" checkbox, checked by default.
  Unchecked imports the dangling name as-is.

Buttons: **Import** confirms; **Cancel** aborts the whole import.

### 3. Stub creation

Through the existing import APIs (`api.classes.import`, `api.species.import`,
`api.backgrounds.import`, `api.subclasses.import`, `api.subspecies.import`,
`api.spells.import`) with `source: 'Homebrew'` and minimal per-type data:

- class: `{ hitDie: 8, saves: [] }`
- spell: level taken from the character's `knownSpells` entry
- subclass/subspecies: `parent` set to the resolved parent name
- all stubs carry `stub: true` in `data` so the Import page can flag
  "needs details" later

After stub creation: `reloadRegistry()`, then the untouched
`importCharacterJson` runs with the resolved character.

## Flow

`ProfileBar.onImportFile`: parse → `resolveReferences` → (modal if any
near/missing) → create stubs → `applyResolutions` → `importCharacterJson`.

Error handling: if a stub API call fails, the import aborts with the error
shown in the modal — no partial character is created. Cancel mid-review
leaves the library untouched.

## Testing

- `node:test` suite in `client/src/rules/__tests__/` for the resolver:
  exact, case/punctuation variants, edit-distance hits, parent-scoped
  subclass, dedupe, apply-rewrite (fixture registry data).
- Modal and full flow verified in the browser preview.
