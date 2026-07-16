// ============================================================================
// Built-in game content: the static reference tables the sheet is seeded with.
// Split out of app.js so that file holds behaviour and this one holds data.
//
// Loaded as a classic script BEFORE /app.js (see src/views/*.html): every
// top-level `const` here is visible to app.js and the /modules scripts.
//
// Everything defined here is built-in content. User-imported ("custom") data is
// DB-backed and merged into these registries at startup by app.js, which is
// also why the BUILTIN_* snapshots at the bottom exist: deleting an import that
// shadowed a built-in restores the original from the snapshot.
// ============================================================================
// Curated subset of SRD spells per class, by spell level (0 = cantrip).
// Not exhaustive of the full 5e SRD list -- easy to extend by adding entries here.
const SPELL_DATA = {
  Bard: [
    {name:'Vicious Mockery', level:0},{name:'Prestidigitation', level:0},{name:'Mage Hand', level:0},{name:'Minor Illusion', level:0},
    {name:"Healing Word", level:1},{name:'Charm Person', level:1},{name:'Dissonant Whispers', level:1},{name:'Faerie Fire', level:1},{name:'Sleep', level:1},{name:'Thunderwave', level:1},
    {name:'Suggestion', level:2},{name:'Invisibility', level:2},{name:'Shatter', level:2},{name:'Heat Metal', level:2},{name:'Hold Person', level:2},
    {name:'Hypnotic Pattern', level:3},{name:'Fear', level:3},{name:'Dispel Magic', level:3},{name:'Speak with Dead', level:3},
    {name:'Greater Invisibility', level:4},{name:'Polymorph', level:4},{name:'Confusion', level:4},
    {name:'Mass Cure Wounds', level:5},{name:"Hold Monster", level:5},{name:'Legend Lore', level:5},
  ],
  Cleric: [
    {name:'Sacred Flame', level:0},{name:'Guidance', level:0},{name:'Spare the Dying', level:0},{name:'Light', level:0},{name:'Thaumaturgy', level:0},
    {name:'Cure Wounds', level:1},{name:'Healing Word', level:1},{name:'Bless', level:1},{name:'Guiding Bolt', level:1},{name:'Shield of Faith', level:1},{name:'Command', level:1},
    {name:'Spiritual Weapon', level:2},{name:'Prayer of Healing', level:2},{name:'Lesser Restoration', level:2},{name:'Hold Person', level:2},{name:'Silence', level:2},{name:'Aid', level:2},
    {name:"Mass Healing Word", level:3},{name:'Spirit Guardians', level:3},{name:'Revivify', level:3},{name:'Dispel Magic', level:3},{name:'Beacon of Hope', level:3},
    {name:'Death Ward', level:4},{name:'Guardian of Faith', level:4},{name:'Freedom of Movement', level:4},
    {name:'Mass Cure Wounds', level:5},{name:'Flame Strike', level:5},{name:'Raise Dead', level:5},
  ],
  Druid: [
    {name:'Produce Flame', level:0},{name:'Guidance', level:0},{name:'Shillelagh', level:0},{name:'Druidcraft', level:0},
    {name:'Cure Wounds', level:1},{name:'Entangle', level:1},{name:'Faerie Fire', level:1},{name:'Goodberry', level:1},{name:'Healing Word', level:1},{name:'Thunderwave', level:1},
    {name:'Moonbeam', level:2},{name:'Barkskin', level:2},{name:'Flame Blade', level:2},{name:'Spike Growth', level:2},{name:'Animal Messenger', level:2},
    {name:'Call Lightning', level:3},{name:'Conjure Animals', level:3},{name:'Plant Growth', level:3},{name:'Dispel Magic', level:3},{name:'Sleet Storm', level:3},
    {name:'Ice Storm', level:4},{name:'Polymorph', level:4},{name:'Blight', level:4},{name:'Freedom of Movement', level:4},
    {name:'Insect Plague', level:5},{name:'Mass Cure Wounds', level:5},{name:'Tree Stride', level:5},{name:'Reincarnate', level:5},
  ],
  Paladin: [
    {name:'Cure Wounds', level:1},{name:'Bless', level:1},{name:'Shield of Faith', level:1},{name:'Command', level:1},{name:'Detect Evil and Good', level:1},{name:'Divine Favor', level:1},
    {name:'Lesser Restoration', level:2},{name:'Zone of Truth', level:2},{name:'Find Steed', level:2},{name:'Aid', level:2},
    {name:'Aura of Vitality', level:3},{name:'Dispel Magic', level:3},{name:'Revivify', level:3},{name:'Blinding Smite', level:3},
    {name:'Death Ward', level:4},{name:'Aura of Life', level:4},{name:'Staggering Smite', level:4},
    {name:'Circle of Power', level:5},{name:'Destructive Wave', level:5},{name:'Raise Dead', level:5},
  ],
  Ranger: [
    {name:"Hunter's Mark", level:1},{name:'Cure Wounds', level:1},{name:'Goodberry', level:1},{name:'Ensnaring Strike', level:1},
    {name:'Spike Growth', level:2},{name:'Pass without Trace', level:2},{name:'Silence', level:2},{name:'Barkskin', level:2},
    {name:'Conjure Animals', level:3},{name:'Plant Growth', level:3},{name:'Lightning Arrow', level:3},
    {name:'Freedom of Movement', level:4},{name:'Grasping Vine', level:4},
    {name:'Tree Stride', level:5},{name:'Swift Quiver', level:5},
  ],
  Sorcerer: [
    {name:'Fire Bolt', level:0},{name:'Mage Hand', level:0},{name:'Minor Illusion', level:0},{name:'Prestidigitation', level:0},{name:'Ray of Frost', level:0},{name:'Light', level:0},
    {name:'Magic Missile', level:1},{name:'Shield', level:1},{name:'Burning Hands', level:1},{name:'Charm Person', level:1},{name:'Chromatic Orb', level:1},
    {name:'Misty Step', level:2},{name:'Scorching Ray', level:2},{name:'Mirror Image', level:2},{name:'Suggestion', level:2},
    {name:'Fireball', level:3},{name:'Haste', level:3},{name:'Counterspell', level:3},{name:'Lightning Bolt', level:3},{name:'Fly', level:3},
    {name:'Polymorph', level:4},{name:'Greater Invisibility', level:4},{name:'Dimension Door', level:4},
    {name:'Cone of Cold', level:5},{name:'Telekinesis', level:5},{name:'Hold Monster', level:5},
  ],
  Warlock: [
    {name:'Eldritch Blast', level:0},{name:'Minor Illusion', level:0},{name:'Prestidigitation', level:0},{name:'Mage Hand', level:0},
    {name:'Hex', level:1},{name:'Charm Person', level:1},{name:'Armor of Agathys', level:1},{name:'Witch Bolt', level:1},
    {name:'Suggestion', level:2},{name:'Invisibility', level:2},{name:'Mirror Image', level:2},{name:'Hold Person', level:2},
    {name:'Counterspell', level:3},{name:'Fear', level:3},{name:'Hunger of Hadar', level:3},{name:'Fly', level:3},
    {name:'Dimension Door', level:4},{name:'Banishment', level:4},{name:'Greater Invisibility', level:4},
    {name:'Hold Monster', level:5},{name:'Contact Other Plane', level:5},
  ],
  Wizard: [
    {name:'Fire Bolt', level:0},{name:'Mage Hand', level:0},{name:'Prestidigitation', level:0},{name:'Minor Illusion', level:0},{name:'Ray of Frost', level:0},{name:'Light', level:0},
    {name:'Magic Missile', level:1},{name:'Shield', level:1},{name:'Detect Magic', level:1},{name:'Identify', level:1},{name:'Mage Armor', level:1},{name:'Sleep', level:1},{name:'Burning Hands', level:1},{name:'Find Familiar', level:1},
    {name:'Misty Step', level:2},{name:'Scorching Ray', level:2},{name:'Web', level:2},{name:'Invisibility', level:2},{name:'Mirror Image', level:2},{name:'Suggestion', level:2},
    {name:'Fireball', level:3},{name:'Counterspell', level:3},{name:'Fly', level:3},{name:'Haste', level:3},{name:'Lightning Bolt', level:3},{name:'Dispel Magic', level:3},
    {name:'Polymorph', level:4},{name:'Greater Invisibility', level:4},{name:'Ice Storm', level:4},{name:'Dimension Door', level:4},
    {name:'Wall of Force', level:5},{name:'Cone of Cold', level:5},{name:'Telekinesis', level:5},{name:'Hold Monster', level:5},
  ],
};
const SPELL_CLASSES = Object.keys(SPELL_DATA);

// School + short effect summary for every built-in SPELL_DATA spell, adapted
// from the SRD 5.1 (Open Game Content). Feeds the Notes reference search and
// prefills the Library's spell-edit form for built-in names.
const SPELL_DETAILS = {
  // Cantrips
  'Druidcraft':{school:'Transmutation', desc:'Minor nature magic: predict the weather, bloom a flower, snuff or light a candle-sized flame, or make a harmless sensory effect.'},
  'Eldritch Blast':{school:'Evocation', desc:'A beam of crackling energy; ranged spell attack for 1d10 force damage. Extra beams at higher character levels.'},
  'Fire Bolt':{school:'Evocation', desc:'Hurl a mote of fire; ranged spell attack for 1d10 fire damage. Ignites unattended flammable objects.'},
  'Guidance':{school:'Divination', desc:'Touched creature adds 1d4 to one ability check of its choice before the spell ends. Concentration, 1 minute.'},
  'Light':{school:'Evocation', desc:'Touched object sheds bright light in a 20-ft radius (dim for another 20 ft) for 1 hour.'},
  'Mage Hand':{school:'Conjuration', desc:'A spectral floating hand manipulates objects, opens doors, or carries up to 10 pounds within 30 ft for 1 minute.'},
  'Minor Illusion':{school:'Illusion', desc:'Create a sound or an image of an object no larger than a 5-ft cube for 1 minute. Investigation check reveals it.'},
  'Prestidigitation':{school:'Transmutation', desc:'Minor magical trick: spark, clean or soil, chill, warm or flavor, light or snuff, or a small mark or trinket.'},
  'Produce Flame':{school:'Conjuration', desc:'A flame in your palm sheds light for 10 minutes; hurl it as a ranged spell attack for 1d8 fire damage.'},
  'Ray of Frost':{school:'Evocation', desc:'A frigid beam; ranged spell attack for 1d8 cold damage and −10 ft speed until your next turn.'},
  'Sacred Flame':{school:'Evocation', desc:'Flame-like radiance descends on a creature; DEX save or 1d8 radiant damage, gaining no benefit from cover.'},
  'Shillelagh':{school:'Transmutation', desc:'Your club or quarterstaff becomes magical: use your spellcasting ability for its attacks and deal 1d8 damage.'},
  'Spare the Dying':{school:'Necromancy', desc:'Touch a living creature at 0 hit points; it becomes stable.'},
  'Thaumaturgy':{school:'Transmutation', desc:'Minor divine wonder: booming voice, flickering flames, harmless tremors, or slamming doors and windows.'},
  'Vicious Mockery':{school:'Enchantment', desc:'Enchantment-laced insults; WIS save or 1d4 psychic damage and disadvantage on its next attack roll.'},
  // Level 1
  'Armor of Agathys':{school:'Abjuration', desc:'Gain 5 temporary hit points; while they last, melee attackers take 5 cold damage.'},
  'Bless':{school:'Enchantment', desc:'Up to three creatures add 1d4 to attack rolls and saving throws. Concentration, 1 minute.'},
  'Burning Hands':{school:'Evocation', desc:'A 15-ft cone of flame; DEX save, 3d6 fire damage, half on a success.'},
  'Charm Person':{school:'Enchantment', desc:'A humanoid makes a WIS save or is charmed by you for 1 hour; it knows afterward.'},
  'Chromatic Orb':{school:'Evocation', desc:'Hurl an energy sphere; ranged spell attack for 3d8 acid, cold, fire, lightning, poison, or thunder damage.'},
  'Command':{school:'Enchantment', desc:'Speak a one-word command; WIS save or the creature obeys on its next turn (approach, drop, flee, grovel, halt).'},
  'Cure Wounds':{school:'Evocation', desc:'A touched creature regains 1d8 + your spellcasting modifier hit points.'},
  'Detect Evil and Good':{school:'Divination', desc:'Sense aberrations, celestials, elementals, fey, fiends, and undead within 30 ft. Concentration, 10 minutes.'},
  'Detect Magic':{school:'Divination', desc:'Sense magic within 30 ft; see faint auras and learn schools of magic. Ritual. Concentration, 10 minutes.'},
  'Dissonant Whispers':{school:'Enchantment', desc:'A discordant melody; WIS save or 3d6 psychic damage and must use its reaction to move away from you.'},
  'Divine Favor':{school:'Evocation', desc:'Bonus action; your weapon attacks deal an extra 1d4 radiant damage. Concentration, 1 minute.'},
  'Ensnaring Strike':{school:'Conjuration', desc:'Your next weapon hit sprouts vines; STR save or restrained, taking 1d6 piercing at the start of each turn.'},
  'Entangle':{school:'Conjuration', desc:'A 20-ft square of grasping weeds becomes difficult terrain; STR save or restrained. Concentration, 1 minute.'},
  'Faerie Fire':{school:'Evocation', desc:'Creatures in a 20-ft cube make a DEX save or glow: attacks against them have advantage and they can\'t be invisible.'},
  'Find Familiar':{school:'Conjuration', desc:'Summon a spirit familiar in beast form; share its senses and deliver touch spells through it. Ritual.'},
  'Goodberry':{school:'Transmutation', desc:'Ten berries appear; eating one restores 1 hit point and nourishes a creature for a day.'},
  'Guiding Bolt':{school:'Evocation', desc:'A flash of light; ranged spell attack for 4d6 radiant damage, and the next attack against the target has advantage.'},
  'Healing Word':{school:'Evocation', desc:'Bonus action; a creature within 60 ft regains 1d4 + your spellcasting modifier hit points.'},
  'Hex':{school:'Enchantment', desc:'Bonus action curse; your attacks deal an extra 1d6 necrotic to the target and it has disadvantage on one ability\'s checks.'},
  "Hunter's Mark":{school:'Divination', desc:'Bonus action; mark a quarry — your weapon attacks against it deal +1d6, with advantage to track it. Concentration.'},
  'Identify':{school:'Divination', desc:'Learn a magic item\'s properties, how to use them, and whether it requires attunement. Ritual.'},
  'Mage Armor':{school:'Abjuration', desc:'An unarmored touched creature\'s base AC becomes 13 + its DEX modifier for 8 hours.'},
  'Magic Missile':{school:'Evocation', desc:'Three darts of force, each dealing 1d4+1 damage; they hit automatically.'},
  'Shield':{school:'Abjuration', desc:'Reaction; +5 AC until your next turn, including against the triggering attack, and immunity to Magic Missile.'},
  'Shield of Faith':{school:'Abjuration', desc:'Bonus action; a shimmering field grants +2 AC to one creature. Concentration, 10 minutes.'},
  'Sleep':{school:'Enchantment', desc:'5d8 hit points of creatures fall unconscious, lowest current hit points first; undead are unaffected.'},
  'Thunderwave':{school:'Evocation', desc:'A 15-ft cube of thunderous force; CON save, 2d8 thunder damage and pushed 10 ft, half and no push on a success.'},
  'Witch Bolt':{school:'Evocation', desc:'An arc of lightning; ranged spell attack for 1d12, then 1d12 lightning each turn you sustain it. Concentration.'},
  // Level 2
  'Aid':{school:'Abjuration', desc:'Up to three creatures gain +5 hit point maximum and current hit points for 8 hours.'},
  'Animal Messenger':{school:'Enchantment', desc:'A Tiny beast carries a short spoken message to a place you describe. Ritual.'},
  'Barkskin':{school:'Transmutation', desc:'A touched creature\'s AC can\'t be lower than 16. Concentration, 1 hour.'},
  'Find Steed':{school:'Conjuration', desc:'Summon a spirit steed (warhorse, pony, camel, elk, or mastiff) that serves as a loyal, intelligent mount.'},
  'Flame Blade':{school:'Evocation', desc:'A fiery scimitar in your hand; melee spell attack for 3d6 fire damage, sheds light. Concentration, 10 minutes.'},
  'Heat Metal':{school:'Transmutation', desc:'A metal object glows red-hot: 2d8 fire damage to whoever holds or wears it; drop it or have disadvantage. Concentration.'},
  'Hold Person':{school:'Enchantment', desc:'A humanoid makes a WIS save or is paralyzed; it repeats the save each turn. Concentration, 1 minute.'},
  'Invisibility':{school:'Illusion', desc:'A touched creature is invisible up to 1 hour; ends if it attacks or casts a spell. Concentration.'},
  'Lesser Restoration':{school:'Abjuration', desc:'Touch ends one disease or one condition: blinded, deafened, paralyzed, or poisoned.'},
  'Mirror Image':{school:'Illusion', desc:'Three illusory duplicates of yourself misdirect attacks; each hit may strike an image instead.'},
  'Misty Step':{school:'Conjuration', desc:'Bonus action; teleport up to 30 ft to an unoccupied space you can see.'},
  'Moonbeam':{school:'Evocation', desc:'A 5-ft-radius beam of pale light; CON save or 2d10 radiant damage when a creature enters or starts its turn there. Concentration.'},
  'Pass without Trace':{school:'Abjuration', desc:'A veil of shadows: +10 to the group\'s Stealth checks and you can\'t be tracked except by magic. Concentration.'},
  'Prayer of Healing':{school:'Evocation', desc:'Up to six creatures regain 2d8 + your spellcasting modifier hit points. Casting time 10 minutes.'},
  'Scorching Ray':{school:'Evocation', desc:'Three rays of fire; make a ranged spell attack for each, dealing 2d6 fire damage per hit.'},
  'Shatter':{school:'Evocation', desc:'A sudden ringing noise in a 10-ft sphere; CON save, 3d8 thunder damage, half on a success.'},
  'Silence':{school:'Illusion', desc:'No sound within a 20-ft sphere: creatures are deafened, thunder damage is blocked, verbal spells fail. Ritual. Concentration.'},
  'Spike Growth':{school:'Transmutation', desc:'A 20-ft radius sprouts hidden spikes: difficult terrain dealing 2d4 piercing per 5 ft moved. Concentration.'},
  'Spiritual Weapon':{school:'Evocation', desc:'Bonus action; a floating spectral weapon makes melee spell attacks for 1d8 + your spellcasting modifier force damage.'},
  'Suggestion':{school:'Enchantment', desc:'WIS save or the creature pursues a reasonable course of activity you suggest. Concentration, 8 hours.'},
  'Web':{school:'Conjuration', desc:'A 20-ft cube of thick, flammable webs; DEX save or restrained. Concentration, 1 hour.'},
  'Zone of Truth':{school:'Enchantment', desc:'In a 15-ft sphere, creatures that fail a CHA save can\'t speak a deliberate lie.'},
  // Level 3
  'Aura of Vitality':{school:'Evocation', desc:'A healing aura surrounds you; each turn, a bonus action heals a creature in it for 2d6. Concentration, 1 minute.'},
  'Beacon of Hope':{school:'Abjuration', desc:'Chosen creatures gain advantage on WIS and death saves and regain maximum hit points from healing. Concentration.'},
  'Blinding Smite':{school:'Evocation', desc:'Your next melee hit deals +3d8 radiant damage; CON save or the target is blinded. Concentration.'},
  'Call Lightning':{school:'Conjuration', desc:'A storm cloud forms; each turn call a bolt — DEX save, 3d10 lightning damage, half on a success. Concentration.'},
  'Conjure Animals':{school:'Conjuration', desc:'Summon fey spirits in beast form (e.g. eight CR 1/4 wolves) that obey your commands. Concentration, 1 hour.'},
  'Counterspell':{school:'Abjuration', desc:'Reaction; interrupt a spell of 3rd level or lower automatically, or make an ability check for higher levels.'},
  'Dispel Magic':{school:'Abjuration', desc:'End spells of 3rd level or lower on a target; make an ability check to end higher-level ones.'},
  'Fear':{school:'Illusion', desc:'A 30-ft cone of terror; WIS save or drop what you\'re holding and flee. Concentration, 1 minute.'},
  'Fireball':{school:'Evocation', desc:'A 20-ft-radius explosion of flame; DEX save, 8d6 fire damage, half on a success. Ignites objects.'},
  'Fly':{school:'Transmutation', desc:'A touched creature gains a 60-ft flying speed. Concentration, 10 minutes.'},
  'Haste':{school:'Transmutation', desc:'Double speed, +2 AC, advantage on DEX saves, and one extra limited action; lethargy when it ends. Concentration.'},
  'Hunger of Hadar':{school:'Conjuration', desc:'A 20-ft sphere of lightless cold: 2d6 cold on entering, DEX save or 2d6 acid on leaving your turn there. Concentration.'},
  'Hypnotic Pattern':{school:'Illusion', desc:'A twisting pattern in a 30-ft cube; WIS save or charmed and incapacitated. Concentration, 1 minute.'},
  'Lightning Arrow':{school:'Transmutation', desc:'Your next ranged weapon attack becomes a bolt of lightning: 4d8 to the target, burst around it. Concentration.'},
  'Lightning Bolt':{school:'Evocation', desc:'A 100-ft line of lightning; DEX save, 8d6 lightning damage, half on a success.'},
  'Mass Healing Word':{school:'Evocation', desc:'Bonus action; up to six creatures regain 1d4 + your spellcasting modifier hit points.'},
  'Plant Growth':{school:'Transmutation', desc:'Overgrow an area (movement costs quadruple) instantly, or enrich the land\'s crops for a year.'},
  'Revivify':{school:'Necromancy', desc:'Touch a creature dead less than 1 minute; it returns to life with 1 hit point. Consumes 300 gp of diamonds.'},
  'Sleet Storm':{school:'Conjuration', desc:'Freezing rain in a 40-ft radius: heavily obscured, difficult terrain, DEX save or fall prone. Concentration.'},
  'Speak with Dead':{school:'Necromancy', desc:'A corpse answers up to five questions, with knowledge from its life only.'},
  'Spirit Guardians':{school:'Conjuration', desc:'Protective spirits in a 15-ft radius: enemies are slowed, WIS save, 3d8 radiant (or necrotic) damage. Concentration.'},
  // Level 4
  'Aura of Life':{school:'Abjuration', desc:'A 30-ft aura: resistance to necrotic damage, hit point maximums can\'t drop, and 0-HP allies regain 1 HP each turn. Concentration.'},
  'Banishment':{school:'Abjuration', desc:'CHA save or banished to another plane; permanent if the target is native to a different plane. Concentration, 1 minute.'},
  'Blight':{school:'Necromancy', desc:'Necromantic energy withers a creature; CON save, 8d8 necrotic damage, half on a success. Kills plants.'},
  'Confusion':{school:'Enchantment', desc:'Creatures in a 10-ft sphere make WIS saves or act randomly — wandering, babbling, or attacking. Concentration.'},
  'Death Ward':{school:'Abjuration', desc:'The first time the target would drop to 0 hit points, it drops to 1 instead. Lasts 8 hours.'},
  'Dimension Door':{school:'Conjuration', desc:'Teleport up to 500 ft to a spot you can see, visualize, or describe, with one willing creature.'},
  'Freedom of Movement':{school:'Abjuration', desc:'Immune to difficult terrain, paralysis, and restraint; escape grapples by spending 5 ft of movement.'},
  'Grasping Vine':{school:'Conjuration', desc:'Bonus action; a vine lashes out — DEX save or be pulled 20 ft toward it each turn. Concentration.'},
  'Greater Invisibility':{school:'Illusion', desc:'A touched creature is invisible even while attacking or casting spells. Concentration, 1 minute.'},
  'Guardian of Faith':{school:'Conjuration', desc:'A large spectral guardian; enemies that come within 10 ft make a DEX save or take 20 radiant damage (half on success).'},
  'Ice Storm':{school:'Evocation', desc:'Hail in a 20-ft radius; DEX save, 2d8 bludgeoning + 4d6 cold damage, and the area becomes difficult terrain.'},
  'Polymorph':{school:'Transmutation', desc:'WIS save or transformed into a beast of your choice with CR at or below the target\'s level or CR. Concentration.'},
  'Staggering Smite':{school:'Evocation', desc:'Your next melee hit deals +4d6 psychic damage; WIS save or disadvantage on attacks and checks, no reactions. Concentration.'},
  // Level 5
  'Circle of Power':{school:'Abjuration', desc:'A 30-ft aura: allies have advantage on saves against spells, and half damage on a success becomes none. Concentration.'},
  'Cone of Cold':{school:'Evocation', desc:'A 60-ft cone of frigid air; CON save, 8d8 cold damage, half on a success.'},
  'Contact Other Plane':{school:'Divination', desc:'Question an extraplanar intelligence: five one-word answers, but risk psychic damage and insanity. Ritual.'},
  'Destructive Wave':{school:'Evocation', desc:'A 30-ft burst of divine energy; CON save, 5d6 thunder + 5d6 radiant or necrotic damage and knocked prone.'},
  'Flame Strike':{school:'Evocation', desc:'A 10-ft-radius column of divine fire; DEX save, 4d6 fire + 4d6 radiant damage, half on a success.'},
  'Hold Monster':{school:'Enchantment', desc:'Any creature makes a WIS save or is paralyzed; it repeats the save each turn. Concentration, 1 minute.'},
  'Insect Plague':{school:'Conjuration', desc:'A 20-ft sphere of biting locusts: difficult terrain, CON save, 4d10 piercing damage. Concentration, 10 minutes.'},
  'Legend Lore':{school:'Divination', desc:'Learn significant lore about a legendary person, place, or object.'},
  'Mass Cure Wounds':{school:'Evocation', desc:'Up to six creatures in a 30-ft sphere regain 3d8 + your spellcasting modifier hit points.'},
  'Raise Dead':{school:'Necromancy', desc:'Return a creature dead up to 10 days to life with 1 hit point. Consumes a 500 gp diamond.'},
  'Reincarnate':{school:'Transmutation', desc:'A dead humanoid returns to life in a new, randomly determined body.'},
  'Swift Quiver':{school:'Transmutation', desc:'Your quiver produces endless ammunition; each turn, a bonus action makes two weapon attacks. Concentration.'},
  'Telekinesis':{school:'Transmutation', desc:'Move a creature (contested check) or an object up to 1,000 pounds with your mind each turn. Concentration.'},
  'Tree Stride':{school:'Conjuration', desc:'Step into a tree and emerge from another of the same kind within 500 ft, once per turn. Concentration.'},
  'Wall of Force':{school:'Evocation', desc:'An invisible, indestructible wall of force that nothing can pass through. Concentration, 10 minutes.'}
};

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

