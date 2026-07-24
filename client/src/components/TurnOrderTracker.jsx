import { useState } from 'react';

const newId = () => 'cb' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);

// Free-form initiative tracker. Combatants are typed by the DM (or seeded from a
// monster statblock). Sorted by initiative desc; Next turn advances the marker,
// wrapping to a new round and resetting each combatant's legendary counter.
export default function TurnOrderTracker({ combat, onChange }) {
  const c = combat || { combatants: [], activeIndex: 0, round: 1 };
  const [name, setName] = useState('');
  const [init, setInit] = useState('');
  const [hp, setHp] = useState('');

  const sorted = [...c.combatants].sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
  const patch = (next) => onChange({ ...c, ...next });
  const setCombatant = (id, fields) => patch({ combatants: c.combatants.map((x) => x.id === id ? { ...x, ...fields } : x) });

  const add = () => {
    const nm = name.trim();
    if (!nm) return;
    const combatant = { id: newId(), name: nm, initiative: parseInt(init, 10) || 0,
      hp: parseInt(hp, 10) || 0, hpMax: parseInt(hp, 10) || 0, legendaryMax: 0, legendaryUsed: 0, resources: [], note: '' };
    patch({ combatants: [...c.combatants, combatant] });
    setName(''); setInit(''); setHp('');
  };
  const remove = (id) => patch({ combatants: c.combatants.filter((x) => x.id !== id) });
  const clearAll = () => { if (window.confirm('Clear the whole turn order?')) onChange({ combatants: [], activeIndex: 0, round: 1 }); };

  const advance = (dir) => {
    const n = sorted.length;
    if (n === 0) return;
    let idx = c.activeIndex + dir;
    let round = c.round;
    if (idx >= n) { idx = 0; round += 1; }
    if (idx < 0) { idx = n - 1; round = Math.max(1, round - 1); }
    // On a new round, restore every combatant's legendary actions.
    const combatants = round !== c.round && dir > 0
      ? c.combatants.map((x) => ({ ...x, legendaryUsed: 0 }))
      : c.combatants;
    onChange({ ...c, combatants, activeIndex: idx, round });
  };

  const addResource = (id) => {
    const nm = window.prompt('Resource name (e.g. Legendary Resistance):');
    if (!nm) return;
    const max = parseInt(window.prompt('How many uses?', '3'), 10) || 1;
    setCombatant(id, { resources: [...(c.combatants.find((x) => x.id === id).resources || []), { name: nm.trim(), max, used: 0 }] });
  };
  const bumpResource = (id, ri, delta) => {
    const cb = c.combatants.find((x) => x.id === id);
    const resources = cb.resources.map((r, i) => i === ri ? { ...r, used: Math.max(0, Math.min(r.max, r.used + delta)) } : r);
    setCombatant(id, { resources });
  };
  const removeResource = (id, ri) => {
    const cb = c.combatants.find((x) => x.id === id);
    setCombatant(id, { resources: cb.resources.filter((_, i) => i !== ri) });
  };

  const activeId = sorted[c.activeIndex] ? sorted[c.activeIndex].id : null;

  return (
    <div className="panel turn-order">
      <h2><span>Turn Order</span><span className="rune">⚔</span></h2>
      <div className="turn-order-bar">
        <span className="turn-round">Round {c.round}</span>
        <button className="pbtn" type="button" onClick={() => advance(-1)} disabled={sorted.length === 0}>‹ Prev</button>
        <button className="add-btn" type="button" onClick={() => advance(1)} disabled={sorted.length === 0}>Next turn ›</button>
        <button className="pbtn danger" type="button" onClick={clearAll} disabled={sorted.length === 0}>Clear</button>
      </div>

      <div className="turn-order-add">
        <input placeholder="Combatant" value={name} onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') add(); }} />
        <input placeholder="Init" type="number" value={init} onChange={(e) => setInit(e.target.value)} style={{ width: 70 }} />
        <input placeholder="HP" type="number" value={hp} onChange={(e) => setHp(e.target.value)} style={{ width: 70 }} />
        <button className="pbtn" type="button" onClick={add}>+ Add</button>
      </div>

      <div className="turn-order-list">
        {sorted.length === 0 && <div className="action-empty">No combatants — add the party and monsters above.</div>}
        {sorted.map((cb) => (
          <div key={cb.id} className={'turn-row' + (cb.id === activeId ? ' active' : '')}>
            <span className="turn-init">{cb.initiative}</span>
            <span className="turn-name">{cb.name}{cb.note && <span className="session-dim"> · {cb.note}</span>}</span>
            <span className="turn-hp">
              <label>HP</label>
              <input type="number" value={cb.hp} onChange={(e) => setCombatant(cb.id, { hp: parseInt(e.target.value, 10) || 0 })} style={{ width: 60 }} />
              {cb.hpMax ? <span className="session-dim"> / {cb.hpMax}</span> : null}
            </span>
            {cb.legendaryMax > 0 && (
              <span className="turn-legendary">
                <label>Legendary</label>
                <button className="pbtn" type="button" onClick={() => setCombatant(cb.id, { legendaryUsed: Math.min(cb.legendaryMax, cb.legendaryUsed + 1) })}>−</button>
                <span>{Math.max(0, cb.legendaryMax - cb.legendaryUsed)}/{cb.legendaryMax}</span>
                <button className="pbtn" type="button" onClick={() => setCombatant(cb.id, { legendaryUsed: Math.max(0, cb.legendaryUsed - 1) })}>+</button>
              </span>
            )}
            {(cb.resources || []).map((r, ri) => (
              <span key={ri} className="turn-resource">
                <label>{r.name}</label>
                <button className="pbtn" type="button" onClick={() => bumpResource(cb.id, ri, 1)}>−</button>
                <span>{Math.max(0, r.max - r.used)}/{r.max}</span>
                <button className="pbtn" type="button" onClick={() => bumpResource(cb.id, ri, -1)}>+</button>
                <span className="turn-resource-del" title="Remove counter" onClick={() => removeResource(cb.id, ri)}>✕</span>
              </span>
            ))}
            <button className="pbtn" type="button" onClick={() => addResource(cb.id)} title="Add a resource counter">+ counter</button>
            <span className="row-del" title="Remove combatant" onClick={() => remove(cb.id)}>✕</span>
          </div>
        ))}
      </div>
    </div>
  );
}
