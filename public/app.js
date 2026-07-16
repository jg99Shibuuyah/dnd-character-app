
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
// Same source-tagging model as classes; imported species merge in at startup.
const CLASS_LIKE_SOURCES = CLASS_SOURCES; // shared list, reused by species
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
  // Luyarnha's playable races. Names that collide with the 5E built-ins carry
  // an "(Eldritch Hunt)" suffix so both versions stay selectable.
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
  'Elf (Eldritch Hunt)':{ source:'Homebrew', size:'Medium', speed:30, darkvision:60, asi:'+2 DEX (not CON w/ optional rule)', languages:'Common, Elvish', skills:['Perception'], desc:'Luyarnha\'s founding elves — wood elves whose skins turned stone-gray and obsidian with urbanization, first acolytes of the Radiant One, driven above all to stave off their race\'s extinction. Uses the standard 5E elf mechanics.',
    traits:[
      {name:'Standard Elf Traits', desc:'Darkvision 60 ft, Keen Senses, Fey Ancestry, and Trance, as the 5E elf.'},
      {name:'Frail Constitution (optional rule)', desc:'Elven bodies are meek and frail: no racial or subrace ability score increase may be applied to Constitution.'}
    ] },
  'Half-Elf (Eldritch Hunt)':{ source:'Homebrew', size:'Medium', speed:30, darkvision:60, asi:'+2 CHA, +1 to two others', languages:'Common, Elvish + one', desc:'Luyarnha\'s "noble-bloods" — cherished aristocrats of the city, the Silverblood family and the hunter Steinhardt among them, though consanguinity bred madness into the line. Uses the standard 5E half-elf mechanics.',
    traits:[
      {name:'Standard Half-Elf Traits', desc:'Darkvision 60 ft, Fey Ancestry, and Skill Versatility (two skill proficiencies), as the 5E half-elf.'},
      {name:'Weak to Madness (optional rule)', desc:'The tight balance of human and elven blood is easily disrupted: disadvantage on saving throws against madness.'}
    ] },
  'Human (Eldritch Hunt)':{ source:'Homebrew', size:'Medium', speed:30, darkvision:0, asi:'+1 to all abilities', languages:'Common + one', desc:'Luyarnha\'s builders and thinkers — fertile, secular, and proud, raising cathedral spires and aqueducts while walking the line between self-actualization and self-destruction. Lore article; uses the standard 5E human mechanics.',
    traits:[
      {name:'Versatile', desc:'A +1 bonus to every ability score (or extra skill/feat in variant rules), as the 5E human.'}
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

// Imported spells (global, DB-backed), keyed by name. A custom spell with the
// same name as a built-in SPELL_DATA entry shadows it in the Spell Library.
let CUSTOM_SPELLS = {};

// PHB multiclassing prerequisites: an array of alternatives, each an ability-minimum set.
// (Jaeger has no published prereq — DEX or INT 13 mirrors its primary abilities.)
const MC_REQS = {
  Artificer:[{int:13}],
  Barbarian:[{str:13}], Bard:[{cha:13}], Cleric:[{wis:13}], Druid:[{wis:13}],
  Fighter:[{str:13},{dex:13}], Jaeger:[{dex:13},{int:13}], Monk:[{dex:13,wis:13}],
  Paladin:[{str:13,cha:13}], Ranger:[{dex:13,wis:13}], Rogue:[{dex:13}],
  Sorcerer:[{cha:13}], Warlock:[{cha:13}], Wizard:[{int:13}]
};

function defaultCharacter(){
  return {
    id: null,
    name:'Unnamed Adventurer', class:'', level:1, race:'', subrace:'', background:'', alignment:'', xp:0,
    classes: [], // multiclass list: [{name, level}]; first entry is the primary class
    abilities:{str:10,dex:10,con:10,int:10,wis:10,cha:10},
    saveProf:{str:false,dex:false,con:false,int:false,wis:false,cha:false},
    skillProf:{},
    ac:10, speed:30, hpMax:10, hpCurrent:10, hpTemp:0, hitDice:'1d10',
    deathSuccess:[false,false,false], deathFail:[false,false,false],
    attacks:[{name:'',bonus:'',dmg:''}],
    features:'', persTraits:'', persIdeals:'', persBonds:'', persFlaws:'',
    currency:{cp:0,sp:0,ep:0,gp:0,pp:0},
    inventory:[{name:'',qty:1}],
    spellSlots: [1,2,3,4,5,6,7,8,9].map(()=>({total:0, used:0})),
    pactSlots: {total:0, used:0, level:1}, // Warlock pact magic (tracked separately)
    autoSlots: true, // auto-fill slots from class levels (PHB multiclass rules)
    spellClass: 'Wizard',
    knownSpells: [], // {name, level, custom:bool, tags:[...]}
    // Worn/wielded gear with mechanical effects. Each item:
    // {name, description, equipped, attack:{bonus,dmg},
    //  abilities:{str,dex,con,int,wis,cha} (string "+2" or "=19"),
    //  skills:[{name,bonus}], spells:[{name,level}]}
    equipment: [],
    // Freeform point trackers on the Actions tab: each is a named pool of pips
    // (a spell slot, Focus Point, Ki, etc.) that the player fills in as used.
    actionResources: [], // {name, total, used}
    journal: [], // character journal entries: {id, title, text, created, updated}
    rollLog: [] // dice roller history: {id, formula, detail, total, time}
  };
}

let state = defaultCharacter();

// Which page this script is running on: 'sheet' (index), 'import', or 'library'.
// Standalone pages set data-page on <body>; shared handlers check this to skip
// character-sheet-only work (autosave, sheet panel rebuilds).
const PAGE = document.body.dataset.page || 'sheet';

function mod(score){ return Math.floor((score-10)/2); }
function fmt(n){ return (n>=0?'+':'') + n; }
function profBonus(level){
  if(level>=17) return 6;
  if(level>=13) return 5;
  if(level>=9) return 4;
  if(level>=5) return 3;
  return 2;
}

function el(tag, cls, html){
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  if(html!==undefined) e.innerHTML = html;
  return e;
}

// Escape user text before interpolating into innerHTML (names, descriptions).
function esc(s){
  return (s==null?'':String(s))
    .replace(/&/g,'&amp;').replace(/"/g,'&quot;')
    .replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ---------- Equipment helpers ----------
function equipList(){
  if(!Array.isArray(state.equipment)) state.equipment = [];
  return state.equipment;
}
function newEquipItem(){
  return { name:'', description:'', equipped:true,
    attack:{bonus:'',dmg:''}, ac:'',
    abilities:{str:'',dex:'',con:'',int:'',wis:'',cha:''},
    skills:[], spells:[] };
}
function equippedEquip(){ return equipList().filter(it=>it.equipped); }

// Parse an ability-effect string: "+2"/"-1" → additive, "=19" → set score.
function parseAbilityEffect(v){
  const s = (v==null?'':String(v)).trim();
  if(!s) return null;
  if(s[0]==='='){ const n=parseInt(s.slice(1),10); return isNaN(n)?null:{mode:'set',value:n}; }
  const n = parseInt(s,10);
  return isNaN(n)?null:{mode:'add',value:n};
}

// Base ability scores modified by equipped gear (adds stack; sets take the max,
// then adds apply on top). Used everywhere derived stats are computed.
function effectiveAbilities(){
  const eff={}, adds={}, sets={};
  ABILITIES.forEach(a=> eff[a.key]=state.abilities[a.key]||0);
  equippedEquip().forEach(it=>{
    const ab = it.abilities||{};
    ABILITIES.forEach(a=>{
      const e = parseAbilityEffect(ab[a.key]);
      if(!e) return;
      if(e.mode==='add') adds[a.key]=(adds[a.key]||0)+e.value;
      else sets[a.key]=Math.max(a.key in sets ? sets[a.key] : -Infinity, e.value);
    });
  });
  ABILITIES.forEach(a=>{
    let v = eff[a.key];
    if(a.key in sets) v = Math.max(v, sets[a.key]);
    eff[a.key] = v + (adds[a.key]||0);
  });
  return eff;
}
function equipSkillBonus(skillName){
  let n=0;
  equippedEquip().forEach(it=> (it.skills||[]).forEach(s=>{ if(s.name===skillName) n += Number(s.bonus)||0; }));
  return n;
}

// ---------- Granted skill proficiencies ----------
// Species and backgrounds GRANT fixed skill proficiencies (classes only offer
// choices — those stay manual picks in Settings). Grants are computed live from
// the current species/background, never written into state.skillProf, so
// switching background/species adds and removes them automatically.
function grantedSkillSources(skillName){
  const out = [];
  const sd = SPECIES_DATA[state.race];
  if(sd && Array.isArray(sd.skills) && sd.skills.includes(skillName)) out.push({ by: state.race, kind: 'species' });
  const bd = BACKGROUND_DATA[state.background];
  if(bd && Array.isArray(bd.skills) && bd.skills.includes(skillName)) out.push({ by: state.background, kind: 'background' });
  return out;
}
// Effective proficiency for SKILLS[i]: manually toggled OR granted.
function skillProficient(i){
  return !!state.skillProf['sk'+i] || grantedSkillSources(SKILLS[i].name).length>0;
}
function equipmentAttacks(){
  return equippedEquip()
    .filter(it=> it.attack && (it.attack.dmg || it.attack.bonus))
    .map(it=>({ name: it.name||'Unnamed weapon', bonus: it.attack.bonus||'', dmg: it.attack.dmg||'' }));
}
function equipmentGrantedSpells(){
  return equippedEquip().flatMap(it=>
    (it.spells||[]).map(sp=>({ name: sp.name, level: Number(sp.level)||0, from: it.name||'item' })));
}

// Computed Armor Class: base 10 + DEX mod (gear-adjusted), with equipped armor.
// Armor field syntax matches abilities: "+2" stacks (shield, ring of protection);
// "=16" is a flat armor base that replaces 10+DEX (heavy armor) — the higher of
// the two bases wins, then bonuses apply on top.
function computeAC(){
  const dexMod = mod(effectiveAbilities().dex);
  const unarmored = 10 + dexMod;
  let adds = 0; const sets = [];
  equippedEquip().forEach(it=>{
    const e = parseAbilityEffect(it.ac);
    if(!e) return;
    if(e.mode==='set') sets.push(e.value); else adds += e.value;
  });
  const armorBase = sets.length ? Math.max(...sets) : null;
  const usedArmor = armorBase!==null && armorBase >= unarmored;
  const base = usedArmor ? armorBase : unarmored;
  return { ac: base + adds, dexMod, usedArmor, armorBase, adds };
}

// ---------- Build Abilities Panel ----------
function buildAbilities(){
  const panel = document.getElementById('abilitiesPanel');
  panel.querySelectorAll('.ability').forEach(n=>n.remove());
  ABILITIES.forEach(a=>{
    const row = el('div','ability');
    row.innerHTML = `
      <div class="abbr">${a.key.toUpperCase()}</div>
      <div class="mod-badge" id="modBadge_${a.key}">+0</div>
      <input class="score-input" type="number" id="score_${a.key}" value="${state.abilities[a.key]}">
    `;
    panel.appendChild(row);
  });
  ABILITIES.forEach(a=>{
    document.getElementById('score_'+a.key).addEventListener('input', e=>{
      state.abilities[a.key] = parseInt(e.target.value)||0;
      renderClassInfoStack(); // multiclass prerequisite badges depend on scores
      recalc(); save();
    });
  });
}

// Read-only rows: the bonus already includes proficiency (dot = proficient).
// Save proficiencies come from the class; skills are picked in Settings.
function buildSaves(){
  const panel = document.getElementById('savesPanel');
  panel.innerHTML='';
  ABILITIES.forEach(a=>{
    const row = el('div','check-row');
    row.innerHTML = `
      <span class="prof-dot ${state.saveProf[a.key]?'on':''}"></span>
      <span class="abbr-tag">${a.key.toUpperCase()}</span>
      <span class="name">${a.name} Save</span>
      <span class="bonus" id="saveBonus_${a.key}">+0</span>
    `;
    panel.appendChild(row);
  });
}

function buildSkills(){
  const panel = document.getElementById('skillsPanel');
  panel.innerHTML='';
  SKILLS.forEach((s,i)=>{
    const key = 'sk'+i;
    if(!(key in state.skillProf)) state.skillProf[key]=false;
    const granted = grantedSkillSources(s.name);
    const prof = state.skillProf[key] || granted.length>0;
    const row = el('div','check-row skill-row'+(prof?' proficient':'')+(granted.length?' granted':''));
    row.title = 'Click for a quick description';
    row.innerHTML = `
      <span class="prof-dot ${prof?'on':''}${granted.length?' granted':''}"></span>
      <span class="abbr-tag">${s.ability.toUpperCase()}</span>
      <span class="name">${s.name}</span>
      ${granted.map(g=>`<span class="grant-tag">${esc(g.kind)}</span>`).join('')}
      <span class="bonus" id="skillBonus_${key}">+0</span>
    `;
    row.addEventListener('click', ()=> openSkillDetail(i));
    panel.appendChild(row);
  });
  const count = document.getElementById('skillProfCount');
  if(count) count.textContent = `${SKILLS.filter((s,i)=>skillProficient(i)).length} / ${SKILLS.length}`;
}

// Small floating legend explaining the skill-proficiency markers (opened from
// the "?" buttons on the Skills tab and the Settings skill picker — same
// draggable window system as the dice roller and notes popups).
function openSkillLegend(){
  openNotesModal({
    name: 'Skill Proficiencies — Legend',
    badges: ['Reference'],
    detail: `
      <div class="legend-row"><span class="prof-dot on"></span><span>Proficient — your proficiency bonus is added to the skill.</span></div>
      <div class="legend-row"><span class="prof-dot on granted"></span><span>Granted proficiency — applied automatically by your <span class="hl">species</span> or <span class="hl">background</span>. Locked: it goes away only if you change the source in Settings.</span></div>
      <div class="legend-row"><span class="skill-chip classpick legend-chip">chip</span><span>Offered by your <span class="hl">class</span> — pick your allowed number of these in Settings (the class decides how many).</span></div>
      <div class="legend-row"><span class="skill-chip on legend-chip">chip</span><span>Toggled on manually — proficiencies from feats, training, or DM fiat.</span></div>
      <div class="legend-row"><span class="grant-tag">background</span><span>Tag showing where a granted proficiency comes from.</span></div>
      <p class="nr-hint">Skill bonuses everywhere on the sheet update automatically: ability modifier + proficiency bonus (if proficient) + equipped-gear bonuses.</p>`
  });
}

function bindSkillLegendButtons(){
  document.querySelectorAll('.skill-legend-btn').forEach(btn=>
    btn.addEventListener('click', e=>{ e.stopPropagation(); openSkillLegend(); }));
}

// ---------- Quick-tools launcher (bottom-right "⋯" FAB) ----------
// Expands into a collapsible stack of tools: Dice, Notes, Skills. Dice/Notes
// popups are toggled by their own modules (bound to #diceFab / #journalFab);
// the Skills quick-reference popup is owned here. Picking a tool collapses
// the stack so its popup isn't covered.
function renderSkillsPop(){
  const list = document.getElementById('skillsPopList');
  if(!list) return;
  const pb = profBonus(state.level);
  const eff = effectiveAbilities();
  list.innerHTML = SKILLS.map((s,i)=>{
    const granted = grantedSkillSources(s.name);
    const prof = skillProficient(i);
    const bonus = mod(eff[s.ability]) + (prof?pb:0) + equipSkillBonus(s.name);
    return `<div class="check-row skill-row${prof?' proficient':''}${granted.length?' granted':''}" data-i="${i}" title="Click for a quick description">
      <span class="prof-dot ${prof?'on':''}${granted.length?' granted':''}"></span>
      <span class="abbr-tag">${s.ability.toUpperCase()}</span>
      <span class="name">${s.name}</span>
      ${granted.map(g=>`<span class="grant-tag">${esc(g.kind)}</span>`).join('')}
      <span class="bonus">${fmt(bonus)}</span>
    </div>`;
  }).join('');
  list.querySelectorAll('.skill-row').forEach(row=>
    row.addEventListener('click', ()=> openSkillDetail(Number(row.dataset.i))));
}

function toggleSkillsPopup(open){
  const popup = document.getElementById('skillsPopup');
  const fab = document.getElementById('skillsFab');
  if(!popup) return;
  const willOpen = open!==undefined ? open : !popup.classList.contains('open');
  popup.classList.toggle('open', willOpen);
  if(fab) fab.classList.toggle('open', willOpen);
  if(willOpen){
    // Mutually exclusive with the dice / journal popups so they don't overlap.
    ['dicePopup','diceFab','journalPopup','journalFab'].forEach(id=>{
      const n = document.getElementById(id); if(n) n.classList.remove('open');
    });
    renderSkillsPop();
  }
}

function bindCornerLauncher(){
  const stack = document.getElementById('fabStack');
  const launcher = document.getElementById('fabLauncher');
  if(!stack || !launcher) return;
  const setOpen = open=>{
    stack.classList.toggle('open', open);
    launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  launcher.addEventListener('click', ()=> setOpen(!stack.classList.contains('open')));
  // Any tool pick collapses the stack (each item's own handler opens its popup).
  stack.querySelectorAll('.fab-item').forEach(btn=>
    btn.addEventListener('click', ()=> setOpen(false)));
  document.getElementById('skillsFab').addEventListener('click', ()=> toggleSkillsPopup());
  document.getElementById('skillsPopClose').addEventListener('click', ()=> toggleSkillsPopup(false));
  document.addEventListener('keydown', e=>{
    if(e.key!=='Escape') return;
    const popup = document.getElementById('skillsPopup');
    if(popup && popup.classList.contains('open')) toggleSkillsPopup(false);
    else setOpen(false);
  });
}

// Floating quick-reference popup for one skill (reuses the Notes window system).
function openSkillDetail(i){
  const s = SKILLS[i];
  const key = 'sk'+i;
  const pb = profBonus(state.level);
  const m = mod(effectiveAbilities()[s.ability]);
  const granted = grantedSkillSources(s.name);
  const prof = !!state.skillProf[key] || granted.length>0;
  const gear = equipSkillBonus(s.name);
  const total = m + (prof?pb:0) + gear;
  const parts = [`${s.ability.toUpperCase()} ${fmt(m)}`];
  if(prof) parts.push(`proficiency ${fmt(pb)}`);
  if(gear) parts.push(`gear ${fmt(gear)}`);
  openNotesModal({
    name: s.name,
    badges: ['Skill', s.ability.toUpperCase(), prof ? 'Proficient' : 'Not proficient'],
    detail: `<p>${SKILL_DESC[s.name]||''}</p>
      <p><strong>Bonus ${fmt(total)}</strong> = ${parts.join(' + ')}</p>
      ${granted.map(g=>`<p class="nr-hint">Proficiency granted by your ${esc(g.kind)} — <span class="hl">${esc(g.by)}</span>.</p>`).join('')}
      ${prof ? '' : '<p class="nr-hint">Not proficient — toggle skill proficiencies on the Character Settings tab.</p>'}`
  });
}

// Floating quick-reference popup for a passive sense (Skills tab). Shows the
// current score with its breakdown plus a short description and play example.
function openPassiveDetail(skillName){
  const info = PASSIVE_SENSE_INFO[skillName];
  if(!info) return;
  const i = SKILLS.findIndex(s=>s.name===skillName);
  const s = SKILLS[i];
  const pb = profBonus(state.level);
  const m = mod(effectiveAbilities()[s.ability]);
  const prof = skillProficient(i);
  const gear = equipSkillBonus(s.name);
  const bonus = m + (prof?pb:0) + gear;
  const parts = ['10', `${s.ability.toUpperCase()} ${fmt(m)}`];
  if(prof) parts.push(`proficiency ${fmt(pb)}`);
  if(gear) parts.push(`gear ${fmt(gear)}`);
  openNotesModal({
    name: 'Passive ' + skillName,
    badges: ['Passive Sense', s.ability.toUpperCase(), prof ? 'Proficient' : 'Not proficient'],
    detail: `<p>${info.desc}</p>
      <p><strong>Score ${10 + bonus}</strong> = ${parts.join(' + ')}</p>
      <p class="nr-hint"><span class="hl">Example:</span> ${info.example}</p>`
  });
}

function bindPassiveSenseRows(){
  document.querySelectorAll('.passive-row').forEach(row=>
    row.addEventListener('click', ()=> openPassiveDetail(row.dataset.passive)));
}

function buildAttacks(){
  const body = document.getElementById('attacksBody');
  body.innerHTML='';
  state.attacks.forEach((a,i)=>{
    const tr = el('tr');
    tr.innerHTML = `
      <td><input value="${a.name}" data-i="${i}" class="atk-name" placeholder="Longsword"></td>
      <td><input value="${a.bonus}" data-i="${i}" class="atk-bonus narrow" placeholder="+5"></td>
      <td><input value="${a.dmg}" data-i="${i}" class="atk-dmg" placeholder="1d8+3 slashing"></td>
      <td><span class="row-del" data-i="${i}">✕</span></td>
    `;
    body.appendChild(tr);
  });
  body.querySelectorAll('.atk-name').forEach(i=>i.addEventListener('input', e=>{state.attacks[e.target.dataset.i].name=e.target.value; save();}));
  body.querySelectorAll('.atk-bonus').forEach(i=>i.addEventListener('input', e=>{state.attacks[e.target.dataset.i].bonus=e.target.value; save();}));
  body.querySelectorAll('.atk-dmg').forEach(i=>i.addEventListener('input', e=>{state.attacks[e.target.dataset.i].dmg=e.target.value; save();}));
  body.querySelectorAll('.row-del').forEach(i=>i.addEventListener('click', e=>{
    state.attacks.splice(e.target.dataset.i,1);
    if(state.attacks.length===0) state.attacks.push({name:'',bonus:'',dmg:''});
    buildAttacks(); save();
  }));
}

function buildInventory(){
  const list = document.getElementById('inventoryList');
  list.innerHTML='';
  // Equipment items are carried gear, so they appear here automatically.
  // Read-only: they're managed on the Equipment tab (click a row to jump there).
  const gear = equipList().filter(it=> it.name && it.name.trim());
  if(gear.length){
    list.insertAdjacentHTML('beforeend',
      '<div class="equip-atk-head">From equipment — managed on the Equipment tab</div>'
      + gear.map(it=>`
        <div class="inv-row inv-gear" title="Edit on the Equipment tab">
          <span class="item-name gear-name">${esc(it.name)}</span>
          <span class="action-badge ${it.equipped?'':'dim'}">${it.equipped?'Equipped':'Packed'}</span>
        </div>`).join(''));
    list.querySelectorAll('.inv-gear').forEach(row=>row.addEventListener('click', ()=>{
      document.querySelector('.tab-btn[data-tab="equipment"]').click();
    }));
  }
  state.inventory.forEach((item,i)=>{
    const row = el('div','inv-row');
    row.innerHTML = `
      <input class="item-name" data-i="${i}" value="${item.name}" placeholder="Item name">
      <input class="item-qty" data-i="${i}" type="number" value="${item.qty}">
      <span class="row-del" data-i="${i}">✕</span>
    `;
    list.appendChild(row);
  });
  list.querySelectorAll('.item-name').forEach(i=>i.addEventListener('input', e=>{state.inventory[e.target.dataset.i].name=e.target.value; save();}));
  list.querySelectorAll('.item-qty').forEach(i=>i.addEventListener('input', e=>{state.inventory[e.target.dataset.i].qty=parseInt(e.target.value)||0; save();}));
  list.querySelectorAll('.row-del').forEach(i=>i.addEventListener('click', e=>{
    state.inventory.splice(e.target.dataset.i,1);
    if(state.inventory.length===0) state.inventory.push({name:'',qty:1});
    buildInventory(); save();
  }));
}

// Compute leveled + pact slots from the class list using the PHB tables.
function computeSpellSlots(picked){
  const totals=[0,0,0,0,0,0,0,0,0];
  const leveled = picked.filter(c=>{ const t=CLASS_DATA[c.name]&&CLASS_DATA[c.name].casting; return t&&(t.type==='full'||t.type==='half'); });
  const warlocks = picked.filter(c=>{ const t=CLASS_DATA[c.name]&&CLASS_DATA[c.name].casting; return t&&t.type==='pact'; });
  let table=null, lvl=0;
  if(leveled.length===1){
    const c=leveled[0]; const cast=CLASS_DATA[c.name].casting;
    if(cast.roundUp){ // Artificer: half caster rounded UP — reads the full table at ceil(level/2).
      lvl = Math.ceil((c.level||1)/2); table = FULL_SLOTS;
    } else {
      lvl = c.level||1; table = cast.type==='full' ? FULL_SLOTS : HALF_SLOTS;
    }
  } else if(leveled.length>1){
    // Multiclass: full levels + half of half-caster levels (Artificer rounds up), read off the full table.
    lvl = leveled.reduce((s,c)=>{ const cast=CLASS_DATA[c.name].casting;
      if(cast.type==='full') return s + (c.level||1);
      return s + (cast.roundUp ? Math.ceil((c.level||1)/2) : Math.floor((c.level||1)/2));
    }, 0);
    table = FULL_SLOTS;
  }
  if(table && lvl>0){ (table[Math.min(20,Math.max(1,lvl))]||[]).forEach((n,i)=>totals[i]+=n); }
  const wl = warlocks.reduce((s,c)=>s+(c.level||1),0);
  const pact = wl>0 ? PACT_SLOTS[Math.min(20,wl)] : null;
  return { totals, pact, hasCaster: leveled.length>0 || wl>0 };
}

// Overwrite slot totals from the class list when auto mode is on, preserving
// how many are already spent. Non-casters are left alone so manual values survive.
function refreshAutoSlots(){
  if(!state.autoSlots) return;
  const { totals, pact, hasCaster } = computeSpellSlots(pickedClasses());
  if(!hasCaster) return;
  state.spellSlots.forEach((s,i)=>{ s.total = totals[i]; if(s.used>s.total) s.used=s.total; });
  if(!state.pactSlots) state.pactSlots={total:0,used:0,level:1};
  if(pact){ state.pactSlots.total=pact.n; state.pactSlots.level=pact.l; if(state.pactSlots.used>pact.n) state.pactSlots.used=pact.n; }
  else { state.pactSlots.total=0; state.pactSlots.used=0; }
}

function slotRow(label, slot, key, extraClass){
  let pips='';
  for(let p=0;p<slot.total;p++) pips += `<span class="slot-pip ${p<slot.used?'filled':''}" data-lvl="${key}" data-p="${p}"></span>`;
  const disabled = state.autoSlots ? 'disabled' : '';
  const totalCell = key==='pact'
    ? `<span class="total pact-total">${slot.total}</span>`
    : `<input class="total" type="number" min="0" max="9" value="${slot.total}" data-lvl="${key}" ${disabled}>`;
  return `<div class="slot-level ${extraClass||''}"><div class="lv">${label}</div>${totalCell}<div class="slot-pips">${pips}</div></div>`;
}

function buildSpellSlots(){
  const panel = document.getElementById('spellSlots');
  if(state.autoSlots) refreshAutoSlots();
  const auto = state.autoSlots;
  let html = `<div class="slot-mode">
    <span class="slot-mode-label">${auto?'⚙ Auto-filled from class levels':'✎ Manual entry'}</span>
    <button class="pbtn slot-mode-btn" id="slotModeBtn">${auto?'Switch to manual':'Switch to auto'}</button>
  </div>`;
  html += state.spellSlots.map((slot,idx)=> slotRow('Level '+(idx+1), slot, String(idx))).join('');
  if(state.pactSlots && state.pactSlots.total>0){
    html += slotRow(`Pact · Lv ${state.pactSlots.level}`, state.pactSlots, 'pact', 'pact-row');
    html += `<div class="import-note">Pact slots cast at level ${state.pactSlots.level} and recharge on a short rest.</div>`;
  }
  panel.innerHTML = html;

  document.getElementById('slotModeBtn').addEventListener('click', ()=>{
    state.autoSlots = !state.autoSlots;
    if(state.autoSlots) refreshAutoSlots();
    buildSpellSlots(); buildActions(); save();
  });
  if(!auto){
    panel.querySelectorAll('input.total').forEach(inp=>{
      inp.addEventListener('input', e=>{
        const lvl = e.target.dataset.lvl;
        state.spellSlots[lvl].total = Math.max(0, parseInt(e.target.value)||0);
        if(state.spellSlots[lvl].used > state.spellSlots[lvl].total) state.spellSlots[lvl].used = state.spellSlots[lvl].total;
        buildSpellSlots(); buildActions(); save();
      });
    });
  }
  panel.querySelectorAll('.slot-pip').forEach(p=>{
    p.addEventListener('click', e=>{
      const key = e.target.dataset.lvl, idx = parseInt(e.target.dataset.p);
      const slot = key==='pact' ? state.pactSlots : state.spellSlots[key];
      slot.used = (idx < slot.used) ? idx : idx+1;
      buildSpellSlots(); buildActions(); save();
    });
  });
}

function levelLabel(lvl){ return lvl===0 ? 'Cantrip' : 'Level '+lvl; }

// <option> list for spell-level dropdowns: 0 renders as "Cantrip".
function levelOptions(selected){
  return Array.from({length:10},(_,i)=>
    `<option value="${i}" ${i===Number(selected)?'selected':''}>${levelLabel(i)}</option>`).join('');
}

// Fill the static spell-level dropdowns (Library import + custom spell row).
function buildSpellLevelSelects(){
  ['splLevel','customSpellLevel'].forEach(id=>{
    const sel = document.getElementById(id);
    if(sel && !sel.options.length) sel.innerHTML = levelOptions(0);
  });
}

// ---------- Tag pickers (dropdown + removable chips) ----------
// Tags are chosen from a dropdown instead of typed. The option list is the
// default set plus every tag already used on an imported or known spell.
const DEFAULT_SPELL_TAGS = ['5E','5E (legacy)','5.5E','Homebrew'];
const tagPickerState = {}; // container id -> currently selected tags

function allSpellTags(){
  const tags = new Set(DEFAULT_SPELL_TAGS);
  Object.values(CUSTOM_SPELLS).forEach(s=> (s.tags||[]).forEach(t=>tags.add(t)));
  (state.knownSpells||[]).forEach(s=> (Array.isArray(s.tags)?s.tags:[]).forEach(t=>tags.add(t)));
  Object.values(tagPickerState).forEach(sel=> sel.forEach(t=>tags.add(t)));
  return [...tags].sort((a,b)=>a.localeCompare(b));
}

function buildTagPicker(id){
  const box = document.getElementById(id);
  if(!box) return;
  const selected = tagPickerState[id] || (tagPickerState[id]=[]);
  const options = allSpellTags().filter(t=>!selected.includes(t));
  box.innerHTML =
    selected.map((t,i)=>`<span class="picker-tag">${esc(t)}<span class="tag-del" data-i="${i}" title="Remove tag">✕</span></span>`).join('')
    + `<select class="tag-select"><option value="">+ tag…</option>${options.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join('')}</select>`;
  box.querySelector('.tag-select').addEventListener('change', e=>{
    if(e.target.value){ selected.push(e.target.value); buildTagPicker(id); }
  });
  box.querySelectorAll('.tag-del').forEach(x=>x.addEventListener('click', e=>{
    selected.splice(parseInt(e.target.dataset.i),1); buildTagPicker(id);
  }));
}
function setTagPicker(id, tags){ tagPickerState[id] = [...(tags||[])]; buildTagPicker(id); }
function getTagPicker(id){ return [...(tagPickerState[id]||[])]; }
function refreshTagPickers(){ Object.keys(tagPickerState).forEach(buildTagPicker); }

function isKnown(name){
  return state.knownSpells.some(s=>s.name.toLowerCase()===name.toLowerCase());
}

// Imported spells that belong to a class's library: an explicit class list
// restricts them; an empty/missing list makes them available to every class.
function customSpellsForClass(className){
  return Object.entries(CUSTOM_SPELLS)
    .filter(([,s])=> !(Array.isArray(s.classes) && s.classes.length) || s.classes.includes(className))
    .map(([name,s])=>({ name, level: Number(s.level)||0, imported:true, spell:s }));
}

function spellClassNames(){
  const fromCustoms = Object.values(CUSTOM_SPELLS).flatMap(s=> Array.isArray(s.classes)?s.classes:[]);
  return [...new Set([...SPELL_CLASSES, ...fromCustoms])].sort();
}

function buildSpellClassSelect(){
  const sel = document.getElementById('spellClassSelect');
  if(!sel) return;
  sel.innerHTML = spellClassNames().map(c=>`<option value="${esc(c)}" ${c===state.spellClass?'selected':''}>${esc(c)}</option>`).join('');
  sel.onchange = e=>{
    state.spellClass = e.target.value;
    buildSpellLibrary(); save();
  };
}

// Resolve a spell's detail from imported data first, then the built-in
// reference (SPELL_DETAILS + SPELL_DATA). Used by both the row markers and the
// detail popup so the Spells and Actions tabs describe a spell identically.
function spellInfo(name){
  const imp = CUSTOM_SPELLS[name];
  const bi = imp ? null : builtinSpellInfo(name);
  return { imp, bi, det: imp || bi || {}, kind: imp ? 'imported' : (bi ? 'built-in' : 'homebrew') };
}

// Concentration isn't a structured field on built-ins, so sniff the duration
// and description text (imported spells often say "Concentration, up to …").
function spellNeedsConcentration(det){
  return /concentration/i.test([det.duration, det.desc].filter(Boolean).join(' '));
}

// Small at-a-glance markers on a spell row: concentration and the components
// ("need") you have to supply. The mini legend under each list explains them.
function spellRowMarkers(name){
  const { det } = spellInfo(name);
  let out = '';
  if(spellNeedsConcentration(det))
    out += '<span class="spell-mark conc" title="Concentration — you must keep concentration or the spell ends">◈ Conc</span>';
  if(det.components)
    out += `<span class="spell-mark comp" title="Components you need to cast this spell">${esc(det.components)}</span>`;
  return out;
}

// Build a Notes-search-style popup entry for a single spell so the Spells and
// Actions tabs can open the exact same detail popup as the reference search.
function spellDetailEntry(name, fallbackLevel){
  const { imp, bi, det, kind } = spellInfo(name);
  const level = imp ? (Number(imp.level)||0) : (bi ? bi.level : (Number(fallbackLevel)||0));
  const classes = imp
    ? (Array.isArray(imp.classes) && imp.classes.length ? imp.classes : ['every class'])
    : (bi ? bi.classes : []);
  const bits = [det.school, det.castingTime&&'cast '+det.castingTime, det.range&&'range '+det.range,
    det.components&&'needs '+det.components, det.duration&&'duration '+det.duration].filter(Boolean).join(' · ');
  const conc = spellNeedsConcentration(det);
  return {
    name,
    badges: [levelLabel(level), imp?imp.source:null, kind, conc?'concentration':null].filter(Boolean),
    full: `<div class="nr-meta">${esc(levelLabel(level))}${classes.length?' · '+esc(classes.join(', ')):''}</div>
       ${bits?`<div class="nr-meta">${esc(bits)}</div>`:''}
       ${(det.tags||[]).length?`<div class="nr-meta">tags: ${esc(det.tags.join(', '))}</div>`:''}
       ${det.desc
         ? `<div class="feat-desc">${esc(det.desc)}</div>`
         : '<div class="feat-desc">No description on file — this is a name-only spell. Import it in the Library to add details.</div>'}`,
    edit: editLink('spell', name, 'Edit spell in Library')
  };
}

function openSpellDetail(name, level){
  openNotesModal(spellDetailEntry(name, level));
}

function buildSpellLibrary(){
  const container = document.getElementById('spellLibraryList');
  if(!container) return;
  const query = (document.getElementById('spellSearch').value || '').toLowerCase();
  const customs = customSpellsForClass(state.spellClass);
  const customNames = new Set(customs.map(s=>s.name.toLowerCase()));
  // Imported spells shadow built-ins with the same name.
  const builtins = (SPELL_DATA[state.spellClass] || []).filter(s=>!customNames.has(s.name.toLowerCase()));
  const list = [...builtins, ...customs].filter(s => s.name.toLowerCase().includes(query));
  if(list.length===0){
    container.innerHTML = '<div class="spell-lib-empty">No spells match.</div>';
    return;
  }
  const byLevel = {};
  list.forEach(s=>{ (byLevel[s.level] = byLevel[s.level]||[]).push(s); });
  const levels = Object.keys(byLevel).map(Number).sort((a,b)=>a-b);
  let html='';
  levels.forEach(lvl=>{
    html += `<div class="spell-lib-group-label">${levelLabel(lvl)}</div>`;
    byLevel[lvl].sort((a,b)=>a.name.localeCompare(b.name)).forEach(s=>{
      const already = isKnown(s.name);
      const meta = s.imported
        ? ` <span class="custom-tag">${esc(s.spell.source||'Imported')}</span>`
        : '';
      html += `<div class="spell-lib-item">
        <span class="spell-info" data-name="${esc(s.name)}" data-level="${lvl}" title="Click for full details">
          <span class="spell-name-link">${esc(s.name)}</span>${meta}${spellRowMarkers(s.name)}
        </span>
        <span class="spell-add-btn ${already?'added':''}" data-name="${esc(s.name)}" data-level="${lvl}">${already?'Added':'+ Add'}</span>
      </div>`;
    });
  });
  container.innerHTML = html + spellLegendHtml();
  container.querySelectorAll('.spell-info').forEach(el=>{
    el.addEventListener('click', ()=> openSpellDetail(el.dataset.name, parseInt(el.dataset.level)));
  });
  container.querySelectorAll('.spell-add-btn:not(.added)').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const name = e.target.dataset.name, level = parseInt(e.target.dataset.level);
      if(!isKnown(name)){
        const imp = CUSTOM_SPELLS[name];
        state.knownSpells.push({name, level, custom:!!imp, tags: (imp && Array.isArray(imp.tags)) ? imp.tags : []});
        buildSpellLibrary(); buildKnownSpells(); save();
      }
    });
  });
}

// Shared mini legend appended under each spell list, explaining the row markers
// and that a click opens the full "what it does" description.
function spellLegendHtml(){
  return `<div class="spell-legend">
    <span class="spell-legend-item"><span class="spell-mark conc">◈ Conc</span> needs concentration</span>
    <span class="spell-legend-item"><span class="spell-mark comp">V·S·M</span> components you need</span>
    <span class="spell-legend-item"><span class="spell-legend-tip">click a spell</span> what it does</span>
  </div>`;
}

function buildKnownSpells(){
  const container = document.getElementById('knownSpellsList');
  const granted = equipmentGrantedSpells();
  if(state.knownSpells.length===0 && granted.length===0){
    container.innerHTML = '<div class="spell-lib-empty">No spells added yet — pick from the library above.</div>';
    return;
  }
  const byLevel = {};
  state.knownSpells.forEach((s,i)=>{ (byLevel[s.level] = byLevel[s.level]||[]).push({...s, idx:i}); });
  const levels = Object.keys(byLevel).map(Number).sort((a,b)=>a-b);
  let html='';
  levels.forEach(lvl=>{
    html += `<div class="known-spell-group-label">${levelLabel(lvl)}</div>`;
    byLevel[lvl].forEach(s=>{
      const spellTags = Array.isArray(s.tags) ? s.tags : [];
      html += `<div class="known-spell-item">
        <span class="spell-summary spell-info" data-name="${esc(s.name)}" data-level="${s.level}" title="Click for full details">
          <span class="spell-name-link">${esc(s.name)}</span>
          ${s.custom?'<span class="custom-tag">Homebrew</span>':''}
          ${spellRowMarkers(s.name)}
          ${spellTags.length ? `<span class="spell-tags">${spellTags.map(tag=>`<span class="spell-tag">${esc(tag)}</span>`).join('')}</span>` : ''}
        </span>
        <span class="spell-remove" data-idx="${s.idx}">✕</span>
      </div>`;
    });
  });
  if(granted.length){
    html += `<div class="known-spell-group-label">From Equipment</div>`;
    granted.sort((a,b)=>a.level-b.level || a.name.localeCompare(b.name)).forEach(s=>{
      html += `<div class="known-spell-item">
        <span class="spell-info" data-name="${esc(s.name)}" data-level="${s.level}" title="Click for full details">
          <span class="spell-name-link">${esc(s.name)}</span> <span class="custom-tag">${levelLabel(s.level)} · ${esc(s.from)}</span>${spellRowMarkers(s.name)}
        </span>
      </div>`;
    });
  }
  container.innerHTML = html + spellLegendHtml();
  container.querySelectorAll('.spell-info').forEach(el=>{
    el.addEventListener('click', ()=> openSpellDetail(el.dataset.name, parseInt(el.dataset.level)));
  });
  container.querySelectorAll('.spell-remove').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.knownSpells.splice(parseInt(e.target.dataset.idx),1);
      buildSpellLibrary(); buildKnownSpells(); save();
    });
  });
}

