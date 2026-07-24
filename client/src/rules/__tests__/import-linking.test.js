import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeName, collectReferences, resolveReferences, refKey,
  applyResolutions, stubPayloadFor
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

test('applyResolutions rewrites linked names everywhere, leaves keep/stub alone', () => {
  const c = char({
    class: 'Wizzard',
    classes: [{ name: 'Wizzard', subclass: 'Blade singer' }],
    race: 'Elff', subrace: 'High Elf', background: 'Urchen',
    knownSpells: [{ name: 'Firebal', level: 3 }, { name: 'Chrono Blast', level: 1 }]
  });
  const out = applyResolutions(c, [
    { type: 'class', name: 'Wizzard', action: 'link', linkTo: 'Wizard' },
    { type: 'subclass', name: 'Blade singer', parent: 'Wizzard', action: 'link', linkTo: 'Bladesinger' },
    { type: 'species', name: 'Elff', action: 'link', linkTo: 'Elf' },
    { type: 'background', name: 'Urchen', action: 'keep', linkTo: '' },
    { type: 'spell', name: 'Firebal', action: 'link', linkTo: 'Fireball' },
    { type: 'spell', name: 'Chrono Blast', action: 'stub' }
  ]);
  assert.equal(out.class, 'Wizard'); // legacy field follows
  assert.deepEqual(out.classes, [{ name: 'Wizard', subclass: 'Bladesinger' }]);
  assert.equal(out.race, 'Elf');
  assert.equal(out.subrace, 'High Elf');
  assert.equal(out.background, 'Urchen'); // kept as-is
  assert.equal(out.knownSpells[0].name, 'Fireball');
  assert.equal(out.knownSpells[0].level, 3); // other fields untouched
  assert.equal(out.knownSpells[1].name, 'Chrono Blast'); // stub keeps the name
  assert.notEqual(out, c); // clone, not mutation
  assert.equal(c.classes[0].name, 'Wizzard');
});

test('applyResolutions keeps two parents sharing a subclass name separate via refKey parent', () => {
  const c = char({
    classes: [{ name: 'Wizard', subclass: 'Champion' }, { name: 'Fighter', subclass: 'Champion' }]
  });
  const out = applyResolutions(c, [
    { type: 'subclass', name: 'Champion', parent: 'Wizard', action: 'link', linkTo: 'Evoker' }
  ]);
  assert.equal(out.classes[0].subclass, 'Evoker'); // Wizard-parented Champion rewritten
  assert.equal(out.classes[1].subclass, 'Champion'); // Fighter-parented Champion untouched
});

test('stubPayloadFor builds per-type Homebrew payloads with stub flag', () => {
  const c = char({ knownSpells: [{ name: 'Chrono Blast', level: 4 }] });
  assert.deepEqual(stubPayloadFor({ type: 'class', name: 'Chronomancer' }, c), {
    path: 'classes',
    payload: { name: 'Chronomancer', source: 'Homebrew', data: { hitDie: 8, saves: [], stub: true } }
  });
  assert.deepEqual(stubPayloadFor({ type: 'subclass', name: 'Time Lord', parent: 'Wizard' }, c), {
    path: 'subclasses',
    payload: { name: 'Time Lord', parent: 'Wizard', source: 'Homebrew', data: { stub: true } }
  });
  assert.deepEqual(stubPayloadFor({ type: 'spell', name: 'Chrono Blast' }, c), {
    path: 'spells',
    payload: { name: 'Chrono Blast', source: 'Homebrew', data: { level: 4, classes: [], stub: true } }
  });
  assert.deepEqual(stubPayloadFor({ type: 'species', name: 'Chronoid' }, c), {
    path: 'species',
    payload: { name: 'Chronoid', source: 'Homebrew', data: { stub: true } }
  });
  assert.deepEqual(stubPayloadFor({ type: 'subspecies', name: 'Chronoid Prime', parent: 'Chronoid' }, c), {
    path: 'subspecies',
    payload: { name: 'Chronoid Prime', parent: 'Chronoid', source: 'Homebrew', data: { stub: true } }
  });
  assert.deepEqual(stubPayloadFor({ type: 'background', name: 'Drifter' }, c), {
    path: 'backgrounds',
    payload: { name: 'Drifter', source: 'Homebrew', data: { stub: true } }
  });
});

test('stubPayloadFor spell level defaults to 0 when the character has no entry', () => {
  const { payload } = stubPayloadFor({ type: 'spell', name: 'Ghost Note' }, char());
  assert.equal(payload.data.level, 0);
});
