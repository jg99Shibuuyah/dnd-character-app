// Spellcasting rules: slot computation (PHB single/multiclass + pact magic),
// multiclass prerequisites, and spell lookups. Extracted from public/app.js.

import { gameData } from './builtin-data.js';

const defaults = () => gameData;

// Compute leveled + pact slots from the class list using the PHB tables.
export function computeSpellSlots(picked, data = defaults()) {
  const totals = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  const leveled = picked.filter((c) => { const t = data.classData[c.name] && data.classData[c.name].casting; return t && (t.type === 'full' || t.type === 'half'); });
  const warlocks = picked.filter((c) => { const t = data.classData[c.name] && data.classData[c.name].casting; return t && t.type === 'pact'; });
  let table = null, lvl = 0;
  if (leveled.length === 1) {
    const c = leveled[0]; const cast = data.classData[c.name].casting;
    if (cast.roundUp) { // Artificer: half caster rounded UP — reads the full table at ceil(level/2).
      lvl = Math.ceil((c.level || 1) / 2); table = data.fullSlots;
    } else {
      lvl = c.level || 1; table = cast.type === 'full' ? data.fullSlots : data.halfSlots;
    }
  } else if (leveled.length > 1) {
    // Multiclass: full levels + half of half-caster levels (Artificer rounds up), read off the full table.
    lvl = leveled.reduce((s, c) => {
      const cast = data.classData[c.name].casting;
      if (cast.type === 'full') return s + (c.level || 1);
      return s + (cast.roundUp ? Math.ceil((c.level || 1) / 2) : Math.floor((c.level || 1) / 2));
    }, 0);
    table = data.fullSlots;
  }
  if (table && lvl > 0) { (table[Math.min(20, Math.max(1, lvl))] || []).forEach((n, i) => { totals[i] += n; }); }
  const wl = warlocks.reduce((s, c) => s + (c.level || 1), 0);
  const pact = wl > 0 ? data.pactSlots[Math.min(20, wl)] : null;
  return { totals, pact, hasCaster: leveled.length > 0 || wl > 0 };
}

// Overwrite slot totals from the class list when auto mode is on, preserving
// how many are already spent. Non-casters are left alone so manual values
// survive. Mutates character.spellSlots / character.pactSlots.
export function refreshAutoSlots(character, picked, data = defaults()) {
  if (!character.autoSlots) return;
  const { totals, pact, hasCaster } = computeSpellSlots(picked, data);
  if (!hasCaster) return;
  character.spellSlots.forEach((s, i) => { s.total = totals[i]; if (s.used > s.total) s.used = s.total; });
  if (!character.pactSlots) character.pactSlots = { total: 0, used: 0, level: 1 };
  if (pact) { character.pactSlots.total = pact.n; character.pactSlots.level = pact.l; if (character.pactSlots.used > pact.n) character.pactSlots.used = pact.n; }
  else { character.pactSlots.total = 0; character.pactSlots.used = 0; }
}

export function slotsRemainingAtOrAbove(character, level) {
  let n = 0;
  for (let i = level - 1; i < 9; i++) n += Math.max(0, character.spellSlots[i].total - character.spellSlots[i].used);
  const pact = character.pactSlots;
  if (pact && pact.level >= level) n += Math.max(0, pact.total - pact.used);
  return n;
}

// PHB multiclass spellcasting: full-caster levels + half of paladin/ranger
// levels. Warlock pact magic stacks separately.
export function multiclassCasterLevel(picked, data = defaults()) {
  return picked.reduce((s, c) => {
    const cast = data.classData[c.name] && data.classData[c.name].casting;
    if (!cast) return s;
    if (cast.type === 'full') return s + (c.level || 1);
    if (cast.type === 'half') return s + (cast.roundUp ? Math.ceil((c.level || 1) / 2) : Math.floor((c.level || 1) / 2));
    return s;
  }, 0);
}

// PHB multiclass prerequisite check against current ability scores.
export function mcReqStatus(name, abilities, data = defaults()) {
  const req = data.mcReqs[name];
  if (!req) return null;
  const met = req.some((opt) => Object.entries(opt).every(([k, v]) => (abilities[k] || 0) >= v));
  const text = req.map((opt) => Object.entries(opt).map(([k, v]) => k.toUpperCase() + ' ' + v).join(' & ')).join(' or ');
  return { met, text };
}

export function castingSummary(cd) {
  if (!cd.casting) return null;
  const c = cd.casting;
  const ab = c.ability ? c.ability.toUpperCase() : '';
  let text = null;
  if (c.type === 'full') text = `Full caster (${ab}). Spell levels: 1st@L1, 2nd@L3, 3rd@L5, 4th@L7, 5th@L9, 6th@L11, 7th@L13, 8th@L15, 9th@L17.`;
  else if (c.type === 'half' && c.roundUp) text = `Half caster, rounded up (${ab}). Spell levels: 1st@L1, 2nd@L5, 3rd@L9, 4th@L13, 5th@L17.`;
  else if (c.type === 'half') text = `Half caster (${ab}). Spell levels: 1st@L2, 2nd@L5, 3rd@L9, 4th@L13, 5th@L17.`;
  else if (c.type === 'pact') text = `Pact magic (${ab}): slots refresh on a short rest. Slot level: 1st@L1, 2nd@L3, 3rd@L5, 4th@L7, 5th@L9; Mystic Arcanum adds 6th–9th at L11/13/15/17.`;
  if (c.note) text = text ? text + ' ' + c.note : c.note;
  return text;
}

export function isKnown(character, name) {
  return character.knownSpells.some((s) => s.name.toLowerCase() === name.toLowerCase());
}

// Concentration isn't a structured field on built-ins, so sniff the duration
// and description text.
export function spellNeedsConcentration(det) {
  return /concentration/i.test([det.duration, det.desc].filter(Boolean).join(' '));
}

// Imported spells that belong to a class's library: an explicit class list
// restricts them; an empty/missing list makes them available to every class.
export function customSpellsForClass(customSpells, className) {
  return Object.entries(customSpells)
    .filter(([, s]) => !(Array.isArray(s.classes) && s.classes.length) || s.classes.includes(className))
    .map(([name, s]) => ({ name, level: Number(s.level) || 0, imported: true, spell: s }));
}
