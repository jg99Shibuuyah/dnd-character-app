import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultCharacter } from '../core.js';
import { computeSpellSlots, refreshAutoSlots, slotsRemainingAtOrAbove, multiclassCasterLevel, mcReqStatus } from '../spellcasting.js';
import { loadBuiltins } from './test-helpers.js';

const data = loadBuiltins();

test('single full caster reads the full table directly', () => {
  const { totals, pact, hasCaster } = computeSpellSlots([{ name: 'Wizard', level: 5 }], data);
  assert.deepEqual(totals, [4, 3, 2, 0, 0, 0, 0, 0, 0]); // PHB level 5
  assert.equal(pact, null);
  assert.equal(hasCaster, true);
});

test('single half caster reads the half table (Paladin 5 = L2 slots row)', () => {
  const { totals } = computeSpellSlots([{ name: 'Paladin', level: 5 }], data);
  assert.deepEqual(totals, [4, 2, 0, 0, 0, 0, 0, 0, 0]);
});

test('multiclass: full + floor(half/2) read off the full table', () => {
  // Wizard 5 + Paladin 5 → caster level 5 + 2 = 7.
  const { totals } = computeSpellSlots([{ name: 'Wizard', level: 5 }, { name: 'Paladin', level: 5 }], data);
  assert.deepEqual(totals, [4, 3, 3, 1, 0, 0, 0, 0, 0]); // PHB level 7
  assert.equal(multiclassCasterLevel([{ name: 'Wizard', level: 5 }, { name: 'Paladin', level: 5 }], data), 7);
});

test('warlock pact magic is tracked separately and stacks with nothing', () => {
  const { totals, pact } = computeSpellSlots([{ name: 'Warlock', level: 5 }], data);
  assert.deepEqual(totals, [0, 0, 0, 0, 0, 0, 0, 0, 0]);
  // Field compare: the table rows come from a vm realm, so deepEqual's
  // prototype check would reject an otherwise identical object.
  assert.equal(pact.n, 2); // two 3rd-level pact slots at L5
  assert.equal(pact.l, 3);

  const both = computeSpellSlots([{ name: 'Wizard', level: 3 }, { name: 'Warlock', level: 5 }], data);
  assert.deepEqual(both.totals, [4, 2, 0, 0, 0, 0, 0, 0, 0]); // wizard 3 alone
  assert.equal(both.pact.n, 2);
  assert.equal(both.pact.l, 3);
});

test('non-caster yields no slots', () => {
  const r = computeSpellSlots([{ name: 'Fighter', level: 10 }], data);
  assert.equal(r.hasCaster, false);
  assert.deepEqual(r.totals, [0, 0, 0, 0, 0, 0, 0, 0, 0]);
});

test('refreshAutoSlots preserves spent slots and clamps overspend', () => {
  const c = defaultCharacter();
  c.spellSlots[0] = { total: 4, used: 4 };
  refreshAutoSlots(c, [{ name: 'Wizard', level: 1 }], data);
  assert.equal(c.spellSlots[0].total, 2); // wizard 1: two L1 slots
  assert.equal(c.spellSlots[0].used, 2); // clamped from 4

  // Manual mode: untouched.
  const m = defaultCharacter();
  m.autoSlots = false;
  m.spellSlots[0] = { total: 7, used: 1 };
  refreshAutoSlots(m, [{ name: 'Wizard', level: 1 }], data);
  assert.equal(m.spellSlots[0].total, 7);
});

test('slotsRemainingAtOrAbove counts leveled + eligible pact slots', () => {
  const c = defaultCharacter();
  c.spellSlots[0] = { total: 4, used: 1 }; // 3 × L1
  c.spellSlots[2] = { total: 2, used: 0 }; // 2 × L3
  c.pactSlots = { total: 2, used: 1, level: 2 }; // 1 × L2 pact
  assert.equal(slotsRemainingAtOrAbove(c, 1), 6);
  assert.equal(slotsRemainingAtOrAbove(c, 2), 3); // L3 pair + pact
  assert.equal(slotsRemainingAtOrAbove(c, 3), 2); // pact too low now
});

test('mcReqStatus checks PHB prerequisites against scores', () => {
  const wiz = mcReqStatus('Wizard', { int: 13 }, data);
  assert.ok(wiz);
  assert.equal(wiz.met, true);
  assert.equal(mcReqStatus('Wizard', { int: 12 }, data).met, false);
  assert.equal(mcReqStatus('NoSuchClass', { int: 20 }, data), null);
});