function addCustomSpellFromForm(){
  const nameEl = document.getElementById('customSpellName');
  const lvlEl = document.getElementById('customSpellLevel');
  const name = nameEl?.value.trim();
  if(!name) return false;
  const level = Math.max(0, Math.min(9, parseInt(lvlEl?.value, 10) || 0));
  state.knownSpells.push({ name, level, custom:true, tags: getTagPicker('customSpellTagPicker') });
  if(nameEl) nameEl.value = '';
  if(lvlEl) lvlEl.value = '0';
  setTagPicker('customSpellTagPicker', []);
  buildSpellLibrary();
  buildKnownSpells();
  save();
  return true;
}

// ---------- Class & Settings (multiclass) ----------
// Migrate older single-class saves into the classes array.
function ensureClasses(){
  if(!Array.isArray(state.classes)) state.classes = [];
  if(state.classes.length===0 && state.class){
    const base = state.class.split(' / ')[0];
    if(CLASS_DATA[base]) state.classes = [{name: base, level: state.level||1}];
  }
}

function pickedClasses(){
  ensureClasses();
  return state.classes.filter(c=>c.name && CLASS_DATA[c.name]);
}

// Recompute everything derived from the class list: total level (drives
// proficiency bonus), joined class string, primary-class saves, hit dice
// pools, and the default spell library.
function applyClassesToState(){
  const picked = pickedClasses();
  state.level = Math.max(1, picked.reduce((s,c)=>s+(c.level||1), 0));
  state.class = picked.map(c=>c.name).join(' / ');
  const primary = picked[0] && CLASS_DATA[picked[0].name];
  ABILITIES.forEach(a=> state.saveProf[a.key] = primary ? primary.saves.includes(a.key) : false);
  if(picked.length){
    const dice = {};
    picked.forEach(c=>{ const d='d'+CLASS_DATA[c.name].hitDie; dice[d]=(dice[d]||0)+(c.level||1); });
    state.hitDice = Object.entries(dice).map(([d,n])=>n+d).join(' + ');
    document.getElementById('hitDice').value = state.hitDice;
    const caster = picked.find(c=> SPELL_DATA[c.name]);
    if(caster) state.spellClass = caster.name;
  }
  refreshAutoSlots();
}

function updateHero(){
  document.getElementById('heroName').textContent = state.name || 'Unnamed Adventurer';
  const picked = pickedClasses();
  const clsText = picked.length
    ? picked.map(c=>`${c.name} ${c.level}`).join(' / ')
    : (state.class || '[no class]');
  const parts = ['Lv '+(state.level||1)+' '+clsText];
  if(state.race) parts.push(state.race);
  if(state.background) parts.push(state.background);
  if(state.alignment) parts.push(state.alignment);
  document.getElementById('heroSummary').innerHTML = parts.join('<span class="sep">//</span>');
  document.getElementById('heroXP').textContent = state.xp || 0;
}

function afterClassChange(){
  if(PAGE!=='sheet') return; // sheet-only refresh cascade
  applyClassesToState();
  buildClassList();
  renderClassInfoStack();
  buildSaves();
  buildSkills();
  buildSkillPicker();
  buildClassFeatures();
  buildSpellClassSelect();
  buildSpellLibrary();
  buildSpellSlots();
  buildActions();
  recalc(); save();
}

// ---------- Class source tags & filtering ----------
function sourceKey(src){ return src==='5E' ? '5e' : src==='5E (legacy)' ? '5eleg' : src==='5.5E' ? '55e' : 'homebrew'; }
function sourceTag(src){ return `<span class="src-tag src-${sourceKey(src)}">${src}</span>`; }

let classFilter = 'all';
// Class names matching the active source filter; the currently-selected class
// is always included so a filtered-out selection stays visible in its dropdown.
function classNamesForFilter(alwaysInclude){
  return Object.keys(CLASS_DATA).filter(n=>
    classFilter==='all' || CLASS_DATA[n].source===classFilter || n===alwaysInclude);
}

function buildClassFilterBar(){
  const bar = document.getElementById('classFilterBar');
  if(!bar) return;
  const opts = ['all', ...CLASS_SOURCES];
  bar.innerHTML = '<span class="filter-label">Filter</span>' + opts.map(o=>
    `<span class="filter-chip ${classFilter===o?'on':''}" data-f="${o}">${o==='all'?'All':o}</span>`).join('');
  bar.querySelectorAll('.filter-chip').forEach(chip=>chip.addEventListener('click',()=>{
    classFilter = chip.dataset.f;
    buildClassFilterBar();
    buildClassList();
  }));
}

function buildClassList(){
  ensureClasses();
  const wrap = document.getElementById('classList');
  if(!wrap) return;
  wrap.innerHTML='';
  state.classes.forEach((entry,i)=>{
    const taken = state.classes.filter((c,j)=>j!==i).map(c=>c.name);
    const names = classNamesForFilter(entry.name);
    const subs = entry.name ? subclassNamesForClass(entry.name) : [];
    const cd = CLASS_DATA[entry.name];
    const subLevel = cd ? cd.subclassLevel : 0;
    const subReady = cd && (entry.level||1) >= subLevel;
    const row = el('div','class-row');
    row.innerHTML = `
      <select class="mc-class" data-i="${i}">
        <option value="">— pick a class —</option>
        ${names.filter(n=>!taken.includes(n)).map(n=>
          `<option value="${n}" ${entry.name===n?'selected':''}>${n} · ${CLASS_DATA[n].source}</option>`).join('')}
      </select>
      <input class="mc-level" type="number" min="1" max="20" value="${entry.level||1}" data-i="${i}">
      ${i===0?'<span class="primary-tag">primary</span>':''}
      <span class="row-del mc-del" data-i="${i}">✕</span>
      ${subs.length ? `<select class="mc-subclass" data-i="${i}" title="${subReady?'':'unlocks at Lv '+subLevel}">
        <option value="">${subReady?'— subclass —':'— subclass (Lv '+subLevel+') —'}</option>
        ${subs.map(s=>`<option value="${esc(s)}" ${entry.subclass===s?'selected':''}>${esc(s)}${SUBCLASS_DATA[subKey(entry.name,s)]?' ✦':''}</option>`).join('')}
      </select>` : ''}
    `;
    wrap.appendChild(row);

    // Always present (possibly empty) so a level change can refill it in place
    // without rebuilding the row and stealing focus from the level input.
    const box = el('div','feat-choice-box');
    box.dataset.i = i;
    wrap.appendChild(box);
    renderFeatureChoices(i);
  });
  if(state.classes.length===0){
    wrap.innerHTML = '<div class="action-empty">No classes yet — add one below.</div>';
  }

  wrap.querySelectorAll('.mc-class').forEach(sel=>sel.addEventListener('change', e=>{
    state.classes[e.target.dataset.i].name = e.target.value;
    state.classes[e.target.dataset.i].subclass = ''; // reset subclass when class changes
    afterClassChange();
  }));
  wrap.querySelectorAll('.mc-subclass').forEach(sel=>sel.addEventListener('change', e=>{
    state.classes[e.target.dataset.i].subclass = e.target.value;
    buildClassList(); // the new subclass may bring its own choice prompts
    renderClassInfoStack();
    buildClassFeatures();
    buildActions();
    save();
  }));
  // Level edits keep focus: recompute derived state without rebuilding this list.
  wrap.querySelectorAll('.mc-level').forEach(inp=>inp.addEventListener('input', e=>{
    const lvl = Math.max(1, Math.min(20, parseInt(e.target.value)||1));
    state.classes[e.target.dataset.i].level = lvl;
    applyClassesToState();
    renderFeatureChoices(e.target.dataset.i); // a new level can unlock more choices
    renderClassInfoStack();
    buildClassFeatures();
    buildSpellSlots();
    buildActions();
    recalc(); save();
  }));
  wrap.querySelectorAll('.mc-del').forEach(btn=>btn.addEventListener('click', e=>{
    state.classes.splice(e.target.dataset.i, 1);
    afterClassChange();
  }));
}

// One-line description of when a class gets access to which spell levels.
function castingSummary(cd){
  if(!cd.casting) return null;
  const c = cd.casting;
  const ab = c.ability ? c.ability.toUpperCase() : '';
  let text = null;
  if(c.type==='full') text = `Full caster (${ab}). Spell levels: 1st@L1, 2nd@L3, 3rd@L5, 4th@L7, 5th@L9, 6th@L11, 7th@L13, 8th@L15, 9th@L17.`;
  else if(c.type==='half' && c.roundUp) text = `Half caster, rounded up (${ab}). Spell levels: 1st@L1, 2nd@L5, 3rd@L9, 4th@L13, 5th@L17.`;
  else if(c.type==='half') text = `Half caster (${ab}). Spell levels: 1st@L2, 2nd@L5, 3rd@L9, 4th@L13, 5th@L17.`;
  else if(c.type==='pact') text = `Pact magic (${ab}): slots refresh on a short rest. Slot level: 1st@L1, 2nd@L3, 3rd@L5, 4th@L7, 5th@L9; Mystic Arcanum adds 6th–9th at L11/13/15/17.`;
  if(c.note) text = text ? text+' '+c.note : c.note;
  return text;
}

// PHB multiclass prerequisite check against current ability scores.
function mcReqStatus(name){
  const req = MC_REQS[name];
  if(!req) return null;
  const met = req.some(opt=> Object.entries(opt).every(([k,v])=> (state.abilities[k]||0) >= v));
  const text = req.map(opt=> Object.entries(opt).map(([k,v])=>k.toUpperCase()+' '+v).join(' & ')).join(' or ');
  return {met, text};
}

// PHB multiclass spellcasting: full-caster levels + half of paladin/ranger levels.
// Warlock pact magic stacks separately.
function multiclassCasterLevel(picked){
  return picked.reduce((s,c)=>{
    const cast = CLASS_DATA[c.name] && CLASS_DATA[c.name].casting;
    if(!cast) return s;
    if(cast.type==='full') return s + (c.level||1);
    if(cast.type==='half') return s + (cast.roundUp ? Math.ceil((c.level||1)/2) : Math.floor((c.level||1)/2));
    return s;
  }, 0);
}

