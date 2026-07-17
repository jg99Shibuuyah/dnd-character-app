// Built-in game content, one file per type (split from the old builtins.js).
// Loaded as classic scripts BEFORE /app.js (see src/views/*.html) in the order
// listed in README.md — every top-level const here is a global shared with
// app.js and the /modules scripts. User-imported ("custom") data is DB-backed
// and merged into these registries at startup by app.js.
// Depends on species.js (subspeciesNamesForSpecies reads SPECIES_DATA).

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
