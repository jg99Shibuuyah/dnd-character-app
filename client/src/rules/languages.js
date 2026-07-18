// Language rules — pure helpers shared by the Skills tab (auto-generated list)
// and Character Settings (add/remove management).
//
// Species record their languages as free text (e.g. "Common, Elvish + one",
// "Common + Draconic or Infernal"). We parse concrete language names out of
// those strings, dropping "choose N" filler, so we can both auto-grant a
// character's species languages and pool a pick-list for the settings dropdown.

const subKey = (parent, name) => parent + '::' + name;

// Canonical D&D languages (5E + 5.5E standard/rare set). Seeds the pick-list so
// it stays complete even when a species' free text is vague ("Common + one").
export const STANDARD_LANGUAGES = [
  'Common', 'Common Sign Language', 'Dwarvish', 'Elvish', 'Giant', 'Gnomish',
  'Goblin', 'Halfling', 'Orc',
  'Abyssal', 'Celestial', 'Deep Speech', 'Draconic', 'Druidic', 'Infernal',
  'Primordial', 'Sylvan', "Thieves' Cant", 'Undercommon'
];

// A parsed token is a real language only if it isn't a "choose one/other" phrase.
function isConcreteLanguage(token) {
  const t = token.trim();
  if (!t) return false;
  if (/\b(one|two|three|other|others|choice|choose|any|more|extra|additional)\b/i.test(t)) return false;
  return true;
}

// "Common, Elvish + one" -> ['Common', 'Elvish']; "Common + Draconic or Infernal"
// -> ['Common', 'Draconic', 'Infernal']. Splits on commas, +, and or/and.
export function parseSpeciesLanguages(str) {
  if (!str || typeof str !== 'string') return [];
  return str
    .split(/,|\+|\bor\b|\band\b/i)
    .map((t) => t.trim())
    .filter(isConcreteLanguage);
}

// Languages a character knows automatically from their species (+ subspecies).
export function speciesLanguages(character, data) {
  const out = [];
  const seen = new Set();
  const add = (l) => { const k = l.toLowerCase(); if (!seen.has(k)) { seen.add(k); out.push(l); } };
  const sd = data?.speciesData?.[character.race];
  if (sd) parseSpeciesLanguages(sd.languages).forEach(add);
  if (character.subrace) {
    const ss = data?.subspeciesData?.[subKey(character.race, character.subrace)];
    if (ss) parseSpeciesLanguages(ss.languages).forEach(add);
  }
  return out;
}

// The full pick-list for the settings dropdown: canonical languages plus every
// concrete language named by a 5E / 5.5E species, sorted and de-duplicated.
export function availableLanguagePool(data) {
  const seen = new Map(); // lowercase -> display form
  const add = (l) => { const k = l.toLowerCase(); if (!seen.has(k)) seen.set(k, l); };
  STANDARD_LANGUAGES.forEach(add);
  Object.values(data?.speciesData || {}).forEach((sd) => {
    const src = (sd.source || '').toUpperCase();
    if (src === '5E' || src === '5.5E') parseSpeciesLanguages(sd.languages).forEach(add);
  });
  return [...seen.values()].sort((a, b) => a.localeCompare(b));
}

// Split a character's known languages into species-granted (locked) and
// user-added (removable), with added deduped against granted.
export function characterLanguages(character, data) {
  const granted = speciesLanguages(character, data);
  const grantedKeys = new Set(granted.map((l) => l.toLowerCase()));
  const added = (character.languages || []).filter((l) => !grantedKeys.has(l.toLowerCase()));
  return { granted, added };
}
