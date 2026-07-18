import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultCharacter } from '../core.js';
import { ensureClasses, pickedClasses, applyClassesToState, pruneFeatureChoices, choiceFeaturesFor, normalizeChoice, parseFeatureLines } from '../classes.js';
import { loadBuiltins } from './test-helpers.js';

const data = loadBuiltins();

test('ensureClasses backfills the multiclass list from the legacy class string', () => {
  const c = defaultCharacter();
  c.class = 'Wizard';
  c.level = 4;
  ensureClasses(c, data);
  assert.deepEqual(c.classes, [{ name: 'Wizard', level: 4 }]);
});

test('applyClassesToState derives level, class string, saves, hit dice, slots', () => {
  const c = defaultCharacter();
  c.classes = [{ name: 'Wizard', level: 3 }, { name: 'Fighter', level: 2 }];
  applyClassesToState(c, data);
  assert.equal(c.level, 5);
  assert.equal(c.class, 'Wizard / Fighter');
  // Primary class (Wizard) saves: INT + WIS.
  assert.equal(c.saveProf.int, true);
  assert.equal(c.saveProf.wis, true);
  assert.equal(c.saveProf.str, false);
  assert.equal(c.hitDice, '3d6 + 2d10');
  assert.equal(c.spellClass, 'Wizard');
  // Auto slots refreshed for a Wizard 3.
  assert.equal(c.spellSlots[1].total, 2);
});

test('pickedClasses drops unknown class names', () => {
  const c = defaultCharacter();
  c.classes = [{ name: 'Wizard', level: 1 }, { name: 'Bloodrager', level: 3 }];
  assert.deepEqual(pickedClasses(c, data).map((x) => x.name), ['Wizard']);
});

test('pruneFeatureChoices keeps valid and custom picks, drops stale ones', () => {
  const fighting = Object.entries(data.classData).find(([, cd]) =>
    (cd.features || []).some((f) => Array.isArray(f.choices) && f.choices.length));
  assert.ok(fighting, 'expected a class offering feature choices');
  const [clsName, cd] = fighting;
  const feat = cd.features.find((f) => Array.isArray(f.choices) && f.choices.length);

  const entry = { name: clsName, level: 20, featureChoices: {
    [`${clsName}::${feat.name}`]: feat.choices[0], // still offered → keep
    [`${clsName}::${feat.name}X`]: 'Anything', // feature gone → drop
    [`${clsName}::${feat.name}Y`]: { name: 'Homebrew pick', custom: true } // gone → drop too
  } };
  pruneFeatureChoices(entry, data);
  assert.deepEqual(Object.keys(entry.featureChoices), [`${clsName}::${feat.name}`]);

  // A custom pick on an existing feature survives even though unlisted.
  const entry2 = { name: clsName, level: 20, featureChoices: {
    [`${clsName}::${feat.name}`]: { name: 'My own style', custom: true }
  } };
  pruneFeatureChoices(entry2, data);
  assert.equal(normalizeChoice(entry2.featureChoices[`${clsName}::${feat.name}`]).name, 'My own style');

  // Choice features respect the unlock level.
  const locked = choiceFeaturesFor({ name: clsName, level: 0 }, data);
  const unlocked = choiceFeaturesFor({ name: clsName, level: 20 }, data);
  assert.ok(unlocked.length >= 1);
  assert.ok(locked.length <= unlocked.length);
});

test('parseFeatureLines parses lv|name|desc|use|cost|choices', () => {
  const feats = parseFeatureLines('1|Second Wind|Heal 1d10+level|Bonus Action|1/rest\n3|Style|Pick one|||Archery; Defense\n|no level name');
  assert.equal(feats.length, 3);
  assert.deepEqual(feats[0], { lv: 1, name: 'Second Wind', desc: 'Heal 1d10+level', use: 'Bonus Action', cost: '1/rest' });
  assert.deepEqual(feats[1], { lv: 3, name: 'Style', desc: 'Pick one', choices: ['Archery', 'Defense'] });
  assert.equal(feats[2].lv, 1); // missing level clamps to 1
});
