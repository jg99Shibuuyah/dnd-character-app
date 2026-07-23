// Built-in monsters for the DM Screen library. Classic-script global (loaded
// via a <script> tag in client/index.html, like companions.js) and bridged to
// ESM by src/rules/builtin-data.js. Each entry is { name, source, data } so
// built-in and DB-imported (custom) monsters merge uniformly.
//
// Content is Open Game Content from the SRD 5.1 (CC-BY-4.0 / OGL) — NOT copied
// from paywalled sources.
const MONSTER_DATA = [
  {
    name: 'Adult Copper Dragon',
    source: '5E',
    data: {
      size: 'Gargantuan', type: 'Dragon', alignment: 'Chaotic Good',
      ac: 18, acNote: 'natural armor', hpMax: 184, hpFormula: '16d12 + 80',
      speed: '40 ft., climb 40 ft., fly 80 ft.',
      abilities: { str: 23, dex: 12, con: 21, int: 18, wis: 15, cha: 17 },
      saves: 'Dex +6, Con +10, Wis +7, Cha +8',
      skills: 'Deception +8, Perception +12, Stealth +6',
      resistances: '', immunities: 'Acid', vulnerabilities: '', conditionImmunities: '',
      senses: 'Blindsight 60 ft., Darkvision 120 ft., Passive Perception 22',
      languages: 'Common, Draconic',
      cr: '14', pb: '+5', xp: '11,500',
      legendaryCount: 3,
      legendaryNote: "The dragon can take 3 legendary actions, choosing from the options below. Only one legendary action can be used at a time and only at the end of another creature's turn. The dragon regains spent legendary actions at the start of its turn.",
      traits: [
        { name: 'Legendary Resistance (3/Day)', desc: 'If the dragon fails a saving throw, it can choose to succeed instead.' }
      ],
      actions: [
        { name: 'Multiattack', desc: 'The dragon can use its Frightful Presence. It then makes three attacks: one with its bite and two with its claws.' },
        { name: 'Bite', desc: 'Melee Weapon Attack: +11 to hit, reach 10 ft., one target. Hit: 17 (2d10 + 6) piercing damage.' },
        { name: 'Claw', desc: 'Melee Weapon Attack: +11 to hit, reach 5 ft., one target. Hit: 13 (2d6 + 6) slashing damage.' },
        { name: 'Tail', desc: 'Melee Weapon Attack: +11 to hit, reach 15 ft., one target. Hit: 15 (2d8 + 6) bludgeoning damage.' },
        { name: 'Frightful Presence', desc: "Each creature of the dragon's choice within 120 ft. and aware of it must succeed on a DC 16 Wisdom saving throw or become frightened for 1 minute." },
        { name: 'Breath Weapons (Recharge 5-6)', desc: 'The dragon uses one of the following breath weapons. Acid Breath: exhales acid in a 60-ft. line that is 5 ft. wide. Each creature in that line makes a DC 18 Dexterity save, taking 54 (12d8) acid damage on a failure, or half on a success. Slowing Breath: exhales gas in a 60-ft. cone. Each creature there makes a DC 18 Constitution save; on a failure it is slowed until the end of the dragon\'s next turn.' }
      ],
      reactions: [],
      legendary: [
        { name: 'Detect', desc: 'The dragon makes a Wisdom (Perception) check.' },
        { name: 'Tail Attack', desc: 'The dragon makes a tail attack.' },
        { name: 'Wing Attack (Costs 2 Actions)', desc: "The dragon beats its wings. Each creature within 15 ft. must succeed on a DC 19 Dexterity save or take 13 (2d6 + 6) bludgeoning damage and be knocked prone. The dragon can then fly up to half its flying speed." }
      ],
      items: [],
      lore: 'Copper dragons are incorrigible pranksters and lovers of wit, hoarding gems and precious metals in twisting cavern lairs.'
    }
  }
];