// Nine alignments plus "unaligned". Descriptions follow the SRD 5.1 (Open Game
// Content); examples are the commonly listed creature types. Used by both the
// Settings dropdown and the Notes reference tab.
const ALIGNMENTS = [
  {abbr:'LG', name:'Lawful Good',    desc:'Can be counted on to do the right thing as expected by society.',            eg:'Gold dragons, paladins, most dwarves'},
  {abbr:'NG', name:'Neutral Good',   desc:'Do the best they can to help others according to their needs.',              eg:'Many celestials, some cloud giants, gnomes'},
  {abbr:'CG', name:'Chaotic Good',   desc:'Act as their conscience directs, with little regard for what others expect.', eg:'Copper dragons, many elves, unicorns'},
  {abbr:'LN', name:'Lawful Neutral', desc:'Act in accordance with law, tradition, or a personal code.',                 eg:'Many monks and some wizards, modrons'},
  {abbr:'N',  name:'Neutral',        desc:'Prefer to steer clear of moral questions, doing what seems best at the time.', eg:'Lizardfolk, most druids, many humans'},
  {abbr:'CN', name:'Chaotic Neutral',desc:'Follow their whims, holding their personal freedom above all else.',         eg:'Many barbarians and rogues, some bards'},
  {abbr:'LE', name:'Lawful Evil',    desc:'Methodically take what they want, within the limits of a code of tradition.', eg:'Devils, blue dragons, hobgoblins'},
  {abbr:'NE', name:'Neutral Evil',   desc:'Do whatever they can get away with, without compassion or qualms.',          eg:'Many drow, some cloud giants, goblins'},
  {abbr:'CE', name:'Chaotic Evil',   desc:'Act with arbitrary violence, spurred by greed, hatred, or bloodlust.',       eg:'Demons, red dragons, orcs'},
  {abbr:'—',  name:'Unaligned',      desc:'Lacks the capacity for moral judgment and simply acts by its nature.',       eg:'Most beasts and mindless creatures'},
];

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

// ---------- Playable species (races / lineages) ----------
// Same source-tagging model as classes (CLASS_SOURCES is reused for the species
// source filter); imported species merge in at startup.
const SPECIES_DATA = {
  Human:{ source:'5E', size:'Medium', speed:30, darkvision:0, asi:'+1 to all abilities', languages:'Common + one', desc:'Ambitious and adaptable, humans are the most widespread of the common peoples.',
    traits:[{name:'Versatile', desc:'A +1 bonus to every ability score (or extra skill/feat in variant rules).'}] },
  Elf:{ source:'5E', size:'Medium', speed:30, darkvision:60, asi:'+2 DEX', languages:'Common, Elvish', skills:['Perception'], desc:'Graceful, long-lived folk with a keen mind and an affinity for magic.', subraces:['High Elf','Wood Elf','Drow (Dark Elf)'],
    traits:[{name:'Darkvision', desc:'See in dim light within 60 ft as if bright, and darkness as dim.'},{name:'Keen Senses', desc:'Proficiency in the Perception skill.'},{name:'Fey Ancestry', desc:'Advantage on saves against being charmed; magic can\'t put you to sleep.'},{name:'Trance', desc:'Meditate 4 hours instead of sleeping 8 for a long rest.'}] },
  Dwarf:{ source:'5E', size:'Medium', speed:25, darkvision:60, asi:'+2 CON', languages:'Common, Dwarvish', desc:'Stout and hardy, dwarves are skilled warriors, miners, and workers of stone and metal.', subraces:['Hill Dwarf','Mountain Dwarf'],
    traits:[{name:'Darkvision', desc:'See in dim light within 60 ft.'},{name:'Dwarven Resilience', desc:'Advantage on saves vs poison and resistance to poison damage.'},{name:'Stonecunning', desc:'Add double proficiency on History checks about stonework.'}] },
  Halfling:{ source:'5E', size:'Small', speed:25, darkvision:0, asi:'+2 DEX', languages:'Common, Halfling', desc:'Cheerful and practical, halflings value the comforts of home.', subraces:['Lightfoot','Stout'],
    traits:[{name:'Lucky', desc:'Reroll a 1 on an attack, check, or save; use the new roll.'},{name:'Brave', desc:'Advantage on saves against being frightened.'},{name:'Halfling Nimbleness', desc:'Move through the space of any creature a size larger.'}] },
  Dragonborn:{ source:'5E', size:'Medium', speed:30, darkvision:0, asi:'+2 STR, +1 CHA', languages:'Common, Draconic', desc:'Proud dragon-blooded warriors who breathe elemental power.',
    traits:[{name:'Draconic Ancestry', desc:'Choose a dragon type; sets your breath weapon and resistance.'},{name:'Breath Weapon', desc:'Exhale destructive energy in a line or cone (DEX/CON save for half).'},{name:'Damage Resistance', desc:'Resistance to the damage type of your ancestry.'}] },
  Gnome:{ source:'5E', size:'Small', speed:25, darkvision:60, asi:'+2 INT', languages:'Common, Gnomish', desc:'Curious and inventive tinkerers with boundless enthusiasm.', subraces:['Forest Gnome','Rock Gnome'],
    traits:[{name:'Darkvision', desc:'See in dim light within 60 ft.'},{name:'Gnome Cunning', desc:'Advantage on INT, WIS, and CHA saves against magic.'}] },
  'Half-Orc':{ source:'5E', size:'Medium', speed:30, darkvision:60, asi:'+2 STR, +1 CON', languages:'Common, Orc', desc:'Fierce and enduring, half-orcs are shaped by strength and survival.',
    traits:[{name:'Darkvision', desc:'See in dim light within 60 ft.'},{name:'Relentless Endurance', desc:'Once per long rest, drop to 1 HP instead of 0.'},{name:'Savage Attacks', desc:'Roll one extra weapon damage die on a melee critical hit.'}] },
  Tiefling:{ source:'5E', size:'Medium', speed:30, darkvision:60, asi:'+2 CHA, +1 INT', languages:'Common, Infernal', desc:'Bearers of an infernal bloodline, marked by horns and a fiendish legacy.',
    traits:[{name:'Darkvision', desc:'See in dim light within 60 ft.'},{name:'Hellish Resistance', desc:'Resistance to fire damage.'},{name:'Infernal Legacy', desc:'Know Thaumaturgy; gain Hellish Rebuke and Darkness at higher levels.'}] },
  // Steinhardt's Guide to the Eldritch Hunt (World Anvil) — Luyarnha's tieflings,
  // severed from their infernal origins and bound to the Black Goat instead.
  'Accursed Tiefling':{ source:'Homebrew', size:'Medium', speed:30, darkvision:60, asi:'+2 CHA, +1 CON', languages:'Common, Deep Speech', desc:'Called "accursed" for their monstrous shape — dozens of horns crowd their skulls and eye-like protrusions stud them. Severed from their devilish origins, their blood is tied to the Black Goat, and they vanish from the city soon after reaching adulthood.',
    traits:[
      {name:'Darkvision', desc:'Eldritch heritage: see in dim light within 60 ft as if bright, and in darkness as if dim (shades of gray only).'},
      {name:'Child of the Black Goat', desc:'You have a climbing speed equal to your walking speed.'},
      {name:'Eldritch Resistance', desc:'You have resistance to necrotic damage.'},
      {name:'Legacy of a Thousand Young', desc:'You know Spare the Dying. At 3rd level, cast False Life (as 2nd level) once per long rest; at 5th level, cast Mirror Image once per long rest. CON is your spellcasting ability for these.'},
      {name:'Call of the Brood', desc:'If a Blood Moon is out while you sleep, the Black Goat sends a dream (as the spell, DC 16) compelling a task; on waking you are affected by Suggestion (DC 16, cast at 7th level) and must carry out the order.'}
    ] },
  // Mordenkainen Presents: Monsters of the Multiverse lineage.
  Tortle:{ source:'5E', size:'Medium or Small', speed:30, darkvision:0, asi:'+2 / +1 to two abilities (floating)', languages:'Common + one other', desc:'"We wear our homes on our backs." Turtle folk who travel coasts and waterways, carrying their shelter wherever they go.',
    traits:[
      {name:'Claws', desc:'Your unarmed strikes deal 1d6 + STR modifier slashing damage.'},
      {name:'Hold Breath', desc:'You can hold your breath for up to 1 hour.'},
      {name:'Natural Armor', desc:'Your shell gives you base AC 17 (DEX modifier doesn\'t apply). A shield\'s bonus applies as normal, but you gain no benefit from wearing armor.'},
      {name:"Nature's Intuition", desc:'Proficiency in one of: Animal Handling, Medicine, Nature, Perception, Stealth, or Survival.'},
      {name:'Shell Defense', desc:'Withdraw into your shell as an action: +4 AC and advantage on STR and CON saves, but you are prone, speed 0, disadvantage on DEX saves, and can\'t take reactions. Emerge as a bonus action.'}
    ] },
  // ---- Steinhardt's Guide to the Eldritch Hunt (World Anvil) species ----
  // Luyarnha's playable races. The setting's elf and human entries were
  // lore-only reskins of the 5E stat blocks, so they're dropped in favour of
  // the built-ins above. The "(Eldritch Hunt)" suffix remains on entries with
  // no 5E equivalent here (there is no plain Half-Elf or Orc to collide with).
  'Cursed-Blood':{ source:'Homebrew', size:'Small', speed:25, darkvision:0, asi:'+1 DEX, +1 any (+1 more from subrace)', languages:'Common + Draconic or Infernal', desc:'Born as conjoined twins of whom one must perish, the cursed-blood wear quiescent marble masks from birth and carry the remnant of their lost sibling in their chest. Shunned by Luyarnha, they guard their kin fiercely in the slums.', subraces:['Doused','Hulking','Mirage'],
    traits:[
      {name:'Cursed Climber', desc:'25 ft walking speed and a 25 ft climbing speed (unusable in medium or heavy armor).'},
      {name:'Vigilant Nature', desc:'You can\'t be surprised. On a turn when you would have been surprised, you can\'t attack or cast spells that affect enemies.'},
      {name:'Conjoined Twin — Chest Maw', desc:'(Choose one manifestation.) A mouth on your abdomen stores up to 250 lb / 32 cu ft in a pocket dimension; unconsciousness or death regurgitates it. Creatures inside can breathe for 1 minute. At 5th level, capacity doubles and storage is indefinite.'},
      {name:'Conjoined Twin — Heedful Eye', desc:'While the chest eye is open (bonus action to open): darkvision 120 ft and one casting of Detect Magic per short/long rest. At 5th level, also See Invisibility 1/long rest.'},
      {name:'Conjoined Twin — Gaping Remain', desc:'Speak telepathically (your twin\'s voice) to a creature you can see within 5 ft × your level; at 5th level it can respond. You also know Mage Hand (no somatic/verbal components, the hand looks like your twin\'s; CHA is the ability).'}
    ] },
  Demidritch:{ source:'Homebrew', size:'Medium', speed:30, darkvision:120, asi:'+2 CHA (+1 CON Oculare / +1 STR Nebulare)', languages:'Common, Deep Speech', desc:'Born of a union between humanoids and eldritch beings, "half-angels" bear galaxy-swirl eyes in jet-black sclera. Equal parts revered and abhorred in Luyarnha, their alignment is a product of upbringing, not origin.', subraces:['Oculare','Nebulare'],
    traits:[
      {name:'Darkvision (120 ft)', desc:'Your many eyes were made for the darkness of space: dim light within 120 ft counts as bright, darkness as dim (grayscale).'},
      {name:'Shard of Infinity', desc:'You have resistance to cold damage.'},
      {name:'Astral Being', desc:'Advantage on saving throws against being blinded.'}
    ] },
  'Deep One Dwarf':{ source:'Homebrew', size:'Medium', speed:25, darkvision:0, asi:'+2 CON, +1 CHA', languages:'Common, Deep Speech, Dwarvish', desc:'Y\'ha-nthlei — Luyarnha\'s dwarves, cursed for their avarice into eternal service of He Who Lies Dreaming. Tentacled and warped beneath an illusion of ordinary dwarvenhood, they cannot die of old age; their minds slip to Him at ~50 years.',
    traits:[
      {name:'Aberration', desc:'Your creature type is aberration, rather than humanoid.'},
      {name:'Swimmer', desc:'25 ft walking speed and a 25 ft swimming speed.'},
      {name:'Otherworldly Resilience', desc:'Advantage on saves against poison; resistance to cold damage.'},
      {name:'Illusory Body', desc:'An illusion makes you appear a normal hill dwarf; action to toggle it. Other Deep Ones see through it.'},
      {name:'Sailor Training', desc:'Proficiency with cleavers, tridents, and firearms.'},
      {name:'Amphibious', desc:'You can breathe air and water.'},
      {name:'Cosmic Knowledge', desc:'On History checks about the origin of eldritch items or constructions, you count as proficient and add double your proficiency bonus.'},
      {name:'Guiding Light', desc:'You know the Dancing Lights cantrip (CHA).'},
      {name:'The Dreamer\'s Curse', desc:'Disadvantage on saving throws against illusions.'},
      {name:'Fathomless Limb — Coiling Arm', desc:'(Choose one alteration.) After hitting with a melee attack, attempt a grapple as a bonus action.'},
      {name:'Fathomless Limb — Brutal Pincers', desc:'Pincer unarmed strikes deal 1d6 + STR piercing (d10 vs a creature you\'re grappling); no fine manipulation with that arm.'},
      {name:'Fathomless Limb — Mucoid Extremities', desc:'Swimming speed becomes 30 ft and you gain a 20 ft climbing speed.'},
      {name:'The Dreamer\'s Gifts (optional, GM)', desc:'From 5th level: when you fail an ability check or save, succeed instead — unusable again until the Dreamer replaces one of your d20 rolls with a 1 (GM decides). You are immune to the curse of the Slumbering Moon.'}
    ] },
  Manikin:{ source:'Homebrew', size:'Medium or Small', speed:30, darkvision:0, asi:'+2 CON (+1 STR/DEX/CHA by subrace)', languages:'Common', desc:'Marionettes "born" of gold, lightning, and meticulous welding by the Scions. Golden stitching joins the plates of their artificial skin; their obedience is inscribed on human eyes inside their skulls.', subraces:['Custodian','Handler','Thespian'],
    traits:[
      {name:'Construct Nature', desc:'You are a Humanoid, but count as a Construct for any prerequisite or effect.'},
      {name:'Born to Serve', desc:'Made unable to hate or resent: disadvantage on Insight checks.'},
      {name:'Lightning Heart', desc:'Resistance to lightning damage.'},
      {name:'Living Material', desc:'No need to eat, drink, or breathe; immune to the poisoned condition; advantage on saves against madness.'},
      {name:'Modular Gold Plating', desc:'Built-in armor (no benefit from worn armor; shields fine). Unarmored: AC 11 + DEX. Medium (needs prof): 13 + DEX (max 2) or STR (max 3). Heavy (needs prof): 16 + STR (max 2). STR-based AC gives disadvantage on Stealth. 8 hours in a workshop to switch.'}
    ] },
  Scourgeborne:{ source:'Homebrew', size:'Medium', speed:30, darkvision:0, asi:'+1 CON (+ subrace)', languages:'Common + one', desc:'Made, not born — a curse on those who peered beyond the veil, laying their innermost darkness bare as a monstrous form. Those who accept the inner monster without letting it rule often become Luyarnha\'s messianic heroes.', subraces:['Aranea','Belua','Cervus','Vespertilio'],
    traits:[
      {name:'Feral Limbs', desc:'Horns, claws, or fangs: unarmed strikes deal 1d6 + STR piercing (d8 if your alignment is Evil).'},
      {name:'Eldritch Curse', desc:'Immune to any spell that would alter your form (Alter Self, Polymorph, etc.).'},
      {name:'Born of Madness', desc:'Good alignment: advantage on saves against madness. Evil: disadvantage on madness saves but +PB to DEX saving throws.'}
    ] },
  'Half-Elf (Eldritch Hunt)':{ source:'Homebrew', size:'Medium', speed:30, darkvision:60, asi:'+2 CHA, +1 to two others', languages:'Common, Elvish + one', desc:'Luyarnha\'s "noble-bloods" — cherished aristocrats of the city, the Silverblood family and the hunter Steinhardt among them, though consanguinity bred madness into the line. Uses the standard 5E half-elf mechanics.',
    traits:[
      {name:'Standard Half-Elf Traits', desc:'Darkvision 60 ft, Fey Ancestry, and Skill Versatility (two skill proficiencies), as the 5E half-elf.'},
      {name:'Weak to Madness (optional rule)', desc:'The tight balance of human and elven blood is easily disrupted: disadvantage on saving throws against madness.'}
    ] },
  'Orc (Eldritch Hunt)':{ source:'Homebrew', size:'Medium', speed:30, darkvision:60, asi:'+2 STR, +1 CON', languages:'Common, Orc', desc:'Grey-skinned merchant-folk of Luyarnha, tempering an ancient curse of avarice with a culture of self-reliance in youth and magnanimity in age. Lore article; pair with a standard 5E orc/half-orc stat block.',
    traits:[
      {name:'Standard Orc Traits', desc:'The Steinhardt entry is lore-only — use standard orc traits (e.g. Darkvision 60 ft, Relentless Endurance, Powerful Build / Savage Attacks).'}
    ] },
};
Object.values(SPECIES_DATA).forEach(sd=>{ if(!sd.source) sd.source='5E'; sd.builtin=true; });

