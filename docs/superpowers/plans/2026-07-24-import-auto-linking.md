# Character Import Auto-Linking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** When a character JSON is imported, resolve its name references (class, subclass, species, subspecies, background, spells) against the merged registry — exact matches link silently, near matches get a review modal, missing references can create stub Homebrew library entries.

**Architecture:** A pure resolver module in `client/src/rules/` (unit-tested with node:test) computes a link report; `ProfileBar`'s import flow shows an `ImportReviewModal` when the report has near/missing entries, creates stubs through the existing import APIs, rewrites names, then runs the untouched `importCharacterJson`.

**Tech Stack:** React 19 + Vite, JSX + JSDoc (NOT TypeScript), node:test, existing Express JSON API (no server changes).

**Spec:** `docs/superpowers/specs/2026-07-24-import-auto-linking-design.md`

## Global Constraints

- Frontend is JSX + JSDoc — do not introduce TypeScript.
- Pure rules logic goes in `client/src/rules/` with no DOM and no imports from `client/src/api/` or `client/src/state/` (those pull fetch/React into node tests).
- No server/Express changes; stubs use the existing `/api/<type>` POST endpoints.
- Stub entries use `source: 'Homebrew'` and carry `stub: true` inside `data`.
- `importCharacterJson` in `client/src/state/characterStore.jsx` must remain unchanged.
- Run tests with `npm run test:client` from the repo root (single file: `node --test client/src/rules/__tests__/import-linking.test.js`).
- Commit after each task with a conventional-commit message ending in the `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>` trailer.
- `docs/` is gitignored in this repo — plan/spec doc commits need `git add -f` (source files are unaffected).

---

### Task 1: Resolver core — collect, match, resolve

**Files:**
- Create: `client/src/rules/import-linking.js`
- Create: `client/src/rules/__tests__/import-linking.test.js`

**Interfaces:**
- Consumes: registry `data` bundle shape from `client/src/rules/builtin-data.js` (`classData`, `subclassData`, `speciesData`, `subspeciesData`, `backgroundData`, `spellClasses`, `spellData`) and the `customSpells` map from `client/src/state/registry.js` (`{ [name]: {...} }`). Character shape from `defaultCharacter()` in `client/src/rules/core.js`.
- Produces (used by Tasks 2–4):
  - `normalizeName(s: string): string`
  - `refKey(ref: {type, name, parent?}): string`
  - `collectReferences(character): Array<{type, name, parent?}>`
  - `resolveReferences(character, data, customSpells?): Array<{type, name, parent?, status: 'exact'|'near'|'missing', candidates: Array<{name, score}>}>`

Reference types and where they live on a character: `classes[].name` → `class`; `classes[].subclass` → `subclass` (parent = class name); `race` → `species`; `subrace` → `subspecies` (parent = race); `background` → `background`; `knownSpells[].name` → `spell`. The legacy top-level `character.class` string is only collected when `classes[]` is empty.

- [ ] **Step 1: Write the failing tests**

Create `client/src/rules/__tests__/import-linking.test.js`:

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeName, collectReferences, resolveReferences, refKey
} from '../import-linking.js';

// Small hand-rolled registry fixture — deterministic, independent of builtins.
const data = {
  classData: { Wizard: { subclasses: ['Evoker'] }, Fighter: {} },
  subclassData: { 'Wizard::Bladesinger': { parent: 'Wizard', name: 'Bladesinger' } },
  speciesData: { Elf: { subraces: ['High Elf'] }, Dwarf: {} },
  subspeciesData: {},
  backgroundData: { Urchin: {}, Soldier: {} },
  spellClasses: ['Wizard'],
  spellData: { Wizard: [{ name: 'Fireball' }, { name: 'Mage Hand' }] }
};
const customSpells = { 'Flame Bolt': {} };

const char = (over = {}) => Object.assign({
  class: '', classes: [], race: '', subrace: '', background: '', knownSpells: []
}, over);

test('normalizeName lowercases, strips punctuation, collapses whitespace', () => {
  assert.equal(normalizeName('  Mage  Hand '), 'mage hand');
  assert.equal(normalizeName("Flame-Bolt's"), 'flamebolts');
  assert.equal(normalizeName(null), '');
});

test('collectReferences gathers every type, skips empties, dedupes', () => {
  const refs = collectReferences(char({
    classes: [{ name: 'Wizard', subclass: 'Evoker' }, { name: 'Wizard' }],
    race: 'Elf', subrace: 'High Elf', background: 'Urchin',
    knownSpells: [{ name: 'Fireball' }, { name: 'fireball' }, { name: '' }]
  }));
  assert.deepEqual(refs, [
    { type: 'class', name: 'Wizard' },
    { type: 'subclass', name: 'Evoker', parent: 'Wizard' },
    { type: 'species', name: 'Elf' },
    { type: 'subspecies', name: 'High Elf', parent: 'Elf' },
    { type: 'background', name: 'Urchin' },
    { type: 'spell', name: 'Fireball' }
  ]);
});

