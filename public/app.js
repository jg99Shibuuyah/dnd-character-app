
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

// Expands compact progression rows [level, ...feature names] into feature objects.
function P(rows){ return rows.flatMap(([lv,...names])=>names.map(n=>({lv, name:n}))); }

// Class registry: saving-throw proficiencies are applied automatically when a
// class is picked in Settings. `features` feeds the class card in Settings,
// the Class Features panel, and (for entries with `use` tags) the Actions tab.
// `casting` describes spell access; `subclassLevel` is when the subclass is chosen.
const CLASS_DATA = {
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
  Elf:{ source:'5E', size:'Medium', speed:30, darkvision:60, asi:'+2 DEX', languages:'Common, Elvish', desc:'Graceful, long-lived folk with a keen mind and an affinity for magic.', subraces:['High Elf','Wood Elf','Drow (Dark Elf)'],
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
  'Elf (Eldritch Hunt)':{ source:'Homebrew', size:'Medium', speed:30, darkvision:60, asi:'+2 DEX (not CON w/ optional rule)', languages:'Common, Elvish', desc:'Luyarnha\'s founding elves — wood elves whose skins turned stone-gray and obsidian with urbanization, first acolytes of the Radiant One, driven above all to stave off their race\'s extinction. Uses the standard 5E elf mechanics.',
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

// ---------- Subclasses ----------
// Detailed, imported subclasses keyed by "Parent::Name". Built-in classes list
// their subclass *names* in CLASS_DATA[cls].subclasses; imported entries here
// add source, description, and level-gated features. `subclassNamesForClass`
// merges the two so pickers and cards see every option for a parent class.
const SUBCLASS_DATA = {};
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

// Action/reaction metadata for the SRD classes (whose features are stored
// name-only). Attaching this lets the Actions tab and Features tab surface the
// same use/cost/desc detail the homebrew Jaeger already carries. Keyed by the
// feature's base name (parentheticals stripped).
const FEATURE_META = {
  'Rage':{use:'bonus action', cost:'uses/rest', desc:'Advantage on STR checks & saves, bonus melee damage, and resistance to bludgeoning/piercing/slashing.'},
  'Second Wind':{use:'bonus action', cost:'1/rest', desc:'Regain 1d10 + fighter level hit points.'},
  'Action Surge':{use:'special', cost:'1/rest', desc:'Take one additional action on your turn.'},
  'Reckless Attack':{use:'special', desc:'Attack with advantage on STR melee attacks this turn; attacks against you have advantage until your next turn.'},
  'Bardic Inspiration':{use:'bonus action', cost:'CHA mod/rest', desc:'Give a creature a Bardic Inspiration die to add to one check, attack, or save.'},
  'Channel Divinity':{use:'action', cost:'uses/rest', desc:'Invoke a divine effect (Turn Undead plus a domain option).'},
  'Wild Shape':{use:'action', cost:'2/rest', desc:'Transform into a beast you have seen.'},
  'Cunning Action':{use:'bonus action', desc:'Dash, Disengage, or Hide as a bonus action.'},
  'Sneak Attack':{use:'special', cost:'1/turn', desc:'Extra damage once per turn when you have advantage or an ally is adjacent to the target.'},
  'Lay on Hands':{use:'action', desc:'Spend from a pool of healing equal to 5 × paladin level to restore HP or cure disease/poison.'},
  'Divine Sense':{use:'action', cost:'1+CHA/long rest', desc:'Detect celestials, fiends, and undead within 60 ft until your next turn.'},
  'Divine Smite':{use:'special', desc:'On a melee hit, expend a spell slot to deal 2d8 radiant (+1d8 per slot level above 1st).'},
  'Metamagic':{use:'special', desc:'Spend sorcery points to alter a spell (Twin, Quicken, Careful, etc.).'},
  'Font of Magic':{use:'bonus action', desc:'Convert sorcery points to spell slots (or slots to points).'},
  'Mystic Arcanum':{use:'special', cost:'1/long rest', desc:'Cast one high-level warlock spell without a slot.'},
  'Ki':{use:'special', desc:'Spend Ki on Flurry of Blows, Patient Defense, or Step of the Wind (bonus action).'},
  'Deflect Missiles':{use:'reaction', desc:'Reduce ranged weapon damage by 1d10 + DEX + monk level; may throw it back.'},
  'Stunning Strike':{use:'special', cost:'1 ki', desc:'On a melee hit, force a CON save or stun the target until your next turn.'},
  'Arcane Recovery':{use:'special', cost:'1/day', desc:'On a short rest, recover spell slots totaling up to half your wizard level.'},
  "Hunter's Pursuit":{use:'special', cost:'1 FP'}
};
Object.values(CLASS_DATA).forEach(cd=>{
  (cd.features||[]).forEach(f=>{
    const base = f.name.replace(/\s*\(.*\)\s*$/,'').trim();
    const meta = FEATURE_META[f.name] || FEATURE_META[base];
    if(meta){
      if(meta.use && !f.use) f.use = meta.use;
      if(meta.cost && !f.cost) f.cost = meta.cost;
      if(meta.desc && !f.desc) f.desc = meta.desc;
    }
  });
});

// Snapshots of the built-in registries, taken after source tagging and
// FEATURE_META enrichment. When a custom import overrides a built-in entry
// (same name) and is later deleted, the original is restored from here.
const BUILTIN_CLASSES = JSON.parse(JSON.stringify(CLASS_DATA));
const BUILTIN_SPECIES = JSON.parse(JSON.stringify(SPECIES_DATA));
const BUILTIN_SUBSPECIES = JSON.parse(JSON.stringify(SUBSPECIES_DATA));

// Imported spells (global, DB-backed), keyed by name. A custom spell with the
// same name as a built-in SPELL_DATA entry shadows it in the Spell Library.
let CUSTOM_SPELLS = {};

// PHB multiclassing prerequisites: an array of alternatives, each an ability-minimum set.
// (Jaeger has no published prereq — DEX or INT 13 mirrors its primary abilities.)
const MC_REQS = {
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
    journal: [] // character journal entries: {id, title, text, created, updated}
  };
}

let state = defaultCharacter();

// Which page this script is running on: 'sheet' (index), 'library', or 'notes'.
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
    const row = el('div','check-row');
    row.innerHTML = `
      <span class="prof-dot ${state.skillProf[key]?'on':''}"></span>
      <span class="abbr-tag">${s.ability.toUpperCase()}</span>
      <span class="name">${s.name}</span>
      <span class="bonus" id="skillBonus_${key}">+0</span>
    `;
    panel.appendChild(row);
  });
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
    const c=leveled[0]; lvl=c.level||1;
    table = CLASS_DATA[c.name].casting.type==='full' ? FULL_SLOTS : HALF_SLOTS;
  } else if(leveled.length>1){
    // Multiclass: full levels + half of half-caster levels, read off the full table.
    lvl = leveled.reduce((s,c)=> s + (CLASS_DATA[c.name].casting.type==='full' ? (c.level||1) : Math.floor((c.level||1)/2)), 0);
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
const FULL_CASTERS = ['Bard','Cleric','Druid','Sorcerer','Wizard'];
const HALF_CASTERS = ['Paladin','Ranger'];
function multiclassCasterLevel(picked){
  return picked.reduce((s,c)=>{
    if(FULL_CASTERS.includes(c.name)) return s + (c.level||1);
    if(HALF_CASTERS.includes(c.name)) return s + Math.floor((c.level||1)/2);
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
  if(primary && primary.skills!=='any'){
    hint.innerHTML = `<span class="hl">${picked[0].name}</span> (primary) grants <span class="hl">${primary.choose}</span> picks from the dashed chips.${picked.length>1?' Multiclass dips grant fewer skills (PHB) — ':' '}Any chip can be toggled for proficiencies from backgrounds, feats, or DM fiat.`;
  } else if(primary){
    hint.innerHTML = `<span class="hl">${picked[0].name}</span> (primary) grants <span class="hl">${primary.choose}</span> picks from any skill.`;
  } else {
    hint.textContent = 'Toggle the skills this character is proficient in — bonuses on the Character tab update automatically.';
  }
  const wrap = document.getElementById('skillPicker');
  wrap.innerHTML='';
  SKILLS.forEach((s,i)=>{
    const key='sk'+i;
    if(!(key in state.skillProf)) state.skillProf[key]=false;
    const fromClass = picked.some(c=>{
      const cd = CLASS_DATA[c.name];
      return cd.skills!=='any' && cd.skills.includes(s.name);
    });
    const chip = el('div', 'skill-chip'+(state.skillProf[key]?' on':'')+(fromClass?' classpick':''));
    chip.innerHTML = `${s.name}<span class="chip-abbr">${s.ability}</span>`;
    chip.addEventListener('click', ()=>{
      state.skillProf[key] = !state.skillProf[key];
      chip.classList.toggle('on', state.skillProf[key]);
      buildSkills(); recalc(); save();
    });
    wrap.appendChild(chip);
  });
}

function featItem(f){
  return `<div class="feat-item">
    <div class="feat-head">
      <span class="f-lvl">LV ${f.lv}</span>
      <span class="f-name">${esc(f.name)}</span>
      ${f.use && f.use!=='passive' ? `<span class="action-badge">${esc(f.use)}${f.cost?' · '+esc(f.cost):''}</span>`:''}
    </div>
    ${f.desc?`<div class="feat-desc">${esc(f.desc)}</div>`:''}
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
    let html = `<div class="known-spell-group-label">${esc(entry.name)} ${entry.level}</div>`
      + (feats.length ? feats.map(featItem).join('') : '<div class="action-empty">No features at this level.</div>')
      + (upcoming>0?`<div class="action-empty">+ ${upcoming} more at higher ${esc(entry.name)} levels.</div>`:'');
    // Chosen subclass features (imported detail, gated by class level).
    if(entry.subclass){
      const sc = SUBCLASS_DATA[subKey(entry.name, entry.subclass)];
      html += `<div class="subclass-label">↳ ${esc(entry.subclass)}${sc?' '+sourceTag(sc.source):''}</div>`;
      const sfeatsAll = (sc && sc.features) || [];
      if(sfeatsAll.length){
        const sfeats = sfeatsAll.filter(f=>f.lv<=lvl);
        const sUpcoming = sfeatsAll.length - sfeats.length;
        html += (sfeats.length ? sfeats.map(featItem).join('') : '<div class="action-empty">No subclass features unlocked at this level yet.</div>')
          + (sUpcoming>0?`<div class="action-empty">+ ${sUpcoming} more at higher levels.</div>`:'');
      } else {
        html += '<div class="action-empty">No feature detail imported — add it on the Library tab.</div>';
      }
    }
    return html;
  }).join('');
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

// Freeform point trackers on the Actions tab. Each row is a named pool (a spell
// slot, a Jaeger Focus Point, Ki, etc.); clicking a pip toggles it used, and the
// −/+ buttons resize the pool. Independent of the derived lists above.
function buildActionResources(){
  const body = document.getElementById('actResources');
  if(!body) return;
  const list = state.actionResources || (state.actionResources = []);
  body.innerHTML = list.length ? list.map((r,i)=>{
    let pips='';
    for(let p=0;p<r.total;p++) pips += `<span class="res-pip ${p<r.used?'filled':''}" data-i="${i}" data-p="${p}"></span>`;
    return `<tr class="res-row">
      <td><input class="res-name" data-i="${i}" value="${esc(r.name)}" placeholder="Focus Points, 1st-level slots…"></td>
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
  }).join('') : `<tr><td colspan="2" class="res-empty">No trackers yet — add one (e.g. Jaeger Focus Points, Ki, Sorcery Points, or a spell-slot row) with the button below.</td></tr>`;

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
    });
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
    const bonus = m + (state.skillProf[key] ? pb : 0) + equipSkillBonus(s.name);
    const elBonus = document.getElementById('skillBonus_'+key);
    if(elBonus) elBonus.textContent = fmt(bonus);
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
  bind('charBackground','background'); bind('charAlignment','alignment'); // charRace handled by buildSpeciesSelect
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

