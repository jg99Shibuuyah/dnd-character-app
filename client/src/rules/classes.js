// Class list handling and feature choices. Extracted from public/app.js.
// applyClassesToState here is the legacy function minus its DOM write — the
// caller re-renders from the returned/mutated character instead.

import { refreshAutoSlots } from './spellcasting.js';
import { gameData } from './builtin-data.js';

const defaults = () => gameData;

const subKey = (parent, name) => parent + '::' + name;

export function ensureClasses(character, data = defaults()) {
  if (!Array.isArray(character.classes)) character.classes = [];
  if (character.classes.length === 0 && character.class) {
    const base = character.class.split(' / ')[0];
    if (data.classData[base]) character.classes = [{ name: base, level: character.level || 1 }];
  }
}

export function pickedClasses(character, data = defaults()) {
  ensureClasses(character, data);
  return character.classes.filter((c) => c.name && data.classData[c.name]);
}

// Recompute everything derived from the class list: total level (drives
// proficiency bonus), joined class string, primary-class saves, hit dice
// pools, the default spell library, and auto slots. Mutates the character.
export function applyClassesToState(character, data = defaults()) {
  const picked = pickedClasses(character, data);
  character.level = Math.max(1, picked.reduce((s, c) => s + (c.level || 1), 0));
  character.class = picked.map((c) => c.name).join(' / ');
  const primary = picked[0] && data.classData[picked[0].name];
  data.abilities.forEach((a) => { character.saveProf[a.key] = primary ? primary.saves.includes(a.key) : false; });
  if (picked.length) {
    const dice = {};
    picked.forEach((c) => { const d = 'd' + data.classData[c.name].hitDie; dice[d] = (dice[d] || 0) + (c.level || 1); });
    character.hitDice = Object.entries(dice).map(([d, n]) => n + d).join(' + ');
    const caster = picked.find((c) => data.spellData[c.name]);
    if (caster) character.spellClass = caster.name;
  }
  refreshAutoSlots(character, picked, data);
  return character;
}

// ---------- Feature choices ----------

export function featureChoiceKey(owner, name) { return owner + '::' + name; }

export function hasChoices(f) { return Array.isArray(f.choices) && f.choices.length > 0; }

export function normalizeChoice(v) {
  if (!v) return null;
  if (typeof v === 'string') return { name: v, desc: '', custom: false };
  return { name: v.name || '', desc: v.desc || '', custom: !!v.custom };
}

export function chosenFeatureOption(entry, owner, f) {
  return normalizeChoice((entry.featureChoices || {})[featureChoiceKey(owner, f.name)]);
}

// Every choice-offering feature unlocked at this entry's level, from the class
// and its selected subclass.
export function choiceFeaturesFor(entry, data = defaults()) {
  const out = [];
  const cd = data.classData[entry.name];
  if (!cd) return out;
  const lvl = entry.level || 1;
  const collect = (owner, feats) => (feats || []).forEach((f) => {
    if (hasChoices(f) && f.lv <= lvl) out.push({ owner, f, key: featureChoiceKey(owner, f.name) });
  });
  collect(entry.name, cd.features);
  if (entry.subclass) {
    const sc = data.subclassData[subKey(entry.name, entry.subclass)];
    if (sc) collect(entry.subclass, sc.features);
  }
  return out;
}

// Drop picks that no longer belong to the entry's class/subclass, or whose
// stored option is no longer offered. Level is ignored on purpose: dropping to
// a lower level shouldn't discard a pick the character makes again later.
export function pruneFeatureChoices(entry, data = defaults()) {
  const fc = entry.featureChoices;
  if (!fc) return;
  const valid = new Map();
  const collect = (owner, feats) => (feats || []).forEach((f) => {
    if (hasChoices(f)) valid.set(featureChoiceKey(owner, f.name), f.choices);
  });
  const cd = data.classData[entry.name];
  if (cd) collect(entry.name, cd.features);
  if (entry.subclass) {
    const sc = data.subclassData[subKey(entry.name, entry.subclass)];
    if (sc) collect(entry.subclass, sc.features);
  }
  Object.keys(fc).forEach((k) => {
    const opts = valid.get(k);
    if (!opts) { delete fc[k]; return; } // the feature itself is gone
    const c = normalizeChoice(fc[k]);
    // A custom "Other…" pick is the player's own text — keep it as long as the
    // feature exists. A listed pick only survives while it's still offered.
    if (!c || (!c.custom && !opts.includes(c.name))) delete fc[k];
  });
  if (!Object.keys(fc).length) delete entry.featureChoices;
}

// ---------- Import-form parsing ----------

// One feature per line: "lv|name|desc|use|cost|choiceA;choiceB".
export function parseFeatureLines(text) {
  return (text || '').split('\n').map((l) => l.trim()).filter(Boolean).map((line) => {
    const [lvRaw, name, desc, use, cost, choicesRaw] = line.split('|').map((s) => (s || '').trim());
    const f = { lv: Math.max(1, Math.min(20, parseInt(lvRaw) || 1)), name };
    if (desc) f.desc = desc;
    if (use) f.use = use;
    if (cost) f.cost = cost;
    const choices = parseChoiceList(choicesRaw);
    if (choices.length) f.choices = choices;
    return f;
  }).filter((f) => f.name);
}

// Choices are semicolon-separated so option text can still contain commas.
export function parseChoiceList(raw) {
  return (raw || '').split(';').map((s) => s.trim()).filter(Boolean);
}
