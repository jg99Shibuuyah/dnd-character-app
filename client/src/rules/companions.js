// Companion stat-block context. Extracted from public/app.js companionCtx():
// everything a COMPANION_TEMPLATES entry needs to compute its stats for a
// character.

import { mod, fmt, profBonus } from './core.js';
import { effectiveAbilities } from './abilities.js';
import { equipmentGrantedSpells } from './equipment.js';
import { pickedClasses } from './classes.js';
import { gameData } from './builtin-data.js';

const defaults = () => gameData;

export function newManualCompanion() {
  return { uid: 'c' + Date.now() + Math.floor(Math.random() * 1000), templateId: null,
    name: 'New Companion', typeLine: '', ac: 12, hpMax: 10, hpCurrent: 10, hpTemp: 0,
    speed: '30 ft.', abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    skillsText: '', featuresText: '', actionsText: '', spellsText: '', notes: '', collapsed: false };
}

export function companionCtx(character, data = defaults()) {
  const eff = effectiveAbilities(character, data);
  const pb = profBonus(character.level);
  const picked = pickedClasses(character, data);
  const amod = (k) => mod(eff[k] || 10);
  const classLevel = (name) => { const c = picked.find((p) => p.name === name); return c ? (c.level || 1) : 0; };
  const subclassLevel = (cls, sub) => { const c = picked.find((p) => p.name === cls && p.subclass === sub); return c ? (c.level || 1) : 0; };
  // Spellcasting mod for a class; with no class given (or a class the character
  // doesn't cast with), fall back to the best casting stat among picked classes.
  const castMod = (name) => {
    const cd = name && data.classData[name];
    if (cd && cd.casting && cd.casting.ability) return amod(cd.casting.ability);
    const mods = picked.map((p) => data.classData[p.name])
      .filter((d) => d && d.casting && d.casting.ability)
      .map((d) => amod(d.casting.ability));
    return mods.length ? Math.max(...mods) : amod('int');
  };
  const known = new Set([...character.knownSpells.map((s) => s.name), ...equipmentGrantedSpells(character).map((s) => s.name)]
    .map((n) => (n || '').toLowerCase()));
  const bestSlotLevel = (min) => {
    let best = 0;
    (character.spellSlots || []).forEach((s, i) => { if (s && s.total > 0) best = Math.max(best, i + 1); });
    if (character.pactSlots && character.pactSlots.total > 0) best = Math.max(best, character.pactSlots.level || 1);
    return Math.max(min || 1, best);
  };
  return { pb, level: character.level || 1, abilities: eff, amod, fmt,
    classLevel, subclassLevel, castMod, spellAtk: (name) => pb + castMod(name),
    knowsSpell: (n) => known.has((n || '').toLowerCase()), bestSlotLevel };
}

// Library popups have no character loaded: render templates for a baseline
// character (fresh unlock, +2 PB, +0 modifiers) and lean on the formula text.
export function companionBaselineCtx() {
  return { pb: 2, level: 3, abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    amod: () => 0, fmt,
    classLevel: () => 3, subclassLevel: () => 3, castMod: () => 0, spellAtk: () => 2,
    knowsSpell: () => true, bestSlotLevel: (min) => Math.max(1, min || 1) };
}
