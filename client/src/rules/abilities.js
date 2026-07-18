// Derived stats: effective abilities, AC, saves, skills, passives.
// Extracted from public/app.js (effectiveAbilities, computeAC,
// grantedSkillSources, skillProficient, and the compute half of recalc()).
//
// Game data comes in through the optional `data` parameter so Node tests can
// inject fixtures; browser callers omit it and get the shared globals.

import { mod, profBonus } from './core.js';
import { equippedEquip, parseAbilityEffect, equipSkillBonus } from './equipment.js';
import { gameData } from './builtin-data.js';

const defaults = () => gameData;

// Base ability scores modified by equipped gear (adds stack; sets take the max,
// then adds apply on top). Used everywhere derived stats are computed.
export function effectiveAbilities(character, data = defaults()) {
  const eff = {}, adds = {}, sets = {};
  data.abilities.forEach((a) => { eff[a.key] = character.abilities[a.key] || 0; });
  equippedEquip(character).forEach((it) => {
    const ab = it.abilities || {};
    data.abilities.forEach((a) => {
      const e = parseAbilityEffect(ab[a.key]);
      if (!e) return;
      if (e.mode === 'add') adds[a.key] = (adds[a.key] || 0) + e.value;
      else sets[a.key] = Math.max(a.key in sets ? sets[a.key] : -Infinity, e.value);
    });
  });
  data.abilities.forEach((a) => {
    let v = eff[a.key];
    if (a.key in sets) v = Math.max(v, sets[a.key]);
    eff[a.key] = v + (adds[a.key] || 0);
  });
  return eff;
}

// Computed Armor Class: base 10 + DEX mod (gear-adjusted), with equipped armor.
// "+2" stacks (shield, ring of protection); "=16" is a flat armor base that
// replaces 10+DEX — the higher of the two bases wins, then bonuses apply.
export function computeAC(character, data = defaults()) {
  const dexMod = mod(effectiveAbilities(character, data).dex);
  const unarmored = 10 + dexMod;
  let adds = 0; const sets = [];
  equippedEquip(character).forEach((it) => {
    const e = parseAbilityEffect(it.ac);
    if (!e) return;
    if (e.mode === 'set') sets.push(e.value); else adds += e.value;
  });
  const armorBase = sets.length ? Math.max(...sets) : null;
  const usedArmor = armorBase !== null && armorBase >= unarmored;
  const base = usedArmor ? armorBase : unarmored;
  return { ac: base + adds, dexMod, usedArmor, armorBase, adds };
}

// Species and backgrounds GRANT fixed skill proficiencies (classes only offer
// choices). Grants are computed live, never written into skillProf.
export function grantedSkillSources(character, skillName, data = defaults()) {
  const out = [];
  const sd = data.speciesData[character.race];
  if (sd && Array.isArray(sd.skills) && sd.skills.includes(skillName)) out.push({ by: character.race, kind: 'species' });
  const bd = data.backgroundData[character.background];
  if (bd && Array.isArray(bd.skills) && bd.skills.includes(skillName)) out.push({ by: character.background, kind: 'background' });
  return out;
}

// Effective proficiency for skills[i]: manually toggled OR granted.
export function skillProficient(character, i, data = defaults()) {
  return !!character.skillProf['sk' + i]
    || grantedSkillSources(character, data.skills[i].name, data).length > 0;
}

// The compute half of the legacy recalc(): every number the sheet displays,
// with none of the DOM writes. Components read from this one object.
export function deriveStats(character, data = defaults()) {
  const pb = profBonus(character.level);
  const eff = effectiveAbilities(character, data);
  const saves = {};
  data.abilities.forEach((a) => {
    saves[a.key] = mod(eff[a.key]) + (character.saveProf[a.key] ? pb : 0);
  });
  const skillBonuses = data.skills.map((s, i) =>
    mod(eff[s.ability]) + (skillProficient(character, i, data) ? pb : 0) + equipSkillBonus(character, s.name));
  const passives = {};
  data.skills.forEach((s, i) => {
    if (s.name === 'Perception' || s.name === 'Investigation' || s.name === 'Insight') {
      passives[s.name] = 10 + skillBonuses[i];
    }
  });
  return {
    pb,
    abilities: eff,
    mods: Object.fromEntries(data.abilities.map((a) => [a.key, mod(eff[a.key])])),
    saves,
    skillBonuses,
    passives,
    initiative: mod(eff.dex),
    ac: computeAC(character, data)
  };
}
