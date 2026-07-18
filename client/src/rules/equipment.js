// Equipment effects, extracted from public/app.js. All functions take the
// character object explicitly instead of reading a module-level `state`.

export function newEquipItem() {
  return { name: '', description: '', equipped: true,
    attack: { bonus: '', dmg: '' }, ac: '',
    abilities: { str: '', dex: '', con: '', int: '', wis: '', cha: '' },
    skills: [], spells: [] };
}

export function equipList(character) {
  if (!Array.isArray(character.equipment)) character.equipment = [];
  return character.equipment;
}

export function equippedEquip(character) {
  return equipList(character).filter((it) => it.equipped);
}

// Parse an ability-effect string: "+2"/"-1" → additive, "=19" → set score.
export function parseAbilityEffect(v) {
  const s = (v == null ? '' : String(v)).trim();
  if (!s) return null;
  if (s[0] === '=') { const n = parseInt(s.slice(1), 10); return isNaN(n) ? null : { mode: 'set', value: n }; }
  const n = parseInt(s, 10);
  return isNaN(n) ? null : { mode: 'add', value: n };
}

export function equipSkillBonus(character, skillName) {
  let n = 0;
  equippedEquip(character).forEach((it) => (it.skills || []).forEach((s) => {
    if (s.name === skillName) n += Number(s.bonus) || 0;
  }));
  return n;
}

export function equipmentAttacks(character) {
  return equippedEquip(character)
    .filter((it) => it.attack && (it.attack.dmg || it.attack.bonus))
    .map((it) => ({ name: it.name || 'Unnamed weapon', bonus: it.attack.bonus || '', dmg: it.attack.dmg || '' }));
}

export function equipmentGrantedSpells(character) {
  return equippedEquip(character).flatMap((it) =>
    (it.spells || []).map((sp) => ({ name: sp.name, level: Number(sp.level) || 0, from: it.name || 'item' })));
}
