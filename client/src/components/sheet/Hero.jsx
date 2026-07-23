import { useCharacter } from '../../state/characterStore.jsx';
import { pickedClasses } from '../../rules/classes.js';

// Level seal, name, summary line, XP (ports partials/hero.html + updateHero).
export default function Hero({ onOpenSettings, settingsActive }) {
  const { character, data, derived } = useCharacter();
  const level = derived?.applied?.level || character.level || 1;
  const showXp = character.showXp !== false; // default on for characters saved before the toggle existed
  const picked = data ? pickedClasses(character, data) : [];
  const clsText = picked.length
    ? picked.map((c) => `${c.name} ${c.level}`).join(' / ')
    : (character.class || '[no class]');
  const parts = ['Lv ' + level + ' ' + clsText];
  if (character.race) parts.push(character.race);
  if (character.background) parts.push(character.background);
  if (character.alignment) parts.push(character.alignment);

  return (
    <div className="hero">
      <div className="seal">
        <div className="lvl-num">{level}</div>
        <div className="lvl-label">Level</div>
      </div>
      <div>
        <div className="hero-name-row">
          <div className="hero-name">{character.name || 'Unnamed Adventurer'}</div>
          {onOpenSettings && (
            <button type="button" className={'hero-settings-btn' + (settingsActive ? ' active' : '')}
              title="Open Character Settings" onClick={onOpenSettings}>⚙ Settings</button>
          )}
        </div>
        <div className="hero-summary">
          {parts.map((p, i) => (
            <span key={i}>{i > 0 && <span className="sep">//</span>}{p}</span>
          ))}
        </div>
        <div className="hero-hint">// edit identity &amp; class in <span className="cmd">[ ⚙ Settings ]</span></div>
      </div>
      {showXp && (
        <div className="xp-block">
          <label>Experience</label>
          <div className="xp-val">{character.xp || 0}</div>
        </div>
      )}
    </div>
  );
}
