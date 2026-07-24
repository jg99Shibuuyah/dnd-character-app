import { useEffect, useMemo, useState } from 'react';
import SheetWindow from './sheet/SheetWindow.jsx';
import LibraryDetail from './LibraryDetail.jsx';
import {
  buildNotesIndex, notesSourcesPresent, NOTES_TYPES, NOTES_TYPES_DM,
  NOTES_HIDDEN_TYPES, NOTES_PAGE_SIZE
} from '../rules/notes-index.js';

// Shared search machinery for the public Library and the DM Screen. Searches
// everything the app knows; results open in floating SheetWindow panels (the
// same window chrome as the character sheet), with each window keeping its
// own back/sub-link navigation stack. Result-row detail HTML comes
// pre-escaped from rules/notes-index.js, hence dangerouslySetInnerHTML.
//
// `includeMonsters` gates the Monsters filter/results entirely: when false
// (the public Library), NOTES_TYPES is used and no monsters are fed into the
// index, so no Monsters entries or chip can appear — identical to the
// pre-extraction behavior. When true (the DM Screen), NOTES_TYPES_DM is used,
// builtin + custom monsters are merged into the index, and monster results
// route to `onOpenMonster` instead of the standard LibraryDetail window.

function ResultRow({ entry, onOpen }) {
  return (
    <div className="feat-item nr-item" title="Click for full details" onClick={() => onOpen(entry)}>
      <div className="feat-head">
        <span className="f-name">{entry.name}</span>
        {entry.badges.map((b, i) => <span key={i} className="nr-badge">{b}</span>)}
      </div>
      <div dangerouslySetInnerHTML={{ __html: entry.detail }} />
    </div>
  );
}

// Multi-select filter row. `selected` is a Set of chosen options; an empty set
// means "All" (nothing filtered). Clicking a chip toggles it, so clicking an
// active chip deselects it; clicking "All" clears the whole row.
function FilterBar({ label, options, selected, onToggle }) {
  return (
    <div className="filter-bar" style={{ marginTop: label === 'Show' ? 10 : 6 }}>
      <span className="filter-label">{label}</span>
      {options.map((o) => {
        const on = o === 'All' ? selected.size === 0 : selected.has(o);
        return (
          <span key={o} className={'filter-chip' + (on ? ' on' : '')} onClick={() => onToggle(o)}>{o}</span>
        );
      })}
    </div>
  );
}