// ---------- Backgrounds ----------
// Character backgrounds (PHB-style, per the dnd5e wikidot reference pages).
// `skills` are fixed proficiencies the background GRANTS (auto-applied to the
// sheet while selected — see grantedSkillSources). `languages`/`tools`/
// `equipment` are informational text; `feature` shows on Features & Traits.
const BACKGROUND_DATA = {
  Acolyte:{ source:'5E', skills:['Insight','Religion'], languages:'Two of your choice', equipment:'Holy symbol, prayer book or prayer wheel, 5 sticks of incense, vestments, common clothes, pouch with 15 gp',
    desc:'You have spent your life in service to a temple, learning its rites and acting as an intermediary between the divine and the mortal world.',
    feature:{name:'Shelter of the Faithful', desc:'You command the respect of those who share your faith and can perform your deity\'s ceremonies. You and your companions can receive free healing and care at a temple of your faith (you must provide any material components), and followers of your religion will support you at a modest lifestyle. You also have ties to a specific temple whose priests will assist you, so long as the request is not hazardous and you remain in good standing.'} },
  Charlatan:{ source:'5E', skills:['Deception','Sleight of Hand'], tools:'Disguise kit, forgery kit', equipment:'Fine clothes, disguise kit, con tools of your choice, pouch with 15 gp',
    desc:'You have always had a way with people, and know exactly what makes them tick — usually to relieve them of their valuables.',
    feature:{name:'False Identity', desc:'You have a second identity — documentation, established acquaintances, and disguises included. You can also forge documents (official papers and personal letters) as long as you have seen an example.'} },
  Criminal:{ source:'5E', skills:['Deception','Stealth'], tools:"One type of gaming set, thieves' tools", equipment:'Crowbar, dark common clothes with a hood, pouch with 15 gp',
    desc:'You are an experienced criminal with a history of breaking the law and contacts deep in the underworld.',
    feature:{name:'Criminal Contact', desc:'You have a reliable and trustworthy contact who acts as your liaison to a network of other criminals. You know how to get messages to and from your contact, even over great distances.'} },
  Entertainer:{ source:'5E', skills:['Acrobatics','Performance'], tools:'Disguise kit, one musical instrument', equipment:'Musical instrument, an admirer\'s favor, costume, pouch with 15 gp',
    desc:'You thrive in front of an audience, making the world your stage — poet, singer, dancer, or acrobat.',
    feature:{name:'By Popular Demand', desc:'You can always find a place to perform. There you receive free lodging and food of a modest or comfortable standard as long as you perform each night, and your performance makes you something of a local figure.'} },
  'Folk Hero':{ source:'5E', skills:['Animal Handling','Survival'], tools:"One type of artisan's tools, vehicles (land)", equipment:"Artisan's tools, shovel, iron pot, common clothes, pouch with 10 gp",
    desc:'You come from humble ranks, but you are destined for much more — the people of your home village regard you as their champion.',
    feature:{name:'Rustic Hospitality', desc:'Since you come from the ranks of the common folk, you fit in among them with ease. You can find a place to hide, rest, or recuperate among commoners, who will shield you from the law or anyone searching for you (though not at the risk of their lives).'} },
  'Guild Artisan':{ source:'5E', skills:['Insight','Persuasion'], tools:"One type of artisan's tools", languages:'One of your choice', equipment:"Artisan's tools, letter of introduction from your guild, traveler's clothes, pouch with 15 gp",
    desc:'You are a member of an artisan\'s guild, skilled in a particular field and closely associated with other artisans.',
    feature:{name:'Guild Membership', desc:'Your guild offers lodging and food when necessary and will pay for your funeral if needed. Fellow members will provide access to powerful political figures — for a price. You must pay dues of 5 gp per month to stay in good standing.'} },
  Hermit:{ source:'5E', skills:['Medicine','Religion'], tools:'Herbalism kit', languages:'One of your choice', equipment:'Scroll case of notes, winter blanket, common clothes, herbalism kit, 5 gp',
    desc:'You lived in seclusion — in a sheltered community or entirely alone — seeking quiet, solitude, and answers.',
    feature:{name:'Discovery', desc:'Your seclusion gave you access to a unique and powerful discovery — a great truth about the cosmos, a hidden site, or a long-forgotten fact. Work out its exact nature with your DM.'} },
  Noble:{ source:'5E', skills:['History','Persuasion'], tools:'One type of gaming set', languages:'One of your choice', equipment:'Fine clothes, signet ring, scroll of pedigree, purse with 25 gp',
    desc:'You understand wealth, power, and privilege — your family owns land, collects taxes, and wields real political influence.',
    feature:{name:'Position of Privilege', desc:'Thanks to your noble birth, people are inclined to think the best of you. You are welcome in high society, and people assume you have the right to be wherever you are. Common folk accommodate you, and you can secure an audience with a local noble if needed.'} },
  Outlander:{ source:'5E', skills:['Athletics','Survival'], tools:'One musical instrument', languages:'One of your choice', equipment:"Staff, hunting trap, animal trophy, traveler's clothes, pouch with 10 gp",
    desc:'You grew up in the wilds, far from civilization — the wilderness is in your blood, wherever you go.',
    feature:{name:'Wanderer', desc:'You have an excellent memory for maps and geography, and can always recall the general layout of terrain, settlements, and features around you. You can also find food and fresh water for yourself and up to five others each day, provided the land offers it.'} },
  Sage:{ source:'5E', skills:['Arcana','History'], languages:'Two of your choice', equipment:'Bottle of ink, quill, small knife, letter from a dead colleague with an unanswered question, common clothes, pouch with 10 gp',
    desc:'You spent years learning the lore of the multiverse, studying manuscripts and the greatest experts on your subjects of interest.',
    feature:{name:'Researcher', desc:'When you attempt to learn or recall a piece of lore and don\'t know it, you often know where and from whom you can obtain it — a library, scriptorium, university, or a sage or other learned person. Unearthing the deepest secrets of the multiverse may require an adventure or a whole campaign.'} },
  Sailor:{ source:'5E', skills:['Athletics','Perception'], tools:"Navigator's tools, vehicles (water)", equipment:'Belaying pin (club), 50 ft of silk rope, lucky charm, common clothes, pouch with 10 gp',
    desc:'You sailed on a seagoing vessel for years, weathering storms, monsters of the deep, and those who wanted to sink your craft.',
    feature:{name:"Ship's Passage", desc:'When you need to, you can secure free passage on a sailing ship for yourself and your companions. In return, you and your companions are expected to assist the crew during the voyage.'} },
  Soldier:{ source:'5E', skills:['Athletics','Intimidation'], tools:'One type of gaming set, vehicles (land)', equipment:'Insignia of rank, trophy from a fallen enemy, set of bone dice or deck of cards, common clothes, pouch with 10 gp',
    desc:'War has been your life for as long as you care to remember — you trained, drilled, and fought as part of an army.',
    feature:{name:'Military Rank', desc:'You have a military rank from your career as a soldier. Soldiers loyal to your former organization still recognize your authority and influence, and will defer to you if of a lower rank. You can requisition simple equipment or horses for temporary use and gain access to friendly military encampments and fortresses.'} },
  Urchin:{ source:'5E', skills:['Sleight of Hand','Stealth'], tools:"Disguise kit, thieves' tools", equipment:'Small knife, map of your home city, pet mouse, token of your parents, common clothes, pouch with 10 gp',
    desc:'You grew up on the streets alone, orphaned and poor, learning to fend for yourself.',
    feature:{name:'City Secrets', desc:'You know the secret patterns and flow of cities and can find passages through the urban sprawl that others would miss. When not in combat, you and companions you lead can travel between any two locations in a city twice as fast as your speed would normally allow.'} },
};
Object.values(BACKGROUND_DATA).forEach(bd=>{ if(!bd.source) bd.source='5E'; bd.builtin=true; });