function classInfoCard(entry, showReq){
  const cd = CLASS_DATA[entry.name];
  const lvl = entry.level||1;
  const saveNames = cd.saves.map(k=>k.toUpperCase()).join(', ');
  const skills = cd.skills==='any' ? `any ${cd.choose} skills` : `choose ${cd.choose} from the dashed chips`;
  const spells = castingSummary(cd);
  const req = showReq ? mcReqStatus(entry.name) : null;

  const byLv = {};
  (cd.features||[]).forEach(f=>{ (byLv[f.lv]=byLv[f.lv]||[]).push(f.name); });
  const progRows = Object.keys(byLv).map(Number).sort((a,b)=>a-b).map(lv=>
    `<div class="ci-row ${lv<=lvl?'unlocked':''}"><span class="ci-key">lv_${String(lv).padStart(2,'0')}</span><span>${byLv[lv].join(', ')}</span></div>`
  ).join('');

  return `<div class="class-info">
    <div class="ci-title">${entry.name} — Lv ${lvl}${sourceTag(cd.source)}</div>
    <div class="ci-row"><span class="ci-key">hit_die</span><span>d${cd.hitDie} → ${lvl}d${cd.hitDie} from this class</span></div>
    <div class="ci-row"><span class="ci-key">save_prof</span><span>${saveNames}</span></div>
    <div class="ci-row"><span class="ci-key">skills</span><span>${skills}</span></div>
    ${(()=>{ const subs=subclassNamesForClass(entry.name); if(!subs.length) return ''; const chosen=entry.subclass;
      return `<div class="ci-row"><span class="ci-key">subclasses</span><span>choose at Lv ${cd.subclassLevel}: ${subs.map(s=> s===chosen?`<b class="sub-chosen">${esc(s)}</b>`:esc(s)).join(' · ')}</span></div>`; })()}
    ${spells?`<div class="ci-row"><span class="ci-key">spellcasting</span><span>${spells}</span></div>`:''}
    ${req?`<div class="ci-row"><span class="ci-key">mc_req</span><span class="${req.met?'req-ok':'req-bad'}">${req.text} — ${req.met?'✓ met':'✗ not met'}</span></div>`:''}
    <div class="ci-row"><span class="ci-key">source</span><span>${cd.custom ? 'Imported · '+cd.source : cd.homebrew ? 'World Anvil · Homebrew' : 'Official · '+cd.source}</span></div>
    ${progRows?`<div class="ci-prog-label">// ability progression — highlighted rows are unlocked at this class's level</div><div class="ci-prog">${progRows}</div>`:''}
    ${cd.desc?`<div class="ci-desc">${cd.desc}</div>`:''}
  </div>`;
}

function renderClassInfoStack(){
  const box = document.getElementById('classInfoStack');
  if(!box) return;
  document.getElementById('totalLevelDisplay').textContent = state.level||1;
  const picked = pickedClasses();
  if(!picked.length){
    box.innerHTML = '<div class="class-info"><div class="ci-desc">// no class selected — saves & skills fall back to raw ability modifiers</div></div>';
    return;
  }
  const multi = picked.length>1;
  let summary = '';
  if(multi){
    const casterLvl = multiclassCasterLevel(picked);
    const hasWarlock = picked.some(c=>c.name==='Warlock');
    summary = `<div class="class-info">
      <div class="ci-title">Multiclass — Lv ${state.level}</div>
      <div class="ci-row"><span class="ci-key">prof_bonus</span><span>+${profBonus(state.level)} (from total level ${state.level})</span></div>
      <div class="ci-row"><span class="ci-key">hit_dice</span><span>${state.hitDice}</span></div>
      <div class="ci-row"><span class="ci-key">save_prof</span><span>from primary class only (${picked[0].name})</span></div>
      ${casterLvl>0?`<div class="ci-row"><span class="ci-key">mc_caster</span><span>combined caster level ${casterLvl} — use the PHB multiclass slot table${hasWarlock?'; Warlock pact slots stack separately':''}</span></div>`:''}
    </div>`;
  }
  box.innerHTML = summary + picked.map(entry=> classInfoCard(entry, multi)).join('');
}

function buildSkillPicker(){
  const picked = pickedClasses();
  const primary = picked[0] && CLASS_DATA[picked[0].name];
  const hint = document.getElementById('skillHint');
  const parts = [];
  if(primary && primary.skills!=='any'){
    parts.push(`<span class="hl">${picked[0].name}</span> (primary) grants <span class="hl">${primary.choose}</span> picks from the dashed chips.${picked.length>1?' Multiclass dips grant fewer skills (PHB).':''}`);
  } else if(primary){
    parts.push(`<span class="hl">${picked[0].name}</span> (primary) grants <span class="hl">${primary.choose}</span> picks from any skill.`);
  }
  const grantedNames = SKILLS.map(s=>s.name).filter(n=>grantedSkillSources(n).length);
  if(grantedNames.length){
    parts.push(`Solid chips are <span class="hl">granted automatically</span> by your species / background (${grantedNames.map(esc).join(', ')}).`);
  }
  parts.push('Any other chip can be toggled for proficiencies from feats or DM fiat — click <span class="hl">?</span> above for the legend.');
  if(hint) hint.innerHTML = parts.join(' ');
  const wrap = document.getElementById('skillPicker');
  if(!wrap) return;
  wrap.innerHTML='';
  SKILLS.forEach((s,i)=>{
    const key='sk'+i;
    if(!(key in state.skillProf)) state.skillProf[key]=false;
    const fromClass = picked.some(c=>{
      const cd = CLASS_DATA[c.name];
      return cd.skills!=='any' && cd.skills.includes(s.name);
    });
    const granted = grantedSkillSources(s.name);
    const chip = el('div', 'skill-chip'
      + (state.skillProf[key]||granted.length ? ' on':'')
      + (fromClass ? ' classpick':'')
      + (granted.length ? ' granted':''));
    chip.innerHTML = `${s.name}<span class="chip-abbr">${s.ability}</span>`
      + granted.map(g=>`<span class="chip-grant">${esc(g.kind)}</span>`).join('');
    if(granted.length){
      // Granted proficiencies are locked on — remove the source to remove them.
      chip.title = granted.map(g=>`Granted by your ${g.kind} — ${g.by}`).join('; ');
      chip.addEventListener('click', ()=>{
        chip.classList.add('shake');
        setTimeout(()=>chip.classList.remove('shake'), 350);
      });
    } else {
      chip.addEventListener('click', ()=>{
        state.skillProf[key] = !state.skillProf[key];
        chip.classList.toggle('on', state.skillProf[key]);
        buildSkills(); recalc(); save();
      });
    }
    wrap.appendChild(chip);
  });
}

// ---------- Feature choices ----------
// A feature with a `choices` list is a pick-one, offered on both the Features
// tab (inline on the feature) and the Settings tab (under its class row).
// The pick is stored per class entry in state.classes[i].featureChoices, keyed
// owner::feature (owner is the class or subclass granting it). A stored value is
// either the option name (a listed choice) or {custom:true, name, desc} for an
// "Other…" entry the player wrote themselves.
const CHOICE_OTHER = '__other';

function featureChoiceKey(owner, name){ return owner + '::' + name; }

function hasChoices(f){ return Array.isArray(f.choices) && f.choices.length > 0; }

function normalizeChoice(v){
  if(!v) return null;
  if(typeof v === 'string') return { name:v, desc:'', custom:false };
  return { name: v.name||'', desc: v.desc||'', custom: !!v.custom };
}

function chosenFeatureOption(entry, owner, f){
  return normalizeChoice((entry.featureChoices || {})[featureChoiceKey(owner, f.name)]);
}

// Reference detail for a listed option. Only fighting styles have a table today;
// anything else is a bare name and previews as nothing.
function choiceInfo(name){ return fightingStyleByName(name); }

// The description and class availability shown under a picked option.
function choicePreviewHtml(choice){
  if(!choice || !choice.name) return '';
  if(choice.custom){
    return choice.desc ? `<div class="feat-desc">${esc(choice.desc)}</div>` : '';
  }
  const info = choiceInfo(choice.name);
  if(!info) return '';
  return `<div class="feat-desc">${esc(info.desc)}</div>
    <div class="nr-meta">Available to: ${esc(info.classes.join(', '))}</div>`;
}

// Every choice-offering feature unlocked at this entry's level, from the class
// and its selected subclass.
function choiceFeaturesFor(entry){
  const out = [];
  const cd = CLASS_DATA[entry.name];
  if(!cd) return out;
  const lvl = entry.level || 1;
  const collect = (owner, feats)=> (feats||[]).forEach(f=>{
    if(hasChoices(f) && f.lv <= lvl) out.push({ owner, f, key: featureChoiceKey(owner, f.name) });
  });
  collect(entry.name, cd.features);
  if(entry.subclass){
    const sc = SUBCLASS_DATA[subKey(entry.name, entry.subclass)];
    if(sc) collect(entry.subclass, sc.features);
  }
  return out;
}

// Drop picks that no longer belong to the entry's class/subclass, or whose stored
// option is no longer offered. Level is ignored on purpose: dropping to a lower
// level shouldn't discard a pick the character makes again on the way back up.
function pruneFeatureChoices(entry){
  const fc = entry.featureChoices;
  if(!fc) return;
  const valid = new Map();
  const collect = (owner, feats)=> (feats||[]).forEach(f=>{
    if(hasChoices(f)) valid.set(featureChoiceKey(owner, f.name), f.choices);
  });
  const cd = CLASS_DATA[entry.name];
  if(cd) collect(entry.name, cd.features);
  if(entry.subclass){
    const sc = SUBCLASS_DATA[subKey(entry.name, entry.subclass)];
    if(sc) collect(entry.subclass, sc.features);
  }
  Object.keys(fc).forEach(k=>{
    const opts = valid.get(k);
    if(!opts){ delete fc[k]; return; } // the feature itself is gone
    const c = normalizeChoice(fc[k]);
    // A custom "Other…" pick is the player's own text — keep it as long as the
    // feature exists. A listed pick only survives while it's still offered.
    if(!c || (!c.custom && !opts.includes(c.name))) delete fc[k];
  });
  if(!Object.keys(fc).length) delete entry.featureChoices;
}

// Fill one class row's choice box with a pick-one control per unlocked
// choice-feature. Re-rendered on its own so level edits keep the list stable.
function renderFeatureChoices(i){
  const entry = state.classes[i];
  const box = document.querySelector(`.feat-choice-box[data-i="${i}"]`);
  if(!box || !entry) return;
  pruneFeatureChoices(entry);
  box.innerHTML = choiceFeaturesFor(entry).map(cf=>
    choiceControlHtml(i, cf, chosenFeatureOption(entry, cf.owner, cf.f), true)).join('');
  bindFeatureChoiceControls(box);
}

// One pick-one control: the dropdown, the "Other…" name/description fields, and
// the preview of whatever is currently picked. Shared by the Features and
// Settings tabs; `i` indexes state.classes. `showLabel` is for Settings, where
// the feature name isn't already on screen.
function choiceControlHtml(i, cf, choice, showLabel){
  const isCustom = !!(choice && choice.custom);
  const sel = choice ? (isCustom ? CHOICE_OTHER : choice.name) : '';
  return `<div class="feat-choice-ctl${choice && choice.name ? '' : ' pending'}">
    <div class="fc-head">
      ${showLabel ? `<label class="feat-choice-label" title="${esc(cf.f.desc||'')}">
        ${esc(cf.f.name)} <span class="chip-abbr">${esc(cf.owner)} · Lv ${cf.f.lv}</span>
      </label>` : ''}
      <select class="feat-choice" data-i="${i}" data-key="${esc(cf.key)}">
        <option value="">— choose —</option>
        ${cf.f.choices.map(c=>`<option value="${esc(c)}" ${sel===c?'selected':''}>${esc(c)}</option>`).join('')}
        <option value="${CHOICE_OTHER}" ${isCustom?'selected':''}>Other…</option>
      </select>
    </div>
    <div class="feat-choice-custom" ${isCustom?'':'hidden'}>
      <input class="fc-name" placeholder="Name" value="${esc(isCustom ? choice.name : '')}">
      <textarea class="fc-desc" placeholder="What does it do?">${esc(isCustom ? choice.desc : '')}</textarea>
    </div>
    <div class="feat-choice-preview">${choicePreviewHtml(choice)}</div>
  </div>`;
}

function bindFeatureChoiceControls(scope){
  scope.querySelectorAll('.feat-choice').forEach(sel=> sel.addEventListener('change', onFeatureChoiceChange));
  scope.querySelectorAll('.fc-name, .fc-desc').forEach(inp=> inp.addEventListener('input', onCustomChoiceInput));
}

// Update one control in place. Never re-renders the select — that would drop
// focus while the player is still working in it.
function refreshChoiceControl(ctl, choice){
  if(!ctl) return;
  const isCustom = !!(choice && choice.custom);
  const custom = ctl.querySelector('.feat-choice-custom');
  if(custom){
    custom.hidden = !isCustom;
    if(isCustom){
      custom.querySelector('.fc-name').value = choice.name || '';
      custom.querySelector('.fc-desc').value = choice.desc || '';
    }
  }
  const preview = ctl.querySelector('.feat-choice-preview');
  if(preview) preview.innerHTML = choicePreviewHtml(choice);
  ctl.classList.toggle('pending', !choice || !choice.name);
}

function onFeatureChoiceChange(e){
  const sel = e.target;
  const entry = state.classes[sel.dataset.i];
  if(!entry) return;
  const key = sel.dataset.key;
  entry.featureChoices = entry.featureChoices || {};
  if(sel.value === CHOICE_OTHER){
    // Keep whatever custom text was already there when re-picking Other…
    const prev = normalizeChoice(entry.featureChoices[key]);
    const keep = prev && prev.custom ? prev : { name:'', desc:'' };
    entry.featureChoices[key] = { custom:true, name: keep.name, desc: keep.desc };
  } else if(sel.value){
    entry.featureChoices[key] = sel.value;
  } else {
    delete entry.featureChoices[key];
  }
  const ctl = sel.closest('.feat-choice-ctl');
  const choice = normalizeChoice(entry.featureChoices[key]);
  refreshChoiceControl(ctl, choice);
  if(choice && choice.custom) ctl.querySelector('.fc-name').focus();
  buildActions();
  save();
}

// Typing in the Other… fields updates state and the preview only — re-rendering
// the surrounding list mid-keystroke would steal focus. The other tab picks the
// change up when it's next opened (see bindTabs).
function onCustomChoiceInput(e){
  const ctl = e.target.closest('.feat-choice-ctl');
  const sel = ctl.querySelector('.feat-choice');
  const entry = state.classes[sel.dataset.i];
  if(!entry || !entry.featureChoices) return;
  const key = sel.dataset.key;
  const cur = normalizeChoice(entry.featureChoices[key]);
  if(!cur || !cur.custom) return;
  entry.featureChoices[key] = {
    custom: true,
    name: ctl.querySelector('.fc-name').value.trim(),
    desc: ctl.querySelector('.fc-desc').value.trim()
  };
  const choice = normalizeChoice(entry.featureChoices[key]);
  const preview = ctl.querySelector('.feat-choice-preview');
  if(preview) preview.innerHTML = choicePreviewHtml(choice);
  ctl.classList.toggle('pending', !choice.name);
  save();
}

// `ctx` ({i, owner}) turns on the inline picker; without it the feature renders
// read-only (the Library's detail popups pass nothing).
function featItem(f, choice, ctx){
  const showPicker = ctx && hasChoices(f);
  return `<div class="feat-item">
    <div class="feat-head">
      <span class="f-lvl">LV ${f.lv}</span>
      <span class="f-name">${esc(f.name)}</span>
      ${f.use && f.use!=='passive' ? `<span class="action-badge">${esc(f.use)}${f.cost?' · '+esc(f.cost):''}</span>`:''}
      ${hasChoices(f) && !showPicker && choice && choice.name ? `<span class="choice-badge">${esc(choice.name)}</span>` : ''}
    </div>
    ${f.desc?`<div class="feat-desc">${esc(f.desc)}</div>`:''}
    ${showPicker ? choiceControlHtml(ctx.i, { key: featureChoiceKey(ctx.owner, f.name), owner: ctx.owner, f }, choice, false) : ''}
  </div>`;
}

function buildClassFeatures(){
  const box = document.getElementById('classFeaturesList');
  if(!box) return;
  const picked = pickedClasses();
  if(!picked.length){
    box.innerHTML = '<div class="action-empty">Select a class in Settings to see its features here.</div>';
    return;
  }
  box.innerHTML = picked.map(entry=>{
    const cd = CLASS_DATA[entry.name];
    const lvl = entry.level||1;
    const all = cd.features||[];
    const feats = all.filter(f=>f.lv<=lvl);
    const upcoming = all.length - feats.length;
    // The picker writes back to state.classes, so it needs that array's index —
    // pickedClasses() is filtered, so its own index would be wrong.
    const ci = state.classes.indexOf(entry);
    pruneFeatureChoices(entry);
    let html = `<div class="known-spell-group-label">${esc(entry.name)} ${entry.level}</div>`
      + (feats.length ? feats.map(f=>featItem(f, chosenFeatureOption(entry, entry.name, f), { i:ci, owner:entry.name })).join('') : '<div class="action-empty">No features at this level.</div>')
      + (upcoming>0?`<div class="action-empty">+ ${upcoming} more at higher ${esc(entry.name)} levels.</div>`:'');
    // Chosen subclass features (imported detail, gated by class level).
    if(entry.subclass){
      const sc = SUBCLASS_DATA[subKey(entry.name, entry.subclass)];
      html += `<div class="subclass-label">↳ ${esc(entry.subclass)}${sc?' '+sourceTag(sc.source):''}</div>`;
      const sfeatsAll = (sc && sc.features) || [];
      if(sfeatsAll.length){
        const sfeats = sfeatsAll.filter(f=>f.lv<=lvl);
        const sUpcoming = sfeatsAll.length - sfeats.length;
        html += (sfeats.length ? sfeats.map(f=>featItem(f, chosenFeatureOption(entry, entry.subclass, f), { i:ci, owner:entry.subclass })).join('') : '<div class="action-empty">No subclass features unlocked at this level yet.</div>')
          + (sUpcoming>0?`<div class="action-empty">+ ${sUpcoming} more at higher levels.</div>`:'');
      } else {
        html += '<div class="action-empty">No feature detail imported — add it on the Library tab.</div>';
      }
    }
    return html;
  }).join('');
  bindFeatureChoiceControls(box);
}

// ---------- Actions tab (derived from attacks, spells, and inventory) ----------
// A spell of level L can be cast using any unspent slot of level L or higher.
function slotsRemainingAtOrAbove(level){
  let n=0;
  for(let i=level-1;i<9;i++) n += Math.max(0, state.spellSlots[i].total - state.spellSlots[i].used);
  const pact = state.pactSlots;
  if(pact && pact.level>=level) n += Math.max(0, pact.total - pact.used);
  return n;
}

function buildEquipment(){
  const wrap = document.getElementById('equipmentList');
  if(!wrap) return;
  const list = equipList();
  if(list.length===0){
    wrap.innerHTML = '<div class="action-empty">No equipment yet — add a weapon, armor, or magic item below.</div>';
    return;
  }
  wrap.innerHTML = list.map((it,i)=>{
    const ab = it.abilities||{}, atk = it.attack||{};
    return `<div class="equip-card ${it.equipped?'equipped':''}">
      <div class="equip-head">
        <label class="equip-toggle"><input type="checkbox" class="eq-equipped" data-i="${i}" ${it.equipped?'checked':''}><span>Equipped</span></label>
        <input class="eq-name" data-i="${i}" value="${esc(it.name)}" placeholder="Item name (e.g. Longsword +1)">
        <span class="row-del eq-del" data-i="${i}">✕</span>
      </div>
      <textarea class="eq-desc" data-i="${i}" placeholder="Description…">${esc(it.description)}</textarea>
      <div class="eq-effects">
        <div class="eq-field-group">
          <span class="eq-lbl">Attack</span>
          <input class="eq-atk-bonus" data-i="${i}" value="${esc(atk.bonus)}" placeholder="+6 hit">
          <input class="eq-atk-dmg" data-i="${i}" value="${esc(atk.dmg)}" placeholder="1d8+4 slashing">
        </div>
        <div class="eq-field-group">
          <span class="eq-lbl">Armor</span>
          <input class="eq-ac" data-i="${i}" value="${esc(it.ac)}" placeholder="+2 (shield) or =16 (heavy armor)" style="width:220px;">
        </div>
        <div class="eq-field-group">
          <span class="eq-lbl">Ability</span>
          ${ABILITIES.map(a=>`<label class="eq-ab"><span>${a.key.toUpperCase()}</span><input class="eq-abil" data-i="${i}" data-k="${a.key}" value="${esc(ab[a.key])}" placeholder="—"></label>`).join('')}
        </div>
        <div class="eq-field-group">
          <span class="eq-lbl">Skills</span>
          <div class="eq-skill-list">${(it.skills||[]).map((s,si)=>`<span class="eq-chip">${esc(s.name)} ${fmt(Number(s.bonus)||0)}<span class="eq-skill-del" data-i="${i}" data-si="${si}">✕</span></span>`).join('')}</div>
          <select class="eq-skill-pick" data-i="${i}"><option value="">skill…</option>${SKILLS.map(s=>`<option>${s.name}</option>`).join('')}</select>
          <input class="eq-skill-bonus" data-i="${i}" type="number" placeholder="±" style="width:56px;">
          <button class="add-btn eq-skill-add" data-i="${i}">Add</button>
        </div>
        <div class="eq-field-group">
          <span class="eq-lbl">Spells</span>
          <div class="eq-spell-list">${(it.spells||[]).map((sp,si)=>`<span class="eq-chip">${esc(sp.name)} <em>${sp.level==0?'C':'L'+sp.level}</em><span class="eq-spell-del" data-i="${i}" data-si="${si}">✕</span></span>`).join('')}</div>
          <input class="eq-spell-name" data-i="${i}" placeholder="Granted spell">
          <select class="eq-spell-lvl" data-i="${i}" style="width:110px;">${levelOptions(0)}</select>
          <button class="add-btn eq-spell-add" data-i="${i}">Add</button>
        </div>
      </div>
    </div>`;
  }).join('');
  bindEquipList(wrap);
}

// Re-derive everything equipped gear can affect. Also used by the tab modules.
function refreshEffects(){ recalc(); buildActions(); buildKnownSpells(); buildEquipAttackList(); buildInventory(); }

function bindEquipList(wrap){
  const list = equipList();
  // In-place text edits: update state without rebuilding (preserve focus).
  wrap.querySelectorAll('.eq-name').forEach(inp=>inp.addEventListener('input', e=>{
    list[e.target.dataset.i].name = e.target.value; buildActions(); buildEquipAttackList(); buildInventory(); save();
  }));
  wrap.querySelectorAll('.eq-desc').forEach(inp=>inp.addEventListener('input', e=>{
    list[e.target.dataset.i].description = e.target.value; save();
  }));
  wrap.querySelectorAll('.eq-atk-bonus').forEach(inp=>inp.addEventListener('input', e=>{
    const it=list[e.target.dataset.i]; it.attack=it.attack||{}; it.attack.bonus=e.target.value;
    buildActions(); buildEquipAttackList(); save();
  }));
  wrap.querySelectorAll('.eq-atk-dmg').forEach(inp=>inp.addEventListener('input', e=>{
    const it=list[e.target.dataset.i]; it.attack=it.attack||{}; it.attack.dmg=e.target.value;
    buildActions(); buildEquipAttackList(); save();
  }));
  wrap.querySelectorAll('.eq-abil').forEach(inp=>inp.addEventListener('input', e=>{
    const it=list[e.target.dataset.i]; it.abilities=it.abilities||{}; it.abilities[e.target.dataset.k]=e.target.value;
    recalc(); save();
  }));
  wrap.querySelectorAll('.eq-ac').forEach(inp=>inp.addEventListener('input', e=>{
    list[e.target.dataset.i].ac = e.target.value;
    recalc(); save();
  }));
  // Structural edits: rebuild the list.
  wrap.querySelectorAll('.eq-equipped').forEach(inp=>inp.addEventListener('change', e=>{
    list[e.target.dataset.i].equipped = e.target.checked; buildEquipment(); refreshEffects(); save();
  }));
  wrap.querySelectorAll('.eq-del').forEach(btn=>btn.addEventListener('click', e=>{
    list.splice(e.target.dataset.i,1); buildEquipment(); refreshEffects(); save();
  }));
  wrap.querySelectorAll('.eq-skill-add').forEach(btn=>btn.addEventListener('click', e=>{
    const card=e.target.closest('.equip-card');
    const name=card.querySelector('.eq-skill-pick').value;
    const bonus=parseInt(card.querySelector('.eq-skill-bonus').value,10);
    if(!name || isNaN(bonus)) return;
    const it=list[e.target.dataset.i]; it.skills=it.skills||[]; it.skills.push({name,bonus});
    buildEquipment(); refreshEffects(); save();
  }));
  wrap.querySelectorAll('.eq-skill-del').forEach(x=>x.addEventListener('click', e=>{
    list[e.target.dataset.i].skills.splice(e.target.dataset.si,1); buildEquipment(); refreshEffects(); save();
  }));
  wrap.querySelectorAll('.eq-spell-add').forEach(btn=>btn.addEventListener('click', e=>{
    const card=e.target.closest('.equip-card');
    const name=card.querySelector('.eq-spell-name').value.trim();
    if(!name) return;
    const level=Math.max(0,Math.min(9,parseInt(card.querySelector('.eq-spell-lvl').value,10)||0));
    const it=list[e.target.dataset.i]; it.spells=it.spells||[]; it.spells.push({name,level});
    buildEquipment(); buildActions(); buildKnownSpells(); save();
  }));
  wrap.querySelectorAll('.eq-spell-del').forEach(x=>x.addEventListener('click', e=>{
    list[e.target.dataset.i].spells.splice(e.target.dataset.si,1);
    buildEquipment(); buildActions(); buildKnownSpells(); save();
  }));
}

// Read-only mirror of equipped weapons under the Character-tab attacks table.
function buildEquipAttackList(){
  const box = document.getElementById('equipAttackList');
  if(!box) return;
  const atks = equipmentAttacks();
  box.innerHTML = atks.length
    ? '<div class="equip-atk-head">From equipped gear</div>' + atks.map(a=>
        `<div class="equip-atk-row"><span>${esc(a.name)}</span><span>${a.bonus?esc(a.bonus)+' hit':''}${a.bonus&&a.dmg?' · ':''}${esc(a.dmg||'')}</span></div>`).join('')
    : '';
}

// A spell casts as a reaction if its imported casting time or tags say so, or
// (for built-ins) its SPELL_DETAILS summary leads with "Reaction".
function isReactionSpell(s){
  if(Array.isArray(s.tags) && s.tags.some(t=>/^reaction$/i.test(t))) return true;
  const imp = CUSTOM_SPELLS[s.name];
  if(imp) return /reaction/i.test(imp.castingTime||'') || (imp.tags||[]).some(t=>/^reaction$/i.test(t));
  const det = SPELL_DETAILS[s.name];
  return !!(det && /^reaction\b/i.test(det.desc||''));
}

function buildActions(){
  const attacksEl = document.getElementById('actAttacks');
  if(!attacksEl) return;
  const manual = state.attacks.filter(a=>a.name && a.name.trim()).map(a=>({name:a.name, bonus:a.bonus, dmg:a.dmg, src:'Attack'}));
  const gearAtk = equipmentAttacks().map(a=>({...a, src:'Equipped'}));
  const allAtk = [...manual, ...gearAtk];
  attacksEl.innerHTML = allAtk.length ? allAtk.map(a=>`
    <div class="action-row">
      <span class="a-name">${esc(a.name)}</span>
      <span class="a-detail">${a.bonus ? esc(a.bonus)+' to hit' : ''}${a.bonus && a.dmg ? ' — ' : ''}${esc(a.dmg||'')}</span>
      <span class="action-badge">${a.src}</span>
    </div>`).join('')
    : '<div class="action-empty">No attacks yet — add them on the Character tab or equip a weapon.</div>';

  // Reaction spells & class abilities are pulled out of their parent panels
  // and gathered under the Reactions sub-category below.
  const reactions = [];

  const spellsEl = document.getElementById('actSpells');
  const known = state.knownSpells.map(s=>({name:s.name, level:s.level, tags:s.tags, from:null}));
  const combined = [...known, ...equipmentGrantedSpells()];
  const reactionSpells = combined.filter(isReactionSpell);
  const actionSpells = combined.filter(s=>!isReactionSpell(s));
  reactionSpells.forEach(s=> reactions.push({
    name: s.name,
    level: s.level,
    detail: s.level===0 ? 'Cantrip' : levelLabel(s.level),
    badge: s.from ? 'Item spell' : 'Spell',
    kind: 'spell',
    from: s.from
  }));
  if(actionSpells.length===0){
    spellsEl.innerHTML = '<div class="action-empty">No known spells — add some on the Spells tab or equip an item that grants spells.</div>';
  } else {
    const sorted = actionSpells.sort((a,b)=> a.level-b.level || a.name.localeCompare(b.name));
    spellsEl.innerHTML = sorted.map(s=>{
      const src = s.from ? ` <span class="chip-abbr">${esc(s.from)}</span>` : '';
      const attrs = `class="action-row spell-info" data-name="${esc(s.name)}" data-level="${s.level}" title="Click for full details"`;
      const marks = spellRowMarkers(s.name);
      if(s.from){
        return `<div ${attrs}>
          <span class="a-name spell-name-link">${esc(s.name)}${src}${marks}</span>
          <span class="a-detail">${s.level===0?'Cantrip':levelLabel(s.level)}</span>
          <span class="action-badge">Item</span>
        </div>`;
      }
      if(s.level===0){
        return `<div ${attrs}>
          <span class="a-name spell-name-link">${esc(s.name)}${marks}</span>
          <span class="a-detail">Cantrip</span>
          <span class="action-badge">At will</span>
        </div>`;
      }
      const remaining = slotsRemainingAtOrAbove(s.level);
      const ok = remaining>0;
      return `<div ${attrs}>
        <span class="a-name spell-name-link">${esc(s.name)}${marks}</span>
        <span class="a-detail">${levelLabel(s.level)}${ok ? ` — ${remaining} slot${remaining===1?'':'s'} usable` : ''}</span>
        <span class="action-badge ${ok?'':'dim'}">${ok?'Castable':'No slots'}</span>
      </div>`;
    }).join('') + spellLegendHtml();
  }

  const classEl = document.getElementById('actClassAbilities');
  const picked = pickedClasses();
  const abilities = picked.flatMap(entry=>{
    const lvl = entry.level||1;
    const fromClass = (CLASS_DATA[entry.name].features||[])
      .filter(f=>f.lv<=lvl && f.use && f.use!=='passive')
      .map(f=>({...f, cls:entry.name}));
    const sc = entry.subclass && SUBCLASS_DATA[subKey(entry.name, entry.subclass)];
    const fromSub = (sc && sc.features || [])
      .filter(f=>f.lv<=lvl && f.use && f.use!=='passive')
      .map(f=>({...f, cls:entry.subclass}));
    return [...fromClass, ...fromSub];
  });
  const showCls = f => picked.length>1 || f.cls!==picked[0].name;
  const reactionAbilities = abilities.filter(f=>f.use==='reaction');
  const actionAbilities = abilities.filter(f=>f.use!=='reaction');
  reactionAbilities.forEach(f=> reactions.push({
    name: f.name,
    cls: showCls(f) ? f.cls : null,
    detail: f.desc||'',
    badge: f.cost || 'Reaction',
    kind: 'ability'
  }));
  classEl.innerHTML = actionAbilities.length ? actionAbilities.map(f=>`
    <div class="action-row">
      <span class="a-name">${esc(f.name)}${showCls(f)?` <span class="chip-abbr">${esc(f.cls)}</span>`:''}</span>
      <span class="a-detail">${esc(f.desc||'')}</span>
      <span class="action-badge">${esc(f.use)}${f.cost?' · '+esc(f.cost):''}</span>
    </div>`).join('')
    : '<div class="action-empty">No class ability data — pick a class with a detailed feature reference (e.g. Jaeger) in Settings.</div>';

  const itemsEl = document.getElementById('actItems');
  const isUsableName = n=> n && USABLE_ITEM_WORDS.some(w=> n.toLowerCase().includes(w));
  const usable = [
    ...state.inventory.filter(i=> i.qty>0 && isUsableName(i.name)),
    ...equipList().filter(it=> isUsableName(it.name)).map(it=>({name:it.name, qty:1}))
  ];
  itemsEl.innerHTML = usable.length ? usable.map(i=>`
    <div class="action-row">
      <span class="a-name">${i.name}</span>
      <span class="a-detail">×${i.qty}</span>
      <span class="action-badge">Use item</span>
    </div>`).join('')
    : '<div class="action-empty">No usable items in your inventory (potions, scrolls, kits…).</div>';

  document.getElementById('actStandard').innerHTML = STANDARD_ACTIONS.map(a=>`
    <div class="action-row">
      <span class="a-name">${a.name}</span>
      <span class="a-detail">${a.desc}</span>
    </div>`).join('');

  const reactionsEl = document.getElementById('actReactions');
  if(reactionsEl){
    reactions.sort((a,b)=> a.name.localeCompare(b.name));
    reactionsEl.innerHTML = reactions.length ? reactions.map(r=>{
      const isSpell = r.kind==='spell';
      const attrs = isSpell
        ? `class="action-row spell-info" data-name="${esc(r.name)}" data-level="${r.level}" title="Click for full details"`
        : 'class="action-row"';
      return `
      <div ${attrs}>
        <span class="a-name${isSpell?' spell-name-link':''}">${esc(r.name)}${r.cls?` <span class="chip-abbr">${esc(r.cls)}</span>`:''}${isSpell?spellRowMarkers(r.name):''}</span>
        <span class="a-detail">${esc(r.detail||'')}</span>
        <span class="action-badge">${esc(r.badge)}</span>
      </div>`;
    }).join('')
      : '<div class="action-empty">No reactions — reaction spells (e.g. Shield, Counterspell) and reaction class abilities appear here.</div>';
  }

  // Whole-row click opens the shared spell detail popup (Spells-tab parity).
  document.querySelectorAll('#actSpells .spell-info, #actReactions .spell-info').forEach(el=>{
    el.addEventListener('click', ()=> openSpellDetail(el.dataset.name, parseInt(el.dataset.level)));
  });

  buildActionResources();
}

// Spell slots surface as auto trackers at the top of Resource Points, synced
// with the Spells tab: totals are managed there (auto-filled from class levels
// or manual), and clicking a pip here spends or restores that actual slot.
function spellSlotResourceRows(){
  const rows = [];
  (state.spellSlots||[]).forEach((s,i)=>{
    if(s && s.total>0) rows.push({ key:String(i), label:'Level '+(i+1)+' Slots', total:s.total, used:s.used });
  });
  if(state.pactSlots && state.pactSlots.total>0){
    rows.push({ key:'pact', label:'Pact Slots · Lv '+state.pactSlots.level, total:state.pactSlots.total, used:state.pactSlots.used });
  }
  return rows;
}

// Resource Points on the Actions tab: auto spell-slot rows (above) plus the
// player's freeform pools. Each freeform row is a named pool (Focus Points, Ki,
// Sorcery Points, etc.); clicking a pip toggles it used and the −/+ buttons
// resize the pool.
function buildActionResources(){
  const body = document.getElementById('actResources');
  if(!body) return;
  const list = state.actionResources || (state.actionResources = []);
  const slotRows = spellSlotResourceRows();

  const autoHtml = slotRows.map(r=>{
    let pips='';
    for(let p=0;p<r.total;p++) pips += `<span class="res-slot-pip ${p<r.used?'filled':''}" data-key="${r.key}" data-p="${p}"></span>`;
    return `<tr class="res-row res-row-auto">
      <td><span class="res-auto-name">${esc(r.label)}</span><span class="res-auto-tag" title="Auto from your spell slots — set totals on the Spells tab">auto</span></td>
      <td>
        <div class="res-pip-cell">
          <div class="res-pips">${pips}</div>
          <div class="res-controls"><span class="res-count">${r.total-r.used} left</span></div>
        </div>
      </td>
    </tr>`;
  }).join('');

  const manualHtml = list.map((r,i)=>{
    let pips='';
    for(let p=0;p<r.total;p++) pips += `<span class="res-pip ${p<r.used?'filled':''}" data-i="${i}" data-p="${p}"></span>`;
    return `<tr class="res-row">
      <td><input class="res-name" data-i="${i}" value="${esc(r.name)}" placeholder="Focus Points, Ki, Sorcery Points…"></td>
      <td>
        <div class="res-pip-cell">
          <div class="res-pips">${pips || '<span class="res-none">— no points —</span>'}</div>
          <div class="res-controls">
            <button class="res-adj" data-i="${i}" data-d="-1" title="Remove a point" aria-label="Remove a point">−</button>
            <button class="res-adj" data-i="${i}" data-d="1" title="Add a point" aria-label="Add a point">+</button>
            <span class="row-del res-del" data-i="${i}" title="Delete row">✕</span>
          </div>
        </div>
      </td>
    </tr>`;
  }).join('');

  body.innerHTML = (slotRows.length || list.length)
    ? autoHtml + manualHtml
    : `<tr><td colspan="2" class="res-empty">No trackers yet — spell slots appear here automatically once you have them; add other pools (Ki, Sorcery Points…) with the button below.</td></tr>`;

  // Auto spell-slot pips write straight back to the real slot state and keep the
  // Spells tab in sync.
  body.querySelectorAll('.res-slot-pip').forEach(pip=> pip.addEventListener('click', e=>{
    const key = e.target.dataset.key, p = +e.target.dataset.p;
    const slot = key==='pact' ? state.pactSlots : state.spellSlots[key];
    if(!slot) return;
    slot.used = (p < slot.used) ? p : p+1;
    buildActionResources(); buildSpellSlots(); save();
  }));

  body.querySelectorAll('.res-name').forEach(inp=> inp.addEventListener('input', e=>{
    list[e.target.dataset.i].name = e.target.value; save();
  }));
  body.querySelectorAll('.res-pip').forEach(pip=> pip.addEventListener('click', e=>{
    const i = +e.target.dataset.i, p = +e.target.dataset.p, r = list[i];
    // Click a filled pip to free it and everything after; an empty pip fills up to it.
    r.used = (p < r.used) ? p : p+1;
    buildActionResources(); save();
  }));
  body.querySelectorAll('.res-adj').forEach(btn=> btn.addEventListener('click', e=>{
    const i = +e.currentTarget.dataset.i, d = +e.currentTarget.dataset.d, r = list[i];
    r.total = Math.max(0, Math.min(30, r.total + d));
    if(r.used > r.total) r.used = r.total;
    buildActionResources(); save();
  }));
  body.querySelectorAll('.res-del').forEach(x=> x.addEventListener('click', e=>{
    list.splice(+e.currentTarget.dataset.i, 1);
    buildActionResources(); save();
  }));
}

function bindTabs(){
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b===btn));
      document.querySelectorAll('.tab-pane').forEach(p=>p.classList.toggle('active', p.id==='tab-'+btn.dataset.tab));
      // Rebuild on entry so the list reflects edits made on the other tabs.
      if(btn.dataset.tab==='actions') buildActions();
      if(btn.dataset.tab==='journal' && window.characterSheetApp.buildJournal) window.characterSheetApp.buildJournal();
    });
  });
  // Skills tab: the "Character Settings" hint link jumps to the settings tab.
  const toSettings = document.getElementById('skillsToSettings');
  if(toSettings) toSettings.addEventListener('click', e=>{
    e.preventDefault();
    const btn = document.querySelector('.tab-btn[data-tab="settings"]');
    if(btn) btn.click();
  });
}

// ---------- Sidebar navigation drawer ----------
// Shared by every page (partials/sidebar.html): ☰ opens it, backdrop click or
// Escape hides it away. The current page's link is highlighted via PAGE.
function bindSidebar(){
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebarToggle');
  const backdrop = document.getElementById('sidebarBackdrop');
  if(!sidebar || !toggle) return;
  const setOpen = open=>{
    sidebar.classList.toggle('open', open);
    if(backdrop) backdrop.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  toggle.addEventListener('click', ()=> setOpen(!sidebar.classList.contains('open')));
  if(backdrop) backdrop.addEventListener('click', ()=> setOpen(false));
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') setOpen(false); });
  const current = sidebar.querySelector(`.side-link[data-page="${PAGE}"]`);
  if(current) current.classList.add('active');
}

// ---------- Options menu & themes ----------
// Named themes (dark/light/ember) swap the CSS-variable blocks in styles.css
// via body[data-theme]; the custom theme writes derived variables inline on
// :root. Selection persists in localStorage.
function closeOptionsMenu(){
  const menu = document.getElementById('optionsMenu');
  const btn = document.getElementById('optionsBtn');
  if(!menu || !btn) return;
  menu.classList.remove('open');
  btn.classList.remove('active');
  btn.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-hidden','true');
}

function toggleOptionsMenu(){
  const menu = document.getElementById('optionsMenu');
  const btn = document.getElementById('optionsBtn');
  if(!menu || !btn) return;
  const willOpen = !menu.classList.contains('open');
  menu.classList.toggle('open', willOpen);
  btn.classList.toggle('active', willOpen);
  btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  menu.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
}

function hexToRgb(hex){
  const trimmed = hex.replace('#','');
  const value = trimmed.length===3 ? trimmed.split('').map(ch=>ch+ch).join('') : trimmed;
  const num = parseInt(value, 16);
  return { r:(num>>16)&255, g:(num>>8)&255, b:num&255 };
}

function rgbToHex(r,g,b){
  const clamp = v=> Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [clamp(r), clamp(g), clamp(b)].map(v=> v.toString(16).padStart(2,'0')).join('');
}

function mixHex(hexA, hexB, amount){
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const mix = (x,y) => x + (y-x)*amount;
  return rgbToHex(mix(a.r,b.r), mix(a.g,b.g), mix(a.b,b.b));
}

function alphaHex(hex, alpha){
  const {r,g,b}=hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getDefaultCustomTheme(){
  return {
    accent:'#00ffd5',
    accent2:'#ff2a6d',
    surface:'#12141d',
    text:'#c8c8d4',
    background:'#0a0a0f'
  };
}

function getStoredCustomTheme(){
  try {
    const stored = JSON.parse(localStorage.getItem('characterSheetCustomTheme') || 'null');
    return stored || getDefaultCustomTheme();
  } catch (e) { return getDefaultCustomTheme(); }
}

const CUSTOM_THEME_VARS = ['--void','--void-2','--void-3','--neon-cyan','--neon-magenta','--ink','--ink-dim','--ink-soft','--parchment','--parchment-2','--parchment-line','--gold','--gold-bright','--crimson','--crimson-bright','--border-glow','--shadow','--dark-panel'];

function applyCustomTheme(theme){
  const t = theme || getStoredCustomTheme();
  const accent = t.accent || '#00ffd5';
  const accent2 = t.accent2 || '#ff2a6d';
  const surface = t.surface || '#12141d';
  const text = t.text || '#c8c8d4';
  const background = t.background || '#0a0a0f';
  const root = document.documentElement;
  root.style.setProperty('--void', background);
  root.style.setProperty('--void-2', mixHex(background, surface, 0.22));
  root.style.setProperty('--void-3', mixHex(background, surface, 0.38));
  root.style.setProperty('--neon-cyan', accent);
  root.style.setProperty('--neon-magenta', accent2);
  root.style.setProperty('--ink', text);
  root.style.setProperty('--ink-dim', alphaHex(text, 0.5));
  root.style.setProperty('--ink-soft', alphaHex(text, 0.72));
  root.style.setProperty('--parchment', surface);
  root.style.setProperty('--parchment-2', mixHex(surface, background, 0.18));
  root.style.setProperty('--parchment-line', alphaHex(accent, 0.18));
  root.style.setProperty('--gold', accent);
  root.style.setProperty('--gold-bright', mixHex(accent, '#ffffff', 0.34));
  root.style.setProperty('--crimson', accent2);
  root.style.setProperty('--crimson-bright', mixHex(accent2, '#ffffff', 0.34));
  root.style.setProperty('--border-glow', alphaHex(accent, 0.35));
  root.style.setProperty('--shadow', `0 0 0 1px ${alphaHex(accent, 0.08)}, 0 0 18px ${alphaHex(accent, 0.06)}`);
  root.style.setProperty('--dark-panel', mixHex(surface, '#ffffff', 0.07));
  document.body.dataset.theme = 'custom';
}

function updateCustomControls(theme){
  const controls = document.getElementById('customThemeControls');
  if(!controls) return;
  controls.classList.toggle('open', theme === 'custom');
  const values = theme === 'custom' ? getStoredCustomTheme() : getDefaultCustomTheme();
  document.getElementById('customAccent').value = values.accent;
  document.getElementById('customAccent2').value = values.accent2;
  document.getElementById('customSurface').value = values.surface;
  document.getElementById('customText').value = values.text;
  document.getElementById('customBackground').value = values.background;
}

function applyTheme(theme){
  document.querySelectorAll('.theme-option').forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.theme===theme);
  });
  if(theme === 'custom'){
    applyCustomTheme(getStoredCustomTheme());
  } else {
    document.body.dataset.theme = theme;
    if(theme === 'dark') document.body.removeAttribute('data-theme');
    CUSTOM_THEME_VARS.forEach(v=> document.documentElement.style.removeProperty(v));
  }
  updateCustomControls(theme);
  localStorage.setItem('characterSheetTheme', theme);
}

function initTheme(){
  const saved = localStorage.getItem('characterSheetTheme') || 'dark';
  applyTheme(saved);
}

function bindOptionsMenu(){
  const optionsBtn = document.getElementById('optionsBtn');
  if(optionsBtn){ optionsBtn.addEventListener('click', e=>{ e.stopPropagation(); toggleOptionsMenu(); }); }
  document.querySelectorAll('.theme-option').forEach(btn=>btn.addEventListener('click', ()=>{
    applyTheme(btn.dataset.theme);
    if(btn.dataset.theme !== 'custom') closeOptionsMenu();
  }));
  const fieldByInput = { customAccent:'accent', customAccent2:'accent2', customSurface:'surface', customText:'text', customBackground:'background' };
  Object.keys(fieldByInput).forEach(id=>{
    const input = document.getElementById(id);
    if(!input) return;
    input.addEventListener('input', ()=>{
      const current = getStoredCustomTheme();
      current[fieldByInput[id]] = input.value;
      localStorage.setItem('characterSheetCustomTheme', JSON.stringify(current));
      localStorage.setItem('characterSheetTheme', 'custom');
      applyCustomTheme(current);
      document.querySelectorAll('.theme-option').forEach(btn=> btn.classList.toggle('active', btn.dataset.theme==='custom'));
    });
  });
  document.addEventListener('click', e=>{ if(!e.target.closest('.options-shell')) closeOptionsMenu(); });
}

function recalc(){
  const pb = profBonus(state.level);
  document.getElementById('profBonusDisplay').textContent = fmt(pb);
  const pbSkills = document.getElementById('profBonusSkills');
  if(pbSkills) pbSkills.textContent = fmt(pb);
  document.getElementById('sealLevel').textContent = state.level;

  // Effective scores fold in bonuses/overrides from equipped gear.
  const eff = effectiveAbilities();
  ABILITIES.forEach(a=>{
    const base = state.abilities[a.key]||0;
    const m = mod(eff[a.key]);
    const badge = document.getElementById('modBadge_'+a.key);
    badge.textContent = fmt(m);
    const diff = eff[a.key] - base;
    badge.classList.toggle('buffed', diff>0);
    badge.classList.toggle('nerfed', diff<0);
    badge.title = diff ? `${a.key.toUpperCase()} ${eff[a.key]} (base ${base}, gear ${fmt(diff)})` : '';
    const saveBonus = m + (state.saveProf[a.key] ? pb : 0);
    document.getElementById('saveBonus_'+a.key).textContent = fmt(saveBonus);
  });

  SKILLS.forEach((s,i)=>{
    const key = 'sk'+i;
    const m = mod(eff[s.ability]);
    const bonus = m + (skillProficient(i) ? pb : 0) + equipSkillBonus(s.name);
    const elBonus = document.getElementById('skillBonus_'+key);
    if(elBonus) elBonus.textContent = fmt(bonus);
    // Passive senses on the Skills tab: 10 + the skill's bonus.
    if(s.name==='Perception'||s.name==='Investigation'||s.name==='Insight'){
      const pEl = document.getElementById('passive'+s.name);
      if(pEl) pEl.textContent = 10 + bonus;
    }
  });

  document.getElementById('statInit').textContent = fmt(mod(eff.dex));

  const acInfo = computeAC();
  const acEl = document.getElementById('acComputedDisplay');
  if(acEl){
    acEl.textContent = acInfo.ac;
    document.getElementById('acBreakdown').textContent =
      (acInfo.usedArmor ? `armor ${acInfo.armorBase}` : `10 + DEX ${fmt(acInfo.dexMod)}`)
      + (acInfo.adds ? ` + gear ${fmt(acInfo.adds)}` : '');
  }

  state.deathSuccess.forEach((v,i)=>{
    const p = document.querySelector(`.pip.success[data-idx="${i}"]`);
    if(p) p.classList.toggle('filled', v);
  });
  state.deathFail.forEach((v,i)=>{
    const p = document.querySelector(`.pip.fail[data-idx="${i}"]`);
    if(p) p.classList.toggle('filled', v);
  });

  updateHero();
}

function bindStaticInputs(){
  const bind = (id, prop, isNum) => {
    const e = document.getElementById(id);
    e.addEventListener('input', ()=>{
      state[prop] = isNum ? (parseFloat(e.value)||0) : e.value;
      recalc(); save();
    });
  };
  bind('charName','name');
  bind('charAlignment','alignment'); // charRace / charBackground handled by buildSpeciesSelect / buildBackgroundSelect
  bind('charXP','xp',true);
  document.getElementById('addClassBtn').addEventListener('click', ()=>{
    ensureClasses();
    state.classes.push({name:'', level:1});
    buildClassList();
  });
  bind('statAC','ac',true); bind('statSpeed','speed',true);
  bind('hpMax','hpMax',true); bind('hpCurrent','hpCurrent',true); bind('hpTemp','hpTemp',true);
  bind('hitDice','hitDice');
  bind('featuresText','features'); bind('persTraits','persTraits'); bind('persIdeals','persIdeals');
  bind('persBonds','persBonds'); bind('persFlaws','persFlaws');

  document.getElementById('spellSearch').addEventListener('input', ()=> buildSpellLibrary());
  document.getElementById('cCP').addEventListener('input', e=>{state.currency.cp=parseInt(e.target.value)||0; save();});
  document.getElementById('cSP').addEventListener('input', e=>{state.currency.sp=parseInt(e.target.value)||0; save();});
  document.getElementById('cEP').addEventListener('input', e=>{state.currency.ep=parseInt(e.target.value)||0; save();});
  document.getElementById('cGP').addEventListener('input', e=>{state.currency.gp=parseInt(e.target.value)||0; save();});
  document.getElementById('cPP').addEventListener('input', e=>{state.currency.pp=parseInt(e.target.value)||0; save();});

  document.querySelectorAll('.pip.success').forEach(p=>{
    p.addEventListener('click', e=>{
      const i = parseInt(e.target.dataset.idx);
      state.deathSuccess[i] = !state.deathSuccess[i];
      recalc(); save();
    });
  });
  document.querySelectorAll('.pip.fail').forEach(p=>{
    p.addEventListener('click', e=>{
      const i = parseInt(e.target.dataset.idx);
      state.deathFail[i] = !state.deathFail[i];
      recalc(); save();
    });
  });

}

function applyStateToInputs(){
  document.getElementById('charName').value = state.name;
  document.getElementById('charRace').value = state.race;
  document.getElementById('charBackground').value = state.background;
  document.getElementById('charAlignment').value = state.alignment;
  document.getElementById('charXP').value = state.xp;
  document.getElementById('statAC').value = state.ac;
  document.getElementById('statSpeed').value = state.speed;
  document.getElementById('hpMax').value = state.hpMax;
  document.getElementById('hpCurrent').value = state.hpCurrent;
  document.getElementById('hpTemp').value = state.hpTemp;
  document.getElementById('hitDice').value = state.hitDice;
  document.getElementById('featuresText').value = state.features;
  document.getElementById('persTraits').value = state.persTraits;
  document.getElementById('persIdeals').value = state.persIdeals;
  document.getElementById('persBonds').value = state.persBonds;
  document.getElementById('persFlaws').value = state.persFlaws;
  document.getElementById('cCP').value = state.currency.cp;
  document.getElementById('cSP').value = state.currency.sp;
  document.getElementById('cEP').value = state.currency.ep;
  document.getElementById('cGP').value = state.currency.gp;
  document.getElementById('cPP').value = state.currency.pp;
}

// ---------- API helpers ----------
async function apiListCharacters(){
  const r = await fetch('/api/characters');
  return r.json();
}
async function apiGetCharacter(id){
  const r = await fetch('/api/characters/'+id);
  return r.json();
}
async function apiCreateCharacter(name, data){
  const r = await fetch('/api/characters', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name, data })
  });
  return r.json();
}
async function apiUpdateCharacter(id, name, data){
  const r = await fetch('/api/characters/'+id, {
    method:'PUT', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name, data })
  });
  return r.json();
}
async function apiDuplicateCharacter(id){
  const r = await fetch(`/api/characters/${id}/duplicate`, { method:'POST' });
  return r.json();
}
async function apiDeleteCharacter(id){
  const r = await fetch('/api/characters/'+id, { method:'DELETE' });
  return r.json();
}
async function apiListClasses(){
  const r = await fetch('/api/classes');
  return r.json();
}
async function apiImportClass(payload){
  const r = await fetch('/api/classes', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!r.ok){ const e = await r.json().catch(()=>({})); throw new Error(e.error||('HTTP '+r.status)); }
  return r.json();
}
async function apiDeleteClass(id){
  const r = await fetch('/api/classes/'+id, { method:'DELETE' });
  return r.json();
}
async function apiListSpecies(){
  const r = await fetch('/api/species');
  return r.json();
}
async function apiImportSpecies(payload){
  const r = await fetch('/api/species', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!r.ok){ const e = await r.json().catch(()=>({})); throw new Error(e.error||('HTTP '+r.status)); }
  return r.json();
}
async function apiDeleteSpecies(id){
  const r = await fetch('/api/species/'+id, { method:'DELETE' });
  return r.json();
}
async function apiListBackgrounds(){
  const r = await fetch('/api/backgrounds');
  return r.json();
}
async function apiImportBackground(payload){
  const r = await fetch('/api/backgrounds', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!r.ok){ const e = await r.json().catch(()=>({})); throw new Error(e.error||('HTTP '+r.status)); }
  return r.json();
}
async function apiDeleteBackground(id){
  const r = await fetch('/api/backgrounds/'+id, { method:'DELETE' });
  return r.json();
}
async function apiListSubclasses(){
  const r = await fetch('/api/subclasses');
  return r.json();
}
async function apiImportSubclass(payload){
  const r = await fetch('/api/subclasses', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!r.ok){ const e = await r.json().catch(()=>({})); throw new Error(e.error||('HTTP '+r.status)); }
  return r.json();
}
async function apiDeleteSubclass(id){
  const r = await fetch('/api/subclasses/'+id, { method:'DELETE' });
  return r.json();
}
async function apiListSubspecies(){
  const r = await fetch('/api/subspecies');
  return r.json();
}
async function apiImportSubspecies(payload){
  const r = await fetch('/api/subspecies', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!r.ok){ const e = await r.json().catch(()=>({})); throw new Error(e.error||('HTTP '+r.status)); }
  return r.json();
}
async function apiDeleteSubspecies(id){
  const r = await fetch('/api/subspecies/'+id, { method:'DELETE' });
  return r.json();
}
async function apiListSpells(){
  const r = await fetch('/api/spells');
  return r.json();
}
async function apiImportSpell(payload){
  const r = await fetch('/api/spells', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!r.ok){ const e = await r.json().catch(()=>({})); throw new Error(e.error||('HTTP '+r.status)); }
  return r.json();
}
async function apiDeleteSpell(id){
  const r = await fetch('/api/spells/'+id, { method:'DELETE' });
  return r.json();
}

// ---------- Custom class import ----------
// Merge server-stored custom classes into CLASS_DATA. Called at startup and
// after any import/delete so the dropdowns and cards stay in sync.
// Drop a custom entry from an in-memory registry, restoring the built-in
// definition if the custom one was shadowing it.
function restoreOrDelete(registry, builtins, name){
  if(builtins[name]) registry[name] = JSON.parse(JSON.stringify(builtins[name]));
  else delete registry[name];
}

async function loadCustomClasses(){
  let list = [];
  try { list = await apiListClasses(); } catch(e){ return; }
  Object.keys(CLASS_DATA).forEach(n=>{ if(CLASS_DATA[n].custom) restoreOrDelete(CLASS_DATA, BUILTIN_CLASSES, n); });
  list.forEach(rec=>{
    CLASS_DATA[rec.name] = Object.assign({}, rec.data, {
      source: rec.source,
      homebrew: rec.source==='Homebrew',
      custom: true, customId: rec.id, builtin: false
    });
  });
}

// "lv | name | desc | use | cost | choice; choice; …" — the trailing choices field
// is optional and turns the feature into a pick-one prompt on the Settings tab.
function parseFeatureLines(text){
  return (text||'').split('\n').map(l=>l.trim()).filter(Boolean).map(line=>{
    const [lvRaw, name, desc, use, cost, choicesRaw] = line.split('|').map(s=>(s||'').trim());
    const f = { lv: Math.max(1, Math.min(20, parseInt(lvRaw)||1)), name };
    if(desc) f.desc = desc;
    if(use) f.use = use;
    if(cost) f.cost = cost;
    const choices = parseChoiceList(choicesRaw);
    if(choices.length) f.choices = choices;
    return f;
  }).filter(f=>f.name);
}

// Choices are semicolon-separated so option text can still contain commas.
function parseChoiceList(raw){
  return (raw||'').split(';').map(s=>s.trim()).filter(Boolean);
}

function buildClassFromForm(){
  const name = document.getElementById('impName').value.trim();
  if(!name) throw new Error('Class name is required.');
  const source = document.getElementById('impSource').value;
  const saves = [...document.querySelectorAll('#impSaves .mini-toggle.on')].map(t=>t.dataset.k);
  const skillsRaw = document.getElementById('impSkills').value.trim();
  const skills = skillsRaw ? skillsRaw.split(',').map(s=>s.trim()).filter(Boolean) : 'any';
  const subsRaw = document.getElementById('impSubclasses').value.trim();
  const castingType = document.getElementById('impCasting').value;
  const castAbility = document.getElementById('impCastAbility').value;
  const casting = { type: castingType };
  if(castAbility) casting.ability = castAbility;
  const data = {
    hitDie: parseInt(document.getElementById('impHitDie').value)||8,
    saves,
    choose: parseInt(document.getElementById('impChoose').value)||0,
    skills,
    subclassLevel: Math.max(1, Math.min(20, parseInt(document.getElementById('impSubLevel').value)||3)),
    casting,
    features: parseFeatureLines(document.getElementById('impFeatures').value)
  };
  if(subsRaw) data.subclasses = subsRaw.split(',').map(s=>s.trim()).filter(Boolean);
  const desc = document.getElementById('impDesc').value.trim();
  if(desc) data.desc = desc;
  return { name, source, data };
}

async function submitImport(payload){
  const msg = document.getElementById('impMsg');
  try{
    if(!payload) payload = buildClassFromForm();
    if(!payload.name) throw new Error('Class name is required.');
    if(!payload.data || typeof payload.data!=='object') throw new Error('Class data is required.');
    const source = CLASS_SOURCES.includes(payload.source) ? payload.source : 'Homebrew';
    const res = await apiImportClass({ name: payload.name, source, data: payload.data });
    CLASS_DATA[payload.name] = Object.assign({}, payload.data, {
      source, homebrew: source==='Homebrew', custom:true, customId: res.id, builtin:false
    });
    msg.className = 'import-msg ok';
    msg.textContent = `Imported "${payload.name}" (${source}) — now available in the class dropdown.`;
    buildClassFilterBar(); buildClassList(); renderImportedList();
    buildSubclassParentSelect(); buildLibraryEditSelects();
  }catch(err){
    msg.className = 'import-msg err';
    msg.textContent = 'Import failed: ' + err.message;
  }
}

function renderImportedList(){
  const box = document.getElementById('importedList');
  if(!box) return;
  const customs = Object.entries(CLASS_DATA).filter(([n,cd])=>cd.custom);
  if(!customs.length){ box.innerHTML=''; return; }
  box.innerHTML = '<div class="picker-hint" style="margin-bottom:6px;">Imported classes</div>' + customs.map(([n,cd])=>`
    <div class="imported-item">
      <span class="ii-name">${n}</span>
      ${sourceTag(cd.source)}
      <span class="ii-edit" data-name="${n}" title="Load into the form to edit">✎</span>
      <span class="row-del" data-id="${cd.customId}" data-name="${n}">✕</span>
    </div>`).join('');
  box.querySelectorAll('.ii-edit').forEach(btn=>btn.addEventListener('click', e=>{
    fillClassForm(e.target.dataset.name);
  }));
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', e=>
    deleteClassEntry(e.target.dataset.id, e.target.dataset.name)));
}

// Fully remove an imported class from the shared database. If it shadowed a
// built-in of the same name, that built-in is restored. Shared by the imported
// list's ✕ and the edit form's Delete button.
async function deleteClassEntry(id, name){
  if(!confirm(`Remove imported class "${name}"? Characters using it will lose it${BUILTIN_CLASSES[name]?' (the built-in version is restored)':''}.`)) return false;
  await apiDeleteClass(id);
  restoreOrDelete(CLASS_DATA, BUILTIN_CLASSES, name);
  if(!CLASS_DATA[name]) state.classes = (state.classes||[]).filter(c=>c.name!==name);
  afterClassChange();
  renderImportedList();
  buildLibraryEditSelects();
  return true;
}

function bindClassImport(){
  const saves = document.getElementById('impSaves');
  saves.innerHTML = ABILITIES.map(a=>`<span class="mini-toggle" data-k="${a.key}">${a.key}</span>`).join('');
  saves.querySelectorAll('.mini-toggle').forEach(t=>t.addEventListener('click', ()=>t.classList.toggle('on')));

  document.getElementById('impJsonToggle').addEventListener('click', ()=>{
    const w = document.getElementById('impJsonWrap');
    w.style.display = (w.style.display==='none') ? '' : 'none';
  });

  document.getElementById('impSubmit').addEventListener('click', ()=>{
    const jsonWrap = document.getElementById('impJsonWrap');
    const jsonText = document.getElementById('impJson').value.trim();
    if(jsonWrap.style.display!=='none' && jsonText){
      let obj;
      try { obj = JSON.parse(jsonText); }
      catch(e){
        const m = document.getElementById('impMsg');
        m.className = 'import-msg err'; m.textContent = 'Invalid JSON: ' + e.message;
        return;
      }
      const { name, source, data, ...rest } = obj;
      submitImport({ name, source, data: data || rest });
    } else {
      submitImport();
    }
  });
}

// ---------- Species (character selection + Features tab) ----------
async function loadCustomSpecies(){
  let list = [];
  try { list = await apiListSpecies(); } catch(e){ return; }
  Object.keys(SPECIES_DATA).forEach(n=>{ if(SPECIES_DATA[n].custom) restoreOrDelete(SPECIES_DATA, BUILTIN_SPECIES, n); });
  list.forEach(rec=>{
    SPECIES_DATA[rec.name] = Object.assign({}, rec.data, {
      source: rec.source, custom:true, customId: rec.id, builtin:false
    });
  });
}

function buildSpeciesSelect(){
  const sel = document.getElementById('charRace');
  if(!sel) return;
  const names = Object.keys(SPECIES_DATA).sort();
  sel.innerHTML = '<option value="">— none —</option>' + names.map(n=>
    `<option value="${n}" ${state.race===n?'selected':''}>${n} · ${SPECIES_DATA[n].source}</option>`).join('');
  // Preserve a pre-existing freeform species that isn't in the library.
  if(state.race && !SPECIES_DATA[state.race]){
    sel.insertAdjacentHTML('beforeend', `<option value="${state.race}" selected>${state.race} (custom)</option>`);
  }
  sel.onchange = ()=>{
    state.race = sel.value;
    state.subrace = ''; // a new species has its own subraces; clear the old pick
    const sd = SPECIES_DATA[state.race];
    if(sd && sd.speed){ state.speed = sd.speed; const sp = document.getElementById('statSpeed'); if(sp) sp.value = sd.speed; }
    buildSubraceSelect();
    renderSpeciesInfo();
    buildSpeciesTraits();
    buildSkillPicker(); // species-granted skill chips change with the species
    buildSkills();
    updateHero(); recalc(); save();
  };
}

// Subrace picker: shown only when the selected species has subraces (built-in
// names on the species plus any imported subspecies for it).
function buildSubraceSelect(){
  const field = document.getElementById('charSubraceField');
  const sel = document.getElementById('charSubrace');
  if(!field || !sel) return;
  const names = subspeciesNamesForSpecies(state.race);
  if(!names.length){ field.style.display='none'; sel.innerHTML=''; return; }
  field.style.display='';
  sel.innerHTML = '<option value="">— none —</option>' + names.map(n=>{
    const ss = SUBSPECIES_DATA[subspKey(state.race, n)];
    return `<option value="${esc(n)}" ${state.subrace===n?'selected':''}>${esc(n)}${ss&&ss.custom?' ✦':''}</option>`;
  }).join('');
  // Preserve a pre-existing freeform subrace not in the library.
  if(state.subrace && !names.includes(state.subrace)){
    sel.insertAdjacentHTML('beforeend', `<option value="${esc(state.subrace)}" selected>${esc(state.subrace)} (custom)</option>`);
  }
  sel.onchange = ()=>{
    state.subrace = sel.value;
    renderSpeciesInfo();
    buildSpeciesTraits();
    recalc(); save();
  };
}

function renderSpeciesInfo(){
  const box = document.getElementById('speciesInfo');
  if(!box) return;
  const sd = SPECIES_DATA[state.race];
  if(!sd){
    box.innerHTML = state.race
      ? '<div class="ci-desc">// custom species — add it on the Library tab to attach traits, size & speed</div>'
      : '<div class="ci-desc">// no species selected</div>';
    return;
  }
  const ss = state.subrace ? SUBSPECIES_DATA[subspKey(state.race, state.subrace)] : null;
  box.innerHTML = `
    <div class="ci-title">${state.race}${sourceTag(sd.source)}</div>
    <div class="ci-row"><span class="ci-key">size</span><span>${sd.size||'—'}</span></div>
    <div class="ci-row"><span class="ci-key">speed</span><span>${sd.speed||0} ft${sd.darkvision?` · darkvision ${sd.darkvision} ft`:''}</span></div>
    ${sd.asi?`<div class="ci-row"><span class="ci-key">asi</span><span>${sd.asi}</span></div>`:''}
    ${sd.languages?`<div class="ci-row"><span class="ci-key">languages</span><span>${sd.languages}</span></div>`:''}
    ${state.subrace?`<div class="ci-row"><span class="ci-key">subrace</span><span>${esc(state.subrace)}${ss&&ss.asi?` · ${esc(ss.asi)}`:''}</span></div>`:''}
    <div class="ci-row"><span class="ci-key">source</span><span>${sd.custom?'Imported · '+sd.source:'Official · '+sd.source}</span></div>
    ${sd.desc?`<div class="ci-desc">${sd.desc}</div>`:''}
    ${ss&&ss.desc?`<div class="ci-desc">${ss.desc}</div>`:''}`;
}

function buildSpeciesTraits(){
  const box = document.getElementById('speciesTraitsList');
  if(!box) return;
  const sd = SPECIES_DATA[state.race];
  if(!sd){
    box.innerHTML = `<div class="action-empty">${state.race ? 'Custom species — import "'+state.race+'" on the Library tab to list its traits here.' : 'Pick a species in Settings to see its traits here.'}</div>`;
    return;
  }
  const traitRow = t=>`
    <div class="feat-item">
      <div class="feat-head"><span class="f-name">${t.name}</span></div>
      ${t.desc?`<div class="feat-desc">${t.desc}</div>`:''}
    </div>`;
  let html = (sd.traits||[]).map(traitRow).join('');
  // Append the selected subrace's traits under a labelled divider.
  const ss = state.subrace ? SUBSPECIES_DATA[subspKey(state.race, state.subrace)] : null;
  if(ss && Array.isArray(ss.traits) && ss.traits.length){
    html += `<div class="subrace-divider">${esc(state.subrace)} <span class="chip-abbr">subrace</span></div>` + ss.traits.map(traitRow).join('');
  }
  box.innerHTML = html || '<div class="action-empty">No traits listed for this species.</div>';
}

// ---------- Backgrounds (character selection + Features tab) ----------
async function loadCustomBackgrounds(){
  let list = [];
  try { list = await apiListBackgrounds(); } catch(e){ return; }
  Object.keys(BACKGROUND_DATA).forEach(n=>{ if(BACKGROUND_DATA[n].custom) restoreOrDelete(BACKGROUND_DATA, BUILTIN_BACKGROUNDS, n); });
  list.forEach(rec=>{
    BACKGROUND_DATA[rec.name] = Object.assign({}, rec.data, {
      source: rec.source, custom:true, customId: rec.id, builtin:false
    });
  });
}

function buildBackgroundSelect(){
  const sel = document.getElementById('charBackground');
  if(!sel) return;
  const names = Object.keys(BACKGROUND_DATA).sort();
  sel.innerHTML = '<option value="">— none —</option>' + names.map(n=>
    `<option value="${esc(n)}" ${state.background===n?'selected':''}>${esc(n)} · ${BACKGROUND_DATA[n].source}</option>`).join('');
  // Preserve a pre-existing freeform background that isn't in the library.
  if(state.background && !BACKGROUND_DATA[state.background]){
    sel.insertAdjacentHTML('beforeend', `<option value="${esc(state.background)}" selected>${esc(state.background)} (custom)</option>`);
  }
  sel.onchange = ()=>{
    state.background = sel.value;
    renderBackgroundInfo();
    buildBackgroundFeature();
    buildSkillPicker(); // granted chips change with the background
    buildSkills();
    recalc(); save();
  };
}

function renderBackgroundInfo(){
  const box = document.getElementById('backgroundInfo');
  if(!box) return;
  const bd = BACKGROUND_DATA[state.background];
  if(!bd){
    box.innerHTML = state.background
      ? '<div class="ci-desc">// custom background — import it on the Import page to attach skills & a feature</div>'
      : '<div class="ci-desc">// no background selected</div>';
    return;
  }
  box.innerHTML = `
    <div class="ci-title">${esc(state.background)}${sourceTag(bd.source)}</div>
    ${bd.skills&&bd.skills.length?`<div class="ci-row"><span class="ci-key">skills</span><span>${bd.skills.map(esc).join(', ')} (granted)</span></div>`:''}
    ${bd.tools?`<div class="ci-row"><span class="ci-key">tools</span><span>${esc(bd.tools)}</span></div>`:''}
    ${bd.languages?`<div class="ci-row"><span class="ci-key">languages</span><span>${esc(bd.languages)}</span></div>`:''}
    ${bd.feature?`<div class="ci-row"><span class="ci-key">feature</span><span>${esc(bd.feature.name)}</span></div>`:''}
    <div class="ci-row"><span class="ci-key">source</span><span>${bd.custom?'Imported · '+bd.source:'Official · '+bd.source}</span></div>
    ${bd.desc?`<div class="ci-desc">${esc(bd.desc)}</div>`:''}`;
}

// Features & Traits tab: the selected background's feature + equipment notes.
function buildBackgroundFeature(){
  const box = document.getElementById('backgroundFeatureList');
  if(!box) return;
  const bd = BACKGROUND_DATA[state.background];
  if(!bd){
    box.innerHTML = `<div class="action-empty">${state.background ? 'Custom background — import "'+esc(state.background)+'" on the Import page to list its feature here.' : 'Pick a background in Settings to see its feature here.'}</div>`;
    return;
  }
  let html = '';
  if(bd.feature && bd.feature.name){
    html += `<div class="feat-item">
      <div class="feat-head"><span class="f-name">${esc(bd.feature.name)}</span><span class="action-badge dim">background</span></div>
      ${bd.feature.desc?`<div class="feat-desc">${esc(bd.feature.desc)}</div>`:''}
    </div>`;
  }
  if(bd.skills && bd.skills.length) html += `<div class="feat-item"><div class="feat-head"><span class="f-name">Skill Proficiencies</span></div><div class="feat-desc">${bd.skills.map(esc).join(', ')} — applied automatically on the Skills tab.</div></div>`;
  if(bd.equipment) html += `<div class="feat-item"><div class="feat-head"><span class="f-name">Equipment</span></div><div class="feat-desc">${esc(bd.equipment)}</div></div>`;
  box.innerHTML = html || '<div class="action-empty">No feature listed for this background.</div>';
}

// ---------- Species import (Library tab) ----------
function parseTraitLines(text){
  return (text||'').split('\n').map(l=>l.trim()).filter(Boolean).map(line=>{
    const [name, desc] = line.split('|').map(s=>(s||'').trim());
    const t = { name };
    if(desc) t.desc = desc;
    return t;
  }).filter(t=>t.name);
}

function buildSpeciesFromForm(){
  const name = document.getElementById('spName').value.trim();
  if(!name) throw new Error('Species name is required.');
  const source = document.getElementById('spSource').value;
  const data = {
    size: document.getElementById('spSize').value,
    speed: parseInt(document.getElementById('spSpeed').value)||30,
    darkvision: parseInt(document.getElementById('spDarkvision').value)||0,
    traits: parseTraitLines(document.getElementById('spTraits').value)
  };
  const asi = document.getElementById('spAsi').value.trim();
  const langs = document.getElementById('spLanguages').value.trim();
  const desc = document.getElementById('spDesc').value.trim();
  if(asi) data.asi = asi;
  if(langs) data.languages = langs;
  if(desc) data.desc = desc;
  return { name, source, data };
}

async function submitSpeciesImport(payload){
  const msg = document.getElementById('spMsg');
  try{
    if(!payload) payload = buildSpeciesFromForm();
    if(!payload.name) throw new Error('Species name is required.');
    if(!payload.data || typeof payload.data!=='object') throw new Error('Species data is required.');
    const source = CLASS_SOURCES.includes(payload.source) ? payload.source : 'Homebrew';
    const res = await apiImportSpecies({ name: payload.name, source, data: payload.data });
    SPECIES_DATA[payload.name] = Object.assign({}, payload.data, { source, custom:true, customId: res.id, builtin:false });
    msg.className = 'import-msg ok';
    msg.textContent = `Imported "${payload.name}" (${source}) — now available in the Species picker on the Settings tab.`;
    buildSpeciesSelect(); renderSpeciesInfo(); renderSpeciesImportedList(); buildLibraryEditSelects();
  }catch(err){
    msg.className = 'import-msg err';
    msg.textContent = 'Import failed: ' + err.message;
  }
}

function renderSpeciesImportedList(){
  const box = document.getElementById('speciesImportedList');
  if(!box) return;
  const customs = Object.entries(SPECIES_DATA).filter(([n,sd])=>sd.custom);
  if(!customs.length){ box.innerHTML=''; return; }
  box.innerHTML = '<div class="picker-hint" style="margin-bottom:6px;">Imported species</div>' + customs.map(([n,sd])=>`
    <div class="imported-item">
      <span class="ii-name">${n}</span>
      ${sourceTag(sd.source)}
      <span class="ii-edit" data-name="${n}" title="Load into the form to edit">✎</span>
      <span class="row-del" data-id="${sd.customId}" data-name="${n}">✕</span>
    </div>`).join('');
  box.querySelectorAll('.ii-edit').forEach(btn=>btn.addEventListener('click', e=>{
    fillSpeciesForm(e.target.dataset.name);
  }));
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', e=>
    deleteSpeciesEntry(e.target.dataset.id, e.target.dataset.name)));
}

async function deleteSpeciesEntry(id, name){
  if(!confirm(`Remove imported species "${name}"?${BUILTIN_SPECIES[name]?' The built-in version is restored.':''}`)) return false;
  await apiDeleteSpecies(id);
  restoreOrDelete(SPECIES_DATA, BUILTIN_SPECIES, name);
  buildSpeciesSelect(); renderSpeciesInfo(); buildSpeciesTraits(); renderSpeciesImportedList();
  buildLibraryEditSelects();
  return true;
}

function bindSpeciesImport(){
  document.getElementById('spJsonToggle').addEventListener('click', ()=>{
    const w = document.getElementById('spJsonWrap');
    w.style.display = (w.style.display==='none') ? '' : 'none';
  });
  document.getElementById('spSubmit').addEventListener('click', ()=>{
    const jsonWrap = document.getElementById('spJsonWrap');
    const jsonText = document.getElementById('spJson').value.trim();
    if(jsonWrap.style.display!=='none' && jsonText){
      let obj;
      try { obj = JSON.parse(jsonText); }
      catch(e){
        const m = document.getElementById('spMsg');
        m.className = 'import-msg err'; m.textContent = 'Invalid JSON: ' + e.message;
        return;
      }
      const { name, source, data, ...rest } = obj;
      submitSpeciesImport({ name, source, data: data || rest });
    } else {
      submitSpeciesImport();
    }
  });
}

// ---------- Background import (Import page) ----------
// Comma-separated skill names → canonical SKILLS names (case-insensitive);
// unknown names are rejected so granted proficiencies always match the sheet.
function parseSkillNames(text){
  const out = [];
  (text||'').split(',').map(s=>s.trim()).filter(Boolean).forEach(nm=>{
    const hit = SKILLS.find(s=>s.name.toLowerCase()===nm.toLowerCase());
    if(!hit) throw new Error(`Unknown skill "${nm}" — use the 5e skill names (e.g. ${SKILLS[0].name}, ${SKILLS[6].name}).`);
    if(!out.includes(hit.name)) out.push(hit.name);
  });
  return out;
}

function buildBackgroundFromForm(){
  const name = document.getElementById('bgName').value.trim();
  if(!name) throw new Error('Background name is required.');
  const source = document.getElementById('bgSource').value;
  const data = { skills: parseSkillNames(document.getElementById('bgSkills').value) };
  const tools = document.getElementById('bgTools').value.trim();
  const langs = document.getElementById('bgLanguages').value.trim();
  const equipment = document.getElementById('bgEquipment').value.trim();
  const desc = document.getElementById('bgDesc').value.trim();
  const featName = document.getElementById('bgFeatureName').value.trim();
  const featDesc = document.getElementById('bgFeatureDesc').value.trim();
  if(tools) data.tools = tools;
  if(langs) data.languages = langs;
  if(equipment) data.equipment = equipment;
  if(desc) data.desc = desc;
  if(featName) data.feature = { name: featName, desc: featDesc };
  return { name, source, data };
}

async function submitBackgroundImport(payload){
  const msg = document.getElementById('bgMsg');
  try{
    if(!payload) payload = buildBackgroundFromForm();
    if(!payload.name) throw new Error('Background name is required.');
    if(!payload.data || typeof payload.data!=='object') throw new Error('Background data is required.');
    if(payload.data.skills) payload.data.skills = parseSkillNames([].concat(payload.data.skills).join(','));
    const source = CLASS_SOURCES.includes(payload.source) ? payload.source : 'Homebrew';
    const res = await apiImportBackground({ name: payload.name, source, data: payload.data });
    BACKGROUND_DATA[payload.name] = Object.assign({}, payload.data, { source, custom:true, customId: res.id, builtin:false });
    msg.className = 'import-msg ok';
    msg.textContent = `Imported "${payload.name}" (${source}) — now available in the Background picker on the Settings tab.`;
    buildBackgroundSelect(); renderBackgroundInfo(); renderBackgroundImportedList(); buildLibraryEditSelects();
  }catch(err){
    msg.className = 'import-msg err';
    msg.textContent = 'Import failed: ' + err.message;
  }
}

function renderBackgroundImportedList(){
  const box = document.getElementById('backgroundImportedList');
  if(!box) return;
  const customs = Object.entries(BACKGROUND_DATA).filter(([n,bd])=>bd.custom);
  if(!customs.length){ box.innerHTML=''; return; }
  box.innerHTML = '<div class="picker-hint" style="margin-bottom:6px;">Imported backgrounds</div>' + customs.map(([n,bd])=>`
    <div class="imported-item">
      <span class="ii-name">${esc(n)}</span>
      ${sourceTag(bd.source)}
      <span class="ii-edit" data-name="${esc(n)}" title="Load into the form to edit">✎</span>
      <span class="row-del" data-id="${bd.customId}" data-name="${esc(n)}">✕</span>
    </div>`).join('');
  box.querySelectorAll('.ii-edit').forEach(btn=>btn.addEventListener('click', e=>{
    fillBackgroundForm(e.target.dataset.name);
  }));
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', e=>
    deleteBackgroundEntry(e.target.dataset.id, e.target.dataset.name)));
}

async function deleteBackgroundEntry(id, name){
  if(!confirm(`Remove imported background "${name}"?${BUILTIN_BACKGROUNDS[name]?' The built-in version is restored.':''}`)) return false;
  await apiDeleteBackground(id);
  restoreOrDelete(BACKGROUND_DATA, BUILTIN_BACKGROUNDS, name);
  buildBackgroundSelect(); renderBackgroundInfo(); buildBackgroundFeature(); renderBackgroundImportedList();
  buildLibraryEditSelects();
  return true;
}

function bindBackgroundImport(){
  document.getElementById('bgJsonToggle').addEventListener('click', ()=>{
    const w = document.getElementById('bgJsonWrap');
    w.style.display = (w.style.display==='none') ? '' : 'none';
  });
  document.getElementById('bgSubmit').addEventListener('click', ()=>{
    const jsonWrap = document.getElementById('bgJsonWrap');
    const jsonText = document.getElementById('bgJson').value.trim();
    if(jsonWrap.style.display!=='none' && jsonText){
      let obj;
      try { obj = JSON.parse(jsonText); }
      catch(e){
        const m = document.getElementById('bgMsg');
        m.className = 'import-msg err'; m.textContent = 'Invalid JSON: ' + e.message;
        return;
      }
      const { name, source, data, ...rest } = obj;
      submitBackgroundImport({ name, source, data: data || rest });
    } else {
      submitBackgroundImport();
    }
  });
}

// ---------- Subclass import (Library tab) ----------
async function loadCustomSubclasses(){
  let list = [];
  try { list = await apiListSubclasses(); } catch(e){ return; }
  Object.keys(SUBCLASS_DATA).forEach(k=>{ if(SUBCLASS_DATA[k].custom) delete SUBCLASS_DATA[k]; });
  list.forEach(rec=>{
    SUBCLASS_DATA[subKey(rec.parent, rec.name)] = Object.assign(
      { parent: rec.parent, name: rec.name }, rec.data,
      { source: rec.source, custom:true, customId: rec.id });
  });
}

// Parent-class dropdown for the import form (every class can be a parent).
function buildSubclassParentSelect(){
  const sel = document.getElementById('subParent');
  if(!sel) return;
  const cur = sel.value;
  const names = Object.keys(CLASS_DATA).sort();
  sel.innerHTML = '<option value="">— pick parent class —</option>' + names.map(n=>
    `<option value="${esc(n)}">${esc(n)} · ${CLASS_DATA[n].source}</option>`).join('');
  if(cur && CLASS_DATA[cur]) sel.value = cur;
}

function buildSubclassFromForm(){
  const parent = document.getElementById('subParent').value;
  if(!parent) throw new Error('Pick a parent class.');
  if(!CLASS_DATA[parent]) throw new Error('Unknown parent class.');
  const name = document.getElementById('subName').value.trim();
  if(!name) throw new Error('Subclass name is required.');
  const source = document.getElementById('subSource').value;
  const data = {
    subclassLevel: Math.max(1, Math.min(20, parseInt(document.getElementById('subLevel').value)||CLASS_DATA[parent].subclassLevel||3)),
    features: parseFeatureLines(document.getElementById('subFeatures').value)
  };
  const desc = document.getElementById('subDesc').value.trim();
  if(desc) data.desc = desc;
  return { parent, name, source, data };
}

async function submitSubclassImport(payload){
  const msg = document.getElementById('subMsg');
  try{
    if(!payload) payload = buildSubclassFromForm();
    if(!payload.parent || !CLASS_DATA[payload.parent]) throw new Error('A valid parent class is required.');
    if(!payload.name) throw new Error('Subclass name is required.');
    if(!payload.data || typeof payload.data!=='object') throw new Error('Subclass data is required.');
    const source = CLASS_SOURCES.includes(payload.source) ? payload.source : 'Homebrew';
    const res = await apiImportSubclass({ parent: payload.parent, name: payload.name, source, data: payload.data });
    SUBCLASS_DATA[subKey(payload.parent, payload.name)] = Object.assign(
      { parent: payload.parent, name: payload.name }, payload.data,
      { source, custom:true, customId: res.id });
    msg.className = 'import-msg ok';
    msg.textContent = `Imported "${payload.name}" under ${payload.parent} (${source}) — now selectable on that class in Settings.`;
    // Reflect the new subclass everywhere it's listed.
    buildClassList(); renderClassInfoStack(); buildClassFeatures(); buildActions(); renderSubclassImportedList(); buildLibraryEditSelects();
  }catch(err){
    msg.className = 'import-msg err';
    msg.textContent = 'Import failed: ' + err.message;
  }
}

function renderSubclassImportedList(){
  const box = document.getElementById('subclassImportedList');
  if(!box) return;
  const customs = Object.values(SUBCLASS_DATA).filter(s=>s.custom);
  if(!customs.length){ box.innerHTML=''; return; }
  box.innerHTML = '<div class="picker-hint" style="margin-bottom:6px;">Imported subclasses</div>' + customs.map(s=>`
    <div class="imported-item">
      <span class="ii-name">${esc(s.name)} <span class="chip-abbr">${esc(s.parent)}</span></span>
      ${sourceTag(s.source)}
      <span class="ii-edit" data-parent="${esc(s.parent)}" data-name="${esc(s.name)}" title="Load into the form to edit">✎</span>
      <span class="row-del" data-id="${s.customId}" data-parent="${esc(s.parent)}" data-name="${esc(s.name)}">✕</span>
    </div>`).join('');
  box.querySelectorAll('.ii-edit').forEach(btn=>btn.addEventListener('click', e=>{
    fillSubclassForm(e.target.dataset.parent, e.target.dataset.name);
  }));
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', e=>
    deleteSubclassEntry(e.target.dataset.id, e.target.dataset.parent, e.target.dataset.name)));
}

async function deleteSubclassEntry(id, parent, name){
  if(!confirm(`Remove imported subclass "${name}" (${parent})?`)) return false;
  await apiDeleteSubclass(id);
  delete SUBCLASS_DATA[subKey(parent, name)];
  // Clear it from any character rows that had it selected.
  (state.classes||[]).forEach(c=>{ if(c.name===parent && c.subclass===name) c.subclass=''; });
  buildClassList(); renderClassInfoStack(); buildClassFeatures(); buildActions(); renderSubclassImportedList(); buildLibraryEditSelects(); save();
  return true;
}

function bindSubclassImport(){
  buildSubclassParentSelect();
  const parentSel = document.getElementById('subParent');
  // Default the subclass level to the parent class's own subclass level.
  parentSel.addEventListener('change', ()=>{
    const cd = CLASS_DATA[parentSel.value];
    if(cd) document.getElementById('subLevel').value = cd.subclassLevel || 3;
  });
  document.getElementById('subJsonToggle').addEventListener('click', ()=>{
    const w = document.getElementById('subJsonWrap');
    w.style.display = (w.style.display==='none') ? '' : 'none';
  });
  document.getElementById('subSubmit').addEventListener('click', ()=>{
    const jsonWrap = document.getElementById('subJsonWrap');
    const jsonText = document.getElementById('subJson').value.trim();
    if(jsonWrap.style.display!=='none' && jsonText){
      let obj;
      try { obj = JSON.parse(jsonText); }
      catch(e){
        const m = document.getElementById('subMsg');
        m.className = 'import-msg err'; m.textContent = 'Invalid JSON: ' + e.message;
        return;
      }
      const { parent, name, source, data, ...rest } = obj;
      submitSubclassImport({ parent, name, source, data: data || rest });
    } else {
      submitSubclassImport();
    }
  });
}

// ---------- Subspecies import (Library tab) ----------
async function loadCustomSubspecies(){
  let list = [];
  try { list = await apiListSubspecies(); } catch(e){ return; }
  // Drop previously-merged imports, restoring any built-in they shadowed.
  Object.keys(SUBSPECIES_DATA).forEach(k=>{ if(SUBSPECIES_DATA[k].custom) restoreOrDelete(SUBSPECIES_DATA, BUILTIN_SUBSPECIES, k); });
  list.forEach(rec=>{
    SUBSPECIES_DATA[subspKey(rec.parent, rec.name)] = Object.assign(
      { parent: rec.parent, name: rec.name }, rec.data,
      { source: rec.source, custom:true, customId: rec.id });
  });
}

// Parent-species dropdown for the import form (every species can be a parent).
function buildSubspeciesParentSelect(){
  const sel = document.getElementById('subspParent');
  if(!sel) return;
  const cur = sel.value;
  const names = Object.keys(SPECIES_DATA).sort();
  sel.innerHTML = '<option value="">— pick parent species —</option>' + names.map(n=>
    `<option value="${esc(n)}">${esc(n)} · ${SPECIES_DATA[n].source}</option>`).join('');
  if(cur && SPECIES_DATA[cur]) sel.value = cur;
}

function buildSubspeciesFromForm(){
  const parent = document.getElementById('subspParent').value;
  if(!parent) throw new Error('Pick a parent species.');
  if(!SPECIES_DATA[parent]) throw new Error('Unknown parent species.');
  const name = document.getElementById('subspName').value.trim();
  if(!name) throw new Error('Subspecies name is required.');
  const source = document.getElementById('subspSource').value;
  const data = { traits: parseTraitLines(document.getElementById('subspTraits').value) };
  const asi = document.getElementById('subspAsi').value.trim();
  const desc = document.getElementById('subspDesc').value.trim();
  if(asi) data.asi = asi;
  if(desc) data.desc = desc;
  return { parent, name, source, data };
}

async function submitSubspeciesImport(payload){
  const msg = document.getElementById('subspMsg');
  try{
    if(!payload) payload = buildSubspeciesFromForm();
    if(!payload.parent || !SPECIES_DATA[payload.parent]) throw new Error('A valid parent species is required.');
    if(!payload.name) throw new Error('Subspecies name is required.');
    if(!payload.data || typeof payload.data!=='object') throw new Error('Subspecies data is required.');
    const source = CLASS_SOURCES.includes(payload.source) ? payload.source : 'Homebrew';
    const res = await apiImportSubspecies({ parent: payload.parent, name: payload.name, source, data: payload.data });
    SUBSPECIES_DATA[subspKey(payload.parent, payload.name)] = Object.assign(
      { parent: payload.parent, name: payload.name }, payload.data,
      { source, custom:true, customId: res.id });
    msg.className = 'import-msg ok';
    msg.textContent = `Imported "${payload.name}" under ${payload.parent} (${source}) — now selectable as a subrace on that species in Settings.`;
    // Reflect the new subspecies everywhere it's listed.
    buildSubraceSelect(); renderSpeciesInfo(); buildSpeciesTraits(); renderSubspeciesImportedList(); buildLibraryEditSelects();
  }catch(err){
    msg.className = 'import-msg err';
    msg.textContent = 'Import failed: ' + err.message;
  }
}

function renderSubspeciesImportedList(){
  const box = document.getElementById('subspeciesImportedList');
  if(!box) return;
  const customs = Object.values(SUBSPECIES_DATA).filter(s=>s.custom);
  if(!customs.length){ box.innerHTML=''; return; }
  box.innerHTML = '<div class="picker-hint" style="margin-bottom:6px;">Imported subspecies</div>' + customs.map(s=>`
    <div class="imported-item">
      <span class="ii-name">${esc(s.name)} <span class="chip-abbr">${esc(s.parent)}</span></span>
      ${sourceTag(s.source)}
      <span class="ii-edit" data-parent="${esc(s.parent)}" data-name="${esc(s.name)}" title="Load into the form to edit">✎</span>
      <span class="row-del" data-id="${s.customId}" data-parent="${esc(s.parent)}" data-name="${esc(s.name)}">✕</span>
    </div>`).join('');
  box.querySelectorAll('.ii-edit').forEach(btn=>btn.addEventListener('click', e=>{
    fillSubspeciesForm(e.target.dataset.parent, e.target.dataset.name);
  }));
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', e=>
    deleteSubspeciesEntry(e.target.dataset.id, e.target.dataset.parent, e.target.dataset.name)));
}

async function deleteSubspeciesEntry(id, parent, name){
  if(!confirm(`Remove imported subspecies "${name}" (${parent})?${BUILTIN_SUBSPECIES[subspKey(parent,name)]?' The built-in version is restored.':''}`)) return false;
  await apiDeleteSubspecies(id);
  restoreOrDelete(SUBSPECIES_DATA, BUILTIN_SUBSPECIES, subspKey(parent, name));
  // Clear it from the character if it was the selected subrace.
  if(state.race===parent && state.subrace===name) state.subrace='';
  buildSubraceSelect(); renderSpeciesInfo(); buildSpeciesTraits(); renderSubspeciesImportedList(); buildLibraryEditSelects(); save();
  return true;
}

function bindSubspeciesImport(){
  buildSubspeciesParentSelect();
  document.getElementById('subspJsonToggle').addEventListener('click', ()=>{
    const w = document.getElementById('subspJsonWrap');
    w.style.display = (w.style.display==='none') ? '' : 'none';
  });
  document.getElementById('subspSubmit').addEventListener('click', ()=>{
    const jsonWrap = document.getElementById('subspJsonWrap');
    const jsonText = document.getElementById('subspJson').value.trim();
    if(jsonWrap.style.display!=='none' && jsonText){
      let obj;
      try { obj = JSON.parse(jsonText); }
      catch(e){
        const m = document.getElementById('subspMsg');
        m.className = 'import-msg err'; m.textContent = 'Invalid JSON: ' + e.message;
        return;
      }
      const { parent, name, source, data, ...rest } = obj;
      submitSubspeciesImport({ parent, name, source, data: data || rest });
    } else {
      submitSubspeciesImport();
    }
  });
}

// ---------- Spell import (Library tab) ----------
async function loadCustomSpells(){
  let list = [];
  try { list = await apiListSpells(); } catch(e){ return; }
  CUSTOM_SPELLS = {};
  list.forEach(rec=>{
    CUSTOM_SPELLS[rec.name] = Object.assign({}, rec.data, {
      source: rec.source, custom:true, customId: rec.id
    });
  });
}

function parseNameList(raw){
  return (raw||'').split(',').map(s=>s.trim()).filter(Boolean);
}

// A "select with an Other… escape hatch": read the picked option, or the
// free-text box when Other is selected.
function readSelectOther(selectId, otherId){
  const sel = document.getElementById(selectId);
  if(!sel) return '';
  if(sel.value === '__other') return (document.getElementById(otherId)?.value || '').trim();
  return sel.value.trim();
}

// Load a stored value back into a select-or-other pair: match an existing
// option, else fall back to Other with the value in the text box.
function setSelectOther(selectId, otherId, value){
  const sel = document.getElementById(selectId);
  const other = document.getElementById(otherId);
  if(!sel) return;
  const v = value || '';
  const known = [...sel.options].some(o=> o.value===v && o.value!=='__other');
  if(v && !known){
    sel.value = '__other';
    if(other){ other.value = v; other.style.display = ''; }
  } else {
    sel.value = v;
    if(other){ other.value = ''; other.style.display = 'none'; }
  }
}

// Show the free-text box only while Other is the current selection.
function toggleSelectOther(selectId, otherId){
  const sel = document.getElementById(selectId);
  const other = document.getElementById(otherId);
  if(!sel || !other) return;
  const isOther = sel.value === '__other';
  other.style.display = isOther ? '' : 'none';
  if(isOther) other.focus(); else other.value = '';
}

function buildSpellFromForm(){
  const name = document.getElementById('splName').value.trim();
  if(!name) throw new Error('Spell name is required.');
  const source = document.getElementById('splSource').value;
  const data = {
    level: Math.max(0, Math.min(9, parseInt(document.getElementById('splLevel').value, 10) || 0)),
    classes: parseNameList(document.getElementById('splClasses').value),
    tags: getTagPicker('splTagPicker')
  };
  const school = readSelectOther('splSchool', 'splSchoolOther');
  if(school) data.school = school;
  const castingTime = readSelectOther('splCastTime', 'splCastTimeOther');
  if(castingTime) data.castingTime = castingTime;
  [['range','splRange'],['components','splComponents'],['duration','splDuration'],['desc','splDesc']].forEach(([key,id])=>{
    const v = document.getElementById(id).value.trim();
    if(v) data[key] = v;
  });
  return { name, source, data };
}

async function submitSpellImport(payload){
  const msg = document.getElementById('splMsg');
  try{
    if(!payload) payload = buildSpellFromForm();
    if(!payload.name) throw new Error('Spell name is required.');
    if(!payload.data || typeof payload.data!=='object') throw new Error('Spell data is required.');
    const source = CLASS_SOURCES.includes(payload.source) ? payload.source : 'Homebrew';
    const res = await apiImportSpell({ name: payload.name, source, data: payload.data });
    CUSTOM_SPELLS[payload.name] = Object.assign({}, payload.data, { source, custom:true, customId: res.id });
    msg.className = 'import-msg ok';
    const cls = (payload.data.classes||[]);
    msg.textContent = `Imported "${payload.name}" (${source}) — in the Spell Library for ${cls.length?cls.join(', '):'every class'}.`;
    buildSpellClassSelect(); buildSpellLibrary(); renderSpellImportedList(); buildLibraryEditSelects(); refreshTagPickers();
  }catch(err){
    msg.className = 'import-msg err';
    msg.textContent = 'Import failed: ' + err.message;
  }
}

function renderSpellImportedList(){
  const box = document.getElementById('spellImportedList');
  if(!box) return;
  const customs = Object.entries(CUSTOM_SPELLS);
  if(!customs.length){ box.innerHTML=''; return; }
  box.innerHTML = '<div class="picker-hint" style="margin-bottom:6px;">Imported spells</div>' + customs.map(([n,s])=>`
    <div class="imported-item">
      <span class="ii-name">${esc(n)} <span class="chip-abbr">${levelLabel(Number(s.level)||0)}</span></span>
      ${sourceTag(s.source)}
      <span class="ii-edit" data-name="${esc(n)}" title="Load into the form to edit">✎</span>
      <span class="row-del" data-id="${s.customId}" data-name="${esc(n)}">✕</span>
    </div>`).join('');
  box.querySelectorAll('.ii-edit').forEach(btn=>btn.addEventListener('click', e=>{
    fillSpellForm(e.target.dataset.name);
  }));
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', e=>
    deleteSpellEntry(e.target.dataset.id, e.target.dataset.name)));
}

async function deleteSpellEntry(id, name){
  if(!confirm(`Remove imported spell "${name}"?`)) return false;
  await apiDeleteSpell(id);
  delete CUSTOM_SPELLS[name];
  buildSpellClassSelect(); buildSpellLibrary(); renderSpellImportedList(); buildLibraryEditSelects(); refreshTagPickers();
  return true;
}

function bindSpellImport(){
  document.getElementById('splJsonToggle').addEventListener('click', ()=>{
    const w = document.getElementById('splJsonWrap');
    w.style.display = (w.style.display==='none') ? '' : 'none';
  });
  document.getElementById('splSchool')?.addEventListener('change', ()=>
    toggleSelectOther('splSchool', 'splSchoolOther'));
  document.getElementById('splCastTime')?.addEventListener('change', e=>{
    toggleSelectOther('splCastTime', 'splCastTimeOther');
    // A reaction casting time also carries the Reaction tag, so the spell
    // surfaces under the Actions tab's Reactions list.
    if(e.target.value === '1 Reaction'){
      const tags = getTagPicker('splTagPicker');
      if(!tags.some(t=>/^reaction$/i.test(t))) setTagPicker('splTagPicker', [...tags, 'Reaction']);
    }
  });
  document.getElementById('splSubmit').addEventListener('click', ()=>{
    const jsonWrap = document.getElementById('splJsonWrap');
    const jsonText = document.getElementById('splJson').value.trim();
    if(jsonWrap.style.display!=='none' && jsonText){
      let obj;
      try { obj = JSON.parse(jsonText); }
      catch(e){
        const m = document.getElementById('splMsg');
        m.className = 'import-msg err'; m.textContent = 'Invalid JSON: ' + e.message;
        return;
      }
      const { name, source, data, ...rest } = obj;
      submitSpellImport({ name, source, data: data || rest });
    } else {
      submitSpellImport();
    }
  });
}

// ---------- Bulk import (Library tab) ----------
// One JSON payload can carry many entries of every type. Entries are keyed by
// object type + name (subclasses/subspecies also by parent) so the batch is
// deduplicated the same way the database is — the same key overwrites rather
// than duplicating. Classes and species import before their subclasses and
// subspecies so a parent defined in the same batch is available to its children.
const BULK_TYPE_ALIASES = {
  class:'class', classes:'class',
  species:'species',
  subclass:'subclass', subclasses:'subclass',
  subspecies:'subspecies',
  spell:'spell', spells:'spell'
};
const BULK_TYPE_ORDER = { class:0, species:1, subclass:2, subspecies:3, spell:4 };

function bulkTypeFromString(s){
  return BULK_TYPE_ALIASES[String(s||'').trim().toLowerCase().replace(/[\s_-]+/g,'')] || null;
}

// Best-effort type guess for entries that omit an explicit `type`, based on the
// shape of their fields.
function inferBulkType(o){
  const d = (o && o.data && typeof o.data==='object') ? o.data : o;
  if(!d || typeof d!=='object') return null;
  if(o.parent!=null){
    if('subclassLevel' in d || Array.isArray(d.features)) return 'subclass';
    if(Array.isArray(d.traits) || 'asi' in d) return 'subspecies';
    return null;
  }
  if('hitDie' in d || 'saves' in d || Array.isArray(d.subclasses)) return 'class';
  if('level' in d || 'castingTime' in d || 'school' in d) return 'spell';
  if('size' in d || 'speed' in d || Array.isArray(d.traits)) return 'species';
  return null;
}

// Turn one raw object into a normalized {type,name,parent,source,data} entry,
// or {error} when the type can't be resolved. `typeHint` comes from a grouped
// payload's key (e.g. "classes") and wins over the object's own `type`.
function normalizeBulkEntry(o, typeHint){
  if(!o || typeof o!=='object' || Array.isArray(o)) return { error:'not an object' };
  const { name, source, parent, data, type, ...rest } = o;
  const t = typeHint || bulkTypeFromString(type) || inferBulkType(o);
  if(!t) return { error:'unknown type' };
  const entry = {
    type: t,
    name: typeof name==='string' ? name.trim() : '',
    source,
    data: (data && typeof data==='object' && !Array.isArray(data)) ? data : rest
  };
  if(t==='subclass' || t==='subspecies') entry.parent = typeof parent==='string' ? parent.trim() : '';
  return entry;
}

// Flatten any accepted shape (array of typed entries, grouped object of
// type→array, or a single entry) into a list of normalized entries.
function collectBulkEntries(root){
  const list = [];
  if(Array.isArray(root)){
    root.forEach(o=> list.push(normalizeBulkEntry(o)));
  } else if(root && typeof root==='object'){
    const groups = Object.keys(root).filter(k=> bulkTypeFromString(k) && Array.isArray(root[k]));
    if(groups.length){
      groups.forEach(k=>{
        const t = bulkTypeFromString(k);
        root[k].forEach(o=> list.push(normalizeBulkEntry(o, t)));
      });
    } else {
      list.push(normalizeBulkEntry(root));
    }
  }
  return list;
}

// Import a single normalized entry: hit the matching endpoint and merge the
// result into the in-memory registry, mirroring the per-form submit handlers
// (but without their per-item UI rebuilds — the bulk flow refreshes once).
async function importOneBulk(e){
  const source = CLASS_SOURCES.includes(e.source) ? e.source : 'Homebrew';
  if(e.type==='class'){
    const res = await apiImportClass({ name:e.name, source, data:e.data });
    CLASS_DATA[e.name] = Object.assign({}, e.data, { source, homebrew:source==='Homebrew', custom:true, customId:res.id, builtin:false });
  } else if(e.type==='species'){
    const res = await apiImportSpecies({ name:e.name, source, data:e.data });
    SPECIES_DATA[e.name] = Object.assign({}, e.data, { source, custom:true, customId:res.id, builtin:false });
  } else if(e.type==='subclass'){
    if(!CLASS_DATA[e.parent]) throw new Error(`unknown parent class "${e.parent}"`);
    const res = await apiImportSubclass({ parent:e.parent, name:e.name, source, data:e.data });
    SUBCLASS_DATA[subKey(e.parent, e.name)] = Object.assign({ parent:e.parent, name:e.name }, e.data, { source, custom:true, customId:res.id });
  } else if(e.type==='subspecies'){
    if(!SPECIES_DATA[e.parent]) throw new Error(`unknown parent species "${e.parent}"`);
    const res = await apiImportSubspecies({ parent:e.parent, name:e.name, source, data:e.data });
    SUBSPECIES_DATA[subspKey(e.parent, e.name)] = Object.assign({ parent:e.parent, name:e.name }, e.data, { source, custom:true, customId:res.id });
  } else if(e.type==='spell'){
    const res = await apiImportSpell({ name:e.name, source, data:e.data });
    CUSTOM_SPELLS[e.name] = Object.assign({}, e.data, { source, custom:true, customId:res.id });
  }
}

// Rebuild every Library list, picker, and edit select in one pass after a batch.
function refreshLibraryAfterBulk(){
  buildClassFilterBar(); buildClassList(); renderClassInfoStack(); buildClassFeatures(); buildActions();
  buildSpeciesSelect(); buildSubraceSelect(); renderSpeciesInfo(); buildSpeciesTraits();
  buildSpellClassSelect(); buildSpellLibrary();
  buildSubclassParentSelect(); buildSubspeciesParentSelect();
  renderImportedList(); renderSpeciesImportedList(); renderSubclassImportedList();
  renderSubspeciesImportedList(); renderSpellImportedList();
  buildLibraryEditSelects(); refreshTagPickers();
}

function setBulkMsg(kind, html){
  const msg = document.getElementById('bulkMsg');
  if(!msg) return;
  msg.className = 'import-msg ' + kind;
  msg.innerHTML = html;
}

async function submitBulkImport(){
  const raw = (document.getElementById('bulkJson').value || '').trim();
  if(!raw){ setBulkMsg('err', 'Paste JSON containing one or more entries to import.'); return; }
  let root;
  try { root = JSON.parse(raw); }
  catch(e){ setBulkMsg('err', 'Invalid JSON: ' + esc(e.message)); return; }

  const collected = collectBulkEntries(root);
  if(!collected.length){
    setBulkMsg('err', 'No importable entries found. Provide an array of typed entries, a { "classes":[…], "spells":[…] } object, or a single entry.');
    return;
  }

  // Validate + dedupe by type + parent + name (case-insensitive; last wins).
  const problems = [];
  const byKey = new Map();
  let dupes = 0;
  collected.forEach((e, i)=>{
    const n = i + 1;
    if(e.error){ problems.push(`#${n}: ${e.error} — add a "type" field (class, species, subclass, subspecies, or spell).`); return; }
    if(!e.name){ problems.push(`#${n} (${e.type}): missing name.`); return; }
    if((e.type==='subclass' || e.type==='subspecies') && !e.parent){ problems.push(`#${n} (${e.type} "${e.name}"): missing parent.`); return; }
    if(!e.data || typeof e.data!=='object' || Array.isArray(e.data) || !Object.keys(e.data).length){
      problems.push(`#${n} (${e.type} "${e.name}"): missing data fields.`); return;
    }
    const key = e.type + ' ' + (e.parent||'').toLowerCase() + ' ' + e.name.toLowerCase();
    if(byKey.has(key)) dupes++;
    byKey.set(key, e);
  });

  const queue = [...byKey.values()].sort((a,b)=> BULK_TYPE_ORDER[a.type] - BULK_TYPE_ORDER[b.type]);
  if(!queue.length){
    setBulkMsg('err', 'Nothing could be imported.<br>' + problems.map(esc).join('<br>'));
    return;
  }

  setBulkMsg('ok', `Importing ${queue.length} entr${queue.length===1?'y':'ies'}…`);
  const counts = {};
  const failed = [];
  for(const e of queue){
    try { await importOneBulk(e); counts[e.type] = (counts[e.type]||0) + 1; }
    catch(err){ failed.push(`${e.type} "${esc(e.name)}": ${esc(err.message)}`); }
  }
  refreshLibraryAfterBulk();

  const PLURALS = { class:'classes', species:'species', subclass:'subclasses', subspecies:'subspecies', spell:'spells' };
  const done = Object.values(counts).reduce((a,b)=>a+b, 0);
  const breakdown = Object.keys(counts).sort((a,b)=>BULK_TYPE_ORDER[a]-BULK_TYPE_ORDER[b])
    .map(t=>`${counts[t]} ${counts[t]>1 ? PLURALS[t] : t}`).join(', ');
  const lines = [];
  lines.push(`<strong>Imported ${done} entr${done===1?'y':'ies'}</strong>${breakdown?` — ${esc(breakdown)}`:''}.`);
  if(dupes) lines.push(`${dupes} in-batch duplicate${dupes>1?'s':''} merged by type + name.`);
  if(problems.length) lines.push(`Skipped ${problems.length}: ${problems.map(esc).join('; ')}`);
  if(failed.length) lines.push(`Failed ${failed.length}: ${failed.join('; ')}`);
  setBulkMsg(failed.length || problems.length ? 'err' : 'ok', lines.join('<br>'));
}

