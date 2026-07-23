import test from 'node:test';
import assert from 'node:assert/strict';
import { monsterStatblockHtml, buildNotesIndex, NOTES_TYPES_DM } from '../notes-index.js';

const dragon = {
  name: 'Adult Copper Dragon', size: 'Gargantuan', type: 'Dragon', alignment: 'Chaotic Good',
  ac: 18, acNote: 'natural armor', hpMax: 184, hpFormula: '16d12 + 80', speed: '40 ft., fly 80 ft.',
  abilities: { str: 23, dex: 12, con: 21, int: 18, wis: 15, cha: 17 },
  saves: 'Dex +6, Con +10', skills: 'Perception +12', immunities: 'Acid',
  senses: 'darkvision 120 ft.', languages: 'Common, Draconic', cr: '14', pb: '+5', xp: '11,500',
  legendaryCount: 3, legendaryNote: 'The dragon can take 3 legendary actions.',
  traits: [{ name: 'Legendary Resistance', desc: 'Succeed instead of failing.' }],
  actions: [{ name: 'Bite', desc: '+11 to hit, 17 (2d10 + 6) piercing.' }],
  reactions: [], legendary: [{ name: 'Detect', desc: 'Perception check.' }],
  items: [], lore: 'A cunning trickster.'
};

test('monsterStatblockHtml renders key fields and escapes text', () => {
  const html = monsterStatblockHtml(dragon);
  assert.match(html, /Gargantuan/);
  assert.match(html, /184/);
  assert.match(html, /18 \(natural armor\)/);
  assert.match(html, /Legendary Resistance/);
  assert.match(html, /Bite/);
  assert.match(html, /Challenge/);
});

test('buildNotesIndex includes Monsters only when monsters are passed', () => {
  const data = { classData: {}, speciesData: {}, subclassData: {}, subspeciesData: {},
    spellData: {}, spellClasses: [], spellDetails: {}, backgroundData: {},
    fightingStyles: [], alignments: [], masteryProperties: [], companionTemplates: [], classSources: {} };
  const without = buildNotesIndex(data, {});
  assert.equal(without.some((e) => e.type === 'Monsters'), false);

  const monsters = [{ name: 'Adult Copper Dragon', source: 'SRD', data: dragon }];
  const withMon = buildNotesIndex(data, {}, monsters);
  const entry = withMon.find((e) => e.type === 'Monsters');
  assert.ok(entry, 'has a Monsters entry');
  assert.equal(entry.name, 'Adult Copper Dragon');
  assert.match(entry.text, /copper/); // searchable by name
});

test('NOTES_TYPES_DM adds Monsters to the base type list', () => {
  assert.ok(NOTES_TYPES_DM.includes('Monsters'));
});

test('monsterStatblockHtml single-escapes special characters in acNote/cr (no double-escaping)', () => {
  const monster = {
    ...dragon,
    acNote: 'A & B <x>',
    cr: '5 & up',
  };
  const html = monsterStatblockHtml(monster);
  assert.match(html, /A &amp; B &lt;x&gt;/);
  assert.doesNotMatch(html, /&amp;amp;/);
});
