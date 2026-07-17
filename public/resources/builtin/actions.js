// Built-in game content, one file per type (split from the old builtins.js).
// Loaded as classic scripts BEFORE /app.js (see src/views/*.html) in the order
// listed in README.md — every top-level const here is a global shared with
// app.js and the /modules scripts. User-imported ("custom") data is DB-backed
// and merged into these registries at startup by app.js.
// ---------- Standard actions & usable-item keywords ----------

// Actions every character can take in combat, shown on the Actions tab.
const STANDARD_ACTIONS = [
  {name:'Attack', desc:'Make one melee or ranged attack (see your attacks list).'},
  {name:'Dash', desc:'Gain extra movement equal to your speed.'},
  {name:'Disengage', desc:'Your movement does not provoke opportunity attacks.'},
  {name:'Dodge', desc:'Attacks against you have disadvantage; DEX saves at advantage.'},
  {name:'Help', desc:'Give an ally advantage on their next check or attack.'},
  {name:'Hide', desc:'Make a Stealth check to become hidden.'},
  {name:'Ready', desc:'Prepare a reaction triggered by a condition you set.'},
  {name:'Search', desc:'Make a Perception or Investigation check.'},
  {name:'Use an Object', desc:'Interact with a second object or use a special item.'},
  {name:'Grapple / Shove', desc:'Athletics contest to grab or push a creature (replaces one attack).'},
];

// Keywords that mark an inventory item as "usable" on the Actions tab.
const USABLE_ITEM_WORDS = ['potion','scroll','elixir','oil','bomb','kit','antitoxin','torch','caltrops','ration','holy water','acid','poison','wand','rope','net'];
