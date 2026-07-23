import test from 'node:test';
import assert from 'node:assert/strict';
import { monsterFormToData, monsterDataToForm } from '../import-forms.js';

test('monsterFormToData: trims scalars, parses ability numbers and name|desc lines', () => {
  const form = {
    name: 'Adult Copper Dragon ', size: 'Gargantuan', type: 'Dragon', alignment: 'Chaotic Good',
    ac: '18', acNote: 'natural armor', hpMax: '184', hpFormula: '16d12 + 80',
    speed: '40 ft., fly 80 ft.', str: '23', dex: '12', con: '21', int: '18', wis: '15', cha: '17',
    saves: 'Dex +6, Con +10', skills: 'Perception +12', resistances: '', immunities: 'Acid',
    vulnerabilities: '', conditionImmunities: '', senses: 'darkvision 120 ft.',
    languages: 'Common, Draconic', cr: '14', pb: '+5', xp: '11,500', legendaryCount: '3',
    legendaryNote: 'The dragon can take 3 legendary actions.',
    traits: 'Legendary Resistance | If it fails a save, it can succeed instead.',
    actions: 'Bite | +11 to hit, 17 (2d10 + 6) piercing.',
    reactions: '', legendary: 'Detect | The dragon makes a Perception check.',
    items: 'Longsword | A plain steel blade.', lore: 'A cunning trickster.'
  };
  const d = monsterFormToData(form);
  assert.equal(d.name, 'Adult Copper Dragon');
  assert.equal(d.ac, 18);
  assert.equal(d.hpMax, 184);
  assert.deepEqual(d.abilities, { str: 23, dex: 12, con: 21, int: 18, wis: 15, cha: 17 });
  assert.equal(d.legendaryCount, 3);
  assert.deepEqual(d.traits, [{ name: 'Legendary Resistance', desc: 'If it fails a save, it can succeed instead.' }]);
  assert.deepEqual(d.actions, [{ name: 'Bite', desc: '+11 to hit, 17 (2d10 + 6) piercing.' }]);
  assert.deepEqual(d.items, [{ name: 'Longsword', desc: 'A plain steel blade.' }]);
});

test('monsterDataToForm round-trips the numeric and list fields to strings', () => {
  const data = {
    name: 'Kobold', size: 'Small', type: 'Humanoid', alignment: 'Lawful Evil',
    ac: 12, acNote: '', hpMax: 5, hpFormula: '2d6 - 2', speed: '30 ft.',
    abilities: { str: 7, dex: 15, con: 9, int: 8, wis: 7, cha: 8 },
    saves: '', skills: '', senses: 'darkvision 60 ft.', languages: 'Common, Draconic',
    cr: '1/8', pb: '+2', xp: '25', legendaryCount: 0, legendaryNote: '',
    traits: [{ name: 'Sunlight Sensitivity', desc: 'Disadvantage in sunlight.' }],
    actions: [{ name: 'Dagger', desc: '+4 to hit, 4 (1d4 + 2) piercing.' }],
    reactions: [], legendary: [], items: [], lore: ''
  };
  const f = monsterDataToForm(data);
  assert.equal(f.ac, '12');
  assert.equal(f.str, '7');
  assert.equal(f.traits, 'Sunlight Sensitivity | Disadvantage in sunlight.');
  assert.equal(f.actions, 'Dagger | +4 to hit, 4 (1d4 + 2) piercing.');
  assert.equal(f.legendaryCount, '0');
});

test('monsterDataToForm coerces non-string cr/xp to strings', () => {
  const data = {
    name: 'Adult Copper Dragon', size: 'Gargantuan', type: 'Dragon', alignment: 'Chaotic Good',
    ac: 18, acNote: 'natural armor', hpMax: 184, hpFormula: '16d12 + 80', speed: '40 ft., fly 80 ft.',
    abilities: { str: 23, dex: 12, con: 21, int: 18, wis: 15, cha: 17 },
    saves: 'Dex +6, Con +10', skills: 'Perception +12', senses: 'darkvision 120 ft.',
    languages: 'Common, Draconic', cr: 14, pb: '+5', xp: 11500, legendaryCount: 3,
    legendaryNote: 'The dragon can take 3 legendary actions.',
    traits: [], actions: [], reactions: [], legendary: [], items: [], lore: ''
  };
  const f = monsterDataToForm(data);
  assert.equal(typeof f.cr, 'string');
  assert.equal(typeof f.xp, 'string');
  assert.equal(f.cr, '14');
  assert.equal(f.xp, '11500');
});
