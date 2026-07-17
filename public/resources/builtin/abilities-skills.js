// Built-in game content, one file per type (split from the old builtins.js).
// Loaded as classic scripts BEFORE /app.js (see src/views/*.html) in the order
// listed in README.md — every top-level const here is a global shared with
// app.js and the /modules scripts. User-imported ("custom") data is DB-backed
// and merged into these registries at startup by app.js.
// ---------- Abilities, skills, and passive senses ----------

const ABILITIES = [
  {key:'str', name:'Strength'},
  {key:'dex', name:'Dexterity'},
  {key:'con', name:'Constitution'},
  {key:'int', name:'Intelligence'},
  {key:'wis', name:'Wisdom'},
  {key:'cha', name:'Charisma'},
];

const SKILLS = [
  {name:'Acrobatics', ability:'dex'},
  {name:'Animal Handling', ability:'wis'},
  {name:'Arcana', ability:'int'},
  {name:'Athletics', ability:'str'},
  {name:'Deception', ability:'cha'},
  {name:'History', ability:'int'},
  {name:'Insight', ability:'wis'},
  {name:'Intimidation', ability:'cha'},
  {name:'Investigation', ability:'int'},
  {name:'Medicine', ability:'wis'},
  {name:'Nature', ability:'int'},
  {name:'Perception', ability:'wis'},
  {name:'Performance', ability:'cha'},
  {name:'Persuasion', ability:'cha'},
  {name:'Religion', ability:'int'},
  {name:'Sleight of Hand', ability:'dex'},
  {name:'Stealth', ability:'dex'},
  {name:'Survival', ability:'wis'},
];

// Quick-reference blurbs for the Skills tab popups (openSkillDetail).
const SKILL_DESC = {
  'Acrobatics': "Staying on your feet in tricky situations: keeping your balance on ice or a narrow ledge, tumbling past enemies, flips and dives, or wriggling free of a grapple with agility.",
  'Animal Handling': "Calming a spooked animal, reading a beast's intentions, keeping your mount under control during a risky maneuver, or training and directing animals.",
  'Arcana': "Recalling lore about spells, magic items, eldritch symbols, magical traditions, the planes of existence, and their inhabitants.",
  'Athletics': "Feats of raw physical power: climbing a sheer cliff, long or high jumps, swimming against a current, or grappling and shoving in combat.",
  'Deception': "Convincingly hiding the truth — fast-talking a guard, keeping a straight face while lying, wearing a disguise, or running a con.",
  'History': "Recalling lore about historical events, legendary people, ancient kingdoms, past wars, and lost civilizations.",
  'Insight': "Reading body language, speech habits, and behavior to judge someone's true intentions — sensing a lie or predicting a move.",
  'Intimidation': "Influencing others through threats, hostile posturing, or overt displays of force — from staring down a thug to interrogating a prisoner.",
  'Investigation': "Looking for clues and making deductions: searching a room for a hidden compartment, working out how a trap is triggered, or appraising a suspicious document.",
  'Medicine': "Stabilizing a dying companion at 0 HP, diagnosing an illness, or determining what killed someone.",
  'Nature': "Recalling lore about terrain, plants and animals, weather patterns, and natural cycles.",
  'Perception': "Spotting, hearing, or otherwise noticing things: an ambush in the brush, a whispered conversation, or a creature sneaking up on you. Your passive Perception (10 + bonus) is what you notice without looking.",
  'Performance': "Delighting an audience with music, dance, acting, storytelling, or another kind of entertainment.",
  'Persuasion': "Influencing others with tact, social graces, or good-faith argument — negotiating a deal, inspiring a crowd, or requesting an audience.",
  'Religion': "Recalling lore about deities, rites and prayers, religious hierarchies, holy symbols, and cult practices.",
  'Sleight of Hand': "Manual trickery and legerdemain: lifting a coin purse, palming an object, or planting something on someone unnoticed.",
  'Stealth': "Concealing yourself and moving silently — slipping past guards, hiding from a pursuer, or sneaking up on a target.",
  'Survival': "Following tracks, hunting and foraging, navigating wilderness, predicting the weather, and avoiding quicksand, pits, and other natural hazards.",
};

// Quick-reference blurbs for the Passive Senses popups on the Skills tab
// (openPassiveDetail). Keyed by the underlying skill name.
const PASSIVE_SENSE_INFO = {
  'Perception': {
    desc: "What you notice without actively looking or listening — your always-on awareness. The DM compares it against a creature's Stealth check or a hidden threat's DC instead of asking you to roll.",
    example: "A goblin sneaks up on the camp with a Stealth total of 13. Your passive Perception is 14, so the DM tells you that you hear a twig snap behind the tents — no roll needed.",
  },
  'Investigation': {
    desc: "What you deduce or piece together without deliberately searching — spotting that something is off about a room, a document, or a mechanism just by being there.",
    example: "Walking down a dungeon corridor, your passive Investigation of 15 beats the trap's DC 14, so the DM mentions the faint seams of a pressure plate in the floor ahead.",
  },
  'Insight': {
    desc: "Your ongoing read on people — noticing shifty behavior, nerves, or an act without stopping to study anyone. The DM checks it against a liar's Deception when you aren't actively probing.",
    example: "A merchant lies about the sword's origin with a Deception total of 12. Your passive Insight is 13, so the DM notes he keeps glancing at the door as he talks.",
  },
};
