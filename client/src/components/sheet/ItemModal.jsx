import { useEffect, useState } from 'react';
import { fmt } from '../../rules/core.js';
import { newEquipItem } from '../../rules/equipment.js';

// Add/Edit popup for the Inventory tab (ports item-modal.html + openEquipModal/
// openItemModal/saveItemModal). One modal serves both flavors: 'equip' shows
// the full effects form working on a draft; 'item' is name + quantity. The Type
// toggle flips `kind`; Save moves the entry between lists when it changed.
//
// `ctx` is { originKind:'equip'|'item', index:number|null, kind, draft }.
// onSave(ctx, { name, qty }) commits; onClose() dismisses.

const clone = (o) => JSON.parse(JSON.stringify(o));

export function makeEquipCtx(index, item) {
  const editing = Number.isInteger(index);
  const src = editing ? item : newEquipItem();
  const draft = normalize(clone(src));
  return { originKind: 'equip', index: editing ? index : null, kind: 'equip', draft, name: draft.name || '', qty: 1 };
}

export function makeItemCtx(index, item) {
  const editing = Number.isInteger(index);
  const src = editing ? item : { name: '', qty: 1 };
  const draft = normalize(newEquipItem());
  draft.name = src.name || '';
  return { originKind: 'item', index: editing ? index : null, kind: 'item', draft, name: src.name || '', qty: src.qty == null ? 1 : src.qty };
}

function normalize(d) {
  d.attack = d.attack || { bonus: '', dmg: '' };
  d.abilities = d.abilities || {};
  d.skills = d.skills || [];
  d.spells = d.spells || [];
  return d;
}

