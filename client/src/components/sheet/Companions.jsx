import { useCharacter } from '../../state/characterStore.jsx';
import { mod, fmt } from '../../rules/core.js';
import { companionCtx, newManualCompanion } from '../../rules/companions.js';
import { companionStatsHtml } from '../../rules/notes-index.js';
import { openNotesModal } from '../../notes-windows.js';

// Companions panel (ports buildCompanions / companion picker / manual editor).
// Auto companions render their computed stat block from the template; manual
// ones expose editable fields. Stat blocks are recomputed on every render from
// the live companionCtx, so they rescale automatically as the character grows.

function ManualFields({ c, onField, onAbility, abilities }) {
  const area = (label, field, ph) => (
    <>
      <div className="equip-atk-head">{label}</div>
      <textarea className="comp-area" rows="2" placeholder={ph} value={c[field] || ''}
        onChange={(e) => onField(field, e.target.value)} />
    </>
  );
  return (
    <>
      <div className="comp-manual-grid">
        <div className="stat-box"><label>Type</label><input value={c.typeLine || ''} placeholder="Medium beast" onChange={(e) => onField('typeLine', e.target.value)} /></div>
        <div className="stat-box"><label>AC</label><input type="number" value={c.ac || 0} onChange={(e) => onField('ac', parseInt(e.target.value) || 0)} /></div>
        <div className="stat-box"><label>Max HP</label><input type="number" value={c.hpMax || 0} onChange={(e) => onField('hpMax', parseInt(e.target.value) || 0)} /></div>
        <div className="stat-box"><label>Speed</label><input value={c.speed || ''} onChange={(e) => onField('speed', e.target.value)} /></div>
      </div>
      <div className="comp-abilities">
        {abilities.map((a) => (
          <div className="comp-ab" key={a.key}><label>{a.key.toUpperCase()}</label>
            <input className="comp-ab-input" type="number" value={(c.abilities || {})[a.key] == null ? 10 : c.abilities[a.key]}
              onChange={(e) => onAbility(a.key, parseInt(e.target.value) || 0)} /></div>
        ))}
      </div>
      {area('Skills', 'skillsText', 'Perception +4, Stealth +6…')}
      {area('Features', 'featuresText', 'Keen Hearing — advantage on hearing checks…')}
      {area('Actions', 'actionsText', 'Bite: +5 to hit, 1d6+3 piercing…')}
      {area('Spells', 'spellsText', 'Spells it can cast, if any')}
    </>
  );
}

function CompanionCard({ c, index }) {
  const { character, data, update } = useCharacter();
  const tpl = c.templateId ? (data.companionTemplates || []).find((t) => t.id === c.templateId) : null;
  const stats = tpl ? tpl.build(companionCtx(character, data)) : null;

  const patch = (fn) => update((d) => { fn(d.companions[index]); });
  const setField = (field, value) => patch((co) => { co[field] = value; });
  const setAbility = (k, v) => patch((co) => { if (!co.abilities) co.abilities = {}; co.abilities[k] = v; });

  const remove = () => {
    if (!window.confirm(`Remove ${c.name || 'this companion'}?`)) return;
    update((d) => { d.companions.splice(index, 1); });
  };

  return (
    <div className={'companion-card' + (c.collapsed ? ' collapsed' : '')}>
      <div className="comp-head">
        <button className="comp-collapse" type="button" title={c.collapsed ? 'Expand' : 'Collapse'}
          onClick={() => setField('collapsed', !c.collapsed)}>{c.collapsed ? '▸' : '▾'}</button>
        <input className="comp-name" value={c.name || ''} placeholder="Companion name" onChange={(e) => setField('name', e.target.value)} />
        <span className="action-badge">{tpl ? (tpl.kind === 'spell' ? 'Spell' : 'Feature') : 'Manual'}</span>
        <span className="row-del comp-del" title="Remove companion" onClick={remove}>✕</span>
      </div>
      {tpl && <div className="comp-src">{tpl.source}</div>}
      <div className="stat-strip comp-hp-strip">
        {stats && <div className="stat-box"><label>Max HP</label><div className="computed comp-hpmax">{stats.hpMax}</div></div>}
        <div className="stat-box"><label>Current HP</label>
          <input type="number" value={c.hpCurrent == null ? (stats ? stats.hpMax : 10) : c.hpCurrent}
            onChange={(e) => setField('hpCurrent', parseInt(e.target.value) || 0)} /></div>
        <div className="stat-box"><label>Temp HP</label>
          <input type="number" value={c.hpTemp || 0} onChange={(e) => setField('hpTemp', parseInt(e.target.value) || 0)} /></div>
      </div>
      {!c.collapsed && (
        <div className="comp-body">
          {stats
            ? <div className="comp-stats" dangerouslySetInnerHTML={{ __html: companionStatsHtml(stats, data.abilities) }} />
            : <ManualFields c={c} onField={setField} onAbility={setAbility} abilities={data.abilities} />}
          <textarea className="comp-area comp-notes" rows="2" placeholder="Notes — tricks, current orders, damage taken…"
            value={c.notes || ''} onChange={(e) => setField('notes', e.target.value)} />
        </div>
      )}
    </div>
  );
}

