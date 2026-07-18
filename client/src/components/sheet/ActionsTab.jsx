import { useCharacter } from '../../state/characterStore.jsx';
import { esc, levelLabel } from '../../rules/core.js';
import { slotsRemainingAtOrAbove } from '../../rules/spellcasting.js';
import { pickedClasses } from '../../rules/classes.js';
import { equipmentAttacks, equipmentGrantedSpells, equipList } from '../../rules/equipment.js';
import { companionCtx } from '../../rules/companions.js';
import { spellRowMarkersHtml, spellDetailEntry, spellLegendHtml, isReactionSpell } from '../../rules/spell-detail.js';
import { editLink } from '../../rules/notes-index.js';
import { openNotesModal } from '../../notes-windows.js';

// Actions tab (ports buildActions / buildActionResources / the resource modal).
// Everything except the editable attack table and the freeform resource pools
// is derived from the character's spells, features, gear, and companions.

const subKey = (parent, name) => parent + '::' + name;

function Markers({ customSpells, data, name }) {
  const html = spellRowMarkersHtml(customSpells, data, name);
  return html ? <span dangerouslySetInnerHTML={{ __html: html }} /> : null;
}

function AttacksAndSpells() {
  const { character, data, customSpells, update } = useCharacter();
  const openDetail = (name, level) => openNotesModal(spellDetailEntry(customSpells, data, name, level, editLink));

  const setAtk = (i, field, v) => update((d) => { d.attacks[i][field] = v; });
  const addAtk = () => update((d) => { d.attacks.push({ name: '', bonus: '', dmg: '' }); });
  const delAtk = (i) => update((d) => { d.attacks.splice(i, 1); if (d.attacks.length === 0) d.attacks.push({ name: '', bonus: '', dmg: '' }); });

  const gearAtks = equipmentAttacks(character);
  const combined = [...character.knownSpells.map((s) => ({ name: s.name, level: s.level, tags: s.tags, from: null })), ...equipmentGrantedSpells(character)];
  const actionSpells = combined.filter((s) => !isReactionSpell(customSpells, data, s)).sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  return (
    <div className="panel">
      <h2><span>Attacks &amp; Spells</span><span className="rune">⚔</span></h2>
      <table className="attacks">
        <thead><tr><th style={{ width: '34%' }}>Name</th><th style={{ width: '16%' }}>Bonus</th><th style={{ width: '34%' }}>Damage / Type</th><th></th></tr></thead>
        <tbody>
          {character.attacks.map((a, i) => (
            <tr key={i}>
              <td><input value={a.name} placeholder="Longsword" onChange={(e) => setAtk(i, 'name', e.target.value)} /></td>
              <td><input className="narrow" value={a.bonus} placeholder="+5" onChange={(e) => setAtk(i, 'bonus', e.target.value)} /></td>
              <td><input value={a.dmg} placeholder="1d8+3 slashing" onChange={(e) => setAtk(i, 'dmg', e.target.value)} /></td>
              <td><span className="row-del" onClick={() => delAtk(i)}>✕</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-btn" onClick={addAtk}>+ Add Attack</button>
      {gearAtks.length > 0 && (
        <div>
          <div className="equip-atk-head">From equipped gear</div>
          {gearAtks.map((a, i) => (
            <div className="equip-atk-row" key={i}><span>{a.name}</span><span>{a.bonus ? a.bonus + ' hit' : ''}{a.bonus && a.dmg ? ' · ' : ''}{a.dmg || ''}</span></div>
          ))}
        </div>
      )}
      <div className="equip-atk-head">Spells</div>
      <div>
        {actionSpells.length === 0
          ? <div className="action-empty">No known spells — add some on the Spells tab or equip an item that grants spells.</div>
          : <>
            {actionSpells.map((s, i) => {
              const remaining = s.level > 0 && !s.from ? slotsRemainingAtOrAbove(character, s.level) : 0;
              const detail = s.from ? (s.level === 0 ? 'Cantrip' : levelLabel(s.level))
                : s.level === 0 ? 'Cantrip'
                  : levelLabel(s.level) + (remaining > 0 ? ` — ${remaining} slot${remaining === 1 ? '' : 's'} usable` : '');
              const badge = s.from ? 'Item' : s.level === 0 ? 'At will' : remaining > 0 ? 'Castable' : 'No slots';
              const dim = !s.from && s.level > 0 && remaining === 0;
              return (
                <div className="action-row spell-info" key={i} title="Click for full details" onClick={() => openDetail(s.name, s.level)}>
                  <span className="a-name spell-name-link">{s.name}{s.from && <> <span className="chip-abbr">{s.from}</span></>}<Markers customSpells={customSpells} data={data} name={s.name} /></span>
                  <span className="a-detail">{detail}</span>
                  <span className={'action-badge' + (dim ? ' dim' : '')}>{badge}</span>
                </div>
              );
            })}
            <div dangerouslySetInnerHTML={{ __html: spellLegendHtml() }} />
          </>}
      </div>
    </div>
  );
}

// Derive reaction rows (spells + abilities + companion reactions) and class
// abilities and companion actions in one pass, matching buildActions.
function useDerivedActions() {
  const { character, data, customSpells } = useCharacter();
  const picked = pickedClasses(character, data);
  const reactions = [];

  // Reaction spells.
  const combined = [...character.knownSpells.map((s) => ({ name: s.name, level: s.level, tags: s.tags, from: null })), ...equipmentGrantedSpells(character)];
  combined.filter((s) => isReactionSpell(customSpells, data, s)).forEach((s) => reactions.push({
    name: s.name, level: s.level, detail: s.level === 0 ? 'Cantrip' : levelLabel(s.level), badge: s.from ? 'Item spell' : 'Spell', kind: 'spell'
  }));

  // Class/subclass abilities with a non-passive use.
  const abilities = picked.flatMap((entry) => {
    const lvl = entry.level || 1;
    const fromClass = (data.classData[entry.name].features || []).filter((f) => f.lv <= lvl && f.use && f.use !== 'passive').map((f) => ({ ...f, cls: entry.name }));
    const sc = entry.subclass && data.subclassData[subKey(entry.name, entry.subclass)];
    const fromSub = ((sc && sc.features) || []).filter((f) => f.lv <= lvl && f.use && f.use !== 'passive').map((f) => ({ ...f, cls: entry.subclass }));
    return [...fromClass, ...fromSub];
  });
  const showCls = (f) => picked.length > 1 || (picked[0] && f.cls !== picked[0].name);
  abilities.filter((f) => f.use === 'reaction').forEach((f) => reactions.push({ name: f.name, cls: showCls(f) ? f.cls : null, detail: f.desc || '', badge: f.cost || 'Reaction', kind: 'ability' }));
  const actionAbilities = abilities.filter((f) => f.use !== 'reaction');

  // Companion actions & features. Each companion's reactions are lifted into
  // the shared reaction list; its actions and features get their own sections
  // (a section only appears when the companion has rows of that kind).
  const ctx = companionCtx(character, data);
  const parseLines = (text) => (text || '').split('\n').map((s) => s.trim()).filter(Boolean).map((line) => {
    const m = line.match(/^(.{1,40}?)(?:\s*[:.]\s*|\s+[—–-]\s+)(.*)$/); // "Bite: …" or "Keen Hearing — …"
    return { name: m ? m[1] : line, desc: m ? m[2] : '' };
  });
  const companionSections = [];
  const companionFeatureSections = [];
  (character.companions || []).forEach((c) => {
    const tpl = c.templateId ? (data.companionTemplates || []).find((t) => t.id === c.templateId) : null;
    let actionRows, featureRows;
    if (tpl) {
      const stats = tpl.build(ctx);
      actionRows = (stats.actions || []).map((a) => ({ name: a.name, desc: a.desc, badge: 'Action' }));
      featureRows = (stats.features || []).map((f) => ({ name: f.name, desc: f.desc }));
      (stats.reactions || []).forEach((a) => reactions.push({ name: a.name, cls: c.name || 'Companion', detail: a.desc || '', badge: 'Reaction', kind: 'companion' }));
    } else {
      actionRows = parseLines(c.actionsText).map((r) => ({ ...r, badge: 'Action' }));
      featureRows = parseLines(c.featuresText);
    }
    const name = c.name || 'Companion';
    if (actionRows.length) companionSections.push({ name, rows: actionRows });
    if (featureRows.length) companionFeatureSections.push({ name, rows: featureRows });
  });

  reactions.sort((a, b) => a.name.localeCompare(b.name));
  return { reactions, actionAbilities, showCls, companionSections, companionFeatureSections };
}

function ResourcePoints() {
  const { character, data, update } = useCharacter();
  const companions = character.companions || [];

  const ownerList = (draft, key) => key === 'char'
    ? (draft.actionResources = draft.actionResources || [])
    : ((draft.companions[Number(key)] || {}).resources = (draft.companions[Number(key)] || {}).resources || []);

  const spellSlotRows = [];
  (character.spellSlots || []).forEach((s, i) => { if (s && s.total > 0) spellSlotRows.push({ key: String(i), label: 'Level ' + (i + 1) + ' Slots', total: s.total, used: s.used }); });
  if (character.pactSlots && character.pactSlots.total > 0) spellSlotRows.push({ key: 'pact', label: 'Pact Slots · Lv ' + character.pactSlots.level, total: character.pactSlots.total, used: character.pactSlots.used });

  const spendSlot = (key, p) => update((d) => { const slot = key === 'pact' ? d.pactSlots : d.spellSlots[key]; slot.used = (p < slot.used) ? p : p + 1; });
  const spendPip = (owner, i, p) => update((d) => { const r = ownerList(d, owner)[i]; r.used = (p < r.used) ? p : p + 1; });
  const step = (owner, i, delta) => update((d) => { const r = ownerList(d, owner)[i]; r.used = Math.max(0, Math.min(r.total, r.used + delta)); });
  const delRow = (owner, i) => update((d) => { ownerList(d, owner).splice(i, 1); });

  const Meter = ({ total, used, owner, i }) => {
    if (total <= 10) {
      return <div className="res-pips">{total === 0 ? <span className="res-none">— no points —</span>
        : Array.from({ length: total }, (_, p) => <span key={p} className={'res-pip' + (p < used ? ' filled' : '')} onClick={() => spendPip(owner, i, p)} />)}</div>;
    }
    return (
      <div className="res-counter">
        <button className="res-step" title="Spend a point" onClick={() => step(owner, i, 1)}>−</button>
        <span className="res-count-num">{total - used}/{total}</span>
        <button className="res-step" title="Restore a point" onClick={() => step(owner, i, -1)}>+</button>
      </div>
    );
  };

  const openModal = (edit) => {
    const owners = [{ key: 'char', label: 'Character' }].concat(companions.map((c, ci) => ({ key: String(ci), label: c.name || ('Companion ' + (ci + 1)) })));
    const cur = edit ? (edit.owner === 'char' ? character.actionResources : (companions[Number(edit.owner)] || {}).resources || [])[edit.index] : null;
    if (edit && !cur) return;
    const win = openNotesModal({
      name: cur ? 'Edit Resource' : 'Add Resource', badges: ['Resource Points'],
      detail: `<div class="res-form">
        <label>Name</label><input id="resFormName" placeholder="Ki, Sorcery Points, Repair…" value="${esc(cur ? cur.name : '')}">
        <label>Max points</label><input id="resFormMax" type="number" min="1" max="99" value="${cur ? cur.total : 3}">
        ${owners.length > 1 ? `<label>Belongs to</label><select id="resFormOwner">${owners.map((o) => `<option value="${o.key}" ${(edit ? edit.owner : 'char') === o.key ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select>` : ''}
        <p class="nr-hint">Pools of more than <span class="hl">10</span> points show as a counter with − / + instead of pips.</p>
        <button class="add-btn" id="resFormSave">${cur ? 'Save changes' : 'Add resource'}</button>
      </div>`
    });
    if (!win) return;
    const nameEl = win.el.querySelector('#resFormName');
    const maxEl = win.el.querySelector('#resFormMax');
    nameEl.focus();
    const submit = () => {
      const name = nameEl.value.trim();
      if (!name) { nameEl.focus(); return; }
      const total = Math.max(1, Math.min(99, parseInt(maxEl.value, 10) || 1));
      const ownerKey = (win.el.querySelector('#resFormOwner') || {}).value || 'char';
      update((d) => {
        if (cur && edit) {
          const src = ownerList(d, edit.owner);
          const r = src[edit.index];
          r.name = name; r.total = total; r.used = Math.min(r.used, total);
          if (ownerKey !== edit.owner) { src.splice(edit.index, 1); ownerList(d, ownerKey).push(r); }
        } else {
          ownerList(d, ownerKey).push({ name, total, used: 0 });
        }
      });
      win.refs.close.click();
    };
    win.el.querySelector('#resFormSave').addEventListener('click', submit);
    [nameEl, maxEl].forEach((inp) => inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); }));
  };

  const groups = [];
  if (spellSlotRows.length) groups.push({ label: 'Spell Slots', auto: spellSlotRows });
  if ((character.actionResources || []).length) groups.push({ label: 'Character', owner: 'char', rows: character.actionResources });
  companions.forEach((c, ci) => { if ((c.resources || []).length) groups.push({ label: c.name || ('Companion ' + (ci + 1)), owner: String(ci), rows: c.resources }); });

  return (
    <div className="panel">
      <h2><span>Resource Points</span><span className="rune">◈</span></h2>
      <table className="res-table">
        <thead><tr><th>Name</th><th>Points used</th></tr></thead>
        <tbody>
          {groups.length === 0 && <tr><td colSpan="2" className="res-empty">No trackers yet — spell slots appear here automatically once you have them; add other pools (Ki, Sorcery Points…) with the button below.</td></tr>}
          {groups.map((g, gi) => (
            <>
              <tr className="res-group-row" key={'g' + gi}><td colSpan="2"><span className="res-group-label">{g.label}</span></td></tr>
              {g.auto && g.auto.map((r) => (
                <tr className="res-row res-row-auto" key={r.key}>
                  <td><span className="res-auto-name">{r.label}</span><span className="res-auto-tag" title="Auto from your spell slots — set totals on the Spells tab">auto</span></td>
                  <td><div className="res-pip-cell"><div className="res-pips">{Array.from({ length: r.total }, (_, p) => <span key={p} className={'res-slot-pip' + (p < r.used ? ' filled' : '')} onClick={() => spendSlot(r.key, p)} />)}</div><div className="res-controls"><span className="res-count">{r.total - r.used} left</span></div></div></td>
                </tr>
              ))}
              {g.rows && g.rows.map((r, ri) => (
                <tr className="res-row" key={g.owner + ri}>
                  <td><span className="res-auto-name">{r.name || '—'}</span></td>
                  <td><div className="res-pip-cell"><Meter total={r.total} used={r.used} owner={g.owner} i={ri} />
                    <div className="res-controls">
                      <button className="res-adj res-edit" title="Edit name & max" onClick={() => openModal({ owner: g.owner, index: ri })}>✎</button>
                      <span className="row-del res-del" title="Delete row" onClick={() => delRow(g.owner, ri)}>✕</span>
                    </div></div></td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
      <button className="add-btn" onClick={() => openModal(null)}>+ Add Resource</button>
    </div>
  );
}

export default function ActionsTab() {
  const { character, data, customSpells } = useCharacter();
  const { reactions, actionAbilities, showCls, companionSections, companionFeatureSections } = useDerivedActions();
  const openDetail = (name, level) => openNotesModal(spellDetailEntry(customSpells, data, name, level, editLink));

  const isUsableName = (n) => n && data.usableItemWords.some((w) => n.toLowerCase().includes(w));
  const usable = [
    ...character.inventory.filter((i) => i.qty > 0 && isUsableName(i.name)),
    ...equipList(character).filter((it) => isUsableName(it.name)).map((it) => ({ name: it.name, qty: 1 }))
  ];

  return (
    <div className="tab-pane active">
      <div className="grid grid-half">
        <div>
          <AttacksAndSpells />
          <div className="panel">
            <h2><span>Reactions</span><span className="rune">⟲</span></h2>
            <div>
              {reactions.length === 0
                ? <div className="action-empty">No reactions — reaction spells (e.g. Shield, Counterspell), reaction class abilities, and companion reactions appear here.</div>
                : reactions.map((r, i) => (
                  <div key={i} className={'action-row' + (r.kind === 'spell' ? ' spell-info' : '')} title={r.kind === 'spell' ? 'Click for full details' : undefined}
                    onClick={r.kind === 'spell' ? () => openDetail(r.name, r.level) : undefined}>
                    <span className={'a-name' + (r.kind === 'spell' ? ' spell-name-link' : '')}>{r.name}{r.cls && <> <span className="chip-abbr">{r.cls}</span></>}{r.kind === 'spell' && <Markers customSpells={customSpells} data={data} name={r.name} />}</span>
                    <span className="a-detail">{r.detail || ''}</span>
                    <span className="action-badge">{r.badge}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div>
          <ResourcePoints />
          <div className="panel">
            <h2><span>Standard Actions</span><span className="rune">⚔</span></h2>
            <div>{data.standardActions.map((a, i) => (
              <div className="action-row" key={i}><span className="a-name">{a.name}</span><span className="a-detail">{a.desc}</span></div>
            ))}</div>
          </div>
          <div className="panel">
            <h2><span>Usable Items</span><span className="rune">◆</span></h2>
            <div>{usable.length
              ? usable.map((i, k) => <div className="action-row" key={k}><span className="a-name">{i.name}</span><span className="a-detail">×{i.qty}</span><span className="action-badge">Use item</span></div>)
              : <div className="action-empty">No usable items in your inventory (potions, scrolls, kits…).</div>}</div>
          </div>
        </div>
      </div>

      {companionSections.length > 0 && (
        <div className="panel">
          <h2><span>Companion Actions</span><span className="rune">🐾</span></h2>
          <div>
            {companionSections.map((sec, si) => (
              <div key={si}>
                <div className="equip-atk-head">{sec.name}</div>
                {sec.rows.map((a, ri) => (
                  <div className="action-row" key={ri}><span className="a-name">{a.name}</span><span className="a-detail">{a.desc || ''}</span><span className="action-badge">{a.badge}</span></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {companionFeatureSections.length > 0 && (
        <div className="panel">
          <h2><span>Companion Features</span><span className="rune">🐾</span></h2>
          <div>
            {companionFeatureSections.map((sec, si) => (
              <div key={si}>
                <div className="equip-atk-head">{sec.name}</div>
                {sec.rows.map((f, ri) => (
                  <div className="action-row" key={ri}><span className="a-name">{f.name}</span><span className="a-detail">{f.desc || ''}</span></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="panel class-ability-panel">
        <h2><span>Class Abilities</span><span className="rune">✦</span></h2>
        <div className="class-ability-grid">
          {actionAbilities.length === 0
            ? <div className="action-empty">No class ability data — pick a class with a detailed feature reference (e.g. Jaeger) in Settings.</div>
            : actionAbilities.map((f, i) => (
              <div className="class-ability-card" key={i}>
                <div className="ca-head">
                  <span className="ca-name">{f.name}{showCls(f) && <> <span className="chip-abbr">{f.cls}</span></>}</span>
                  <span className="action-badge">{f.use}{f.cost ? ' · ' + f.cost : ''}</span>
                </div>
                <div className="ca-desc">{f.desc || '—'}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
