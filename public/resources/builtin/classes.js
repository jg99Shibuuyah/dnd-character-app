// Built-in game content, one file per type (split from the old builtins.js).
// Loaded as classic scripts BEFORE /app.js (see src/views/*.html) in the order
// listed in README.md — every top-level const here is a global shared with
// app.js and the /modules scripts. User-imported ("custom") data is DB-backed
// and merged into these registries at startup by app.js.
// ---------- Classes: FEATURE_INFO, P(), CLASS_DATA, CLASS_SOURCES ----------

// Reference detail for the built-in classes, whose features are stored
// name-only. The single source of truth for a class feature's blurb and its
// action cost: P() attaches it so the Class Features panel shows more than a
// bare name, and (for entries with a non-passive `use`) the Actions tab picks
// it up the same way it does the homebrew Jaeger's inline features.
//
// A value is either a plain description string (passive features) or
// {use, cost, desc} for anything that takes an action or has limited uses.
// Keys match the full feature name; an entry keyed by the base name (with the
// parenthetical stripped) also applies to every variant, so 'Bardic Inspiration'
// carries the use/cost for the d6/d8/d10/d12 rows while each keeps its own desc.
// Names shared by several classes (Extra Attack, Ability Score Improvement,
// the generic "<subclass> feature" rows) use one general-purpose description.
const FEATURE_INFO = {
  // Shared / common
  'Ability Score Improvement': "Increase one ability score by 2, or two scores by 1 each (to a maximum of 20). You can instead take a feat if your game uses them.",
  'Extra Attack': "You can attack twice, instead of once, whenever you take the Attack action on your turn.",
  'Extra Attack (2)': "You can attack three times whenever you take the Attack action on your turn.",
  'Extra Attack (3)': "You can attack four times whenever you take the Attack action on your turn.",
  'Fighting Style': "Adopt a fighting style as your specialty for an ongoing combat benefit, such as Archery, Defense, Dueling, or Great Weapon Fighting.",
  'Evasion': "When you make a Dexterity saving throw against an effect for half damage, you instead take no damage on a success and only half on a failure.",
  'Expertise': "Choose proficiencies to double your proficiency bonus for — typically skills (or a skill and thieves' tools).",
  'Spellcasting': "You can cast spells from your class's list; your spellcasting ability, save DC, and slots are set by your class (manage them on the Spells tab).",
  'Timeless Body': "The magic of your class slows your aging — you no longer suffer the frailties of old age and can't be aged magically.",
  'Unarmored Defense': "While not wearing armor, your AC equals 10 + your Dexterity modifier + a class modifier (Constitution for the barbarian, who may still use a shield; Wisdom for the monk).",
  'Archetype feature': "Your chosen archetype grants a feature at this level — see the subclass entry below.",
  'Tradition feature': "Your chosen tradition grants a feature at this level — see the subclass entry below.",
  // Barbarian
  'Rage': {use:'bonus action', cost:'uses/rest', desc:"As a bonus action, rage for up to 1 minute: advantage on Strength checks and saves, bonus melee damage, and resistance to bludgeoning, piercing, and slashing damage."},
  'Reckless Attack': {use:'special', desc:"On your first attack of a turn you can attack recklessly, gaining advantage on melee Strength attacks that turn but giving attackers advantage against you until your next turn."},
  'Danger Sense': "You have advantage on Dexterity saving throws against effects you can see, such as traps and spells, unless blinded, deafened, or incapacitated.",
  'Primal Path': "Choose the subclass (Primal Path) that shapes your rage; it grants features as you level.",
  'Path feature': "Your Primal Path grants a feature at this level — see the subclass entry below.",
  'Fast Movement': "Your speed increases by 10 feet while you aren't wearing heavy armor.",
  'Feral Instinct': "You have advantage on initiative rolls, and can act normally on a surprise round as long as you enter your rage.",
  'Brutal Critical (1 die)': "You can roll one additional weapon damage die when determining the extra damage of a melee critical hit.",
  'Brutal Critical (2 dice)': "You roll two additional weapon damage dice for a melee critical hit.",
  'Brutal Critical (3 dice)': "You roll three additional weapon damage dice for a melee critical hit.",
  'Relentless Rage': {use:'special', desc:"If you drop to 0 hit points while raging without dying outright, make a DC 10 Constitution save to drop to 1 hit point instead (the DC rises with each use)."},
  'Persistent Rage': "Your rage ends early only if you fall unconscious or choose to end it.",
  'Indomitable Might': "If your total for a Strength check is less than your Strength score, you can use that score in place of the total.",
  'Primal Champion': "Your Strength and Constitution scores each increase by 4, to a maximum of 24.",
  // Bard
  'Bardic Inspiration': {use:'bonus action', cost:'CHA mod/rest'}, // base entry: use/cost for every die-size row
  'Bardic Inspiration (d6)': "As a bonus action, give a creature a d6 it can add to one ability check, attack roll, or saving throw within 10 minutes. Uses equal your Charisma modifier per rest.",
  'Bardic Inspiration (d8)': "Your Bardic Inspiration die improves to a d8.",
  'Bardic Inspiration (d10)': "Your Bardic Inspiration die improves to a d10.",
  'Bardic Inspiration (d12)': "Your Bardic Inspiration die improves to a d12.",
  'Jack of All Trades': "Add half your proficiency bonus (rounded down) to any ability check you make that doesn't already include your proficiency bonus.",
  'Song of Rest': {use:'special', cost:'on a short rest'}, // base entry: use/cost for every die-size row
  'Song of Rest (d6)': "During a short rest, you and allies who hear your performance regain an extra 1d6 hit points when spending Hit Dice.",
  'Song of Rest (d8)': "Your Song of Rest healing die improves to a d8.",
  'Song of Rest (d10)': "Your Song of Rest healing die improves to a d10.",
  'Song of Rest (d12)': "Your Song of Rest healing die improves to a d12.",
  'Bard College': "Choose the subclass (Bard College) that focuses your talents; it grants features as you level.",
  'College feature': "Your Bard College grants a feature at this level — see the subclass entry below.",
  'Font of Inspiration': "You regain all expended uses of Bardic Inspiration on a short or long rest, not just a long rest.",
  'Countercharm': {use:'action', desc:"As an action, perform until the end of your next turn; you and allies within 30 feet have advantage on saves against being frightened or charmed."},
  'Magical Secrets': "Learn two spells of your choice from any class; they count as bard spells for you.",
  'Superior Inspiration': "When you roll initiative and have no uses of Bardic Inspiration left, you regain one.",
  // Cleric
  'Divine Domain': "Choose the subclass (Divine Domain) tied to your deity; it grants domain spells and features as you level.",
  'Domain feature': "Your Divine Domain grants a feature at this level — see the subclass entry below.",
  'Channel Divinity': {use:'action', cost:'uses/rest'}, // base entry: use/cost for every uses-per-rest row
  'Destroy Undead': {use:'special'},                    // base entry: rider on Turn Undead
  'Channel Divinity (1/rest)': "You can channel divine energy for a special effect, such as Turn Undead, once per short or long rest.",
  'Channel Divinity (2/rest)': "You can use Channel Divinity twice per short or long rest.",
  'Channel Divinity (3/rest)': "You can use Channel Divinity three times per short or long rest.",
  'Destroy Undead (CR 1/2)': "When an undead of CR 1/2 or lower fails its save against your Turn Undead, it is instantly destroyed.",
  'Destroy Undead (CR 1)': "Your Turn Undead instantly destroys turned undead of CR 1 or lower.",
  'Destroy Undead (CR 2)': "Your Turn Undead instantly destroys turned undead of CR 2 or lower.",
  'Destroy Undead (CR 3)': "Your Turn Undead instantly destroys turned undead of CR 3 or lower.",
  'Destroy Undead (CR 4)': "Your Turn Undead instantly destroys turned undead of CR 4 or lower.",
  'Divine Intervention': {use:'action', cost:'1/long rest', desc:"Implore your deity for aid; roll d100 at or below your cleric level to succeed. On success it works once per long rest, otherwise you can try again after a long rest."},
  'Divine Intervention improvement': "Your Divine Intervention automatically succeeds, with no roll required.",
  // Druid
  'Druidic': "You know Druidic, the secret language of druids, and can leave and spot hidden messages left in it.",
  'Wild Shape': {use:'action', cost:'2/rest', desc:"As an action, magically transform into a beast you've seen, for a number of hours equal to half your druid level (twice per rest)."},
  'Druid Circle': "Choose the subclass (Druid Circle) that defines your practice; it grants features as you level.",
  'Circle feature': "Your Druid Circle grants a feature at this level — see the subclass entry below.",
  'Wild Shape improvement': "Your Wild Shape can take more powerful beast forms, with a higher challenge rating and expanded movement options.",
  'Beast Spells': "You can cast many of your druid spells while in a Wild Shape form.",
  'Archdruid': "You can use Wild Shape an unlimited number of times, and ignore the verbal and somatic components of your druid spells.",
  // Fighter
  'Second Wind': {use:'bonus action', cost:'1/rest', desc:"On your turn, use a bonus action to regain 1d10 + your fighter level hit points, once per short or long rest."},
  'Action Surge': {use:'special', cost:'1/rest', desc:"On your turn, take one additional action, once per short or long rest."},
  'Action Surge (2 uses)': {use:'special', cost:'2/rest', desc:"You can use Action Surge twice per rest, but only once on the same turn."},
  'Martial Archetype': "Choose the subclass (Martial Archetype) that shapes your combat approach; it grants features as you level.",
  'Indomitable': {use:'special', cost:'1/long rest', desc:"Reroll a saving throw you fail, and must use the new roll, once per long rest."},
  'Indomitable (2 uses)': {use:'special', cost:'2/long rest', desc:"You can use Indomitable twice per long rest."},
  'Indomitable (3 uses)': {use:'special', cost:'3/long rest', desc:"You can use Indomitable three times per long rest."},
  // Monk
  'Martial Arts': {use:'bonus action', desc:"While unarmed or wielding a monk weapon, you can use Dexterity for attacks and damage, roll a Martial Arts die for damage, and make an unarmed strike as a bonus action."},
  'Ki': {use:'special', desc:"You gain a pool of ki points (equal to your monk level) to fuel Flurry of Blows, Patient Defense, and Step of the Wind; regained on a short or long rest."},
  'Unarmored Movement': "Your speed increases while you wear no armor and wield no shield, with the bonus growing as you level.",
  'Monastic Tradition': "Choose the subclass (Monastic Tradition) you follow; it grants features as you level.",
  'Deflect Missiles': {use:'reaction', desc:"Use your reaction to reduce ranged weapon damage against you; if you reduce it to 0 you can catch the missile and throw it back by spending 1 ki."},
  'Slow Fall': {use:'reaction', desc:"Use your reaction when you fall to reduce the falling damage you take by five times your monk level."},
  'Stunning Strike': {use:'special', cost:'1 ki', desc:"When you hit with a melee attack, spend 1 ki to force a Constitution save or stun the target until the end of your next turn."},
  'Ki-Empowered Strikes': "Your unarmed strikes count as magical for overcoming resistance and immunity to nonmagical attacks.",
  'Stillness of Mind': {use:'action', desc:"Use your action to end one effect on yourself that is causing you to be charmed or frightened."},
  'Purity of Body': "You are immune to disease and poison.",
  'Unarmored Movement improvement': "You can move along vertical surfaces and across liquids on your turn without falling during the move.",
  'Tongue of the Sun and Moon': "You understand all spoken languages, and any creature that understands a language can understand you.",
  'Diamond Soul': {use:'special', cost:'1 ki', desc:"You gain proficiency in all saving throws, and can spend 1 ki to reroll a saving throw you fail."},
  'Empty Body': {use:'action', cost:'4 ki', desc:"Spend 4 ki to become invisible for 1 minute with resistance to all damage but force; you can also spend 8 ki to cast Astral Projection."},
  'Perfect Self': "When you roll initiative and have no ki points remaining, you regain 4 ki points.",
  // Paladin
  'Divine Sense': {use:'action', cost:'1+CHA/long rest', desc:"As an action, detect celestials, fiends, and undead within 60 feet and sense consecrated or desecrated places. Uses equal 1 + your Charisma modifier per long rest."},
  'Lay on Hands': {use:'action', cost:'5 × level pool', desc:"You have a healing pool of 5 × your paladin level; as an action, touch a creature to restore hit points from it, or spend 5 to cure a disease or neutralize a poison."},
  'Divine Smite': {use:'special', cost:'1 spell slot', desc:"When you hit with a melee weapon, expend a spell slot to deal an extra 2d8 radiant damage, plus 1d8 per slot level above 1st and extra against undead and fiends."},
  'Divine Health': "The divine magic flowing through you makes you immune to disease.",
  'Sacred Oath': "Choose the subclass (Sacred Oath) you swear; it grants oath spells, Channel Divinity options, and features as you level.",
  'Oath feature': "Your Sacred Oath grants a feature at this level — see the subclass entry below.",
  'Aura of Protection': "You and friendly creatures within 10 feet add your Charisma modifier (minimum +1) to saving throws while you're conscious.",
  'Aura of Courage': "You and friendly creatures within 10 feet can't be frightened while you're conscious.",
  'Improved Divine Smite': "Your melee weapon hits deal an extra 1d8 radiant damage.",
  'Cleansing Touch': {use:'action', cost:'CHA mod/long rest', desc:"As an action, end one spell on yourself or a willing creature you touch. Uses equal your Charisma modifier per long rest."},
  'Aura improvements': "The range of your paladin auras increases from 10 to 30 feet.",
  // Ranger
  'Favored Enemy': "Choose a favored enemy type: you have advantage on Survival checks to track them and Intelligence checks to recall lore about them, and you learn a related language.",
  'Natural Explorer': "Choose a favored terrain to gain exploration benefits there, such as not being slowed by difficult terrain and always knowing which way is north.",
  'Ranger Archetype': "Choose the subclass (Ranger Archetype) that defines your training; it grants features as you level.",
  'Primeval Awareness': {use:'action', cost:'1 spell slot', desc:"Expend a spell slot to sense whether certain creature types are present within 1 mile (6 miles in your favored terrain)."},
  "Land's Stride": "Moving through nonmagical difficult terrain costs you no extra movement, and you have advantage on saves against plants that impede movement.",
  'Favored Enemy & Natural Explorer improvements': "You choose an additional favored enemy and an additional favored terrain, improving both features.",
  'Hide in Plain Sight': {use:'special', cost:'1 min to prepare', desc:"Spend 1 minute making camouflage to gain a +10 bonus to Stealth checks while you remain motionless against a solid surface."},
  'Vanish': {use:'bonus action', desc:"You can use the Hide action as a bonus action, and you can't be tracked by nonmagical means unless you choose to leave a trail."},
  'Feral Senses': "You gain preternatural senses that help you fight creatures you can't see and pinpoint invisible creatures within 30 feet.",
  'Foe Slayer': {use:'special', cost:'1/turn', desc:"Once per turn, add your Wisdom modifier to the attack roll or damage roll of an attack against your favored enemy."},
  // Rogue
  'Sneak Attack': {use:'special', cost:'1/turn'}, // base entry: use/cost for the dice-scaling row
  'Sneak Attack (1d6, +1d6 every odd level)': "Once per turn, deal extra damage to a target you hit with a finesse or ranged weapon when you have advantage or an ally is adjacent — 1d6 at 1st level, rising 1d6 every odd rogue level.",
  "Thieves' Cant": "You know Thieves' Cant, a secret mix of dialect, jargon, and code that lets you hide messages within seemingly normal conversation.",
  'Cunning Action': {use:'bonus action', desc:"On each of your turns, use a bonus action to Dash, Disengage, or Hide."},
  'Roguish Archetype': "Choose the subclass (Roguish Archetype) that shapes your talents; it grants features as you level.",
  'Uncanny Dodge': {use:'reaction', desc:"When an attacker you can see hits you, use your reaction to halve that attack's damage."},
  'Reliable Talent': "Whenever you make an ability check using a skill or tool you're proficient in, treat a d20 roll of 9 or lower as a 10.",
  'Blindsense': "You're aware of the location of any hidden or invisible creature within 10 feet of you.",
  'Slippery Mind': "You gain proficiency in Wisdom saving throws.",
  'Elusive': "No attack roll has advantage against you while you aren't incapacitated.",
  'Stroke of Luck': {use:'special', cost:'1/rest', desc:"Once per short or long rest, turn a missed attack into a hit, or a failed ability check into a 20."},
  // Sorcerer
  'Sorcerous Origin': "Choose the subclass (Sorcerous Origin) that is the source of your innate magic; it grants features as you level.",
  'Origin feature': "Your Sorcerous Origin grants a feature at this level — see the subclass entry below.",
  'Font of Magic (Sorcery Points)': {use:'bonus action', desc:"You gain a pool of sorcery points (equal to your sorcerer level) that you can convert to and from spell slots and spend on Metamagic."},
  'Metamagic': {use:'special', cost:'sorcery points', desc:"Learn Metamagic options that let you spend sorcery points to bend your spells, such as Twinned, Quickened, or Subtle Spell."},
  'Metamagic option': "You learn an additional Metamagic option of your choice.",
  'Sorcerous Restoration': "You regain 4 expended sorcery points whenever you finish a short rest.",
  // Warlock
  'Otherworldly Patron': "Choose the subclass (Otherworldly Patron) that grants you power; it adds to your spell options and grants features as you level.",
  'Pact Magic': "You cast spells using a small number of slots that are always your highest available level and recharge on a short or long rest.",
  'Eldritch Invocations': "Learn Eldritch Invocations — fragments of forbidden knowledge that grant lasting magical abilities.",
  'Pact Boon': "Choose a Pact Boon: Pact of the Chain (a special familiar), Pact of the Blade (summon a weapon), or Pact of the Tome (extra cantrips).",
  'Patron feature': "Your Otherworldly Patron grants a feature at this level — see the subclass entry below.",
  'Mystic Arcanum': {use:'special', cost:'1/long rest'}, // base entry: use/cost for every arcanum row
  'Mystic Arcanum (6th level)': "Choose one 6th-level spell you can cast once per long rest without expending a spell slot.",
  'Mystic Arcanum (7th level)': "Choose one 7th-level spell you can cast once per long rest without a slot.",
  'Mystic Arcanum (8th level)': "Choose one 8th-level spell you can cast once per long rest without a slot.",
  'Mystic Arcanum (9th level)': "Choose one 9th-level spell you can cast once per long rest without a slot.",
  'Eldritch Master': {use:'special', cost:'1/long rest', desc:"Once per long rest, spend 1 minute entreating your patron to regain all expended Pact Magic spell slots."},
  // Wizard
  'Arcane Recovery': {use:'special', cost:'1/day', desc:"Once per day on a short rest, recover expended spell slots with a combined level up to half your wizard level (rounded up), none of 6th level or higher."},
  'Arcane Tradition': "Choose the subclass (Arcane Tradition), a school of magic you specialize in; it grants features as you level.",
  'Spell Mastery': {use:'special', cost:'at will', desc:"Choose a 1st- and a 2nd-level wizard spell in your spellbook that you can cast at their lowest level without expending a spell slot."},
  'Signature Spells': {use:'special', cost:'1/rest each', desc:"Choose two 3rd-level wizard spells you always have prepared and can each cast once per short rest without a slot."},
  // Artificer
  'Magical Tinkering': {use:'action', desc:"Imbue a Tiny nonmagical object with a minor magical property, such as light, a recorded message, a smell, or a small sensory effect."},
  'Infuse Item': {use:'special', cost:'on a long rest', desc:"You learn magical infusions and can imbue mundane items with them after a long rest, creating replicable magic items."},
  'Artificer Specialist': "Choose the subclass (Artificer Specialist) that defines your craft; it grants specialist spells and features as you level.",
  'The Right Tool for the Job': {use:'special', cost:'on a rest', desc:"During a short or long rest, magically create one set of artisan's tools in an unoccupied space."},
  'Tool Expertise': "You double your proficiency bonus for any ability check you make that uses your proficiency with a tool.",
  'Flash of Genius': {use:'reaction', cost:'INT mod/long rest', desc:"When you or a creature within 30 feet makes an ability check or saving throw, use your reaction to add your Intelligence modifier (uses = INT modifier per long rest)."},
  'Magic Item Adept': "You can attune to up to four magic items at once, and craft common and uncommon magic items in a quarter of the usual time at half the cost.",
  'Spell-Storing Item': {use:'special', cost:'on a long rest', desc:"After a long rest, store a 1st- or 2nd-level artificer spell in an item so a holder can cast it without a slot a limited number of times."},
  'Magic Item Savant': "You can attune to up to five magic items at once, and ignore all class, race, spell, and level requirements on attunement.",
  'Magic Item Master': "You can attune to up to six magic items at once.",
  'Soul of Artifice': "You gain a +1 bonus to all saving throws per magic item you're attuned to, and can drop to 1 hit point instead of 0 by ending one of your infusions.",
  'Specialist feature': "Your Artificer Specialist grants a feature at this level — see the subclass entry below.",
};

