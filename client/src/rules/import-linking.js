// Import auto-linking: resolve a character's name references (class, subclass,
// species, subspecies, background, spells) against the merged registry.
// Pure module — no DOM, no api/state imports — so node:test can exercise it.
// Spec: docs/superpowers/specs/2026-07-24-import-auto-linking-design.md

/** Lowercase, strip diacritics + punctuation, collapse whitespace. */
export function normalizeName(s) {
  return String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
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

// Collapse to the tightest comparison form: normalized, with spaces removed too,
// so multi-word variants ('fire ball') rank as identical to their solid spelling
// ('Fireball'). normalizeName itself keeps spaces — refKey/dedup rely on that.
const matchNorm = (s) => normalizeName(s).replace(/\s+/g, '');

// Match one name against a universe. Only an exact string match is 'exact';
// normalized equality (score 0) and edit distance <= 2 rank as 'near'.
function matchName(name, universe) {
  if (universe.includes(name)) return { status: 'exact', candidates: [] };
  const norm = matchNorm(name);
  const scored = [];
  for (const cand of universe) {
    const cn = matchNorm(cand);
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
