import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import SheetWindow from '../components/sheet/SheetWindow.jsx';
import LibraryDetail from '../components/LibraryDetail.jsx';
import { useRegistry } from '../state/registry.js';
import { buildNotesIndex, notesSourcesPresent, NOTES_TYPES, NOTES_HIDDEN_TYPES, NOTES_PAGE_SIZE } from '../rules/notes-index.js';

// Library page — React port of the legacy reference search (initNotesPage in
// public/app.js). Searches everything the app knows; results open in floating
// SheetWindow panels (the same window chrome as the character sheet), with each
// window keeping its own back/sub-link navigation stack. Result-row detail HTML
// comes pre-escaped from rules/notes-index.js, hence dangerouslySetInnerHTML.

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

// Static reference shown while the search box is empty (legacy:
// partials/library/{alignment,mastery}.html + buildNotes()).
function AlignmentPanel({ alignments }) {
  return (
    <div className="panel">
      <h2><span>Alignment</span><span className="rune">◈</span></h2>
      <p className="note-p">A typical creature in the worlds of D&amp;D has an <span className="note-hl">alignment</span>, which broadly describes its moral and personal attitudes. Alignment is a combination of two factors: one identifies morality (<span className="note-hl">good</span>, <span className="note-hl">evil</span>, or <span className="note-hl">neutral</span>), and the other describes attitudes toward society and order (<span className="note-hl">lawful</span>, <span className="note-hl">chaotic</span>, or <span className="note-hl">neutral</span>). Together, the two axes produce nine distinct combinations.</p>
      <p className="note-p">Your character's alignment is a tool for roleplaying, not a straitjacket. Think of it as a compass for how your character tends to act — a good starting point that can shift as the story unfolds.</p>
      <div className="align-grid">
        {alignments.map((a) => (
          <div className="align-card" key={a.abbr}>
            <div><span className="a-abbr">{a.abbr}</span><span className="a-name">{a.name}</span></div>
            <div className="a-desc">{a.desc}</div>
            <div className="a-eg"><b>e.g.</b> {a.eg}</div>
          </div>
        ))}
      </div>
      <h3 className="note-sub">Alignment in the Multiverse</h3>
      <p className="note-p">For many intelligent creatures, alignment is a moral choice made freely. Others are pushed strongly toward a particular alignment by their nature or upbringing. For some outsiders — celestials and fiends among them — alignment is a fundamental part of their being rather than a decision they make.</p>
      <p className="note-p">Most creatures that lack the capacity for rational thought are <span className="note-hl">unaligned</span>. Such a creature is incapable of making a moral judgment and simply acts according to its nature; a shark is a savage predator, for instance, but it is not evil — it has no alignment at all.</p>
      <p className="note-cite">Descriptions adapt the SRD 5.1 alignment entries (Open Game Content); framing paraphrased from the 5e rules on alignment.</p>
    </div>
  );
}

function MasteryPanel({ masteryProperties }) {
  return (
    <div className="panel">
      <h2><span>Mastery Properties</span><span className="rune">◈</span></h2>
      <p className="note-p">Every weapon has a <span className="note-hl">mastery property</span> — a special effect you can trigger when attacking with it. You can use a weapon's mastery property only if a feature (such as a class's <span className="note-hl">Weapon Mastery</span> feature) lets you, and only with the weapons you've chosen with that feature.</p>
      <div className="align-grid mastery-grid">
        {masteryProperties.map((m) => (
          <div className="align-card" key={m.name}>
            <div><span className="a-name">{m.name}</span></div>
            <div className="a-desc">{m.desc}</div>
            <div className="mastery-weapons">{m.weapons.map((w) => <span key={w} className="mastery-chip">{w}</span>)}</div>
          </div>
        ))}
      </div>
      <p className="note-cite">Property descriptions and weapon lists follow the 2024 core rules on Weapon Mastery.</p>
    </div>
  );
}