// ---------- Subclasses ----------
// Detailed, imported subclasses keyed by "Parent::Name". Built-in classes list
// their subclass *names* in CLASS_DATA[cls].subclasses; imported entries here
// add source, description, and level-gated features. `subclassNamesForClass`
// merges the two so pickers and cards see every option for a parent class.
const SUBCLASS_DATA = {
  'Artificer::Alchemist':{ parent:'Artificer', name:'Alchemist', source:'5E', subclassLevel:3,
    desc:'An Alchemist is an expert at combining reagents to produce mystical effects — using potions and oils to restore and protect allies while ravaging enemies with alchemical fire, acid, and poison.',
    features:[
      {lv:3, name:'Tool Proficiency', use:'passive', desc:"You gain proficiency with alchemist's supplies (or another set of artisan's tools if already proficient); you can use them as a spellcasting focus."},
      {lv:3, name:'Alchemist Spells', use:'passive', desc:'You always have certain spells prepared (they don\'t count against your prepared total): L3 Healing Word, Ray of Sickness; L5 Flaming Sphere, Melf\'s Acid Arrow; L9 Gaseous Form, Mass Healing Word; L13 Blight, Death Ward; L17 Cloudkill, Raise Dead.'},
      {lv:3, name:'Experimental Elixir', use:'action', cost:'1/long rest, +1 per slot', desc:'After a long rest, produce one experimental elixir in a flask (random or chosen effect: Healing, Swiftness, Resilience, Boldness, Flight, Transformation). Create extra elixirs by expending a spell slot (action). Drinking one is a bonus action.'},
      {lv:5, name:'Alchemical Savant', use:'passive', desc:"When you cast a spell using alchemist's supplies as the focus, add your INT modifier to one roll of that spell that restores hit points or deals acid, fire, necrotic, or poison damage."},
      {lv:9, name:'Restorative Reagents', use:'passive', desc:'Whenever a creature drinks one of your elixirs it gains temporary HP equal to 2d6 + your INT modifier. You can cast Lesser Restoration without a spell slot a number of times equal to your INT modifier per long rest.'},
      {lv:15, name:'Chemical Mastery', use:'passive', desc:'You gain resistance to acid and poison damage and immunity to the poisoned condition. You can cast Greater Restoration and Heal once each per long rest without expending a spell slot.'},
    ] },
  'Artificer::Armorer':{ parent:'Artificer', name:'Armorer', source:'5E', subclassLevel:3,
    desc:'An Armorer modifies magical armor into a protective exoskeleton, specializing it to sneak, defend, or destroy — becoming a walking arsenal of arcane technology.',
    features:[
      {lv:3, name:'Tools of the Trade', use:'passive', desc:"You gain proficiency with heavy armor and smith's tools (or another set of artisan's tools if already proficient)."},
      {lv:3, name:'Armorer Spells', use:'passive', desc:'Always prepared: L3 Magic Missile, Thunderwave; L5 Mirror Image, Shatter; L9 Hypnotic Pattern, Lightning Bolt; L13 Fire Shield, Greater Invisibility; L17 Passwall, Wall of Force.'},
      {lv:3, name:'Arcane Armor', use:'bonus action', desc:"Turn a suit of armor into Arcane Armor (don/doff as an action). It requires no Strength, can't be removed against your will, replaces missing limbs, and serves as a spellcasting focus."},
      {lv:3, name:'Armor Model', use:'passive', desc:'Choose a model when you don the armor (change on a rest): Guardian — Thunder Gauntlets (1d8 force, disadvantage vs others) and Defensive Field (bonus action temp HP); or Infiltrator — Lightning Launcher (1d6 lightning ranged), Powered Steps (+5 speed), and Dampening Field (advantage on Stealth).'},
      {lv:5, name:'Extra Attack', use:'passive', desc:'You can attack twice, rather than once, whenever you take the Attack action on your turn.'},
      {lv:9, name:'Armor Modifications', use:'passive', desc:'Your Arcane Armor counts as four separate infusable items (armor, boots, helmet, and the special weapon), and you can infuse more items and know more infusions.'},
      {lv:15, name:'Perfected Armor', use:'passive', desc:'Guardian: as a reaction you can pull a Large or smaller creature within 30 ft up to 30 ft toward you. Infiltrator: your Lightning Launcher adds extra damage once per turn (INT mod) and reduces the target\'s speed.'},
    ] },
  'Artificer::Artillerist':{ parent:'Artificer', name:'Artillerist', source:'5E', subclassLevel:3,
    desc:'An Artillerist harnesses magic to hurl fire, frost, and force across the battlefield, wielding an arcane cannon of their own creation and channeling spells through a magic weapon.',
    features:[
      {lv:3, name:'Tool Proficiency', use:'passive', desc:"You gain proficiency with woodcarver's tools (or another set of artisan's tools if already proficient)."},
      {lv:3, name:'Artillerist Spells', use:'passive', desc:'Always prepared: L3 Shield, Thunderwave; L5 Scorching Ray, Shatter; L9 Fireball, Wind Wall; L13 Ice Storm, Wall of Fire; L17 Cone of Cold, Wall of Force.'},
      {lv:3, name:'Eldritch Cannon', use:'action', cost:'1/long rest or 1 slot', desc:'Create a Small or Tiny magical cannon (AC 18, HP 5×artificer level). Choose Flamethrower (15-ft cone, 2d8 fire, DEX save), Force Ballista (120-ft ranged, 2d8 force + push), or Protector (temp HP 1d8+INT to nearby allies). Bonus action to activate or move it up to 15 ft.'},
      {lv:5, name:'Arcane Firearm', use:'passive', desc:"After a long rest, use tinker's/woodcarver's/smith's tools to turn a rod, staff, or wand into an Arcane Firearm. When you cast an artificer spell through it, add +1d8 to one damage roll of that spell."},
      {lv:9, name:'Explosive Cannon', use:'passive', desc:'Your Eldritch Cannon\'s damage rolls increase by 1d8. As an action you can command it to detonate: each creature within 20 ft takes 3d8 force damage (DEX save for half), destroying the cannon.'},
      {lv:15, name:'Fortified Position', use:'passive', desc:'You can have two Eldritch Cannons at once (create both with one spell/action, activate both with one bonus action). You and your allies have half cover while within 10 ft of one of your cannons.'},
    ] },
  'Artificer::Battle Smith':{ parent:'Artificer', name:'Battle Smith', source:'5E', subclassLevel:3,
    desc:'A Battle Smith is a protector who repairs the wounded and defends the fallen, fighting alongside a loyal Steel Defender of their own invention and wielding magic weapons with arcane skill.',
    features:[
      {lv:3, name:'Tool Proficiency', use:'passive', desc:"You gain proficiency with smith's tools (or another set of artisan's tools if already proficient); you can use them as a spellcasting focus."},
      {lv:3, name:'Battle Smith Spells', use:'passive', desc:'Always prepared: L3 Heroism, Shield; L5 Branding Smite, Warding Bond; L9 Aura of Vitality, Conjure Barrage; L13 Aura of Purity, Fire Shield; L17 Banishing Smite, Mass Cure Wounds.'},
      {lv:3, name:'Battle Ready', use:'passive', desc:'You gain proficiency with martial weapons. When you attack with a magic weapon, you can use your Intelligence modifier, instead of Strength or Dexterity, for the attack and damage rolls.'},
      {lv:3, name:'Steel Defender', use:'action', cost:'1/long rest or 1 slot', desc:"Build a loyal mechanical companion (see its stat block). It shares your proficiency bonus, acts on your turn, and can Deflect Attack as a reaction. It takes the Dodge action unless you use a bonus action to command it to Dodge, Dash, Disengage, Help, or make its Force-Empowered Rend attack."},
      {lv:5, name:'Extra Attack', use:'passive', desc:'You can attack twice, rather than once, whenever you take the Attack action on your turn.'},
      {lv:9, name:'Arcane Jolt', use:'passive', cost:'INT mod/long rest', desc:'When your magic weapon or your Steel Defender hits a target, you can channel magical energy: either deal an extra 2d6 force damage, or heal one creature within 30 ft of the target for 2d6 hit points.'},
      {lv:15, name:'Improved Defender', use:'passive', desc:'Your Arcane Jolt damage and healing increase to 4d6. Your Steel Defender gains a +2 bonus to AC, its Deflect Attack deals force damage (1d4 + INT mod), and its Force-Empowered Rend deals extra force damage.'},
    ] },
  // ---- Steinhardt's Guide to the Eldritch Hunt (World Anvil) subclasses ----
  // Homebrew. Concise paraphrases of each Chapter/archetype's level-gated
  // features; see worldanvil.com/w/steinhardt-s-guide-to-the-eldritch-hunt for
  // full rules text. Jaeger Chapter names match CLASS_DATA.Jaeger.subclasses.
  'Artificer::Mortis Engineer':{ parent:'Artificer', name:'Mortis Engineer', source:'Homebrew', subclassLevel:3,
    desc:'A ghoulish forerunner of manikin science who grafts lightning to still-warm flesh — scorching foes from within, then jolting their corpses upright as twitching, ozone-reeking zombie servants.',
    features:[
      {lv:3, name:'Tool Proficiency', use:'passive', desc:'You gain proficiency in the Medicine skill (or another skill of your choice if already proficient).'},
      {lv:3, name:'Mortis Engineer Spells', use:'passive', desc:'Always prepared (don\'t count against your prepared total): L3 false life, witch bolt; L5 lightning charged, ray of enfeeblement; L9 lightning bolt, revivify; L13 graveyard shuffle, jumping bolt; L17 negative energy flood, raise dead.'},
      {lv:3, name:'Jumpstart', use:'passive', desc:'Once on your turn, when a spell of 1st level or higher deals lightning damage to a creature, you can heal it instead for INT modifier x the spell level. Repeating this on a creature on consecutive rounds forces an escalating CON save or it takes the damage as normal. From 9th level you can heal several creatures at once.'},
      {lv:3, name:'Galvanized Flesh', use:'bonus action', desc:'When you deal lightning damage to a Small+ corpse with a spell, embed rods to raise it as a zombie for 10 minutes: 2x artificer-level temp HP and +INT to attacks. Control 2 zombies (3 at 9th, 4 at 17th); each discharges lightning at a nearby creature when it drops.'},
      {lv:5, name:'Death Lightning', use:'passive', desc:'You can swap the necrotic and lightning damage of your spells for each other. Your zombies can also deliver your touch spells (using their reaction) from up to 100 ft away.'},
      {lv:5, name:'Shock Trooper', use:'passive', desc:'Your zombies gain 40 ft speed, can deal lightning instead of bludgeoning damage, and gain a System Overload shock (bonus action, CON save).'},
      {lv:9, name:'Unending Legion', use:'passive', desc:'A carried container fits your zombies with metallic shells: AC 12 + INT, +INT to saves, and added damage immunities.'},
      {lv:15, name:'Flesh Titan', use:'action', cost:'1/long rest', desc:'Inject a zombie within 5 ft to turn it into a flesh golem for 1 minute (still affected by your zombie features); it detonates in a 20-ft lightning burst when the minute ends or it drops to 0 HP.'},
    ] },
  'Barbarian::Path of the Earthbreaker':{ parent:'Barbarian', name:'Path of the Earthbreaker', source:'Homebrew', subclassLevel:3,
    desc:'A living titan who wields stolen gravity-magic, crushing foes with bare fists and levelling the battlefield itself. Save DC = 8 + proficiency bonus + STR modifier.',
    features:[
      {lv:3, name:'Overwhelming Power', use:'passive', desc:'Gravity-charged unarmed strikes deal 1d6 + STR bludgeoning (d8/d10/d12 at 6th/10th/14th); after one, a bonus action makes another unarmed strike on the same target. Nonmagical weapons shatter on a melee hit; thrown-weapon range doubles and can use the unarmed die.'},
      {lv:3, name:'Gravitational Rage', use:'passive', desc:'Once per turn on an unarmed hit, force an Earthbreaker save: Burying Hands (speed halved, prone on a big fail) or Bulldozing Punch (push 10 ft, collision damage).'},
      {lv:6, name:'Ruination', use:'passive', desc:'Your unarmed strikes count as magical. Punch a wall/force spell (wall of force, forcecage, etc.) and make a STR check (DC 10 + spell level) to rupture and dispel it.'},
      {lv:6, name:'Imperious Gravity', use:'bonus action', desc:'While raging: Attractive Field (15-ft cone pull), Repulsive Field (retaliatory push bubble), or Stomp (line quake, difficult terrain). Range and distances double at 14th.'},
      {lv:10, name:'Unyielding', use:'passive', desc:'Your unarmed strikes deal double damage to structures, you ignore difficult terrain, and you add your CON modifier to STR and Intimidation checks.'},
      {lv:14, name:'World Breaker', use:'passive', cost:'STR mod/short rest', desc:'Once per turn while raging, a melee hit deals +3d12 bludgeoning and pushes 30 ft; hit or miss, a 90-ft cone breaks as a brief earthquake (your save DC, up to 1d4 fissures).'},
    ] },
  'Barbarian::Path of the Lightning Vessel':{ parent:'Barbarian', name:'Path of the Lightning Vessel', source:'Homebrew', subclassLevel:3,
    desc:'A brute overflowing with implanted lightning, crashing into the fray from impossible heights and electrocuting all around. Vessel save DC = 8 + proficiency bonus + CON modifier.',
    features:[
      {lv:3, name:'Galvanic Heart', use:'bonus action', desc:'Gain lightning resistance (or reduce lightning damage 1d6 if already resistant). While raging, spend a bonus action on Electrified Chains (bonus lightning + anchor a target), Fulgurant Strike (call lightning through an embedded weapon, DEX-save area), or Lightning Step (dash half speed, zap a nearby creature).'},
      {lv:6, name:'Roaring Crash', use:'special', desc:'When you enter your rage, leap and slam a point within 30 ft: a 10-ft radius makes a DEX save or takes CON-many d8 lightning (half on a save). Range/target size grows at 10th (60 ft, Huge) and 14th (90 ft, Gargantuan).'},
      {lv:10, name:'Lightning Reflexes', use:'passive', desc:'Add your CON modifier (min +1) to DEX checks, and while raging you can use Lightning Step once per turn without a bonus action.'},
      {lv:14, name:'Electric Beast', use:'passive', desc:'The damage of your Galvanic Heart abilities rises to three times your CON modifier, and each of those abilities gains an upgraded effect.'},
    ] },
  'Bard::College of the Apocalypse':{ parent:'Bard', name:'College of the Apocalypse', source:'Homebrew', subclassLevel:3,
    desc:'A herald of the end who channels the power of the Great Ones through aberrant song, unleashing madness and cataclysm on the battlefield.',
    features:[
      {lv:3, name:'Endless Symphony', use:'passive', desc:'Gain an extra use of Bardic Inspiration at 3rd, 6th, and 14th level. In exchange, the die stays a d6 until it becomes a d8 at 10th level and a d10 at 15th.'},
      {lv:3, name:'Eldritch Choir', use:'action', cost:'1 Bardic Inspiration', desc:'Learn Eldritch Melodies (2, +1 at 6th and 14th), sung as an action by expending Bardic Inspiration: e.g. a mass push/prone, a single-target stun, or an attack/damage buff to allies. Swapping a melody on a rest risks a DC 17 CHA save (short-term madness on a fail).'},
      {lv:6, name:'Knowledge from Beyond the Stars', use:'passive', desc:'You can speak, read, and write Deep Speech, and add a roll of your Bardic Inspiration die (without expending it) to INT checks about the cosmos or the eldritch.'},
      {lv:6, name:'Devouring Maw', use:'reaction', desc:'A creature holding your Bardic Inspiration die can expend it as a reaction to an attack for a bonus to AC equal to the roll; if that turns a hit into a miss, it may teleport up to 30 ft.'},
      {lv:14, name:'Song of the Apocalypse', use:'passive', cost:'1/long rest free cast', desc:'Learn divine order: transcend (doesn\'t count against spells known); cast it once per long rest without a slot, with concentration that damage can\'t break and automatic success to keep control.'},
    ] },
  'Cleric::Guardian Domain':{ parent:'Cleric', name:'Guardian Domain', source:'Homebrew', subclassLevel:1,
    desc:'A frontline saint of the Radiant Church who summons a guardian angel to shield the innocent and body-block death itself. Radiance around a protective, self-sacrificing emissary.',
    features:[
      {lv:1, name:'Domain Spells', use:'passive', desc:'Always prepared: L1 protection from evil and good, sanctuary; L3 aid, warding bond; L5 protection from energy, slow; L7 guardian of faith, resilient sphere; L9 antilife shell, wall of force.'},
      {lv:1, name:'Bonus Proficiency', use:'passive', desc:'You gain proficiency with heavy armor.'},
      {lv:1, name:'Protective Magic', use:'passive', desc:'When you cast a spell that restores hit points, the target also gains half as many temporary hit points (choose one creature if the spell targets several).'},
      {lv:2, name:'Channel Divinity: Guardian Angel', use:'action', desc:'Summon a flying celestial ally (choose radiant or necrotic) for 1 hour. It shares your initiative, Dodges unless you command it with a bonus action, and can teleport in front of allies to take hits for them.'},
      {lv:6, name:'Angelic Protection', use:'passive', desc:'When summoned, your Guardian Angel immediately casts warding bond (no action, ignoring components) on a friendly creature it can see.'},
      {lv:8, name:'Divine Strike', use:'passive', desc:'Once per turn a weapon hit deals +1d8 radiant damage (2d8 at 14th). Your Guardian Angel gains this feature too.'},
      {lv:17, name:'Aura of Defense', use:'passive', cost:'1/long rest', desc:'Your Guardian Angel\'s warding bond can cover a number of allies equal to your WIS modifier, and it gains 5 temporary HP per creature warded.'},
    ] },
  'Druid::Circle of Symbiosis':{ parent:'Druid', name:'Circle of Symbiosis', source:'Homebrew', subclassLevel:2,
    desc:'A druid who grafts fragments of nature onto their own body through osteomancy, becoming a bone-and-timber behemoth that regenerates through the fury of battle.',
    features:[
      {lv:2, name:'Circle Spells', use:'passive', desc:'Always prepared: L2 shillelagh; L3 barkskin, skeletal tail; L5 osseous cage, plant growth; L7 maiden of bones, stoneskin; L9 forest of dread, tree stride.'},
      {lv:2, name:'Wickerbone Behemoth', use:'action', cost:'1 Wild Shape', desc:'Spend a Wild Shape to become a behemoth (no armor) instead of a beast: arms act as shillelagh clubs, you gain barkskin without concentration, splinter for 1d4 (2d4 at 10th) when hit, and regenerate half the damage taken each turn (max 3x WIS). Lasts 10 minutes.'},
      {lv:2, name:'Grafted Powers', use:'passive', desc:'Choose Bear Back (larger carrying/grapple, add WIS to STR checks), Deer Head (advantage on sight/smell Perception), or Goat Hooves (anti-prone advantage and a climbing speed).'},
      {lv:6, name:'Extra Attack', use:'passive', desc:'You can attack twice whenever you take the Attack action, and can replace one attack with a cantrip.'},
      {lv:10, name:"Nature's Wrath", use:'passive', desc:'You are permanently under barkskin. Your Wickerbone Behemoth becomes Large and grants 1d8 + WIS temporary HP whenever you deal bludgeoning, piercing, or slashing damage.'},
      {lv:14, name:'Briarheart', use:'passive', cost:'1/long rest', desc:'Your melee weapon hits deal +WIS damage. When you drop to 0 HP, grant your Wickerbone Behemoth to two willing creatures within 30 ft for 1 minute (they can transform even in armor).'},
    ] },
  'Fighter::Blood Archer':{ parent:'Fighter', name:'Blood Archer', source:'Homebrew', subclassLevel:3,
    desc:'A cursed archer coursing with tarblood, weaving their own blood into arrows to charm, burn, banish, and bleed their prey. Blood Shot save DC = 8 + proficiency bonus + CON modifier.',
    features:[
      {lv:3, name:'Blood Shot', use:'special', cost:'1+CON/short rest', desc:'Learn 3 Blood Shot options (+1 at 7th/10th/15th/18th); once per turn apply one to a bow attack. Options include Bewitching (charm/turncoat), Bloodboil (fire burst), Bloodshard (line attack), Constraining (acid tendrils), and Exiling (banish); all scale up at 18th.'},
      {lv:3, name:'Blood Archer Anatomy', use:'passive', desc:'You are immune to disease and have resistance to and advantage against poison. You have advantage on Perception/Survival checks to track any creature you have damaged that has blood.'},
      {lv:7, name:'Blood Arrows', use:'passive', desc:'Conjure magical arrows in place of ammunition (they overcome nonmagical resistance), and add your CON modifier to Blood Shot damage.'},
      {lv:10, name:'Blood Recall', use:'bonus action', desc:'When you miss with a blood arrow, use a bonus action to reroll the attack roll against the same target as the arrow flies back.'},
      {lv:15, name:'Blood of Creation', use:'action', desc:'Sacrifice your lifeforce: take 1d10 + CON necrotic damage that can\'t be reduced, and regain 1d4 uses of Blood Shot.'},
    ] },
  'Fighter::Living Nightmare':{ parent:'Fighter', name:'Living Nightmare', source:'Homebrew', subclassLevel:3,
    desc:'A hunter grafted with eldritch flesh, reshaping their own body into blades, hammers, and lashes and devouring the dead to heal and wear their faces. Living Nightmare save DC = 8 + proficiency bonus + CON modifier.',
    features:[
      {lv:3, name:'Awakened Mutation', use:'passive', desc:'You lose proficiency with shields and heavy armor. While unarmored, your AC equals 11 + DEX modifier + CON modifier.'},
      {lv:3, name:'Eldritch Weaponry', use:'bonus action', desc:'Grow simple melee weapons: Stinger (1d8 pierce, bonus-action second strike), Hammer Arm (2d6 bludgeon + push), Tendinous Lash (1d4 slash, 15 ft reach, trip on a STR save), or reaction Sinister Aegis (+2 AC). On a rest you can devour a rapier/maul/whip/shield to graft its magic onto the matching limb.'},
      {lv:7, name:'Macabre Appetite', use:'action', desc:'Devour a corpse (dead under 1 week) within 5 ft to heal HP equal to its CR, and for 24 hours you can assume the creature\'s appearance and voice.'},
      {lv:10, name:'Ascended Being', use:'bonus action', cost:'CON mod/long rest', desc:'Devouring a creature also grants its last week of memories. As a bonus action, grow eldritch wings for a 30 ft flying speed for 1 minute.'},
      {lv:15, name:'Nightmarish Weaponry', use:'special', desc:'Once per turn, replace an Eldritch Weaponry attack with a stronger burst — e.g. a Stinger 30-ft cone (DEX save for the damage of 3 hits) or a ground-shattering Hammer Arm quake.'},
    ] },
  'Monk::Way of the Fire Dancer':{ parent:'Monk', name:'Way of the Fire Dancer', source:'Homebrew', subclassLevel:3,
    desc:'An heir to a persecuted tradition who hides deadly martial arts within dance, wreathing weapons and body in flame. (A darkflame variant swaps fire for necrotic.)',
    features:[
      {lv:3, name:'Blazing Performer', use:'passive', desc:'Gain proficiency (doubled) in Performance or Acrobatics, and fire resistance (or reduce fire damage 1d6 if already resistant).'},
      {lv:3, name:'Dance of Fire', use:'passive', cost:'1 ki', desc:'Spending a ki point on your turn ignites your monk weapons and unarmed strikes until your next turn: +WIS fire damage and +half WIS AC. While ablaze, you can react to a missed melee attack with an unarmed strike or a Flurry of Blows.'},
      {lv:6, name:'Scorching Vortex', use:'special', cost:'1+WIS/long rest', desc:'With Step of the Wind, circling a creature traps it in a fiery vortex: a DEX save or 2d6 fire and confinement; the opaque flames block line of sight.'},
      {lv:11, name:'Flames of Redemption', use:'passive', desc:'Your fire damage ignores fire resistance, and you can choose to deal it as radiant damage instead.'},
      {lv:11, name:'Purifying Flames', use:'action', cost:'2 ki', desc:'Touch a creature to end one poison, charm, or short-term madness afflicting it.'},
      {lv:17, name:'One with the Fire', use:'passive', desc:'Monk-weapon fire damage sets targets alight (WIS fire each turn until doused). While in Dance of Fire, you gain immunity to fire and resistance to bludgeoning, piercing, and slashing damage.'},
    ] },
  'Paladin::Oath of the Eldritch Hunt':{ parent:'Paladin', name:'Oath of the Eldritch Hunt', source:'Homebrew', subclassLevel:3,
    desc:'A grey templar sworn to eradicate the aberrant, marking prey and teleporting to the kill while walking the razor edge between hunter and beast.',
    features:[
      {lv:3, name:'Oath Spells', use:'passive', desc:'Always prepared: L3 faerie fire, spectral slash; L5 moonbeam, hold person; L9 displacing maw, spectral fury; L13 black tentacles, maiden of bones; L17 contact other plane, hold monster.'},
      {lv:3, name:'Channel Divinity: Hunt the Prey', use:'bonus action', desc:'Mark a creature within 60 ft for 1 minute; as a bonus action each turn you can teleport up to 30 ft to a space next to the marked target.'},
      {lv:3, name:'Channel Divinity: Stolen Eldritch Gift', use:'bonus action', desc:'For 10 minutes, add your CHA modifier to Athletics, Acrobatics, and Perception checks.'},
      {lv:7, name:'Sharpened Senses', use:'passive', desc:'You gain blindsight 10 ft (30 ft at 18th); within range nothing can hide from you, even while blinded or in darkness.'},
      {lv:15, name:'Find Weakness', use:'passive', desc:'Dealing damage to a creature reveals its resistances, immunities, and vulnerabilities. Hunt the Prey also lets you make a weapon attack against the marked target when you reappear.'},
      {lv:20, name:'Perfect Hunter', use:'bonus action', cost:'1/long rest', desc:'For 1 minute you become invisible, can\'t be grappled/restrained/paralyzed, and your weapon hits deal +1d8 necrotic that bypasses resistance.'},
    ] },
  'Ranger::Lunar Warden':{ parent:'Ranger', name:'Lunar Warden', source:'Homebrew', subclassLevel:3,
    desc:'An heir to an ancient elven tradition who bonds with the ever-shifting eldritch moons, channeling their powers and swelling in strength under the moon that matches.',
    features:[
      {lv:3, name:'Astral Affinity', use:'passive', desc:'Learn the light cantrip, gain advantage on saves against direct Eldritch Moon effects, and gain darkvision 60 ft (or +30 ft).'},
      {lv:3, name:'Moon Conduit', use:'special', cost:'WIS/long rest', desc:'Once per turn channel a Moon Conduit (short rest recharge from 7th): e.g. Blood Moon of Rebirth (party healing), Howling Moon (claws), Shattered Moon (dampen magic / counterspell), Scorching Moon (charge + fire), Vacuous Moon (teleport). A conduit matching the moon overhead is empowered (Lunar Alignment).'},
      {lv:11, name:'Additional Moon Conduits', use:'passive', desc:'Learn further conduits — Glacial Moon (retaliatory temp HP), Slumbering Moon (free misty step / dimension door), Krakenlight (charming lure), and more.'},
      {lv:15, name:'Celestial Tide', use:'action', cost:'1/long rest', desc:'Cast reverse gravity for free in a pool of moonlight; when it ends, the lunar energy flows back and you regain all Moon Conduit uses.'},
    ] },
  'Ranger::Torturer Conclave':{ parent:'Ranger', name:'Torturer Conclave', source:'Homebrew', subclassLevel:3,
    desc:'An inquisitorial hunter who brings implements of torture into battle, fueling agonizing techniques with magic. Technique save DC = 8 + proficiency bonus + WIS modifier. (Torture is a heavy theme — discuss with your table.)',
    features:[
      {lv:3, name:'Tools of the Trade', use:'passive', desc:'Gain proficiency (doubled) with torture tools and Insight checks.'},
      {lv:3, name:'Torturer Techniques', use:'special', cost:'2/long rest or 1 slot', desc:'Learn techniques that enhance a melee attack made while holding torture tools. Expending a spell slot empowers a technique with extra damage (scaling WIS) and a saving-throw penalty on the target.'},
      {lv:7, name:'Technique Mastery', use:'passive', desc:'Your techniques gain upgraded effects, such as a lingering bleed that recurs when you strike the same target on consecutive rounds.'},
      {lv:11, name:'Greater Technique Mastery', use:'passive', desc:'Further technique upgrades, such as blinding a target that fails a technique save on consecutive rounds.'},
      {lv:15, name:'Mental Agony', use:'reaction', desc:'React to a creature that recently failed a technique save (within 60 ft) to torment its mind, hindering its WIS, CHA, or INT saving throw.'},
    ] },
  'Rogue::Blade of Radiance':{ parent:'Rogue', name:'Blade of Radiance', source:'Homebrew', subclassLevel:3,
    desc:'A zealous Steel Saint of the Church who sanctifies a blade and spends divine power to protect the faithful and smite enemies of the faith. Radiance save DC = 8 + proficiency bonus + WIS modifier.',
    features:[
      {lv:3, name:'Sanctified Champion', use:'passive', desc:'Gain proficiency with martial weapons and medium armor, and ritually sanctify a melee weapon on a long rest (it has finesse and counts as silvered in your hands).'},
      {lv:3, name:'Divine Blessings', use:'special', cost:'1+WIS Divine points/rest', desc:'Divine points refresh on a rest (regain 1 per CR 1/2+ aberration/beast/fiend/undead slain with your blade); spending one grants WIS temp HP. Powers: Armor of the Faithful (reaction to force a foe off you), Divine Inspiration (reroll Religion/History/Insight), Rend the Blasphemous (bonus-action extra attack).'},
      {lv:9, name:'Righteous Armament', use:'special', cost:'Divine points', desc:'More powers: Chains of Judgement (restrain on a hit), Divine Retaliation (reaction strike), Erupting Blades (convert Sneak Attack into a radiant DEX-save cone).'},
      {lv:13, name:'Saintly Revelations', use:'passive', desc:'Learn 2 cleric cantrips and cast protection from evil and good, heroism, and shield of faith at will on yourself (from 17th, without concentration).'},
      {lv:17, name:'Final Judgement', use:'passive', desc:'Command your sanctified blade to shed bright light (30 ft) and dim light (30 ft); while lit it counts as magical and deals +2d4 radiant damage.'},
    ] },
  'Rogue::Shadow':{ parent:'Rogue', name:'Shadow', source:'Homebrew', subclassLevel:3,
    desc:'A secret assassin of the Silverblood Royalty who bonds a shadow-wreathed rifle, melts into darkness, and reappears to strike unseen.',
    features:[
      {lv:3, name:'Umbral Weapon', use:'passive', desc:'Gain firearm proficiency and ritually bond a rifle: you can\'t be disarmed of it and can summon it to hand; it needs no ammunition, makes no sound, and loses the Barrel property.'},
      {lv:3, name:'Shadow Movement', use:'bonus action', desc:'While in darkness, take the Hide action with advantage and become a shadowy form (squeeze through 1-inch gaps, climbing speed, but incapacitated). End it to fire a concealed shot (1d4) that doesn\'t reveal you on a miss.'},
      {lv:9, name:'Tenebrous Body', use:'passive', desc:'See normally in magical and nonmagical darkness out to 120 ft, and maintain Shadow Movement for up to 1 hour.'},
      {lv:13, name:'Grim Curse', use:'passive', desc:'On a Sneak Attack with your umbral weapon, sacrifice up to 3 Sneak Attack dice to impose prone / restrained / blinded (save DC 8 + DEX + proficiency, with a -1d6 penalty if both of you are in darkness).'},
      {lv:17, name:'Veil of Shadows', use:'reaction', desc:'When you use Uncanny Dodge, teleport up to 30 ft to a space in darkness and make one umbral-weapon attack against the attacker.'},
    ] },
  'Sorcerer::Scion of Madness':{ parent:'Sorcerer', name:'Scion of Madness', source:'Homebrew', subclassLevel:1,
    desc:'A sorcerer whose mind is riddled with eldritch insanity — feeding on madness itself, spreading it to enemies, and warping the magic of the world.',
    features:[
      {lv:1, name:'Mind of Madness', use:'passive', desc:'You can reroll any madness you gain. A creature that reads your thoughts or scries you takes psychic damage equal to your class level, its effect fails, and it must save or gain a short-term madness.'},
      {lv:1, name:'Spread of Chaos', use:'passive', cost:'1/long rest', desc:'When you cast a non-self spell of 1st level or higher, affected creatures must save or gain a short-term madness (targeting several forces a CHA save that risks failing the spell and afflicting you).'},
      {lv:6, name:'Depths of Depravity', use:'reaction', cost:'1/short rest', desc:'While affected by a madness, react to give a creature within 120 ft disadvantage on a save; if it fails, regain one sorcery point per madness affecting you.'},
      {lv:14, name:'Powers of Insanity', use:'passive', desc:'When determining a madness effect, roll two d10 and take the lower, and gaining a madness no longer stuns you.'},
      {lv:18, name:'Maddening Hunger', use:'passive', desc:'Whenever you gain a madness, regain sorcery points: 1d4 (short-term), 2d4 (long-term), or 4d4 (indefinite).'},
    ] },
  'Warlock::The Void':{ parent:'Warlock', name:'The Void', source:'Homebrew', subclassLevel:1,
    desc:'A warlock pledged to an energy-devouring cosmic entity, manipulating gravity and conjuring miniature black holes to crush and consume the enemy.',
    features:[
      {lv:1, name:'Expanded Spell List', use:'passive', desc:'Added to your spell options: L1 feather fall, gravity leap; L2 levitate, otherworldly gaze; L3 astral barrage, blink; L4 black tentacles, resilient sphere; L5 telekinesis, starfall.'},
      {lv:1, name:'Fugite Omnis', use:'passive', desc:'You can hover a few inches off the ground, ascending and descending as part of your movement; being knocked prone instead sets you on the ground.'},
      {lv:1, name:'Voracious Void', use:'bonus action', cost:'1/long rest or 1 slot', desc:'Create a 5-ft miniature black hole within 60 ft for 1 minute (concentration). It is difficult terrain, pulls objects and (STR save) creatures to its center, and deals 1d6 bludgeoning while halving speed. It grows at warlock levels 3/5/7/9 (restrain, annihilate at 0 HP, larger, 2d6 and airborne).'},
      {lv:6, name:'Gravitational Pull', use:'reaction', desc:'When a creature within 120 ft is hit by a ranged attack passing through your active black hole, react with a ranged spell attack to deflect or blunt the strike.'},
      {lv:10, name:'Warp Gravity', use:'passive', desc:'Gain a flying speed equal to your walking speed and can hover; you can share this with one creature touching you.'},
      {lv:14, name:'Oblivion', use:'special', cost:'1/long rest', desc:'Let Voracious Void run wild: every creature that starts its turn in the field must save or be pulled to the center (you and a number of allies equal to your CHA modifier are exempt).'},
    ] },
  'Wizard::Osteomancer':{ parent:'Wizard', name:'Osteomancer', source:'Homebrew', subclassLevel:2,
    desc:'A wizard who harvests power from bones — armoring themselves in their own skeleton and puppeting the skeletons of their foes.',
    features:[
      {lv:2, name:'Brittle Bone Armor', use:'bonus action', cost:'1/short rest', desc:'While unarmored, force out a frame of bones for 2x class-level temporary HP for 1 minute, gaining resistance to slashing and piercing and a bonus to AC equal to one-third your class level.'},
      {lv:2, name:'Anatomical Expert', use:'passive', desc:'Gain Medicine proficiency and add your INT modifier to Medicine checks; on a check about a creature with a skeleton, add double your proficiency bonus.'},
      {lv:6, name:'Bone Puppetry', use:'action', cost:'INT mod/long rest', desc:'Target a boned creature within 60 ft (STR save); on a failure you control its skeleton until the end of its next turn, and it hinders its own allies while resisting you.'},
      {lv:10, name:'Skeletal Mastery', use:'passive', desc:'Cast alter self at will (Change Appearance or Natural Weapons only). As an action you can dissolve your own skeleton to ooze through 5-inch gaps at 10 ft speed (prone, no attacks or spells).'},
      {lv:14, name:'Improved Bone Puppetry', use:'passive', desc:'Bone Puppetry lasts 1 minute (concentration that damage can\'t break) with no self-imposed penalties; the target repeats the save each turn, and you can spend extra uses to impose disadvantage on it.'},
    ] },
  'Jaeger::Absolute Chapter':{ parent:'Jaeger', name:'Absolute Chapter', source:'Homebrew', subclassLevel:3,
    desc:'Jaegers who pursue the perfect hunt — killing their prey without taking a single hit, refining the core jaeger techniques to absolute perfection.',
    features:[
      {lv:3, name:'Counter Strike', use:'passive', desc:'Weapon Parry deals extra damage equal to half your class level; if the blocked damage exceeds the attack and your roll would hit AC, the target takes the remainder. Spending a Focus Point on a Focus Art grants advantage on your next weapon attack.'},
      {lv:3, name:'Unencumbered Movement', use:'passive', desc:'While in light or no armor, your speed increases by 10 ft and your Dodge Step distance increases by 5 ft.'},
      {lv:7, name:'Encircling Strike', use:'passive', desc:'When you flank a creature (opposite the side you started, or opposite an ally), your first melee hit deals extra damage equal to one Momentum die.'},
      {lv:14, name:'Mobile Pursuer', use:'passive', desc:"Hunter's Pursuit ignores difficult terrain, lets you pass through hostile creatures, and costs no extra movement to climb or swim."},
      {lv:17, name:'The Hunt', use:'free', cost:'1/long rest', desc:'Declare a hunt: for 1 minute you have freedom of movement and each Focus Point you spend grants 2 Momentum dice instead of 1.'},
    ] },
  'Jaeger::Heretic Chapter':{ parent:'Jaeger', name:'Heretic Chapter', source:'Homebrew', subclassLevel:3,
    desc:'Jaegers who tear power from the gods themselves through blasphemous ritual, binding warlock magic to their soul. INT is their spellcasting ability.',
    features:[
      {lv:3, name:'Heretic Magic', use:'passive', desc:'You gain INT-based spellcasting from the warlock list with short-rest slots: 2 cantrips (+1 at 10th) and a growing list of known spells. Slot level rises 1st at 3rd, 2nd at 7th, 3rd at 13th, and 4th at 19th.'},
      {lv:3, name:'Arcane Arts (Spell Flurry)', use:'bonus action', cost:'1 FP', desc:'When you cast a cantrip or a spell of 1st level or higher, expend a Focus Point to make a single weapon attack as a bonus action.'},
      {lv:7, name:'Shrouded Steps', use:'passive', desc:'Jaeger features that let you move without spending movement can teleport instead; using this for Dodge Step makes you automatically succeed on its save.'},
      {lv:14, name:'Mystical Momentum', use:'passive', desc:'When you expend a spell slot, you gain a number of Momentum dice equal to the slot level.'},
      {lv:17, name:'Darkness Within', use:'bonus action', cost:'1/long rest', desc:'For 1 minute take a shadow-winged aspect: dim the area within 10 ft, become heavily obscured, gain a 30 ft flying speed, and resist nonmagical, non-silvered bludgeoning/piercing/slashing damage.'},
    ] },
  'Jaeger::Marauder Chapter':{ parent:'Jaeger', name:'Marauder Chapter', source:'Homebrew', subclassLevel:3,
    desc:'Jaegers of raw slaughter who wade into the fray with two-handed weapons, cleaving through hordes and toppling giants.',
    features:[
      {lv:3, name:'Path of Gore (Great Cleave)', use:'special', cost:'all Momentum dice', desc:'On a hit with a two-handed weapon, expend all Momentum dice to deal +1 die damage and cleave that many adjacent targets; regain 1 Focus Point per creature reduced to 0 HP.'},
      {lv:3, name:'Marauder Momentum', use:'passive', desc:'While wielding a two-handed melee weapon, your Momentum die is one size larger. While in medium armor you can add your CON modifier (max +2) instead of DEX to your AC.'},
      {lv:7, name:'Leap Attack', use:'passive', desc:'Once per turn, if you move more than 15 ft toward a target (or fall 10+ ft onto it) before attacking, you deal +1 Momentum die of damage; when falling this way you halve falling damage and don\'t land prone.'},
      {lv:14, name:'Fell the Leviathan', use:'passive', desc:'When you use a Finisher, the target makes a STR save (8 + STR + proficiency) or is knocked prone; Large or larger creatures have disadvantage.'},
      {lv:17, name:'Titanic Strength', use:'passive', desc:'You can wield two-handed weapons in one hand and dual-wield non-light weapons; two-handed hits deal +half your STR modifier. On a Finisher you can double your Momentum dice (once per long rest).'},
    ] },
  'Jaeger::Salvation Chapter':{ parent:'Jaeger', name:'Salvation Chapter', source:'Homebrew', subclassLevel:3,
    desc:'Divinely favored jaegers who purge evil with one hand and shield the innocent with the other, wreathing allies in healing light.',
    features:[
      {lv:3, name:'Art of Salvation (Prayer of Salvation)', use:'bonus action', cost:'1 FP', desc:'You and an ally within 60 ft each regain 1d6 HP and gain that many temporary HP.'},
      {lv:3, name:"Savior's Focus", use:'passive', desc:'When an ally you can see or hear drops to 0 HP, you regain 1 Focus Point (once per minute).'},
      {lv:7, name:'Sanctifying Light', use:'passive', desc:'When you spend a Focus Point you can emit sunlight (20 ft bright, 20 ft dim) until end of your next turn; allies entering or starting there heal 1d6 + your proficiency bonus.'},
      {lv:14, name:'Purifying Salvation', use:'passive', desc:'Prayer of Salvation reaches one more creature and heals 1d12, and can cleanse charm, fright, poison, or short-term madness.'},
      {lv:17, name:'Light of Hope', use:'bonus action', cost:'1/long rest', desc:'For 1 minute Sanctifying Light grows to 30 ft bright / 30 ft dim, allies within gain bless and advantage on death saves (and can\'t die at three fails while inside), and Prayer of Salvation refunds its Focus Point.'},
    ] },
  'Jaeger::Sanguine Chapter':{ parent:'Jaeger', name:'Sanguine Chapter', source:'Homebrew', subclassLevel:3,
    desc:'Jaegers who draw power from blood — their own and their foes\' — sustaining unnatural resilience through an endless crimson parade. Blood Magic save DC = 8 + INT or CON modifier + proficiency bonus.',
    features:[
      {lv:3, name:'Vital Consumption (Blood Drain)', use:'bonus action', cost:'all Momentum dice', desc:'Drain a creature within 5 ft: it makes a CON save vs your Blood Magic DC for necrotic damage equal to the Momentum dice rolled (half on a save); you heal for half the damage. Regain 1 Focus Point if the target ends bloodied or was already bleeding.'},
      {lv:3, name:'Crimson Rage', use:'passive', desc:'When you become bloodied (half HP or fewer) you regain 1 Focus Point and 1 Momentum die (once per minute).'},
      {lv:7, name:'Blood Hex', use:'passive', desc:'When a target fails its save against Blood Drain, apply a hex: Blood Puppet (forced reaction attack), Bound Blood (restrained), or Burning Blood (recurring fire damage).'},
      {lv:17, name:'Blood Frenzy', use:'passive', desc:'While bloodied, gain +20 ft speed, a third attack on the Attack action, and doubled healing from your jaeger abilities. You also gain Blood Craze (reaction, 1 FP: drop to 1 HP instead of 0 when reduced but not killed outright).'},
    ] },
  'Barbarian::Path of the Berserker':{ parent:'Barbarian', name:'Path of the Berserker', source:'5E', subclassLevel:3,
    desc:"For a Berserker, rage is a means to an end — that end being violence. Committed to the path of unbridled fury, they lose themselves to the roiling emotions of combat.",
    features:[
      {lv:3, name:'Frenzy', use:'special', desc:"When you rage, you can go into a frenzy. For its duration you can make a single melee weapon attack as a bonus action on each of your turns. When your rage ends, you suffer one level of exhaustion."},
      {lv:6, name:'Mindless Rage', use:'passive', desc:"You can't be charmed or frightened while raging. If you're charmed or frightened when you enter your rage, the effect is suspended for the duration."},
      {lv:10, name:'Intimidating Presence', use:'action', desc:"Frighten a creature within 30 ft (WIS save vs 8 + proficiency + CHA). It's frightened until the end of your next turn; use your action on later turns to extend it."},
      {lv:14, name:'Retaliation', use:'reaction', desc:"When you take damage from a creature within 5 ft of you, use your reaction to make a melee weapon attack against that creature."},
    ] },
  'Barbarian::Path of the Totem Warrior':{ parent:'Barbarian', name:'Path of the Totem Warrior', source:'5E', subclassLevel:3,
    desc:"The Totem Warrior draws on a spirit animal as guide, protector, and inspiration, blending rage with primal magic that binds them to the natural world.",
    features:[
      {lv:3, name:'Spirit Seeker', use:'passive', desc:"You can cast Beast Sense and Speak with Animals, but only as rituals."},
      {lv:3, name:'Totem Spirit', use:'passive', desc:"Choose a totem animal and gain its benefit while raging: Bear — resistance to all damage except psychic; Eagle — opportunity attacks against you have disadvantage and you can Dash as a bonus action; Wolf — allies have advantage on melee attacks against enemies within 5 ft of you."},
      {lv:6, name:'Aspect of the Beast', use:'passive', desc:"Gain a lasting benefit from a totem: Bear — double carrying capacity and advantage on Strength checks to push/pull/lift; Eagle — see up to a mile without difficulty; Wolf — track at a fast pace and move stealthily at a normal pace."},
      {lv:10, name:'Spirit Walker', use:'passive', desc:"You can cast Commune with Nature as a ritual, and the spirit you contact takes the form of your totem animal."},
      {lv:14, name:'Totemic Attunement', use:'passive', desc:"Gain a totem benefit while raging: Bear — enemies within 5 ft have disadvantage attacking creatures other than you; Eagle — gain a flying speed equal to your walking speed (falling if you end your turn aloft); Wolf — knock a Large or smaller creature prone when you hit it with a melee attack (bonus action)."},
    ] },
  'Bard::College of Lore':{ parent:'Bard', name:'College of Lore', source:'5E', subclassLevel:3,
    desc:"Bards of the College of Lore know something about most things, collecting bits of knowledge from many disciplines and using their learning to undermine the powerful.",
    features:[
      {lv:3, name:'Bonus Proficiencies', use:'passive', desc:"You gain proficiency with three skills of your choice."},
      {lv:3, name:'Cutting Words', use:'reaction', cost:'1 Bardic Inspiration', desc:"When a creature within 60 ft makes an attack roll, ability check, or damage roll, expend a Bardic Inspiration die and subtract it from the roll (before you know if it succeeds)."},
      {lv:6, name:'Additional Magical Secrets', use:'passive', desc:"Learn two spells of your choice from any class. They count as bard spells for you and don't count against the number of bard spells you know."},
      {lv:14, name:'Peerless Skill', use:'special', cost:'1 Bardic Inspiration', desc:"When you make an ability check, expend one Bardic Inspiration die and add it to the roll (you can do this after rolling but before knowing the outcome)."},
    ] },
  'Bard::College of Valor':{ parent:'Bard', name:'College of Valor', source:'5E', subclassLevel:3,
    desc:"Bards of the College of Valor are daring skalds whose tales keep alive the memory of great heroes, and by doing so inspire a new generation to reach such heights.",
    features:[
      {lv:3, name:'Bonus Proficiencies', use:'passive', desc:"You gain proficiency with medium armor, shields, and martial weapons."},
      {lv:3, name:'Combat Inspiration', use:'passive', desc:"A creature that has a Bardic Inspiration die from you can add it to a weapon damage roll, or use its reaction to add it to AC against one attack."},
      {lv:6, name:'Extra Attack', use:'passive', desc:"You can attack twice, rather than once, whenever you take the Attack action on your turn."},
      {lv:14, name:'Battle Magic', use:'bonus action', desc:"When you use your action to cast a bard spell, you can make one weapon attack as a bonus action."},
    ] },
  'Cleric::Knowledge':{ parent:'Cleric', name:'Knowledge', source:'5E', subclassLevel:1,
    desc:"The Knowledge domain values learning and understanding above all, holding that the mysteries of the multiverse are the truest source of power.",
    features:[
      {lv:1, name:'Domain Spells', use:'passive', desc:"Always prepared: L1 Command, Identify; L3 Augury, Suggestion; L5 Nondetection, Speak with Dead; L7 Arcane Eye, Confusion; L9 Legend Lore, Scrying."},
      {lv:1, name:'Blessings of Knowledge', use:'passive', desc:"Learn two languages, and gain proficiency (with double proficiency bonus) in two of Arcana, History, Nature, or Religion."},
      {lv:2, name:'Channel Divinity: Knowledge of the Ages', use:'action', cost:'1 Channel Divinity', desc:"Gain proficiency with one skill or tool of your choice for 10 minutes."},
      {lv:6, name:'Channel Divinity: Read Thoughts', use:'action', cost:'1 Channel Divinity', desc:"Read the surface thoughts of a creature within 60 ft (WIS save). On a failure you can read its thoughts for 1 minute and cast Suggestion on it with no save."},
      {lv:8, name:'Potent Spellcasting', use:'passive', desc:"Add your Wisdom modifier to the damage you deal with any cleric cantrip."},
      {lv:17, name:'Visions of the Past', use:'special', desc:"Through prayer and meditation you can call up visions of the past relating to an object you hold or your immediate surroundings."},
    ] },
  'Cleric::Life':{ parent:'Cleric', name:'Life', source:'5E', subclassLevel:1,
    desc:"The Life domain focuses on the vibrant positive energy that sustains all life. Its clerics are dedicated to healing and protecting the living.",
    features:[
      {lv:1, name:'Domain Spells', use:'passive', desc:"Always prepared: L1 Bless, Cure Wounds; L3 Lesser Restoration, Spiritual Weapon; L5 Beacon of Hope, Revivify; L7 Death Ward, Guardian of Faith; L9 Mass Cure Wounds, Raise Dead."},
      {lv:1, name:'Bonus Proficiency', use:'passive', desc:"You gain proficiency with heavy armor."},
      {lv:1, name:'Disciple of Life', use:'passive', desc:"Your healing spells of 1st level or higher restore additional hit points equal to 2 + the spell's level."},
      {lv:2, name:'Channel Divinity: Preserve Life', use:'action', cost:'1 Channel Divinity', desc:"Restore hit points equal to 5 times your cleric level, divided among creatures within 30 ft (a creature can be restored to no more than half its maximum)."},
      {lv:6, name:'Blessed Healer', use:'passive', desc:"When you cast a spell of 1st level or higher that restores hit points to another creature, you regain 2 + the spell's level hit points."},
      {lv:8, name:'Divine Strike', use:'passive', desc:"Once on each of your turns when you hit with a weapon attack, deal an extra 1d8 radiant damage (2d8 at 14th level)."},
      {lv:17, name:'Supreme Healing', use:'passive', desc:"When you would normally roll dice to restore hit points with a spell, use the highest number possible for each die instead."},
    ] },
  'Cleric::Light':{ parent:'Cleric', name:'Light', source:'5E', subclassLevel:1,
    desc:"The Light domain emphasizes the light of truth, life, and the sun. Its clerics wield fire and searing radiance to burn away darkness and deceit.",
    features:[
      {lv:1, name:'Domain Spells', use:'passive', desc:"Always prepared: L1 Burning Hands, Faerie Fire; L3 Flaming Sphere, Scorching Ray; L5 Daylight, Fireball; L7 Guardian of Faith, Wall of Fire; L9 Flame Strike, Scrying."},
      {lv:1, name:'Bonus Cantrip', use:'passive', desc:"You learn the Light cantrip if you don't already know it."},
      {lv:1, name:'Warding Flare', use:'reaction', cost:'WIS mod/long rest', desc:"When a creature within 30 ft that you can see attacks you, impose disadvantage on the attack roll by flaring bright light."},
      {lv:2, name:'Channel Divinity: Radiance of the Dawn', use:'action', cost:'1 Channel Divinity', desc:"Dispel any magical darkness within 30 ft, and deal 2d10 + cleric level radiant damage to each hostile creature there (CON save for half)."},
      {lv:6, name:'Improved Flare', use:'passive', desc:"You can use Warding Flare when another creature within 30 ft of you is attacked, not just when you are."},
      {lv:8, name:'Potent Spellcasting', use:'passive', desc:"Add your Wisdom modifier to the damage you deal with any cleric cantrip."},
      {lv:17, name:'Corona of Light', use:'action', desc:"Emit an aura of sunlight for 1 minute. Enemies in the bright light have disadvantage on saves against spells that deal fire or radiant damage."},
    ] },
  'Cleric::Nature':{ parent:'Cleric', name:'Nature', source:'5E', subclassLevel:1,
    desc:"The Nature domain is served by clerics who revere the gods of the wild, tending the balance of the natural world and channeling its primal power.",
    features:[
      {lv:1, name:'Domain Spells', use:'passive', desc:"Always prepared: L1 Animal Friendship, Speak with Animals; L3 Barkskin, Spike Growth; L5 Plant Growth, Wind Wall; L7 Dominate Beast, Grasping Vine; L9 Insect Plague, Tree Stride."},
      {lv:1, name:'Acolyte of Nature', use:'passive', desc:"Learn one druid cantrip, and gain proficiency in one of Animal Handling, Nature, or Survival."},
      {lv:1, name:'Bonus Proficiency', use:'passive', desc:"You gain proficiency with heavy armor."},
      {lv:2, name:'Channel Divinity: Charm Animals and Plants', use:'action', cost:'1 Channel Divinity', desc:"Charm beasts and plants within 30 ft (WIS save) for 1 minute or until they take damage."},
      {lv:6, name:'Dampen Elements', use:'reaction', desc:"When you or a creature within 30 ft takes acid, cold, fire, lightning, or thunder damage, grant resistance to that instance of damage."},
      {lv:8, name:'Divine Strike', use:'passive', desc:"Once on each of your turns when you hit with a weapon attack, deal an extra 1d8 cold, fire, or lightning damage (2d8 at 14th level)."},
      {lv:17, name:'Master of Nature', use:'passive', desc:"You can command creatures charmed by your Charm Animals and Plants as a bonus action."},
    ] },
  'Cleric::Tempest':{ parent:'Cleric', name:'Tempest', source:'5E', subclassLevel:1,
    desc:"The Tempest domain governs storm, sea, and sky. Its clerics call down thunder and lightning to smite their foes and inspire awe.",
    features:[
      {lv:1, name:'Domain Spells', use:'passive', desc:"Always prepared: L1 Fog Cloud, Thunderwave; L3 Gust of Wind, Shatter; L5 Call Lightning, Sleet Storm; L7 Control Water, Ice Storm; L9 Destructive Wave, Insect Plague."},
      {lv:1, name:'Bonus Proficiencies', use:'passive', desc:"You gain proficiency with martial weapons and heavy armor."},
      {lv:1, name:'Wrath of the Storm', use:'reaction', cost:'WIS mod/long rest', desc:"When a creature within 5 ft hits you, deal 2d8 lightning or thunder damage to it (DEX save for half)."},
      {lv:2, name:'Channel Divinity: Destructive Wrath', use:'special', cost:'1 Channel Divinity', desc:"When you roll lightning or thunder damage, deal maximum damage instead of rolling."},
      {lv:6, name:'Thunderbolt Strike', use:'passive', desc:"When you deal lightning damage to a Large or smaller creature, you can push it up to 10 ft away."},
      {lv:8, name:'Divine Strike', use:'passive', desc:"Once on each of your turns when you hit with a weapon attack, deal an extra 1d8 thunder damage (2d8 at 14th level)."},
      {lv:17, name:'Stormborn', use:'passive', desc:"You have a flying speed equal to your walking speed whenever you are not underground or indoors."},
    ] },
  'Cleric::Trickery':{ parent:'Cleric', name:'Trickery', source:'5E', subclassLevel:1,
    desc:"The Trickery domain serves gods of mischief and misdirection. Its clerics are a disruptive force, champions of the downtrodden who upend the established order.",
    features:[
      {lv:1, name:'Domain Spells', use:'passive', desc:"Always prepared: L1 Charm Person, Disguise Self; L3 Mirror Image, Pass without Trace; L5 Blink, Dispel Magic; L7 Dimension Door, Polymorph; L9 Dominate Person, Modify Memory."},
      {lv:1, name:'Blessing of the Trickster', use:'action', desc:"Touch a willing creature to give it advantage on Dexterity (Stealth) checks for 1 hour."},
      {lv:2, name:'Channel Divinity: Invoke Duplicity', use:'action', cost:'1 Channel Divinity', desc:"Create an illusory duplicate of yourself for 1 minute (move it up to 30 ft as a bonus action). You can cast spells as though from its space and gain advantage on attacks when both you and it are within 5 ft of the target."},
      {lv:6, name:'Channel Divinity: Cloak of Shadows', use:'action', cost:'1 Channel Divinity', desc:"Become invisible until the end of your next turn, until you attack, or until you cast a spell."},
      {lv:8, name:'Divine Strike', use:'passive', desc:"Once on each of your turns when you hit with a weapon attack, deal an extra 1d8 poison damage (2d8 at 14th level)."},
      {lv:17, name:'Improved Duplicity', use:'passive', desc:"Your Invoke Duplicity can create up to four illusory duplicates at once."},
    ] },
  'Cleric::War':{ parent:'Cleric', name:'War', source:'5E', subclassLevel:1,
    desc:"The War domain inspires the courage of soldiers and champions. Its clerics are skilled combatants who share their gods' martial prowess.",
    features:[
      {lv:1, name:'Domain Spells', use:'passive', desc:"Always prepared: L1 Divine Favor, Shield of Faith; L3 Magic Weapon, Spiritual Weapon; L5 Crusader's Mantle, Spirit Guardians; L7 Freedom of Movement, Stoneskin; L9 Flame Strike, Hold Monster."},
      {lv:1, name:'Bonus Proficiencies', use:'passive', desc:"You gain proficiency with martial weapons and heavy armor."},
      {lv:1, name:'War Priest', use:'bonus action', cost:'WIS mod/long rest', desc:"When you take the Attack action, you can make one weapon attack as a bonus action."},
      {lv:2, name:'Channel Divinity: Guided Strike', use:'special', cost:'1 Channel Divinity', desc:"Gain a +10 bonus to an attack roll (you can do this after you see the roll but before it hits or misses)."},
      {lv:6, name:"Channel Divinity: War God's Blessing", use:'reaction', cost:'1 Channel Divinity', desc:"When a creature within 30 ft makes an attack roll, grant it a +10 bonus to the roll."},
      {lv:8, name:'Divine Strike', use:'passive', desc:"Once on each of your turns when you hit with a weapon attack, deal an extra 1d8 damage of the weapon's type (2d8 at 14th level)."},
      {lv:17, name:'Avatar of Battle', use:'passive', desc:"You gain resistance to bludgeoning, piercing, and slashing damage from nonmagical weapons."},
    ] },
  'Druid::Circle of the Land':{ parent:'Druid', name:'Circle of the Land', source:'5E', subclassLevel:2,
    desc:"The Circle of the Land is made up of mystics and sages who safeguard ancient knowledge and rites, drawing on the magic tied to a particular land.",
    features:[
      {lv:2, name:'Bonus Cantrip', use:'passive', desc:"You learn one additional druid cantrip of your choice."},
      {lv:2, name:'Natural Recovery', use:'special', cost:'1/day', desc:"During a short rest, recover expended spell slots with a combined level up to half your druid level (rounded up), none of 6th level or higher."},
      {lv:3, name:'Circle Spells', use:'passive', desc:"Choose a land type (arctic, coast, desert, forest, grassland, mountain, swamp, or Underdark) to gain always-prepared circle spells at druid levels 3, 5, 7, and 9."},
      {lv:6, name:"Land's Stride", use:'passive', desc:"Moving through nonmagical difficult terrain costs no extra movement, and you have advantage on saves against plants magically created to impede movement."},
      {lv:10, name:"Nature's Ward", use:'passive', desc:"You can't be charmed or frightened by elementals or fey, and you're immune to poison and disease."},
      {lv:14, name:"Nature's Sanctuary", use:'passive', desc:"When a beast or plant creature attacks you, it must make a WIS save (vs your spell DC) or choose a different target."},
    ] },
  'Druid::Circle of the Moon':{ parent:'Druid', name:'Circle of the Moon', source:'5E', subclassLevel:2,
    desc:"Druids of the Circle of the Moon are fierce guardians of the wilds who harness the moon's mystic power to take on the most dangerous animal forms.",
    features:[
      {lv:2, name:'Combat Wild Shape', use:'bonus action', desc:"You can use Wild Shape as a bonus action. While transformed, you can use a bonus action to expend a spell slot and regain 1d8 hit points per slot level."},
      {lv:2, name:'Circle Forms', use:'passive', desc:"You can Wild Shape into beasts with a challenge rating as high as 1 (rising to CR = druid level / 3 at higher levels)."},
      {lv:6, name:'Primal Strike', use:'passive', desc:"Your attacks in beast form count as magical for overcoming resistance and immunity to nonmagical attacks."},
      {lv:10, name:'Elemental Wild Shape', use:'special', desc:"You can expend two uses of Wild Shape at once to transform into an air, earth, fire, or water elemental."},
      {lv:14, name:'Thousand Forms', use:'passive', desc:"You can cast Alter Self at will."},
    ] },
  'Fighter::Champion':{ parent:'Fighter', name:'Champion', source:'5E', subclassLevel:3,
    desc:"The Champion focuses on the development of raw physical power honed to deadly perfection, with a simple, direct approach to combat.",
    features:[
      {lv:3, name:'Improved Critical', use:'passive', desc:"Your weapon attacks score a critical hit on a roll of 19 or 20."},
      {lv:7, name:'Remarkable Athlete', use:'passive', desc:"Add half your proficiency bonus (rounded up) to any STR, DEX, or CON check you're not already proficient in, and your running long jump distance increases by feet equal to your STR modifier."},
      {lv:10, name:'Additional Fighting Style', use:'passive', desc:"You can choose a second option from the Fighting Style class feature."},
      {lv:15, name:'Superior Critical', use:'passive', desc:"Your weapon attacks score a critical hit on a roll of 18–20."},
      {lv:18, name:'Survivor', use:'passive', desc:"At the start of each of your turns, regain hit points equal to 5 + your CON modifier if you have no more than half your hit points left (and at least 1)."},
    ] },
  'Fighter::Battle Master':{ parent:'Fighter', name:'Battle Master', source:'5E', subclassLevel:3,
    desc:"Battle Masters are students of the martial arts, employing techniques passed down through generations to control the battlefield and outmaneuver their foes.",
    features:[
      {lv:3, name:'Combat Superiority', use:'special', cost:'superiority dice', desc:"You learn maneuvers fueled by superiority dice (start with four maneuvers and four d8s; dice grow to d10 at 10th and d12 at 18th, refreshing on a short or long rest). Maneuvers add effects such as extra damage, trips, and ripostes to your attacks."},
      {lv:3, name:'Student of War', use:'passive', desc:"You gain proficiency with one type of artisan's tools of your choice."},
      {lv:7, name:'Know Your Enemy', use:'passive', desc:"If you study a creature for 1 minute outside combat, you learn how its capabilities compare to your own (for two chosen categories)."},
      {lv:10, name:'Improved Combat Superiority', use:'passive', desc:"Your superiority dice turn into d10s (and you know additional maneuvers and gain more dice)."},
      {lv:15, name:'Relentless', use:'passive', desc:"When you roll initiative and have no superiority dice remaining, you regain one superiority die."},
      {lv:18, name:'Improved Combat Superiority', use:'passive', desc:"Your superiority dice turn into d12s."},
    ] },
  'Fighter::Eldritch Knight':{ parent:'Fighter', name:'Eldritch Knight', source:'5E', subclassLevel:3,
    desc:"The Eldritch Knight combines martial mastery with the study of magic, using wizard spells of abjuration and evocation to support their weapon work.",
    features:[
      {lv:3, name:'Spellcasting', use:'passive', desc:"You learn wizard spells (Intelligence-based), drawn mostly from the abjuration and evocation schools, with cantrips and spell slots per the Eldritch Knight table."},
      {lv:3, name:'Weapon Bond', use:'passive', desc:"Bond with up to two weapons. You can't be disarmed of a bonded weapon while conscious, and you can summon it to your hand as a bonus action if it's on the same plane."},
      {lv:7, name:'War Magic', use:'bonus action', desc:"When you use your action to cast a cantrip, you can make one weapon attack as a bonus action."},
      {lv:10, name:'Eldritch Strike', use:'passive', desc:"When you hit a creature with a weapon attack, it has disadvantage on the next saving throw it makes against a spell you cast before the end of your next turn."},
      {lv:15, name:'Arcane Charge', use:'passive', desc:"When you use Action Surge, you can teleport up to 30 ft to an unoccupied space you can see, before or after the extra action."},
      {lv:18, name:'Improved War Magic', use:'bonus action', desc:"When you use your action to cast a spell, you can make one weapon attack as a bonus action."},
    ] },
  'Monk::Way of the Open Hand':{ parent:'Monk', name:'Way of the Open Hand', source:'5E', subclassLevel:3,
    desc:"Monks of the Way of the Open Hand are the ultimate masters of unarmed combat, manipulating a foe's ki and body to devastating effect.",
    features:[
      {lv:3, name:'Open Hand Technique', use:'passive', desc:"When you hit with a Flurry of Blows attack, you can impose one effect: knock the target prone (DEX save), push it 15 ft (STR save), or deny it reactions until the end of your next turn."},
      {lv:6, name:'Wholeness of Body', use:'action', cost:'1/long rest', desc:"You can heal yourself for hit points equal to three times your monk level."},
      {lv:11, name:'Tranquility', use:'passive', desc:"At the end of a long rest, you gain the effect of a Sanctuary spell (DC 8 + WIS + proficiency) that lasts until the start of your next long rest."},
      {lv:17, name:'Quivering Palm', use:'special', cost:'3 ki', desc:"When you hit a creature with an unarmed strike, you can set up lethal vibrations. Later, use an action to end them: the target makes a CON save, dropping to 0 HP on a failure or taking 10d10 necrotic damage on a success."},
    ] },
  'Monk::Way of Shadow':{ parent:'Monk', name:'Way of Shadow', source:'5E', subclassLevel:3,
    desc:"Monks of the Way of Shadow follow a tradition that values stealth and subterfuge, practicing ninja-like arts to move unseen and strike from darkness.",
    features:[
      {lv:3, name:'Shadow Arts', use:'special', cost:'2 ki', desc:"You can spend ki to cast Darkness, Darkvision, Pass without Trace, or Silence, and you learn the Minor Illusion cantrip."},
      {lv:6, name:'Shadow Step', use:'bonus action', desc:"When you're in dim light or darkness, teleport up to 60 ft to an unoccupied space in dim light or darkness, then gain advantage on the first melee attack you make before the end of the turn."},
      {lv:11, name:'Cloak of Shadows', use:'action', desc:"When in dim light or darkness, become invisible until you attack, cast a spell, or move into bright light."},
      {lv:17, name:'Opportunist', use:'reaction', desc:"When a creature within 5 ft of you is hit by an attack from a creature other than you, make a melee attack against that creature."},
    ] },
  'Monk::Way of the Four Elements':{ parent:'Monk', name:'Way of the Four Elements', source:'5E', subclassLevel:3,
    desc:"Monks of the Way of the Four Elements harmonize their ki with the elemental forces of the world, channeling them to mimic the effects of elemental magic.",
    features:[
      {lv:3, name:'Disciple of the Elements', use:'special', cost:'ki', desc:"You learn Elemental Disciplines that let you spend ki to create elemental effects, starting with Elemental Attunement plus one discipline of your choice."},
      {lv:6, name:'Additional Discipline', use:'passive', desc:"You learn an additional Elemental Discipline of your choice."},
      {lv:11, name:'Additional Discipline', use:'passive', desc:"You learn another Elemental Discipline and can spend ki to fuel higher-level elemental effects."},
      {lv:17, name:'Additional Discipline', use:'passive', desc:"You learn another Elemental Discipline, including access to the most powerful elemental effects."},
    ] },
  'Paladin::Oath of Devotion':{ parent:'Paladin', name:'Oath of Devotion', source:'5E', subclassLevel:3,
    desc:"The Oath of Devotion binds a paladin to the loftiest ideals of justice, virtue, and order — the shining knight who upholds honesty, courage, and compassion.",
    features:[
      {lv:3, name:'Oath Spells', use:'passive', desc:"Always prepared: L3 Protection from Evil and Good, Sanctuary; L5 Lesser Restoration, Zone of Truth; L9 Beacon of Hope, Dispel Magic; L13 Freedom of Movement, Guardian of Faith; L17 Commune, Flame Strike."},
      {lv:3, name:'Channel Divinity: Sacred Weapon', use:'action', cost:'1 Channel Divinity', desc:"For 1 minute, add your CHA modifier to attack rolls with one weapon, which emits bright light and counts as magical."},
      {lv:3, name:'Channel Divinity: Turn the Unholy', use:'action', cost:'1 Channel Divinity', desc:"Each fiend and undead within 30 ft must make a WIS save or be turned for 1 minute."},
      {lv:7, name:'Aura of Devotion', use:'passive', desc:"You and friendly creatures within 10 ft (30 ft at 18th) can't be charmed while you're conscious."},
      {lv:15, name:'Purity of Spirit', use:'passive', desc:"You are always under the effects of a Protection from Evil and Good spell."},
      {lv:20, name:'Holy Nimbus', use:'action', cost:'1/long rest', desc:"For 1 minute, emit bright sunlight; enemies that start their turn within 30 ft take 10 radiant damage, and you have advantage on saves against spells cast by fiends and undead."},
    ] },
  'Paladin::Oath of the Ancients':{ parent:'Paladin', name:'Oath of the Ancients', source:'5E', subclassLevel:3,
    desc:"The Oath of the Ancients is as old as the race of elves, calling on the light in the world and the preservation of life, love, joy, and beauty against the darkness.",
    features:[
      {lv:3, name:'Oath Spells', use:'passive', desc:"Always prepared: L3 Ensnaring Strike, Speak with Animals; L5 Misty Step, Moonbeam; L9 Plant Growth, Protection from Energy; L13 Ice Storm, Stoneskin; L17 Commune with Nature, Tree Stride."},
      {lv:3, name:"Channel Divinity: Nature's Wrath", use:'action', cost:'1 Channel Divinity', desc:"Spectral vines restrain a creature within 10 ft (it's restrained until it succeeds on a STR or DEX save)."},
      {lv:3, name:'Channel Divinity: Turn the Faithless', use:'action', cost:'1 Channel Divinity', desc:"Each fey and fiend within 30 ft must make a WIS save or be turned for 1 minute."},
      {lv:7, name:'Aura of Warding', use:'passive', desc:"You and friendly creatures within 10 ft (30 ft at 18th) have resistance to damage from spells."},
      {lv:15, name:'Undying Sentinel', use:'passive', desc:"When reduced to 0 HP but not killed outright, you can drop to 1 HP instead (once per long rest). You also no longer age and can't be aged magically."},
      {lv:20, name:'Elder Champion', use:'action', cost:'1/long rest', desc:"For 1 minute: regain 10 HP at the start of each turn, cast paladin spells as a bonus action, and enemies within 10 ft have disadvantage on saves against your spells and Channel Divinity."},
    ] },
  'Paladin::Oath of Vengeance':{ parent:'Paladin', name:'Oath of Vengeance', source:'5E', subclassLevel:3,
    desc:"The Oath of Vengeance is a solemn commitment to punish those who have committed grievous sins — the dark knight or self-appointed avenger who will pay any price to see wrongs righted.",
    features:[
      {lv:3, name:'Oath Spells', use:'passive', desc:"Always prepared: L3 Bane, Hunter's Mark; L5 Hold Person, Misty Step; L9 Haste, Protection from Energy; L13 Banishment, Dimension Door; L17 Hold Monster, Scrying."},
      {lv:3, name:'Channel Divinity: Abjure Enemy', use:'action', cost:'1 Channel Divinity', desc:"One creature within 60 ft must make a WIS save or be frightened for 1 minute; its speed is reduced to 0 while frightened this way (halved on a success)."},
      {lv:3, name:'Channel Divinity: Vow of Enmity', use:'bonus action', cost:'1 Channel Divinity', desc:"Gain advantage on attack rolls against one creature within 10 ft for 1 minute or until it drops to 0 HP."},
      {lv:7, name:'Relentless Avenger', use:'passive', desc:"When you hit a creature with an opportunity attack, you can move up to half your speed immediately without provoking opportunity attacks."},
      {lv:15, name:'Soul of Vengeance', use:'reaction', desc:"When a creature under your Vow of Enmity makes an attack, use your reaction to make a melee attack against it."},
      {lv:20, name:'Avenging Angel', use:'action', cost:'1/long rest', desc:"For 1 hour, gain a 60-ft flying speed and an aura that frightens enemies within 30 ft (WIS save)."},
    ] },
  'Ranger::Hunter':{ parent:'Ranger', name:'Hunter', source:'5E', subclassLevel:3,
    desc:"The Hunter accepts the role of a protector, learning specialized techniques to fight the threats that menace civilization — from rampaging ogres to hordes of orcs.",
    features:[
      {lv:3, name:"Hunter's Prey", use:'passive', desc:"Choose one: Colossus Slayer (once per turn, +1d8 to a hit against a creature below its HP maximum), Giant Killer (react to attack a Large+ creature that attacks you), or Horde Breaker (once per turn, attack a second creature within 5 ft of the first)."},
      {lv:7, name:'Defensive Tactics', use:'passive', desc:"Choose one: Escape the Horde (opportunity attacks against you have disadvantage), Multiattack Defense (+4 AC vs a creature's follow-up attacks), or Steel Will (advantage on saves vs being frightened)."},
      {lv:11, name:'Multiattack', use:'passive', desc:"Choose one: Volley (make a ranged attack against any number of creatures in a 10-ft radius) or Whirlwind Attack (make a melee attack against any number of creatures within 5 ft)."},
      {lv:15, name:"Superior Hunter's Defense", use:'passive', desc:"Choose one: Evasion, Stand Against the Tide (redirect a missed melee attack to another creature), or Uncanny Dodge."},
    ] },
  'Ranger::Beast Master':{ parent:'Ranger', name:'Beast Master', source:'5E', subclassLevel:3,
    desc:"The Beast Master embodies a friendship between the civilized races and the beasts of the world, bonding with an animal companion that fights at their side.",
    features:[
      {lv:3, name:"Ranger's Companion", use:'passive', desc:"Gain a beast companion of CR 1/4 or lower (Small or Medium). It acts on your initiative, adds your proficiency bonus to its AC, attacks, and damage, and obeys your commands."},
      {lv:7, name:'Exceptional Training', use:'bonus action', desc:"On any turn your companion doesn't attack, you can command it to Dash, Disengage, Dodge, or Help as a bonus action. Its attacks also count as magical."},
      {lv:11, name:'Bestial Fury', use:'passive', desc:"When you command your companion to take the Attack action, it can make two attacks."},
      {lv:15, name:'Share Spells', use:'passive', desc:"When you cast a spell targeting yourself, you can also affect your companion if it's within 30 ft."},
    ] },
  'Rogue::Thief':{ parent:'Rogue', name:'Thief', source:'5E', subclassLevel:3,
    desc:"The Thief hones skills in the larcenous and adventurous arts, gaining agility, stealth, and a knack for getting out of tight spots.",
    features:[
      {lv:3, name:'Fast Hands', use:'bonus action', desc:"You can use your Cunning Action bonus action to make a Sleight of Hand check, use thieves' tools to disarm a trap or open a lock, or use an object."},
      {lv:3, name:'Second-Story Work', use:'passive', desc:"Climbing no longer costs extra movement, and your running jump distance is measured using your DEX modifier instead of STR."},
      {lv:9, name:'Supreme Sneak', use:'passive', desc:"You have advantage on Dexterity (Stealth) checks on any turn you move no more than half your speed."},
      {lv:13, name:'Use Magic Device', use:'passive', desc:"You ignore all class, race, and level requirements on the use of magic items."},
      {lv:17, name:"Thief's Reflexes", use:'passive', desc:"You can take two turns during the first round of any combat (at your normal initiative and again at your initiative minus 10)."},
    ] },
  'Rogue::Assassin':{ parent:'Rogue', name:'Assassin', source:'5E', subclassLevel:3,
    desc:"The Assassin focuses on the grim art of death, using disguise, poison, and lethal ambush to eliminate targets with ruthless efficiency.",
    features:[
      {lv:3, name:'Bonus Proficiencies', use:'passive', desc:"You gain proficiency with the disguise kit and the poisoner's kit."},
      {lv:3, name:'Assassinate', use:'passive', desc:"You have advantage on attacks against any creature that hasn't taken a turn yet in combat, and any hit you score against a surprised creature is a critical hit."},
      {lv:9, name:'Infiltration Expertise', use:'passive', desc:"With 25 gp and seven days of work, you can create a false identity complete with documentation and established acquaintances."},
      {lv:13, name:'Impostor', use:'passive', desc:"You can unerringly mimic another creature's speech, writing, and behavior after studying it for at least 3 hours."},
      {lv:17, name:'Death Strike', use:'passive', desc:"When you attack and hit a surprised creature, it must make a CON save (DC 8 + DEX + proficiency) or take double damage from the attack."},
    ] },
  'Rogue::Arcane Trickster':{ parent:'Rogue', name:'Arcane Trickster', source:'5E', subclassLevel:3,
    desc:"The Arcane Trickster enhances stealth and agility with magic, learning enchantment and illusion spells to deceive and confound.",
    features:[
      {lv:3, name:'Spellcasting', use:'passive', desc:"You learn wizard spells (Intelligence-based), drawn mostly from the enchantment and illusion schools, with cantrips and spell slots per the Arcane Trickster table (you always know Mage Hand)."},
      {lv:3, name:'Mage Hand Legerdemain', use:'passive', desc:"Your Mage Hand is invisible, and you can use it to perform Sleight of Hand tasks such as stowing/retrieving objects, picking locks, and disarming traps at range."},
      {lv:9, name:'Magical Ambush', use:'passive', desc:"If you're hidden from a creature when you cast a spell on it, it has disadvantage on any saving throw it makes against the spell this turn."},
      {lv:13, name:'Versatile Trickster', use:'bonus action', desc:"You can use your Mage Hand to distract a creature within 5 ft of the hand, gaining advantage on attack rolls against that creature until the end of the turn."},
      {lv:17, name:'Spell Thief', use:'reaction', cost:'1/long rest', desc:"When a creature casts a spell targeting you or including you, force it to make a save; on a failure you negate the spell and steal knowledge of it for 8 hours."},
    ] },
  'Sorcerer::Draconic Bloodline':{ parent:'Sorcerer', name:'Draconic Bloodline', source:'5E', subclassLevel:1,
    desc:"Your innate magic comes from draconic blood in your veins. Most often a distant ancestor was a dragon, and its power flickers in your bloodline.",
    features:[
      {lv:1, name:'Dragon Ancestor', use:'passive', desc:"Choose a type of dragon as your ancestor, which sets your associated damage type. You can speak, read, and write Draconic and double your proficiency bonus on CHA checks when interacting with dragons."},
      {lv:1, name:'Draconic Resilience', use:'passive', desc:"Your hit point maximum increases by 1 per sorcerer level, and when you aren't wearing armor your AC equals 13 + your DEX modifier."},
      {lv:6, name:'Elemental Affinity', use:'passive', desc:"When you cast a spell that deals your ancestry's damage type, add your CHA modifier to one damage roll. You can also spend 1 sorcery point to gain resistance to that damage type for 1 hour."},
      {lv:14, name:'Dragon Wings', use:'bonus action', desc:"You can sprout draconic wings, gaining a flying speed equal to your current speed (while you aren't wearing armor that lacks accommodation for wings)."},
      {lv:18, name:'Draconic Presence', use:'action', cost:'5 sorcery points', desc:"Radiate an aura of awe or fear to 60 ft for 1 minute; each hostile creature that starts its turn there must make a WIS save or be charmed or frightened."},
    ] },
  'Sorcerer::Wild Magic':{ parent:'Sorcerer', name:'Wild Magic', source:'5E', subclassLevel:1,
    desc:"Your innate magic comes from the wild forces of chaos that underlie the order of creation, leaving you with unpredictable surges of raw power.",
    features:[
      {lv:1, name:'Wild Magic Surge', use:'special', desc:"Once per turn after you cast a sorcerer spell of 1st level or higher, the DM can have you roll on the Wild Magic Surge table for a random magical effect."},
      {lv:1, name:'Tides of Chaos', use:'special', cost:'1/long rest', desc:"Gain advantage on one attack roll, ability check, or saving throw. You regain the use when the DM has you roll on the Wild Magic Surge table."},
      {lv:6, name:'Bend Luck', use:'reaction', cost:'2 sorcery points', desc:"When another creature makes an attack roll, ability check, or saving throw, roll 1d4 and apply it as a bonus or penalty to that roll."},
      {lv:14, name:'Controlled Chaos', use:'passive', desc:"Whenever you roll on the Wild Magic Surge table, you can roll twice and use either result."},
      {lv:18, name:'Spell Bombardment', use:'passive', desc:"When you roll damage for a spell and roll the highest number possible on any of the dice, choose one of those dice, roll it again, and add it to the damage (once per turn)."},
    ] },
  'Warlock::The Archfey':{ parent:'Warlock', name:'The Archfey', source:'5E', subclassLevel:1,
    desc:"Your patron is a lord or lady of the fey, a creature of legend whose motives are often inscrutable. Ancient and coldly calculating, they cloak their aims in beauty and whimsy.",
    features:[
      {lv:1, name:'Expanded Spell List', use:'passive', desc:"You can choose from additional spells: L1 Faerie Fire, Sleep; L2 Calm Emotions, Phantasmal Force; L3 Blink, Plant Growth; L4 Dominate Beast, Greater Invisibility; L5 Dominate Person, Seeming."},
      {lv:1, name:'Fey Presence', use:'action', cost:'1/short rest', desc:"Each creature in a 10-ft cube around you must make a WIS save or be charmed or frightened (your choice) until the end of your next turn."},
      {lv:6, name:'Misty Escape', use:'reaction', cost:'1/short rest', desc:"When you take damage, turn invisible and teleport up to 60 ft to a space you can see; you stay invisible until the end of your next turn or until you attack or cast a spell."},
      {lv:10, name:'Beguiling Defenses', use:'passive', desc:"You are immune to being charmed, and when a creature tries to charm you, you can turn the attempt back on it (WIS save or 1 minute of psychic damage each turn)."},
      {lv:14, name:'Dark Delirium', use:'action', cost:'1/long rest', desc:"Send a creature within 60 ft into an illusory realm (WIS save); for 1 minute it's charmed or frightened, and you can end it early to deal 5d10 psychic damage."},
    ] },
  'Warlock::The Fiend':{ parent:'Warlock', name:'The Fiend', source:'5E', subclassLevel:1,
    desc:"You have made a pact with a fiend from the lower planes, a being whose aims are evil even if you strive against those goals. Such patrons desire the corruption or destruction of all things.",
    features:[
      {lv:1, name:'Expanded Spell List', use:'passive', desc:"You can choose from additional spells: L1 Burning Hands, Command; L2 Blindness/Deafness, Scorching Ray; L3 Fireball, Stinking Cloud; L4 Fire Shield, Wall of Fire; L5 Flame Strike, Hallow."},
      {lv:1, name:"Dark One's Blessing", use:'passive', desc:"When you reduce a hostile creature to 0 HP, you gain temporary hit points equal to your CHA modifier + your warlock level (minimum 1)."},
      {lv:6, name:"Dark One's Own Luck", use:'special', cost:'1/short rest', desc:"Add 1d10 to one ability check or saving throw (you can do this after rolling but before the outcome is determined)."},
      {lv:10, name:'Fiendish Resilience', use:'passive', desc:"After a short or long rest, choose one damage type to gain resistance to (except from magical or silvered weapons) until you choose a different one."},
      {lv:14, name:'Hurl Through Hell', use:'special', cost:'1/long rest', desc:"When you hit a creature with an attack, you can instantly transport it through the lower planes; unless it's a fiend, it takes 10d10 psychic damage as it reels from the experience."},
    ] },
  'Warlock::The Great Old One':{ parent:'Warlock', name:'The Great Old One', source:'5E', subclassLevel:1,
    desc:"Your patron is a mysterious entity from the Far Realm or beyond, whose nature is utterly alien. Its mind is unfathomable, and it may be unaware of your existence — yet its secrets flow to you.",
    features:[
      {lv:1, name:'Expanded Spell List', use:'passive', desc:"You can choose from additional spells: L1 Dissonant Whispers, Tasha's Hideous Laughter; L2 Detect Thoughts, Phantasmal Force; L3 Clairvoyance, Sending; L4 Dominate Beast, Evard's Black Tentacles; L5 Dominate Person, Telekinesis."},
      {lv:1, name:'Awakened Mind', use:'passive', desc:"You can telepathically speak to any creature within 30 ft that you can see, as long as it understands at least one language."},
      {lv:6, name:'Entropic Ward', use:'reaction', cost:'1/short rest', desc:"When a creature attacks you, impose disadvantage on that attack roll; if it misses, you gain advantage on your next attack against that creature before the end of your next turn."},
      {lv:10, name:'Thought Shield', use:'passive', desc:"Your thoughts can't be read unless you allow it, you have resistance to psychic damage, and any creature that deals psychic damage to you takes the same amount."},
      {lv:14, name:'Create Thrall', use:'action', desc:"Touch an incapacitated humanoid to charm it until Remove Curse is cast on it, it's no longer on the same plane, or you use this again; you can communicate with it telepathically over any distance on the same plane."},
    ] },
  'Wizard::Abjuration':{ parent:'Wizard', name:'Abjuration', source:'5E', subclassLevel:2,
    desc:"The School of Abjuration emphasizes magic that blocks, banishes, or protects. Its specialists — abjurers — are sought as guardians and dispellers of hostile magic.",
    features:[
      {lv:2, name:'Abjuration Savant', use:'passive', desc:"The gold and time you spend to copy an abjuration spell into your spellbook is halved."},
      {lv:2, name:'Arcane Ward', use:'passive', desc:"When you cast an abjuration spell of 1st level or higher, create a magical ward (HP = twice your wizard level + INT modifier) that absorbs damage you take until it's depleted; abjuration spells recharge it."},
      {lv:6, name:'Projected Ward', use:'reaction', desc:"When a creature within 30 ft takes damage, you can use your Arcane Ward to absorb that damage instead."},
      {lv:10, name:'Improved Abjuration', use:'passive', desc:"When you cast an abjuration spell that requires an ability check as part of casting (such as Counterspell or Dispel Magic), add your proficiency bonus to that check."},
      {lv:14, name:'Spell Resistance', use:'passive', desc:"You have advantage on saving throws against spells, and resistance to damage from spells."},
    ] },
  'Wizard::Conjuration':{ parent:'Wizard', name:'Conjuration', source:'5E', subclassLevel:2,
    desc:"The School of Conjuration produces objects and creatures out of thin air, and transports things across great distances. Conjurers are prized for their versatility.",
    features:[
      {lv:2, name:'Conjuration Savant', use:'passive', desc:"The gold and time you spend to copy a conjuration spell into your spellbook is halved."},
      {lv:2, name:'Minor Conjuration', use:'action', desc:"Conjure an inanimate object (up to 3 ft on a side and 10 lb) in your hand or on the ground; it lasts 1 hour or until it takes damage."},
      {lv:6, name:'Benign Transposition', use:'action', cost:'1/day', desc:"Teleport up to 30 ft to an unoccupied space you can see, or swap places with a willing Small or Medium creature within range. Recharges when you cast a conjuration spell of 1st level or higher."},
      {lv:10, name:'Focused Conjuration', use:'passive', desc:"Your concentration on a conjuration spell can't be broken as a result of taking damage."},
      {lv:14, name:'Durable Summons', use:'passive', desc:"Any creature you summon or create with a conjuration spell gains 30 temporary hit points."},
    ] },
  'Wizard::Divination':{ parent:'Wizard', name:'Divination', source:'5E', subclassLevel:2,
    desc:"The School of Divination grants the ability to glimpse the future, uncover the truth, and peer beyond the veil. Diviners are valued for their counsel and foresight.",
    features:[
      {lv:2, name:'Divination Savant', use:'passive', desc:"The gold and time you spend to copy a divination spell into your spellbook is halved."},
      {lv:2, name:'Portent', use:'special', cost:'2/long rest', desc:"After a long rest, roll two d20s and record them. You can replace any attack roll, saving throw, or ability check made by you or a creature you can see with one of these rolls."},
      {lv:6, name:'Expert Divination', use:'passive', desc:"When you cast a divination spell of 2nd level or higher using a spell slot, you regain one expended spell slot of a lower level (max 5th)."},
      {lv:10, name:'The Third Eye', use:'action', desc:"After a rest, use an action to gain one benefit until your next rest: darkvision 60 ft, ethereal sight 60 ft, greater comprehension (read any language), or see invisibility 10 ft."},
      {lv:14, name:'Greater Portent', use:'passive', desc:"You roll three d20s for your Portent feature, rather than two."},
    ] },
  'Wizard::Enchantment':{ parent:'Wizard', name:'Enchantment', source:'5E', subclassLevel:2,
    desc:"The School of Enchantment shapes the minds of others, charming and beguiling. Enchanters make thralls of enemies and turn foes into friends.",
    features:[
      {lv:2, name:'Enchantment Savant', use:'passive', desc:"The gold and time you spend to copy an enchantment spell into your spellbook is halved."},
      {lv:2, name:'Hypnotic Gaze', use:'action', desc:"Charm a creature within 5 ft (WIS save); it's charmed and incapacitated until the end of your next turn, and you can sustain the effect each turn."},
      {lv:6, name:'Instinctive Charm', use:'reaction', cost:'1/day', desc:"When a creature within 30 ft attacks you, redirect the attack to another creature within range (WIS save). Recharges when you cast an enchantment spell of 1st level or higher."},
      {lv:10, name:'Split Enchantment', use:'passive', desc:"When you cast an enchantment spell that targets only one creature, you can have it target a second creature."},
      {lv:14, name:'Alter Memories', use:'passive', desc:"When your enchantment spell ends, you can make the creature unaware it was charmed and cause it to forget up to 1 + your CHA modifier hours of time."},
    ] },
  'Wizard::Evocation':{ parent:'Wizard', name:'Evocation', source:'5E', subclassLevel:2,
    desc:"The School of Evocation channels magical energy into elemental effects — creating powerful blasts of fire, lightning, and cold. Evokers focus on offensive magic.",
    features:[
      {lv:2, name:'Evocation Savant', use:'passive', desc:"The gold and time you spend to copy an evocation spell into your spellbook is halved."},
      {lv:2, name:'Sculpt Spells', use:'passive', desc:"When you cast an evocation spell affecting other creatures, protect 1 + the spell's level of them; they automatically succeed on their saves and take no damage from the spell."},
      {lv:6, name:'Potent Cantrip', use:'passive', desc:"When a creature succeeds on a saving throw against your cantrip, it still takes half the cantrip's damage (if any) and suffers no additional effect."},
      {lv:10, name:'Empowered Evocation', use:'passive', desc:"Add your INT modifier to one damage roll of any wizard evocation spell you cast."},
      {lv:14, name:'Overchannel', use:'special', desc:"When you cast a wizard spell of 1st–5th level that deals damage, deal maximum damage. Using this more than once per long rest deals necrotic damage to you that increases each time."},
    ] },
  'Wizard::Illusion':{ parent:'Wizard', name:'Illusion', source:'5E', subclassLevel:2,
    desc:"The School of Illusion uses magic to deceive the senses, befuddle minds, and create wonders of unreality. Illusionists make the false seem real.",
    features:[
      {lv:2, name:'Illusion Savant', use:'passive', desc:"The gold and time you spend to copy an illusion spell into your spellbook is halved."},
      {lv:2, name:'Improved Minor Illusion', use:'passive', desc:"You learn the Minor Illusion cantrip; it can create both a sound and an image with a single casting."},
      {lv:6, name:'Malleable Illusions', use:'passive', desc:"When you cast an illusion spell with a duration of 1 minute or more, you can use an action to change the nature of that illusion."},
      {lv:10, name:'Illusory Self', use:'reaction', cost:'1/day', desc:"When a creature makes an attack against you, interpose an illusory duplicate so the attack automatically misses. Recharges after a short or long rest."},
      {lv:14, name:'Illusory Reality', use:'passive', desc:"When you cast an illusion spell of 1st level or higher, you can make one inanimate, nonmagical object that's part of the illusion real for 1 minute."},
    ] },
  'Wizard::Necromancy':{ parent:'Wizard', name:'Necromancy', source:'5E', subclassLevel:2,
    desc:"The School of Necromancy explores the cosmic forces of life, death, and undeath. Necromancers manipulate life energy and command the dead.",
    features:[
      {lv:2, name:'Necromancy Savant', use:'passive', desc:"The gold and time you spend to copy a necromancy spell into your spellbook is halved."},
      {lv:2, name:'Grim Harvest', use:'passive', desc:"Once per turn when you kill a creature with a spell of 1st level or higher, regain hit points equal to twice the spell's level (three times for a necromancy spell)."},
      {lv:6, name:'Undead Thralls', use:'passive', desc:"Add Animate Dead to your spellbook. When you cast it you can target one additional corpse, and undead you create gain bonus HP and add your proficiency bonus to their weapon damage."},
      {lv:10, name:'Inured to Undeath', use:'passive', desc:"You have resistance to necrotic damage, and your hit point maximum can't be reduced."},
      {lv:14, name:'Command Undead', use:'action', desc:"Target one undead within 60 ft; it must make a CHA save (with a bonus if its INT is higher than yours) or fall under your control for as long as you maintain the required concentration effect."},
    ] },
  'Wizard::Transmutation':{ parent:'Wizard', name:'Transmutation', source:'5E', subclassLevel:2,
    desc:"The School of Transmutation alters the properties of creatures and objects — changing matter, shape, and form. Transmuters are masters of change itself.",
    features:[
      {lv:2, name:'Transmutation Savant', use:'passive', desc:"The gold and time you spend to copy a transmutation spell into your spellbook is halved."},
      {lv:2, name:'Minor Alchemy', use:'passive', desc:"Over 10 minutes of work, temporarily transform one nonmagical material into another similar material (such as wood into iron) for up to 1 hour."},
      {lv:6, name:"Transmuter's Stone", use:'passive', desc:"Create a stone that grants one benefit to its bearer (darkvision 60 ft, +10 ft speed, proficiency in CON saves, or resistance to a chosen damage type). You can change the benefit when you cast a transmutation spell."},
      {lv:10, name:'Shapechanger', use:'passive', desc:"Add Polymorph to your spellbook. You can cast it once per long rest without a spell slot to transform yourself into a beast of CR 1 or lower."},
      {lv:14, name:'Master Transmuter', use:'action', desc:"Destroy your Transmuter's Stone to produce one major effect: remove curses/diseases/poisons from a creature, restore a creature's youth, create a panacea, or permanently transmute a Large-or-smaller nonmagical object."},
    ] },
};
function subKey(parent, name){ return parent + '::' + name; }
function subclassNamesForClass(className){
  const own = (CLASS_DATA[className] && CLASS_DATA[className].subclasses) || [];
  const imported = Object.values(SUBCLASS_DATA).filter(s=>s.parent===className).map(s=>s.name);
  return [...new Set([...own, ...imported])];
}

