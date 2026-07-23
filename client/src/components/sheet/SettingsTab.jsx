import { useState } from 'react';
import { useCharacter } from '../../state/characterStore.jsx';
import { esc } from '../../rules/core.js';
import { profBonus } from '../../rules/core.js';
import { pickedClasses, applyClassesToState, choiceFeaturesFor, chosenFeatureOption, normalizeChoice } from '../../rules/classes.js';
import { multiclassCasterLevel } from '../../rules/spellcasting.js';
import { grantedSkillSources } from '../../rules/abilities.js';
import { availableLanguagePool, characterLanguages } from '../../rules/languages.js';
import { subclassNamesForClass, subspeciesNamesForSpecies } from '../../state/registry.js';
import { classInfoCardHtml } from './ClassInfoCard.jsx';
import ChoiceControl, { ChoiceModal } from './ChoiceControl.jsx';
import { openNotesModal } from '../../notes-windows.js';

const subKey = (parent, name) => parent + '::' + name;

// Info box (species/background reference) rendered from an HTML string.
function InfoBox({ html }) { return <div className="class-info" dangerouslySetInnerHTML={{ __html: html }} />; }

// Languages management: species-granted languages show as locked chips; the
// player adds any number more from a pool of 5E/5.5E species languages (or a
// custom "Other" entry) and removes their own at will — no duplicates.
function LanguagesPanel() {
  const { character, data, update } = useCharacter();
  const [customMode, setCustomMode] = useState(false);
  const [custom, setCustom] = useState('');

  const { granted, added } = characterLanguages(character, data);
  const knownKeys = new Set([...granted, ...added].map((l) => l.toLowerCase()));
  const options = availableLanguagePool(data).filter((l) => !knownKeys.has(l.toLowerCase()));

  const addLanguage = (lang) => {
    const name = (lang || '').trim();
    if (!name || knownKeys.has(name.toLowerCase())) return;
    update((d) => { d.languages = d.languages || []; d.languages.push(name); });
  };
  const removeLanguage = (lang) => update((d) => { d.languages = (d.languages || []).filter((l) => l !== lang); });

  const onSelect = (v) => {
    if (v === '__other__') { setCustomMode(true); return; }
    if (v) addLanguage(v);
  };
  const commitCustom = () => { addLanguage(custom); setCustom(''); setCustomMode(false); };

  return (
    <div className="panel">
      <h2><span>Languages</span><span className="rune">◈</span></h2>
      <div className="picker-hint">Your <span className="hl">species languages</span> are granted automatically (locked). Add any others below and remove your own at will — no duplicates.</div>
      <div className="lang-chips">
        {granted.map((l) => <span key={'g' + l} className="lang-chip granted" title="Granted by your species">{l}<span className="chip-grant">species</span></span>)}
        {added.map((l) => <span key={'a' + l} className="lang-chip">{l}<span className="row-del lang-del" title="Remove language" onClick={() => removeLanguage(l)}>✕</span></span>)}
        {granted.length + added.length === 0 && <span className="picker-hint">None yet.</span>}
      </div>
      {customMode ? (
        <div className="lang-add-row">
          <input autoFocus value={custom} placeholder="Custom language" onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') commitCustom(); if (e.key === 'Escape') { setCustomMode(false); setCustom(''); } }} />
          <button className="add-btn" type="button" onClick={commitCustom}>Add</button>
          <button className="rest-btn" type="button" onClick={() => { setCustomMode(false); setCustom(''); }}>Cancel</button>
        </div>
      ) : (
        <div className="lang-add-row">
          <select value="" onChange={(e) => { onSelect(e.target.value); e.target.value = ''; }}>
            <option value="">+ Add a language…</option>
            {options.map((l) => <option key={l} value={l}>{l}</option>)}
            <option value="__other__">Other (custom)…</option>
          </select>
        </div>
      )}
    </div>
  );
}