// Fill the box with every imported entry in the bulk format, so a library can be
// copied out and re-imported (round-trips through submitBulkImport).
function exportLibraryJson(){
  const strip = (obj)=>{ const { source, custom, customId, builtin, homebrew, parent, name, ...rest } = obj; return rest; };
  const entries = [];
  Object.entries(CLASS_DATA).filter(([,d])=>d.custom).forEach(([name,d])=> entries.push({ type:'class', name, source:d.source, data:strip(d) }));
  Object.entries(SPECIES_DATA).filter(([,d])=>d.custom).forEach(([name,d])=> entries.push({ type:'species', name, source:d.source, data:strip(d) }));
  Object.values(SUBCLASS_DATA).filter(d=>d.custom).forEach(d=> entries.push({ type:'subclass', parent:d.parent, name:d.name, source:d.source, data:strip(d) }));
  Object.values(SUBSPECIES_DATA).filter(d=>d.custom).forEach(d=> entries.push({ type:'subspecies', parent:d.parent, name:d.name, source:d.source, data:strip(d) }));
  Object.entries(CUSTOM_SPELLS).forEach(([name,d])=> entries.push({ type:'spell', name, source:d.source, data:strip(d) }));
  const box = document.getElementById('bulkJson');
  if(box) box.value = JSON.stringify(entries, null, 2);
  setBulkMsg(entries.length?'ok':'err', entries.length
    ? `Exported ${entries.length} imported entr${entries.length===1?'y':'ies'} into the box.`
    : 'No imported entries to export yet.');
}

