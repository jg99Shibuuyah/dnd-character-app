# Companion sources — features & spells that grant a scaling companion

For review. Templates marked **implemented** exist in `public/resources/companions.js`
and can be auto-generated on the Character tab. Everything scales off the character:
`PB` = proficiency bonus, `spell atk` = PB + spellcasting mod, `slot` = the spell
slot level it's cast with (the generator uses the highest slot the character has).

**Accuracy note:** Steel Defender and Homunculus Servant were transcribed from the
cited wikidot pages. The other implemented templates were written from rules memory
and are close but worth a once-over against your books (flagged ⚠ below).

## Class & subclass features

| Feature | Class | Implemented | Scaling |
|---|---|---|---|
| Steel Defender | Battle Smith (Artificer 3) — [source](https://dnd5e.wikidot.com/artificer:battle-smith) | ✅ | HP 2 + INT + 5×level; attacks/repair use PB & spell atk; +2 AC and better Deflect at 15 (Improved Defender); Arcane Jolt note at 9/15 |
| Primal Companion — Beast of the Land / Sky / Sea | Beast Master Ranger 3 (Tasha's) | ✅ ⚠ | AC 13+PB; HP 5+5×level (Sky 4+4×); attacks use spell atk + PB damage; Primal Bond adds PB to checks/saves |
| Drake Companion | Drakewarden Ranger 3 (Fizban's) | ✅ ⚠ | AC 14+PB; HP 5+5×level; grows Medium@7 (flight), Large@15; bite adds essence damage at 11 |
| Wildfire Spirit | Circle of Wildfire Druid 2 (Tasha's) | ✅ ⚠ | HP 5+5×level; Flame Seed / Fiery Teleportation use spell atk + PB |
| Dancing Item (Animating Performance) | College of Creation Bard 3 (Tasha's) | ✅ ⚠ | HP 10+5×level; slam uses spell atk + PB |
| Manifest Echo | Echo Knight Fighter 3 (Explorer's Guide) | ✅ | AC 14+PB, 1 HP, uses your saves; borderline companion but useful as a card |
| Ranger's Companion (2014 PHB Beast Master) | Beast Master Ranger 3 (PHB) | ❌ | You pick a real beast (CR ¼); it adds your PB to AC/attacks/damage/saves/skills and gains 4×ranger-level HP — needs a beast-statblock picker; the Tasha's Primal Companion covers most tables |
| Primal Companion (2024 PHB version) | Beast Master Ranger 3 (2024) | ❌ | Same shape as Tasha's with revised numbers — easy follow-up once you confirm which ruleset the app targets |
| Homunculus Servant (infusion version) | Artificer 2 infusion (Tasha's) | ❌ | Pre-2024 item-infusion variant; the 2024 spell version below is implemented |
| Avenging Angel / other temporary transformations | various | ❌ | Excluded — they transform you, not a companion |

## Spells

| Spell | Level | Implemented | Scaling |
|---|---|---|---|
| Homunculus Servant | 2 (Artificer, 2024 Eberron: Forge of the Artificer) — [source](http://dnd2024.wikidot.com/spell:homunculus-servant) | ✅ | AC 13; HP 5+5×slot; Magic Bond adds slot to checks/saves; Force Strike = spell atk, 1d6+slot force |
| Find Familiar | 1 (ritual) | ✅ | Fixed beast-form stats (owl shown, swap for your form); delivers touch spells with your spell atk |
| Find Steed | 2 (Paladin) | ✅ | Fixed warhorse block (or pony/camel/elk/mastiff); shared self-spells |
| Find Greater Steed | 4 (Paladin, Xanathar's) | ✅ | Fixed griffon block (or pegasus/peryton/dire wolf/rhino/saber-tooth) |
| Phantom Steed | 3 (ritual, Wizard) | ✅ | Quasi-real riding horse, speed 100 ft., no attacks |
| Summon Beast | 2 (Tasha's) | ✅ ⚠ | AC 11+slot; HP 30+5/slot above 2; multiattack ⌊slot/2⌋; all summon spells use your spell atk & save DC |
| Summon Fey | 3 (Tasha's) | ✅ ⚠ | AC 12+slot; HP 30+10/slot above 3 |
| Summon Shadowspawn | 3 (Tasha's) | ✅ ⚠ | AC 11+slot; HP 35+15/slot above 3 |
| Summon Undead | 3 (Tasha's) | ✅ ⚠ | AC 11+slot; HP 30+10/slot above 3; three forms |
| Summon Aberration | 4 (Tasha's) | ✅ ⚠ | AC 11+slot; HP 40+10/slot above 4; three forms |
| Summon Construct | 4 (Tasha's) | ✅ ⚠ | AC 13+slot; HP 40+15/slot above 4 |
| Summon Elemental | 4 (Tasha's) | ✅ ⚠ | AC 11+slot; HP 50+10/slot above 4 |
| Summon Celestial | 5 (Tasha's) | ✅ ⚠ | AC 11+slot (13+slot defender); HP 40+10/slot above 5 |
| Summon Fiend | 6 (Tasha's) | ✅ ⚠ | AC 12+slot; HP 50+15/slot above 6 |
| Summon Draconic Spirit | 5 (Fizban's) | ✅ ⚠ | AC 14+slot; HP 50+10/slot above 5; breath weapon ⌊slot/2⌋d6 |
| Create Homunculus | 6 (Wizard, Xanathar's) | ❌ | Fixed homunculus block, costs HP to cast; niche |
| Animate Dead / Danse Macabre / Finger of Death | 3/5/7 | ❌ | Fixed skeleton/zombie blocks, quantity scales rather than the creature — better as a squad tracker than a mini sheet |
| Conjure Animals / Woodland Beings / Minor Elementals / Elemental / Celestial / Fey | 3–7 | ❌ | DM-chosen creatures from the Monster Manual; no single scaling block to generate |
| Infernal Calling / Planar Ally / Planar Binding | 5–6 | ❌ | Same — the creature comes from the MM, not a formula |
| Giant Insect / Awaken | 4/5 | ❌ | Transforms/awakens an existing creature |
| Mage Hand / Unseen Servant / Tenser's Floating Disk | 0–1 | ❌ | Effects, not creatures |

## How auto-generation decides what to offer

- **Features** match on class + subclass + level (e.g. Artificer with the
  Battle Smith subclass at level 3+). Imported/custom subclasses work as long as
  the subclass name matches.
- **Spells** match when the spell is in Known Spells or granted by equipped gear.
- The picker offers **only** sources the character qualifies for. Anything else
  can be entered by hand with "+ Add companion manually", and every template is
  browsable in the **Library** under the *Companions* filter (stat block shown
  at a baseline character; the sheet scales the real one).

## Where companions surface

- **Character tab** — the companion cards (mini sheet: HP tracking, abilities,
  skills, features, actions, notes), auto-scaling with level.
- **Actions tab → Companion Actions** — each companion's actions/reactions in
  their own section, mirroring the character's action list.
- **Actions tab → Resource Points** — limited-use companion abilities (Steel
  Defender's Repair 3/Day, Echo Knight's Unleash Incarnation = CON mod, Summon
  Celestial's Healing Touch 1/Day) appear as trackers tagged with the
  companion's name. Resources are added/edited via a popup (name + max +
  owner); pools over 10 points render as an `11/11` counter with − / + instead
  of pips.
- **Library** — every companion template gets a searchable detail popup.
