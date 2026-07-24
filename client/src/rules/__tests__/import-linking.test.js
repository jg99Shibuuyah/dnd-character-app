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
