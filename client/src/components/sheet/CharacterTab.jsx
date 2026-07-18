import { useCharacter } from '../../state/characterStore.jsx';
import { mod, fmt } from '../../rules/core.js';
import Companions from './Companions.jsx';

// Number input bound to a character field via update(). Keeps the raw string
// locally is overkill here — the sheet stored plain numbers, so parse on change.
function NumField({ value, onChange, ...rest }) {
  return <input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)} {...rest} />;
}

function AbilityScores() {
  const { character, data, derived, update } = useCharacter();
  return (
    <div className="panel">
      <h2><span>Ability Scores</span><span className="rune">✦</span></h2>
      {data.abilities.map((a) => {
        const base = character.abilities[a.key] || 0;
        const effMod = derived ? derived.mods[a.key] : mod(base);
        const eff = derived ? derived.abilities[a.key] : base;
        const diff = eff - base;
        return (
          <div className="ability" key={a.key}>
            <div className="abbr">{a.key.toUpperCase()}</div>
            <div className={'mod-badge' + (diff > 0 ? ' buffed' : diff < 0 ? ' nerfed' : '')}
              title={diff ? `${a.key.toUpperCase()} ${eff} (base ${base}, gear ${fmt(diff)})` : ''}>
              {fmt(effMod)}
            </div>
            <input className="score-input" type="number" value={base}
              onChange={(e) => update((d) => { d.abilities[a.key] = parseInt(e.target.value) || 0; })} />
          </div>
        );
      })}
    </div>
  );
}

function Derived() {
  const { derived } = useCharacter();
  if (!derived) return null;
  const ac = derived.ac;
  const breakdown = (ac.usedArmor ? `armor ${ac.armorBase}` : `10 + DEX ${fmt(ac.dexMod)}`)
    + (ac.adds ? ` + gear ${fmt(ac.adds)}` : '');
  return (
    <div className="panel">
      <h2><span>Derived</span><span className="rune">✦</span></h2>
      <div className="mini-row"><label>Proficiency Bonus</label><span className="val">{fmt(derived.pb)}</span></div>
      <div className="mini-row"><label>Armor Class</label><span className="val">{ac.ac}</span></div>
      <div className="ac-breakdown">{breakdown}</div>
    </div>
  );
}

function DeathSaves() {
  const { character, update } = useCharacter();
  const row = (key, label) => (
    <div className="grp">{label}
      {[0, 1, 2].map((i) => (
        <span key={i} className={'pip ' + (key === 'deathSuccess' ? 'success' : 'fail') + (character[key][i] ? ' filled' : '')}
          onClick={() => update((d) => { d[key][i] = !d[key][i]; })} />
      ))}
    </div>
  );
  return <div className="death-saves">{row('deathSuccess', 'Success')}{row('deathFail', 'Fail')}</div>;
}

function Combat() {
  const { character, derived, update } = useCharacter();
  const set = (k) => (v) => update((d) => { d[k] = v; });
  return (
    <div className="panel">
      <h2><span>Combat</span><span className="rune">⚔</span></h2>
      <div className="stat-strip">
        <div className="stat-box"><label>Armor Class</label><NumField value={character.ac} onChange={set('ac')} /></div>
        <div className="stat-box"><label>Initiative</label><div className="computed">{fmt(derived ? derived.initiative : 0)}</div></div>
        <div className="stat-box"><label>Speed</label><NumField value={character.speed} onChange={set('speed')} /></div>
      </div>
      <div className="hp-row">
        <div className="hp-field"><label>Max HP</label><NumField value={character.hpMax} onChange={set('hpMax')} /></div>
        <div className="hp-field current"><label>Current HP</label><NumField value={character.hpCurrent} onChange={set('hpCurrent')} /></div>
        <div className="hp-field"><label>Temp HP</label><NumField value={character.hpTemp} onChange={set('hpTemp')} /></div>
      </div>
      <div className="stat-strip" style={{ marginBottom: 0 }}>
        <div className="stat-box"><label>Hit Dice</label>
          <input value={character.hitDice} onChange={(e) => set('hitDice')(e.target.value)} /></div>
        <div className="stat-box" style={{ gridColumn: 'span 2' }}>
          <label>Death Saves</label>
          <DeathSaves />
        </div>
      </div>
    </div>
  );
}

export default function CharacterTab() {
  return (
    <div className="tab-pane active">
      <div className="grid grid-sheet">
        <div>
          <AbilityScores />
          <Derived />
        </div>
        <div>
          <Combat />
          <Companions />
        </div>
      </div>
    </div>
  );
}
