import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultCharacter } from '../core.js';
import { parseSpeciesLanguages, speciesLanguages, availableLanguagePool, characterLanguages } from '../languages.js';
import { loadBuiltins } from './test-helpers.js';

const data = loadBuiltins();

test('parseSpeciesLanguages: extracts concrete names and drops "choose N" filler', () => {
  assert.deepEqual(parseSpeciesLanguages('Common, Elvish'), ['Common', 'Elvish']);
  assert.deepEqual(parseSpeciesLanguages('Common + one'), ['Common']);
  assert.deepEqual(parseSpeciesLanguages('Common, Elvish + one'), ['Common', 'Elvish']);
  assert.deepEqual(parseSpeciesLanguages('Common + Draconic or Infernal'), ['Common', 'Draconic', 'Infernal']);
  assert.deepEqual(parseSpeciesLanguages('Common + one other'), ['Common']);
  assert.deepEqual(parseSpeciesLanguages(''), []);
});

test('speciesLanguages: auto-grants from the character species', () => {
  const c = defaultCharacter();
  c.race = 'Elf';
  assert.deepEqual(speciesLanguages(c, data), ['Common', 'Elvish']);
  c.race = 'Human'; // "Common + one" -> just Common
  assert.deepEqual(speciesLanguages(c, data), ['Common']);
});

test('availableLanguagePool: includes canonical + 5E species languages, sorted & unique', () => {
  const pool = availableLanguagePool(data);
  ['Common', 'Elvish', 'Dwarvish', 'Draconic', 'Infernal', 'Deep Speech', 'Undercommon'].forEach((l) =>
    assert.ok(pool.includes(l), `pool should include ${l}`));
  // sorted and de-duplicated
  assert.deepEqual([...pool].sort((a, b) => a.localeCompare(b)), pool);
  assert.equal(new Set(pool.map((l) => l.toLowerCase())).size, pool.length);
});

test('characterLanguages: separates granted from added and dedupes overlap', () => {
  const c = defaultCharacter();
  c.race = 'Elf'; // grants Common, Elvish
  c.languages = ['Draconic', 'Elvish']; // Elvish overlaps a granted language
  const { granted, added } = characterLanguages(c, data);
  assert.deepEqual(granted, ['Common', 'Elvish']);
  assert.deepEqual(added, ['Draconic']); // Elvish dropped from added (already granted)
});
