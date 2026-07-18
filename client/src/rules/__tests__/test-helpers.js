// Loads the real builtin game-data scripts (classic scripts, top-level const
// globals) into a vm context so Node tests can run the rules against genuine
// data instead of hand-rolled fixtures.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const resourcesDir = fileURLToPath(new URL('../../../../public/resources/', import.meta.url));

// Same load order as the views (see public/resources/builtin/README.md).
const FILES = [
  'builtin/spells.js', 'builtin/actions.js', 'builtin/alignments.js',
  'builtin/weapon-mastery.js', 'builtin/abilities-skills.js', 'builtin/classes.js',
  'builtin/species.js', 'builtin/backgrounds.js', 'builtin/subclasses.js',
  'builtin/subspecies.js', 'builtin/spell-slots.js', 'builtin/fighting-styles.js',
  'builtin/snapshots.js', 'companions.js'
];

let cached = null;

export function loadBuiltins() {
  if (cached) return cached;
  const context = vm.createContext({});
  for (const f of FILES) {
    const src = readFileSync(path.join(resourcesDir, f), 'utf8');
    new vm.Script(src, { filename: f }).runInContext(context);
  }
  // Top-level consts live in the context's global lexical scope, not on the
  // context object — evaluate an object literal there to pull them out.
  cached = new vm.Script(`({
    abilities: ABILITIES, skills: SKILLS, skillDesc: SKILL_DESC, passiveSenseInfo: PASSIVE_SENSE_INFO,
    speciesData: SPECIES_DATA, backgroundData: BACKGROUND_DATA,
    classData: CLASS_DATA, subclassData: SUBCLASS_DATA, subspeciesData: SUBSPECIES_DATA,
    spellData: SPELL_DATA, spellClasses: SPELL_CLASSES, spellDetails: SPELL_DETAILS,
    fullSlots: FULL_SLOTS, halfSlots: HALF_SLOTS, pactSlots: PACT_SLOTS,
    fightingStyles: FIGHTING_STYLES, mcReqs: MC_REQS, classSources: CLASS_SOURCES,
    standardActions: STANDARD_ACTIONS, usableItemWords: USABLE_ITEM_WORDS,
    alignments: ALIGNMENTS, masteryProperties: MASTERY_PROPERTIES,
    companionTemplates: COMPANION_TEMPLATES
  })`).runInContext(context);
  return cached;
}
