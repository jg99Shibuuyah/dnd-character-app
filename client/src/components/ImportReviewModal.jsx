import { useState } from 'react';
import { refKey } from '../rules/import-linking.js';

// Review step for character import: near-matched references pick a library
// entry (or keep the original name); missing references can create a stub
// Homebrew library entry. Opens only when the report has non-exact entries.
// Spec: docs/superpowers/specs/2026-07-24-import-auto-linking-design.md

const TYPE_LABELS = {
  class: 'Classes', subclass: 'Subclasses', species: 'Species',
  subspecies: 'Subspecies', background: 'Backgrounds', spell: 'Spells'
};
const TYPE_ORDER = ['class', 'subclass', 'species', 'subspecies', 'background', 'spell'];

export default function ImportReviewModal({ report, busy, error, onCancel, onConfirm }) {
  const review = report.filter((r) => r.status !== 'exact');
  const [choices, setChoices] = useState(() => {
    const m = {};
    review.forEach((r) => {
      m[refKey(r)] = r.status === 'near'
        ? { action: 'link', linkTo: r.candidates[0].name }
        : { action: 'stub' };
    });
    return m;
  });
  const set = (r, patch) => setChoices((m) => ({ ...m, [refKey(r)]: { ...m[refKey(r)], ...patch } }));
  const confirm = () => onConfirm(review.map((r) => ({ ...r, ...choices[refKey(r)] })));
  const exactCount = report.length - review.length;

  return (
    <div className="app-modal-backdrop open" aria-hidden="false"
      onClick={(e) => { if (e.target === e.currentTarget && !busy) onCancel(); }}>
      <div className="app-modal panel import-review" role="dialog" aria-modal="true">
        <div className="app-modal-head">
          <span className="app-modal-heading">Review Imported References</span>
          <button className="app-modal-close" type="button" aria-label="Close" onClick={onCancel} disabled={busy}>✕</button>
        </div>
        <div className="app-modal-body">
          <div className="import-note">
            {exactCount} reference{exactCount === 1 ? '' : 's'} matched the library exactly.
            Review the rest below — link near matches, or create stub Homebrew entries to fill in later on the Import page.
          </div>
          {TYPE_ORDER.filter((t) => review.some((r) => r.type === t)).map((t) => (
            <div className="ir-group" key={t}>
              <h3>{TYPE_LABELS[t]}</h3>
              {review.filter((r) => r.type === t).map((r) => {
                const c = choices[refKey(r)];
                return (
                  <div className="ir-row" key={refKey(r)}>
                    <span className="ir-name">{r.name}{r.parent ? <span className="ir-parent"> ({r.parent})</span> : null}</span>
                    {r.status === 'near' ? (
                      <select value={c.action === 'link' ? c.linkTo : ''}
                        onChange={(e) => set(r, e.target.value
                          ? { action: 'link', linkTo: e.target.value }
                          : { action: 'keep', linkTo: '' })}>
                        {r.candidates.map((cand) => (
                          <option key={cand.name} value={cand.name}>Link to “{cand.name}”</option>
                        ))}
                        <option value="">Keep “{r.name}” as-is</option>
                      </select>
                    ) : (
                      <label className="ir-stub">
                        <input type="checkbox" checked={c.action === 'stub'}
                          onChange={(e) => set(r, { action: e.target.checked ? 'stub' : 'keep' })} />
                        create stub library entry
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          {error ? <div className="import-msg err">{error}</div> : null}
        </div>
        <div className="app-modal-foot">
          <button className="add-btn" onClick={confirm} disabled={busy}>{busy ? 'Importing…' : 'Import Character'}</button>
          <button className="pbtn" style={{ marginLeft: 8 }} onClick={onCancel} disabled={busy}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
