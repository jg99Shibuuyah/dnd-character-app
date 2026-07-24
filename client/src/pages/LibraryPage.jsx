import Layout from '../components/Layout.jsx';
import LibrarySearch from '../components/LibrarySearch.jsx';
import { useRegistry } from '../state/registry.js';

// Library page — hosts the shared LibrarySearch (React port of the legacy
// reference search, initNotesPage in public/app.js) plus the static
// Alignment/Mastery reference panels. Monsters are excluded here
// (includeMonsters={false}); the DM Screen reuses LibrarySearch with monsters
// included.

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

  const renderReference = (typeSet) => {
    if (!registry) return null;
    return (<>
      {(typeSet.size === 0 || typeSet.has('Alignments')) && <AlignmentPanel alignments={registry.data.alignments} />}
      {(typeSet.size === 0 || typeSet.has('Mastery')) && <MasteryPanel masteryProperties={registry.data.masteryProperties} />}
    </>);
  };

  return (
    <Layout page="library" title="Library">
      <LibrarySearch registry={registry} includeMonsters={false} error={error} renderReference={renderReference} />
      <div className="footer-note">Rules reference — nothing on this page is saved per character.</div>
    </Layout>
  );
}