// Expands compact progression rows [level, ...feature names] into feature
// objects, attaching name/use/cost/desc from FEATURE_INFO. A base-name entry
// (parenthetical stripped) supplies shared use/cost to every variant; the
// full-name entry wins where both set the same field.
const featInfo = v => typeof v === 'string' ? {desc:v} : v;
function P(rows){
  return rows.flatMap(([lv,...names])=>names.map(n=>{
    const base = n.replace(/\s*\(.*\)\s*$/,'').trim();
    const {use, cost, desc} = Object.assign({}, featInfo(FEATURE_INFO[base]), featInfo(FEATURE_INFO[n]));
    return {lv, name:n, use, cost, desc};
  }));
}

// Class registry: saving-throw proficiencies are applied automatically when a
// class is picked in Settings. `features` feeds the class card in Settings,
// the Class Features panel, and (for entries with `use` tags) the Actions tab.
// `casting` describes spell access; `subclassLevel` is when the subclass is chosen.
const CLASS_DATA = {
  Artificer:{ hitDie:8, saves:['con','int'], choose:2, skills:['Arcana','History','Investigation','Medicine','Nature','Perception','Sleight of Hand'],
    subclassLevel:3, subclasses:['Alchemist','Armorer','Artillerist','Battle Smith'],
    casting:{type:'half', ability:'int', roundUp:true, note:'Prepared caster: prepares INT modifier + half artificer level (rounded down) spells; can cast rituals and use tools as a spellcasting focus.'},
    desc:'Masters of invention, artificers use ingenuity and magic to unlock extraordinary capabilities in objects. Proficient with light &amp; medium armor, shields, and simple weapons; INT is their spellcasting ability.',
    features:P([[1,'Magical Tinkering','Spellcasting'],[2,'Infuse Item'],[3,'Artificer Specialist','The Right Tool for the Job'],[4,'Ability Score Improvement'],[5,'Specialist feature'],[6,'Tool Expertise'],[7,'Flash of Genius'],[8,'Ability Score Improvement'],[9,'Specialist feature'],[10,'Magic Item Adept'],[11,'Spell-Storing Item'],[12,'Ability Score Improvement'],[14,'Magic Item Savant'],[15,'Specialist feature'],[16,'Ability Score Improvement'],[18,'Magic Item Master'],[19,'Ability Score Improvement'],[20,'Soul of Artifice']]) },
  Barbarian:{ hitDie:12, saves:['str','con'], choose:2, skills:['Animal Handling','Athletics','Intimidation','Nature','Perception','Survival'],
    subclassLevel:3, subclasses:['Path of the Berserker','Path of the Totem Warrior'],
    casting:{type:'none'},
    features:P([[1,'Rage','Unarmored Defense'],[2,'Reckless Attack','Danger Sense'],[3,'Primal Path'],[4,'Ability Score Improvement'],[5,'Extra Attack','Fast Movement'],[6,'Path feature'],[7,'Feral Instinct'],[8,'Ability Score Improvement'],[9,'Brutal Critical (1 die)'],[10,'Path feature'],[11,'Relentless Rage'],[12,'Ability Score Improvement'],[13,'Brutal Critical (2 dice)'],[14,'Path feature'],[15,'Persistent Rage'],[16,'Ability Score Improvement'],[17,'Brutal Critical (3 dice)'],[18,'Indomitable Might'],[19,'Ability Score Improvement'],[20,'Primal Champion']]) },
  Bard:{ hitDie:8, saves:['dex','cha'], choose:3, skills:'any',
    subclassLevel:3, subclasses:['College of Lore','College of Valor'],
    casting:{type:'full', ability:'cha'},
    features:P([[1,'Spellcasting','Bardic Inspiration (d6)'],[2,'Jack of All Trades','Song of Rest (d6)'],[3,'Bard College','Expertise'],[4,'Ability Score Improvement'],[5,'Bardic Inspiration (d8)','Font of Inspiration'],[6,'Countercharm','College feature'],[8,'Ability Score Improvement'],[9,'Song of Rest (d8)'],[10,'Bardic Inspiration (d10)','Expertise','Magical Secrets'],[12,'Ability Score Improvement'],[13,'Song of Rest (d10)'],[14,'Magical Secrets','College feature'],[15,'Bardic Inspiration (d12)'],[16,'Ability Score Improvement'],[17,'Song of Rest (d12)'],[18,'Magical Secrets'],[19,'Ability Score Improvement'],[20,'Superior Inspiration']]) },
  Cleric:{ hitDie:8, saves:['wis','cha'], choose:2, skills:['History','Insight','Medicine','Persuasion','Religion'],
    subclassLevel:1, subclasses:['Knowledge','Life','Light','Nature','Tempest','Trickery','War'],
    casting:{type:'full', ability:'wis'},
    features:P([[1,'Spellcasting','Divine Domain'],[2,'Channel Divinity (1/rest)','Domain feature'],[4,'Ability Score Improvement'],[5,'Destroy Undead (CR 1/2)'],[6,'Channel Divinity (2/rest)','Domain feature'],[8,'Ability Score Improvement','Destroy Undead (CR 1)','Domain feature'],[10,'Divine Intervention'],[11,'Destroy Undead (CR 2)'],[12,'Ability Score Improvement'],[14,'Destroy Undead (CR 3)'],[16,'Ability Score Improvement'],[17,'Destroy Undead (CR 4)','Domain feature'],[18,'Channel Divinity (3/rest)'],[19,'Ability Score Improvement'],[20,'Divine Intervention improvement']]) },
  Druid:{ hitDie:8, saves:['int','wis'], choose:2, skills:['Animal Handling','Arcana','Insight','Medicine','Nature','Perception','Religion','Survival'],
    subclassLevel:2, subclasses:['Circle of the Land','Circle of the Moon'],
    casting:{type:'full', ability:'wis'},
    features:P([[1,'Druidic','Spellcasting'],[2,'Wild Shape','Druid Circle'],[4,'Ability Score Improvement','Wild Shape improvement'],[6,'Circle feature'],[8,'Ability Score Improvement','Wild Shape improvement'],[10,'Circle feature'],[12,'Ability Score Improvement'],[14,'Circle feature'],[16,'Ability Score Improvement'],[18,'Timeless Body','Beast Spells'],[19,'Ability Score Improvement'],[20,'Archdruid']]) },
  Fighter:{ hitDie:10, saves:['str','con'], choose:2, skills:['Acrobatics','Animal Handling','Athletics','History','Insight','Intimidation','Perception','Survival'],
    subclassLevel:3, subclasses:['Champion','Battle Master','Eldritch Knight'],
    casting:{type:'none', note:'Non-caster, but the Eldritch Knight archetype gains INT-based wizard spells from L3.'},
    features:P([[1,'Fighting Style','Second Wind'],[2,'Action Surge'],[3,'Martial Archetype'],[4,'Ability Score Improvement'],[5,'Extra Attack'],[6,'Ability Score Improvement'],[7,'Archetype feature'],[8,'Ability Score Improvement'],[9,'Indomitable'],[10,'Archetype feature'],[11,'Extra Attack (2)'],[12,'Ability Score Improvement'],[13,'Indomitable (2 uses)'],[14,'Ability Score Improvement'],[15,'Archetype feature'],[16,'Ability Score Improvement'],[17,'Action Surge (2 uses)','Indomitable (3 uses)'],[18,'Archetype feature'],[19,'Ability Score Improvement'],[20,'Extra Attack (3)']]) },
  Jaeger:{ hitDie:8, saves:['dex','int'], choose:3, homebrew:true,
    skills:['Acrobatics','Arcana','Athletics','History','Investigation','Medicine','Nature','Perception','Religion','Sleight of Hand','Stealth','Survival'],
    subclassLevel:3, subclasses:['Absolute Chapter','Heretic Chapter','Marauder Chapter','Salvation Chapter','Sanguine Chapter'],
    casting:{type:'none', note:'Martial class — no base spellcasting. The Heretic Chapter unlocks INT-based warlock spells: 1st@L3, 2nd@L7, 3rd@L13, 4th@L19 (short-rest slots).'},
    desc:'Jaegers are defined by their efficiency in battle, using their mastery over both steel and gunpowder to lay waste to all who oppose them. Proficient with light/medium armor, simple &amp; martial weapons, and firearms.',
    features:[
      {lv:1, name:'Flexible Combatant', use:'passive', desc:'Draw or stow two one-handed weapons at once and reload without a free hand. No disadvantage on ranged attacks within 5 ft of a hostile while wielding a one-handed melee weapon in the other hand.'},
      {lv:1, name:'Focus', use:'passive', desc:'Focus Points fuel Focus Arts: 1 point at 1st level, rising to 2/3/4/5/6 at levels 2/5/9/13/17. Regain all on a rest, 1 on a natural 20 against a hostile creature, and 1 when rolling initiative with none left.'},
      {lv:1, name:'Weapon Parry', use:'reaction', cost:'1 FP', desc:'When hit by a creature in weapon range, make a special attack that blocks damage equal to its damage roll. On a 20 the dice are doubled, and a full block stuns the attacker.'},
      {lv:1, name:'Dodge Step', use:'reaction', cost:'1 FP', desc:'When attacked, move 5 ft without provoking and make a DEX save vs the attack roll: no damage on a success, half on a failure.'},
      {lv:1, name:'Eldritch Hunter', use:'passive', desc:'Add your proficiency bonus (double it if already proficient) on checks to track or identify Aberrations, Celestials, Fiends, Monstrosities, and Undead.'},
      {lv:2, name:'Momentum', use:'passive', desc:'Spending a Focus Point grants a Momentum die (d6; d8 at 11th, d10 at 17th). Max dice = proficiency bonus + STR or DEX modifier. Spend all dice to execute a Finisher.'},
      {lv:2, name:'Brutal Finisher', use:'special', cost:'all dice', desc:'On a hit, add all Momentum dice to the damage roll. If the target drops to 0 HP, regain 1 Focus Point.'},
      {lv:2, name:'Fighting Style', use:'passive', desc:'Choose one: Dueling, Great Weapon Fighting, Flexible Fighting, Focused Fighting, or Two-Weapon Fighting.'},
      {lv:3, name:'Jaeger Chapter', use:'passive', desc:'Choose a Chapter (subclass): Absolute, Heretic, Marauder, Salvation, or Sanguine.'},
      {lv:3, name:'Piercing Gaze', use:'free', cost:'1/long rest', desc:'For 1 hour gain 60 ft darkvision (or +60 ft). From 7th level also see invisibility; from 13th, truesight.'},
      {lv:4, name:'Seasoned Survivor', use:'passive', desc:'Advantage on Investigation checks to find secret passages, interpret markings, or determine fates from remains.'},
      {lv:5, name:'Extra Attack', use:'passive', desc:'Attack twice whenever you take the Attack action on your turn.'},
      {lv:6, name:"Hunter's Pursuit", use:'special', cost:'1 FP', desc:'At the start of your turn, immediately move up to half your speed for free, without provoking opportunity attacks.'},
      {lv:9, name:'Evasion', use:'passive', desc:'On DEX saves for half damage, take no damage on a success and half on a failure.'},
      {lv:11, name:'Lethal Tempo', use:'passive', desc:'The first hit on your turn grants 1 Momentum die; dropping a creature to 0 HP grants 1 more.'},
      {lv:13, name:'Relentless Pursuit', use:'passive', desc:"Hunter's Pursuit refunds its Focus Point if you end the move next to a hostile creature."},
      {lv:15, name:'Inured to Madness', use:'passive', desc:'Advantage on saves against charm, fright, and madness. Spend 1 FP to reroll a failed madness save.'},
      {lv:18, name:'Eternal Watch', use:'passive', desc:'You are always under the effect of Piercing Gaze.'},
      {lv:20, name:'Always Ready', use:'passive', desc:'Once per round, gain an extra reaction usable only on a reaction Focus Art; the Focus Point spent on it is refunded.'},
    ] },
  Monk:{ hitDie:8, saves:['str','dex'], choose:2, skills:['Acrobatics','Athletics','History','Insight','Religion','Stealth'],
    subclassLevel:3, subclasses:['Way of the Open Hand','Way of Shadow','Way of the Four Elements'],
    casting:{type:'none'},
    features:P([[1,'Unarmored Defense','Martial Arts'],[2,'Ki','Unarmored Movement'],[3,'Monastic Tradition','Deflect Missiles'],[4,'Ability Score Improvement','Slow Fall'],[5,'Extra Attack','Stunning Strike'],[6,'Ki-Empowered Strikes','Tradition feature'],[7,'Evasion','Stillness of Mind'],[8,'Ability Score Improvement'],[9,'Unarmored Movement improvement'],[10,'Purity of Body'],[11,'Tradition feature'],[12,'Ability Score Improvement'],[13,'Tongue of the Sun and Moon'],[14,'Diamond Soul'],[15,'Timeless Body'],[16,'Ability Score Improvement'],[17,'Tradition feature'],[18,'Empty Body'],[19,'Ability Score Improvement'],[20,'Perfect Self']]) },
  Paladin:{ hitDie:10, saves:['wis','cha'], choose:2, skills:['Athletics','Insight','Intimidation','Medicine','Persuasion','Religion'],
    subclassLevel:3, subclasses:['Oath of Devotion','Oath of the Ancients','Oath of Vengeance'],
    casting:{type:'half', ability:'cha'},
    features:P([[1,'Divine Sense','Lay on Hands'],[2,'Fighting Style','Spellcasting','Divine Smite'],[3,'Divine Health','Sacred Oath'],[4,'Ability Score Improvement'],[5,'Extra Attack'],[6,'Aura of Protection'],[7,'Oath feature'],[8,'Ability Score Improvement'],[10,'Aura of Courage'],[11,'Improved Divine Smite'],[12,'Ability Score Improvement'],[14,'Cleansing Touch'],[15,'Oath feature'],[16,'Ability Score Improvement'],[18,'Aura improvements'],[19,'Ability Score Improvement'],[20,'Oath feature']]) },
  Ranger:{ hitDie:10, saves:['str','dex'], choose:3, skills:['Animal Handling','Athletics','Insight','Investigation','Nature','Perception','Stealth','Survival'],
    subclassLevel:3, subclasses:['Hunter','Beast Master'],
    casting:{type:'half', ability:'wis'},
    features:P([[1,'Favored Enemy','Natural Explorer'],[2,'Fighting Style','Spellcasting'],[3,'Ranger Archetype','Primeval Awareness'],[4,'Ability Score Improvement'],[5,'Extra Attack'],[6,'Favored Enemy & Natural Explorer improvements'],[7,'Archetype feature'],[8,'Ability Score Improvement',"Land's Stride"],[10,'Hide in Plain Sight'],[11,'Archetype feature'],[12,'Ability Score Improvement'],[14,'Vanish'],[15,'Archetype feature'],[16,'Ability Score Improvement'],[18,'Feral Senses'],[19,'Ability Score Improvement'],[20,'Foe Slayer']]) },
  Rogue:{ hitDie:8, saves:['dex','int'], choose:4, skills:['Acrobatics','Athletics','Deception','Insight','Intimidation','Investigation','Perception','Performance','Persuasion','Sleight of Hand','Stealth'],
    subclassLevel:3, subclasses:['Thief','Assassin','Arcane Trickster'],
    casting:{type:'none', note:'Non-caster, but the Arcane Trickster archetype gains INT-based wizard spells from L3.'},
    features:P([[1,'Expertise','Sneak Attack (1d6, +1d6 every odd level)',"Thieves' Cant"],[2,'Cunning Action'],[3,'Roguish Archetype'],[4,'Ability Score Improvement'],[5,'Uncanny Dodge'],[6,'Expertise'],[7,'Evasion'],[8,'Ability Score Improvement'],[9,'Archetype feature'],[10,'Ability Score Improvement'],[11,'Reliable Talent'],[12,'Ability Score Improvement'],[13,'Archetype feature'],[14,'Blindsense'],[15,'Slippery Mind'],[16,'Ability Score Improvement'],[17,'Archetype feature'],[18,'Elusive'],[19,'Ability Score Improvement'],[20,'Stroke of Luck']]) },
  Sorcerer:{ hitDie:6, saves:['con','cha'], choose:2, skills:['Arcana','Deception','Insight','Intimidation','Persuasion','Religion'],
    subclassLevel:1, subclasses:['Draconic Bloodline','Wild Magic'],
    casting:{type:'full', ability:'cha'},
    features:P([[1,'Spellcasting','Sorcerous Origin'],[2,'Font of Magic (Sorcery Points)'],[3,'Metamagic'],[4,'Ability Score Improvement'],[6,'Origin feature'],[8,'Ability Score Improvement'],[10,'Metamagic option'],[12,'Ability Score Improvement'],[14,'Origin feature'],[16,'Ability Score Improvement'],[17,'Metamagic option'],[18,'Origin feature'],[19,'Ability Score Improvement'],[20,'Sorcerous Restoration']]) },
  Warlock:{ hitDie:8, saves:['wis','cha'], choose:2, skills:['Arcana','Deception','History','Intimidation','Investigation','Nature','Religion'],
    subclassLevel:1, subclasses:['The Archfey','The Fiend','The Great Old One'],
    casting:{type:'pact', ability:'cha'},
    features:P([[1,'Otherworldly Patron','Pact Magic'],[2,'Eldritch Invocations'],[3,'Pact Boon'],[4,'Ability Score Improvement'],[6,'Patron feature'],[8,'Ability Score Improvement'],[10,'Patron feature'],[11,'Mystic Arcanum (6th level)'],[12,'Ability Score Improvement'],[13,'Mystic Arcanum (7th level)'],[14,'Patron feature'],[15,'Mystic Arcanum (8th level)'],[16,'Ability Score Improvement'],[17,'Mystic Arcanum (9th level)'],[19,'Ability Score Improvement'],[20,'Eldritch Master']]) },
  Wizard:{ hitDie:6, saves:['int','wis'], choose:2, skills:['Arcana','History','Insight','Investigation','Medicine','Religion'],
    subclassLevel:2, subclasses:['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation'],
    casting:{type:'full', ability:'int'},
    features:P([[1,'Spellcasting','Arcane Recovery'],[2,'Arcane Tradition'],[4,'Ability Score Improvement'],[6,'Tradition feature'],[8,'Ability Score Improvement'],[10,'Tradition feature'],[12,'Ability Score Improvement'],[14,'Tradition feature'],[16,'Ability Score Improvement'],[18,'Spell Mastery'],[19,'Ability Score Improvement'],[20,'Signature Spells']]) },
};

// Tag every built-in class with a source for filtering. The SRD roster is
// official 5E; Jaeger is the World Anvil homebrew. `homebrew`/`builtin` flags
// are kept in sync so older code paths and re-imports behave consistently.
const CLASS_SOURCES = ['5E', '5E (legacy)', '5.5E', 'Homebrew'];
Object.values(CLASS_DATA).forEach(cd=>{
  if(!cd.source) cd.source = cd.homebrew ? 'Homebrew' : '5E';
  cd.homebrew = cd.source === 'Homebrew';
  cd.builtin = true;
});
