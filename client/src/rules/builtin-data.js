// Bridge between the builtin game-data scripts and the ESM world.
//
// The files under public/resources/ are classic scripts whose top-level
// consts are global lexical bindings (shared with the legacy frontend, loaded
// via <script> tags in client/index.html before the module graph runs). They
// can't be `import`ed, but unqualified references from module code resolve
// through the same global environment — so this module re-exports them under
// stable names. Everything downstream imports from here, never the globals.
//
// In Node (unit tests) the scripts haven't run, so the bindings don't exist;
// `g()` tolerates that and tests inject fixtures or use test-helpers.js to
// evaluate the real files in a vm context instead.

function g(name) {
  try {
    // eslint-disable-next-line no-new-func -- resolve a global lexical binding by name
    return new Function(`return typeof ${name} === 'undefined' ? undefined : ${name};`)();
  } catch {
    return undefined;
  }
}

// abilities-skills.js
export const abilities = g('ABILITIES');
export const skills = g('SKILLS');
export const skillDesc = g('SKILL_DESC');
export const passiveSenseInfo = g('PASSIVE_SENSE_INFO');

// actions.js
export const standardActions = g('STANDARD_ACTIONS');
export const usableItemWords = g('USABLE_ITEM_WORDS');

// alignments.js
export const alignments = g('ALIGNMENTS');

// classes.js
export const featureInfo = g('FEATURE_INFO');
export const classData = g('CLASS_DATA');
export const classSources = g('CLASS_SOURCES');

// species.js / subspecies.js / backgrounds.js / subclasses.js
export const speciesData = g('SPECIES_DATA');
export const subspeciesData = g('SUBSPECIES_DATA');
export const backgroundData = g('BACKGROUND_DATA');
export const subclassData = g('SUBCLASS_DATA');

// spells.js
export const spellData = g('SPELL_DATA');
export const spellClasses = g('SPELL_CLASSES');
export const spellDetails = g('SPELL_DETAILS');

// spell-slots.js
export const fullSlots = g('FULL_SLOTS');
export const halfSlots = g('HALF_SLOTS');
export const pactSlots = g('PACT_SLOTS');

// fighting-styles.js
export const fightingStyles = g('FIGHTING_STYLES');
export const fightingStylesFor = g('fightingStylesFor');
export const fightingStyleByName = g('fightingStyleByName');

// snapshots.js
export const builtinClasses = g('BUILTIN_CLASSES');
export const builtinSpecies = g('BUILTIN_SPECIES');
export const builtinSubspecies = g('BUILTIN_SUBSPECIES');
export const builtinBackgrounds = g('BUILTIN_BACKGROUNDS');
export const mcReqs = g('MC_REQS');

// weapon-mastery.js
export const masteryProperties = g('MASTERY_PROPERTIES');

// companions.js
export const companionTemplates = g('COMPANION_TEMPLATES');
