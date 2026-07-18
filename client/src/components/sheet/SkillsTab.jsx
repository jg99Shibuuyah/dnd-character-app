import { useCharacter } from '../../state/characterStore.jsx';
import { mod, fmt, esc } from '../../rules/core.js';
import { grantedSkillSources, skillProficient } from '../../rules/abilities.js';
import { equipSkillBonus } from '../../rules/equipment.js';
import { openNotesModal } from '../../notes-windows.js';

// Skills tab (ports buildSkills / buildSaves / passive senses / their popups).
// All bonuses come from the store's derived stats; clicking a row opens the
// shared floating detail window with a breakdown.

function useSkillHelpers() {
  const { character, data, derived } = useCharacter();
  const pb = derived.pb;

  const skillDetail = (i) => {
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

  const passiveDetail = (skillName) => {
    const info = data.passiveSenseInfo[skillName];
    if (!info) return;
    const i = data.skills.findIndex((s) => s.name === skillName);
    const s = data.skills[i];
    const m = mod(derived.abilities[s.ability]);
    const prof = skillProficient(character, i, data);
    const gear = equipSkillBonus(character, s.name);
    const bonus = derived.skillBonuses[i];
    const parts = ['10', `${s.ability.toUpperCase()} ${fmt(m)}`];
    if (prof) parts.push(`proficiency ${fmt(pb)}`);
    if (gear) parts.push(`gear ${fmt(gear)}`);
    openNotesModal({
      name: 'Passive ' + skillName,
      badges: ['Passive Sense', s.ability.toUpperCase(), prof ? 'Proficient' : 'Not proficient'],
      detail: `<p>${info.desc}</p>
        <p><strong>Score ${10 + bonus}</strong> = ${parts.join(' + ')}</p>
        <p class="nr-hint"><span class="hl">Example:</span> ${info.example}</p>`
    });
  };

  const skillLegend = () => openNotesModal({
    name: 'Skill Proficiencies — Legend', badges: ['Reference'],
    detail: `<p>Click any skill for a quick description. <span class="hl">Highlighted rows are proficiencies</span> — toggle them on the Character Settings tab. Tagged rows are granted by your species or background.</p>`
  });

  return { skillDetail, passiveDetail, skillLegend };
}

export default function SkillsTab() {
  const { character, data, derived } = useCharacter();
  const { skillDetail, passiveDetail, skillLegend } = useSkillHelpers();

  const profCount = data.skills.filter((s, i) => skillProficient(character, i, data)).length;

  return (
    <div className="tab-pane active">
      <div className="grid grid-two">
        <div>
          <div className="panel">
            <h2><span>Skills <button className="legend-btn skill-legend-btn" type="button"
              title="Click any skill for a quick description." onClick={(e) => { e.stopPropagation(); skillLegend(); }}>?</button></span><span className="rune">✦</span></h2>
            <div>
              {data.skills.map((s, i) => {
                const granted = grantedSkillSources(character, s.name, data);
                const prof = !!character.skillProf['sk' + i] || granted.length > 0;
                return (
                  <div key={i} className={'check-row skill-row' + (prof ? ' proficient' : '') + (granted.length ? ' granted' : '')}
                    title="Click for a quick description" onClick={() => skillDetail(i)}>
                    <span className={'prof-dot' + (prof ? ' on' : '') + (granted.length ? ' granted' : '')} />
                    <span className="abbr-tag">{s.ability.toUpperCase()}</span>
                    <span className="name">{s.name}</span>
                    {granted.map((g, j) => <span key={j} className="grant-tag">{g.kind}</span>)}
                    <span className="bonus">{fmt(derived.skillBonuses[i])}</span>
                  </div>
                );
              })}
            </div>
            <div className="mini-row" style={{ marginTop: 8, borderTop: '1px solid var(--parchment-line)', paddingTop: 8 }}>
              <label>Proficiency Bonus</label><span className="val">{fmt(derived.pb)}</span>
            </div>
            <div className="mini-row"><label>Proficient Skills</label><span className="val">{profCount}</span></div>
          </div>
        </div>

        <div>
          <div className="panel">
            <h2><span>Saving Throws</span><span className="rune">✦</span></h2>
            <div>
              {data.abilities.map((a) => (
                <div key={a.key} className="check-row">
                  <span className={'prof-dot' + (character.saveProf[a.key] ? ' on' : '')} />
                  <span className="abbr-tag">{a.key.toUpperCase()}</span>
                  <span className="name">{a.name} Save</span>
                  <span className="bonus">{fmt(derived.saves[a.key])}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <h2><span>Passive Senses</span><span className="rune">✦</span></h2>
            {['Perception', 'Investigation', 'Insight'].map((name) => (
              <div key={name} className="mini-row passive-row" title="Click for a quick description" onClick={() => passiveDetail(name)}>
                <label>Passive {name}</label><span className="val">{derived.passives[name] ?? 10}</span>
              </div>
            ))}
            <div className="picker-hint" style={{ marginTop: 8 }}>Click a sense for details. Passive scores are <span className="hl">10 + skill bonus</span> — what you notice without actively looking.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
