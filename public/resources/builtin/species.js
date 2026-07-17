// Built-in game content, one file per type (split from the old builtins.js).
// Loaded as classic scripts BEFORE /app.js (see src/views/*.html) in the order
// listed in README.md — every top-level const here is a global shared with
// app.js and the /modules scripts. User-imported ("custom") data is DB-backed
// and merged into these registries at startup by app.js.
// ---------- Species: SPECIES_DATA ----------

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
