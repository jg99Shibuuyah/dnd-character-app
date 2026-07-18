import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultCharacter } from '../core.js';
import { newEquipItem } from '../equipment.js';
import { effectiveAbilities, computeAC, grantedSkillSources, skillProficient, deriveStats } from '../abilities.js';
import { loadBuiltins } from './test-helpers.js';

const data = loadBuiltins();

function withGear(...items) {
  const c = defaultCharacter();
  c.equipment = items;
  return c;
}

test('effectiveAbilities: adds stack, sets take the max, adds apply on top', () => {
  const belt = { ...newEquipItem(), name: 'Belt', abilities: { str: '=19' } };
  const tome = { ...newEquipItem(), name: 'Tome', abilities: { str: '+2' } };
  const c = withGear(belt, tome);
  c.abilities.str = 13;
  assert.equal(effectiveAbilities(c, data).str, 21); // max(13,19) + 2

  // Set below base: base wins, then adds.
  c.abilities.str = 20;
  assert.equal(effectiveAbilities(c, data).str, 22);

  // Unequipped gear contributes nothing.
  belt.equipped = false;
  tome.equipped = false;
  assert.equal(effectiveAbilities(c, data).str, 20);
});

test('computeAC: unarmored is 10 + DEX', () => {
  const c = defaultCharacter();
  c.abilities.dex = 16;
  const ac = computeAC(c, data);
  assert.equal(ac.ac, 13);
  assert.equal(ac.usedArmor, false);
});

test('computeAC: heavy armor replaces 10+DEX only when higher; shields stack', () => {
  const plate = { ...newEquipItem(), name: 'Plate', ac: '=18' };
  const shield = { ...newEquipItem(), name: 'Shield', ac: '+2' };
  const c = withGear(plate, shield);
  c.abilities.dex = 14;
  const ac = computeAC(c, data);
  assert.equal(ac.ac, 20); // 18 armor + 2 shield, DEX ignored
  assert.equal(ac.usedArmor, true);

  // Monk-ish high DEX beats the armor base.
  c.abilities.dex = 30;
  const ac2 = computeAC(c, data);
  assert.equal(ac2.usedArmor, false);
  assert.equal(ac2.ac, 22); // 10 + 10 DEX + 2 shield
});

test('granted skill proficiencies come from species and background', () => {
  const grantingSpecies = Object.entries(data.speciesData).find(([, sd]) => Array.isArray(sd.skills) && sd.skills.length);
  const grantingBackground = Object.entries(data.backgroundData).find(([, bd]) => Array.isArray(bd.skills) && bd.skills.length);
  assert.ok(grantingSpecies, 'expected at least one species granting skills');
  assert.ok(grantingBackground, 'expected at least one background granting skills');

  const c = defaultCharacter();
  c.race = grantingSpecies[0];
  const skill = grantingSpecies[1].skills[0];
  const sources = grantedSkillSources(c, skill, data);
  assert.deepEqual(sources, [{ by: grantingSpecies[0], kind: 'species' }]);

  const i = data.skills.findIndex((s) => s.name === skill);
  assert.ok(i >= 0);
  assert.equal(skillProficient(c, i, data), true, 'granted skill counts as proficient');
  c.race = '';
  assert.equal(skillProficient(c, i, data), false);
});

test('deriveStats matches legacy recalc math for a sample character', () => {
  const c = defaultCharacter();
  c.level = 5; // PB +3
  c.abilities = { str: 10, dex: 16, con: 14, int: 8, wis: 12, cha: 10 };
  c.saveProf.dex = true;
  const perceptionIdx = data.skills.findIndex((s) => s.name === 'Perception');
  c.skillProf['sk' + perceptionIdx] = true;

  const d = deriveStats(c, data);
  assert.equal(d.pb, 3);
  assert.equal(d.initiative, 3);
  assert.equal(d.saves.dex, 6); // +3 DEX +3 prof
  assert.equal(d.saves.str, 0);
  assert.equal(d.skillBonuses[perceptionIdx], 1 + 3); // WIS +1, prof +3
  assert.equal(d.passives.Perception, 14);
  assert.equal(d.ac.ac, 13);
});