export default function SettingsTab() {
  const { character, data, derived, update, exportCharacter, deleteCharacter, viewOnly } = useCharacter();
  const [classFilter, setClassFilter] = useState('all');
  const [modal, setModal] = useState(null); // choice modal { label, key, entryIndex }

  const picked = pickedClasses(character, data);
  const level = derived?.applied?.level || character.level || 1;

  // Apply class-derived fields after any class/level/subclass edit so the
  // persisted character stays consistent (ports afterClassChange).
  const withClasses = (mutate) => update((d) => { mutate(d); applyClassesToState(d, data); });

  // ---- Identity handlers ----
  const setName = (v) => update((d) => { d.name = v; });
  const setXp = (v) => update((d) => { d.xp = parseInt(v) || 0; });
  const setShowXp = (v) => update((d) => { d.showXp = v; });
  const showXp = character.showXp !== false;
  const setAlignment = (v) => update((d) => { d.alignment = v; });

  const setRace = (v) => update((d) => {
    d.race = v;
    d.subrace = '';
    const sd = data.speciesData[v];
    if (sd && sd.speed) d.speed = sd.speed;
  });
  const setSubrace = (v) => update((d) => { d.subrace = v; });
  const setBackground = (v) => update((d) => { d.background = v; });

  // ---- Class row handlers ----
  const classNamesForFilter = (alwaysInclude) => Object.keys(data.classData).filter((n) =>
    classFilter === 'all' || data.classData[n].source === classFilter || n === alwaysInclude);

  const setClassName = (i, name) => withClasses((d) => { d.classes[i].name = name; d.classes[i].subclass = ''; });
  const setClassLevel = (i, v) => withClasses((d) => { d.classes[i].level = Math.max(1, Math.min(20, parseInt(v) || 1)); });
  const setSubclass = (i, v) => withClasses((d) => { d.classes[i].subclass = v; });
  const delClass = (i) => withClasses((d) => { d.classes.splice(i, 1); });
  const addClass = () => withClasses((d) => { d.classes = d.classes || []; d.classes.push({ name: '', level: 1 }); });

  // ---- Skill picker ----
  const toggleSkill = (i, granted) => {
    if (granted.length) return; // granted skills are locked on
    update((d) => { d.skillProf['sk' + i] = !d.skillProf['sk' + i]; });
  };
  const skillLegend = () => openNotesModal({
    name: 'Skill Proficiencies — Legend', badges: ['Reference'],
    detail: '<p>Solid chips are granted by your species/background (locked). Dashed chips are your class\'s pick list. Click any other chip to toggle a proficiency from a feat or DM ruling.</p>'
  });

  // ---- Choice modal (shared with Features) ----
  const onOpenModal = (label, key, entryIndex) => setModal({ label, key, entryIndex });
  const modalCurrent = modal ? normalizeChoice((character.classes[modal.entryIndex]?.featureChoices || {})[modal.key]) : null;
  const saveChoiceModal = (name, desc) => {
    update((d) => { const e = d.classes[modal.entryIndex]; e.featureChoices = e.featureChoices || {}; e.featureChoices[modal.key] = { custom: true, name, desc }; });
    setModal(null);
  };
  const clearChoiceModal = () => {
    update((d) => { const e = d.classes[modal.entryIndex]; if (e.featureChoices) { delete e.featureChoices[modal.key]; if (!Object.keys(e.featureChoices).length) delete e.featureChoices; } });
    setModal(null);
  };

  // ---- Manage character (export / delete) ----
  // Download the current character as JSON (round-trips through Import).
  const onExport = () => {
    const d = exportCharacter();
    const safe = (d.name || 'character').replace(/[^\w.-]+/g, '_').slice(0, 60) || 'character';
    const url = URL.createObjectURL(new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' }));
    const a = document.createElement('a');
    a.href = url; a.download = safe + '.json';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  // ---- Reference HTML ----
  const speciesInfo = (() => {
    const sd = data.speciesData[character.race];
    if (!sd) return character.race ? '<div class="ci-desc">// custom species — add it on the Library tab to attach traits, size & speed</div>' : '<div class="ci-desc">// no species selected</div>';
    const ss = character.subrace ? data.subspeciesData[subKey(character.race, character.subrace)] : null;
    const st = (src) => `<span class="src-tag src-${src === '5E' ? '5e' : src === '5E (legacy)' ? '5eleg' : src === '5.5E' ? '55e' : 'homebrew'}">${src}</span>`;
    return `<div class="ci-title">${esc(character.race)}${st(sd.source)}</div>
      <div class="ci-row"><span class="ci-key">size</span><span>${sd.size || '—'}</span></div>
      <div class="ci-row"><span class="ci-key">speed</span><span>${sd.speed || 0} ft${sd.darkvision ? ` · darkvision ${sd.darkvision} ft` : ''}</span></div>
      ${sd.asi ? `<div class="ci-row"><span class="ci-key">asi</span><span>${sd.asi}</span></div>` : ''}
      ${sd.languages ? `<div class="ci-row"><span class="ci-key">languages</span><span>${sd.languages}</span></div>` : ''}
      ${character.subrace ? `<div class="ci-row"><span class="ci-key">subrace</span><span>${esc(character.subrace)}${ss && ss.asi ? ` · ${esc(ss.asi)}` : ''}</span></div>` : ''}
      ${sd.desc ? `<div class="ci-desc">${sd.desc}</div>` : ''}${ss && ss.desc ? `<div class="ci-desc">${ss.desc}</div>` : ''}`;
  })();

  const backgroundInfo = (() => {
    const bd = data.backgroundData[character.background];
    if (!bd) return character.background ? '<div class="ci-desc">// custom background — import it on the Import page to attach skills & a feature</div>' : '<div class="ci-desc">// no background selected</div>';
    const st = (src) => `<span class="src-tag src-${src === '5E' ? '5e' : src === '5.5E' ? '55e' : 'homebrew'}">${src}</span>`;
    return `<div class="ci-title">${esc(character.background)}${st(bd.source)}</div>
      ${bd.skills && bd.skills.length ? `<div class="ci-row"><span class="ci-key">skills</span><span>${bd.skills.join(', ')} (granted)</span></div>` : ''}
      ${bd.feature ? `<div class="ci-row"><span class="ci-key">feature</span><span>${esc(bd.feature.name)}</span></div>` : ''}
      ${bd.desc ? `<div class="ci-desc">${bd.desc}</div>` : ''}`;
  })();

  const subraceNames = subspeciesNamesForSpecies(data, character.race);
  const speciesNames = Object.keys(data.speciesData).sort();
  const bgNames = Object.keys(data.backgroundData).sort();

  // Class info stack (multiclass summary + per-class cards).
  const stackHtml = (() => {
    if (!picked.length) return '<div class="class-info"><div class="ci-desc">// no class selected — saves & skills fall back to raw ability modifiers</div></div>';
    let summary = '';
    if (picked.length > 1) {
      const casterLvl = multiclassCasterLevel(picked, data);
      const hasWarlock = picked.some((c) => c.name === 'Warlock');
      summary = `<div class="class-info">
        <div class="ci-title">Multiclass — Lv ${level}</div>
        <div class="ci-row"><span class="ci-key">prof_bonus</span><span>+${profBonus(level)} (from total level ${level})</span></div>
        <div class="ci-row"><span class="ci-key">save_prof</span><span>from primary class only (${esc(picked[0].name)})</span></div>
        ${casterLvl > 0 ? `<div class="ci-row"><span class="ci-key">mc_caster</span><span>combined caster level ${casterLvl}${hasWarlock ? '; Warlock pact slots stack separately' : ''}</span></div>` : ''}
      </div>`;
    }
    return summary + picked.map((entry) => classInfoCardHtml(entry, picked.length > 1, data, character.abilities)).join('');
  })();

  return (
    <div className="tab-pane active">
      <div className="grid grid-half">
        <div>
          <div className="panel">
            <h2><span>Identity</span><span className="rune">◈</span></h2>
            <div className="set-field"><label>Character Name</label><input placeholder="Character Name" value={character.name || ''} onChange={(e) => setName(e.target.value)} /></div>
            <div className="set-field"><label>Species / Lineage</label>
              <select value={data.speciesData[character.race] ? character.race : (character.race || '')} onChange={(e) => setRace(e.target.value)}>
                <option value="">— none —</option>
                {speciesNames.map((n) => <option key={n} value={n}>{n} · {data.speciesData[n].source}</option>)}
                {character.race && !data.speciesData[character.race] && <option value={character.race}>{character.race} (custom)</option>}
              </select>
            </div>
            {subraceNames.length > 0 && (
              <div className="set-field"><label>Subspecies / Subrace</label>
                <select value={character.subrace || ''} onChange={(e) => setSubrace(e.target.value)}>
                  <option value="">— none —</option>
                  {subraceNames.map((n) => { const ss = data.subspeciesData[subKey(character.race, n)]; return <option key={n} value={n}>{n}{ss && ss.custom ? ' ✦' : ''}</option>; })}
                </select>
              </div>
            )}
            <InfoBox html={speciesInfo} />
            <div className="set-field"><label>Background</label>
              <select value={data.backgroundData[character.background] ? character.background : (character.background || '')} onChange={(e) => setBackground(e.target.value)}>
                <option value="">— none —</option>
                {bgNames.map((n) => <option key={n} value={n}>{n} · {data.backgroundData[n].source}</option>)}
                {character.background && !data.backgroundData[character.background] && <option value={character.background}>{character.background} (custom)</option>}
              </select>
            </div>
            <InfoBox html={backgroundInfo} />
            <div className="set-field"><label>Alignment</label>
              <select value={character.alignment || ''} onChange={(e) => setAlignment(e.target.value)}>
                <option value="">— unset —</option>
                {data.alignments.map((a) => <option key={a.name} value={a.name}>{a.abbr === '—' ? '' : a.abbr + ' · '}{a.name}</option>)}
                {character.alignment && !data.alignments.some((a) => a.name === character.alignment) && <option value={character.alignment}>{character.alignment} (custom)</option>}
              </select>
            </div>
            <div className="set-field"><label>Experience</label><input type="number" min="0" value={character.xp || 0} onChange={(e) => setXp(e.target.value)} /></div>
            <label className="set-toggle"><input type="checkbox" checked={showXp} onChange={(e) => setShowXp(e.target.checked)} /><span>Show Experience on sheet</span></label>
          </div>

          <div className="panel">
            <h2><span>Classes &amp; Levels</span><span className="rune">◈</span></h2>
            <div className="picker-hint">Add more classes to multiclass. The <span className="hl">first entry is your primary class</span> and provides saving-throw proficiencies; proficiency bonus is based on your <span className="hl">total level</span>.</div>
            <div className="filter-bar">
              <span className="filter-label">Filter</span>
              {['all', ...data.classSources].map((o) => (
                <span key={o} className={'filter-chip' + (classFilter === o ? ' on' : '')} onClick={() => setClassFilter(o)}>{o === 'all' ? 'All' : o}</span>
              ))}
            </div>
            <div>
              {(character.classes || []).length === 0 && <div className="action-empty">No classes yet — add one below.</div>}
              {(character.classes || []).map((entry, i) => {
                const taken = character.classes.filter((c, j) => j !== i).map((c) => c.name);
                const names = classNamesForFilter(entry.name).filter((n) => !taken.includes(n));
                const subs = entry.name ? subclassNamesForClass(data, entry.name) : [];
                const cd = data.classData[entry.name];
                const subLevel = cd ? cd.subclassLevel : 0;
                const subReady = cd && (entry.level || 1) >= subLevel;
                const choiceFeats = choiceFeaturesFor(entry, data);
                return (
                  <div key={i}>
                    <div className="class-row">
                      <select className="mc-class" value={entry.name} onChange={(e) => setClassName(i, e.target.value)}>
                        <option value="">— pick a class —</option>
                        {names.map((n) => <option key={n} value={n}>{n} · {data.classData[n].source}</option>)}
                      </select>
                      <input className="mc-level" type="number" min="1" max="20" value={entry.level || 1} onChange={(e) => setClassLevel(i, e.target.value)} />
                      {i === 0 && <span className="primary-tag">primary</span>}
                      <span className="row-del mc-del" onClick={() => delClass(i)}>✕</span>
                      {subs.length > 0 && (
                        <select className="mc-subclass" value={entry.subclass || ''} title={subReady ? '' : 'unlocks at Lv ' + subLevel} onChange={(e) => setSubclass(i, e.target.value)}>
                          <option value="">{subReady ? '— subclass —' : '— subclass (Lv ' + subLevel + ') —'}</option>
                          {subs.map((s) => <option key={s} value={s}>{s}{data.subclassData[subKey(entry.name, s)] ? ' ✦' : ''}</option>)}
                        </select>
                      )}
                    </div>
                    <div className="feat-choice-box">
                      {choiceFeats.map((cf) => (
                        <ChoiceControl key={cf.key} entryIndex={i} cf={cf} choice={chosenFeatureOption(entry, cf.owner, cf.f)}
                          showLabel update={update} onOpenModal={onOpenModal} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <button className="add-btn" onClick={addClass}>+ Add Class</button>
            <div className="mini-row" style={{ marginTop: 12 }}><label>Total Level</label><span className="val">{level}</span></div>
            <div dangerouslySetInnerHTML={{ __html: stackHtml }} />
          </div>
        </div>

        <div>
          <div className="panel">
            <h2><span>Skill Proficiencies <button className="legend-btn skill-legend-btn" type="button" title="What do the markers mean?" onClick={(e) => { e.stopPropagation(); skillLegend(); }}>?</button></span><span className="rune">◈</span></h2>
            <div className="skill-chips">
              {data.skills.map((s, i) => {
                const key = 'sk' + i;
                const fromClass = picked.some((c) => { const cd = data.classData[c.name]; return cd.skills !== 'any' && cd.skills.includes(s.name); });
                const granted = grantedSkillSources(character, s.name, data);
                const on = !!character.skillProf[key] || granted.length > 0;
                return (
                  <div key={i} title={granted.length ? granted.map((g) => `Granted by your ${g.kind} — ${g.by}`).join('; ') : ''}
                    className={'skill-chip' + (on ? ' on' : '') + (fromClass ? ' classpick' : '') + (granted.length ? ' granted' : '')}
                    onClick={() => toggleSkill(i, granted)}>
                    {s.name}<span className="chip-abbr">{s.ability}</span>
                    {granted.map((g, j) => <span key={j} className="chip-grant">{g.kind}</span>)}
                  </div>
                );
              })}
            </div>
          </div>

          <LanguagesPanel />

          {!viewOnly && (
            <div className="panel">
              <h2><span>Manage Character</span><span className="rune">◈</span></h2>
              <div className="picker-hint">Save a backup copy of this character, or remove it permanently. <span className="hl">Deleting can't be undone.</span></div>
              <div className="manage-actions">
                <button className="pbtn" type="button" title="Download this character as a JSON file" onClick={onExport}>Export JSON</button>
                <button className="pbtn danger" type="button" onClick={deleteCharacter}>Delete Character</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {modal && <ChoiceModal featureLabel={modal.label} current={modalCurrent} onSave={saveChoiceModal} onClear={clearChoiceModal} onClose={() => setModal(null)} />}
    </div>
  );
}
