import { useState } from 'react';
import { useCharacter } from '../../state/characterStore.jsx';
import { fmt } from '../../rules/core.js';
import { equipList } from '../../rules/equipment.js';
import { openNotesModal } from '../../notes-windows.js';
import ItemModal, { makeEquipCtx, makeItemCtx } from './ItemModal.jsx';

// Inventory & Equipment tab (ports buildEquipment / buildInventory / currency +
// the item modal). Equipment rows are compact (toggle + name + effect badges);
// clicking opens the modal. Inventory shows equipped gear (read-only, jumps
// here) plus plain items with quantities.

function equipSummaryBadges(it, abilities) {
  const b = [], atk = it.attack || {}, ab = it.abilities || {};
  const atkTxt = [atk.bonus, atk.dmg].map((s) => (s == null ? '' : String(s).trim())).filter(Boolean).join(' · ');
  if (atkTxt) b.push('⚔ ' + atkTxt);
  if (it.ac != null && String(it.ac).trim()) b.push('AC ' + String(it.ac).trim());
  abilities.forEach((a) => { const v = (ab[a.key] == null ? '' : String(ab[a.key]).trim()); if (v) b.push(a.key.toUpperCase() + ' ' + v); });
  (it.skills || []).forEach((s) => b.push(`${s.name} ${fmt(Number(s.bonus) || 0)}`));
  (it.spells || []).forEach((sp) => b.push('✦ ' + sp.name));
  return b;
}

export default function InventoryTab({ onGoToEquipment }) {
  const { character, data, update } = useCharacter();
  const [modalCtx, setModalCtx] = useState(null);

  const equipment = character.equipment || [];
  const inventory = character.inventory || [];
  const gear = equipment.filter((it) => it.name && it.name.trim());
  const items = inventory.filter((it) => it.name && it.name.trim());

  const equipLegend = () => openNotesModal({
    name: 'Equipment — How it works', badges: ['Reference'],
    detail: `<p>Gear you're wearing or wielding. Equipped items feed your attacks, spellcasting, ability scores, and skill bonuses on the other tabs. Ability fields accept <span class="hl">+2</span> (bonus) or <span class="hl">=19</span> (set score).</p>`
  });

  // Ports saveItemModal: commit the draft, moving between lists if kind changed.
  const saveModal = (ctx, { name, qty }) => {
    update((dc) => {
      const equip = (dc.equipment = dc.equipment || []);
      const inv = (dc.inventory = dc.inventory || []);
      if (ctx.kind === 'item') {
        const item = { name, qty: isNaN(qty) ? 1 : qty };
        if (ctx.originKind === 'item' && ctx.index != null) {
          Object.assign(inv[ctx.index], item);
        } else {
          if (ctx.originKind === 'equip' && ctx.index != null) equip.splice(ctx.index, 1);
          inv.push(item);
        }
      } else {
        const d = { ...ctx.draft, name };
        if (ctx.originKind === 'equip' && ctx.index != null) {
          equip[ctx.index] = d;
        } else {
          if (ctx.originKind === 'item' && ctx.index != null) inv.splice(ctx.index, 1);
          equip.push(d);
        }
      }
    });
    setModalCtx(null);
  };

  const toggleEquipped = (i) => update((dc) => { dc.equipment[i].equipped = !dc.equipment[i].equipped; });
  const delEquip = (i) => update((dc) => { dc.equipment.splice(i, 1); });
  const delItem = (i) => update((dc) => { dc.inventory.splice(i, 1); });
  const setQty = (i, v) => update((dc) => { dc.inventory[i].qty = parseInt(v) || 0; });
  const setCurrency = (k, v) => update((dc) => { dc.currency = dc.currency || {}; dc.currency[k] = parseInt(v) || 0; });

  return (
    <div className="tab-pane active">
      <div className="grid grid-two">
        <div className="panel">
          <h2><span>Equipment <button className="legend-btn equip-legend-btn" type="button" title="Gear you're wearing or wielding." onClick={(e) => { e.stopPropagation(); equipLegend(); }}>?</button></span><span className="rune">⚙</span></h2>
          <div>
            {equipment.length === 0
              ? <div className="action-empty">No equipment yet — add a weapon, armor, or magic item below.</div>
              : equipment.map((it, i) => {
                const named = it.name && it.name.trim();
                return (
                  <div key={i} className={'equip-row' + (it.equipped ? ' equipped' : '')}>
                    <label className="equip-toggle" title="Equipped / packed">
                      <input type="checkbox" checked={!!it.equipped} onChange={() => toggleEquipped(i)} />
                    </label>
                    <div className="eq-row-main" title="Click to edit" onClick={() => setModalCtx(makeEquipCtx(i, it))}>
                      <span className={'eq-row-name' + (named ? '' : ' unnamed')}>{named ? it.name : 'Unnamed item'}</span>
                      {equipSummaryBadges(it, data.abilities).map((t, j) => <span key={j} className="eq-badge">{t}</span>)}
                    </div>
                    <span className="row-del eq-del" onClick={() => delEquip(i)}>✕</span>
                  </div>
                );
              })}
          </div>
          <button className="add-btn" onClick={() => setModalCtx(makeEquipCtx(null))}>+ Add Equipment</button>
        </div>

        <div className="panel">
          <h2><span>Currency</span><span className="rune">◆</span></h2>
          <div className="currency">
            {['cp', 'sp', 'ep', 'gp', 'pp'].map((k) => (
              <div className="c" key={k}><label>{k.toUpperCase()}</label>
                <input type="number" value={(character.currency || {})[k] || 0} onChange={(e) => setCurrency(k, e.target.value)} /></div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel">
        <h2><span>Inventory</span><span className="rune">◆</span></h2>
        <div>
          {gear.length > 0 && (
            <>
              <div className="equip-atk-head">From equipment — managed on the Equipment tab</div>
              {gear.map((it, i) => (
                <div key={'g' + i} className="inv-row inv-gear" title="Edit on the Equipment tab" onClick={onGoToEquipment}>
                  <span className="item-name gear-name">{it.name}</span>
                  <span className={'action-badge' + (it.equipped ? '' : ' dim')}>{it.equipped ? 'Equipped' : 'Packed'}</span>
                </div>
              ))}
            </>
          )}
          {items.length === 0 && gear.length === 0 && <div className="action-empty">Nothing carried yet — add an item below.</div>}
          {inventory.map((item, i) => (item.name && item.name.trim()) ? (
            <div key={i} className="inv-row">
              <span className="item-name inv-edit" title="Click to edit" onClick={() => setModalCtx(makeItemCtx(i, item))}>{item.name}</span>
              <input className="item-qty" type="number" value={item.qty} onChange={(e) => setQty(i, e.target.value)} />
              <span className="row-del" onClick={() => delItem(i)}>✕</span>
            </div>
          ) : null)}
        </div>
        <button className="add-btn" onClick={() => setModalCtx(makeItemCtx(null))}>+ Add Item</button>
      </div>

      {modalCtx && (
        <ItemModal ctx={modalCtx} abilities={data.abilities} skills={data.skills}
          onSave={saveModal} onClose={() => setModalCtx(null)} />
      )}
    </div>
  );
}
