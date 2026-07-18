// Spell lookup + detail rendering shared by the Spells and Actions tabs.
// Ported from spellInfo / spellRowMarkers / spellDetailEntry in app.js.

import { esc, levelLabel } from './core.js';
import { spellNeedsConcentration } from './spellcasting.js';
import { builtinSpellInfo } from './import-forms.js';

// Resolve a spell's detail from imported data first, then the built-in
// reference. `customSpells` is the DB-imported map; `data` is the game bundle.
export function spellInfo(customSpells, data, name) {
  const imp = customSpells[name];
  const bi = imp ? null : builtinSpellInfo(data, name);
  return { imp, bi, det: imp || bi || {}, kind: imp ? 'imported' : (bi ? 'built-in' : 'homebrew') };
}

// At-a-glance markers for a spell row: concentration + required components.
export function spellRowMarkersHtml(customSpells, data, name) {
  const { det } = spellInfo(customSpells, data, name);
  let out = '';
  if (spellNeedsConcentration(det)) out += '<span class="spell-mark conc" title="Concentration — you must keep concentration or the spell ends">◈ Conc</span>';
  if (det.components) out += `<span class="spell-mark comp" title="Components you need to cast this spell">${esc(det.components)}</span>`;
  return out;
}

// The shared mini legend appended under each spell list.
export function spellLegendHtml() {
  return `<div class="spell-legend">
    <span class="spell-legend-item"><span class="spell-mark conc">◈ Conc</span> needs concentration</span>
    <span class="spell-legend-item"><span class="spell-mark comp">V·S·M</span> components you need</span>
    <span class="spell-legend-item"><span class="spell-legend-tip">click a spell</span> what it does</span>
  </div>`;
}

// A Notes-search-style popup entry for a single spell (opened from the Spells
// and Actions tabs). editLink is passed in to avoid a circular import.
export function spellDetailEntry(customSpells, data, name, fallbackLevel, editLink) {
  const { imp, bi, det, kind } = spellInfo(customSpells, data, name);
  const level = imp ? (Number(imp.level) || 0) : (bi ? bi.level : (Number(fallbackLevel) || 0));
  const classes = imp
    ? (Array.isArray(imp.classes) && imp.classes.length ? imp.classes : ['every class'])
    : (bi ? bi.classes : []);
  const bits = [det.school, det.castingTime && 'cast ' + det.castingTime, det.range && 'range ' + det.range,
    det.components && 'needs ' + det.components, det.duration && 'duration ' + det.duration].filter(Boolean).join(' · ');
  const conc = spellNeedsConcentration(det);
  return {
    name,
    badges: [levelLabel(level), imp ? imp.source : null, kind, conc ? 'concentration' : null].filter(Boolean),
    full: `<div class="nr-meta">${esc(levelLabel(level))}${classes.length ? ' · ' + esc(classes.join(', ')) : ''}</div>
       ${bits ? `<div class="nr-meta">${esc(bits)}</div>` : ''}
       ${(det.tags || []).length ? `<div class="nr-meta">tags: ${esc(det.tags.join(', '))}</div>` : ''}
       ${det.desc
         ? `<div class="feat-desc">${esc(det.desc)}</div>`
         : '<div class="feat-desc">No description on file — this is a name-only spell. Import it in the Library to add details.</div>'}`,
    edit: editLink ? editLink('spell', name, 'Edit spell in Library') : undefined
  };
}

// Class names offered in the Spell Library select: builtin caster classes plus
// any class referenced by an imported spell.
export function spellClassNames(customSpells, data) {
  const fromCustoms = Object.values(customSpells).flatMap((s) => Array.isArray(s.classes) ? s.classes : []);
  return [...new Set([...data.spellClasses, ...fromCustoms])].sort();
}
