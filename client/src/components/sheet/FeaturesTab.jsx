import { useState } from 'react';
import { useCharacter } from '../../state/characterStore.jsx';
import { pickedClasses, choiceFeaturesFor, chosenFeatureOption, hasChoices, featureChoiceKey, normalizeChoice } from '../../rules/classes.js';
import ChoiceControl, { ChoiceModal } from './ChoiceControl.jsx';

// Features & Traits tab (ports buildClassFeatures / buildSpeciesTraits /
// buildBackgroundFeature / renderOtherFeatures + the custom-feature composer +
// personality). Class/subclass features render read-only with an inline pick-one
// control for choice features; custom entries append under a divider per list.

const CUSTOM_FEAT_CATS = { class: 'Class Features', species: 'Species Traits', other: 'Other Features & Traits' };
const sourceKey = (src) => src === '5E' ? '5e' : src === '5E (legacy)' ? '5eleg' : src === '5.5E' ? '55e' : 'homebrew';
const SourceTag = ({ src }) => src ? <span className={`src-tag src-${sourceKey(src)}`}>{src}</span> : null;
const subKey = (parent, name) => parent + '::' + name;

function FeatItem({ f, choice, choiceCtx }) {
  const showPicker = choiceCtx && hasChoices(f);
  return (
    <div className="feat-item">
      <div className="feat-head">
        <span className="f-lvl">LV {f.lv}</span>
        <span className="f-name">{f.name}</span>
        {f.use && f.use !== 'passive' && <span className="action-badge">{f.use}{f.cost ? ' · ' + f.cost : ''}</span>}
        {hasChoices(f) && !showPicker && choice && choice.name && <span className="choice-badge">{choice.name}</span>}
      </div>
      {f.desc && <div className="feat-desc">{f.desc}</div>}
      {showPicker && (
        <ChoiceControl entryIndex={choiceCtx.i} cf={{ key: featureChoiceKey(choiceCtx.owner, f.name), owner: choiceCtx.owner, f }}
          choice={choice} showLabel={false} update={choiceCtx.update} onOpenModal={choiceCtx.onOpenModal} />
      )}
    </div>
  );
}

function CustomFeatRow({ cf, onEdit, onDelete }) {
  return (
    <div className="feat-item">
      <div className="feat-head">
        <span className="f-name">{cf.name}</span>
        <span className="action-badge dim">custom</span>
        <span className="cf-edit" title="Edit this feature" onClick={() => onEdit(cf.id)}>✎</span>
        <span className="row-del cf-del" title="Remove this feature" onClick={() => onDelete(cf.id)}>✕</span>
      </div>
      {cf.desc && <div className="feat-desc">{cf.desc}</div>}
    </div>
  );
}