function bindBulkImport(){
  const submit = document.getElementById('bulkSubmit');
  if(!submit) return;
  submit.addEventListener('click', submitBulkImport);
  document.getElementById('bulkExport')?.addEventListener('click', exportLibraryJson);
  const file = document.getElementById('bulkFile');
  file?.addEventListener('change', ()=>{
    const f = file.files && file.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      document.getElementById('bulkJson').value = reader.result || '';
      setBulkMsg('ok', `Loaded "${esc(f.name)}" — review it, then press Import All.`);
    };
    reader.onerror = ()=> setBulkMsg('err', `Could not read "${esc(f.name)}".`);
    reader.readAsText(f);
    file.value = ''; // allow re-selecting the same file
  });
}

// ---------- Load-existing pickers (Library tab) ----------
// Every panel gets a dropdown listing built-in AND imported entries; picking
// one fills the form so it can be tweaked and re-imported. Saving under the
// same name overwrites the entry (built-ins become imported overrides);
// saving under a new name creates a copy.

function setImportMsg(id, name){
  const msg = document.getElementById(id);
  if(!msg) return;
  msg.className = 'import-msg ok';
  msg.textContent = `Loaded "${name}" into the form — edit and press Import to save. Same name overwrites; a new name makes a copy.`;
}

// features [{lv,name,desc,use,cost}] → "lv | name | desc | use | cost" lines.
function featuresToLines(features){
  return (features||[]).map(f=>{
    const parts = [f.lv, f.name, f.desc||'', f.use||'', f.cost||'', (f.choices||[]).join('; ')]
      .map(p=>String(p==null?'':p));
    while(parts.length>2 && !parts[parts.length-1]) parts.pop();
    return parts.join(' | ');
  }).join('\n');
}
function traitsToLines(traits){
  return (traits||[]).map(t=> t.desc ? `${t.name} | ${t.desc}` : t.name).join('\n');
}

