import { useState } from 'react';
import { useCharacter } from '../../state/characterStore.jsx';
import { levelLabel } from '../../rules/core.js';
import { isKnown, customSpellsForClass, refreshAutoSlots } from '../../rules/spellcasting.js';
import { pickedClasses } from '../../rules/classes.js';
import { equipmentGrantedSpells } from '../../rules/equipment.js';
import { spellInfo, spellRowMarkersHtml, spellLegendHtml, spellDetailEntry, spellClassNames } from '../../rules/spell-detail.js';
import { editLink } from '../../rules/notes-index.js';
import { DEFAULT_SPELL_TAGS } from '../../rules/import-forms.js';
import { openNotesModal } from '../../notes-windows.js';

// Spells tab (ports buildSpellSlots / buildSpellLibrary / buildKnownSpells +
// custom-spell add). Row markers & the legend come from the shared spell-detail
// helpers; clicking a spell opens the shared floating detail window.

function Markers({ customSpells, data, name }) {
  const html = spellRowMarkersHtml(customSpells, data, name);
  return html ? <span dangerouslySetInnerHTML={{ __html: html }} /> : null;
}
const Legend = () => <div dangerouslySetInnerHTML={{ __html: spellLegendHtml() }} />;

function SpellSlots() {
  const { character, data, update } = useCharacter();
  const auto = character.autoSlots;
  const openDetail = null;

  const toggleMode = () => update((d) => {
    d.autoSlots = !d.autoSlots;
    if (d.autoSlots) refreshAutoSlots(d, pickedClasses(d, data), data);
  });
  const setTotal = (idx, v) => update((d) => {
    d.spellSlots[idx].total = Math.max(0, parseInt(v) || 0);
    if (d.spellSlots[idx].used > d.spellSlots[idx].total) d.spellSlots[idx].used = d.spellSlots[idx].total;
  });
  const clickPip = (key, idx) => update((d) => {
    const slot = key === 'pact' ? d.pactSlots : d.spellSlots[key];
    slot.used = (idx < slot.used) ? idx : idx + 1;
  });

  const slotRow = (label, slot, key, extraClass) => (
    <div className={'slot-level ' + (extraClass || '')} key={key}>
      <div className="lv">{label}</div>
      {key === 'pact'
        ? <span className="total pact-total">{slot.total}</span>
        : <input className="total" type="number" min="0" max="9" value={slot.total} disabled={auto} onChange={(e) => setTotal(Number(key), e.target.value)} />}
      <div className="slot-pips">
        {Array.from({ length: slot.total }, (_, p) => (
          <span key={p} className={'slot-pip' + (p < slot.used ? ' filled' : '')} onClick={() => clickPip(key, p)} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="panel">
      <h2><span>Spell Slots</span><span className="rune">✶</span></h2>
      <div>
        <div className="slot-mode">
          <span className="slot-mode-label">{auto ? '⚙ Auto-filled from class levels' : '✎ Manual entry'}</span>
          <button className="pbtn slot-mode-btn" onClick={toggleMode}>{auto ? 'Switch to manual' : 'Switch to auto'}</button>
        </div>
        {character.spellSlots.map((slot, idx) => slotRow('Level ' + (idx + 1), slot, String(idx)))}
        {character.pactSlots && character.pactSlots.total > 0 && (
          <>
            {slotRow(`Pact · Lv ${character.pactSlots.level}`, character.pactSlots, 'pact', 'pact-row')}
            <div className="import-note">Pact slots cast at level {character.pactSlots.level} and recharge on a short rest.</div>
          </>
        )}
      </div>
    </div>
  );
}

function TagPicker({ tags, allTags, onChange }) {
  const options = allTags.filter((t) => !tags.includes(t));
  return (
    <div className="tag-picker inline">
      {tags.map((t, i) => <span className="picker-tag" key={t}>{t}<span className="tag-del" onClick={() => onChange(tags.filter((_, j) => j !== i))}>✕</span></span>)}
      <select className="tag-select" value="" onChange={(e) => { if (e.target.value) onChange([...tags, e.target.value]); }}>
        <option value="">+ tag…</option>
        {options.map((t) => <option key={t}>{t}</option>)}
      </select>
    </div>
  );
}

export default function SpellsTab() {
  const { character, data, customSpells, update } = useCharacter();
  const [search, setSearch] = useState('');
  const [customName, setCustomName] = useState('');
  const [customLevel, setCustomLevel] = useState('0');
  const [customTags, setCustomTags] = useState([]);

  const openDetail = (name, level) => openNotesModal(spellDetailEntry(customSpells, data, name, level, editLink));

  // ---- Spell Library ----
  const classNames = spellClassNames(customSpells, data);
  const setSpellClass = (v) => update((d) => { d.spellClass = v; });
  const query = search.toLowerCase();
  const customs = customSpellsForClass(customSpells, character.spellClass);
  const customLower = new Set(customs.map((s) => s.name.toLowerCase()));
  const builtins = (data.spellData[character.spellClass] || []).filter((s) => !customLower.has(s.name.toLowerCase()));
  const libList = [...builtins, ...customs].filter((s) => s.name.toLowerCase().includes(query));
  const libByLevel = {};
  libList.forEach((s) => { (libByLevel[s.level] = libByLevel[s.level] || []).push(s); });

  const addKnown = (name, level) => update((d) => {
    if (d.knownSpells.some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    const imp = customSpells[name];
    d.knownSpells.push({ name, level, custom: !!imp, tags: (imp && Array.isArray(imp.tags)) ? imp.tags : [] });
  });
  const removeKnown = (idx) => update((d) => { d.knownSpells.splice(idx, 1); });

  const addCustom = () => {
    const name = customName.trim();
    if (!name) return;
    const level = Math.max(0, Math.min(9, parseInt(customLevel, 10) || 0));
    update((d) => { d.knownSpells.push({ name, level, custom: true, tags: customTags }); });
    setCustomName(''); setCustomLevel('0'); setCustomTags([]);
  };

  // ---- Known Spells ----
  const granted = equipmentGrantedSpells(character);
  const knownByLevel = {};
  character.knownSpells.forEach((s, i) => { (knownByLevel[s.level] = knownByLevel[s.level] || []).push({ ...s, idx: i }); });

  const allTags = (() => {
    const t = new Set([...DEFAULT_SPELL_TAGS, ...customTags]);
    Object.values(customSpells).forEach((s) => (s.tags || []).forEach((x) => t.add(x)));
    character.knownSpells.forEach((s) => (Array.isArray(s.tags) ? s.tags : []).forEach((x) => t.add(x)));
    return [...t].sort((a, b) => a.localeCompare(b));
  })();

  const libLevels = Object.keys(libByLevel).map(Number).sort((a, b) => a - b);
  const knownLevels = Object.keys(knownByLevel).map(Number).sort((a, b) => a - b);

  return (
    <div className="tab-pane active">
      <div className="grid grid-spells">
        <SpellSlots />

        <div className="panel spell-list">
          <h2><span>Spell Library</span><span className="rune">✶</span></h2>
          <div className="spell-lib-controls">
            <select value={character.spellClass} onChange={(e) => setSpellClass(e.target.value)}>
              {classNames.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="text" placeholder="Search spells..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="spell-lib-list">
            {libList.length === 0 && <div className="spell-lib-empty">No spells match.</div>}
            {libLevels.map((lvl) => (
              <div key={lvl}>
                <div className="spell-lib-group-label">{levelLabel(lvl)}</div>
                {libByLevel[lvl].slice().sort((a, b) => a.name.localeCompare(b.name)).map((s) => {
                  const already = isKnown(character, s.name);
                  return (
                    <div className="spell-lib-item" key={s.name}>
                      <span className="spell-info" title="Click for full details" onClick={() => openDetail(s.name, lvl)}>
                        <span className="spell-name-link">{s.name}</span>
                        {s.imported && <span className="custom-tag">{s.spell.source || 'Imported'}</span>}
                        <Markers customSpells={customSpells} data={data} name={s.name} />
                      </span>
                      <span className={'spell-add-btn' + (already ? ' added' : '')} onClick={() => !already && addKnown(s.name, lvl)}>{already ? 'Added' : '+ Add'}</span>
                    </div>
                  );
                })}
              </div>
            ))}
            <Legend />
          </div>
          <div className="custom-spell-row">
            <input placeholder="Custom / homebrew spell name" value={customName} onChange={(e) => setCustomName(e.target.value)} />
            <select className="lv-select" value={customLevel} onChange={(e) => setCustomLevel(e.target.value)}>
              {Array.from({ length: 10 }, (_, i) => <option key={i} value={i}>{levelLabel(i)}</option>)}
            </select>
            <TagPicker tags={customTags} allTags={allTags} onChange={setCustomTags} />
            <button className="add-btn" onClick={addCustom}>+ Add</button>
          </div>
        </div>

        <div className="panel">
          <h2><span>Known Spells</span><span className="rune">✶</span></h2>
          <div>
            {character.knownSpells.length === 0 && granted.length === 0 && <div className="spell-lib-empty">No spells added yet — pick from the library above.</div>}
            {knownLevels.map((lvl) => (
              <div key={lvl}>
                <div className="known-spell-group-label">{levelLabel(lvl)}</div>
                {knownByLevel[lvl].map((s) => (
                  <div className="known-spell-item" key={s.idx}>
                    <span className="spell-summary spell-info" title="Click for full details" onClick={() => openDetail(s.name, s.level)}>
                      <span className="spell-name-link">{s.name}</span>
                      {s.custom && <span className="custom-tag">Homebrew</span>}
                      <Markers customSpells={customSpells} data={data} name={s.name} />
                      {Array.isArray(s.tags) && s.tags.length > 0 && <span className="spell-tags">{s.tags.map((tag, k) => <span key={k} className="spell-tag">{tag}</span>)}</span>}
                    </span>
                    <span className="spell-remove" onClick={() => removeKnown(s.idx)}>✕</span>
                  </div>
                ))}
              </div>
            ))}
            {granted.length > 0 && (
              <>
                <div className="known-spell-group-label">From Equipment</div>
                {granted.slice().sort((a, b) => a.level - b.level || a.name.localeCompare(b.name)).map((s, k) => (
                  <div className="known-spell-item" key={k}>
                    <span className="spell-info" title="Click for full details" onClick={() => openDetail(s.name, s.level)}>
                      <span className="spell-name-link">{s.name}</span> <span className="custom-tag">{levelLabel(s.level)} · {s.from}</span>
                      <Markers customSpells={customSpells} data={data} name={s.name} />
                    </span>
                  </div>
                ))}
              </>
            )}
            {(character.knownSpells.length > 0 || granted.length > 0) && <Legend />}
          </div>
        </div>
      </div>
    </div>
  );
}
