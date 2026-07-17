// Built-in game content, one file per type (split from the old builtins.js).
// Loaded as classic scripts BEFORE /app.js (see src/views/*.html) in the order
// listed in README.md — every top-level const here is a global shared with
// app.js and the /modules scripts. User-imported ("custom") data is DB-backed
// and merged into these registries at startup by app.js.
// MUST LOAD LAST: snapshots the fully-tagged registries so deleting a custom
// import that shadowed a built-in can restore the original. Also MC_REQS.

// Snapshots of the built-in registries, taken after source tagging (class
// feature use/cost/desc is attached up front by P() from FEATURE_INFO). When a
// custom import overrides a built-in entry (same name) and is later deleted,
// the original is restored from here.
const BUILTIN_CLASSES = JSON.parse(JSON.stringify(CLASS_DATA));
const BUILTIN_SPECIES = JSON.parse(JSON.stringify(SPECIES_DATA));
const BUILTIN_SUBSPECIES = JSON.parse(JSON.stringify(SUBSPECIES_DATA));
const BUILTIN_BACKGROUNDS = JSON.parse(JSON.stringify(BACKGROUND_DATA));

// PHB multiclassing prerequisites: an array of alternatives, each an ability-minimum set.
// (Jaeger has no published prereq — DEX or INT 13 mirrors its primary abilities.)
const MC_REQS = {
  Artificer:[{int:13}],
  Barbarian:[{str:13}], Bard:[{cha:13}], Cleric:[{wis:13}], Druid:[{wis:13}],
  Fighter:[{str:13},{dex:13}], Jaeger:[{dex:13},{int:13}], Monk:[{dex:13,wis:13}],
  Paladin:[{str:13,cha:13}], Ranger:[{dex:13,wis:13}], Rogue:[{dex:13}],
  Sorcerer:[{cha:13}], Warlock:[{cha:13}], Wizard:[{int:13}]
};
