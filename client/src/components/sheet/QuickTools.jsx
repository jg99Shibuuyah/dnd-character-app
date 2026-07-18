import { useEffect, useState } from 'react';
import { useCharacter } from '../../state/characterStore.jsx';
import SkillsPopup from './SkillsPopup.jsx';
import NotesPopup from './NotesPopup.jsx';
import DicePopup from './DicePopup.jsx';

// Floating quick-tools launcher (bottom-right "⋯" FAB) that expands into a
// vertical stack of tools — Skills, Notes, and Dice (ports the legacy
// corner-launcher). Picking a tool collapses the stack and opens that tool's
// popup; only one tool popup is open at a time.

export default function QuickTools() {
  const { character } = useCharacter();
  const [stackOpen, setStackOpen] = useState(false); // launcher expanded
  const [active, setActive] = useState(null);        // 'skills' | 'notes' | 'dice' | null

  const noteCount = (character.journal || []).length;

  // Escape closes an open tool popup first, otherwise collapses the launcher.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (active) setActive(null);
      else setStackOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);

  const pick = (tool) => { setActive(tool); setStackOpen(false); };

  return (
    <>
      <div className={'fab-stack' + (stackOpen ? ' open' : '')}>
        <button className={'corner-fab fab-item' + (active === 'skills' ? ' open' : '')} type="button"
          title="Skills quick reference" aria-label="Open skills quick reference" onClick={() => pick('skills')}>
          <span className="fab-label">Skills</span>
          <span className="corner-fab-glyph">✦</span>
        </button>
        <button className={'corner-fab fab-item' + (active === 'notes' ? ' open' : '')} type="button"
          title="Quick journal note" aria-label="Open quick journal" onClick={() => pick('notes')}>
          <span className="fab-label">Notes</span>
          <span className="corner-fab-glyph">✎</span>
          <span className="corner-fab-badge">{noteCount || ''}</span>
        </button>
        <button className={'corner-fab fab-item' + (active === 'dice' ? ' open' : '')} type="button"
          title="Dice roller" aria-label="Open dice roller" onClick={() => pick('dice')}>
          <span className="fab-label">Dice</span>
          <span className="corner-fab-glyph">🎲</span>
        </button>
        <button className={'corner-fab fab-launcher' + (stackOpen ? ' open' : '')} type="button"
          title="Quick tools" aria-label="Open quick tools menu" aria-expanded={stackOpen}
          onClick={() => setStackOpen((v) => !v)}>
          <span className="corner-fab-glyph">⋯</span>
        </button>
      </div>
      <SkillsPopup open={active === 'skills'} onClose={() => setActive(null)} />
      <NotesPopup open={active === 'notes'} onClose={() => setActive(null)} />
      <DicePopup open={active === 'dice'} onClose={() => setActive(null)} />
    </>
  );
}
