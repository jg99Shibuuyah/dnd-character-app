// Import-page helpers ported from public/app.js: text-line parsers, their
// inverses (for loading an entry back into a form), and the bulk-import
// normalization pipeline. All pure.

export const DEFAULT_SPELL_TAGS = ['5E', '5E (legacy)', '5.5E', 'Homebrew'];

// "name | description", one trait per line.
export function parseTraitLines(text) {
  return (text || '').split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const [name, desc] = line.split('|').map((s) => (s || '').trim());
    const t = { name };
    if (desc) t.desc = desc;
    return t;
  }).filter((t) => t.name);
}

// Comma-separated skill names → canonical names (case-insensitive); unknown
// names are rejected so granted proficiencies always match the sheet.
export function parseSkillNames(text, skills) {
  const out = [];
  (text || '').split(',').map((s) => s.trim()).filter(Boolean).forEach((nm) => {
    const hit = skills.find((s) => s.name.toLowerCase() === nm.toLowerCase());
    if (!hit) throw new Error(`Unknown skill "${nm}" — use the 5e skill names (e.g. ${skills[0].name}, ${skills[6].name}).`);
    if (!out.includes(hit.name)) out.push(hit.name);
  });
  return out;
}

export function parseNameList(raw) {
  return (raw || '').split(',').map((s) => s.trim()).filter(Boolean);
}

// features [{lv,name,desc,use,cost,choices}] → "lv | name | desc | use | cost | choices" lines.
export function featuresToLines(features) {
  return (features || []).map((f) => {
    const parts = [f.lv, f.name, f.desc || '', f.use || '', f.cost || '', (f.choices || []).join('; ')]
      .map((p) => String(p == null ? '' : p));
    while (parts.length > 2 && !parts[parts.length - 1]) parts.pop();
    return parts.join(' | ');
  }).join('\n');
}

export function traitsToLines(traits) {
  return (traits || []).map((t) => t.desc ? `${t.name} | ${t.desc}` : t.name).join('\n');
}

// Which built-in class lists carry a spell — used to prefill its class list,
// folding in school + description from the spell details reference.
export function builtinSpellInfo(data, name) {
  const classes = [];
  let level = 0;
  data.spellClasses.forEach((c) => {
    const hit = data.spellData[c].find((s) => s.name === name);
    if (hit) { classes.push(c); level = hit.level; }
  });
  return classes.length ? Object.assign({}, data.spellDetails[name] || {}, { level, classes }) : null;
}

// ---------- Bulk import ----------
// One JSON payload can carry many entries of every type, deduplicated by
// type + parent + name. Classes and species import before their subclasses
// and subspecies so a parent defined in the same batch is available.

const BULK_TYPE_ALIASES = {
  class: 'class', classes: 'class',
  species: 'species',
  subclass: 'subclass', subclasses: 'subclass',
  subspecies: 'subspecies',
  spell: 'spell', spells: 'spell'
};
export const BULK_TYPE_ORDER = { class: 0, species: 1, subclass: 2, subspecies: 3, spell: 4 };

export function bulkTypeFromString(s) {
  return BULK_TYPE_ALIASES[String(s || '').trim().toLowerCase().replace(/[\s_-]+/g, '')] || null;
}

// Best-effort type guess for entries that omit an explicit `type`.
export function inferBulkType(o) {
  const d = (o && o.data && typeof o.data === 'object') ? o.data : o;
  if (!d || typeof d !== 'object') return null;
  if (o.parent != null) {
    if ('subclassLevel' in d || Array.isArray(d.features)) return 'subclass';
    if (Array.isArray(d.traits) || 'asi' in d) return 'subspecies';
    return null;
  }
  if ('hitDie' in d || 'saves' in d || Array.isArray(d.subclasses)) return 'class';
  if ('level' in d || 'castingTime' in d || 'school' in d) return 'spell';
  if ('size' in d || 'speed' in d || Array.isArray(d.traits)) return 'species';
  return null;
}

