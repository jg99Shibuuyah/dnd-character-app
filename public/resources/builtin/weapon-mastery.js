// Built-in game content, one file per type (split from the old builtins.js).
// Loaded as classic scripts BEFORE /app.js (see src/views/*.html) in the order
// listed in README.md — every top-level const here is a global shared with
// app.js and the /modules scripts. User-imported ("custom") data is DB-backed
// and merged into these registries at startup by app.js.
// ---------- Weapon Mastery properties (2024 rules) ----------

// Weapon Mastery properties (2024 rules) with the weapons that carry each one.
// Used by the Library reference panel and the Library search index.
const MASTERY_PROPERTIES = [
  {name:'Cleave',
   desc:"If you hit a creature with a melee attack roll using this weapon, you can make a melee attack roll with the weapon against a second creature within 5 feet of the first that is also within your reach. On a hit, the second creature takes the weapon's damage, but don't add your ability modifier to that damage unless that modifier is negative. You can make this extra attack only once per turn.",
   weapons:['Greataxe','Halberd']},
  {name:'Graze',
   desc:"If your attack roll with this weapon misses a creature, you can deal damage to that creature equal to the ability modifier you used to make the attack roll. This damage is the same type dealt by the weapon, and the damage can be increased only by increasing the ability modifier.",
   weapons:['Glaive','Greatsword']},
  {name:'Nick',
   desc:"When you make the extra attack of the Light property, you can make it as part of the Attack action instead of as a Bonus Action. You can make this extra attack only once per turn.",
   weapons:['Dagger','Light Hammer','Scimitar','Sickle']},
  {name:'Push',
   desc:"If you hit a creature with this weapon, you can push the creature up to 10 feet straight away from yourself if it is Large or smaller.",
   weapons:['Greatclub','Heavy Crossbow','Pike','Warhammer']},
  {name:'Sap',
   desc:"If you hit a creature with this weapon, that creature has Disadvantage on its next attack roll before the start of your next turn.",
   weapons:['Flail','Longsword','Mace','Morningstar','Spear','War Pick']},
  {name:'Slow',
   desc:"If you hit a creature with this weapon and deal damage to it, you can reduce its Speed by 10 feet until the start of your next turn. If the creature is hit more than once by weapons that have this property, the Speed reduction doesn't exceed 10 feet.",
   weapons:['Club','Javelin','Light Crossbow','Longbow','Musket','Sling','Whip']},
  {name:'Topple',
   desc:"If you hit a creature with this weapon, you can force the creature to make a Constitution saving throw (DC 8 plus the ability modifier used to make the attack roll and your Proficiency Bonus). On a failed save, the creature has the Prone condition.",
   weapons:['Battleaxe','Lance','Maul','Quarterstaff','Trident']},
  {name:'Vex',
   desc:"If you hit a creature with this weapon and deal damage to the creature, you have Advantage on your next attack roll against that creature before the end of your next turn.",
   weapons:['Blowgun','Dart','Hand Crossbow','Handaxe','Pistol','Rapier','Shortbow','Shortsword']},
];
