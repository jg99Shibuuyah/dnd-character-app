import { useState } from 'react';
import { useCharacter } from '../../state/characterStore.jsx';

// Quick journal popup (a quick-tools tool): jot a note or delete one without
// leaving the current tab. Shares character.journal with the Journal tab, so
// notes added here show up there (and vice-versa). Full editing lives on the
// Journal tab; this is the fast-capture surface.

function fmtDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    + ' · ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function NotesPopup({ open, onClose }) {
  const { character, update } = useCharacter();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const entries = character.journal || [];

  const add = () => {
    const t = title.trim(), x = text.trim();
    if (!t && !x) return;
    const now = new Date().toISOString();
    update((d) => {
      d.journal = d.journal || [];
      d.journal.unshift({ id: 'j' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), title: t, text: x, created: now, updated: now });
    });
    setTitle(''); setText('');
  };

  const del = (id) => {
    const en = entries.find((x) => x.id === id);
    if (!window.confirm(`Delete "${(en && en.title) || 'this note'}"? This can't be undone.`)) return;
    update((d) => { d.journal = d.journal.filter((x) => x.id !== id); });
  };

  return (
    <div className={'corner-popup' + (open ? ' open' : '')} role="dialog" aria-label="Quick journal">
      <div className="corner-popup-head">
        <div>
          <div className="corner-popup-title"><span>Notes</span><span className="rune">◈</span></div>
          <div className="corner-popup-sub">Quick capture — full editing on the Journal tab.</div>
        </div>
        <button className="corner-popup-close" type="button" aria-label="Close" onClick={onClose}>✕</button>
      </div>
      <div className="journal-compose">
        <input type="text" placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea rows="3" placeholder="Jot a quick note…" value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') add(); }} />
        <button className="add-btn" type="button" onClick={add}>+ Add note</button>
      </div>
      <div className="corner-popup-list">
        {entries.length === 0
          ? <div className="journal-empty">No notes yet — jot one above. They also appear on the Journal tab.</div>
          : entries.map((en) => (
            <div key={en.id} className="jpop-row">
              <div className="jpop-row-main">
                <div className="jpop-row-title">{en.title || 'Untitled'}</div>
                <div className="jpop-row-date">{fmtDate(en.created)}</div>
                <div className="jpop-row-preview">{en.text || '(no text)'}</div>
              </div>
              <span className="jpop-row-del" title="Delete note" onClick={() => del(en.id)}>✕</span>
            </div>
          ))}
      </div>
    </div>
  );
}
