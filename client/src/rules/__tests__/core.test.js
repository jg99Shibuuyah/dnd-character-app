import test from 'node:test';
import assert from 'node:assert/strict';
import { mod, fmt, profBonus, levelLabel, defaultCharacter } from '../core.js';

test('mod follows the PHB table', () => {
  assert.equal(mod(10), 0);
  assert.equal(mod(11), 0);
  assert.equal(mod(12), 1);
  assert.equal(mod(8), -1);
  assert.equal(mod(9), -1);
  assert.equal(mod(20), 5);
  assert.equal(mod(3), -4);
});

test('fmt signs numbers', () => {
  assert.equal(fmt(3), '+3');
  assert.equal(fmt(0), '+0');
  assert.equal(fmt(-2), '-2');
});

test('proficiency bonus by level', () => {
  assert.equal(profBonus(1), 2);
  assert.equal(profBonus(4), 2);
  assert.equal(profBonus(5), 3);
  assert.equal(profBonus(8), 3);
  assert.equal(profBonus(9), 4);
  assert.equal(profBonus(12), 4);
  assert.equal(profBonus(13), 5);
  assert.equal(profBonus(16), 5);
  assert.equal(profBonus(17), 6);
  assert.equal(profBonus(20), 6);
});

test('levelLabel renders cantrips specially', () => {
  assert.equal(levelLabel(0), 'Cantrip');
  assert.equal(levelLabel(3), 'Level 3');
});

test('defaultCharacter shape stays save-compatible', () => {
  const c = defaultCharacter();
  assert.equal(c.level, 1);
  assert.equal(c.spellSlots.length, 9);
  assert.deepEqual(c.pactSlots, { total: 0, used: 0, level: 1 });
  assert.equal(c.autoSlots, true);
  assert.deepEqual(c.abilities, { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 });
  assert.deepEqual(c.attacks, [{ name: '', bonus: '', dmg: '' }]);
});
