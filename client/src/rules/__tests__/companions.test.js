import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultCharacter } from '../core.js';
import { companionCtx, companionBaselineCtx } from '../companions.js';
import { loadBuiltins } from './test-helpers.js';

const data = loadBuiltins();

test('companionCtx exposes character-derived helpers', () => {
  const c = defaultCharacter();
  c.classes = [{ name: 'Wizard', level: 5 }];
  c.level = 5;
  c.abilities.int = 18;
  c.knownSpells = [{ name: 'Find Familiar', level: 1 }];
  c.spellSlots[2] = { total: 2, used: 0 };

  const ctx = companionCtx(c, data);
  assert.equal(ctx.pb, 3);
  assert.equal(ctx.level, 5);
  assert.equal(ctx.classLevel('Wizard'), 5);
  assert.equal(ctx.classLevel('Fighter'), 0);
  assert.equal(ctx.castMod('Wizard'), 4); // INT 18
  assert.equal(ctx.spellAtk('Wizard'), 7);
  assert.equal(ctx.knowsSpell('find familiar'), true);
  assert.equal(ctx.knowsSpell('Fireball'), false);
  assert.equal(ctx.bestSlotLevel(1), 3);
});

test('every builtin companion template builds a stat block from the baseline ctx', () => {
  const base = companionBaselineCtx();
  assert.ok(data.companionTemplates.length > 0);
  for (const tpl of data.companionTemplates) {
    const stats = tpl.build(base);
    assert.ok(stats && typeof stats === 'object', `${tpl.id} returned a stat block`);
  }
});
