// Built-in game content, one file per type (split from the old builtins.js).
// Loaded as classic scripts BEFORE /app.js (see src/views/*.html) in the order
// listed in README.md — every top-level const here is a global shared with
// app.js and the /modules scripts. User-imported ("custom") data is DB-backed
// and merged into these registries at startup by app.js.
// ---------- Alignments ----------

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
