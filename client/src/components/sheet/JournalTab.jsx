import { useEffect, useState } from 'react';
import { useCharacter } from '../../state/characterStore.jsx';

// Journal tab (ports modules/journal.js: composer, card grid, roll log, and the
// editable detail modal). The floating quick-note FAB shares the same entries
// and is added as sheet chrome separately.

function fmtDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    + ' · ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}
const preview = (text) => { const t = (text || '').trim(); return t.length > 180 ? t.slice(0, 180) + '…' : t; };

function DetailModal({ entry, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(entry.title || '');
  const [text, setText] = useState(entry.text || '');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); e.stopImmediatePropagation(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') save(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }); // re-bind each render so save() closes over current title/text

  const save = (closeAfter) => {
    const changed = title.trim() !== (entry.title || '') || text.trim() !== (entry.text || '');
    if (changed) onSave(entry.id, title.trim(), text.trim());
    if (closeAfter) onClose();
    else setStatus(changed ? 'Saved' : 'No changes');
  };

  return (
    <div className="app-modal-backdrop open" aria-hidden="false" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="app-modal panel" role="dialog" aria-modal="true">
        <div className="app-modal-head">
          <span className="app-modal-heading">Journal Entry</span>
          <span className="app-modal-date">Created {fmtDate(entry.created)}{entry.updated && entry.updated !== entry.created ? ' · edited ' + fmtDate(entry.updated) : ''}</span>
          <button className="app-modal-close" type="button" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <div className="app-modal-body">
          <label className="app-field"><span className="app-field-label">Title</span>
            <input type="text" placeholder="Entry title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus /></label>
          <label className="app-field"><span className="app-field-label">Entry</span>
            <textarea placeholder="Write your note…" value={text} onChange={(e) => setText(e.target.value)} /></label>
        </div>
        <div className="app-modal-foot">
          <button className="pbtn danger" type="button" onClick={() => onDelete(entry.id)}>Delete</button>
          <span className="app-modal-status">{status}</span>
          <button className="add-btn" type="button" onClick={() => save(true)}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default function JournalTab() {
  const { character, update } = useCharacter();
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [openId, setOpenId] = useState(null);

  const entries = character.journal || [];
  const rollLog = character.rollLog || [];
  const openEntry = entries.find((e) => e.id === openId);

  const addEntry = () => {
    const title = newTitle.trim(), text = newText.trim();
    if (!title && !text) return;
    const now = new Date().toISOString();
    update((d) => {
      d.journal = d.journal || [];
      d.journal.unshift({ id: 'j' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title, text, created: now, updated: now });
    });
    setNewTitle(''); setNewText('');
  };

  const saveEntry = (id, title, text) => update((d) => {
    const en = d.journal.find((x) => x.id === id);
    if (en) { en.title = title; en.text = text; en.updated = new Date().toISOString(); }
  });

  const deleteEntry = (id) => {
    const en = entries.find((x) => x.id === id);
    if (!window.confirm(`Delete "${(en && en.title) || 'this entry'}"? This can't be undone.`)) return;
    update((d) => { d.journal = d.journal.filter((x) => x.id !== id); });
    if (openId === id) setOpenId(null);
  };

  const clearLog = () => {
    if (!rollLog.length) return;
    if (!window.confirm("Clear the entire roll log? This can't be undone.")) return;
    update((d) => { d.rollLog = []; });
  };
  const delRoll = (id) => update((d) => { d.rollLog = d.rollLog.filter((x) => x.id !== id); });

  const countText = entries.length ? (entries.length + (entries.length === 1 ? ' note' : ' notes')) : 'No notes yet';

  return (
    <div className="tab-pane active">
      <div className="panel">
        <h2><span>Journal</span><span className="rune">◈</span></h2>
        <div className="picker-hint"><span>{countText}</span> for <span className="hl">{character.name || 'this character'}</span>. Click a note to open it, edit its sections, or delete it.</div>
        <div className="journal-compose">
          <input type="text" placeholder="Entry title (optional)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <textarea rows="3" placeholder="Jot down what happened…" value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') addEntry(); }} />
          <button className="add-btn" onClick={addEntry}>+ Add entry</button>
        </div>
        <div className="journal-grid">
          {entries.length === 0
            ? <div className="journal-empty">No entries yet — use the box above to record your first note.</div>
            : entries.map((en) => (
              <div key={en.id} className="journal-card" role="button" tabIndex={0} onClick={() => setOpenId(en.id)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenId(en.id); } }}>
                <div className="journal-card-head">
                  <span className="journal-card-title">{en.title || <i>Untitled</i>}</span>
                  <span className="journal-card-del" title="Delete note" onClick={(e) => { e.stopPropagation(); deleteEntry(en.id); }}>✕</span>
                </div>
                <div className="journal-card-date">{fmtDate(en.created)}{en.updated && en.updated !== en.created ? ' · edited' : ''}</div>
                <div className="journal-card-preview">{preview(en.text) || <span className="journal-card-empty">(no text)</span>}</div>
              </div>
            ))}
        </div>
      </div>

      <div className="panel">
        <h2><span>Roll Log</span><button className="pbtn rolllog-clear" type="button" onClick={clearLog}>Clear</button></h2>
        <div className="picker-hint"><span>{rollLog.length ? (rollLog.length + (rollLog.length === 1 ? ' roll' : ' rolls')) : 'No rolls yet'}</span> — automatically recorded from the dice roller (🎲, bottom-right).</div>
        <div className="rolllog-list">
          {rollLog.length === 0
            ? <div className="journal-empty">No rolls yet — open the dice roller (🎲, bottom-right) and hit Roll.</div>
            : rollLog.map((r) => (
              <div key={r.id} className="rolllog-row">
                <div className="rolllog-main">
                  <div className="rolllog-formula">{r.formula}<span className="rolllog-total">{r.total}</span></div>
                  <div className="rolllog-detail">{r.detail}</div>
                  <div className="rolllog-time">{fmtDate(r.time)}</div>
                </div>
                <span className="rolllog-del" title="Remove from log" onClick={() => delRoll(r.id)}>✕</span>
              </div>
            ))}
        </div>
      </div>

      {openEntry && <DetailModal entry={openEntry} onSave={saveEntry} onDelete={deleteEntry} onClose={() => setOpenId(null)} />}
    </div>
  );
}