function parseFeatureLines(text){
  return (text||'').split('\n').map(l=>l.trim()).filter(Boolean).map(line=>{
    const [lvRaw, name, desc, use, cost] = line.split('|').map(s=>(s||'').trim());
    const f = { lv: Math.max(1, Math.min(20, parseInt(lvRaw)||1)), name };
    if(desc) f.desc = desc;
    if(use) f.use = use;
    if(cost) f.cost = cost;
    return f;
  }).filter(f=>f.name);
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
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', async e=>{
    const id = e.target.dataset.id, name = e.target.dataset.name;
    if(!confirm(`Remove imported class "${name}"? Characters using it will lose it${BUILTIN_CLASSES[name]?' (the built-in version is restored)':''}.`)) return;
    await apiDeleteClass(id);
    restoreOrDelete(CLASS_DATA, BUILTIN_CLASSES, name);
    if(!CLASS_DATA[name]) state.classes = (state.classes||[]).filter(c=>c.name!==name);
    afterClassChange();
    renderImportedList();
    buildLibraryEditSelects();
  }));
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
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', async e=>{
    const id = e.target.dataset.id, name = e.target.dataset.name;
    if(!confirm(`Remove imported species "${name}"?${BUILTIN_SPECIES[name]?' The built-in version is restored.':''}`)) return;
    await apiDeleteSpecies(id);
    restoreOrDelete(SPECIES_DATA, BUILTIN_SPECIES, name);
    buildSpeciesSelect(); renderSpeciesInfo(); buildSpeciesTraits(); renderSpeciesImportedList();
    buildLibraryEditSelects();
  }));
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
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', async e=>{
    const id = e.target.dataset.id, parent = e.target.dataset.parent, name = e.target.dataset.name;
    if(!confirm(`Remove imported subclass "${name}" (${parent})?`)) return;
    await apiDeleteSubclass(id);
    delete SUBCLASS_DATA[subKey(parent, name)];
    // Clear it from any character rows that had it selected.
    (state.classes||[]).forEach(c=>{ if(c.name===parent && c.subclass===name) c.subclass=''; });
    buildClassList(); renderClassInfoStack(); buildClassFeatures(); buildActions(); renderSubclassImportedList(); buildLibraryEditSelects(); save();
  }));
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
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', async e=>{
    const id = e.target.dataset.id, parent = e.target.dataset.parent, name = e.target.dataset.name;
    if(!confirm(`Remove imported subspecies "${name}" (${parent})?${BUILTIN_SUBSPECIES[subspKey(parent,name)]?' The built-in version is restored.':''}`)) return;
    await apiDeleteSubspecies(id);
    restoreOrDelete(SUBSPECIES_DATA, BUILTIN_SUBSPECIES, subspKey(parent, name));
    // Clear it from the character if it was the selected subrace.
    if(state.race===parent && state.subrace===name) state.subrace='';
    buildSubraceSelect(); renderSpeciesInfo(); buildSpeciesTraits(); renderSubspeciesImportedList(); buildLibraryEditSelects(); save();
  }));
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
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', async e=>{
    const id = e.target.dataset.id, name = e.target.dataset.name;
    if(!confirm(`Remove imported spell "${name}"?`)) return;
    await apiDeleteSpell(id);
    delete CUSTOM_SPELLS[name];
    buildSpellClassSelect(); buildSpellLibrary(); renderSpellImportedList(); buildLibraryEditSelects(); refreshTagPickers();
  }));
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
    const parts = [f.lv, f.name, f.desc||'', f.use||'', f.cost||''].map(p=>String(p==null?'':p));
    while(parts.length>2 && !parts[parts.length-1]) parts.pop();
    return parts.join(' | ');
  }).join('\n');
}
function traitsToLines(traits){
  return (traits||[]).map(t=> t.desc ? `${t.name} | ${t.desc}` : t.name).join('\n');
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
  setImportMsg('spMsg', name);
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
  wire('subEdit', key=>{
    const i = key.indexOf('::');
    if(i>0) fillSubclassForm(key.slice(0,i), key.slice(i+2));
  });
  wire('subspEdit', key=>{
    const i = key.indexOf('::');
    if(i>0) fillSubspeciesForm(key.slice(0,i), key.slice(i+2));
  });
  wire('splEdit', fillSpellForm);
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
  if(!grid || grid.dataset.built) return;
  grid.innerHTML = ALIGNMENTS.map(a=>`
    <div class="align-card">
      <div><span class="a-abbr">${a.abbr}</span><span class="a-name">${a.name}</span></div>
      <div class="a-desc">${a.desc}</div>
      <div class="a-eg"><b>e.g.</b> ${a.eg}</div>
    </div>`).join('');
  grid.dataset.built = '1';
}

