import { useState } from 'react';

const newId = () => 'cb' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const logId = () => 'lg' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
const LOG_CAP = 200;

// Free-form initiative tracker. Combatants are typed by the DM, seeded from a
// monster statblock, or linked to a party character. By default rows sort by
// initiative desc; dragging a row switches to a sticky MANUAL order (initiative
// becomes just a displayed number). Next turn advances the marker, wrapping to a
// new round (which resets legendary counters) and appending to the combat log.
export default function TurnOrderTracker({ combat, onChange, party = [], onOpenSnapshot, onOpenMonster }) {
  const c = combat || { combatants: [], activeIndex: 0, round: 1 };
  const manual = !!c.manualOrder;
  const [name, setName] = useState('');
  const [init, setInit] = useState('');
  const [hp, setHp] = useState('');
  const [linkId, setLinkId] = useState('');
  const [dragId, setDragId] = useState(null);

  // Display order: manual keeps the stored array order; otherwise sort by init desc.
  const display = manual
    ? [...c.combatants]
    : [...c.combatants].sort((a, b) => (b.initiative || 0) - (a.initiative || 0));
  const activeId = display[c.activeIndex] ? display[c.activeIndex].id : null;

  const patch = (next) => onChange({ ...c, ...next });
  const setCombatant = (id, fields) => patch({ combatants: c.combatants.map((x) => x.id === id ? { ...x, ...fields } : x) });
  const appendLog = (base, text) => {
    const log = [...(base.log || []), { id: logId(), time: new Date().toISOString(), text }];
    return log.length > LOG_CAP ? log.slice(log.length - LOG_CAP) : log;
  };

  const add = () => {
    const nm = name.trim();
    if (!nm) return;
    const combatant = { id: newId(), name: nm, initiative: parseInt(init, 10) || 0,
      hp: parseInt(hp, 10) || 0, hpMax: parseInt(hp, 10) || 0, legendaryMax: 0, legendaryUsed: 0, resources: [], note: '',
      linkedCharacterId: linkId || undefined };
    patch({ combatants: [...c.combatants, combatant] });
    setName(''); setInit(''); setHp(''); setLinkId('');
  };
  const remove = (id) => patch({ combatants: c.combatants.filter((x) => x.id !== id) });
  const clearAll = () => { if (window.confirm('Clear the whole turn order?')) onChange({ combatants: [], activeIndex: 0, round: 1, log: c.log || [] }); };

  // Pick a party character from the dropdown: fill the name + remember the link.
  const pickLink = (id) => {
    setLinkId(id);
    const p = party.find((x) => String(x.id) === String(id));
    if (p) setName(p.name);
  };

  const advance = (dir) => {
    const n = display.length;
    if (n === 0) return;
    let idx = c.activeIndex + dir;
    let round = c.round;
    if (idx >= n) { idx = 0; round += 1; }
    if (idx < 0) { idx = n - 1; round = Math.max(1, round - 1); }
    const roundWrapped = round !== c.round && dir > 0;
    // On a new round, restore every combatant's legendary actions.
    const combatants = roundWrapped ? c.combatants.map((x) => ({ ...x, legendaryUsed: 0 })) : c.combatants;
    let log = c.log || [];
    if (roundWrapped) log = appendLog({ log }, `Round ${round} began`);
    const active = display[idx];
    if (active && dir > 0) log = appendLog({ log }, `Now: ${active.name}${round > 1 ? ` (round ${round})` : ''}`);
    onChange({ ...c, combatants, activeIndex: idx, round, log });
  };

  // Drag a row onto another to set a sticky manual order; keep the active marker
  // on the same combatant by re-deriving activeIndex from its id.
  const drop = (targetId) => {
    if (!dragId || dragId === targetId) { setDragId(null); return; }
    const order = display.map((x) => x.id);
    const from = order.indexOf(dragId), to = order.indexOf(targetId);
    if (from < 0 || to < 0) { setDragId(null); return; }
    order.splice(to, 0, order.splice(from, 1)[0]);
    const reordered = order.map((id) => c.combatants.find((x) => x.id === id));
    const activeIndex = activeId ? Math.max(0, reordered.findIndex((x) => x.id === activeId)) : c.activeIndex;
    onChange({ ...c, combatants: reordered, manualOrder: true, activeIndex });
    setDragId(null);
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

  const linkable = party.filter((p) => p && p.id);

  return (
    <div className="panel turn-order">
      <h2><span>Turn Order</span><span className="rune">⚔</span></h2>
      <div className="turn-order-bar">
        <span className="turn-round">Round {c.round}</span>
        {manual && <span className="turn-mode" title="Rows are in your manual (dragged) order">manual order</span>}
        <button className="pbtn" type="button" onClick={() => advance(-1)} disabled={display.length === 0}>‹ Prev</button>
        <button className="add-btn" type="button" onClick={() => advance(1)} disabled={display.length === 0}>Next turn ›</button>
        {manual && <button className="pbtn" type="button" title="Re-sort by initiative"
          onClick={() => onChange({ ...c, manualOrder: false, activeIndex: 0 })}>Sort by init</button>}
        <button className="pbtn danger" type="button" onClick={clearAll} disabled={display.length === 0}>Clear</button>
      </div>

      <div className="turn-order-add">
        {linkable.length > 0 && (
          <select value={linkId} onChange={(e) => pickLink(e.target.value)} title="Link a party character">
            <option value="">Link character…</option>
            {linkable.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        )}
        <input placeholder="Combatant" value={name} onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') add(); }} />
        <input placeholder="Init" type="number" value={init} onChange={(e) => setInit(e.target.value)} style={{ width: 70 }} />
        <input placeholder="HP" type="number" value={hp} onChange={(e) => setHp(e.target.value)} style={{ width: 70 }} />
        <button className="pbtn" type="button" onClick={add}>+ Add</button>
      </div>

      <div className="turn-order-list">
        {display.length === 0 && <div className="action-empty">No combatants — add the party and monsters above.</div>}
        {display.map((cb) => (
          <div key={cb.id} className={'turn-row' + (cb.id === activeId ? ' active' : '') + (dragId === cb.id ? ' dragging' : '')}
            draggable onDragStart={() => setDragId(cb.id)} onDragEnd={() => setDragId(null)}
            onDragOver={(e) => e.preventDefault()} onDrop={() => drop(cb.id)}>
            <span className="turn-drag" title="Drag to reorder (sets a manual order)">⠿</span>
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
            {cb.monster && onOpenMonster &&
              <button className="pbtn turn-ref" type="button" title="Open reference statblock" onClick={() => onOpenMonster(cb.monster)}>📖 Reference</button>}
            {cb.linkedCharacterId && onOpenSnapshot &&
              <button className="pbtn turn-ref" type="button" title="Open character snapshot" onClick={() => onOpenSnapshot({ id: cb.linkedCharacterId, name: cb.name })}>✦ Snapshot</button>}
            <span className="row-del" title="Remove combatant" onClick={() => remove(cb.id)}>✕</span>
          </div>
        ))}
      </div>
    </div>
  );
}
