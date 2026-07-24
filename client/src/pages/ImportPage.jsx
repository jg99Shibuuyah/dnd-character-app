import { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { useRegistry, subclassNamesForClass, subspeciesNamesForSpecies } from '../state/registry.js';
import * as api from '../api/client.js';
import { levelLabel } from '../rules/core.js';
import { parseFeatureLines } from '../rules/classes.js';
import {
  DEFAULT_SPELL_TAGS, parseTraitLines, parseSkillNames, parseNameList,
  featuresToLines, traitsToLines, builtinSpellInfo,
  collectBulkEntries, prepareBulkQueue, exportLibraryEntries, BULK_TYPE_ORDER,
  monsterFormToData, monsterDataToForm
} from '../rules/import-forms.js';
import referenceHtml from '../content/json-reference.html?raw';

// Import page — React port of the legacy import forms (public/app.js:
// bindClassImport & friends). Six forms share a common skeleton: an edit
// select over built-in + imported entries, form fields, submit with an
// optional paste-JSON override, a Delete button for loaded imports, and the
// imported-entries list. All writes hit the shared DB, then reload() re-merges
// the registry so every list refreshes.

const IMPORT_TABS = [
  { id: 'classes', label: 'Classes' },
  { id: 'species', label: 'Species' },
  { id: 'backgrounds', label: 'Backgrounds' },
  { id: 'spells', label: 'Spells' },
  { id: 'monsters', label: 'Monsters' },
  { id: 'bulk', label: 'Bulk Import' },
  { id: 'reference', label: 'JSON Reference' }
];

const SOURCES = ['Homebrew', '5E', '5E (legacy)', '5.5E'];
const sourceKey = (src) => src === '5E' ? '5e' : src === '5E (legacy)' ? '5eleg' : src === '5.5E' ? '55e' : 'homebrew';
const SourceTag = ({ src }) => <span className={`src-tag src-${sourceKey(src)}`}>{src}</span>;
const subKey = (parent, name) => parent + '::' + name;

function Msg({ msg }) {
  return <div className={'import-msg' + (msg ? ' ' + msg.kind : '')}>{msg?.text || ''}</div>;
}

function SourceSelect({ value, onChange, includeLegacy = true }) {
  const opts = includeLegacy ? SOURCES : SOURCES.filter((s) => s !== '5E (legacy)');
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {opts.map((s) => <option key={s} value={s}>{s === 'Homebrew' ? 'Homebrew' : `Official — ${s}`}</option>)}
    </select>
  );
}

// Submit row + collapsible paste-JSON override, shared by every form.
function SubmitRow({ label, onSubmit, onDelete, deletable, jsonPlaceholder, jsonLabel, onJson, setMsg }) {
  const [showJson, setShowJson] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const submit = () => {
    const t = jsonText.trim();
    if (showJson && t) {
      let obj;
      try { obj = JSON.parse(t); }
      catch (e) { setMsg({ kind: 'err', text: 'Invalid JSON: ' + e.message }); return; }
      onJson(obj);
    } else {
      onSubmit();
    }
  };
  return (
    <>
      <div className="full">
        <button className="add-btn" onClick={submit}>+ {label}</button>
        <button className="pbtn" style={{ marginLeft: 8 }} onClick={() => setShowJson(!showJson)}>Paste JSON…</button>
        {deletable && <button className="pbtn danger" style={{ marginLeft: 8 }} onClick={onDelete}>Delete</button>}
      </div>
      {showJson && (
        <div className="set-field full">
          <label>Advanced — {jsonLabel}</label>
          <textarea className="import-ta" placeholder={jsonPlaceholder}
            value={jsonText} onChange={(e) => setJsonText(e.target.value)} />
          <div className="import-note">Paste a full definition to import it directly. Overrides the form fields above.</div>
        </div>
      )}
    </>
  );
}

function ImportedList({ title, items, onEdit, onDelete }) {
  if (!items.length) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <div className="picker-hint" style={{ marginBottom: 6 }}>{title}</div>
      {items.map((it) => (
        <div className="imported-item" key={(it.parent || '') + it.name}>
          <span className="ii-name">{it.name}{it.parent && <> <span className="chip-abbr">{it.parent}</span></>}{it.levelTag && <> <span className="chip-abbr">{it.levelTag}</span></>}</span>
          <SourceTag src={it.source} />
          <span className="ii-edit" title="Load into the form to edit" onClick={() => onEdit(it)}>✎</span>
          <span className="row-del" onClick={() => onDelete(it)}>✕</span>
        </div>
      ))}
    </div>
  );
}

function EditSelect({ options, onPick, note }) {
  return (
    <div className="set-field full"><label>Load Existing — Edit</label>
      <select value="" onChange={(e) => { if (e.target.value) onPick(e.target.value); }}>
        <option value="">— pick an entry to edit —</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <div className="import-note">{note}</div>
    </div>
  );
}

const loadedMsg = (name) => ({ kind: 'ok', text: `Loaded "${name}" into the form — edit and press Import to save. Same name overwrites; a new name makes a copy.` });
const importedAs = (source) => SOURCES.includes(source) ? source : 'Homebrew';

