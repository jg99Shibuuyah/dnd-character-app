import { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { useRegistry } from '../state/registry.js';
import { buildNotesIndex, notesSourcesPresent, NOTES_TYPES, NOTES_HIDDEN_TYPES, NOTES_PAGE_SIZE } from '../rules/notes-index.js';
import { openNotesModal, setNotesIndex } from '../notes-windows.js';

// Library page — React port of the legacy reference search (initNotesPage in
// public/app.js). Searches everything the app knows; results open in the
// floating draggable windows from notes-windows.js. Result-row detail HTML
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

function FilterBar({ label, options, active, onPick }) {
  return (
    <div className="filter-bar" style={{ marginTop: label === 'Show' ? 10 : 6 }}>
      <span className="filter-label">{label}</span>
      {options.map((o) => (
        <span key={o} className={'filter-chip' + (active === o ? ' on' : '')} onClick={() => onPick(o)}>{o}</span>
      ))}
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
  const [typeFilter, setTypeFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [page, setPage] = useState(0);

  const index = useMemo(
    () => registry ? buildNotesIndex(registry.data, registry.customSpells) : [],
    [registry]);

  // The floating-window module resolves parent/sub-links through the index.
  useEffect(() => { setNotesIndex(index); }, [index]);

  const sources = useMemo(
    () => registry ? notesSourcesPresent(index, registry.data.classSources) : [],
    [index, registry]);

  const q = query.trim().toLowerCase();
  const visible = (e) => !NOTES_HIDDEN_TYPES.has(e.type)
    && (typeFilter === 'All' || e.type === typeFilter)
    && (sourceFilter === 'All' || e.source === sourceFilter);

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
  }, [index, q, typeFilter, sourceFilter]);

  // Browse mode (no query): All / Alignments / Mastery keep the static
  // reference; other filters get a paginated alphabetical list.
  const showReference = !q && sourceFilter === 'All'
    && (typeFilter === 'All' || typeFilter === 'Alignments' || typeFilter === 'Mastery');
  const browse = useMemo(() => {
    if (q || showReference) return null;
    return index.filter(visible).sort((a, b) => a.name.localeCompare(b.name));
  }, [index, q, showReference, typeFilter, sourceFilter]);

  const pickType = (t) => { setTypeFilter(t); setPage(0); };
  const pickSource = (s) => { setSourceFilter(s); setPage(0); };

  const grouped = {};
  (hits || []).slice(0, MAX).forEach((e) => (grouped[e.type] = grouped[e.type] || []).push(e));

  const pageCount = browse ? Math.ceil(browse.length / NOTES_PAGE_SIZE) : 0;
  const safePage = Math.min(Math.max(page, 0), Math.max(0, pageCount - 1));
  const pageItems = browse ? browse.slice(safePage * NOTES_PAGE_SIZE, (safePage + 1) * NOTES_PAGE_SIZE) : [];
  const scopeLabel = (typeFilter === 'All' ? 'entries' : typeFilter.toLowerCase())
    + (sourceFilter === 'All' ? '' : ' tagged ' + sourceFilter);

  return (
    <Layout page="library" title="Library">
      <div className="panel">
        <h2><span>Search the Reference</span><span className="rune">◈</span></h2>
        <input type="text" autoComplete="off" value={query}
          placeholder="Search anything — Fireball, Darkvision, Rage, Elf, Lawful Good…"
          onChange={(e) => setQuery(e.target.value)} />
        <FilterBar label="Show" options={NOTES_TYPES} active={typeFilter} onPick={pickType} />
        <FilterBar label="Source" options={['All', ...sources]} active={sourceFilter} onPick={pickSource} />
        <div>
          {error && <div className="action-empty">Could not load imported content: {error}</div>}
          {hits && hits.length === 0 &&
            <div className="action-empty">{`No matches for "${query.trim()}"${(typeFilter === 'All' ? '' : ' in ' + typeFilter) + (sourceFilter === 'All' ? '' : ' (' + sourceFilter + ')')}.`}</div>}
          {hits && NOTES_TYPES.slice(1).map((type) => grouped[type] && (
            <div key={type}>
              <div className="nr-group">{type}</div>
              {grouped[type].map((e, i) => <ResultRow key={e.type + e.name + i} entry={e} onOpen={openNotesModal} />)}
            </div>
          ))}
          {hits && hits.length > MAX &&
            <div className="picker-hint" style={{ marginTop: 8 }}>Showing the first {MAX} of {hits.length} matches — narrow the search.</div>}
          {browse && browse.length === 0 &&
            <div className="action-empty">No {scopeLabel} in the reference yet.</div>}
          {browse && browse.length > 0 && (
            <div>
              <div className="nr-group">{(typeFilter === 'All' ? 'All' : typeFilter) + (sourceFilter === 'All' ? '' : ' · ' + sourceFilter)} — {browse.length} total</div>
              {pageItems.map((e, i) => <ResultRow key={e.type + e.name + i} entry={e} onOpen={openNotesModal} />)}
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
          {typeFilter !== 'Mastery' && <AlignmentPanel alignments={registry.data.alignments} />}
          {typeFilter !== 'Alignments' && <MasteryPanel masteryProperties={registry.data.masteryProperties} />}
        </div>
      )}

      <div className="footer-note">Rules reference — nothing on this page is saved per character.</div>
    </Layout>
  );
}
