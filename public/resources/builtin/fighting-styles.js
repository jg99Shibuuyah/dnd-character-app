// Built-in game content, one file per type (split from the old builtins.js).
// Loaded as classic scripts BEFORE /app.js (see src/views/*.html) in the order
// listed in README.md — every top-level const here is a global shared with
// app.js and the /modules scripts. User-imported ("custom") data is DB-backed
// and merged into these registries at startup by app.js.
// Depends on classes.js and subclasses.js (attachFightingStyleChoices mutates
// CLASS_DATA/SUBCLASS_DATA feature rows, before snapshots.js copies them).

// ---------- Fighting styles ----------
// The shared option table behind every "Fighting Style" feature. `classes` is
// the list of classes that can take each style: it drives which options a class
// is offered, and is shown on the style's Library entry and choice preview.
// Descriptions are summaries of the rule, not the published text.
const FIGHTING_STYLES = [
  { name:'Archery', classes:['Fighter','Ranger'], source:'5E',
    desc:"You gain a +2 bonus to attack rolls you make with ranged weapons." },
  { name:'Blind Fighting', classes:['Fighter','Paladin','Ranger'], source:'5E',
    desc:"You have blindsight out to 10 ft: within that range you can see anything that isn't behind total cover, even if blinded or in darkness, and you can spot invisible creatures unless they hide from you." },
  { name:'Defense', classes:['Fighter','Paladin','Ranger'], source:'5E',
    desc:"While you are wearing armor, you gain a +1 bonus to AC." },
  { name:'Druidic Warrior', classes:['Ranger'], source:'5E',
    desc:"You learn two druid cantrips of your choice. They count as ranger spells for you and use Wisdom as their spellcasting ability. You can replace one of them when you gain a ranger level." },
  { name:'Dueling', classes:['Fighter','Paladin','Ranger'], source:'5E',
    desc:"When wielding a melee weapon in one hand and no other weapon, you gain a +2 bonus to damage rolls with that weapon." },
  { name:'Great Weapon Fighting', classes:['Fighter','Paladin'], source:'5E',
    desc:"When you roll a 1 or 2 on a damage die for an attack with a two-handed or versatile melee weapon held in two hands, you can reroll it once and must use the new roll." },
  { name:'Interception', classes:['Fighter','Paladin'], source:'5E',
    desc:"As a reaction, when a creature you can see hits a target within 5 ft of you, reduce the damage by 1d10 + your proficiency bonus. You must be wielding a shield or a simple or martial weapon." },
  { name:'Protection', classes:['Fighter','Paladin'], source:'5E',
    desc:"As a reaction, when a creature you can see attacks a target within 5 ft of you, impose disadvantage on the attack roll. You must be wielding a shield." },
  { name:'Superior Technique', classes:['Fighter'], source:'5E',
    desc:"You learn one Battle Master maneuver and gain one superiority die (a d6) to fuel it, regained on a short or long rest." },
  { name:'Thrown Weapon Fighting', classes:['Fighter','Ranger'], source:'5E',
    desc:"You can draw a thrown weapon as part of the attack you make with it, and you gain a +2 bonus to damage rolls with thrown weapons." },
  { name:'Two-Weapon Fighting', classes:['Fighter','Ranger'], source:'5E',
    desc:"When you engage in two-weapon fighting, you can add your ability modifier to the damage of the second attack." },
  { name:'Unarmed Fighting', classes:['Fighter'], source:'5E',
    desc:"Your unarmed strikes deal 1d6 bludgeoning damage (1d8 with no weapon or shield in either hand). At the start of each of your turns you deal 1d4 bludgeoning damage to a creature you are grappling." }
];

function fightingStylesFor(className){
  return FIGHTING_STYLES.filter(s=> s.classes.includes(className));
}

function fightingStyleByName(name){
  return FIGHTING_STYLES.find(s=> s.name === name) || null;
}

// Offer each class only the styles it can actually take. Runs before the
// BUILTIN_CLASSES snapshot below so restoring a deleted override keeps them.
// Homebrew classes that list their own styles in the feature text (the Jaeger)
// are left alone — their options aren't in this table.
(function attachFightingStyleChoices(){
  const applies = f=> /^(Additional )?Fighting Style$/.test(f.name);
  Object.entries(CLASS_DATA).forEach(([className, cd])=>{
    const opts = fightingStylesFor(className);
    if(!opts.length) return;
    (cd.features||[]).filter(applies).forEach(f=>{ f.choices = opts.map(s=>s.name); });
  });
  // Subclass features that grant another style (e.g. the Champion at level 10)
  // draw from their parent class's list.
  Object.values(SUBCLASS_DATA).forEach(sc=>{
    const opts = fightingStylesFor(sc.parent);
    if(!opts.length) return;
    (sc.features||[]).filter(applies).forEach(f=>{ f.choices = opts.map(s=>s.name); });
  });
})();