// ---------- Class form ----------
function ClassForm({ registry, reload, editTarget }) {
  const data = registry.data;
  const blank = { name: '', source: 'Homebrew', hitDie: '8', saves: [], choose: 2, subLevel: 3, skills: '', subclasses: '', casting: 'none', castAbility: '', desc: '', features: '' };
  const [f, setF] = useState(blank);
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const fill = (name) => {
    const cd = data.classData[name];
    if (!cd) return;
    setF({
      name,
      source: importedAs(cd.source),
      hitDie: String(cd.hitDie || 8),
      saves: cd.saves || [],
      choose: cd.choose || 0,
      subLevel: cd.subclassLevel || 3,
      skills: Array.isArray(cd.skills) ? cd.skills.join(', ') : '',
      subclasses: (cd.subclasses || []).join(', '),
      casting: (cd.casting && cd.casting.type) || 'none',
      castAbility: (cd.casting && cd.casting.ability) || '',
      desc: cd.desc || '',
      features: featuresToLines(cd.features)
    });
    setDeleteId(cd.custom ? cd.customId : null);
    setMsg(loadedMsg(name));
  };

  useEffect(() => { if (editTarget) fill(editTarget); }, [editTarget]);

  const buildPayload = () => {
    const name = f.name.trim();
    if (!name) throw new Error('Class name is required.');
    const skills = f.skills.trim() ? f.skills.split(',').map((s) => s.trim()).filter(Boolean) : 'any';
    const casting = { type: f.casting };
    if (f.castAbility) casting.ability = f.castAbility;
    const d = {
      hitDie: parseInt(f.hitDie) || 8,
      saves: f.saves,
      choose: parseInt(f.choose) || 0,
      skills,
      subclassLevel: Math.max(1, Math.min(20, parseInt(f.subLevel) || 3)),
      casting,
      features: parseFeatureLines(f.features)
    };
    const subs = f.subclasses.trim();
    if (subs) d.subclasses = subs.split(',').map((s) => s.trim()).filter(Boolean);
    if (f.desc.trim()) d.desc = f.desc.trim();
    return { name, source: f.source, data: d };
  };

  const submit = async (payload) => {
    try {
      if (!payload) payload = buildPayload();
      if (!payload.name) throw new Error('Class name is required.');
      if (!payload.data || typeof payload.data !== 'object') throw new Error('Class data is required.');
      const source = importedAs(payload.source);
      await api.classes.import({ name: payload.name, source, data: payload.data });
      setMsg({ kind: 'ok', text: `Imported "${payload.name}" (${source}) — now available in the class dropdown.` });
      reload();
    } catch (err) {
      setMsg({ kind: 'err', text: 'Import failed: ' + err.message });
    }
  };

  const remove = async (id, name) => {
    if (!window.confirm(`Remove imported class "${name}"? Characters using it will lose it. If it shadowed a built-in of the same name, the built-in is restored.`)) return;
    await api.classes.delete(id);
    setDeleteId(null);
    setMsg({ kind: 'ok', text: `Deleted "${name}".` });
    reload();
  };

  const customs = Object.entries(data.classData).filter(([, cd]) => cd.custom);
  return (
    <div className="panel">
      <h2><span>Import Class</span><span className="rune">◈</span></h2>
      <div className="picker-hint">Add a homebrew or official class, using the same fields the built-in <span className="hl">Jaeger</span> class uses. Imported classes are saved to the database and shared across every character, then appear in the class picker on the Settings tab.</div>
      <div className="import-grid">
        <EditSelect note={<span>Pick any built-in or imported class to load it into the form. Re-importing with the <span className="hl">same name overwrites</span> it; a new name saves a copy.</span>}
          options={Object.keys(data.classData).sort().map((n) => ({ value: n, label: `${n} · ${data.classData[n].source} · ${data.classData[n].custom ? 'imported' : 'built-in'}` }))}
          onPick={fill} />
        <div className="set-field full"><label>Class Name</label><input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Artificer" /></div>
        <div className="set-field"><label>Source</label><SourceSelect value={f.source} onChange={(v) => set('source', v)} /></div>
        <div className="set-field"><label>Hit Die</label>
          <select value={f.hitDie} onChange={(e) => set('hitDie', e.target.value)}>
            {['6', '8', '10', '12'].map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="set-field full"><label>Saving Throw Proficiencies</label>
          <div className="ability-toggles">
            {data.abilities.map((a) => (
              <span key={a.key} className={'mini-toggle' + (f.saves.includes(a.key) ? ' on' : '')}
                onClick={() => set('saves', f.saves.includes(a.key) ? f.saves.filter((k) => k !== a.key) : [...f.saves, a.key])}>{a.key}</span>
            ))}
          </div>
        </div>
        <div className="set-field"><label>Skill Choices</label><input type="number" min="0" max="18" value={f.choose} onChange={(e) => set('choose', e.target.value)} /></div>
        <div className="set-field"><label>Subclass Level</label><input type="number" min="1" max="20" value={f.subLevel} onChange={(e) => set('subLevel', e.target.value)} /></div>
        <div className="set-field full"><label>Skill List</label>
          <input value={f.skills} onChange={(e) => set('skills', e.target.value)} placeholder='Athletics, Perception, Stealth …  (or leave blank for "any")' />
          <div className="import-note">Comma-separated skill names the class can choose from. Blank = any skill.</div>
        </div>
        <div className="set-field full"><label>Subclasses</label>
          <input value={f.subclasses} onChange={(e) => set('subclasses', e.target.value)} placeholder="Alchemist, Artillerist, Battle Smith" />
          <div className="import-note">Comma-separated. Chosen at the Subclass Level above.</div>
        </div>
        <div className="set-field"><label>Spellcasting</label>
          <select value={f.casting} onChange={(e) => set('casting', e.target.value)}>
            <option value="none">None</option><option value="full">Full caster</option><option value="half">Half caster</option><option value="pact">Pact magic</option>
          </select>
        </div>
        <div className="set-field"><label>Casting Ability</label>
          <select value={f.castAbility} onChange={(e) => set('castAbility', e.target.value)}>
            <option value="">—</option><option value="int">INT</option><option value="wis">WIS</option><option value="cha">CHA</option>
          </select>
        </div>
        <div className="set-field full"><label>Description</label>
          <textarea className="import-ta" style={{ minHeight: 60 }} value={f.desc} onChange={(e) => set('desc', e.target.value)} placeholder="One-paragraph class summary." />
        </div>
        <div className="set-field full"><label>Features (one per line)</label>
          <textarea className="import-ta" value={f.features} onChange={(e) => set('features', e.target.value)}
            placeholder={'level | name | description | use | cost | choices\n1 | Flexible Combatant | Draw or stow two weapons at once. | passive\n2 | Fighting Style | Pick a style. | passive | | Archery; Defense\n3 | Piercing Gaze | Gain darkvision for 1 hour. | free | 1/long rest'} />
          <div className="import-note">Format: <span className="hl">level | name | description | use | cost | choices</span>. Only level and name are required. <span className="hl">use</span> and <span className="hl">cost</span> surface the feature on the Actions tab. <span className="hl">choices</span> is a <span className="hl">semicolon-separated</span> list.</div>
        </div>
        <SubmitRow label="Import Class" jsonLabel="Class JSON" setMsg={setMsg}
          jsonPlaceholder='{ "name":"Artificer", "source":"5E", "hitDie":8, "saves":["con","int"], "choose":2, "features":[{"lv":1,"name":"Magical Tinkering"}] }'
          onSubmit={() => submit()} deletable={deleteId != null}
          onDelete={() => remove(deleteId, f.name)}
          onJson={(obj) => { const { name, source, data: d, ...rest } = obj; submit({ name, source, data: d || rest }); }} />
      </div>
      <Msg msg={msg} />
      <ImportedList title="Imported classes"
        items={customs.map(([n, cd]) => ({ name: n, source: cd.source, id: cd.customId }))}
        onEdit={(it) => fill(it.name)}
        onDelete={(it) => remove(it.id, it.name)} />
    </div>
  );
}

// ---------- Species form ----------
function SpeciesForm({ registry, reload, editTarget }) {
  const data = registry.data;
  const blank = { name: '', source: 'Homebrew', size: 'Medium', speed: 30, darkvision: 0, asi: '', languages: '', desc: '', traits: '' };
  const [f, setF] = useState(blank);
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const fill = (name) => {
    const sd = data.speciesData[name];
    if (!sd) return;
    setF({ name, source: importedAs(sd.source), size: sd.size || 'Medium', speed: sd.speed || 30,
      darkvision: sd.darkvision || 0, asi: sd.asi || '', languages: sd.languages || '',
      desc: sd.desc || '', traits: traitsToLines(sd.traits) });
    setDeleteId(sd.custom ? sd.customId : null);
    setMsg(loadedMsg(name));
  };

  useEffect(() => { if (editTarget) fill(editTarget); }, [editTarget]);

  const submit = async (payload) => {
    try {
      if (!payload) {
        const name = f.name.trim();
        if (!name) throw new Error('Species name is required.');
        const d = { size: f.size, speed: parseInt(f.speed) || 30, darkvision: parseInt(f.darkvision) || 0, traits: parseTraitLines(f.traits) };
        if (f.asi.trim()) d.asi = f.asi.trim();
        if (f.languages.trim()) d.languages = f.languages.trim();
        if (f.desc.trim()) d.desc = f.desc.trim();
        payload = { name, source: f.source, data: d };
      }
      if (!payload.name) throw new Error('Species name is required.');
      if (!payload.data || typeof payload.data !== 'object') throw new Error('Species data is required.');
      const source = importedAs(payload.source);
      await api.species.import({ name: payload.name, source, data: payload.data });
      setMsg({ kind: 'ok', text: `Imported "${payload.name}" (${source}) — now available in the Species picker on the Settings tab.` });
      reload();
    } catch (err) {
      setMsg({ kind: 'err', text: 'Import failed: ' + err.message });
    }
  };

  const remove = async (id, name) => {
    if (!window.confirm(`Remove imported species "${name}"?`)) return;
    await api.species.delete(id);
    setDeleteId(null);
    setMsg({ kind: 'ok', text: `Deleted "${name}".` });
    reload();
  };

  const customs = Object.entries(data.speciesData).filter(([, sd]) => sd.custom);
  return (
    <div className="panel">
      <h2><span>Import Species</span><span className="rune">◈</span></h2>
      <div className="picker-hint">Add a playable species / lineage. Imported species are saved to the database and appear in the <span className="hl">Species</span> picker on the Settings tab; their traits show on the Features &amp; Traits tab.</div>
      <div className="import-grid">
        <EditSelect note={<span>Pick any built-in or imported species to load it into the form. Re-importing with the <span className="hl">same name overwrites</span> it; a new name saves a copy.</span>}
          options={Object.keys(data.speciesData).sort().map((n) => ({ value: n, label: `${n} · ${data.speciesData[n].source} · ${data.speciesData[n].custom ? 'imported' : 'built-in'}` }))}
          onPick={fill} />
        <div className="set-field full"><label>Species Name</label><input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Aarakocra" /></div>
        <div className="set-field"><label>Source</label><SourceSelect value={f.source} onChange={(v) => set('source', v)} /></div>
        <div className="set-field"><label>Size</label>
          <select value={f.size} onChange={(e) => set('size', e.target.value)}>
            <option>Small</option><option>Medium</option><option>Large</option>
          </select>
        </div>
        <div className="set-field"><label>Walk Speed</label><input type="number" min="0" max="120" value={f.speed} onChange={(e) => set('speed', e.target.value)} /></div>
        <div className="set-field"><label>Darkvision (ft)</label><input type="number" min="0" max="120" value={f.darkvision} onChange={(e) => set('darkvision', e.target.value)} /></div>
        <div className="set-field full"><label>Ability Score Increase</label>
          <input value={f.asi} onChange={(e) => set('asi', e.target.value)} placeholder="e.g. +2 DEX, +1 WIS  (or leave blank)" />
          <div className="import-note">Free-text summary; not auto-applied to ability scores.</div>
        </div>
        <div className="set-field full"><label>Languages</label>
          <input value={f.languages} onChange={(e) => set('languages', e.target.value)} placeholder="Common, Elvish" />
        </div>
        <div className="set-field full"><label>Description</label>
          <textarea className="import-ta" style={{ minHeight: 60 }} value={f.desc} onChange={(e) => set('desc', e.target.value)} placeholder="One-paragraph species summary." />
        </div>
        <div className="set-field full"><label>Traits (one per line)</label>
          <textarea className="import-ta" value={f.traits} onChange={(e) => set('traits', e.target.value)}
            placeholder={'name | description\nFlight | You have a flying speed of 50 ft while not wearing heavy armor.\nTalons | Your unarmed strikes deal 1d4 slashing damage.'} />
          <div className="import-note">Format: <span className="hl">name | description</span>, one trait per line.</div>
        </div>
        <SubmitRow label="Import Species" jsonLabel="Species JSON" setMsg={setMsg}
          jsonPlaceholder='{ "name":"Aarakocra", "source":"5E", "size":"Medium", "speed":25, "traits":[{"name":"Flight","desc":"Flying speed 50 ft."}] }'
          onSubmit={() => submit()} deletable={deleteId != null}
          onDelete={() => remove(deleteId, f.name)}
          onJson={(obj) => { const { name, source, data: d, ...rest } = obj; submit({ name, source, data: d || rest }); }} />
      </div>
      <Msg msg={msg} />
      <ImportedList title="Imported species"
        items={customs.map(([n, sd]) => ({ name: n, source: sd.source, id: sd.customId }))}
        onEdit={(it) => fill(it.name)}
        onDelete={(it) => remove(it.id, it.name)} />
    </div>
  );
}

// ---------- Background form ----------
function BackgroundForm({ registry, reload }) {
  const data = registry.data;
  const blank = { name: '', source: 'Homebrew', skills: '', tools: '', languages: '', equipment: '', desc: '', featureName: '', featureDesc: '' };
  const [f, setF] = useState(blank);
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const fill = (name) => {
    const bd = data.backgroundData[name];
    if (!bd) return;
    setF({ name, source: importedAs(bd.source), skills: (bd.skills || []).join(', '),
      tools: bd.tools || '', languages: bd.languages || '', equipment: bd.equipment || '',
      desc: bd.desc || '', featureName: (bd.feature && bd.feature.name) || '', featureDesc: (bd.feature && bd.feature.desc) || '' });
    setDeleteId(bd.custom ? bd.customId : null);
    setMsg(loadedMsg(name));
  };

  const submit = async (payload) => {
    try {
      if (!payload) {
        const name = f.name.trim();
        if (!name) throw new Error('Background name is required.');
        const d = { skills: parseSkillNames(f.skills, data.skills) };
        if (f.tools.trim()) d.tools = f.tools.trim();
        if (f.languages.trim()) d.languages = f.languages.trim();
        if (f.equipment.trim()) d.equipment = f.equipment.trim();
        if (f.desc.trim()) d.desc = f.desc.trim();
        if (f.featureName.trim()) d.feature = { name: f.featureName.trim(), desc: f.featureDesc.trim() };
        payload = { name, source: f.source, data: d };
      }
      if (!payload.name) throw new Error('Background name is required.');
      if (!payload.data || typeof payload.data !== 'object') throw new Error('Background data is required.');
      if (payload.data.skills) payload.data.skills = parseSkillNames([].concat(payload.data.skills).join(','), data.skills);
      const source = importedAs(payload.source);
      await api.backgrounds.import({ name: payload.name, source, data: payload.data });
      setMsg({ kind: 'ok', text: `Imported "${payload.name}" (${source}) — now available in the Background picker on the Settings tab.` });
      reload();
    } catch (err) {
      setMsg({ kind: 'err', text: 'Import failed: ' + err.message });
    }
  };

  const remove = async (id, name) => {
    if (!window.confirm(`Remove imported background "${name}"?`)) return;
    await api.backgrounds.delete(id);
    setDeleteId(null);
    setMsg({ kind: 'ok', text: `Deleted "${name}".` });
    reload();
  };

  const customs = Object.entries(data.backgroundData).filter(([, bd]) => bd.custom);
  return (
    <div className="panel">
      <h2><span>Import Background</span><span className="rune">◈</span></h2>
      <div className="picker-hint">Add a character background. Imported backgrounds are saved to the database and appear in the <span className="hl">Background</span> picker on the Settings tab; their skill proficiencies apply automatically and their feature shows on the Features &amp; Traits tab.</div>
      <div className="import-grid">
        <EditSelect note={<span>Pick any built-in or imported background to load it into the form. Re-importing with the <span className="hl">same name overwrites</span> it; a new name saves a copy.</span>}
          options={Object.keys(data.backgroundData).sort().map((n) => ({ value: n, label: `${n} · ${data.backgroundData[n].source} · ${data.backgroundData[n].custom ? 'imported' : 'built-in'}` }))}
          onPick={fill} />
        <div className="set-field full"><label>Background Name</label><input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Acolyte" /></div>
        <div className="set-field"><label>Source</label><SourceSelect value={f.source} onChange={(v) => set('source', v)} includeLegacy={false} /></div>
        <div className="set-field"><label>Skill Proficiencies</label>
          <input value={f.skills} onChange={(e) => set('skills', e.target.value)} placeholder="Insight, Religion" />
          <div className="import-note">Comma-separated skill names — these are <span className="hl">granted automatically</span> to any character with this background.</div>
        </div>
        <div className="set-field"><label>Tool Proficiencies</label><input value={f.tools} onChange={(e) => set('tools', e.target.value)} placeholder="e.g. Disguise kit (optional)" /></div>
        <div className="set-field"><label>Languages</label><input value={f.languages} onChange={(e) => set('languages', e.target.value)} placeholder="e.g. Two of your choice (optional)" /></div>
        <div className="set-field full"><label>Equipment</label>
          <input value={f.equipment} onChange={(e) => set('equipment', e.target.value)} placeholder="e.g. Holy symbol, prayer book, vestments, pouch with 15 gp (optional)" />
        </div>
        <div className="set-field full"><label>Description</label>
          <textarea className="import-ta" style={{ minHeight: 60 }} value={f.desc} onChange={(e) => set('desc', e.target.value)} placeholder="One-paragraph background summary." />
        </div>
        <div className="set-field full"><label>Feature Name</label><input value={f.featureName} onChange={(e) => set('featureName', e.target.value)} placeholder="e.g. Shelter of the Faithful" /></div>
        <div className="set-field full"><label>Feature Description</label>
          <textarea className="import-ta" value={f.featureDesc} onChange={(e) => set('featureDesc', e.target.value)} placeholder="What the background feature does." />
        </div>
        <SubmitRow label="Import Background" jsonLabel="Background JSON" setMsg={setMsg}
          jsonPlaceholder='{ "name":"Acolyte", "source":"5E", "skills":["Insight","Religion"], "feature":{"name":"Shelter of the Faithful","desc":"…"} }'
          onSubmit={() => submit()} deletable={deleteId != null}
          onDelete={() => remove(deleteId, f.name)}
          onJson={(obj) => { const { name, source, data: d, ...rest } = obj; submit({ name, source, data: d || rest }); }} />
      </div>
      <Msg msg={msg} />
      <ImportedList title="Imported backgrounds"
        items={customs.map(([n, bd]) => ({ name: n, source: bd.source, id: bd.customId }))}
        onEdit={(it) => fill(it.name)}
        onDelete={(it) => remove(it.id, it.name)} />
    </div>
  );
}

// ---------- Subclass form ----------
function SubclassForm({ registry, reload, editTarget }) {
  const data = registry.data;
  const blank = { parent: '', name: '', source: 'Homebrew', level: 3, desc: '', features: '' };
  const [f, setF] = useState(blank);
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const fill = (parent, name) => {
    const cd = data.classData[parent];
    if (!cd) return;
    const sc = data.subclassData[subKey(parent, name)];
    const source = sc ? sc.source : cd.source;
    setF({ parent, name, source: importedAs(source),
      level: (sc && sc.subclassLevel) || cd.subclassLevel || 3,
      desc: (sc && sc.desc) || '', features: featuresToLines(sc && sc.features) });
    setDeleteId(sc && sc.custom ? sc.customId : null);
    setMsg(loadedMsg(`${name} (${parent})`));
  };

  useEffect(() => { if (editTarget) fill(editTarget.parent, editTarget.name); }, [editTarget]);

  const submit = async (payload) => {
    try {
      if (!payload) {
        if (!f.parent) throw new Error('Pick a parent class.');
        if (!data.classData[f.parent]) throw new Error('Unknown parent class.');
        const name = f.name.trim();
        if (!name) throw new Error('Subclass name is required.');
        const d = {
          subclassLevel: Math.max(1, Math.min(20, parseInt(f.level) || data.classData[f.parent].subclassLevel || 3)),
          features: parseFeatureLines(f.features)
        };
        if (f.desc.trim()) d.desc = f.desc.trim();
        payload = { parent: f.parent, name, source: f.source, data: d };
      }
      if (!payload.parent || !data.classData[payload.parent]) throw new Error('A valid parent class is required.');
      if (!payload.name) throw new Error('Subclass name is required.');
      if (!payload.data || typeof payload.data !== 'object') throw new Error('Subclass data is required.');
      const source = importedAs(payload.source);
      await api.subclasses.import({ parent: payload.parent, name: payload.name, source, data: payload.data });
      setMsg({ kind: 'ok', text: `Imported "${payload.name}" under ${payload.parent} (${source}) — now selectable on that class in Settings.` });
      reload();
    } catch (err) {
      setMsg({ kind: 'err', text: 'Import failed: ' + err.message });
    }
  };

  const remove = async (id, parent, name) => {
    if (!window.confirm(`Remove imported subclass "${name}" (${parent})?`)) return;
    await api.subclasses.delete(id);
    setDeleteId(null);
    setMsg({ kind: 'ok', text: `Deleted "${name}".` });
    reload();
  };

  const editOptions = [];
  Object.keys(data.classData).forEach((parent) =>
    subclassNamesForClass(data, parent).forEach((n) => {
      const sc = data.subclassData[subKey(parent, n)];
      editOptions.push({ value: subKey(parent, n), label: `${n} — ${parent} · ${sc ? sc.source + ' · imported' : 'built-in'}` });
    }));
  editOptions.sort((a, b) => a.label.localeCompare(b.label));

  const customs = Object.values(data.subclassData).filter((s) => s.custom);
  return (
    <div className="panel">
      <h2><span>Import Subclass</span><span className="rune">◈</span></h2>
      <div className="picker-hint">Add a subclass to an existing <span className="hl">parent class</span> (built-in or imported). It becomes selectable on that class in the <span className="hl">Classes &amp; Levels</span> picker, and its features show on the Features &amp; Traits and Actions tabs, gated by your class level.</div>
      <div className="import-grid">
        <EditSelect note={<span>Pick any built-in or imported subclass to load it into the form. Re-importing with the <span className="hl">same parent + name overwrites</span> it; a new name saves a copy.</span>}
          options={editOptions}
          onPick={(key) => { const i = key.indexOf('::'); if (i > 0) fill(key.slice(0, i), key.slice(i + 2)); }} />
        <div className="set-field"><label>Parent Class</label>
          <select value={f.parent} onChange={(e) => {
            const parent = e.target.value;
            const cd = data.classData[parent];
            setF((p) => ({ ...p, parent, level: cd ? (cd.subclassLevel || 3) : p.level }));
          }}>
            <option value="">— pick parent class —</option>
            {Object.keys(data.classData).sort().map((n) => <option key={n} value={n}>{n} · {data.classData[n].source}</option>)}
          </select>
        </div>
        <div className="set-field"><label>Source</label><SourceSelect value={f.source} onChange={(v) => set('source', v)} /></div>
        <div className="set-field"><label>Subclass Name</label><input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Circle of Stars" /></div>
        <div className="set-field"><label>Chosen at Level</label><input type="number" min="1" max="20" value={f.level} onChange={(e) => set('level', e.target.value)} /></div>
        <div className="set-field full"><label>Description</label>
          <textarea className="import-ta" style={{ minHeight: 60 }} value={f.desc} onChange={(e) => set('desc', e.target.value)} placeholder="One-paragraph subclass summary." />
        </div>
        <div className="set-field full"><label>Features (one per line)</label>
          <textarea className="import-ta" value={f.features} onChange={(e) => set('features', e.target.value)}
            placeholder={'level | name | description | use | cost | choices\n3 | Star Map | You create a celestial map granting a bonus cantrip. | passive\n3 | Starry Form | Assume a constellation form. | bonus action | 2/rest | Archer; Chalice; Dragon'} />
          <div className="import-note">Format: <span className="hl">level | name | description | use | cost | choices</span>. Level is the character level the feature unlocks at.</div>
        </div>
        <SubmitRow label="Import Subclass" jsonLabel="Subclass JSON" setMsg={setMsg}
          jsonPlaceholder='{ "parent":"Druid", "name":"Circle of Stars", "source":"5E", "subclassLevel":2, "features":[{"lv":2,"name":"Star Map"}] }'
          onSubmit={() => submit()} deletable={deleteId != null}
          onDelete={() => remove(deleteId, f.parent, f.name)}
          onJson={(obj) => { const { parent, name, source, data: d, ...rest } = obj; submit({ parent, name, source, data: d || rest }); }} />
      </div>
      <Msg msg={msg} />
      <ImportedList title="Imported subclasses"
        items={customs.map((s) => ({ name: s.name, parent: s.parent, source: s.source, id: s.customId }))}
        onEdit={(it) => fill(it.parent, it.name)}
        onDelete={(it) => remove(it.id, it.parent, it.name)} />
    </div>
  );
}

// ---------- Subspecies form ----------
function SubspeciesForm({ registry, reload, editTarget }) {
  const data = registry.data;
  const blank = { parent: '', name: '', source: 'Homebrew', asi: '', desc: '', traits: '' };
  const [f, setF] = useState(blank);
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const fill = (parent, name) => {
    const sd = data.speciesData[parent];
    if (!sd) return;
    const ss = data.subspeciesData[subKey(parent, name)];
    const source = ss ? ss.source : sd.source;
    setF({ parent, name, source: importedAs(source), asi: (ss && ss.asi) || '',
      desc: (ss && ss.desc) || '', traits: traitsToLines(ss && ss.traits) });
    setDeleteId(ss && ss.custom ? ss.customId : null);
    setMsg(loadedMsg(`${name} (${parent})`));
  };

  useEffect(() => { if (editTarget) fill(editTarget.parent, editTarget.name); }, [editTarget]);

  const submit = async (payload) => {
    try {
      if (!payload) {
        if (!f.parent) throw new Error('Pick a parent species.');
        if (!data.speciesData[f.parent]) throw new Error('Unknown parent species.');
        const name = f.name.trim();
        if (!name) throw new Error('Subspecies name is required.');
        const d = { traits: parseTraitLines(f.traits) };
        if (f.asi.trim()) d.asi = f.asi.trim();
        if (f.desc.trim()) d.desc = f.desc.trim();
        payload = { parent: f.parent, name, source: f.source, data: d };
      }
      if (!payload.parent || !data.speciesData[payload.parent]) throw new Error('A valid parent species is required.');
      if (!payload.name) throw new Error('Subspecies name is required.');
      if (!payload.data || typeof payload.data !== 'object') throw new Error('Subspecies data is required.');
      const source = importedAs(payload.source);
      await api.subspecies.import({ parent: payload.parent, name: payload.name, source, data: payload.data });
      setMsg({ kind: 'ok', text: `Imported "${payload.name}" under ${payload.parent} (${source}) — now selectable in the Subspecies picker in Settings.` });
      reload();
    } catch (err) {
      setMsg({ kind: 'err', text: 'Import failed: ' + err.message });
    }
  };

  const remove = async (id, parent, name) => {
    if (!window.confirm(`Remove imported subspecies "${name}" (${parent})?`)) return;
    await api.subspecies.delete(id);
    setDeleteId(null);
    setMsg({ kind: 'ok', text: `Deleted "${name}".` });
    reload();
  };

  const editOptions = [];
  Object.keys(data.speciesData).forEach((parent) =>
    subspeciesNamesForSpecies(data, parent).forEach((n) => {
      const ss = data.subspeciesData[subKey(parent, n)];
      editOptions.push({ value: subKey(parent, n), label: `${n} — ${parent} · ${ss ? (ss.custom ? ss.source + ' · imported' : ss.source) : 'built-in'}` });
    }));
  editOptions.sort((a, b) => a.label.localeCompare(b.label));

  const customs = Object.values(data.subspeciesData).filter((s) => s.custom);
  return (
    <div className="panel">
      <h2><span>Import Subspecies</span><span className="rune">◈</span></h2>
      <div className="picker-hint">Add a subspecies / subrace to an existing <span className="hl">parent species</span> (built-in or imported). It becomes selectable under the <span className="hl">Subspecies / Subrace</span> picker on that species in Settings, and its traits show on the Features &amp; Traits tab.</div>
      <div className="import-grid">
        <EditSelect note={<span>Pick any built-in or imported subspecies to load it into the form. Re-importing with the <span className="hl">same parent + name overwrites</span> it; a new name saves a copy.</span>}
          options={editOptions}
          onPick={(key) => { const i = key.indexOf('::'); if (i > 0) fill(key.slice(0, i), key.slice(i + 2)); }} />
        <div className="set-field"><label>Parent Species</label>
          <select value={f.parent} onChange={(e) => set('parent', e.target.value)}>
            <option value="">— pick parent species —</option>
            {Object.keys(data.speciesData).sort().map((n) => <option key={n} value={n}>{n} · {data.speciesData[n].source}</option>)}
          </select>
        </div>
        <div className="set-field"><label>Source</label><SourceSelect value={f.source} onChange={(v) => set('source', v)} /></div>
        <div className="set-field"><label>Subspecies Name</label><input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Hill Dwarf" /></div>
        <div className="set-field"><label>Ability Score Increase</label>
          <input value={f.asi} onChange={(e) => set('asi', e.target.value)} placeholder="e.g. +1 WIS  (or leave blank)" />
        </div>
        <div className="set-field full"><label>Description</label>
          <textarea className="import-ta" style={{ minHeight: 60 }} value={f.desc} onChange={(e) => set('desc', e.target.value)} placeholder="One-paragraph subspecies summary." />
        </div>
        <div className="set-field full"><label>Traits (one per line)</label>
          <textarea className="import-ta" value={f.traits} onChange={(e) => set('traits', e.target.value)}
            placeholder={'name | description\nDwarven Toughness | Your hit point maximum increases by 1, and by 1 every time you gain a level.'} />
          <div className="import-note">Format: <span className="hl">name | description</span>, one trait per line.</div>
        </div>
        <SubmitRow label="Import Subspecies" jsonLabel="Subspecies JSON" setMsg={setMsg}
          jsonPlaceholder='{ "parent":"Dwarf", "name":"Hill Dwarf", "source":"5E", "asi":"+1 WIS", "traits":[{"name":"Dwarven Toughness","desc":"+1 HP per level."}] }'
          onSubmit={() => submit()} deletable={deleteId != null}
          onDelete={() => remove(deleteId, f.parent, f.name)}
          onJson={(obj) => { const { parent, name, source, data: d, ...rest } = obj; submit({ parent, name, source, data: d || rest }); }} />
      </div>
      <Msg msg={msg} />
      <ImportedList title="Imported subspecies"
        items={customs.map((s) => ({ name: s.name, parent: s.parent, source: s.source, id: s.customId }))}
        onEdit={(it) => fill(it.parent, it.name)}
        onDelete={(it) => remove(it.id, it.parent, it.name)} />
    </div>
  );
}

// ---------- Spell form ----------
const SCHOOLS = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation'];
const CAST_TIMES = ['1 Action', '1 Bonus Action', '1 Reaction', '1 Minute', '10 Minutes', '1 Hour', '8 Hours', '12 Hours', '24 Hours'];

// A "select with an Other… escape hatch".
function SelectOther({ label, options, value, onChange, otherPlaceholder }) {
  const isKnown = value === '' || options.includes(value);
  const [other, setOther] = useState(!isKnown);
  return (
    <div className="set-field"><label>{label}</label>
      <select value={other ? '__other' : value} onChange={(e) => {
        if (e.target.value === '__other') { setOther(true); onChange(''); }
        else { setOther(false); onChange(e.target.value); }
      }}>
        <option value="">— {label.toLowerCase()} —</option>
        {options.map((o) => <option key={o}>{o}</option>)}
        <option value="__other">Other…</option>
      </select>
      {other && <input placeholder={otherPlaceholder} style={{ marginTop: 6 }} value={value} onChange={(e) => onChange(e.target.value)} />}
    </div>
  );
}

function TagPicker({ tags, allTags, onChange }) {
  const options = allTags.filter((t) => !tags.includes(t));
  return (
    <div className="tag-picker">
      {tags.map((t, i) => (
        <span className="picker-tag" key={t}>{t}<span className="tag-del" title="Remove tag" onClick={() => onChange(tags.filter((_, j) => j !== i))}>✕</span></span>
      ))}
      <select className="tag-select" value="" onChange={(e) => { if (e.target.value) onChange([...tags, e.target.value]); }}>
        <option value="">+ tag…</option>
        {options.map((t) => <option key={t}>{t}</option>)}
      </select>
    </div>
  );
}

function SpellForm({ registry, reload, editTarget }) {
  const data = registry.data;
  const customSpells = registry.customSpells;
  const blank = { name: '', source: 'Homebrew', level: 0, school: '', castTime: '', range: '', duration: '', components: '', classes: '', tags: [], desc: '' };
  const [f, setF] = useState(blank);
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const allTags = useMemo(() => {
    const tags = new Set(DEFAULT_SPELL_TAGS);
    Object.values(customSpells).forEach((s) => (s.tags || []).forEach((t) => tags.add(t)));
    f.tags.forEach((t) => tags.add(t));
    return [...tags].sort((a, b) => a.localeCompare(b));
  }, [customSpells, f.tags]);

  const fill = (name) => {
    const imp = customSpells[name];
    const info = imp || builtinSpellInfo(data, name);
    if (!info) return;
    setF({ name, source: SOURCES.includes(info.source) ? info.source : (imp ? 'Homebrew' : '5E'),
      level: Number(info.level) || 0, school: info.school || '', castTime: info.castingTime || '',
      range: info.range || '', duration: info.duration || '', components: info.components || '',
      classes: (info.classes || []).join(', '), tags: info.tags || [], desc: info.desc || '' });
    setDeleteId(imp ? imp.customId : null);
    setMsg(loadedMsg(name));
  };

  useEffect(() => { if (editTarget) fill(editTarget); }, [editTarget]);

  // A reaction casting time also carries the Reaction tag, so the spell
  // surfaces under the Actions tab's Reactions list.
  const setCastTime = (v) => {
    setF((p) => {
      const tags = v === '1 Reaction' && !p.tags.some((t) => /^reaction$/i.test(t))
        ? [...p.tags, 'Reaction'] : p.tags;
      return { ...p, castTime: v, tags };
    });
  };

  const submit = async (payload) => {
    try {
      if (!payload) {
        const name = f.name.trim();
        if (!name) throw new Error('Spell name is required.');
        const d = {
          level: Math.max(0, Math.min(9, parseInt(f.level, 10) || 0)),
          classes: parseNameList(f.classes),
          tags: [...f.tags]
        };
        if (f.school.trim()) d.school = f.school.trim();
        if (f.castTime.trim()) d.castingTime = f.castTime.trim();
        if (f.range.trim()) d.range = f.range.trim();
        if (f.components.trim()) d.components = f.components.trim();
        if (f.duration.trim()) d.duration = f.duration.trim();
        if (f.desc.trim()) d.desc = f.desc.trim();
        payload = { name, source: f.source, data: d };
      }
      if (!payload.name) throw new Error('Spell name is required.');
      if (!payload.data || typeof payload.data !== 'object') throw new Error('Spell data is required.');
      const source = importedAs(payload.source);
      await api.spells.import({ name: payload.name, source, data: payload.data });
      const cls = (payload.data.classes || []);
      setMsg({ kind: 'ok', text: `Imported "${payload.name}" (${source}) — in the Spell Library for ${cls.length ? cls.join(', ') : 'every class'}.` });
      reload();
    } catch (err) {
      setMsg({ kind: 'err', text: 'Import failed: ' + err.message });
    }
  };

  const remove = async (id, name) => {
    if (!window.confirm(`Remove imported spell "${name}"?`)) return;
    await api.spells.delete(id);
    setDeleteId(null);
    setMsg({ kind: 'ok', text: `Deleted "${name}".` });
    reload();
  };

  const spellNames = new Set(Object.keys(customSpells));
  data.spellClasses.forEach((c) => data.spellData[c].forEach((s) => spellNames.add(s.name)));
  const editOptions = [...spellNames].sort().map((n) => {
    const imp = customSpells[n];
    const lvl = imp ? (Number(imp.level) || 0) : (builtinSpellInfo(data, n) || {}).level;
    return { value: n, label: `${n} · ${levelLabel(lvl || 0)} · ${imp ? imp.source + ' · imported' : 'built-in'}` };
  });

  return (
    <div className="panel">
      <h2><span>Import Spell</span><span className="rune">✶</span></h2>
      <div className="picker-hint">Add a homebrew or official spell. Imported spells are saved to the database and appear in the <span className="hl">Spell Library</span> on the Spells tab — for the classes you list, or for <span className="hl">every class</span> if the class list is left blank.</div>
      <div className="import-grid">
        <EditSelect note={<span>Pick any built-in or imported spell to load it into the form. Re-importing with the <span className="hl">same name overwrites</span> it; a new name saves a copy.</span>}
          options={editOptions} onPick={fill} />
        <div className="set-field full"><label>Spell Name</label><input value={f.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Chromatic Lance" /></div>
        <div className="set-field"><label>Source</label><SourceSelect value={f.source} onChange={(v) => set('source', v)} /></div>
        <div className="set-field"><label>Level</label>
          <select value={f.level} onChange={(e) => set('level', e.target.value)}>
            {Array.from({ length: 10 }, (_, i) => <option key={i} value={i}>{levelLabel(i)}</option>)}
          </select>
        </div>
        <SelectOther label="School" options={SCHOOLS} value={f.school} onChange={(v) => set('school', v)} otherPlaceholder="Custom school" />
        <SelectOther label="Casting Time" options={CAST_TIMES} value={f.castTime} onChange={setCastTime} otherPlaceholder="Custom casting time" />
        <div className="set-field"><label>Range</label><input value={f.range} onChange={(e) => set('range', e.target.value)} placeholder="60 ft" /></div>
        <div className="set-field"><label>Duration</label><input value={f.duration} onChange={(e) => set('duration', e.target.value)} placeholder="Instantaneous" /></div>
        <div className="set-field full"><label>Components</label><input value={f.components} onChange={(e) => set('components', e.target.value)} placeholder="V, S, M (a shard of glass)" /></div>
        <div className="set-field full"><label>Classes</label>
          <input value={f.classes} onChange={(e) => set('classes', e.target.value)} placeholder="Wizard, Sorcerer  (blank = every class)" />
          <div className="import-note">Comma-separated class names whose Spell Library lists this spell. Blank = every class.</div>
        </div>
        <div className="set-field full"><label>Tags</label>
          <TagPicker tags={f.tags} allTags={allTags} onChange={(tags) => set('tags', tags)} />
          <div className="import-note">Pick tags from the dropdown (✕ removes one); they're shown as chips when the spell is added to Known Spells.</div>
        </div>
        <div className="set-field full"><label>Description</label>
          <textarea className="import-ta" style={{ minHeight: 60 }} value={f.desc} onChange={(e) => set('desc', e.target.value)} placeholder="What the spell does — damage, save, effect." />
        </div>
        <SubmitRow label="Import Spell" jsonLabel="Spell JSON" setMsg={setMsg}
          jsonPlaceholder='{ "name":"Chromatic Lance", "source":"Homebrew", "level":3, "school":"Evocation", "classes":["Wizard","Sorcerer"], "desc":"A lance of prismatic energy…" }'
          onSubmit={() => submit()} deletable={deleteId != null}
          onDelete={() => remove(deleteId, f.name)}
          onJson={(obj) => { const { name, source, data: d, ...rest } = obj; submit({ name, source, data: d || rest }); }} />
      </div>
      <Msg msg={msg} />
      <ImportedList title="Imported spells"
        items={Object.entries(customSpells).map(([n, s]) => ({ name: n, source: s.source, id: s.customId, levelTag: levelLabel(Number(s.level) || 0) }))}
        onEdit={(it) => fill(it.name)}
        onDelete={(it) => remove(it.id, it.name)} />
    </div>
  );
}

// ---------- Monster form (DM Screen library) ----------
const MONSTER_BLANK = monsterDataToForm({ abilities: { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 } });

function MonsterForm({ registry, reload, editTarget }) {
  const customMonsters = registry.customMonsters || {};
  const builtin = (registry.data.monsterData || []).reduce((acc, m) => { acc[m.name] = m; return acc; }, {});
  const [f, setF] = useState(MONSTER_BLANK);
  const [msg, setMsg] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const fill = (name) => {
    const imp = customMonsters[name];
    const data = imp || (builtin[name] && builtin[name].data);
    if (!data) return;
    // Built-in seed data has no `data.name` (the name is the top-level key),
    // so set it explicitly from the known key rather than trusting the
    // converted form.
    setF({ ...monsterDataToForm(data), name });
    setDeleteId(imp ? imp.customId : null);
    setMsg(loadedMsg(name));
  };
  useEffect(() => { if (editTarget) fill(editTarget); }, [editTarget]);

  const submit = async (payload) => {
    try {
      if (!payload) {
        const data = monsterFormToData(f);
        if (!data.name) throw new Error('Monster name is required.');
        payload = { name: data.name, source: f.source || 'Homebrew', data };
      }
      if (!payload.name) throw new Error('Monster name is required.');
      if (!payload.data || typeof payload.data !== 'object') throw new Error('Monster data is required.');
      const source = importedAs(payload.source);
      await api.monsters.import({ name: payload.name, source, data: payload.data });
      setMsg({ kind: 'ok', text: `Imported "${payload.name}" (${source}) — searchable in the DM Screen library.` });
      reload();
    } catch (err) {
      setMsg({ kind: 'err', text: 'Import failed: ' + err.message });
    }
  };

  const remove = async (id, name) => {
    if (!window.confirm(`Remove imported monster "${name}"?`)) return;
    await api.monsters.delete(id);
    setDeleteId(null);
    setMsg({ kind: 'ok', text: `Deleted "${name}".` });
    reload();
  };

  const names = new Set([...Object.keys(builtin), ...Object.keys(customMonsters)]);
  const editOptions = [...names].sort().map((n) => {
    const imp = customMonsters[n];
    const cr = (imp || builtin[n].data || {}).cr;
    return { value: n, label: `${n}${cr ? ' · CR ' + cr : ''} · ${imp ? imp.source + ' · imported' : 'built-in'}` };
  });

  const field = (label, key, placeholder, full) => (
    <div className={'set-field' + (full ? ' full' : '')}><label>{label}</label>
      <input value={f[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} /></div>
  );
  const area = (label, key, placeholder) => (
    <div className="set-field full"><label>{label}</label>
      <textarea className="import-ta" style={{ minHeight: 60 }} value={f[key]}
        onChange={(e) => set(key, e.target.value)} placeholder={placeholder} />
      <div className="import-note">One per line: <span className="hl">name | description</span>.</div>
    </div>
  );

  return (
    <div className="panel">
      <h2><span>Import Monster</span><span className="rune">🐉</span></h2>
      <div className="picker-hint">Add a monster for the <span className="hl">DM Screen</span> library. Monsters are saved to the shared database but only ever appear when a DM looks them up — never on the public Library. Re-importing with the <span className="hl">same name overwrites</span> it.</div>
      <div className="import-grid">
        <EditSelect note={<span>Pick any built-in or imported monster to load it into the form.</span>}
          options={editOptions} onPick={fill} />
        {field('Monster Name', 'name', 'e.g. Adult Copper Dragon', true)}
        <div className="set-field"><label>Source</label><SourceSelect value={f.source} onChange={(v) => set('source', v)} /></div>
        {field('Size', 'size', 'Gargantuan')}
        {field('Type', 'type', 'Dragon')}
        {field('Alignment', 'alignment', 'Chaotic Good')}
        {field('Armor Class', 'ac', '18')}
        {field('AC Note', 'acNote', 'natural armor')}
        {field('Max HP', 'hpMax', '184')}
        {field('HP Formula', 'hpFormula', '16d12 + 80')}
        {field('Speed', 'speed', '40 ft., fly 80 ft.', true)}
        {field('STR', 'str', '23')}
        {field('DEX', 'dex', '12')}
        {field('CON', 'con', '21')}
        {field('INT', 'int', '18')}
        {field('WIS', 'wis', '15')}
        {field('CHA', 'cha', '17')}
        {field('Saving Throws', 'saves', 'Dex +6, Con +10', true)}
        {field('Skills', 'skills', 'Perception +12', true)}
        {field('Damage Resistances', 'resistances', '')}
        {field('Damage Immunities', 'immunities', 'Acid')}
        {field('Damage Vulnerabilities', 'vulnerabilities', '')}
        {field('Condition Immunities', 'conditionImmunities', '')}
        {field('Senses', 'senses', 'Darkvision 120 ft., PP 22', true)}
        {field('Languages', 'languages', 'Common, Draconic', true)}
        {field('Challenge Rating', 'cr', '14')}
        {field('Proficiency Bonus', 'pb', '+5')}
        {field('XP', 'xp', '11,500')}
        {field('Legendary Action Count', 'legendaryCount', '3')}
        {field('Legendary Actions Note', 'legendaryNote', 'The dragon can take 3 legendary actions…', true)}
        {area('Traits', 'traits', 'Legendary Resistance | If it fails a save, it can succeed instead.')}
        {area('Actions', 'actions', 'Bite | +11 to hit, 17 (2d10 + 6) piercing damage.')}
        {area('Reactions', 'reactions', '')}
        {area('Legendary Actions', 'legendary', 'Detect | The dragon makes a Perception check.')}
        {area('Items', 'items', 'Longsword | A plain steel blade.')}
        <div className="set-field full"><label>Lore</label>
          <textarea className="import-ta" style={{ minHeight: 60 }} value={f.lore}
            onChange={(e) => set('lore', e.target.value)} placeholder="Flavor / description." /></div>
        <SubmitRow label="Import Monster" jsonLabel="Monster JSON" setMsg={setMsg}
          jsonPlaceholder='{ "name":"Adult Copper Dragon", "source":"5E", "data":{ "size":"Gargantuan", "type":"Dragon", "ac":18, "hpMax":184, "abilities":{"str":23,"dex":12,"con":21,"int":18,"wis":15,"cha":17} } }'
          onSubmit={() => submit()} onJson={(obj) => submit(obj)}
          deletable={deleteId != null} onDelete={() => remove(deleteId, f.name)} />
      </div>
      <Msg msg={msg} />
      <ImportedList title="Imported monsters — searchable on the DM Screen." onEdit={(it) => fill(it.name)}
        onDelete={(it) => remove(it.id, it.name)}
        items={Object.entries(customMonsters).map(([n, s]) => ({ name: n, source: s.source, id: s.customId, levelTag: s.cr ? 'CR ' + s.cr : '' }))} />
    </div>
  );
}

// ---------- Bulk import ----------
function BulkImport({ registry, reload }) {
  const [text, setText] = useState('');
  const [msg, setMsg] = useState(null);
  const fileRef = useRef(null);

  const submit = async () => {
    const raw = text.trim();
    if (!raw) { setMsg({ kind: 'err', text: 'Paste JSON containing one or more entries to import.' }); return; }
    let root;
    try { root = JSON.parse(raw); }
    catch (e) { setMsg({ kind: 'err', text: 'Invalid JSON: ' + e.message }); return; }

    const collected = collectBulkEntries(root);
    if (!collected.length) {
      setMsg({ kind: 'err', text: 'No importable entries found. Provide an array of typed entries, a { "classes":[…], "spells":[…] } object, or a single entry.' });
      return;
    }
    const { queue, problems, dupes } = prepareBulkQueue(collected);
    if (!queue.length) {
      setMsg({ kind: 'err', text: 'Nothing could be imported. ' + problems.join(' ') });
      return;
    }

    setMsg({ kind: 'ok', text: `Importing ${queue.length} entr${queue.length === 1 ? 'y' : 'ies'}…` });
    // Track names imported this batch so a subclass can attach to a parent
    // class defined in the same payload (the DB has it by the time we check).
    const data = registry.data;
    const knownClasses = new Set(Object.keys(data.classData));
    const knownSpecies = new Set(Object.keys(data.speciesData));
    const counts = {};
    const failed = [];
    for (const e of queue) {
      const source = importedAs(e.source);
      try {
        if (e.type === 'class') { await api.classes.import({ name: e.name, source, data: e.data }); knownClasses.add(e.name); }
        else if (e.type === 'species') { await api.species.import({ name: e.name, source, data: e.data }); knownSpecies.add(e.name); }
        else if (e.type === 'subclass') {
          if (!knownClasses.has(e.parent)) throw new Error(`unknown parent class "${e.parent}"`);
          await api.subclasses.import({ parent: e.parent, name: e.name, source, data: e.data });
        } else if (e.type === 'subspecies') {
          if (!knownSpecies.has(e.parent)) throw new Error(`unknown parent species "${e.parent}"`);
          await api.subspecies.import({ parent: e.parent, name: e.name, source, data: e.data });
        } else if (e.type === 'spell') { await api.spells.import({ name: e.name, source, data: e.data }); }
        counts[e.type] = (counts[e.type] || 0) + 1;
      } catch (err) { failed.push(`${e.type} "${e.name}": ${err.message}`); }
    }
    reload();

    const PLURALS = { class: 'classes', species: 'species', subclass: 'subclasses', subspecies: 'subspecies', spell: 'spells' };
    const done = Object.values(counts).reduce((a, b) => a + b, 0);
    const breakdown = Object.keys(counts).sort((a, b) => BULK_TYPE_ORDER[a] - BULK_TYPE_ORDER[b])
      .map((t) => `${counts[t]} ${counts[t] > 1 ? PLURALS[t] : t}`).join(', ');
    const lines = [];
    lines.push(`Imported ${done} entr${done === 1 ? 'y' : 'ies'}${breakdown ? ` — ${breakdown}` : ''}.`);
    if (dupes) lines.push(`${dupes} in-batch duplicate${dupes > 1 ? 's' : ''} merged by type + name.`);
    if (problems.length) lines.push(`Skipped ${problems.length}: ${problems.join('; ')}`);
    if (failed.length) lines.push(`Failed ${failed.length}: ${failed.join('; ')}`);
    setMsg({ kind: failed.length || problems.length ? 'err' : 'ok', text: lines.join(' ') });
  };

  const exportLibrary = () => {
    const entries = exportLibraryEntries(registry.data, registry.customSpells);
    setText(JSON.stringify(entries, null, 2));
    setMsg(entries.length
      ? { kind: 'ok', text: `Exported ${entries.length} imported entr${entries.length === 1 ? 'y' : 'ies'} into the box.` }
      : { kind: 'err', text: 'No imported entries to export yet.' });
  };

  const loadFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setText(String(reader.result || ''));
      setMsg({ kind: 'ok', text: `Loaded "${file.name}" — review it, then press Import All.` });
    };
    reader.onerror = () => setMsg({ kind: 'err', text: `Could not read "${file.name}".` });
    reader.readAsText(file);
  };

  return (
    <div className="panel">
      <h2><span>Bulk Import — JSON</span><span className="rune">◈</span></h2>
      <div className="picker-hint">Paste or load a JSON file holding <span className="hl">many entries at once</span> — classes, species, subclasses, subspecies, and spells mixed together. Entries are <span className="hl">deduplicated by type and name</span>: importing a name that already exists overwrites it rather than creating a copy.</div>
      <div className="import-grid">
        <div className="set-field full"><label>Library JSON</label>
          <textarea className="import-ta" style={{ minHeight: 150 }} value={text} onChange={(e) => setText(e.target.value)}
            placeholder={'[\n  { "type":"class",  "name":"Artificer", "source":"5E", "data":{ "hitDie":8, "saves":["con","int"] } },\n  { "type":"spell",  "name":"Mend Bone", "source":"Homebrew", "data":{ "level":2, "classes":["Cleric"] } }\n]'} />
          <div className="import-note">Accepts an <span className="hl">array</span> of entries (each with a <span className="hl">type</span>), a grouped object like <span className="hl">{'{ "classes":[…], "spells":[…] }'}</span>, or a single entry. Subclasses and subspecies need a <span className="hl">parent</span>. When <span className="hl">type</span> is omitted it is inferred from the fields.</div>
        </div>
        <div className="full">
          <button className="add-btn" onClick={submit}>+ Import All</button>
          <button className="pbtn" style={{ marginLeft: 8 }} onClick={() => fileRef.current?.click()}>Load file…</button>
          <input ref={fileRef} type="file" accept=".json,application/json" style={{ display: 'none' }}
            onChange={(e) => { loadFile(e.target.files?.[0]); e.target.value = ''; }} />
          <button className="pbtn" style={{ marginLeft: 8 }} title="Fill the box with every imported entry, ready to save or re-import elsewhere" onClick={exportLibrary}>Export imported</button>
        </div>
      </div>
      <Msg msg={msg} />
    </div>
  );
}

// ---------- JSON reference (static content, shared with the legacy partial) ----------
function JsonReference() {
  const ref = useRef(null);
  useEffect(() => {
    // The legacy collapsible-panel behavior: clicking a .collapsible header
    // folds the panel to just its title.
    const headers = ref.current?.querySelectorAll('.panel.collapsible > h2') || [];
    const onClick = (e) => e.currentTarget.parentElement.classList.toggle('collapsed');
    headers.forEach((h) => h.addEventListener('click', onClick));
    return () => headers.forEach((h) => h.removeEventListener('click', onClick));
  }, []);
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: referenceHtml }} />;
}