// Show/hide a form's Delete button. Only imported (custom) entries can be
// deleted; built-ins loaded for editing hide the button. `entry` is the deletion
// target ({id, name[, parent]}) or null to hide.
function setFormDelete(btnId, entry){
  const btn = document.getElementById(btnId);
  if(!btn) return;
  if(entry && entry.id != null){
    btn.style.display = '';
    btn.dataset.id = entry.id;
    btn.dataset.name = entry.name;
    if(entry.parent != null) btn.dataset.parent = entry.parent; else delete btn.dataset.parent;
  } else {
    btn.style.display = 'none';
    delete btn.dataset.id;
  }
}

// After deleting from an edit form: hide the Delete button and confirm in the
// form's message line.
function afterFormDelete(btnId, msgId, name){
  const btn = document.getElementById(btnId);
  if(btn){ btn.style.display = 'none'; delete btn.dataset.id; }
  const msg = document.getElementById(msgId);
  if(msg){ msg.className = 'import-msg ok'; msg.textContent = `Deleted "${name}".`; }
}

function fillClassForm(name){
  const cd = CLASS_DATA[name];
  if(!cd) return;
  document.getElementById('impName').value = name;
  document.getElementById('impSource').value = CLASS_SOURCES.includes(cd.source) ? cd.source : 'Homebrew';
  document.getElementById('impHitDie').value = String(cd.hitDie||8);
  document.querySelectorAll('#impSaves .mini-toggle').forEach(t=>
    t.classList.toggle('on', (cd.saves||[]).includes(t.dataset.k)));
  document.getElementById('impChoose').value = cd.choose||0;
  document.getElementById('impSubLevel').value = cd.subclassLevel||3;
  document.getElementById('impSkills').value = Array.isArray(cd.skills) ? cd.skills.join(', ') : '';
  document.getElementById('impSubclasses').value = (cd.subclasses||[]).join(', ');
  document.getElementById('impCasting').value = (cd.casting&&cd.casting.type)||'none';
  document.getElementById('impCastAbility').value = (cd.casting&&cd.casting.ability)||'';
  document.getElementById('impDesc').value = cd.desc||'';
  document.getElementById('impFeatures').value = featuresToLines(cd.features);
  setFormDelete('impDelete', cd.custom ? { id: cd.customId, name } : null);
  setImportMsg('impMsg', name);
}