// ---------- Notes page: reference search ----------
// A flat index over everything the app knows — built-in and imported classes,
// their features, subclasses, species & traits, spells, standard actions, and
// alignments — so the Notes page can look any of it up by name or text.
let NOTES_INDEX = [];
let notesFilter = 'All';
const NOTES_TYPES = ['All','Classes','Subclasses','Species','Spells','Features','Actions','Alignments'];

function notesEntry(type, name, badges, haystack, detail, edit){
  return { type, name, badges: badges.filter(Boolean).map(String),
    text: (name + ' ' + haystack).toLowerCase(), detail, edit };
}

// Deep link into the Library page's import forms: /library?edit=<type>:<key>.
// The Library page loads the entry into the matching form (see openLibraryEditParam).
function editLink(type, key, label){
  return { href: '/library?edit=' + type + ':' + encodeURIComponent(key), label };
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

function featureEntry(f, ownerName, extraHay, edit){
  return notesEntry('Features', f.name, [ownerName, 'level '+f.lv],
    [f.desc, f.use, f.cost, ownerName, extraHay].filter(Boolean).join(' '),
    `<div class="nr-meta">${esc(ownerName)} · level ${f.lv}${f.use?' · '+esc(f.use):''}${f.cost?' · '+esc(f.cost):''}</div>
     ${f.desc?`<div class="feat-desc">${esc(f.desc)}</div>`:''}`, edit);
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
      [cd.desc, skills, subNames.join(' '), castingLabel(cd.casting)].filter(Boolean).join(' '),
      meta
      + `${subNames.length?`<div class="nr-meta">subclasses: ${esc(subNames.join(', '))}</div>`:''}
       ${cd.desc?`<div class="feat-desc">${esc(cd.desc)}</div>`:''}`,
      editLink('class', name, 'Edit class in Library')),
      { full: meta
        + `${cd.desc?`<div class="feat-desc">${esc(cd.desc)}</div>`:''}`
        + (subNames.length?`<div class="nr-sect">Subclasses — click to view</div><div class="nr-sub-list">${
            subNames.map(n=>`<span class="nr-sub-link" data-key="${esc(subKey(name, n))}">${esc(n)}</span>`).join('')}</div>`:'')
        + ((cd.features||[]).length?`<div class="nr-sect">Features</div>`+classFeaturesHtml(cd.features):'') }));
    (cd.features||[]).forEach(f=> ix.push(featureEntry(f, name, null,
      editLink('class', name, 'Edit '+name+' in Library'))));
  });

  // Subclasses: imported records carry detail; built-in ones are name-only lists.
  const seenSubs = new Set();
  Object.values(SUBCLASS_DATA).forEach(sc=>{
    seenSubs.add(subKey(sc.parent, sc.name));
    const summary = `<div class="nr-meta">${esc(sc.parent)} subclass · chosen at level ${sc.subclassLevel||3}</div>
       ${sc.desc?`<div class="feat-desc">${esc(sc.desc)}</div>`:''}`;
    ix.push(Object.assign(notesEntry('Subclasses', sc.name, [sc.parent, sc.source||'Homebrew', 'imported'],
      [sc.desc, sc.parent, (sc.features||[]).map(f=>f.name+' '+(f.desc||'')).join(' ')].filter(Boolean).join(' '),
      summary,
      editLink('subclass', subKey(sc.parent, sc.name), 'Edit subclass in Library')),
      { key: subKey(sc.parent, sc.name),
        full: summary + ((sc.features||[]).length?`<div class="nr-sect">Features</div>`+classFeaturesHtml(sc.features):'') }));
    (sc.features||[]).forEach(f=> ix.push(featureEntry(f, sc.name, sc.parent,
      editLink('subclass', subKey(sc.parent, sc.name), 'Edit '+sc.name+' in Library'))));
  });
  Object.entries(CLASS_DATA).forEach(([parent, cd])=>{
    (cd.subclasses||[]).forEach(n=>{
      if(seenSubs.has(subKey(parent, n))) return;
      ix.push(Object.assign(notesEntry('Subclasses', n, [parent, 'built-in'], parent,
        `<div class="nr-meta">${esc(parent)} subclass · chosen at level ${cd.subclassLevel||3}</div>`,
        editLink('subclass', subKey(parent, n), 'Edit subclass in Library')),
        { key: subKey(parent, n),
          full: `<div class="nr-meta">${esc(parent)} subclass · chosen at level ${cd.subclassLevel||3}</div>
                 <div class="feat-desc">Name-only entry — import it in the Library to add a description and features.</div>` }));
    });
  });

  // Species with their traits inline.
  Object.entries(SPECIES_DATA).forEach(([name, sd])=>{
    const traits = sd.traits||[];
    ix.push(notesEntry('Species', name, [sd.source, sd.custom?'imported':'built-in'],
      [sd.desc, sd.asi, sd.languages, traits.map(t=>t.name+' '+(t.desc||'')).join(' ')].filter(Boolean).join(' '),
      `<div class="nr-meta">${esc(sd.size||'Medium')} · ${sd.speed||30} ft${sd.darkvision?' · darkvision '+sd.darkvision+' ft':''}${sd.asi?' · '+esc(sd.asi):''}</div>
       ${sd.languages?`<div class="nr-meta">languages: ${esc(sd.languages)}</div>`:''}
       ${sd.desc?`<div class="feat-desc">${esc(sd.desc)}</div>`:''}
       ${traits.map(t=>`<div class="feat-desc"><b>${esc(t.name)}</b>${t.desc?' — '+esc(t.desc):''}</div>`).join('')}`,
      editLink('species', name, 'Edit species in Library')));
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

  // Standard combat actions and alignments.
  STANDARD_ACTIONS.forEach(a=> ix.push(notesEntry('Actions', a.name, ['combat action'], a.desc,
    `<div class="feat-desc">${esc(a.desc)}</div>`)));
  ALIGNMENTS.forEach(a=> ix.push(notesEntry('Alignments', a.name, [a.abbr], a.desc+' '+a.eg,
    `<div class="feat-desc">${esc(a.desc)}</div><div class="nr-meta">e.g. ${esc(a.eg)}</div>`)));

  return ix;
}

function renderNotesResults(){
  const box = document.getElementById('notesResults');
  const ref = document.getElementById('notesReference');
  if(!box) return;
  const q = (document.getElementById('notesSearch').value||'').trim().toLowerCase();
  if(!q){
    box.innerHTML = '';
    if(ref) ref.style.display = '';
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

// ---------- Notes detail popup ----------
// Shows an entry's full information; classes list their subclasses as chips
// that open the subclass's own popup. The edit action lives only here.
let notesHits = []; // entries behind the currently rendered result rows

function openNotesModal(entry){
  const backdrop = document.getElementById('nrModalBackdrop');
  if(!backdrop || !entry) return;
  document.getElementById('nrModalTitle').textContent = entry.name;
  document.getElementById('nrModalBadges').innerHTML =
    entry.badges.map(b=>`<span class="nr-badge">${esc(b)}</span>`).join('');
  const body = document.getElementById('nrModalBody');
  body.innerHTML = entry.full || entry.detail;
  document.getElementById('nrModalFoot').innerHTML = entry.edit
    ? `<a class="pbtn nr-edit-link" href="${entry.edit.href}">✎ ${esc(entry.edit.label)}</a>
       <span class="nr-hint">opens the Library form with this entry loaded — re-import to save changes</span>`
    : '<span class="nr-hint">Built-in rule — not editable.</span>';
  // Subclass chips open that subclass's own popup in place of this one.
  body.querySelectorAll('.nr-sub-link').forEach(chip=>chip.addEventListener('click', ()=>{
    const target = NOTES_INDEX.find(e=>e.key===chip.dataset.key);
    if(target) openNotesModal(target);
  }));
  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden','false');
  const modal = backdrop.querySelector('.nr-modal');
  if(modal) modal.scrollTop = 0;
}

function closeNotesModal(){
  const backdrop = document.getElementById('nrModalBackdrop');
  if(!backdrop) return;
  backdrop.classList.remove('open');
  backdrop.setAttribute('aria-hidden','true');
}

function bindNotesModal(){
  const backdrop = document.getElementById('nrModalBackdrop');
  if(!backdrop) return;
  document.getElementById('nrModalClose').addEventListener('click', closeNotesModal);
  backdrop.addEventListener('click', e=>{ if(e.target===backdrop) closeNotesModal(); });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeNotesModal(); });
}

function buildNotesFilterBar(){
  const bar = document.getElementById('notesFilterBar');
  if(!bar) return;
  bar.innerHTML = '<span class="filter-label">Show</span>' + NOTES_TYPES.map(t=>
    `<span class="filter-chip ${notesFilter===t?'on':''}" data-t="${t}">${t}</span>`).join('');
  bar.querySelectorAll('.filter-chip').forEach(chip=>chip.addEventListener('click', ()=>{
    notesFilter = chip.dataset.t;
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

function bindProfileBar(){
  document.getElementById('profileSelect').addEventListener('change', e=>{
    if(e.target.value) loadCharacter(e.target.value);
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

// Deep link from the Notes search: /library?edit=<type>:<key> loads the entry
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
  const anchor = document.getElementById(m.anchor);
  const panel = anchor && anchor.closest('.panel');
  // Deferred: a smooth scroll started during initial page layout gets cancelled
  // by the browser's own load-time scroll handling.
  if(panel) setTimeout(()=> panel.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
}

// The Library page: import forms, imported lists, and load-existing pickers.
// Registries are already loaded when this runs; no character is loaded here.
function initLibraryPage(){
  bindClassImport();
  renderImportedList();
  bindSpeciesImport();
  renderSpeciesImportedList();
  bindSubclassImport();
  renderSubclassImportedList();
  bindSubspeciesImport();
  renderSubspeciesImportedList();
  bindSpellImport();
  renderSpellImportedList();
  buildLibraryEditSelects();
  bindLibraryEditSelects();
  buildSpellLevelSelects();
  setTagPicker('splTagPicker', []);
  openLibraryEditParam(); // honor ?edit= deep links from the Notes search
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
  await loadCustomSubclasses(); // ...and imported subclasses (attach to parent classes)
  await loadCustomSubspecies(); // ...and imported subspecies (attach to parent species)
  await loadCustomSpells();  // ...and imported spells (merge into the Spell Library)
  if(PAGE==='library'){ initLibraryPage(); return; }
  if(PAGE==='notes'){ initNotesPage(); return; } // search needs the registries loaded
  await initSheetPage();
}

init();
