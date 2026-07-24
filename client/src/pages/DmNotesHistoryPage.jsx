import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import * as api from '../api/client.js';

// DM Notes history — a cross-session, read-only browser for the notes you've
// written as a DM. Lists the sessions you run (sortable), and shows the selected
// session's notes read-only. Editing still happens on each session's DM Screen.
function fmtDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
    + ' · ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function DmNotesHistoryPage() {
  const [sessions, setSessions] = useState(null);
  const [sort, setSort] = useState('name'); // 'name' | 'recent'
  const [activeId, setActiveId] = useState(null);
  const [notes, setNotes] = useState(null);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.listSessions()
      .then((all) => setSessions(all.filter((s) => s.role === 'dm')))
      .catch((e) => setError(e.message));
  }, []);

  const sorted = useMemo(() => {
    const list = [...(sessions || [])];
    return sort === 'name'
      ? list.sort((a, b) => a.name.localeCompare(b.name))
      : list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [sessions, sort]);

  const open = async (id) => {
    setActiveId(id); setNotes(null); setLoadingNotes(true); setError('');
    try { const r = await api.getDmNotes(id); setNotes(r.notes || []); }
    catch (e) { setError(e.message); }
    finally { setLoadingNotes(false); }
  };

  const active = sorted.find((s) => s.id === activeId);

  return (
    <Layout page="dm-notes" title="DM Notes">
      <div className="panel">
        <h2><span>DM Notes — history</span><span className="rune">🗒️</span></h2>
        <div className="picker-hint">Read-only history of the notes you've written across the sessions you run. Edit them from each session's <span className="hl">DM Screen</span>.</div>
        {error && <div className="action-empty">{error}</div>}
        <div className="dm-notes-history">
          <div className="dm-notes-sessions">
            <div className="filter-bar" style={{ marginBottom: 8 }}>
              <span className="filter-label">Sort</span>
              <span className={'filter-chip' + (sort === 'name' ? ' on' : '')} onClick={() => setSort('name')}>By name</span>
              <span className={'filter-chip' + (sort === 'recent' ? ' on' : '')} onClick={() => setSort('recent')}>Most recent</span>
            </div>
            {sessions == null
              ? <div className="action-empty">Loading…</div>
              : sorted.length === 0
                ? <div className="action-empty">You don't run any sessions yet.</div>
                : sorted.map((s) => (
                  <button key={s.id} type="button" className={'session-row' + (s.id === activeId ? ' active' : '')} onClick={() => open(s.id)}>
                    <span className="session-name">{s.name}</span>
                    <span className="session-code">code {s.code}</span>
                  </button>
                ))}
          </div>
          <div className="dm-notes-view">
            {!active
              ? <div className="action-empty">Pick a session to read its notes.</div>
              : loadingNotes
                ? <div className="action-empty">Loading notes…</div>
                : (notes && notes.length === 0)
                  ? <div className="action-empty">No notes for “{active.name}” yet.</div>
                  : (notes || []).map((en) => (
                    <div key={en.id} className="panel dm-note-card">
                      <div className="journal-card-head">
                        <span className="journal-card-title">{en.title || <i>Untitled</i>}</span>
                        <span className="journal-card-date">{fmtDate(en.created)}{en.updated && en.updated !== en.created ? ' · edited ' + fmtDate(en.updated) : ''}</span>
                      </div>
                      <div className="dm-note-text">{en.text || <span className="journal-card-empty">(no text)</span>}</div>
                    </div>
                  ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