export default function ItemModal({ ctx: initialCtx, abilities, skills, onSave, onClose }) {
  const [ctx, setCtx] = useState(initialCtx);
  const [status, setStatus] = useState('');
  const [skillPick, setSkillPick] = useState('');
  const [skillBonus, setSkillBonus] = useState('');
  const [spellName, setSpellName] = useState('');
  const [spellLvl, setSpellLvl] = useState('0');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const d = ctx.draft;
  const editing = ctx.index != null;
  const setDraft = (fn) => setCtx((c) => { const next = clone(c); fn(next.draft); return next; });

  const setKind = (kind) => setCtx((c) => ({ ...c, kind }));

  const addSkill = () => {
    const bonus = parseInt(skillBonus, 10);
    if (!skillPick || isNaN(bonus)) { setStatus('Pick a skill and a bonus.'); return; }
    setDraft((dr) => { dr.skills.push({ name: skillPick, bonus }); });
    setSkillPick(''); setSkillBonus(''); setStatus('');
  };
  const addSpell = () => {
    const name = spellName.trim();
    if (!name) { setStatus('Name the granted spell first.'); return; }
    const level = Math.max(0, Math.min(9, parseInt(spellLvl, 10) || 0));
    setDraft((dr) => { dr.spells.push({ name, level }); });
    setSpellName(''); setStatus('');
  };

  const save = () => {
    const name = ctx.name.trim();
    if (!name) { setStatus('Give it a name first.'); return; }
    onSave(ctx, { name, qty: ctx.qty });
  };

  return (
    <div className={'app-modal-backdrop item-modal-backdrop open ' + (ctx.kind === 'equip' ? 'mode-equip' : 'mode-item')} aria-hidden="false"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="app-modal panel" role="dialog" aria-modal="true">
        <div className="app-modal-head">
          <span className="app-modal-heading">{(editing ? 'Edit ' : 'Add ') + (ctx.kind === 'equip' ? 'Equipment' : 'Item')}</span>
          <span className="app-modal-date">{ctx.kind === 'equip'
            ? 'Effects apply while the item is equipped'
            : (editing && ctx.originKind === 'equip' ? 'Saving as a plain item drops its equipment effects' : '')}</span>
          <button className="app-modal-close" type="button" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <div className="app-modal-body">
          <div className="app-field">
            <span className="app-field-label">Type</span>
            <div className="item-kind-toggle">
              <button type="button" className={'item-kind-btn' + (ctx.kind === 'equip' ? ' active' : '')} onClick={() => setKind('equip')}>Equipment</button>
              <button type="button" className={'item-kind-btn' + (ctx.kind === 'item' ? ' active' : '')} onClick={() => setKind('item')}>Item</button>
            </div>
          </div>
          <label className="app-field">
            <span className="app-field-label">Name</span>
            <input type="text" placeholder="e.g. Longsword +1" value={ctx.name}
              onChange={(e) => setCtx((c) => ({ ...c, name: e.target.value }))}
              onKeyDown={(e) => { if (e.key === 'Enter') save(); }} />
          </label>

          {ctx.kind === 'item' && (
            <label className="app-field">
              <span className="app-field-label">Quantity</span>
              <input type="number" min="0" value={ctx.qty}
                onChange={(e) => setCtx((c) => ({ ...c, qty: parseInt(e.target.value) || 0 }))}
                onKeyDown={(e) => { if (e.key === 'Enter') save(); }} />
            </label>
          )}

          {ctx.kind === 'equip' && (
            <div className="item-modal-equip-only">
              <label className="equip-toggle">
                <input type="checkbox" checked={d.equipped !== false} onChange={(e) => setDraft((dr) => { dr.equipped = e.target.checked; })} />
                <span>Equipped</span>
              </label>
              <label className="app-field">
                <span className="app-field-label">Description</span>
                <textarea placeholder="What is it? What does it do?" value={d.description || ''} onChange={(e) => setDraft((dr) => { dr.description = e.target.value; })} />
              </label>
              <div className="eq-effects">
                <div className="eq-field-group">
                  <span className="eq-lbl">Attack</span>
                  <input className="eq-atk-bonus" placeholder="+6 hit" value={d.attack.bonus || ''} onChange={(e) => setDraft((dr) => { dr.attack.bonus = e.target.value; })} />
                  <input className="eq-atk-dmg" placeholder="1d8+4 slashing" value={d.attack.dmg || ''} onChange={(e) => setDraft((dr) => { dr.attack.dmg = e.target.value; })} />
                </div>
                <div className="eq-field-group">
                  <span className="eq-lbl">Armor</span>
                  <input placeholder="+2 (shield) or =16 (heavy armor)" style={{ width: 220 }} value={d.ac == null ? '' : d.ac} onChange={(e) => setDraft((dr) => { dr.ac = e.target.value; })} />
                </div>
                <div className="eq-field-group">
                  <span className="eq-lbl">Ability</span>
                  {abilities.map((a) => (
                    <label className="eq-ab" key={a.key}><span>{a.key.toUpperCase()}</span>
                      <input className="eq-abil" placeholder="—" value={d.abilities[a.key] || ''} onChange={(e) => setDraft((dr) => { dr.abilities[a.key] = e.target.value; })} /></label>
                  ))}
                </div>
                <div className="eq-field-group">
                  <span className="eq-lbl">Skills</span>
                  <div className="eq-skill-list">
                    {d.skills.map((s, si) => (
                      <span className="eq-chip" key={si}>{s.name} {fmt(Number(s.bonus) || 0)}
                        <span className="eq-skill-del" onClick={() => setDraft((dr) => { dr.skills.splice(si, 1); })}>✕</span></span>
                    ))}
                  </div>
                  <select value={skillPick} onChange={(e) => setSkillPick(e.target.value)}>
                    <option value="">skill…</option>
                    {skills.map((s) => <option key={s.name}>{s.name}</option>)}
                  </select>
                  <input type="number" placeholder="±" style={{ width: 56 }} value={skillBonus} onChange={(e) => setSkillBonus(e.target.value)} />
                  <button className="add-btn" type="button" onClick={addSkill}>Add</button>
                </div>
                <div className="eq-field-group">
                  <span className="eq-lbl">Spells</span>
                  <div className="eq-spell-list">
                    {d.spells.map((sp, si) => (
                      <span className="eq-chip" key={si}>{sp.name} <em>{sp.level == 0 ? 'C' : 'L' + sp.level}</em>
                        <span className="eq-spell-del" onClick={() => setDraft((dr) => { dr.spells.splice(si, 1); })}>✕</span></span>
                    ))}
                  </div>
                  <input placeholder="Granted spell" value={spellName} onChange={(e) => setSpellName(e.target.value)} />
                  <select style={{ width: 110 }} value={spellLvl} onChange={(e) => setSpellLvl(e.target.value)}>
                    {Array.from({ length: 10 }, (_, i) => <option key={i} value={i}>{i === 0 ? 'Cantrip' : 'Level ' + i}</option>)}
                  </select>
                  <button className="add-btn" type="button" onClick={addSpell}>Add</button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="app-modal-foot">
          <span className="app-modal-status">{status}</span>
          <button className="add-btn" type="button" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}
