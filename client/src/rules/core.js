// Core character math, extracted verbatim from public/app.js. Everything here
// is pure: no DOM, no globals, no fetch.

export function mod(score) { return Math.floor((score - 10) / 2); }

export function fmt(n) { return (n >= 0 ? '+' : '') + n; }

export function profBonus(level) {
  if (level >= 17) return 6;
  if (level >= 13) return 5;
  if (level >= 9) return 4;
  if (level >= 5) return 3;
  return 2;
}

export function levelLabel(lvl) { return lvl === 0 ? 'Cantrip' : 'Level ' + lvl; }

// Escape user text before interpolating into markup.
export function esc(s) {
  return (s == null ? '' : String(s))
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// The blank character. Matches the legacy defaultCharacter() field-for-field —
// saved JSON must stay interchangeable between the two frontends.
export function defaultCharacter() {
  return {
    id: null,
    name: 'Unnamed Adventurer', class: '', level: 1, race: '', subrace: '', background: '', alignment: '', xp: 0,
    classes: [], // multiclass list: [{name, level}]; first entry is the primary class
    abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 },
    saveProf: { str: false, dex: false, con: false, int: false, wis: false, cha: false },
    skillProf: {},
    ac: 10, speed: 30, hpMax: 10, hpCurrent: 10, hpTemp: 0, hitDice: '1d10',
    deathSuccess: [false, false, false], deathFail: [false, false, false],
    attacks: [{ name: '', bonus: '', dmg: '' }],
    features: '', persTraits: '', persIdeals: '', persBonds: '', persFlaws: '',
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    inventory: [{ name: '', qty: 1 }],
    spellSlots: [1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => ({ total: 0, used: 0 })),
    pactSlots: { total: 0, used: 0, level: 1 }, // Warlock pact magic (tracked separately)
    autoSlots: true, // auto-fill slots from class levels (PHB multiclass rules)
    spellClass: 'Wizard',
    knownSpells: [], // {name, level, custom:bool, tags:[...]}
    equipment: [],
    actionResources: [], // {name, total, used}
    companions: [],
    journal: [], // {id, title, text, created, updated}
    rollLog: [] // {id, formula, detail, total, time}
  };
}