test('collectReferences falls back to legacy class string when classes[] is empty', () => {
  const refs = collectReferences(char({ class: 'Fighter' }));
  assert.deepEqual(refs, [{ type: 'class', name: 'Fighter' }]);
});

test('exact names resolve silently', () => {
  const report = resolveReferences(char({ knownSpells: [{ name: 'Fireball' }] }), data, customSpells);
  assert.deepEqual(report, [{ type: 'spell', name: 'Fireball', status: 'exact', candidates: [] }]);
});

test('case/punctuation variants are near matches with score 0', () => {
  const [r] = resolveReferences(char({ knownSpells: [{ name: 'fire ball' }] }), data, customSpells);
  assert.equal(r.status, 'near');
  assert.deepEqual(r.candidates[0], { name: 'Fireball', score: 0 });
});

test('small typos are near matches via edit distance', () => {
  const [r] = resolveReferences(char({ knownSpells: [{ name: 'Firebal' }] }), data, customSpells);
  assert.equal(r.status, 'near');
  assert.equal(r.candidates[0].name, 'Fireball');
});

test('custom spells are part of the spell universe', () => {
  const [r] = resolveReferences(char({ knownSpells: [{ name: 'Flame Bolt' }] }), data, customSpells);
  assert.equal(r.status, 'exact');
});

test('unmatched names are missing', () => {
  const [r] = resolveReferences(char({ knownSpells: [{ name: 'Chrono Blast' }] }), data, customSpells);
  assert.equal(r.status, 'missing');
  assert.deepEqual(r.candidates, []);
});

test('subclass candidates are scoped to the parent class', () => {
  const report = resolveReferences(char({
    classes: [{ name: 'Wizard', subclass: 'Evoken' }]
  }), data, customSpells);
  const sub = report.find((r) => r.type === 'subclass');
  assert.equal(sub.status, 'near');
  assert.equal(sub.candidates[0].name, 'Evoker');
});

test('a near-matched parent scopes its child against the presumptive match', () => {
  const report = resolveReferences(char({
    classes: [{ name: 'Wizzard', subclass: 'Blade singer' }]
  }), data, customSpells);
  const cls = report.find((r) => r.type === 'class');
  assert.equal(cls.candidates[0].name, 'Wizard');
  const sub = report.find((r) => r.type === 'subclass');
  assert.equal(sub.status, 'near');
  assert.equal(sub.candidates[0].name, 'Bladesinger');
});

test('candidates are capped at 3 and sorted by score', () => {
  const wide = {
    ...data,
    spellData: { Wizard: [{ name: 'Bolt' }, { name: 'Bola' }, { name: 'Bold' }, { name: 'Bolo' }] }
  };
  const [r] = resolveReferences(char({ knownSpells: [{ name: 'Boltt' }] }), wide, {});
  assert.equal(r.candidates.length, 3);
  assert.equal(r.candidates[0].score, 1); // 'Bolt' is closest
});