// ---------- Subspecies (subraces) ----------
// Detailed subspecies keyed by "Parent::Name" (same model as subclasses). Each
// species lists its subrace *names* in SPECIES_DATA[name].subraces; entries here
// carry the ability bump and traits. Built-in entries seed the common SRD and
// Steinhardt subraces; imported ones merge in from the database at startup.
// `subspeciesNamesForSpecies` unions the name list with any imported records so
// the Settings picker and the Features tab see every option for a species.
function subspKey(parent, name){ return parent + '::' + name; }
const SUBSPECIES_DATA = {
  // --- Elf ---
  'Elf::High Elf':{ parent:'Elf', name:'High Elf', source:'5E', asi:'+1 INT',
    traits:[
      {name:'Elf Weapon Training', desc:'Proficiency with the longsword, shortsword, shortbow, and longbow.'},
      {name:'Cantrip', desc:'You know one cantrip of your choice from the wizard spell list; INT is your spellcasting ability for it.'},
      {name:'Extra Language', desc:'You can speak, read, and write one extra language of your choice.'}
    ] },
  'Elf::Wood Elf':{ parent:'Elf', name:'Wood Elf', source:'5E', asi:'+1 WIS',
    traits:[
      {name:'Elf Weapon Training', desc:'Proficiency with the longsword, shortsword, shortbow, and longbow.'},
      {name:'Fleet of Foot', desc:'Your base walking speed increases to 35 feet.'},
      {name:'Mask of the Wild', desc:'You can attempt to hide even when only lightly obscured by foliage, rain, snow, mist, or other natural phenomena.'}
    ] },
  'Elf::Drow (Dark Elf)':{ parent:'Elf', name:'Drow (Dark Elf)', source:'5E', asi:'+1 CHA',
    traits:[
      {name:'Superior Darkvision', desc:'Your darkvision has a radius of 120 feet.'},
      {name:'Sunlight Sensitivity', desc:'Disadvantage on attack rolls and Perception checks that rely on sight when you, the target, or what you\'re looking at is in direct sunlight.'},
      {name:'Drow Magic', desc:'You know Dancing Lights. At 3rd level you can cast Faerie Fire once per long rest; at 5th level, Darkness once per long rest. CHA is your spellcasting ability.'},
      {name:'Drow Weapon Training', desc:'Proficiency with rapiers, shortswords, and hand crossbows.'}
    ] },
  // --- Dwarf ---
  'Dwarf::Hill Dwarf':{ parent:'Dwarf', name:'Hill Dwarf', source:'5E', asi:'+1 WIS',
    traits:[{name:'Dwarven Toughness', desc:'Your hit point maximum increases by 1, and by 1 every time you gain a level.'}] },
  'Dwarf::Mountain Dwarf':{ parent:'Dwarf', name:'Mountain Dwarf', source:'5E', asi:'+2 STR',
    traits:[{name:'Dwarven Armor Training', desc:'Proficiency with light and medium armor.'}] },
  // --- Halfling ---
  'Halfling::Lightfoot':{ parent:'Halfling', name:'Lightfoot', source:'5E', asi:'+1 CHA',
    traits:[{name:'Naturally Stealthy', desc:'You can attempt to hide even when obscured only by a creature at least one size larger than you.'}] },
  'Halfling::Stout':{ parent:'Halfling', name:'Stout', source:'5E', asi:'+1 CON',
    traits:[{name:'Stout Resilience', desc:'Advantage on saving throws against poison, and resistance to poison damage.'}] },
  // --- Gnome ---
  'Gnome::Forest Gnome':{ parent:'Gnome', name:'Forest Gnome', source:'5E', asi:'+1 DEX',
    traits:[
      {name:'Natural Illusionist', desc:'You know the Minor Illusion cantrip; INT is your spellcasting ability for it.'},
      {name:'Speak with Small Beasts', desc:'Through sounds and gestures you can communicate simple ideas with Small or smaller beasts.'}
    ] },
  'Gnome::Rock Gnome':{ parent:'Gnome', name:'Rock Gnome', source:'5E', asi:'+1 CON',
    traits:[
      {name:"Artificer's Lore", desc:'Add double your proficiency bonus to History checks about magic items, alchemical objects, or technological devices.'},
      {name:'Tinker', desc:'Using artisan\'s tools you can construct a Tiny clockwork device (a toy, fire starter, or music box).'}
    ] },
  // --- Cursed-Blood (Steinhardt's Guide to the Eldritch Hunt) ---
  'Cursed-Blood::Doused':{ parent:'Cursed-Blood', name:'Doused', source:'Homebrew', asi:'+1 STR or WIS',
    traits:[{name:'Insulated Skin', desc:'Choose two damage types from acid, cold, fire, lightning, and poison. When you take damage of one of those types, reduce it by an amount equal to your proficiency bonus.'}] },
  'Cursed-Blood::Hulking':{ parent:'Cursed-Blood', name:'Hulking', source:'Homebrew', asi:'+1 CON',
    traits:[{name:'Stone Skin', desc:'When you suffer a critical hit from a piercing attack, it deals no extra piercing damage from being a critical hit.'}] },
  'Cursed-Blood::Mirage':{ parent:'Cursed-Blood', name:'Mirage', source:'Homebrew', asi:'+1 INT or CHA',
    traits:[{name:'Shadowveil Skin', desc:'You can attempt to hide when only lightly obscured by shadows, smog, acid rain, or other urban phenomena, and you can move through the space of a creature one size larger than you.'}] },
  // --- Demidritch ---
  'Demidritch::Oculare':{ parent:'Demidritch', name:'Oculare', source:'Homebrew', asi:'+1 CON',
    traits:[
      {name:'Watchers', desc:'You are proficient in the Perception skill.'},
      {name:'All Seeing Eyes', desc:'From 3rd level, as an action, eyes open across your body for 1 minute: creatures within 60 ft gain no advantage on attacks against you from being invisible or unseen. At 12th level you also grow eye-covered wings (fly 30 ft, see invisibility 60 ft). 1/long rest. Subrace DC = 8 + 2× proficiency bonus.'}
    ] },
  'Demidritch::Nebulare':{ parent:'Demidritch', name:'Nebulare', source:'Homebrew', asi:'+1 STR',
    traits:[
      {name:'Glow', desc:'You can cast the Light cantrip on your own body at will.'},
      {name:'Astral Attraction', desc:'From 3rd level, as an action, transform for 1 minute: creatures within 10 ft take proficiency-bonus d6 radiant (DEX save) on the first turn; you shed light and create a 20 ft difficult-terrain gravity field for chosen creatures. At 12th level the field is 60 ft and you can hover/fly 30 ft. 1/long rest.'}
    ] },
  // --- Manikin ---
  'Manikin::Custodian':{ parent:'Manikin', name:'Custodian', source:'Homebrew', asi:'+1 STR',
    traits:[
      {name:'Careful Defender', desc:'When a creature within 5 ft is targeted by an attack, use your reaction to switch places with it (if willing) and become the target instead. Uses equal to your proficiency bonus per long rest.'},
      {name:'Powerful Build', desc:'You count as one size larger for carrying capacity and the weight you can push, drag, or lift.'}
    ] },
  'Manikin::Handler':{ parent:'Manikin', name:'Handler', source:'Homebrew', asi:'+1 DEX',
    traits:[
      {name:'Inconspicuous Appearance', desc:'Proficiency in the Stealth skill and with disguise kits.'},
      {name:'Embedded Armament', desc:'Up to two finesse or light melee weapons can be embedded in your body; draw or stow them as a bonus action, swap them on a short rest, and you can\'t be disarmed of them.'}
    ] },
  'Manikin::Thespian':{ parent:'Manikin', name:'Thespian', source:'Homebrew', asi:'+1 CHA',
    traits:[
      {name:"Artist's Puppet", desc:'Proficiency in the Performance skill.'},
      {name:'Ethereal Strings', desc:'As a bonus action, attach to a willing creature within 30 ft for 1 hour. If it doesn\'t use all its movement, use your reaction at the end of its turn to move up to the remainder. 1/short or long rest.'}
    ] },
  // --- Scourgeborne ---
  'Scourgeborne::Aranea':{ parent:'Scourgeborne', name:'Aranea', source:'Homebrew', asi:'+1 INT, +1 any',
    traits:[
      {name:'Spider Climb', desc:'You have a 30 ft climbing speed and can climb difficult surfaces, including upside down, for a number of minutes equal to your proficiency bonus per long rest.'},
      {name:'Web Spit', desc:'Bonus action, one creature within 60 ft: DEX save (8 + PB + CON mod) or restrained. Escape via STR check, or attack the web (AC 10, HP 3× PB, vulnerable fire). 1/long rest.'}
    ] },
  'Scourgeborne::Belua':{ parent:'Scourgeborne', name:'Belua', source:'Homebrew', asi:'+1 STR, +1 any',
    traits:[
      {name:'Keen Hearing and Smell', desc:'Advantage on Perception checks that rely on hearing or smell.'},
      {name:'Hungry Jaws', desc:'Bonus-action unarmed strike; on a hit, regain hit points equal to the damage dealt. Uses equal to your proficiency bonus per long rest.'}
    ] },
  'Scourgeborne::Cervus':{ parent:'Scourgeborne', name:'Cervus', source:'Homebrew', asi:'+1 WIS or STR, +1 any',
    traits:[
      {name:'Goring Charge', desc:'Move 20 ft straight toward a creature then hit it in melee: STR save (8 + PB + STR mod) or knocked prone, and you may make one bonus-action melee attack against a prone target. Uses equal to your proficiency bonus per long rest.'},
      {name:'Nimble Build', desc:'Your walking speed increases by 10 feet.'}
    ] },
  'Scourgeborne::Vespertilio':{ parent:'Scourgeborne', name:'Vespertilio', source:'Homebrew', asi:'+1 DEX, +1 any',
    traits:[
      {name:'Echolocative Sight', desc:'Blindsight out to 30 ft; disadvantage on ability checks and attack rolls that rely on sight beyond that radius.'},
      {name:'Tattered Wings', desc:'Bonus action to gain a 30 ft flying speed until the end of your turn (you fall if still aloft). Uses equal to your proficiency bonus per short or long rest.'}
    ] }
};
Object.values(SUBSPECIES_DATA).forEach(ss=>{ ss.builtin = true; });
function subspeciesNamesForSpecies(speciesName){
  const own = (SPECIES_DATA[speciesName] && SPECIES_DATA[speciesName].subraces) || [];
  const imported = Object.values(SUBSPECIES_DATA).filter(s=>s.parent===speciesName && s.custom).map(s=>s.name);
  return [...new Set([...own, ...imported])];
}