function fillSpeciesForm(name){
  const sd = SPECIES_DATA[name];
  if(!sd) return;
  document.getElementById('spName').value = name;
  document.getElementById('spSource').value = CLASS_SOURCES.includes(sd.source) ? sd.source : 'Homebrew';
  document.getElementById('spSize').value = sd.size||'Medium';
  document.getElementById('spSpeed').value = sd.speed||30;
  document.getElementById('spDarkvision').value = sd.darkvision||0;
  document.getElementById('spAsi').value = sd.asi||'';
  document.getElementById('spLanguages').value = sd.languages||'';
  document.getElementById('spDesc').value = sd.desc||'';
  document.getElementById('spTraits').value = traitsToLines(sd.traits);
  setFormDelete('spDelete', sd.custom ? { id: sd.customId, name } : null);
  setImportMsg('spMsg', name);
}

function fillBackgroundForm(name){
  const bd = BACKGROUND_DATA[name];
  if(!bd) return;
  document.getElementById('bgName').value = name;
  document.getElementById('bgSource').value = CLASS_SOURCES.includes(bd.source) ? bd.source : 'Homebrew';
  document.getElementById('bgSkills').value = (bd.skills||[]).join(', ');
  document.getElementById('bgTools').value = bd.tools||'';
  document.getElementById('bgLanguages').value = bd.languages||'';
  document.getElementById('bgEquipment').value = bd.equipment||'';
  document.getElementById('bgDesc').value = bd.desc||'';
  document.getElementById('bgFeatureName').value = (bd.feature&&bd.feature.name)||'';
  document.getElementById('bgFeatureDesc').value = (bd.feature&&bd.feature.desc)||'';
  setFormDelete('bgDelete', bd.custom ? { id: bd.customId, name } : null);
  setImportMsg('bgMsg', name);
}

function fillSubclassForm(parent, name){
  const cd = CLASS_DATA[parent];
  if(!cd) return;
  const sc = SUBCLASS_DATA[subKey(parent, name)];
  buildSubclassParentSelect();
  document.getElementById('subParent').value = parent;
  document.getElementById('subName').value = name;
  const source = sc ? sc.source : cd.source;
  document.getElementById('subSource').value = CLASS_SOURCES.includes(source) ? source : 'Homebrew';
  document.getElementById('subLevel').value = (sc && sc.subclassLevel) || cd.subclassLevel || 3;
  document.getElementById('subDesc').value = (sc && sc.desc)||'';
  document.getElementById('subFeatures').value = featuresToLines(sc && sc.features);
  setFormDelete('subDelete', (sc && sc.custom) ? { id: sc.customId, parent, name } : null);
  setImportMsg('subMsg', `${name} (${parent})`);
}

function fillSubspeciesForm(parent, name){
  const sd = SPECIES_DATA[parent];
  if(!sd) return;
  const ss = SUBSPECIES_DATA[subspKey(parent, name)];
  buildSubspeciesParentSelect();
  document.getElementById('subspParent').value = parent;
  document.getElementById('subspName').value = name;
  const source = ss ? ss.source : sd.source;
  document.getElementById('subspSource').value = CLASS_SOURCES.includes(source) ? source : 'Homebrew';
  document.getElementById('subspAsi').value = (ss && ss.asi)||'';
  document.getElementById('subspDesc').value = (ss && ss.desc)||'';
  document.getElementById('subspTraits').value = traitsToLines(ss && ss.traits);
  setFormDelete('subspDelete', (ss && ss.custom) ? { id: ss.customId, parent, name } : null);
  setImportMsg('subspMsg', `${name} (${parent})`);
}

// Which built-in class lists carry a spell — used to prefill its class list.
// Folds in school + description from SPELL_DETAILS so editing a built-in
// spell in the Library starts from its reference data.
function builtinSpellInfo(name){
  const classes = [];
  let level = 0;
  SPELL_CLASSES.forEach(c=>{
    const hit = SPELL_DATA[c].find(s=>s.name===name);
    if(hit){ classes.push(c); level = hit.level; }
  });
  return classes.length ? Object.assign({}, SPELL_DETAILS[name]||{}, { level, classes }) : null;
}

function fillSpellForm(name){
  const imp = CUSTOM_SPELLS[name];
  const info = imp || builtinSpellInfo(name);
  if(!info) return;
  document.getElementById('splName').value = name;
  document.getElementById('splSource').value = CLASS_SOURCES.includes(info.source) ? info.source : (imp ? 'Homebrew' : '5E');
  document.getElementById('splLevel').value = Number(info.level)||0;
  document.getElementById('splClasses').value = (info.classes||[]).join(', ');
  setSelectOther('splSchool', 'splSchoolOther', info.school||'');
  setSelectOther('splCastTime', 'splCastTimeOther', info.castingTime||'');
  document.getElementById('splRange').value = info.range||'';
  document.getElementById('splComponents').value = info.components||'';
  document.getElementById('splDuration').value = info.duration||'';
  setTagPicker('splTagPicker', info.tags||[]);
  document.getElementById('splDesc').value = info.desc||'';
  setFormDelete('splDelete', imp ? { id: imp.customId, name } : null);
  setImportMsg('splMsg', name);
}

function buildLibraryEditSelects(){
  const fill = (id, options)=>{
    const sel = document.getElementById(id);
    if(!sel) return;
    sel.innerHTML = '<option value="">— pick an entry to edit —</option>' + options;
  };
  const tag = obj => obj.custom ? 'imported' : 'built-in';
  fill('impEdit', Object.keys(CLASS_DATA).sort().map(n=>
    `<option value="${esc(n)}">${esc(n)} · ${CLASS_DATA[n].source} · ${tag(CLASS_DATA[n])}</option>`).join(''));
  fill('spEdit', Object.keys(SPECIES_DATA).sort().map(n=>
    `<option value="${esc(n)}">${esc(n)} · ${SPECIES_DATA[n].source} · ${tag(SPECIES_DATA[n])}</option>`).join(''));
  fill('bgEdit', Object.keys(BACKGROUND_DATA).sort().map(n=>
    `<option value="${esc(n)}">${esc(n)} · ${BACKGROUND_DATA[n].source} · ${tag(BACKGROUND_DATA[n])}</option>`).join(''));
  // Subclasses: built-in name lists on each class plus imported records.
  const subEntries = [];
  Object.keys(CLASS_DATA).forEach(parent=>
    subclassNamesForClass(parent).forEach(n=>{
      const sc = SUBCLASS_DATA[subKey(parent, n)];
      subEntries.push({ parent, name:n, label:`${n} — ${parent} · ${sc?sc.source+' · imported':'built-in'}` });
    }));
  fill('subEdit', subEntries.sort((a,b)=>a.label.localeCompare(b.label)).map(s=>
    `<option value="${esc(subKey(s.parent, s.name))}">${esc(s.label)}</option>`).join(''));
  // Subspecies: built-in subrace name lists on each species plus imported records.
  const subspEntries = [];
  Object.keys(SPECIES_DATA).forEach(parent=>
    subspeciesNamesForSpecies(parent).forEach(n=>{
      const ss = SUBSPECIES_DATA[subspKey(parent, n)];
      subspEntries.push({ parent, name:n, label:`${n} — ${parent} · ${ss?(ss.custom?ss.source+' · imported':ss.source):'built-in'}` });
    }));
  fill('subspEdit', subspEntries.sort((a,b)=>a.label.localeCompare(b.label)).map(s=>
    `<option value="${esc(subspKey(s.parent, s.name))}">${esc(s.label)}</option>`).join(''));
  // Spells: unique built-in names plus imported ones (imported shadow built-ins).
  const spellNames = new Set(Object.keys(CUSTOM_SPELLS));
  SPELL_CLASSES.forEach(c=> SPELL_DATA[c].forEach(s=> spellNames.add(s.name)));
  fill('splEdit', [...spellNames].sort().map(n=>{
    const imp = CUSTOM_SPELLS[n];
    const lvl = imp ? (Number(imp.level)||0) : (builtinSpellInfo(n)||{}).level;
    return `<option value="${esc(n)}">${esc(n)} · ${levelLabel(lvl||0)} · ${imp?imp.source+' · imported':'built-in'}</option>`;
  }).join(''));
}

function bindLibraryEditSelects(){
  const wire = (id, fn)=>{
    const sel = document.getElementById(id);
    if(sel) sel.addEventListener('change', ()=>{ if(sel.value) fn(sel.value); });
  };
  wire('impEdit', fillClassForm);
  wire('spEdit', fillSpeciesForm);
  wire('bgEdit', fillBackgroundForm);
  wire('subEdit', key=>{
    const i = key.indexOf('::');
    if(i>0) fillSubclassForm(key.slice(0,i), key.slice(i+2));
  });
  wire('subspEdit', key=>{
    const i = key.indexOf('::');
    if(i>0) fillSubspeciesForm(key.slice(0,i), key.slice(i+2));
  });
  wire('splEdit', fillSpellForm);

  // Edit-form Delete buttons: fully remove the loaded imported entry. The
  // dataset is set by the matching fillXForm via setFormDelete().
  const wireDelete = (btnId, msgId, del)=>{
    const btn = document.getElementById(btnId);
    if(!btn) return;
    btn.addEventListener('click', async ()=>{
      if(!btn.dataset.id) return;
      const name = btn.dataset.name;
      if(await del(btn.dataset)) afterFormDelete(btnId, msgId, name);
    });
  };
  wireDelete('impDelete',   'impMsg',   d=>deleteClassEntry(d.id, d.name));
  wireDelete('spDelete',    'spMsg',    d=>deleteSpeciesEntry(d.id, d.name));
  wireDelete('bgDelete',    'bgMsg',    d=>deleteBackgroundEntry(d.id, d.name));
  wireDelete('subDelete',   'subMsg',   d=>deleteSubclassEntry(d.id, d.parent, d.name));
  wireDelete('subspDelete', 'subspMsg', d=>deleteSubspeciesEntry(d.id, d.parent, d.name));
  wireDelete('splDelete',   'splMsg',   d=>deleteSpellEntry(d.id, d.name));
}

// ---------- Save status indicator ----------
function setSaveStatus(status){
  const el = document.getElementById('saveStatus');
  if(!el) return;
  if(status==='saving'){ el.textContent='Saving…'; el.classList.add('saving'); }
  else if(status==='error'){ el.textContent='Save failed — check the server'; el.classList.remove('saving'); }
  else { el.textContent='Saved'; el.classList.remove('saving'); }
}

// ---------- Debounced autosave to the local database ----------
let saveTimeout=null;
function save(){
  if(PAGE!=='sheet') return; // no character is loaded on standalone pages
  clearTimeout(saveTimeout);
  setSaveStatus('saving');
  saveTimeout = setTimeout(async ()=>{
    try{
      if(state.id){
        await apiUpdateCharacter(state.id, state.name, state);
      } else {
        const res = await apiCreateCharacter(state.name, state);
        state.id = res.id;
      }
      await refreshProfileList(state.id);
      setSaveStatus('saved');
    }catch(err){
      console.error('Save failed', err);
      setSaveStatus('error');
    }
  }, 500);
}

// ---------- Profile bar ----------
async function refreshProfileList(selectedId){
  const list = await apiListCharacters();
  const sel = document.getElementById('profileSelect');
  if(list.length===0){
    sel.innerHTML = '<option value="">No saved characters</option>';
    return;
  }
  sel.innerHTML = list.map(c=>
    `<option value="${c.id}" ${String(c.id)===String(selectedId)?'selected':''}>${(c.name||'Unnamed')} — ${c.class||'?'} ${c.level||1}</option>`
  ).join('');
}

function buildAlignmentSelect(){
  const sel = document.getElementById('charAlignment');
  const names = ALIGNMENTS.map(a=>a.name);
  sel.innerHTML = '<option value="">— unset —</option>'
    + ALIGNMENTS.map(a=>`<option value="${a.name}" ${state.alignment===a.name?'selected':''}>${a.abbr==='—'?'':a.abbr+' · '}${a.name}</option>`).join('');
  // Preserve any pre-existing free-text alignment that isn't in the list.
  if(state.alignment && !names.includes(state.alignment)){
    sel.insertAdjacentHTML('beforeend', `<option value="${state.alignment}" selected>${state.alignment} (custom)</option>`);
  }
}

// Static rules reference — built once; content doesn't change per character.
function buildNotes(){
  const grid = document.getElementById('alignGrid');
  if(grid && !grid.dataset.built){
    grid.innerHTML = ALIGNMENTS.map(a=>`
      <div class="align-card">
        <div><span class="a-abbr">${a.abbr}</span><span class="a-name">${a.name}</span></div>
        <div class="a-desc">${a.desc}</div>
        <div class="a-eg"><b>e.g.</b> ${a.eg}</div>
      </div>`).join('');
    grid.dataset.built = '1';
  }
  const mgrid = document.getElementById('masteryGrid');
  if(mgrid && !mgrid.dataset.built){
    mgrid.innerHTML = MASTERY_PROPERTIES.map(m=>`
      <div class="align-card">
        <div><span class="a-name">${m.name}</span></div>
        <div class="a-desc">${m.desc}</div>
        <div class="mastery-weapons">${m.weapons.map(w=>`<span class="mastery-chip">${w}</span>`).join('')}</div>
      </div>`).join('');
    mgrid.dataset.built = '1';
  }
}

// ---------- Notes page: reference search ----------
// A flat index over everything the app knows — built-in and imported classes,
// their features, subclasses, species & traits, spells, standard actions, and
// alignments — so the Notes page can look any of it up by name or text.
let NOTES_INDEX = [];
let notesFilter = 'All';
let notesBrowsePage = 0; // current page when browsing a type filter with no search query
const NOTES_PAGE_SIZE = 20;
// Features and standard combat actions are deliberately absent: features are
// reachable through the class/subclass entry that owns them (their text is folded
// into that entry's haystack), so they don't clutter the results as separate rows.
const NOTES_TYPES = ['All','Classes','Subclasses','Species','Subspecies','Spells','Alignments','Mastery'];

function notesEntry(type, name, badges, haystack, detail, edit){
  return { type, name, badges: badges.filter(Boolean).map(String),
    text: (name + ' ' + haystack).toLowerCase(), detail, edit };
}

// Deep link into the Import page's forms: /import?edit=<type>:<key>.
// The Import page loads the entry into the matching form (see openLibraryEditParam).
function editLink(type, key, label){
  return { href: '/import?edit=' + type + ':' + encodeURIComponent(key), label };
}

// Level-tagged feature list used inside the detail popup for classes and subclasses.
function classFeaturesHtml(features){
  return (features||[]).map(f=>`
    <div class="feat-item">
      <div class="feat-head"><span class="f-lvl">L${f.lv}</span><span class="f-name">${esc(f.name)}</span>
        ${f.use?`<span class="nr-badge">${esc(f.use)}</span>`:''}${f.cost?`<span class="nr-badge">${esc(f.cost)}</span>`:''}</div>
      ${f.desc?`<div class="feat-desc">${esc(f.desc)}</div>`:''}
    </div>`).join('');
}

function castingLabel(c){
  if(!c || c.type==='none') return 'non-caster';
  const ab = c.ability ? ' ('+c.ability.toUpperCase()+')' : '';
  return c.type==='full' ? 'full caster'+ab : c.type==='half' ? 'half caster'+ab : 'pact magic'+ab;
}

// Feature names/descriptions/choices, flattened into one string so a search for a
// feature still finds the class or subclass that grants it.
function featuresHaystack(features){
  return (features||[]).map(f=>
    [f.name, f.desc, f.use, f.cost, (f.choices||[]).join(' ')].filter(Boolean).join(' ')).join(' ');
}

function buildNotesIndex(){
  const ix = [];

  // Classes and their features.
  Object.entries(CLASS_DATA).forEach(([name, cd])=>{
    const skills = Array.isArray(cd.skills) ? cd.skills.join(', ') : 'any skill';
    const subNames = subclassNamesForClass(name); // built-in + imported
    const meta = `<div class="nr-meta">d${cd.hitDie||8} hit die · saves ${(cd.saves||[]).map(s=>s.toUpperCase()).join(' / ')||'—'} · ${esc(castingLabel(cd.casting))} · subclass at level ${cd.subclassLevel||'—'}</div>
       <div class="nr-meta">skills (choose ${cd.choose||0}): ${esc(skills)}</div>`;
    ix.push(Object.assign(notesEntry('Classes', name, [cd.source, cd.custom?'imported':'built-in'],
      [cd.desc, skills, subNames.join(' '), castingLabel(cd.casting), featuresHaystack(cd.features)].filter(Boolean).join(' '),
      meta
      + `${subNames.length?`<div class="nr-meta">subclasses: ${esc(subNames.join(', '))}</div>`:''}
       ${cd.desc?`<div class="feat-desc">${esc(cd.desc)}</div>`:''}`,
      editLink('class', name, 'Edit class in Library')),
      { full: meta
        + `${cd.desc?`<div class="feat-desc">${esc(cd.desc)}</div>`:''}`
        + (subNames.length?`<div class="nr-sect">Subclasses — click to view</div><div class="nr-sub-list">${
            subNames.map(n=>`<span class="nr-sub-link" data-key="${esc(subKey(name, n))}">${esc(n)}</span>`).join('')}</div>`:'')
        + ((cd.features||[]).length?`<div class="nr-sect">Features</div>`+classFeaturesHtml(cd.features):'') }));
  });

  // Subclasses: imported records carry detail; built-in ones are name-only lists.
  const seenSubs = new Set();
  Object.values(SUBCLASS_DATA).forEach(sc=>{
    seenSubs.add(subKey(sc.parent, sc.name));
    const summary = `<div class="nr-meta">${esc(sc.parent)} subclass · chosen at level ${sc.subclassLevel||3}</div>
       ${sc.desc?`<div class="feat-desc">${esc(sc.desc)}</div>`:''}`;
    ix.push(Object.assign(notesEntry('Subclasses', sc.name, [sc.parent, sc.source||'Homebrew', 'imported'],
      [sc.desc, sc.parent, featuresHaystack(sc.features)].filter(Boolean).join(' '),
      summary,
      editLink('subclass', subKey(sc.parent, sc.name), 'Edit subclass in Library')),
      { key: subKey(sc.parent, sc.name),
        parent: { type:'Classes', name: sc.parent },
        full: summary + ((sc.features||[]).length?`<div class="nr-sect">Features</div>`+classFeaturesHtml(sc.features):'') }));
  });
  Object.entries(CLASS_DATA).forEach(([parent, cd])=>{
    (cd.subclasses||[]).forEach(n=>{
      if(seenSubs.has(subKey(parent, n))) return;
      ix.push(Object.assign(notesEntry('Subclasses', n, [parent, 'built-in'], parent,
        `<div class="nr-meta">${esc(parent)} subclass · chosen at level ${cd.subclassLevel||3}</div>`,
        editLink('subclass', subKey(parent, n), 'Edit subclass in Library')),
        { key: subKey(parent, n),
          parent: { type:'Classes', name: parent },
          full: `<div class="nr-meta">${esc(parent)} subclass · chosen at level ${cd.subclassLevel||3}</div>
                 <div class="feat-desc">Name-only entry — import it in the Library to add a description and features.</div>` }));
    });
  });

  // Species with their traits inline; subraces listed as click-through chips.
  Object.entries(SPECIES_DATA).forEach(([name, sd])=>{
    const traits = sd.traits||[];
    const subNames = subspeciesNamesForSpecies(name); // built-in + imported
    const detail = `<div class="nr-meta">${esc(sd.size||'Medium')} · ${sd.speed||30} ft${sd.darkvision?' · darkvision '+sd.darkvision+' ft':''}${sd.asi?' · '+esc(sd.asi):''}</div>
       ${sd.languages?`<div class="nr-meta">languages: ${esc(sd.languages)}</div>`:''}
       ${sd.desc?`<div class="feat-desc">${esc(sd.desc)}</div>`:''}
       ${traits.map(t=>`<div class="feat-desc"><b>${esc(t.name)}</b>${t.desc?' — '+esc(t.desc):''}</div>`).join('')}`;
    ix.push(Object.assign(notesEntry('Species', name, [sd.source, sd.custom?'imported':'built-in'],
      [sd.desc, sd.asi, sd.languages, subNames.join(' '), traits.map(t=>t.name+' '+(t.desc||'')).join(' ')].filter(Boolean).join(' '),
      detail,
      editLink('species', name, 'Edit species in Library')),
      { full: detail
        + (subNames.length?`<div class="nr-sect">Subraces — click to view</div><div class="nr-sub-list">${
            subNames.map(n=>`<span class="nr-sub-link" data-key="${esc(subspKey(name, n))}">${esc(n)}</span>`).join('')}</div>`:'') }));
  });

  // Subspecies (subraces): detailed records carry traits; species subrace
  // name-lists fill in the rest. Each links back to its parent species.
  const seenSubsp = new Set();
  Object.values(SUBSPECIES_DATA).forEach(ss=>{
    seenSubsp.add(subspKey(ss.parent, ss.name));
    const traits = ss.traits||[];
    const summary = `<div class="nr-meta">${esc(ss.parent)} subrace${ss.asi?' · '+esc(ss.asi):''}</div>
       ${ss.desc?`<div class="feat-desc">${esc(ss.desc)}</div>`:''}`;
    ix.push(Object.assign(notesEntry('Subspecies', ss.name, [ss.parent, ss.source||'Homebrew', ss.custom?'imported':'built-in'],
      [ss.desc, ss.parent, ss.asi, traits.map(t=>t.name+' '+(t.desc||'')).join(' ')].filter(Boolean).join(' '),
      summary,
      editLink('subspecies', subspKey(ss.parent, ss.name), 'Edit subspecies in Library')),
      { key: subspKey(ss.parent, ss.name),
        parent: { type:'Species', name: ss.parent },
        full: summary + (traits.length?`<div class="nr-sect">Traits</div>`+traits.map(t=>`<div class="feat-desc"><b>${esc(t.name)}</b>${t.desc?' — '+esc(t.desc):''}</div>`).join(''):'') }));
  });
  Object.entries(SPECIES_DATA).forEach(([parent, sd])=>{
    (sd.subraces||[]).forEach(n=>{
      if(seenSubsp.has(subspKey(parent, n))) return;
      ix.push(Object.assign(notesEntry('Subspecies', n, [parent, 'built-in'], parent,
        `<div class="nr-meta">${esc(parent)} subrace</div>`,
        editLink('subspecies', subspKey(parent, n), 'Edit subspecies in Library')),
        { key: subspKey(parent, n),
          parent: { type:'Species', name: parent },
          full: `<div class="nr-meta">${esc(parent)} subrace</div>
                 <div class="feat-desc">Name-only entry — import it in the Library to add a description and traits.</div>` }));
    });
  });

  // Spells: imported entries carry full detail and shadow built-in names.
  const builtinSpells = {};
  SPELL_CLASSES.forEach(c=> SPELL_DATA[c].forEach(s=>{
    (builtinSpells[s.name] = builtinSpells[s.name] || {level:s.level, classes:[]}).classes.push(c);
  }));
  new Set([...Object.keys(CUSTOM_SPELLS), ...Object.keys(builtinSpells)]).forEach(name=>{
    const imp = CUSTOM_SPELLS[name];
    const bi = builtinSpells[name];
    // Imported spells carry their own data; built-ins get school + description
    // from the SPELL_DETAILS reference table.
    const det = imp || SPELL_DETAILS[name] || {};
    const level = imp ? Number(imp.level)||0 : bi.level;
    const classes = imp
      ? (Array.isArray(imp.classes) && imp.classes.length ? imp.classes : ['every class'])
      : bi.classes;
    const bits = [det.school, det.castingTime&&'cast '+det.castingTime, det.range&&'range '+det.range,
      det.components, det.duration&&'duration '+det.duration].filter(Boolean).join(' · ');
    ix.push(notesEntry('Spells', name, [levelLabel(level), imp?imp.source:null, imp?'imported':'built-in'],
      [classes.join(' '), det.school, det.desc, (det.tags||[]).join(' ')].filter(Boolean).join(' '),
      `<div class="nr-meta">${esc(levelLabel(level))} · ${esc(classes.join(', '))}</div>
       ${bits?`<div class="nr-meta">${esc(bits)}</div>`:''}
       ${(det.tags||[]).length?`<div class="nr-meta">tags: ${esc(det.tags.join(', '))}</div>`:''}
       ${det.desc?`<div class="feat-desc">${esc(det.desc)}</div>`:''}`,
      editLink('spell', name, 'Edit spell in Library')));
  });

  ALIGNMENTS.forEach(a=> ix.push(notesEntry('Alignments', a.name, [a.abbr], a.desc+' '+a.eg,
    `<div class="feat-desc">${esc(a.desc)}</div><div class="nr-meta">e.g. ${esc(a.eg)}</div>`)));

  // Weapon Mastery properties — searchable by property name or any weapon that has it.
  MASTERY_PROPERTIES.forEach(m=> ix.push(notesEntry('Mastery', m.name, ['weapon mastery'],
    m.desc+' '+m.weapons.join(' '),
    `<div class="feat-desc">${esc(m.desc)}</div><div class="nr-meta">weapons: ${esc(m.weapons.join(', '))}</div>`)));

  return ix;
}

function renderNotesResults(){
  const box = document.getElementById('notesResults');
  const ref = document.getElementById('notesReference');
  if(!box) return;
  const q = (document.getElementById('notesSearch').value||'').trim().toLowerCase();
  if(!q){
    // No search query: browse mode. "All", "Alignments" and "Mastery" keep the
    // static reference below (filtered to the matching panel); every other
    // filter shows a paginated list.
    if(notesFilter==='All' || notesFilter==='Alignments' || notesFilter==='Mastery'){
      box.innerHTML = '';
      if(ref){
        ref.style.display = '';
        const alignPanel = document.getElementById('alignmentPanel');
        const masteryPanel = document.getElementById('masteryPanel');
        if(alignPanel) alignPanel.style.display = notesFilter==='Mastery' ? 'none' : '';
        if(masteryPanel) masteryPanel.style.display = notesFilter==='Alignments' ? 'none' : '';
      }
    } else {
      renderNotesBrowse();
    }
    return;
  }
  if(ref) ref.style.display = 'none';
  const hits = NOTES_INDEX.filter(e=> (notesFilter==='All' || e.type===notesFilter) && e.text.includes(q));
  if(!hits.length){
    box.innerHTML = `<div class="action-empty">No matches for "${esc(q)}"${notesFilter==='All'?'':' in '+notesFilter}.</div>`;
    return;
  }
  // Name matches outrank text-only matches; earlier match positions rank higher.
  hits.sort((a,b)=>{
    const an = a.name.toLowerCase().indexOf(q), bn = b.name.toLowerCase().indexOf(q);
    return ((an<0)-(bn<0)) || (an-bn) || a.name.localeCompare(b.name);
  });
  const MAX = 80;
  notesHits = hits.slice(0, MAX);
  const grouped = {};
  notesHits.forEach(e=> (grouped[e.type] = grouped[e.type]||[]).push(e));
  let html = '';
  NOTES_TYPES.slice(1).forEach(type=>{
    const list = grouped[type];
    if(!list) return;
    html += `<div class="nr-group">${type}</div>` + list.map(e=>`
      <div class="feat-item nr-item" data-i="${notesHits.indexOf(e)}" title="Click for full details">
        <div class="feat-head">
          <span class="f-name">${esc(e.name)}</span>
          ${e.badges.map(b=>`<span class="nr-badge">${esc(b)}</span>`).join('')}
        </div>
        ${e.detail}
      </div>`).join('');
  });
  if(hits.length > MAX) html += `<div class="picker-hint" style="margin-top:8px;">Showing the first ${MAX} of ${hits.length} matches — narrow the search.</div>`;
  box.innerHTML = html;
  // Clicking a result opens its detail popup (with the edit action, when editable).
  box.querySelectorAll('.nr-item').forEach(item=>{
    item.addEventListener('click', ()=> openNotesModal(notesHits[Number(item.dataset.i)]));
  });
}

