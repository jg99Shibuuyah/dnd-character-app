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

function Rest() {
  const { character, update } = useCharacter();

  const longRest = () => {
    if (!window.confirm('Take a long rest? This restores HP to full, clears death saves, and refills every resource point (spell slots, pact slots, and custom pools).')) return;
    update((d) => {
      d.hpCurrent = d.hpMax;
      d.hpTemp = 0; // temporary HP expires on a long rest
      d.deathSuccess = [false, false, false];
      d.deathFail = [false, false, false];
      (d.spellSlots || []).forEach((s) => { s.used = 0; });
      if (d.pactSlots) d.pactSlots.used = 0;
      (d.actionResources || []).forEach((r) => { r.used = 0; });
      (d.companions || []).forEach((c) => (c.resources || []).forEach((r) => { r.used = 0; }));
    });
  };

  const shortRest = () => {
    // Short rest recovers Warlock pact magic (the resource that recharges on a
    // short rest); HP and other pools stay as they are until a long rest.
    update((d) => { if (d.pactSlots) d.pactSlots.used = 0; });
  };

  const hasPact = (character.pactSlots?.total || 0) > 0;

  return (
    <div className="panel">
      <h2><span>Rest</span><span className="rune">☾</span></h2>
      <div className="rest-buttons">
        <button className="rest-btn short" type="button" onClick={shortRest}>Short Rest</button>
        <button className="rest-btn long" type="button" onClick={longRest}>Long Rest</button>
      </div>
      <div className="picker-hint" style={{ marginTop: 8 }}>
        <span className="hl">Long rest</span> restores HP and all resource points to full.{' '}
        <span className="hl">Short rest</span> {hasPact ? 'restores your Warlock pact slots.' : 'recovers short-rest resources (e.g. Warlock pact slots).'}
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
          <Rest />
          <Companions />
        </div>
      </div>
    </div>
  );
}
