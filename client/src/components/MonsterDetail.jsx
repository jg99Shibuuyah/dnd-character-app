import { monsterStatblockHtml } from '../rules/notes-index.js';

// Renders a monster stat block inside a SheetWindow on the DM Screen. The
// "Add to turn order" button seeds a free-form combatant (name, HP, legendary
// count) in the tracker — the only link between monster lookup and combat.
export default function MonsterDetail({ entry, onAddToTracker }) {
  const monster = entry.monster || { name: entry.name, data: {} };
  const d = monster.data || {};
  return (
    <div className="lib-detail monster-detail">
      <div className="monster-detail-actions">
        {onAddToTracker && (
          <button type="button" className="pbtn" onClick={() => onAddToTracker(monster)}>+ Add to turn order</button>
        )}
      </div>
      <div dangerouslySetInnerHTML={{ __html: monsterStatblockHtml(d) }} />
    </div>
  );
}