// ---------- Spell slot tables (PHB) ----------
// Full-caster slots by caster level (also used as the multiclass table).
const FULL_SLOTS = {
  1:[2],2:[3],3:[4,2],4:[4,3],5:[4,3,2],6:[4,3,3],7:[4,3,3,1],8:[4,3,3,2],
  9:[4,3,3,3,1],10:[4,3,3,3,2],11:[4,3,3,3,2,1],12:[4,3,3,3,2,1],
  13:[4,3,3,3,2,1,1],14:[4,3,3,3,2,1,1],15:[4,3,3,3,2,1,1,1],16:[4,3,3,3,2,1,1,1],
  17:[4,3,3,3,2,1,1,1,1],18:[4,3,3,3,3,1,1,1,1],19:[4,3,3,3,3,2,1,1,1],20:[4,3,3,3,3,2,2,1,1]
};
// Half-caster (Paladin/Ranger) slots by class level.
const HALF_SLOTS = {
  1:[],2:[2],3:[3],4:[3],5:[4,2],6:[4,2],7:[4,3],8:[4,3],9:[4,3,2],10:[4,3,2],
  11:[4,3,3],12:[4,3,3],13:[4,3,3,1],14:[4,3,3,1],15:[4,3,3,2],16:[4,3,3,2],
  17:[4,3,3,3,1],18:[4,3,3,3,1],19:[4,3,3,3,2],20:[4,3,3,3,2]
};
// Warlock Pact Magic: {n: slots, l: slot level} by warlock level.
const PACT_SLOTS = {
  1:{n:1,l:1},2:{n:2,l:1},3:{n:2,l:2},4:{n:2,l:2},5:{n:2,l:3},6:{n:2,l:3},
  7:{n:2,l:4},8:{n:2,l:4},9:{n:2,l:5},10:{n:2,l:5},11:{n:3,l:5},12:{n:3,l:5},
  13:{n:3,l:5},14:{n:3,l:5},15:{n:3,l:5},16:{n:3,l:5},17:{n:4,l:5},18:{n:4,l:5},19:{n:4,l:5},20:{n:4,l:5}
};

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
