// Companion templates: features and spells that grant a creature which scales
// with the character (a "mini character sheet"). Loaded as a classic script
// after the /resources/builtin/ scripts and before app.js — COMPANION_TEMPLATES
// is a global there.
//
// Each template:
//   id       stable key stored on the character (state.companions[].templateId)
//   name     default companion name
//   kind     'feature' | 'spell'
//   source   where it comes from, shown on the card ("Battle Smith (Artificer 3)")
//   match(ctx)  true when the current character qualifies (auto-detect list)
//   build(ctx)  full computed stat block for the current character
//
// ctx (built in app.js: companionCtx()) provides:
//   pb, level, abilities (gear-adjusted), amod(key), fmt(n),
//   classLevel(cls), subclassLevel(cls, subclass), castMod(cls), spellAtk(cls),
//   knowsSpell(name), bestSlotLevel(min)
//
// Stat-block numbers follow the printed sources (TCE / FTD / EGtW / 2024 books,
// via dnd5e.wikidot.com & dnd2024.wikidot.com). Entries flagged "verify" in
// docs/companion-sources.md were written from rules memory — review before play.

const COMPANION_TEMPLATES = [

  // ---------- Class & subclass features ----------

  {
    id:'steel-defender', name:'Steel Defender', kind:'feature',
    source:'Battle Smith (Artificer 3)',
    match: c => c.subclassLevel('Artificer','Battle Smith') >= 3,
    build(c){
      const lvl = Math.max(1, c.classLevel('Artificer'));
      const improved = lvl >= 15; // Improved Defender: +2 AC, Deflect Attack damage
      return {
        typeLine:'Medium construct (Steel Defender)',
        ac: 15 + (improved?2:0), acNote:'natural armor' + (improved?' + Improved Defender':''),
        hpMax: 2 + c.amod('int') + 5*lvl, hpFormula:'2 + INT mod + 5 × Artificer level',
        speed:'40 ft.',
        abilities:{str:14,dex:12,con:14,int:4,wis:10,cha:6},
        saves:[`DEX ${c.fmt(1+c.pb)}`, `CON ${c.fmt(2+c.pb)}`],
        skills:[`Athletics ${c.fmt(2+c.pb)}`, `Perception ${c.fmt(c.pb*2)}`],
        senses:[`darkvision 60 ft.`, `passive Perception ${10+c.pb*2}`],
        immunities:['poison (damage)','charmed','exhaustion','poisoned'],
        features:[
          {name:'Vigilant', desc:'The defender can\'t be surprised.'},
          {name:'Bound Protector', desc:'Shares your initiative, acts right after you; takes the Dodge action unless you use a bonus action to command it.'}
        ],
        actions:[
          {name:'Force-Empowered Rend', desc:`Melee weapon attack: ${c.fmt(c.spellAtk('Artificer'))} to hit, reach 5 ft. Hit: 1d8 ${c.fmt(c.pb)} force damage.`},
          {name:'Repair (3/Day)', desc:`Restores 2d8 ${c.fmt(c.pb)} HP to itself or one construct/object within 5 ft.`}
        ],
        resources:[{name:'Repair', total:3}],
        reactions:[
          {name:'Deflect Attack', desc:'Imposes disadvantage on an attack roll against a creature other than itself within 5 ft.' + (improved?` Attacker takes 1d4 ${c.fmt(c.amod('int'))} force damage.`:'')}
        ],
        note: lvl>=9 ? `Arcane Jolt: once per turn when the defender hits, deal ${lvl>=15?'4d6':'2d6'} extra force damage or heal a creature within 30 ft. of the target for the same amount (INT mod/day).` : ''
      };
    }
  },

  {
    id:'primal-beast-land', name:'Beast of the Land', kind:'feature',
    source:'Beast Master Ranger 3 — Primal Companion (TCE)',
    match: c => c.subclassLevel('Ranger','Beast Master') >= 3,
    build(c){
      const lvl = Math.max(1, c.classLevel('Ranger'));
      return {
        typeLine:'Medium beast (Primal Companion)',
        ac: 13 + c.pb, acNote:'natural armor',
        hpMax: 5 + 5*lvl, hpFormula:'5 + 5 × Ranger level',
        speed:'40 ft., climb 40 ft.',
        abilities:{str:14,dex:14,con:15,int:8,wis:14,cha:11},
        senses:['darkvision 60 ft.', 'passive Perception 12'],
        features:[
          {name:'Charge', desc:`If it moves 20+ ft. straight toward a target before hitting with Maul, target takes an extra 1d6 slashing and must succeed on a DC ${8+c.pb+2} STR save or be knocked prone.`},
          {name:'Primal Bond', desc:'Adds your proficiency bonus to any ability check or saving throw it makes.'}
        ],
        actions:[
          {name:'Maul', desc:`Melee weapon attack: ${c.fmt(c.spellAtk('Ranger'))} to hit, reach 5 ft. Hit: 1d8 + 2 ${c.fmt(c.pb)} slashing damage.`}
        ],
        note:'Shares your initiative, acts right after you; takes Dodge unless you use a bonus action to command it.'
      };
    }
  },

  {
    id:'primal-beast-sky', name:'Beast of the Sky', kind:'feature',
    source:'Beast Master Ranger 3 — Primal Companion (TCE)',
    match: c => c.subclassLevel('Ranger','Beast Master') >= 3,
    build(c){
      const lvl = Math.max(1, c.classLevel('Ranger'));
      return {
        typeLine:'Small beast (Primal Companion)',
        ac: 13 + c.pb, acNote:'natural armor',
        hpMax: 4 + 4*lvl, hpFormula:'4 + 4 × Ranger level',
        speed:'10 ft., fly 60 ft.',
        abilities:{str:6,dex:16,con:13,int:8,wis:14,cha:11},
        senses:['darkvision 60 ft.'],
        features:[
          {name:'Flyby', desc:'Provokes no opportunity attacks when it flies out of an enemy\'s reach.'},
          {name:'Primal Bond', desc:'Adds your proficiency bonus to any ability check or saving throw it makes.'}
        ],
        actions:[
          {name:'Shred', desc:`Melee weapon attack: ${c.fmt(c.spellAtk('Ranger'))} to hit, reach 5 ft. Hit: 1d4 + 3 ${c.fmt(c.pb)} slashing damage.`}
        ],
        note:'Shares your initiative, acts right after you; takes Dodge unless you use a bonus action to command it.'
      };
    }
  },

  {
    id:'primal-beast-sea', name:'Beast of the Sea', kind:'feature',
    source:'Beast Master Ranger 3 — Primal Companion (TCE)',
    match: c => c.subclassLevel('Ranger','Beast Master') >= 3,
    build(c){
      const lvl = Math.max(1, c.classLevel('Ranger'));
      return {
        typeLine:'Medium beast (Primal Companion)',
        ac: 13 + c.pb, acNote:'natural armor',
        hpMax: 5 + 5*lvl, hpFormula:'5 + 5 × Ranger level',
        speed:'5 ft., swim 60 ft.',
        abilities:{str:14,dex:14,con:15,int:8,wis:14,cha:11},
        senses:['darkvision 90 ft.'],
        features:[
          {name:'Amphibious', desc:'Breathes air and water.'},
          {name:'Primal Bond', desc:'Adds your proficiency bonus to any ability check or saving throw it makes.'}
        ],
        actions:[
          {name:'Binding Strike', desc:`Melee weapon attack: ${c.fmt(c.spellAtk('Ranger'))} to hit, reach 5 ft. Hit: 1d6 + 2 ${c.fmt(c.pb)} piercing damage, and the target is grappled (escape DC ${8+c.pb+2}).`}
        ],
        note:'Shares your initiative, acts right after you; takes Dodge unless you use a bonus action to command it.'
      };
    }
  },

  {
    id:'drake-companion', name:'Drake Companion', kind:'feature',
    source:'Drakewarden Ranger 3 (FTD)',
    match: c => c.subclassLevel('Ranger','Drakewarden') >= 3,
    build(c){
      const lvl = Math.max(1, c.classLevel('Ranger'));
      const size = lvl>=15 ? 'Large' : (lvl>=7 ? 'Medium' : 'Small');
      return {
        typeLine:`${size} dragon (Drake Companion)`,
        ac: 14 + c.pb, acNote:'natural armor',
        hpMax: 5 + 5*lvl, hpFormula:'5 + 5 × Ranger level',
        speed:'40 ft.' + (lvl>=7 ? ', fly 40 ft.' : ''),
        abilities:{str:16,dex:12,con:15,int:8,wis:14,cha:8},
        saves:[`DEX ${c.fmt(1+c.pb)}`, `WIS ${c.fmt(2+c.pb)}`],
        skills:[`Perception ${c.fmt(2+c.pb)}`],
        senses:['darkvision 60 ft.'],
        immunities:['your chosen Draconic Essence damage type'],
        features:[
          {name:'Draconic Essence', desc:'Choose acid, cold, fire, lightning, or poison when summoned; the drake is immune to that damage type.'}
        ],
        actions:[
          {name:'Bite', desc:`Melee weapon attack: ${c.fmt(c.spellAtk('Ranger'))} to hit, reach 5 ft. Hit: 1d6 ${c.fmt(c.pb)} piercing damage plus 1d6 damage of its essence type${lvl>=11?' (Bond of Fang and Scale)':''}.`}
        ],
        reactions:[
          {name:'Infused Strikes', desc:'When another creature within 30 ft. hits with a weapon attack, the drake infuses the strike: the target takes an extra 1d6 damage of the drake\'s essence type.'}
        ],
        note:'Shares your initiative, acts right after you; without a command it takes Dodge and moves to avoid danger.'
      };
    }
  },

  {
    id:'wildfire-spirit', name:'Wildfire Spirit', kind:'feature',
    source:'Circle of Wildfire Druid 2 (TCE)',
    match: c => c.subclassLevel('Druid','Circle of Wildfire') >= 2,
    build(c){
      const lvl = Math.max(1, c.classLevel('Druid'));
      return {
        typeLine:'Small elemental (Wildfire Spirit)',
        ac: 13, acNote:'',
        hpMax: 5 + 5*lvl, hpFormula:'5 + 5 × Druid level',
        speed:'30 ft., fly 30 ft. (hover)',
        abilities:{str:10,dex:14,con:14,int:13,wis:15,cha:11},
        senses:['darkvision 60 ft.'],
        immunities:['fire (damage)','charmed','frightened','grappled','prone','restrained'],
        features:[
          {name:'Summoned Ally', desc:'Shares your initiative, acts right after you; takes Dodge unless you use a bonus action to command it.'}
        ],
        actions:[
          {name:'Flame Seed', desc:`Ranged weapon attack: ${c.fmt(c.spellAtk('Druid'))} to hit, range 60 ft. Hit: 1d6 ${c.fmt(c.pb)} fire damage.`},
          {name:'Fiery Teleportation', desc:`Teleports up to 15 ft. to an unoccupied space; each creature within 5 ft. of the space it left takes 1d6 ${c.fmt(c.pb)} fire damage.`}
        ]
      };
    }
  },

  {
    id:'dancing-item', name:'Dancing Item', kind:'feature',
    source:'College of Creation Bard 3 — Animating Performance (TCE)',
    match: c => c.subclassLevel('Bard','College of Creation') >= 3,
    build(c){
      const lvl = Math.max(1, c.classLevel('Bard'));
      return {
        typeLine:'Large construct (animated item)',
        ac: 16, acNote:'natural armor',
        hpMax: 10 + 5*lvl, hpFormula:'10 + 5 × Bard level',
        speed:'30 ft., fly 30 ft. (hover)',
        abilities:{str:18,dex:14,con:16,int:4,wis:10,cha:6},
        senses:['darkvision 60 ft.'],
        immunities:['poison, psychic (damage)','charmed','exhaustion','poisoned'],
        features:[
          {name:'Immutable Form', desc:'Immune to any spell or effect that would alter its form.'},
          {name:'Irrepressible Dance', desc:'A creature that starts its turn within 10 ft. can have its speed raised or lowered by 10 ft. (your choice).'}
        ],
        actions:[
          {name:'Force-Empowered Slam', desc:`Melee weapon attack: ${c.fmt(c.spellAtk('Bard'))} to hit, reach 5 ft. Hit: 1d10 ${c.fmt(c.pb)} force damage.`}
        ],
        note:'Lasts 1 hour, until it drops to 0 HP, or until you die. Shares your initiative, acting right after you.'
      };
    }
  },

  {
    id:'manifest-echo', name:'Manifest Echo', kind:'feature',
    source:'Echo Knight Fighter 3 (EGtW)',
    match: c => c.subclassLevel('Fighter','Echo Knight') >= 3,
    build(c){
      return {
        typeLine:'Magical, translucent image of you',
        ac: 14 + c.pb, acNote:'',
        hpMax: 1, hpFormula:'always 1 HP',
        speed:'30 ft. (teleports when you swap places)',
        abilities:{str:1,dex:1,con:1,int:1,wis:1,cha:1},
        saves:['uses your saving throw bonuses'],
        features:[
          {name:'Echo', desc:'Uses your saving throws; immune to all conditions. Destroyed if it is ever more than 30 ft. from you at the end of your turn.'},
          {name:'Unleash Incarnation', desc:'You can make one extra attack from the echo\'s position (CON mod times per long rest).'}
        ],
        actions:[
          {name:'Attack through the echo', desc:'When you take the Attack action, any of your attacks can originate from the echo\'s space. Opportunity attacks can also be made from its space.'}
        ],
        resources:[{name:'Unleash Incarnation', total: Math.max(1, c.amod('con'))}]
      };
    }
  },

  // ---------- Spells ----------

  {
    id:'homunculus-servant', name:'Homunculus Servant', kind:'spell',
    source:'Homunculus Servant — level 2 conjuration (Artificer, EFotA 2024)',
    match: c => c.knowsSpell('Homunculus Servant'),
    build(c){
      const slot = c.bestSlotLevel(2);
      return {
        typeLine:'Tiny construct (Homunculus Servant)',
        ac: 13, acNote:'',
        hpMax: 5 + 5*slot, hpFormula:`5 + 5 per spell level (cast at level ${slot})`,
        speed:'20 ft., fly 30 ft.',
        abilities:{str:4,dex:15,con:12,int:10,wis:10,cha:7},
        saves:[`Magic Bond: add ${slot} (the spell's level) to all its checks and saves`],
        senses:['darkvision 60 ft.', 'passive Perception 10'],
        immunities:['poison (damage)','exhaustion','poisoned'],
        languages:'telepathy 1 mile (with you only)',
        features:[
          {name:'Evasion', desc:'On a DEX save for half damage: no damage on a success, half on a failure (unless Incapacitated).'},
          {name:'Magic Bond', desc:`Adds the spell's level (${slot}) to any ability check or saving throw it makes.`}
        ],
        actions:[
          {name:'Force Strike', desc:`Melee or ranged attack: ${c.fmt(c.spellAtk('Artificer'))} to hit, reach 5 ft. or range 30 ft. Hit: 1d6 + ${slot} force damage.`}
        ],
        reactions:[
          {name:'Channel Magic', desc:'When you cast a touch-range spell while the homunculus is within 120 ft., it can deliver the spell.'}
        ],
        note:'Shares your initiative, acts right after you; without a command it Dodges. Recast with a higher slot to grow it — the stat block uses the slot\'s level.'
      };
    }
  },

  {
    id:'find-familiar', name:'Familiar', kind:'spell',
    source:'Find Familiar — level 1 conjuration (ritual)',
    match: c => c.knowsSpell('Find Familiar'),
    build(c){
      return {
        typeLine:'Tiny celestial, fey, or fiend (choose a beast form — owl shown)',
        ac: 11, acNote:'owl form',
        hpMax: 1, hpFormula:'per chosen form (owl: 1)',
        speed:'5 ft., fly 60 ft. (owl)',
        abilities:{str:3,dex:13,con:8,int:2,wis:12,cha:7},
        skills:['Perception +3','Stealth +3'],
        senses:['darkvision 120 ft.','passive Perception 13'],
        features:[
          {name:'Flyby (owl)', desc:'Provokes no opportunity attacks when it flies out of an enemy\'s reach.'},
          {name:'Telepathic bond', desc:'Within 100 ft. you can communicate telepathically and perceive through its senses (your action).'},
          {name:'Deliver touch spells', desc:'It can deliver your touch-range spells with its reaction, using your spell attack bonus.'}
        ],
        actions:[
          {name:'No attacks', desc:'A familiar can take actions but cannot attack. Swap this block\'s numbers for your chosen form (bat, cat, raven, owl, etc.).'}
        ],
        note:'Dismiss or resummon it into a new form by recasting the spell.'
      };
    }
  },

  {
    id:'find-steed', name:'Steed (Warhorse)', kind:'spell',
    source:'Find Steed — level 2 conjuration (Paladin)',
    match: c => c.knowsSpell('Find Steed'),
    build(c){
      return {
        typeLine:'Large celestial, fey, or fiend (warhorse form shown)',
        ac: 11, acNote:'',
        hpMax: 19, hpFormula:'per chosen form (warhorse: 19)',
        speed:'60 ft.',
        abilities:{str:18,dex:12,con:13,int:6,wis:12,cha:7},
        senses:['passive Perception 11'],
        features:[
          {name:'Intelligent mount', desc:'INT 6, understands one language you speak; communicates telepathically with you.'},
          {name:'Shared spells', desc:'While mounted, spells you cast targeting only yourself can also affect the steed.'},
          {name:'Trampling Charge', desc:'Moves 20+ ft. straight at a target and hits with Hooves: DC 14 STR save or be knocked prone; the horse can make another Hooves attack as a bonus action.'}
        ],
        actions:[
          {name:'Hooves', desc:'Melee weapon attack: +6 to hit, reach 5 ft. Hit: 2d6 +4 bludgeoning damage.'}
        ],
        note:'Other forms: pony, camel, elk, mastiff. Stat block is the chosen beast\'s.'
      };
    }
  },

  {
    id:'find-greater-steed', name:'Greater Steed (Griffon)', kind:'spell',
    source:'Find Greater Steed — level 4 conjuration (Paladin, XGE)',
    match: c => c.knowsSpell('Find Greater Steed'),
    build(c){
      return {
        typeLine:'Large celestial, fey, or fiend (griffon form shown)',
        ac: 12, acNote:'',
        hpMax: 59, hpFormula:'per chosen form (griffon: 59)',
        speed:'30 ft., fly 80 ft.',
        abilities:{str:18,dex:15,con:16,int:6,wis:13,cha:8},
        skills:['Perception +5'],
        senses:['darkvision 60 ft.','passive Perception 15'],
        features:[
          {name:'Intelligent mount', desc:'INT 6, understands one language you speak; communicates telepathically with you.'},
          {name:'Shared spells', desc:'While mounted, spells you cast targeting only yourself can also affect the steed.'},
          {name:'Keen Sight', desc:'Advantage on WIS (Perception) checks that rely on sight.'}
        ],
        actions:[
          {name:'Multiattack', desc:'Two attacks: one Beak, one Claws.'},
          {name:'Beak', desc:'Melee weapon attack: +6 to hit, reach 5 ft. Hit: 1d8 +4 piercing damage.'},
          {name:'Claws', desc:'Melee weapon attack: +6 to hit, reach 5 ft. Hit: 2d6 +4 slashing damage.'}
        ],
        note:'Other forms: pegasus, peryton, dire wolf, rhinoceros, saber-toothed tiger.'
      };
    }
  },

  {
    id:'phantom-steed', name:'Phantom Steed', kind:'spell',
    source:'Phantom Steed — level 3 illusion (ritual, Wizard)',
    match: c => c.knowsSpell('Phantom Steed'),
    build(c){
      return {
        typeLine:'Large quasi-real, horselike creature',
        ac: 10, acNote:'riding horse',
        hpMax: 13, hpFormula:'riding horse chassis (13)',
        speed:'100 ft. (13 mph riding; 10 mph over difficult terrain)',
        abilities:{str:16,dex:10,con:12,int:2,wis:11,cha:7},
        features:[
          {name:'Quasi-real', desc:'Uses riding-horse statistics but has your chosen appearance and a speed of 100 ft. Lasts 1 hour; vanishes if it takes damage (fades over 1 round) or you dismiss it.'}
        ],
        actions:[
          {name:'No attacks', desc:'The steed cannot attack; it exists to carry you.'}
        ]
      };
    }
  },

  // ---------- TCE / FTD "Summon ..." series — the block scales with the slot level ----------
  ...[
    { id:'summon-beast', spell:'Summon Beast', minSlot:2, type:'Beast (Bestial Spirit)',
      ac: s=>11+s, hp: s=>30+5*(s-2), speed:'30 ft. (climb/fly/swim by mode)',
      abil:{str:18,dex:11,con:16,int:4,wis:14,cha:5},
      atk:(c,s)=>`Maul: ${c.fmt(c.spellAtk())} to hit. Hit: 1d8 + 4 + ${s} piercing damage. Attacks per Multiattack: ${Math.floor(s/2)}.` },
    { id:'summon-fey', spell:'Summon Fey', minSlot:3, type:'Fey (Fey Spirit)',
      ac: s=>12+s, hp: s=>30+10*(s-3), speed:'30 ft., fly 30 ft.',
      abil:{str:13,dex:16,con:14,int:14,wis:11,cha:16},
      atk:(c,s)=>`Fey Blade: ${c.fmt(c.spellAtk())} to hit. Hit: 2d6 + 3 + ${s} force damage. Attacks per Multiattack: ${Math.floor(s/2)}. Can teleport 30 ft. as a bonus action (Fey Step).` },
    { id:'summon-shadowspawn', spell:'Summon Shadowspawn', minSlot:3, type:'Monstrosity (Shadow Spirit)',
      ac: s=>11+s, hp: s=>35+15*(s-3), speed:'40 ft.',
      abil:{str:13,dex:16,con:15,int:4,wis:10,cha:16},
      atk:(c,s)=>`Chilling Rend: ${c.fmt(c.spellAtk())} to hit. Hit: 2d4 + 3 + ${s} cold damage. Attacks per Multiattack: ${Math.floor(s/2)}.` },
    { id:'summon-undead', spell:'Summon Undead', minSlot:3, type:'Undead (Undead Spirit)',
      ac: s=>11+s, hp: s=>30+10*(s-3), speed:'30 ft. (fly 40 ft. ghostly)',
      abil:{str:12,dex:16,con:15,int:4,wis:10,cha:9},
      atk:(c,s)=>`Deathly Touch / Grave Bolt (by form): ${c.fmt(c.spellAtk())} to hit. Hit: about 1d8 + 3 + ${s} necrotic damage. Attacks per Multiattack: ${Math.floor(s/2)}.` },
    { id:'summon-aberration', spell:'Summon Aberration', minSlot:4, type:'Aberration (Aberrant Spirit)',
      ac: s=>11+s, hp: s=>40+10*(s-4), speed:'30 ft., fly 30 ft. (star spawn/beholderkin)',
      abil:{str:16,dex:10,con:15,int:16,wis:10,cha:6},
      atk:(c,s)=>`Claw / Eye Ray (by form): ${c.fmt(c.spellAtk())} to hit. Hit: about 1d8 + 3 + ${s} damage (type by form). Attacks per Multiattack: ${Math.floor(s/2)}.` },
    { id:'summon-construct', spell:'Summon Construct', minSlot:4, type:'Construct (Construct Spirit)',
      ac: s=>13+s, hp: s=>40+15*(s-4), speed:'30 ft.',
      abil:{str:18,dex:10,con:18,int:14,wis:11,cha:5},
      atk:(c,s)=>`Slam: ${c.fmt(c.spellAtk())} to hit. Hit: 1d8 + 4 + ${s} bludgeoning damage. Attacks per Multiattack: ${Math.floor(s/2)}.` },
    { id:'summon-elemental', spell:'Summon Elemental', minSlot:4, type:'Elemental (Elemental Spirit)',
      ac: s=>11+s, hp: s=>50+10*(s-4), speed:'40 ft. (burrow/fly/swim by element)',
      abil:{str:18,dex:15,con:17,int:4,wis:10,cha:16},
      atk:(c,s)=>`Slam: ${c.fmt(c.spellAtk())} to hit. Hit: 1d10 + 4 + ${s} damage (type by element). Attacks per Multiattack: ${Math.floor(s/2)}.` },
    { id:'summon-celestial', spell:'Summon Celestial', minSlot:5, type:'Celestial (Celestial Spirit)',
      ac: s=>11+s, hp: s=>40+10*(s-5), speed:'30 ft., fly 40 ft.',
      abil:{str:16,dex:14,con:16,int:10,wis:14,cha:16},
      atk:(c,s)=>`Radiant Bow / Mace (by form): ${c.fmt(c.spellAtk())} to hit. Hit: about 2d6 + 2 + ${s} radiant damage. Attacks per Multiattack: ${Math.floor(s/2)}. Healing Touch (1/day): 2d8 + ${s}.`,
      res:[{name:'Healing Touch', total:1}] },
    { id:'summon-fiend', spell:'Summon Fiend', minSlot:6, type:'Fiend (Fiendish Spirit)',
      ac: s=>12+s, hp: s=>50+15*(s-6), speed:'40 ft. (fly/climb by form)',
      abil:{str:13,dex:16,con:15,int:10,wis:10,cha:16},
      atk:(c,s)=>`Bite / Claws / Hurl Flame (by form): ${c.fmt(c.spellAtk())} to hit. Hit: about 2d6 + 3 + ${s} damage. Attacks per Multiattack: ${Math.floor(s/2)}.` },
    { id:'summon-draconic-spirit', spell:'Summon Draconic Spirit', minSlot:5, type:'Dragon (Draconic Spirit)',
      ac: s=>14+s, hp: s=>50+10*(s-5), speed:'30 ft., fly 60 ft., swim 30 ft.',
      abil:{str:19,dex:14,con:17,int:10,wis:14,cha:14},
      atk:(c,s)=>`Rend: ${c.fmt(c.spellAtk())} to hit. Hit: 1d6 + 4 + ${s} piercing damage. Attacks per Multiattack: ${Math.floor(s/2)}. Breath Weapon: ${Math.floor(s/2)}d6 damage of chosen type, DC = your spell save DC.` }
  ].map(d => ({
    id: d.id, name: d.spell.replace(/^Summon /,'') , kind:'spell',
    source: `${d.spell} — level ${d.minSlot} conjuration (TCE/FTD)`,
    match: c => c.knowsSpell(d.spell),
    build(c){
      const slot = c.bestSlotLevel(d.minSlot);
      return {
        typeLine: d.type + ` — summoned at slot level ${slot}`,
        ac: d.ac(slot), acNote:'natural armor',
        hpMax: d.hp(slot), hpFormula:`scales with slot level above ${d.minSlot}`,
        speed: d.speed,
        abilities: d.abil,
        features:[
          {name:'Summoned ally', desc:'Shares your initiative, acts right after you; obeys your verbal commands (no action). Without one it Dodges. Lasts up to 1 hour (concentration).'}
        ],
        actions:[ {name:'Attack', desc: d.atk(c, slot)} ],
        resources: d.res || [],
        note:'Pick the spirit\'s form/mode when you cast. Exact per-form traits are in the spell\'s stat block — numbers here follow the printed scaling.'
      };
    }
  }))
];