export default function Companions() {
  const { character, data, update } = useCharacter();
  const companions = character.companions || [];

  const openPicker = () => {
    const ctx = companionCtx(character, data);
    const tmpls = data.companionTemplates || [];
    const avail = tmpls.filter((t) => { try { return t.match(ctx); } catch { return false; } });
    const row = (t) => `
      <div class="action-row comp-pick" data-tid="${t.id}" title="Add this companion">
        <span class="a-name">${t.name}</span>
        <span class="a-detail">${t.source}</span>
        <span class="action-badge">${t.kind === 'spell' ? 'Spell' : 'Feature'}</span>
      </div>`;
    const win = openNotesModal({
      name: 'Auto-generate a Companion',
      badges: ['Companions'],
      detail: `<p>Companions scale with your level, proficiency bonus, and spellcasting — their stat blocks update automatically as your character grows.</p>
        ${avail.length
          ? '<div class="equip-atk-head">From your features &amp; spells</div>' + avail.map(row).join('')
          : '<p class="nr-hint">No companion-granting feature or known spell detected on this character. Pick a qualifying subclass (e.g. Battle Smith) or learn a summoning spell — or add one manually.</p>'}`
    });
    if (win) win.el.querySelectorAll('.comp-pick').forEach((r) => r.addEventListener('click', () => {
      const tpl = tmpls.find((t) => t.id === r.dataset.tid);
      if (!tpl) return;
      const stats = tpl.build(companionCtx(character, data));
      update((d) => {
        d.companions = d.companions || [];
        d.companions.push({ uid: 'c' + Date.now() + Math.floor(Math.random() * 1000),
          templateId: tpl.id, name: tpl.name, hpCurrent: stats.hpMax, hpTemp: 0, notes: '', collapsed: false,
          resources: (stats.resources || []).map((r2) => ({ name: r2.name, total: r2.total, used: 0 })) });
      });
      win.refs.close.click();
    }));
  };

  const openLegend = () => openNotesModal({
    name: 'Companions — How it works', badges: ['Reference'],
    detail: `<p>Creatures that fight alongside you. <span class="hl">Auto-generate</span> scans your class features and known spells for anything that grants a scaling companion and builds its mini character sheet from your current level. It re-scales automatically when you level up.</p>
      <p class="nr-hint"><span class="hl">Manual</span> companions are free-form: fill in any creature's numbers yourself.</p>`
  });

  const addManual = () => update((d) => { d.companions = d.companions || []; d.companions.push(newManualCompanion()); });

  return (
    <div className="panel">
      <h2><span>Companions <button className="legend-btn companion-legend-btn" type="button" title="Creatures that fight alongside you" onClick={(e) => { e.stopPropagation(); openLegend(); }}>?</button></span><span className="rune">🐾</span></h2>
      <div>
        {companions.length === 0
          ? <div className="action-empty">No companions yet — auto-generate one from your features &amp; spells, or add one manually.</div>
          : companions.map((c, i) => <CompanionCard key={c.uid || i} c={c} index={i} />)}
      </div>
      <div className="companion-btn-row">
        <button className="add-btn" onClick={openPicker}>✦ Auto-generate from features &amp; spells</button>
        <button className="add-btn" onClick={addManual}>+ Add companion manually</button>
      </div>
    </div>
  );
}