test('refKey is stable across case and punctuation', () => {
  assert.equal(refKey({ type: 'spell', name: 'Fire-Ball' }), refKey({ type: 'spell', name: 'fireball' }));
  assert.notEqual(refKey({ type: 'spell', name: 'Fireball' }), refKey({ type: 'class', name: 'Fireball' }));
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test client/src/rules/__tests__/import-linking.test.js`
Expected: FAIL — `Cannot find module '../import-linking.js'`

- [ ] **Step 3: Write the resolver**

Create `client/src/rules/import-linking.js`:

```js
// Import auto-linking: resolve a character's name references (class, subclass,
// species, subspecies, background, spells) against the merged registry.
// Pure module — no DOM, no api/state imports — so node:test can exercise it.
// Spec: docs/superpowers/specs/2026-07-24-import-auto-linking-design.md

const subKey = (parent, name) => parent + '::' + name;

/** Lowercase, strip diacritics + punctuation, collapse whitespace. */
export function normalizeName(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Stable identity for a reference: type + normalized name (+ normalized parent). */
export function refKey(ref) {
  return ref.type + '|' + normalizeName(ref.name) + '|' + (ref.parent ? normalizeName(ref.parent) : '');
}

/** Damerau-Levenshtein distance (adjacent transpositions count as 1). */
function editDistance(a, b) {
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  const d = Array.from({ length: m + 1 }, (_, i) => {
    const row = new Array(n + 1).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 0; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[m][n];
}

/**
 * Deduped list of the character's name references, in resolution order
 * (parents before children so children can scope to the resolved parent).
 * @returns {Array<{type:string, name:string, parent?:string}>}
 */
export function collectReferences(character) {
  const refs = [];
  const seen = new Set();
  const add = (type, name, parent) => {
    const n = typeof name === 'string' ? name.trim() : '';
    if (!n) return;
    const key = refKey({ type, name: n, parent });
    if (seen.has(key)) return;
    seen.add(key);
    refs.push(parent ? { type, name: n, parent } : { type, name: n });
  };
  const classes = Array.isArray(character.classes) ? character.classes : [];
  classes.forEach((c) => {
    add('class', c.name);
    if (c.name && c.subclass) add('subclass', c.subclass, c.name);
  });
  if (classes.length === 0) add('class', character.class); // legacy single-class field
  add('species', character.race);
  if (character.race && character.subrace) add('subspecies', character.subrace, character.race);
  add('background', character.background);
  (Array.isArray(character.knownSpells) ? character.knownSpells : []).forEach((s) => add('spell', s && s.name));
  return refs;
}

// Name universe for one reference type. Subclass/subspecies scope to the
// parent when it yields anything, otherwise fall back to every known name.
// (Deliberately re-derives the tiny name lists instead of importing
// state/registry.js, which would drag api/client.js into node tests.)
function knownNames(type, data, customSpells, parent) {
  switch (type) {
    case 'class': return Object.keys(data.classData || {});
    case 'species': return Object.keys(data.speciesData || {});
    case 'background': return Object.keys(data.backgroundData || {});
    case 'subclass': {
      const all = () => {
        const names = new Set();
        Object.values(data.classData || {}).forEach((c) => (c.subclasses || []).forEach((n) => names.add(n)));
        Object.values(data.subclassData || {}).forEach((s) => names.add(s.name));
        return [...names];
      };
      if (!parent) return all();
      const own = (data.classData?.[parent]?.subclasses) || [];
      const imported = Object.values(data.subclassData || {})
        .filter((s) => s.parent === parent).map((s) => s.name);
      const scoped = [...new Set([...own, ...imported])];
      return scoped.length ? scoped : all();
    }
    case 'subspecies': {
      const all = () => {
        const names = new Set();
        Object.values(data.speciesData || {}).forEach((s) => (s.subraces || []).forEach((n) => names.add(n)));
        Object.values(data.subspeciesData || {}).forEach((s) => names.add(s.name));
        return [...names];
      };
      if (!parent) return all();
      const own = (data.speciesData?.[parent]?.subraces) || [];
      const imported = Object.values(data.subspeciesData || {})
        .filter((s) => s.parent === parent).map((s) => s.name);
      const scoped = [...new Set([...own, ...imported])];
      return scoped.length ? scoped : all();
    }
    case 'spell': {
      const names = new Set(Object.keys(customSpells || {}));
      (data.spellClasses || []).forEach((c) => (data.spellData?.[c] || []).forEach((s) => names.add(s.name)));
      return [...names];
    }
    default: return [];
  }
}

// Match one name against a universe. Only an exact string match is 'exact';
// normalized equality (score 0) and edit distance <= 2 rank as 'near'.
function matchName(name, universe) {
  if (universe.includes(name)) return { status: 'exact', candidates: [] };
  const norm = normalizeName(name);
  const scored = [];
  for (const cand of universe) {
    const cn = normalizeName(cand);
    if (cn === norm) scored.push({ name: cand, score: 0 });
    else {
      const dist = editDistance(norm, cn);
      if (dist <= 2) scored.push({ name: cand, score: dist });
    }
  }
  scored.sort((a, b) => a.score - b.score || a.name.localeCompare(b.name));
  const candidates = scored.slice(0, 3);
  return candidates.length
    ? { status: 'near', candidates }
    : { status: 'missing', candidates: [] };
}

/**
 * Resolve every reference. Children (subclass/subspecies) scope against the
 * presumptive parent: an exact parent stays itself; a near parent uses its
 * top candidate.
 * @returns {Array<{type, name, parent?, status:'exact'|'near'|'missing', candidates:Array<{name,score}>}>}
 */
export function resolveReferences(character, data, customSpells = {}) {
  const refs = collectReferences(character);
  // Presumptive renames discovered while resolving parents, per parent type.
  const presumptive = { class: {}, species: {} };
  return refs.map((ref) => {
    let parent = ref.parent;
    if (parent) {
      const parentType = ref.type === 'subclass' ? 'class' : 'species';
      parent = presumptive[parentType][normalizeName(parent)] || parent;
    }
    const { status, candidates } = matchName(ref.name, knownNames(ref.type, data, customSpells, parent));
    if ((ref.type === 'class' || ref.type === 'species') && status === 'near') {
      presumptive[ref.type][normalizeName(ref.name)] = candidates[0].name;
    }
    return Object.assign({}, ref, { status, candidates });
  });
}
```

Note: `collectReferences` pushes parents before their children (classes loop adds the class then its subclass; `race` is added before `subrace`), so the single `map` pass in `resolveReferences` sees parents first — no extra sort needed.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test client/src/rules/__tests__/import-linking.test.js`
Expected: PASS (all tests)

Also run the whole suite to check nothing broke: `npm run test:client` — expected PASS.

- [ ] **Step 5: Commit**

```bash
git add client/src/rules/import-linking.js client/src/rules/__tests__/import-linking.test.js
git commit -m "feat: resolver for character-import reference auto-linking"
```

---

### Task 2: applyResolutions + stub payloads

**Files:**
- Modify: `client/src/rules/import-linking.js` (append)
- Modify: `client/src/rules/__tests__/import-linking.test.js` (append)

**Interfaces:**
- Consumes: `refKey`, `normalizeName` from Task 1. Decision objects shaped `{type, name, parent?, status, candidates, action: 'link'|'keep'|'stub', linkTo?: string}` (produced by the modal in Task 3).
- Produces (used by Task 4):
  - `applyResolutions(character, decisions): character` — deep clone with linked names rewritten.
  - `stubPayloadFor(ref: {type, name, parent?}, character): { path: string, payload: object }` — `path` is the api registry key (`classes`, `species`, `backgrounds`, `subclasses`, `subspecies`, `spells`); `payload` matches the existing POST bodies (`{name, source, data}`, plus `parent` for subclass/subspecies).

- [ ] **Step 1: Write the failing tests**

Append to `client/src/rules/__tests__/import-linking.test.js`:

```js
import { applyResolutions, stubPayloadFor } from '../import-linking.js';

test('applyResolutions rewrites linked names everywhere, leaves keep/stub alone', () => {
  const c = char({
    class: 'Wizzard',
    classes: [{ name: 'Wizzard', subclass: 'Blade singer' }],
    race: 'Elff', subrace: 'High Elf', background: 'Urchen',
    knownSpells: [{ name: 'Firebal', level: 3 }, { name: 'Chrono Blast', level: 1 }]
  });
  const out = applyResolutions(c, [
    { type: 'class', name: 'Wizzard', action: 'link', linkTo: 'Wizard' },
    { type: 'subclass', name: 'Blade singer', parent: 'Wizzard', action: 'link', linkTo: 'Bladesinger' },
    { type: 'species', name: 'Elff', action: 'link', linkTo: 'Elf' },
    { type: 'background', name: 'Urchen', action: 'keep', linkTo: '' },
    { type: 'spell', name: 'Firebal', action: 'link', linkTo: 'Fireball' },
    { type: 'spell', name: 'Chrono Blast', action: 'stub' }
  ]);
  assert.equal(out.class, 'Wizard'); // legacy field follows
  assert.deepEqual(out.classes, [{ name: 'Wizard', subclass: 'Bladesinger' }]);
  assert.equal(out.race, 'Elf');
  assert.equal(out.subrace, 'High Elf');
  assert.equal(out.background, 'Urchen'); // kept as-is
  assert.equal(out.knownSpells[0].name, 'Fireball');
  assert.equal(out.knownSpells[0].level, 3); // other fields untouched
  assert.equal(out.knownSpells[1].name, 'Chrono Blast'); // stub keeps the name
  assert.notEqual(out, c); // clone, not mutation
  assert.equal(c.classes[0].name, 'Wizzard');
});

test('stubPayloadFor builds per-type Homebrew payloads with stub flag', () => {
  const c = char({ knownSpells: [{ name: 'Chrono Blast', level: 4 }] });
  assert.deepEqual(stubPayloadFor({ type: 'class', name: 'Chronomancer' }, c), {
    path: 'classes',
    payload: { name: 'Chronomancer', source: 'Homebrew', data: { hitDie: 8, saves: [], stub: true } }
  });
  assert.deepEqual(stubPayloadFor({ type: 'subclass', name: 'Time Lord', parent: 'Wizard' }, c), {
    path: 'subclasses',
    payload: { name: 'Time Lord', parent: 'Wizard', source: 'Homebrew', data: { stub: true } }
  });
  assert.deepEqual(stubPayloadFor({ type: 'spell', name: 'Chrono Blast' }, c), {
    path: 'spells',
    payload: { name: 'Chrono Blast', source: 'Homebrew', data: { level: 4, classes: [], stub: true } }
  });
  assert.deepEqual(stubPayloadFor({ type: 'species', name: 'Chronoid' }, c), {
    path: 'species',
    payload: { name: 'Chronoid', source: 'Homebrew', data: { stub: true } }
  });
  assert.deepEqual(stubPayloadFor({ type: 'subspecies', name: 'Chronoid Prime', parent: 'Chronoid' }, c), {
    path: 'subspecies',
    payload: { name: 'Chronoid Prime', parent: 'Chronoid', source: 'Homebrew', data: { stub: true } }
  });
  assert.deepEqual(stubPayloadFor({ type: 'background', name: 'Drifter' }, c), {
    path: 'backgrounds',
    payload: { name: 'Drifter', source: 'Homebrew', data: { stub: true } }
  });
});

test('stubPayloadFor spell level defaults to 0 when the character has no entry', () => {
  const { payload } = stubPayloadFor({ type: 'spell', name: 'Ghost Note' }, char());
  assert.equal(payload.data.level, 0);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test client/src/rules/__tests__/import-linking.test.js`
Expected: FAIL — `applyResolutions` / `stubPayloadFor` not exported.

- [ ] **Step 3: Implement**

Append to `client/src/rules/import-linking.js`:

```js
/**
 * Rewrite the character's names per the review decisions. Only decisions with
 * a `linkTo` different from the original name cause a rewrite ('keep' rows
 * carry linkTo:'' and 'stub' rows carry none). Returns a deep clone.
 */
export function applyResolutions(character, decisions) {
  const c = JSON.parse(JSON.stringify(character));
  const map = {};
  (decisions || []).forEach((d) => {
    if (d.linkTo && d.linkTo !== d.name) map[refKey(d)] = d.linkTo;
  });
  const rename = (type, name, parent) => {
    if (typeof name !== 'string' || !name.trim()) return name;
    const hit = map[refKey({ type, name, parent })];
    return hit !== undefined ? hit : name;
  };
  (Array.isArray(c.classes) ? c.classes : []).forEach((cls) => {
    const oldName = cls.name;
    cls.name = rename('class', cls.name);
    if (cls.subclass) cls.subclass = rename('subclass', cls.subclass, oldName);
  });
  if (typeof c.class === 'string' && c.class) c.class = rename('class', c.class);
  const oldRace = c.race;
  c.race = rename('species', c.race);
  if (c.subrace) c.subrace = rename('subspecies', c.subrace, oldRace);
  c.background = rename('background', c.background);
  (Array.isArray(c.knownSpells) ? c.knownSpells : []).forEach((s) => {
    if (s && s.name) s.name = rename('spell', s.name);
  });
  return c;
}

/**
 * Minimal Homebrew library entry for a missing reference. `path` is the
 * api/client.js registry key; `payload` matches the existing POST bodies.
 * Spell stubs take their level from the character's knownSpells entry.
 */
export function stubPayloadFor(ref, character) {
  const base = { name: ref.name, source: 'Homebrew' };
  switch (ref.type) {
    case 'class':
      return { path: 'classes', payload: { ...base, data: { hitDie: 8, saves: [], stub: true } } };
    case 'species':
      return { path: 'species', payload: { ...base, data: { stub: true } } };
    case 'background':
      return { path: 'backgrounds', payload: { ...base, data: { stub: true } } };
    case 'subclass':
      return { path: 'subclasses', payload: { name: ref.name, parent: ref.parent, source: 'Homebrew', data: { stub: true } } };
    case 'subspecies':
      return { path: 'subspecies', payload: { name: ref.name, parent: ref.parent, source: 'Homebrew', data: { stub: true } } };
    case 'spell': {
      const entry = (Array.isArray(character.knownSpells) ? character.knownSpells : [])
        .find((s) => s && s.name === ref.name);
      const level = Number.isFinite(entry?.level) ? entry.level : 0;
      return { path: 'spells', payload: { ...base, data: { level, classes: [], stub: true } } };
    }
    default:
      throw new Error('Unknown reference type: ' + ref.type);
  }
}
```

Note the test expects `subclasses` payload key order `{name, parent, source, data}` via `deepEqual` — `assert.deepEqual` ignores key order, so the spread form is fine; the explicit object above just keeps `parent` visible.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --test client/src/rules/__tests__/import-linking.test.js`
Expected: PASS. Then `npm run test:client` — PASS.

- [ ] **Step 5: Commit**

```bash
git add client/src/rules/import-linking.js client/src/rules/__tests__/import-linking.test.js
git commit -m "feat: applyResolutions + stub payload builders for import linking"
```

---

### Task 3: ImportReviewModal component + CSS

**Files:**
- Create: `client/src/components/ImportReviewModal.jsx`
- Modify: `public/styles.css` (append)

**Interfaces:**
- Consumes: `refKey` from `client/src/rules/import-linking.js`. Report entries from `resolveReferences` (Task 1). Existing modal CSS classes: `.app-modal-backdrop.open`, `.app-modal.panel`, `.app-modal-head/-heading/-close/-body/-foot`, buttons `.add-btn`, `.pbtn`, message `.import-msg.err` (see `client/src/components/sheet/ChoiceControl.jsx` for the markup pattern).
- Produces (used by Task 4): default export React component with props:
  - `report` — full report array (exact entries included; the modal filters).
  - `busy` — boolean, disables buttons while importing.
  - `error` — string shown as an error row ('' when none).
  - `onCancel()` — close/abort.
  - `onConfirm(decisions)` — decisions = the non-exact report entries, each merged with `{action: 'link'|'keep'|'stub', linkTo?: string}`.

No unit test (JSX component; the repo's node:test suite covers rules only). Verified in the browser in Task 5.

- [ ] **Step 1: Write the component**

Create `client/src/components/ImportReviewModal.jsx`:

```jsx
import { useState } from 'react';
import { refKey } from '../rules/import-linking.js';

// Review step for character import: near-matched references pick a library
// entry (or keep the original name); missing references can create a stub
// Homebrew library entry. Opens only when the report has non-exact entries.
// Spec: docs/superpowers/specs/2026-07-24-import-auto-linking-design.md

const TYPE_LABELS = {
  class: 'Classes', subclass: 'Subclasses', species: 'Species',
  subspecies: 'Subspecies', background: 'Backgrounds', spell: 'Spells'
};
const TYPE_ORDER = ['class', 'subclass', 'species', 'subspecies', 'background', 'spell'];

export default function ImportReviewModal({ report, busy, error, onCancel, onConfirm }) {
  const review = report.filter((r) => r.status !== 'exact');
  const [choices, setChoices] = useState(() => {
    const m = {};
    review.forEach((r) => {
      m[refKey(r)] = r.status === 'near'
        ? { action: 'link', linkTo: r.candidates[0].name }
        : { action: 'stub' };
    });
    return m;
  });
  const set = (r, patch) => setChoices((m) => ({ ...m, [refKey(r)]: { ...m[refKey(r)], ...patch } }));
  const confirm = () => onConfirm(review.map((r) => ({ ...r, ...choices[refKey(r)] })));
  const exactCount = report.length - review.length;

  return (
    <div className="app-modal-backdrop open" aria-hidden="false"
      onClick={(e) => { if (e.target === e.currentTarget && !busy) onCancel(); }}>
      <div className="app-modal panel import-review" role="dialog" aria-modal="true">
        <div className="app-modal-head">
          <span className="app-modal-heading">Review Imported References</span>
          <button className="app-modal-close" type="button" aria-label="Close" onClick={onCancel} disabled={busy}>✕</button>
        </div>
        <div className="app-modal-body">
          <div className="import-note">
            {exactCount} reference{exactCount === 1 ? '' : 's'} matched the library exactly.
            Review the rest below — link near matches, or create stub Homebrew entries to fill in later on the Import page.
          </div>
          {TYPE_ORDER.filter((t) => review.some((r) => r.type === t)).map((t) => (
            <div className="ir-group" key={t}>
              <h3>{TYPE_LABELS[t]}</h3>
              {review.filter((r) => r.type === t).map((r) => {
                const c = choices[refKey(r)];
                return (
                  <div className="ir-row" key={refKey(r)}>
                    <span className="ir-name">{r.name}{r.parent ? <span className="ir-parent"> ({r.parent})</span> : null}</span>
                    {r.status === 'near' ? (
                      <select value={c.action === 'link' ? c.linkTo : ''}
                        onChange={(e) => set(r, e.target.value
                          ? { action: 'link', linkTo: e.target.value }
                          : { action: 'keep', linkTo: '' })}>
                        {r.candidates.map((cand) => (
                          <option key={cand.name} value={cand.name}>Link to “{cand.name}”</option>
                        ))}
                        <option value="">Keep “{r.name}” as-is</option>
                      </select>
                    ) : (
                      <label className="ir-stub">
                        <input type="checkbox" checked={c.action === 'stub'}
                          onChange={(e) => set(r, { action: e.target.checked ? 'stub' : 'keep' })} />
                        create stub library entry
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          {error ? <div className="import-msg err">{error}</div> : null}
        </div>
        <div className="app-modal-foot">
          <button className="add-btn" onClick={confirm} disabled={busy}>{busy ? 'Importing…' : 'Import Character'}</button>
          <button className="pbtn" style={{ marginLeft: 8 }} onClick={onCancel} disabled={busy}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Append CSS**

Append to `public/styles.css`:

```css
/* ---- Import review modal (character import auto-linking) ---- */
.import-review .ir-group { margin-top: 12px; }
.import-review .ir-group h3 {
  margin: 0 0 6px; font-size: 0.8rem; text-transform: uppercase;
  letter-spacing: 0.08em; opacity: 0.75;
}
.import-review .ir-row {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: 6px 0;
}
.import-review .ir-name { font-weight: 600; }
.import-review .ir-parent { font-weight: 400; opacity: 0.65; font-size: 0.85em; }
.import-review .ir-stub { display: flex; align-items: center; gap: 6px; cursor: pointer; }
.import-review select { max-width: 60%; }
```

- [ ] **Step 3: Verify the build compiles**

Run: `npm run build`
Expected: Vite build succeeds with no errors (component isn't mounted yet — this catches syntax problems only).

- [ ] **Step 4: Commit**

```bash
git add client/src/components/ImportReviewModal.jsx public/styles.css
git commit -m "feat: ImportReviewModal for character-import reference review"
```

---

### Task 4: Wire the review flow into ProfileBar

**Files:**
- Modify: `client/src/components/sheet/ProfileBar.jsx`

**Interfaces:**
- Consumes: `resolveReferences`, `applyResolutions`, `stubPayloadFor`, `normalizeName` (Tasks 1–2); `ImportReviewModal` (Task 3); `api` registry trios from `client/src/api/client.js` (`api.classes.import(payload)` etc.); `data`, `customSpells`, `reloadRegistry`, `importCharacterJson` from the `useCharacter()` context (all already provided by `characterStore.jsx` — do not modify the store).
- Produces: no new exports; `ProfileBar` behavior changes only.

- [ ] **Step 1: Rewrite ProfileBar**

Replace the full contents of `client/src/components/sheet/ProfileBar.jsx` with:

```jsx
import { useRef, useState } from 'react';
import { useCharacter } from '../../state/characterStore.jsx';
import * as api from '../../api/client.js';
import { resolveReferences, applyResolutions, stubPayloadFor, normalizeName } from '../../rules/import-linking.js';
import ImportReviewModal from '../ImportReviewModal.jsx';

// Profile switcher + save status (ports partials/profile-bar.html and
// bindProfileBar). The sidebar collapse toggle now lives inside the sidebar.
//
// Character import runs a linking pass first (rules/import-linking.js):
// exact references import silently; near/missing ones open ImportReviewModal,
// which can rewrite names to library entries and create stub Homebrew entries
// before the normal importCharacterJson path runs.
export default function ProfileBar() {
  const {
    character, profiles, loadCharacter, newCharacter, duplicateCharacter,
    importCharacterJson, saveStatus, viewOnly, data, customSpells, reloadRegistry
  } = useCharacter();
  const fileRef = useRef(null);
  // { parsed, raw, report } while the review modal is open.
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const [modalError, setModalError] = useState('');

  const onImportFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      // Same unwrap importCharacterJson performs; resolution needs the raw character.
      const raw = (parsed && parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data))
        ? parsed.data : parsed;
      const report = (raw && typeof raw === 'object' && !Array.isArray(raw) && data)
        ? resolveReferences(raw, data, customSpells)
        : [];
      if (report.some((r) => r.status !== 'exact')) {
        setModalError('');
        setPending({ parsed, raw, report });
        return;
      }
      await importCharacterJson(parsed);
    } catch (err) {
      window.alert('Import failed: ' + err.message);
    }
  };

  // Stub parents may themselves have been renamed in the review — a stubbed
  // subclass under a near-matched class must attach to the linked class name.
  const resolvedParentFor = (d, decisions) => {
    if (!d.parent) return undefined;
    const parentType = d.type === 'subclass' ? 'class' : 'species';
    const pd = decisions.find((x) => x.type === parentType && normalizeName(x.name) === normalizeName(d.parent));
    return (pd && pd.linkTo) || d.parent;
  };

  const onReviewConfirm = async (decisions) => {
    setBusy(true);
    setModalError('');
    try {
      const renamed = applyResolutions(pending.raw, decisions);
      for (const d of decisions) {
        if (d.action !== 'stub') continue;
        const { path, payload } = stubPayloadFor(
          { ...d, parent: resolvedParentFor(d, decisions) }, renamed);
        await api[path].import(payload);
      }
      await reloadRegistry();
      const wrapped = pending.parsed !== pending.raw
        ? { ...pending.parsed, data: renamed }
        : renamed;
      await importCharacterJson(wrapped);
      setPending(null);
    } catch (err) {
      setModalError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const statusText = saveStatus === 'saving' ? 'Saving…'
    : saveStatus === 'error' ? 'Save failed — check the server' : 'Saved';

  return (
    <div className="profile-bar">
      <label>Profile</label>
      <select value={character.id || ''} onChange={(e) => { if (e.target.value) loadCharacter(e.target.value); }}>
        {profiles.length === 0 && <option value="">No saved characters</option>}
        {profiles.map((c) => (
          <option key={c.id} value={c.id}>{(c.name || 'Unnamed')} — {c.class || '?'} {c.level || 1}</option>
        ))}
      </select>
      <button className="pbtn" onClick={newCharacter}>+ New</button>
      <button className="pbtn" title="Import a character from a JSON file" onClick={() => fileRef.current?.click()}>Import</button>
      <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={onImportFile} />
      <button className="pbtn" onClick={duplicateCharacter}>Duplicate</button>
      <span className={'save-status' + (saveStatus === 'saving' ? ' saving' : '')}>
        {viewOnly ? 'View only' : statusText}
      </span>
      {pending && (
        <ImportReviewModal report={pending.report} busy={busy} error={modalError}
          onCancel={() => { if (!busy) setPending(null); }}
          onConfirm={onReviewConfirm} />
      )}
    </div>
  );
}
```

Behavior notes the implementer must preserve:
- `importCharacterJson` still receives the original wrapper shape when there was one (so a `{name, data}` export keeps its name) — the `pending.parsed !== pending.raw` check distinguishes wrapper vs. bare object because `raw` is `parsed.data` by reference when wrapped.
- Library-JSON files (arrays, `{type: 'class'}` entries) fall through with an empty report and hit `importCharacterJson`'s existing guard, producing the same alert as today.
- A failed stub POST leaves the modal open with the error shown; nothing else runs (no partial character).

- [ ] **Step 2: Run the test suite and build**

Run: `npm run test:client` — expected PASS.
Run: `npm run build` — expected: Vite build succeeds.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/sheet/ProfileBar.jsx
git commit -m "feat: character import runs reference auto-linking with review modal"
```

---

### Task 5: End-to-end browser verification

**Files:**
- No source changes expected (fixes only if verification finds bugs).
- Create (scratch, not committed): a test import JSON — write it to the session scratchpad, not the repo.

**Interfaces:**
- Consumes: the full flow from Tasks 1–4; dev server via `SKIP_AUTH=true npm start` (API on :3000) or the existing `.claude/launch.json` configuration.

- [ ] **Step 1: Craft a test character JSON** (scratchpad file `import-test.json`)

```json
{
  "name": "Linky McTestface",
  "class": "Wizzard",
  "classes": [{ "name": "Wizzard", "level": 3, "subclass": "Evoken" }],
  "race": "Elf",
  "subrace": "High Elf",
  "background": "Urchen",
  "knownSpells": [
    { "name": "Fireball", "level": 3, "tags": [] },
    { "name": "Chrono Blast", "level": 2, "tags": [] }
  ],
  "abilities": { "str": 10, "dex": 14, "con": 12, "int": 16, "wis": 10, "cha": 10 }
}
```

Expected report: `Wizzard` near→Wizard, `Evoken` missing→stub (real builtin subclass is "Evocation"; near-match to "Evoker" only occurs against the unit-test fixture, and Evoken→Evocation edit distance exceeds 2), `Elf`/`High Elf`/`Fireball` exact, `Urchen` near→Urchin, `Chrono Blast` missing.

- [ ] **Step 2: Start the server and open the preview**

Start the dev server (SKIP_AUTH) via the browser-preview tooling, open the sheet page.

- [ ] **Step 3: Import the file and verify the modal**

Click Import in the profile bar, pick the JSON. Verify: modal opens; near rows pre-select the right candidates; `Chrono Blast` shows a checked "create stub library entry" box; exact count reads 3.

- [ ] **Step 4: Confirm and verify the outcome**

Click Import Character. Verify:
- New profile "Linky McTestface" loads; Settings tab shows class Wizard / subclass Evoker, species Elf / High Elf, background Urchin.
- Spells tab lists Fireball and Chrono Blast; Chrono Blast resolves (stub exists).
- The Import page → Spells edit-select now contains "Chrono Blast" (Homebrew).
- Browser console free of errors.

- [ ] **Step 5: Verify the silent path and cancel path**

Export the just-imported character (Settings → Export JSON), re-import it: no modal (all names now exact or dangling-kept — if `Urchen` was kept as-is it may re-prompt; accept that as correct behavior since the reference is still unresolved). Then import the test file again and hit Cancel: no new profile, no new library entries.

- [ ] **Step 6: Commit any fixes**

If verification exposed bugs, fix, re-run `npm run test:client` and re-verify, then commit:

```bash
git add -A client/ public/
git commit -m "fix: import auto-linking issues found in browser verification"
```