export function normalizeBulkEntry(o, typeHint) {
  if (!o || typeof o !== 'object' || Array.isArray(o)) return { error: 'not an object' };
  const { name, source, parent, data, type, ...rest } = o;
  const t = typeHint || bulkTypeFromString(type) || inferBulkType(o);
  if (!t) return { error: 'unknown type' };
  const entry = {
    type: t,
    name: typeof name === 'string' ? name.trim() : '',
    source,
    data: (data && typeof data === 'object' && !Array.isArray(data)) ? data : rest
  };
  if (t === 'subclass' || t === 'subspecies') entry.parent = typeof parent === 'string' ? parent.trim() : '';
  return entry;
}

// Flatten any accepted shape (array of typed entries, grouped object of
// type→array, or a single entry) into a list of normalized entries.
export function collectBulkEntries(root) {
  const list = [];
  if (Array.isArray(root)) {
    root.forEach((o) => list.push(normalizeBulkEntry(o)));
  } else if (root && typeof root === 'object') {
    const groups = Object.keys(root).filter((k) => bulkTypeFromString(k) && Array.isArray(root[k]));
    if (groups.length) {
      groups.forEach((k) => {
        const t = bulkTypeFromString(k);
        root[k].forEach((o) => list.push(normalizeBulkEntry(o, t)));
      });
    } else {
      list.push(normalizeBulkEntry(root));
    }
  }
  return list;
}

// Validate + dedupe by type + parent + name (case-insensitive; last wins).
// Returns { queue, problems, dupes } — queue sorted parents-first.
export function prepareBulkQueue(collected) {
  const problems = [];
  const byKey = new Map();
  let dupes = 0;
  collected.forEach((e, i) => {
    const n = i + 1;
    if (e.error) { problems.push(`#${n}: ${e.error} — add a "type" field (class, species, subclass, subspecies, or spell).`); return; }
    if (!e.name) { problems.push(`#${n} (${e.type}): missing name.`); return; }
    if ((e.type === 'subclass' || e.type === 'subspecies') && !e.parent) { problems.push(`#${n} (${e.type} "${e.name}"): missing parent.`); return; }
    if (!e.data || typeof e.data !== 'object' || Array.isArray(e.data) || !Object.keys(e.data).length) {
      problems.push(`#${n} (${e.type} "${e.name}"): missing data fields.`); return;
    }
    const key = e.type + '\0' + (e.parent || '').toLowerCase() + '\0' + e.name.toLowerCase();
    if (byKey.has(key)) dupes++;
    byKey.set(key, e);
  });
  const queue = [...byKey.values()].sort((a, b) => BULK_TYPE_ORDER[a.type] - BULK_TYPE_ORDER[b.type]);
  return { queue, problems, dupes };
}

// Every imported entry in the bulk format, for export / re-import round-trips.
export function exportLibraryEntries(data, customSpells) {
  const strip = (obj) => { const { source, custom, customId, builtin, homebrew, parent, name, ...rest } = obj; return rest; };
  const entries = [];
  Object.entries(data.classData).filter(([, d]) => d.custom).forEach(([name, d]) => entries.push({ type: 'class', name, source: d.source, data: strip(d) }));
  Object.entries(data.speciesData).filter(([, d]) => d.custom).forEach(([name, d]) => entries.push({ type: 'species', name, source: d.source, data: strip(d) }));
  Object.values(data.subclassData).filter((d) => d.custom).forEach((d) => entries.push({ type: 'subclass', parent: d.parent, name: d.name, source: d.source, data: strip(d) }));
  Object.values(data.subspeciesData).filter((d) => d.custom).forEach((d) => entries.push({ type: 'subspecies', parent: d.parent, name: d.name, source: d.source, data: strip(d) }));
  Object.entries(customSpells).forEach(([name, d]) => entries.push({ type: 'spell', name, source: d.source, data: strip(d) }));
  return entries;
}