export default function LibraryPage() {
  const { registry, error } = useRegistry();
  const [query, setQuery] = useState('');
  // Multi-select filters — empty set means "All". A chip can be toggled off to
  // deselect it, several can be active at once, and Clear resets both rows.
  const [typeSet, setTypeSet] = useState(() => new Set());
  const [sourceSet, setSourceSet] = useState(() => new Set());
  const [page, setPage] = useState(0);

  const index = useMemo(
    () => registry ? buildNotesIndex(registry.data, registry.customSpells) : [],
    [registry]);

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
    <Layout page="library" title="Library">
      <div className="panel">
        <h2><span>Search the Reference</span><span className="rune">◈</span></h2>
        <input id="notesSearch" type="text" autoComplete="off" value={query}
          placeholder="Search anything — Fireball, Darkvision, Rage, Elf, Lawful Good…"
          onChange={(e) => setQuery(e.target.value)} />
        <FilterBar label="Show" options={NOTES_TYPES} selected={typeSet} onToggle={toggleType} />
        <FilterBar label="Source" options={['All', ...sources]} selected={sourceSet} onToggle={toggleSource} />
        {hasFilters && (
          <div className="filter-bar" style={{ marginTop: 6 }}>
            <span className="filter-clear" onClick={clearFilters} title="Reset every filter back to All">✕ Clear filters</span>
          </div>
        )}
        <div>
          {error && <div className="action-empty">Could not load imported content: {error}</div>}
          {hits && hits.length === 0 &&
            <div className="action-empty">{`No matches for "${query.trim()}"${(typeSet.size === 0 ? '' : ' in ' + listOf(typeSet)) + (sourceSet.size === 0 ? '' : ' (' + listOf(sourceSet) + ')')}.`}</div>}
          {hits && NOTES_TYPES.slice(1).map((type) => grouped[type] && (
            <div key={type}>
              <div className="nr-group">{type}</div>
              {grouped[type].map((e, i) => <ResultRow key={e.type + e.name + i} entry={e} onOpen={openWindow} />)}
            </div>
          ))}
          {hits && hits.length > MAX &&
            <div className="picker-hint" style={{ marginTop: 8 }}>Showing the first {MAX} of {hits.length} matches — narrow the search.</div>}
          {browse && browse.length === 0 &&
            <div className="action-empty">No {scopeLabel} in the reference yet.</div>}
          {browse && browse.length > 0 && (
            <div>
              <div className="nr-group">{[...(typeSet.size === 0 ? ['All'] : typeSet), ...sourceSet].join(' · ')} — {browse.length} total</div>
              {pageItems.map((e, i) => <ResultRow key={e.type + e.name + i} entry={e} onOpen={openWindow} />)}
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
        <div className="picker-hint" style={{ marginBottom: 0 }}>Looks up classes &amp; their features, species &amp; traits, spells (built-in <span className="hl">and imported</span>), standard actions, alignments, and weapon mastery properties. Subclasses and subspecies open from within their parent class or species. Click a result for full details and editing.</div>
      </div>

      {showReference && registry && (
        <div>
          {(typeSet.size === 0 || typeSet.has('Alignments')) && <AlignmentPanel alignments={registry.data.alignments} />}
          {(typeSet.size === 0 || typeSet.has('Mastery')) && <MasteryPanel masteryProperties={registry.data.masteryProperties} />}
        </div>
      )}

      <div className="footer-note">Rules reference — nothing on this page is saved per character.</div>

      {windows.map((w, i) => (
        <SheetWindow key={w.key} title={w.current.name} icon="📖" offset={i * 26} onClose={() => closeWindow(w.key)}>
          <LibraryDetail entry={w.current} stack={w.stack} index={index}
            onNavigate={(entry, mode) => navigate(w.key, entry, mode)} onOpenNew={openWindow} />
        </SheetWindow>
      ))}
      {windows.length >= 2 && (
        <button type="button" className="pbtn nr-clear-all" onClick={closeAllWindows}>✕ Close all ({windows.length})</button>
      )}
    </Layout>
  );
}