export default function LibrarySearch({ registry, includeMonsters = false, onOpenMonster }) {
  const types = includeMonsters ? NOTES_TYPES_DM : NOTES_TYPES;
  const [query, setQuery] = useState('');
  // Multi-select filters — empty set means "All". A chip can be toggled off to
  // deselect it, several can be active at once, and Clear resets both rows.
  const [typeSet, setTypeSet] = useState(() => new Set());
  const [sourceSet, setSourceSet] = useState(() => new Set());
  const [page, setPage] = useState(0);

  const monsters = useMemo(() => {
    if (!includeMonsters || !registry) return null;
    const builtin = registry.data.monsterData || [];
    const custom = Object.entries(registry.customMonsters || {}).map(([name, m]) => ({ name, source: m.source, data: m }));
    const byName = new Map();
    [...builtin, ...custom].forEach((m) => byName.set(m.name, m)); // custom overrides builtin
    return [...byName.values()];
  }, [includeMonsters, registry]);

  const index = useMemo(
    () => registry ? buildNotesIndex(registry.data, registry.customSpells, monsters || undefined) : [],
    [registry, monsters]);

  // Open reference windows: each is { key, stack, current } — its own back/
  // sub-link navigation history, rendered in a floating SheetWindow below.
  const [windows, setWindows] = useState([]);
  const openWindow = (entry) => setWindows((ws) => [...ws,
    { key: 'lw' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), stack: [], current: entry }]);
  const closeWindow = (key) => setWindows((ws) => ws.filter((w) => w.key !== key));
  const closeAllWindows = () => setWindows([]);
  const navigate = (key, entry, mode) => setWindows((ws) => ws.map((w) => {
    if (w.key !== key) return w;
    if (mode === 'push') return { ...w, stack: [...w.stack, w.current], current: entry };
    if (mode === 'pop') { const st = w.stack.slice(); const prev = st.pop(); return { ...w, stack: st, current: prev || w.current }; }
    return { ...w, stack: [], current: entry };
  }));

  // Monster results route to onOpenMonster (the DM Screen) when provided;
  // everything else opens the standard LibraryDetail window.
  const open = (entry) => {
    if (entry.type === 'Monsters' && onOpenMonster) { onOpenMonster(entry); return; }
    openWindow(entry);
  };

  // Esc closes the most-recently-opened window.
  useEffect(() => {
    if (windows.length === 0) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setWindows((ws) => ws.slice(0, -1)); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [windows.length]);

  const sources = useMemo(
    () => registry ? notesSourcesPresent(index, registry.data.classSources) : [],
    [index, registry]);

  const q = query.trim().toLowerCase();
  const visible = (e) => !NOTES_HIDDEN_TYPES.has(e.type)
    && (typeSet.size === 0 || typeSet.has(e.type))
    && (sourceSet.size === 0 || sourceSet.has(e.source));

  // Search mode: name matches outrank text-only matches; earlier positions rank higher.
  const MAX = 80;
  const hits = useMemo(() => {
    if (!q) return null;
    const found = index.filter((e) => visible(e) && e.text.includes(q));
    found.sort((a, b) => {
      const an = a.name.toLowerCase().indexOf(q), bn = b.name.toLowerCase().indexOf(q);
      return ((an < 0) - (bn < 0)) || (an - bn) || a.name.localeCompare(b.name);
    });
    return found;
  }, [index, q, typeSet, sourceSet]);

  // Browse mode (no query): the static reference stays as long as no source is
  // filtered and every selected type (if any) is a reference-only type.
  const showReference = !q && sourceSet.size === 0
    && [...typeSet].every((t) => t === 'Alignments' || t === 'Mastery');
  const browse = useMemo(() => {
    if (q || showReference) return null;
    return index.filter(visible).sort((a, b) => a.name.localeCompare(b.name));
  }, [index, q, showReference, typeSet, sourceSet]);

  // Toggle a chip in/out of its filter set; "All" clears the set.
  const toggle = (setter) => (value) => {
    setPage(0);
    setter((prev) => {
      if (value === 'All') return new Set();
      const next = new Set(prev);
      if (next.has(value)) next.delete(value); else next.add(value);
      return next;
    });
  };
  const toggleType = toggle(setTypeSet);
  const toggleSource = toggle(setSourceSet);
  const clearFilters = () => { setTypeSet(new Set()); setSourceSet(new Set()); setPage(0); };
  const hasFilters = typeSet.size > 0 || sourceSet.size > 0;

  const grouped = {};
  (hits || []).slice(0, MAX).forEach((e) => (grouped[e.type] = grouped[e.type] || []).push(e));

  const pageCount = browse ? Math.ceil(browse.length / NOTES_PAGE_SIZE) : 0;
  const safePage = Math.min(Math.max(page, 0), Math.max(0, pageCount - 1));
  const pageItems = browse ? browse.slice(safePage * NOTES_PAGE_SIZE, (safePage + 1) * NOTES_PAGE_SIZE) : [];
  const listOf = (set) => [...set].join(', ');
  const scopeLabel = (typeSet.size === 0 ? 'entries' : listOf(typeSet).toLowerCase())
    + (sourceSet.size === 0 ? '' : ' tagged ' + listOf(sourceSet));

  return (
    <>
      <div className="panel">
        <h2><span>{includeMonsters ? 'DM Reference & Monsters' : 'Search the Reference'}</span><span className="rune">◈</span></h2>
        <input id="notesSearch" type="text" autoComplete="off" value={query}
          placeholder={includeMonsters ? 'Search anything — Fireball, Rage, Adult Copper Dragon…' : 'Search anything — Fireball, Darkvision, Rage, Elf, Lawful Good…'}
          onChange={(e) => setQuery(e.target.value)} />
        <FilterBar label="Show" options={types} selected={typeSet} onToggle={toggleType} />
        <FilterBar label="Source" options={['All', ...sources]} selected={sourceSet} onToggle={toggleSource} />
        {hasFilters && (
          <div className="filter-bar" style={{ marginTop: 6 }}>
            <span className="filter-clear" onClick={clearFilters} title="Reset every filter back to All">✕ Clear filters</span>
          </div>
        )}
        <div>
          {hits && hits.length === 0 &&
            <div className="action-empty">{`No matches for "${query.trim()}"${(typeSet.size === 0 ? '' : ' in ' + listOf(typeSet)) + (sourceSet.size === 0 ? '' : ' (' + listOf(sourceSet) + ')')}.`}</div>}
          {hits && types.slice(1).map((type) => grouped[type] && (
            <div key={type}>
              <div className="nr-group">{type}</div>
              {grouped[type].map((e, i) => <ResultRow key={e.type + e.name + i} entry={e} onOpen={open} />)}
            </div>
          ))}
          {hits && hits.length > MAX &&
            <div className="picker-hint" style={{ marginTop: 8 }}>Showing the first {MAX} of {hits.length} matches — narrow the search.</div>}
          {browse && browse.length === 0 &&
            <div className="action-empty">No {scopeLabel} in the reference yet.</div>}
          {browse && browse.length > 0 && (
            <div>
              <div className="nr-group">{[...(typeSet.size === 0 ? ['All'] : typeSet), ...sourceSet].join(' · ')} — {browse.length} total</div>
              {pageItems.map((e, i) => <ResultRow key={e.type + e.name + i} entry={e} onOpen={open} />)}
              {pageCount > 1 && (
                <div className="nr-pager">
                  <button className="pbtn" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>‹ Prev</button>
                  <span className="nr-page-info">Page {safePage + 1} of {pageCount}</span>
                  <button className="pbtn" disabled={safePage >= pageCount - 1} onClick={() => setPage(safePage + 1)}>Next ›</button>
                </div>
              )}
            </div>
          )}
        </div>
        {!includeMonsters && (
          <div className="picker-hint" style={{ marginBottom: 0 }}>Looks up classes &amp; their features, species &amp; traits, spells (built-in <span className="hl">and imported</span>), standard actions, alignments, and weapon mastery properties. Subclasses and subspecies open from within their parent class or species. Click a result for full details and editing.</div>
        )}
      </div>

      {windows.map((w, i) => (
        <SheetWindow key={w.key} title={w.current.name} icon="📖" offset={i * 26} onClose={() => closeWindow(w.key)}>
          <LibraryDetail entry={w.current} stack={w.stack} index={index}
            onNavigate={(entry, mode) => navigate(w.key, entry, mode)} onOpenNew={openWindow} />
        </SheetWindow>
      ))}
      {windows.length >= 2 && (
        <button type="button" className="pbtn nr-clear-all" onClick={closeAllWindows}>✕ Close all ({windows.length})</button>
      )}
    </>
  );
}