// ---------- Page ----------
export default function ImportPage() {
  const { registry, error, reload } = useRegistry();
  const [tab, setTab] = useState('classes');
  const [showSubclass, setShowSubclass] = useState(false);
  const [showSubspecies, setShowSubspecies] = useState(false);
  const [editTargets, setEditTargets] = useState({});

  // Deep link from the Library windows: /import?edit=<type>:<key>.
  useEffect(() => {
    if (!registry) return;
    const param = new URLSearchParams(window.location.search).get('edit');
    if (!param) return;
    const i = param.indexOf(':');
    if (i < 1) return;
    const type = param.slice(0, i), key = decodeURIComponent(param.slice(i + 1));
    const splitKey = () => { const j = key.indexOf('::'); return j > 0 ? { parent: key.slice(0, j), name: key.slice(j + 2) } : null; };
    if (type === 'class') { setTab('classes'); setEditTargets({ class: key }); }
    else if (type === 'subclass') { setTab('classes'); setShowSubclass(true); setEditTargets({ subclass: splitKey() }); }
    else if (type === 'species') { setTab('species'); setEditTargets({ species: key }); }
    else if (type === 'subspecies') { setTab('species'); setShowSubspecies(true); setEditTargets({ subspecies: splitKey() }); }
    else if (type === 'spell') { setTab('spells'); setEditTargets({ spell: key }); }
  }, [registry]);

  return (
    <Layout page="import" title="Import">
      <nav className="tab-bar">
        {IMPORT_TABS.map((t) => (
          <button key={t.id} className={'tab-btn' + (tab === t.id ? ' active' : '')} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </nav>

      {error && <div className="panel"><div className="action-empty">Could not load imported content: {error}</div></div>}
      {!registry && !error && <div className="panel"><div className="action-empty">Loading…</div></div>}

      {registry && (
        <>
          <div className={'tab-pane' + (tab === 'classes' ? ' active' : '')}>
            {tab === 'classes' && <>
              <ClassForm registry={registry} reload={reload} editTarget={editTargets.class} />
              <div className="subimport-toggle">
                <button className="pbtn" aria-expanded={showSubclass} onClick={() => setShowSubclass(!showSubclass)}>
                  {showSubclass ? '− Hide Subclass' : '+ Add a Subclass'}
                </button>
                <span className="subimport-hint">Attach a subclass to any class.</span>
              </div>
              {showSubclass && <div className="subimport-wrap">
                <SubclassForm registry={registry} reload={reload} editTarget={editTargets.subclass} />
              </div>}
            </>}
          </div>
          <div className={'tab-pane' + (tab === 'species' ? ' active' : '')}>
            {tab === 'species' && <>
              <SpeciesForm registry={registry} reload={reload} editTarget={editTargets.species} />
              <div className="subimport-toggle">
                <button className="pbtn" aria-expanded={showSubspecies} onClick={() => setShowSubspecies(!showSubspecies)}>
                  {showSubspecies ? '− Hide Subspecies' : '+ Add a Subspecies'}
                </button>
                <span className="subimport-hint">Attach a subspecies to any species.</span>
              </div>
              {showSubspecies && <div className="subimport-wrap">
                <SubspeciesForm registry={registry} reload={reload} editTarget={editTargets.subspecies} />
              </div>}
            </>}
          </div>
          <div className={'tab-pane' + (tab === 'backgrounds' ? ' active' : '')}>
            {tab === 'backgrounds' && <BackgroundForm registry={registry} reload={reload} />}
          </div>
          <div className={'tab-pane' + (tab === 'spells' ? ' active' : '')}>
            {tab === 'spells' && <div className="grid grid-half">
              <SpellForm registry={registry} reload={reload} editTarget={editTargets.spell} />
            </div>}
          </div>
          <div className={'tab-pane' + (tab === 'monsters' ? ' active' : '')}>
            {tab === 'monsters' && <MonsterForm registry={registry} reload={reload} editTarget={editTargets.monster} />}
          </div>
          <div className={'tab-pane' + (tab === 'bulk' ? ' active' : '')}>
            {tab === 'bulk' && <BulkImport registry={registry} reload={reload} />}
          </div>
          <div className={'tab-pane' + (tab === 'reference' ? ' active' : '')}>
            {tab === 'reference' && <JsonReference />}
          </div>
        </>
      )}

      <div className="footer-note">Imports are saved to the shared database and available to every character.</div>
    </Layout>
  );
}
