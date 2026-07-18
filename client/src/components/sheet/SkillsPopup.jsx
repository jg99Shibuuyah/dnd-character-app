import { useCharacter } from '../../state/characterStore.jsx';
import { mod, fmt, esc } from '../../rules/core.js';
import { grantedSkillSources } from '../../rules/abilities.js';
import { equipSkillBonus } from '../../rules/equipment.js';
import { openNotesModal } from '../../notes-windows.js';

// Skills quick-reference popup (a quick-tools tool): the same per-skill bonuses
// and detail as the Skills tab, reachable from any tab. Bonuses come from the
// store's derived stats; a row opens the shared floating detail window. Mirrors
// the Skills tab's own detail logic (kept independent to avoid coupling).

export default function SkillsPopup({ open, onClose }) {
  const { character, data, derived } = useCharacter();
  const pb = derived.pb;

  const showDetail = (i) => {
    const s = data.skills[i];
    const m = mod(derived.abilities[s.ability]);
    const granted = grantedSkillSources(character, s.name, data);
    const prof = !!character.skillProf['sk' + i] || granted.length > 0;
    const gear = equipSkillBonus(character, s.name);
    const total = derived.skillBonuses[i];
    const parts = [`${s.ability.toUpperCase()} ${fmt(m)}`];
    if (prof) parts.push(`proficiency ${fmt(pb)}`);
    if (gear) parts.push(`gear ${fmt(gear)}`);
    openNotesModal({
      name: s.name,
      badges: ['Skill', s.ability.toUpperCase(), prof ? 'Proficient' : 'Not proficient'],
      detail: `<p>${data.skillDesc[s.name] || ''}</p>
        <p><strong>Bonus ${fmt(total)}</strong> = ${parts.join(' + ')}</p>
        ${granted.map((g) => `<p class="nr-hint">Proficiency granted by your ${esc(g.kind)} — <span class="hl">${esc(g.by)}</span>.</p>`).join('')}
        ${prof ? '' : '<p class="nr-hint">Not proficient — toggle skill proficiencies on the Character Settings tab.</p>'}`
    });
  };

  return (
    <div className={'corner-popup' + (open ? ' open' : '')} role="dialog" aria-label="Skills quick reference">
      <div className="corner-popup-head">
        <div>
          <div className="corner-popup-title"><span>Skills</span><span className="rune">◈</span></div>
          <div className="corner-popup-sub">Click a skill for its description &amp; bonus breakdown.</div>
        </div>
        <button className="corner-popup-close" type="button" aria-label="Close" onClick={onClose}>✕</button>
      </div>
      <div className="corner-popup-list">
        {data.skills.map((s, i) => {
          const granted = grantedSkillSources(character, s.name, data);
          const prof = !!character.skillProf['sk' + i] || granted.length > 0;
          return (
            <div key={i} className={'check-row skill-row' + (prof ? ' proficient' : '') + (granted.length ? ' granted' : '')}
              title="Click for a quick description" onClick={() => showDetail(i)}>
              <span className={'prof-dot' + (prof ? ' on' : '') + (granted.length ? ' granted' : '')} />
              <span className="abbr-tag">{s.ability.toUpperCase()}</span>
              <span className="name">{s.name}</span>
              {granted.map((g, j) => <span key={j} className="grant-tag">{g.kind}</span>)}
              <span className="bonus">{fmt(derived.skillBonuses[i])}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
