import { useEffect, useState } from 'react';
import { esc } from '../../rules/core.js';
import { normalizeChoice } from '../../rules/classes.js';
import { fightingStyleByName } from '../../rules/builtin-data.js';

// Feature-choice pick-one control + its "Other…" custom popup. Ports
// choiceControlHtml / onFeatureChoiceChange / the choice modal from app.js.
// Shared by the Features and Settings tabs; because both read from the same
// store, committing a pick re-renders every rendered control automatically
// (replacing the legacy syncChoiceControls DOM sweep).

const CHOICE_OTHER = '__other';
const choiceInfo = (name) => (fightingStyleByName ? fightingStyleByName(name) : null);

function ChoicePreview({ choice }) {
  if (!choice || !choice.name) return null;
  if (choice.custom) {
    return (
      <>
        <div className="nr-meta"><b className="fc-custom-name">{choice.name}</b> <span className="chip-abbr">custom</span></div>
        {choice.desc && <div className="feat-desc">{choice.desc}</div>}
      </>
    );
  }
  const info = choiceInfo(choice.name);
  if (!info) return null;
  return (
    <>
      <div className="feat-desc">{info.desc}</div>
      <div className="nr-meta">Available to: {info.classes.join(', ')}</div>
    </>
  );
}

export function ChoiceModal({ featureLabel, current, onSave, onClear, onClose }) {
  const [name, setName] = useState(current && current.custom ? current.name : '');
  const [desc, setDesc] = useState(current && current.custom ? current.desc : '');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const save = () => {
    if (!name.trim()) { setStatus('Give it a name first.'); return; }
    onSave(name.trim(), desc.trim());
  };

  return (
    <div className="app-modal-backdrop open" aria-hidden="false" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="app-modal panel" role="dialog" aria-modal="true">
        <div className="app-modal-head">
          <span className="app-modal-heading">Custom Option</span>
          <span className="app-modal-date">{featureLabel}</span>
          <button className="app-modal-close" type="button" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <div className="app-modal-body">
          <label className="app-field"><span className="app-field-label">Name</span>
            <input type="text" placeholder="Name your option" value={name} onChange={(e) => setName(e.target.value)} autoFocus /></label>
          <label className="app-field"><span className="app-field-label">Description</span>
            <textarea placeholder="What does it do? (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} /></label>
        </div>
        <div className="app-modal-foot">
          <button className="pbtn danger" type="button" onClick={onClear}>Clear pick</button>
          <span className="app-modal-status">{status}</span>
          <button className="add-btn" type="button" onClick={save}>Save</button>
        </div>
      </div>
    </div>
  );
}

// One pick-one control. `entryIndex` indexes character.classes; `cf` is
// { owner, f, key }; `choice` is the current normalized pick. update() mutates
// the store; onOpenModal(label, current) raises the custom popup.
export default function ChoiceControl({ entryIndex, cf, choice, showLabel, update, onOpenModal }) {
  const isCustom = !!(choice && choice.custom);
  const value = choice ? (isCustom ? CHOICE_OTHER : choice.name) : '';
  const label = cf.f.name + ' — ' + cf.owner;

  const onChange = (v) => {
    if (v === CHOICE_OTHER) {
      update((d) => {
        const entry = d.classes[entryIndex];
        entry.featureChoices = entry.featureChoices || {};
        const prev = normalizeChoice(entry.featureChoices[cf.key]);
        if (!prev || !prev.custom) entry.featureChoices[cf.key] = { custom: true, name: '', desc: '' };
      });
      onOpenModal(label, cf.key, entryIndex);
      return;
    }
    update((d) => {
      const entry = d.classes[entryIndex];
      entry.featureChoices = entry.featureChoices || {};
      if (v) entry.featureChoices[cf.key] = v;
      else delete entry.featureChoices[cf.key];
    });
  };

  return (
    <div className={'feat-choice-ctl' + (choice && choice.name ? '' : ' pending')}>
      <div className="fc-head">
        {showLabel && (
          <label className="feat-choice-label" title={cf.f.desc || ''}>
            {cf.f.name} <span className="chip-abbr">{cf.owner} · Lv {cf.f.lv}</span>
          </label>
        )}
        <select className="feat-choice" value={value} onChange={(e) => onChange(e.target.value)}>
          <option value="">— choose —</option>
          {cf.f.choices.map((c) => <option key={c} value={c}>{c}</option>)}
          <option value={CHOICE_OTHER}>{isCustom && choice.name ? 'Other… — ' + choice.name : 'Other…'}</option>
        </select>
        {isCustom && <button type="button" className="pbtn fc-edit" onClick={() => onOpenModal(label, cf.key, entryIndex)}>Edit note…</button>}
      </div>
      <div className="feat-choice-preview"><ChoicePreview choice={choice} /></div>
    </div>
  );
}

export { CHOICE_OTHER };
