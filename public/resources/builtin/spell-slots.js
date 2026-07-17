// Built-in game content, one file per type (split from the old builtins.js).
// Loaded as classic scripts BEFORE /app.js (see src/views/*.html) in the order
// listed in README.md — every top-level const here is a global shared with
// app.js and the /modules scripts. User-imported ("custom") data is DB-backed
// and merged into these registries at startup by app.js.
// ---------- Spell slot tables: FULL_SLOTS, HALF_SLOTS, PACT_SLOTS ----------

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
