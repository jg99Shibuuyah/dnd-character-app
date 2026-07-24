import { useEffect, useRef, useState } from 'react';
import * as api from '../api/client.js';

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

  const save = (closeAfter) => {
    const changed = title.trim() !== (entry.title || '') || text.trim() !== (entry.text || '');
    if (changed) onSave(entry.id, title.trim(), text.trim());
    if (closeAfter) onClose(); else setStatus(changed ? 'Saved' : 'No changes');
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); e.stopImmediatePropagation(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') save(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  return (
    <div className="app-modal-backdrop open" aria-hidden="false" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="app-modal panel" role="dialog" aria-modal="true">
        <div className="app-modal-head">
          <span className="app-modal-heading">DM Note</span>
          <span className="app-modal-date">Created {fmtDate(entry.created)}{entry.updated && entry.updated !== entry.created ? ' · edited ' + fmtDate(entry.updated) : ''}</span>
          <button className="app-modal-close" type="button" aria-label="Close" onClick={onClose}>✕</button>
        </div>
        <div className="app-modal-body">
          <label className="app-field"><span className="app-field-label">Title</span>
            <input type="text" placeholder="Note title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus /></label>
          <label className="app-field"><span className="app-field-label">Note</span>
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

export default function DmNotes({ sessionId }) {
  const [entries, setEntries] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [openId, setOpenId] = useState(null);
  const loaded = useRef(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    api.getDmNotes(sessionId).then((r) => { setEntries(r.notes || []); loaded.current = true; }).catch(() => { loaded.current = true; });
  }, [sessionId]);

  // Debounced autosave (500ms) once the initial load has happened.
  useEffect(() => {
    if (!loaded.current) return undefined;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { api.setDmNotes(sessionId, entries).catch(() => {}); }, 500);
    return () => clearTimeout(saveTimer.current);
  }, [entries, sessionId]);

  const openEntry = entries.find((e) => e.id === openId);

  const addEntry = () => {
    const title = newTitle.trim(), text = newText.trim();
    if (!title && !text) return;
    const now = new Date().toISOString();
    setEntries((es) => [{ id: 'n' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title, text, created: now, updated: now }, ...es]);
    setNewTitle(''); setNewText('');
  };
  const saveEntry = (id, title, text) => setEntries((es) => es.map((e) => e.id === id ? { ...e, title, text, updated: new Date().toISOString() } : e));
  const deleteEntry = (id) => {
    const en = entries.find((x) => x.id === id);
    if (!window.confirm(`Delete "${(en && en.title) || 'this note'}"? This can't be undone.`)) return;
    setEntries((es) => es.filter((e) => e.id !== id));
    if (openId === id) setOpenId(null);
  };

  const countText = entries.length ? (entries.length + (entries.length === 1 ? ' note' : ' notes')) : 'No notes yet';

  return (
    <div className="panel">
      <h2><span>DM Notes</span><span className="rune">◈</span></h2>
      <div className="picker-hint"><span>{countText}</span> — private to you, saved to this session.</div>
      <div className="journal-compose">
        <input type="text" placeholder="Note title (optional)" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <textarea rows="3" placeholder="Jot down a plot hook, an NPC, a reminder…" value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') addEntry(); }} />
        <button className="add-btn" onClick={addEntry}>+ Add note</button>
      </div>
      <div className="journal-grid">
        {entries.length === 0
          ? <div className="journal-empty">No notes yet — use the box above to record your first.</div>
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
      {openEntry && <DetailModal entry={openEntry} onSave={saveEntry} onDelete={deleteEntry} onClose={() => setOpenId(null)} />}
    </div>
  );
}