// Browse mode: with no search query, a specific type filter lists every entry
// of that type, 20 per page, with prev/next paging. (All / Alignments / Mastery
// keep the static reference instead — see renderNotesResults.)
function renderNotesBrowse(){
  const box = document.getElementById('notesResults');
  const ref = document.getElementById('notesReference');
  if(!box) return;
  if(ref) ref.style.display = 'none';
  const all = NOTES_INDEX.filter(e=> e.type===notesFilter)
    .sort((a,b)=> a.name.localeCompare(b.name));
  if(!all.length){
    notesHits = [];
    box.innerHTML = `<div class="action-empty">No ${esc(notesFilter.toLowerCase())} in the reference yet.</div>`;
    return;
  }
  const pageCount = Math.ceil(all.length / NOTES_PAGE_SIZE);
  notesBrowsePage = Math.min(Math.max(notesBrowsePage, 0), pageCount - 1);
  const start = notesBrowsePage * NOTES_PAGE_SIZE;
  const pageItems = all.slice(start, start + NOTES_PAGE_SIZE);
  notesHits = pageItems; // rows index into this via data-i, like search results
  let html = `<div class="nr-group">${esc(notesFilter)} — ${all.length} total</div>`
    + pageItems.map((e,i)=>`
      <div class="feat-item nr-item" data-i="${i}" title="Click for full details">
        <div class="feat-head">
          <span class="f-name">${esc(e.name)}</span>
          ${e.badges.map(b=>`<span class="nr-badge">${esc(b)}</span>`).join('')}
        </div>
        ${e.detail}
      </div>`).join('');
  if(pageCount > 1){
    html += `<div class="nr-pager">
      <button class="pbtn nr-page-prev" ${notesBrowsePage===0?'disabled':''}>‹ Prev</button>
      <span class="nr-page-info">Page ${notesBrowsePage+1} of ${pageCount}</span>
      <button class="pbtn nr-page-next" ${notesBrowsePage>=pageCount-1?'disabled':''}>Next ›</button>
    </div>`;
  }
  box.innerHTML = html;
  box.querySelectorAll('.nr-item').forEach(item=>{
    item.addEventListener('click', ()=> openNotesModal(notesHits[Number(item.dataset.i)]));
  });
  const prev = box.querySelector('.nr-page-prev');
  const next = box.querySelector('.nr-page-next');
  if(prev) prev.addEventListener('click', ()=>{ notesBrowsePage--; renderNotesBrowse(); });
  if(next) next.addEventListener('click', ()=>{ notesBrowsePage++; renderNotesBrowse(); });
}

// ---------- Notes detail popups (floating, draggable, edge-snappable) ----------
// Each opened entry becomes its own modeless window cloned from #nrWindowTpl and
// appended to #nrWindowLayer, so several can coexist. Drilling into a subclass /
// parent tag REPLACES content in the same window (with a per-window Back stack).
// Windows drag by their header and snap to viewport halves/quarters/full when
// dropped near an edge (Aero-style). Below NR_WIN_MOBILE they go full-screen and
// dragging is disabled. Also used by the sheet's Spells/Actions detail popups.
let notesHits = []; // entries behind the currently rendered result rows
let nrWindows = []; // open windows: { el, refs, stack, current, restore }
let nrTopZ = 1200;  // z-index high-water mark for click-to-front
let nrModalBound = false;
const NR_WIN_MOBILE = 640; // viewport width at/below which windows go full-screen
const NR_EDGE = 26;        // px from a viewport edge that arms a snap zone

// Viewport size, with fallbacks: some embedded/preview browsers report 0 for
// innerWidth. Treat an unknown (0) viewport as desktop rather than mobile.
function nrViewport(){
  return {
    w: window.innerWidth || document.documentElement.clientWidth || window.screen.width || 1024,
    h: window.innerHeight || document.documentElement.clientHeight || window.screen.height || 768
  };
}

function nrIsMobile(){ return nrViewport().w <= NR_WIN_MOBILE; }

// Public entry point: spawn a NEW window for an entry (from a result/browse row
// or a sheet spell/action). Returns the window object.
function openNotesModal(entry){
  const layer = document.getElementById('nrWindowLayer');
  const tpl = document.getElementById('nrWindowTpl');
  if(!layer || !tpl || !entry) return null;
  const el = tpl.content.firstElementChild.cloneNode(true);
  const win = {
    el, stack: [], current: null, restore: null,
    refs: {
      head:   el.querySelector('[data-role=head]'),
      back:   el.querySelector('[data-role=back]'),
      title:  el.querySelector('[data-role=title]'),
      badges: el.querySelector('[data-role=badges]'),
      body:   el.querySelector('[data-role=body]'),
      foot:   el.querySelector('[data-role=foot]'),
      close:  el.querySelector('[data-role=close]')
    }
  };
  layer.appendChild(el);
  nrWindows.push(win);
  win.refs.close.addEventListener('click', ()=> nrCloseWindow(win));
  win.refs.back.addEventListener('click', ()=> nrNavigate(win, null, 'pop'));
  el.addEventListener('mousedown', ()=> nrFocusWindow(win), true);
  nrEnableDrag(win);
  nrPlaceWindow(win);
  nrFocusWindow(win);
  nrNavigate(win, entry, 'fresh');
  nrUpdateClearAll();
  return win;
}

// Update a window's content in place. mode: 'fresh' | 'push' | 'pop'.
function nrNavigate(win, entry, mode){
  if(mode==='push'){ if(win.current) win.stack.push(win.current); win.current = entry; }
  else if(mode==='pop'){ win.current = win.stack.pop() || win.current; }
  else { win.stack = []; win.current = entry; }
  entry = win.current;
  if(!entry) return;
  const r = win.refs;
  r.back.hidden = win.stack.length === 0;
  r.title.textContent = entry.name;
  // The parent tag (a subclass's class, a subrace's species) is a live link to
  // that parent's own view, opened in this same window when it's in the index.
  const parentEntry = entry.parent
    ? NOTES_INDEX.find(e=> e.type===entry.parent.type && e.name===entry.parent.name) : null;
  r.badges.innerHTML = entry.badges.map(b=> (parentEntry && b===entry.parent.name)
    ? `<span class="nr-badge nr-parent-link" title="Open ${esc(b)}">${esc(b)} ↗</span>`
    : `<span class="nr-badge">${esc(b)}</span>`).join('');
  r.body.innerHTML = entry.full || entry.detail;
  r.foot.innerHTML = entry.edit
    ? `<a class="pbtn nr-edit-link" href="${entry.edit.href}">✎ ${esc(entry.edit.label)}</a>
       <span class="nr-hint">opens the Library form with this entry loaded — re-import to save changes</span>`
    : '<span class="nr-hint">Built-in rule — not editable.</span>';
  // Click follows the link in this window (Back returns); Alt+click opens the
  // target as its own new window instead, so both can sit side by side.
  r.body.querySelectorAll('.nr-sub-link').forEach(chip=>{
    chip.title = 'Click to view here — Alt+click opens a new window';
    chip.addEventListener('click', ev=>{
      const target = NOTES_INDEX.find(e=>e.key===chip.dataset.key);
      if(!target) return;
      if(ev.altKey) openNotesModal(target);
      else nrNavigate(win, target, 'push');
    });
  });
  if(parentEntry){
    const link = r.badges.querySelector('.nr-parent-link');
    if(link){
      link.title = `Open ${entry.parent.name} here — Alt+click opens a new window`;
      link.addEventListener('click', ev=>{
        if(ev.altKey) openNotesModal(parentEntry);
        else nrNavigate(win, parentEntry, 'push');
      });
    }
  }
  r.body.scrollTop = 0;
}

function nrFocusWindow(win){
  win.el.style.zIndex = String(++nrTopZ);
  nrWindows.forEach(w=> w.el.classList.toggle('focused', w===win));
}

function nrCloseWindow(win){
  win.el.remove();
  nrWindows = nrWindows.filter(w=> w!==win);
  nrUpdateClearAll();
}

function nrCloseAllWindows(){
  nrWindows.forEach(w=> w.el.remove());
  nrWindows = [];
  nrUpdateClearAll();
}

// Initial placement: mobile → full-screen; desktop → a cascading offset so
// stacked windows don't hide each other.
function nrPlaceWindow(win){
  if(nrIsMobile()){ win.el.classList.add('nr-window-max'); return; }
  const { w:vw, h:vh } = nrViewport();
  const w = Math.max(280, Math.min(460, vw - 40));
  const n = (nrWindows.length - 1) % 6;
  const x = Math.max(10, Math.round((vw - w) / 2 - 90) + n * 30);
  const y = Math.max(10, Math.round(vh / 2 - 260) + n * 30);
  win.el.style.width = w + 'px';
  win.el.style.left = x + 'px';
  win.el.style.top = y + 'px';
}

// ----- Dragging + Aero-style edge snapping -----
function nrEnableDrag(win){
  win.refs.head.addEventListener('mousedown', e=>{
    if(e.target.closest('button') || nrIsMobile()) return;
    e.preventDefault();
    nrFocusWindow(win);
    // Restore floating size before dragging a snapped window.
    if(win.el.classList.contains('nr-window-snapped')){
      win.el.classList.remove('nr-window-snapped');
      const rest = win.restore || {};
      win.el.style.width = rest.width || '460px';
      win.el.style.height = rest.height || '';
    }
    const rect = win.el.getBoundingClientRect();
    let offX = e.clientX - rect.left, offY = e.clientY - rect.top;
    if(offX > rect.width) offX = rect.width / 2; // was snapped wider than restore
    let zone = null;
    const onMove = ev=>{
      const { w:vw, h:vh } = nrViewport();
      const x = Math.max(-rect.width + 90, Math.min(ev.clientX - offX, vw - 90));
      const y = Math.max(0, Math.min(ev.clientY - offY, vh - 40));
      win.el.style.left = x + 'px';
      win.el.style.top = y + 'px';
      zone = nrSnapZoneFor(ev.clientX, ev.clientY);
      nrShowSnapPreview(zone);
    };
    const onUp = ()=>{
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      nrShowSnapPreview(null);
      if(zone) nrApplySnap(win, zone);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

function nrSnapZoneFor(px, py){
  const { w:vw, h:vh } = nrViewport();
  const L = px <= NR_EDGE, R = px >= vw - NR_EDGE;
  const T = py <= NR_EDGE, B = py >= vh - NR_EDGE;
  if(T && L) return 'tl';
  if(T && R) return 'tr';
  if(B && L) return 'bl';
  if(B && R) return 'br';
  if(L) return 'left';
  if(R) return 'right';
  if(T) return 'max';
  return null;
}

function nrZoneRect(zone){
  const { w:vw, h:vh } = nrViewport();
  const m = 6;
  // Clamped so a small viewport can never yield a negative (invalid) size.
  const colW = Math.max(160, vw / 2 - 1.5 * m);
  const rowH = Math.max(120, vh / 2 - 1.5 * m);
  const fullW = Math.max(160, vw - 2 * m);
  const fullH = Math.max(120, vh - 2 * m);
  const rightX = Math.max(m, vw / 2 + m / 2);
  const botY = Math.max(m, vh / 2 + m / 2);
  switch(zone){
    case 'left':  return { left:m,      top:m,    width:colW,  height:fullH };
    case 'right': return { left:rightX, top:m,    width:colW,  height:fullH };
    case 'max':   return { left:m,      top:m,    width:fullW, height:fullH };
    case 'tl':    return { left:m,      top:m,    width:colW,  height:rowH };
    case 'tr':    return { left:rightX, top:m,    width:colW,  height:rowH };
    case 'bl':    return { left:m,      top:botY, width:colW,  height:rowH };
    case 'br':    return { left:rightX, top:botY, width:colW,  height:rowH };
  }
  return null;
}

function nrShowSnapPreview(zone){
  const z = document.getElementById('nrSnapZone');
  if(!z) return;
  const r = zone && nrZoneRect(zone);
  if(!r){ z.hidden = true; return; }
  z.style.left = r.left + 'px';
  z.style.top = r.top + 'px';
  z.style.width = r.width + 'px';
  z.style.height = r.height + 'px';
  z.hidden = false;
}

function nrApplySnap(win, zone){
  const r = nrZoneRect(zone);
  if(!r) return;
  if(!win.el.classList.contains('nr-window-snapped')){
    win.restore = { width: win.el.style.width, height: win.el.style.height };
  }
  win.el.classList.add('nr-window-snapped');
  win.el.style.left = r.left + 'px';
  win.el.style.top = r.top + 'px';
  win.el.style.width = r.width + 'px';
  win.el.style.height = r.height + 'px';
}

// A "Close all" button appears (bottom-centre) once two or more windows are open.
function nrUpdateClearAll(){
  let btn = document.getElementById('nrClearAll');
  if(nrWindows.length >= 2){
    if(!btn){
      btn = document.createElement('button');
      btn.id = 'nrClearAll';
      btn.type = 'button';
      btn.className = 'pbtn nr-clear-all';
      btn.addEventListener('click', nrCloseAllWindows);
      document.body.appendChild(btn);
    }
    btn.textContent = `✕ Close all (${nrWindows.length})`;
  } else if(btn){
    btn.remove();
  }
}

// Global wiring (once per page): Esc closes the top window; a resize keeps
// floating windows on-screen and re-fits snapped ones.
function bindNotesModal(){
  if(nrModalBound) return;
  nrModalBound = true;
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape' && nrWindows.length){
      const top = nrWindows.reduce((a,b)=>
        Number(b.el.style.zIndex||0) >= Number(a.el.style.zIndex||0) ? b : a);
      nrCloseWindow(top);
    }
  });
  window.addEventListener('resize', ()=>{
    const { w:vw, h:vh } = nrViewport();
    nrWindows.forEach(w=>{
      if(w.el.classList.contains('nr-window-max') !== nrIsMobile()){
        w.el.classList.toggle('nr-window-max', nrIsMobile());
      }
      if(nrIsMobile() || w.el.classList.contains('nr-window-snapped')) return;
      const rect = w.el.getBoundingClientRect();
      w.el.style.left = Math.max(0, Math.min(rect.left, vw - 90)) + 'px';
      w.el.style.top = Math.max(0, Math.min(rect.top, vh - 40)) + 'px';
    });
  });
}

function buildNotesFilterBar(){
  const bar = document.getElementById('notesFilterBar');
  if(!bar) return;
  bar.innerHTML = '<span class="filter-label">Show</span>' + NOTES_TYPES.map(t=>
    `<span class="filter-chip ${notesFilter===t?'on':''}" data-t="${t}">${t}</span>`).join('');
  bar.querySelectorAll('.filter-chip').forEach(chip=>chip.addEventListener('click', ()=>{
    notesFilter = chip.dataset.t;
    notesBrowsePage = 0; // start each browsed filter from its first page
    buildNotesFilterBar();
    renderNotesResults();
  }));
}

// The Notes page: a search box over the full reference index; the alignment
// tables stay visible underneath until a query is typed.
function initNotesPage(){
  buildNotes();
  NOTES_INDEX = buildNotesIndex();
  buildNotesFilterBar();
  bindNotesModal();
  const input = document.getElementById('notesSearch');
  if(input){
    input.addEventListener('input', renderNotesResults);
    input.focus();
  }
}

function renderCharacter(){
  ensureClasses();
  applyClassesToState();
  buildAlignmentSelect();
  buildSpeciesSelect();
  buildSubraceSelect();
  renderSpeciesInfo();
  buildSpeciesTraits();
  buildBackgroundSelect();
  renderBackgroundInfo();
  buildBackgroundFeature();
  buildAbilities();
  buildSaves();
  buildSkills();
  buildAttacks();
  buildInventory();
  buildEquipment();
  buildEquipAttackList();
  buildSpellSlots();
  buildSpellClassSelect();
  buildSpellLibrary();
  buildKnownSpells();
  buildClassList();
  renderClassInfoStack();
  buildSkillPicker();
  buildClassFeatures();
  buildActions();
  applyStateToInputs();
  refreshTagPickers(); // known-spell tags feed the dropdown option pool
  // Journal lives in modules/journal.js; guard in case the module didn't load.
  if(window.characterSheetApp && window.characterSheetApp.buildJournal) window.characterSheetApp.buildJournal();
  recalc();
}

async function loadCharacter(id){
  const res = await apiGetCharacter(id);
  state = Object.assign(defaultCharacter(), res.data, { id: res.id, name: res.name });
  renderCharacter();
  setSaveStatus('saved');
}

// Import a character from parsed JSON: either a raw character state object
// (the shape defaultCharacter() returns) or an API-style { name, data } wrapper
// (the shape GET /api/characters/:id returns). Saves it as a new profile and
// switches to it. Unknown fields are dropped on next save; missing ones get defaults.
async function importCharacterJson(parsed){
  if(!parsed || typeof parsed !== 'object' || Array.isArray(parsed)){
    throw new Error('Expected a JSON object describing one character.');
  }
  if(Array.isArray(parsed.entries) || ['class','species','subclass','subspecies','spell'].includes(parsed.type)){
    throw new Error('This looks like Library JSON — use the Import page for classes, species, and spells.');
  }
  const raw = (parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data)) ? parsed.data : parsed;
  const incoming = Object.assign(defaultCharacter(), raw);
  incoming.id = null;
  if(typeof parsed.name === 'string' && parsed.name.trim()) incoming.name = parsed.name.trim();
  if(typeof incoming.name !== 'string' || !incoming.name.trim()) incoming.name = 'Unnamed Adventurer';
  const res = await apiCreateCharacter(incoming.name, incoming);
  await loadCharacter(res.id);
  await refreshProfileList(res.id);
}

function bindProfileBar(){
  document.getElementById('profileSelect').addEventListener('change', e=>{
    if(e.target.value) loadCharacter(e.target.value);
  });

  document.getElementById('importCharBtn').addEventListener('click', ()=>{
    document.getElementById('importCharFile').click();
  });
  document.getElementById('importCharFile').addEventListener('change', async e=>{
    const file = e.target.files[0];
    e.target.value = ''; // reset so picking the same file again re-fires change
    if(!file) return;
    try{
      const parsed = JSON.parse(await file.text());
      await importCharacterJson(parsed);
    }catch(err){
      alert('Import failed: ' + err.message);
    }
  });

  document.getElementById('newCharBtn').addEventListener('click', async ()=>{
    state = defaultCharacter();
    const res = await apiCreateCharacter(state.name, state);
    state.id = res.id;
    renderCharacter();
    await refreshProfileList(state.id);
    setSaveStatus('saved');
  });

  document.getElementById('dupCharBtn').addEventListener('click', async ()=>{
    if(!state.id){ alert('Save the current character before duplicating it.'); return; }
    const res = await apiDuplicateCharacter(state.id);
    await loadCharacter(res.id);
    await refreshProfileList(res.id);
  });

  document.getElementById('delCharBtn').addEventListener('click', async ()=>{
    if(!state.id){ state = defaultCharacter(); renderCharacter(); return; }
    if(!confirm(`Delete "${state.name}"? This can't be undone.`)) return;
    await apiDeleteCharacter(state.id);
    const list = await apiListCharacters();
    if(list.length>0){
      await loadCharacter(list[0].id);
    } else {
      state = defaultCharacter();
      renderCharacter();
    }
    await refreshProfileList(state.id);
  });
}

const app = {
  get state(){ return state; },
  set state(value){ state = value; },
  save,
  refreshEffects,
  newEquipItem,
  buildActions,
  buildActionResources,
  buildKnownSpells,
  buildAttacks,
  buildSaves,
  buildSkills,
  buildAbilities,
  buildInventory,
  buildEquipment,
  buildSpellSlots,
  buildSpellLibrary,
  buildSpellClassSelect,
  addCustomSpellFromForm,
  buildClassFilterBar,
  buildClassList,
  renderClassInfoStack,
  buildSkillPicker,
  buildClassFeatures,
  buildSpeciesSelect,
  buildSubraceSelect,
  renderSpeciesInfo,
  buildSpeciesTraits,
  buildClassFromForm,
  buildSpeciesFromForm,
  buildSubclassFromForm,
  buildSubspeciesFromForm,
  buildSpellFromForm,
  renderImportedList,
  renderSpeciesImportedList,
  renderSubclassImportedList,
  renderSubspeciesImportedList,
  renderSpellImportedList,
  buildSubclassParentSelect,
  buildSubspeciesParentSelect,
  bindClassImport,
  bindSpeciesImport,
  bindSubclassImport,
  bindSubspeciesImport,
  bindSpellImport,
  bindBulkImport,
  submitBulkImport,
  exportLibraryJson,
  bindSubImportToggles,
  setSubImportOpen,
  fillClassForm,
  fillSpeciesForm,
  fillSubclassForm,
  fillSubspeciesForm,
  fillSpellForm,
  buildLibraryEditSelects,
  bindLibraryEditSelects,
  buildAlignmentSelect,
  buildNotes,
  renderCharacter,
  recalc,
  applyStateToInputs,
  bindTabs,
  buildEquipAttackList,
  bindStaticInputs,
  bindProfileBar,
  refreshProfileList
};
window.characterSheetApp = app;

// A subclass / subspecies import form is tucked behind a toggle on its tab.
// Show or hide it and keep the toggle button's label + aria state in sync.
function setSubImportOpen(btnId, wrapId, open){
  const btn = document.getElementById(btnId);
  const wrap = document.getElementById(wrapId);
  if(!btn || !wrap) return;
  wrap.hidden = !open;
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  btn.textContent = open ? btn.dataset.hide : btn.dataset.show;
}

function bindSubImportToggles(){
  [['toggleSubclass','subclassWrap'], ['toggleSubspecies','subspeciesWrap']].forEach(([btnId, wrapId])=>{
    const btn = document.getElementById(btnId);
    const wrap = document.getElementById(wrapId);
    if(!btn || !wrap) return;
    btn.addEventListener('click', ()=> setSubImportOpen(btnId, wrapId, wrap.hidden));
  });
}

// Deep link from the Library search: /import?edit=<type>:<key> loads the entry
// into the matching import form and scrolls its panel into view.
function openLibraryEditParam(){
  const param = new URLSearchParams(location.search).get('edit');
  if(!param) return;
  const i = param.indexOf(':');
  if(i<1) return;
  const type = param.slice(0, i), key = param.slice(i+1);
  const map = {
    class:    { fill: ()=>fillClassForm(key),   sel:'impEdit', anchor:'impName' },
    species:  { fill: ()=>fillSpeciesForm(key), sel:'spEdit',  anchor:'spName' },
    subclass: { fill: ()=>{
        const j = key.indexOf('::');
        if(j>0) fillSubclassForm(key.slice(0, j), key.slice(j+2));
      }, sel:'subEdit', anchor:'subName' },
    subspecies: { fill: ()=>{
        const j = key.indexOf('::');
        if(j>0) fillSubspeciesForm(key.slice(0, j), key.slice(j+2));
      }, sel:'subspEdit', anchor:'subspName' },
    spell:    { fill: ()=>fillSpellForm(key),   sel:'splEdit', anchor:'splName' }
  };
  const m = map[type];
  if(!m) return;
  m.fill();
  const sel = document.getElementById(m.sel);
  if(sel && [...sel.options].some(o=>o.value===key)) sel.value = key;
  // Subclass / subspecies forms sit behind a toggle — reveal it so the deep link lands.
  if(type==='subclass') setSubImportOpen('toggleSubclass', 'subclassWrap', true);
  if(type==='subspecies') setSubImportOpen('toggleSubspecies', 'subspeciesWrap', true);
  const anchor = document.getElementById(m.anchor);
  const panel = anchor && anchor.closest('.panel');
  // Deep links land on an open form — toggle via the header so aria-expanded stays in sync.
  if(panel && panel.classList.contains('collapsed')) panel.querySelector(':scope > h2').click();
  // The target form lives inside a tab pane — switch to that tab before scrolling.
  const pane = anchor && anchor.closest('.tab-pane');
  if(pane){
    const btn = document.querySelector(`.tab-btn[data-tab="${pane.id.replace(/^tab-/, '')}"]`);
    if(btn) btn.click();
  }
  // Deferred: a smooth scroll started during initial page layout gets cancelled
  // by the browser's own load-time scroll handling.
  if(panel) setTimeout(()=> panel.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
}

// Import-page panels marked .collapsible fold down to their header (a caret on
// the rune shows state). Panels with .collapsed in the markup start folded, so
// each tab opens as a clean stack of headers. Not persisted across reloads.
function bindCollapsiblePanels(){
  document.querySelectorAll('.panel.collapsible > h2').forEach(h2=>{
    const panel = h2.parentElement;
    h2.setAttribute('role','button');
    h2.setAttribute('tabindex','0');
    const sync = ()=> h2.setAttribute('aria-expanded', String(!panel.classList.contains('collapsed')));
    const toggle = ()=>{ panel.classList.toggle('collapsed'); sync(); };
    h2.addEventListener('click', toggle);
    h2.addEventListener('keydown', e=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggle(); }
    });
    sync();
  });
}

// The Import page: import forms, imported lists, and load-existing pickers.
// Registries are already loaded when this runs; no character is loaded here.
function initImportPage(){
  bindCollapsiblePanels();
  bindClassImport();
  renderImportedList();
  bindSpeciesImport();
  renderSpeciesImportedList();
  bindBackgroundImport();
  renderBackgroundImportedList();
  bindSubclassImport();
  renderSubclassImportedList();
  bindSubspeciesImport();
  renderSubspeciesImportedList();
  bindSpellImport();
  renderSpellImportedList();
  bindBulkImport();
  bindTabs(); // Import panels are split across tabs (Classes / Species / Spells / Bulk / Reference)
  bindSubImportToggles(); // Subclass / Subspecies forms are revealed by a toggle on their tab
  buildLibraryEditSelects();
  bindLibraryEditSelects();
  buildSpellLevelSelects();
  setTagPicker('splTagPicker', []);
  openLibraryEditParam(); // honor ?edit= deep links from the Library search
}

// The character sheet (index): loads a character and wires every tab.
async function initSheetPage(){
  const list = await apiListCharacters();
  if(list.length>0){
    await loadCharacter(list[0].id);
  } else {
    const res = await apiCreateCharacter(state.name, state);
    state.id = res.id;
    renderCharacter();
  }
  await refreshProfileList(state.id);
  bindStaticInputs();
  bindProfileBar();
  bindTabs();
  bindSkillLegendButtons(); // "?" legend popups on the Skills tab & Settings skill picker
  bindCornerLauncher(); // "⋯" quick-tools stack (Dice / Notes / Skills)
  bindPassiveSenseRows(); // Passive Senses rows open a quick-reference popup
  bindNotesModal(); // shared spell-detail popup, used by the Spells & Actions tabs
  buildClassFilterBar();
  buildSpellLevelSelects();
  setTagPicker('customSpellTagPicker', []);
  setSaveStatus('saved');
}

async function init(){
  initTheme(); // apply the saved theme before any awaits so the page doesn't flash dark
  bindOptionsMenu();
  bindSidebar();
  await loadCustomClasses(); // merge imported classes before any character renders
  await loadCustomSpecies(); // merge imported species too
  await loadCustomBackgrounds(); // ...and imported backgrounds
  await loadCustomSubclasses(); // ...and imported subclasses (attach to parent classes)
  await loadCustomSubspecies(); // ...and imported subspecies (attach to parent species)
  await loadCustomSpells();  // ...and imported spells (merge into the Spell Library)
  if(PAGE==='import'){ initImportPage(); return; }
  if(PAGE==='library'){ initNotesPage(); return; } // the Library page's search needs the registries loaded
  await initSheetPage();
}

init();