export default function FeaturesTab() {
  const { character, data, update } = useCharacter();
  const [modal, setModal] = useState(null); // { label, key, entryIndex }
  const [cf, setCf] = useState({ cat: 'other', name: '', desc: '', editingId: null });
  const [cfMsg, setCfMsg] = useState(null);

  const picked = pickedClasses(character, data);
  const customFeatures = character.customFeatures || [];
  const customFor = (cat) => customFeatures.filter((f) => f.cat === cat);

  const onOpenModal = (label, key, entryIndex) => setModal({ label, key, entryIndex });
  const choiceCtx = { update, onOpenModal };

  const saveChoiceModal = (name, desc) => {
    update((d) => {
      const entry = d.classes[modal.entryIndex];
      entry.featureChoices = entry.featureChoices || {};
      entry.featureChoices[modal.key] = { custom: true, name, desc };
    });
    setModal(null);
  };
  const clearChoiceModal = () => {
    update((d) => {
      const entry = d.classes[modal.entryIndex];
      if (entry.featureChoices) { delete entry.featureChoices[modal.key]; if (!Object.keys(entry.featureChoices).length) delete entry.featureChoices; }
    });
    setModal(null);
  };
  const modalCurrent = modal ? normalizeChoice((character.classes[modal.entryIndex]?.featureChoices || {})[modal.key]) : null;

  // ---- Custom feature composer ----
  const submitCf = () => {
    if (!cf.name.trim()) { setCfMsg({ kind: 'err', text: 'Give the feature a name.' }); return; }
    update((d) => {
      d.customFeatures = d.customFeatures || [];
      if (cf.editingId) {
        const it = d.customFeatures.find((f) => f.id === cf.editingId);
        if (it) { it.cat = cf.cat; it.name = cf.name.trim(); it.desc = cf.desc.trim(); }
      } else {
        d.customFeatures.push({ id: 'cf' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), cat: cf.cat, name: cf.name.trim(), desc: cf.desc.trim() });
      }
    });
    setCfMsg({ kind: 'ok', text: `${cf.editingId ? 'Saved' : 'Added'} "${cf.name.trim()}" to ${CUSTOM_FEAT_CATS[cf.cat]}.` });
    setCf({ cat: 'other', name: '', desc: '', editingId: null });
  };
  const editCf = (id) => {
    const it = customFeatures.find((f) => f.id === id);
    if (!it) return;
    setCf({ cat: it.cat, name: it.name, desc: it.desc || '', editingId: id });
    setCfMsg({ kind: 'ok', text: `Editing "${it.name}" — change it and press Save Changes.` });
  };
  const deleteCf = (id) => {
    const it = customFeatures.find((f) => f.id === id);
    if (!it || !window.confirm(`Remove "${it.name}" from ${CUSTOM_FEAT_CATS[it.cat] || 'your features'}?`)) return;
    update((d) => { d.customFeatures = d.customFeatures.filter((f) => f.id !== id); });
    if (cf.editingId === id) { setCf({ cat: 'other', name: '', desc: '', editingId: null }); setCfMsg(null); }
  };

  const CustomDivider = ({ cat }) => customFor(cat).length ? (
    <>
      <div className="subrace-divider">Custom <span className="chip-abbr">added by you</span></div>
      {customFor(cat).map((c) => <CustomFeatRow key={c.id} cf={c} onEdit={editCf} onDelete={deleteCf} />)}
    </>
  ) : null;

  const trait = (label, field) => (
    <>
      <label style={{ fontFamily: "'Orbitron', sans-serif", fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--ink-soft)' }}>{label}</label>
      <textarea className="trait" style={{ minHeight: 36 }} value={character[field] || ''} onChange={(e) => update((d) => { d[field] = e.target.value; })} />
    </>
  );

  const sd = data.speciesData[character.race];
  const ss = character.subrace ? data.subspeciesData[subKey(character.race, character.subrace)] : null;
  const bd = data.backgroundData[character.background];

  return (
    <div className="tab-pane active">
      <div className="grid grid-half">
        <div>
          <div className="panel">
            <h2><span>Class Features</span><span className="rune">✦</span></h2>
            <div>
              {picked.length === 0 && <div className="action-empty">Select a class in Settings to see its features here.</div>}
              {picked.map((entry) => {
                const cd = data.classData[entry.name];
                const lvl = entry.level || 1;
                const all = cd.features || [];
                const feats = all.filter((f) => f.lv <= lvl);
                const upcoming = all.length - feats.length;
                const ci = character.classes.indexOf(entry);
                const sc = entry.subclass ? data.subclassData[subKey(entry.name, entry.subclass)] : null;
                const sfeatsAll = (sc && sc.features) || [];
                const sfeats = sfeatsAll.filter((f) => f.lv <= lvl);
                return (
                  <div key={ci + entry.name}>
                    <div className="known-spell-group-label">{entry.name} {entry.level}</div>
                    {feats.length
                      ? feats.map((f, k) => <FeatItem key={k} f={f} choice={chosenFeatureOption(entry, entry.name, f)} choiceCtx={{ ...choiceCtx, i: ci, owner: entry.name }} />)
                      : <div className="action-empty">No features at this level.</div>}
                    {upcoming > 0 && <div className="action-empty">+ {upcoming} more at higher {entry.name} levels.</div>}
                    {entry.subclass && (
                      <>
                        <div className="subclass-label">↳ {entry.subclass}{sc && <> <SourceTag src={sc.source} /></>}</div>
                        {sfeatsAll.length === 0
                          ? <div className="action-empty">No feature detail imported — add it on the Library tab.</div>
                          : sfeats.length
                            ? sfeats.map((f, k) => <FeatItem key={k} f={f} choice={chosenFeatureOption(entry, entry.subclass, f)} choiceCtx={{ ...choiceCtx, i: ci, owner: entry.subclass }} />)
                            : <div className="action-empty">No subclass features unlocked at this level yet.</div>}
                        {sfeatsAll.length - sfeats.length > 0 && <div className="action-empty">+ {sfeatsAll.length - sfeats.length} more at higher levels.</div>}
                      </>
                    )}
                  </div>
                );
              })}
              <CustomDivider cat="class" />
            </div>
          </div>

          <div className="panel">
            <h2><span>Species Traits</span><span className="rune">✦</span></h2>
            <div>
              {!sd
                ? <div className="action-empty">{character.race ? `Custom species — import "${character.race}" on the Library tab to list its traits here.` : 'Pick a species in Settings to see its traits here.'}</div>
                : <>
                  {(sd.traits || []).map((t, k) => (
                    <div key={k} className="feat-item"><div className="feat-head"><span className="f-name">{t.name}</span></div>{t.desc && <div className="feat-desc">{t.desc}</div>}</div>
                  ))}
                  {ss && Array.isArray(ss.traits) && ss.traits.length > 0 && (
                    <>
                      <div className="subrace-divider">{character.subrace} <span className="chip-abbr">subrace</span></div>
                      {ss.traits.map((t, k) => <div key={k} className="feat-item"><div className="feat-head"><span className="f-name">{t.name}</span></div>{t.desc && <div className="feat-desc">{t.desc}</div>}</div>)}
                    </>
                  )}
                </>}
              <CustomDivider cat="species" />
            </div>
          </div>

          <div className="panel">
            <h2><span>Background</span><span className="rune">✦</span></h2>
            <div>
              {!bd
                ? <div className="action-empty">{character.background ? `Custom background — import "${character.background}" on the Import page to list its feature here.` : 'Pick a background in Settings to see its feature here.'}</div>
                : <>
                  {bd.feature && bd.feature.name && (
                    <div className="feat-item"><div className="feat-head"><span className="f-name">{bd.feature.name}</span><span className="action-badge dim">background</span></div>{bd.feature.desc && <div className="feat-desc">{bd.feature.desc}</div>}</div>
                  )}
                  {bd.skills && bd.skills.length > 0 && <div className="feat-item"><div className="feat-head"><span className="f-name">Skill Proficiencies</span></div><div className="feat-desc">{bd.skills.join(', ')} — applied automatically on the Skills tab.</div></div>}
                  {bd.equipment && <div className="feat-item"><div className="feat-head"><span className="f-name">Equipment</span></div><div className="feat-desc">{bd.equipment}</div></div>}
                </>}
            </div>
          </div>

          <div className="panel">
            <h2><span>Other Features &amp; Traits</span><span className="rune">✦</span></h2>
            <div>
              {customFor('other').length === 0
                ? <div className="action-empty">Nothing here yet — add a feat, boon, or custom trait below.</div>
                : customFor('other').map((c) => <CustomFeatRow key={c.id} cf={c} onEdit={editCf} onDelete={deleteCf} />)}
            </div>
          </div>

          <div className="panel">
            <h2><span>Add Feature</span><span className="rune">✦</span></h2>
            <div className="picker-hint">Add a feat, boon, or custom trait. <span className="hl">Goes in</span> picks which list above it joins.</div>
            <div className="import-grid">
              <div className="set-field full"><label>Goes In</label>
                <select value={cf.cat} onChange={(e) => setCf((c) => ({ ...c, cat: e.target.value }))}>
                  <option value="class">Class Features</option>
                  <option value="species">Species Traits</option>
                  <option value="other">Other Features &amp; Traits</option>
                </select>
              </div>
              <div className="set-field full"><label>Name</label><input placeholder="e.g. Lucky" value={cf.name} onChange={(e) => setCf((c) => ({ ...c, name: e.target.value }))} /></div>
              <div className="set-field full"><label>Description</label>
                <textarea className="import-ta" style={{ minHeight: 60 }} placeholder="What does it do?" value={cf.desc} onChange={(e) => setCf((c) => ({ ...c, desc: e.target.value }))} /></div>
              <div className="full">
                <button className="add-btn" onClick={submitCf}>{cf.editingId ? 'Save Changes' : '+ Add Feature'}</button>
                {cf.editingId && <button className="pbtn" style={{ marginLeft: 8 }} onClick={() => { setCf({ cat: 'other', name: '', desc: '', editingId: null }); setCfMsg(null); }}>Cancel</button>}
              </div>
            </div>
            {cfMsg && <div className={'import-msg ' + cfMsg.kind}>{cfMsg.text}</div>}
          </div>
        </div>

        <div className="panel">
          <h2><span>Personality</span><span className="rune">✦</span></h2>
          {trait('Traits', 'persTraits')}
          {trait('Ideals', 'persIdeals')}
          {trait('Bonds', 'persBonds')}
          {trait('Flaws', 'persFlaws')}
        </div>
      </div>

      {modal && <ChoiceModal featureLabel={modal.label} current={modalCurrent} onSave={saveChoiceModal} onClear={clearChoiceModal} onClose={() => setModal(null)} />}
    </div>
  );
}
