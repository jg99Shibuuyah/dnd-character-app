import { useState } from 'react';
import { useCharacter } from '../../state/characterStore.jsx';

// Floating dice roller (ports modules/dice.js): a 🎲 FAB opens a tray to build
// a dice pool, roll it (with d20 advantage/disadvantage and a flat modifier),
// and log the result to the character's roll log (shown on the Journal tab).

const DICE = [4, 6, 8, 10, 12, 20, 100];
const SHAPES = {
  4: '20,3 37,36 3,36', 6: 'rect', 8: '20,2 38,20 20,38 2,20',
  10: '20,2 36,15 29,37 11,37 4,15', 12: '20,2 37,16 30,37 10,37 3,16',
  20: '20,2 36,11 36,29 20,38 4,29 4,11', 100: '20,2 36,15 29,37 11,37 4,15'
};

function DieSvg({ sides }) {
  const label = sides === 100 ? '%' : sides;
  const spec = SHAPES[sides];
  return (
    <svg viewBox="0 0 40 40" className="die-svg" aria-hidden="true">
      {spec === 'rect' ? <rect x="5" y="5" width="30" height="30" rx="4" className="die-shape" /> : <polygon points={spec} className="die-shape" />}
      <text x="20" y="24" className="die-label">{label}</text>
    </svg>
  );
}

const rand = (sides) => Math.floor(Math.random() * sides) + 1;

export default function DiceRoller() {
  const { update } = useCharacter();
  const [open, setOpen] = useState(false);
  const [pool, setPool] = useState({}); // sides -> count
  const [advMode, setAdvMode] = useState('normal');
  const [modifier, setModifier] = useState('');
  const [result, setResult] = useState(null); // { lines, formula, total } | { hint }

  const poolStr = () => DICE.filter((s) => pool[s]).map((s) => {
    const tag = (s === 20 && advMode !== 'normal') ? ` (${advMode === 'adv' ? 'adv' : 'dis'})` : '';
    return `${pool[s]}d${s === 100 ? '%' : s}${tag}`;
  }).join(' + ');

  const addDie = (s) => setPool((p) => ({ ...p, [s]: (p[s] || 0) + 1 }));
  const removeDie = (s) => setPool((p) => { const n = { ...p }; if (n[s]) { n[s]--; if (!n[s]) delete n[s]; } return n; });
  const clearPool = () => { setPool({}); setResult(null); };

  const roll = () => {
    const kinds = DICE.filter((s) => pool[s]);
    if (!kinds.length) { setResult({ hint: 'Add some dice first.' }); return; }
    const mod = parseInt(modifier, 10) || 0;
    let total = 0;
    const lines = kinds.map((s) => {
      const entries = [];
      const useAdv = (s === 20 && advMode !== 'normal');
      for (let i = 0; i < pool[s]; i++) {
        if (useAdv) {
          const a = rand(s), b = rand(s);
          const kept = advMode === 'adv' ? Math.max(a, b) : Math.min(a, b);
          const drop = advMode === 'adv' ? Math.min(a, b) : Math.max(a, b);
          entries.push({ v: kept, dropped: false });
          entries.push({ v: drop, dropped: true });
          total += kept;
        } else {
          const r = rand(s);
          entries.push({ v: r, dropped: false });
          total += r;
        }
      }
      return { sides: s, entries };
    });
    total += mod;
    const modStr = mod ? ` ${mod > 0 ? '+' : '−'} ${Math.abs(mod)}` : '';
    const formula = poolStr() + modStr;
    setResult({ lines, formula, total });

    // Log to the character's roll log (capped at 200).
    const detail = lines.map((l) => `d${l.sides === 100 ? '100' : l.sides}: ${l.entries.map((e) => e.dropped ? `(${e.v})` : e.v).join(', ')}`).join('  •  ');
    update((d) => {
      d.rollLog = d.rollLog || [];
      d.rollLog.unshift({ id: 'r' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), formula, detail, total, time: new Date().toISOString() });
      if (d.rollLog.length > 200) d.rollLog.length = 200;
    });
  };

  return (
    <>
      <div className="fab-stack">
        <button className={'corner-fab fab-item' + (open ? ' open' : '')} type="button" title="Dice roller" aria-label="Open dice roller" onClick={() => setOpen(!open)}>
          <span className="fab-label">Dice</span>
          <span className="corner-fab-glyph">🎲</span>
        </button>
      </div>
      <div className={'corner-popup' + (open ? ' open' : '')} role="dialog" aria-label="Dice roller">
        <div className="corner-popup-head">
          <div className="corner-popup-title"><span>Dice</span><span className="rune">◈</span></div>
          <button className="corner-popup-close" type="button" aria-label="Close" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="dice-tray">
          {DICE.map((s) => (
            <button key={s} className="die-btn" type="button" title={`Add d${s === 100 ? '100' : s} (right-click to remove)`}
              onClick={() => addDie(s)} onContextMenu={(e) => { e.preventDefault(); removeDie(s); }}>
              <DieSvg sides={s} />
              <span className="die-name">d{s === 100 ? '100' : s}</span>
              <span className="die-count">{pool[s] || ''}</span>
            </button>
          ))}
        </div>
        <div className="dice-pool-row">
          <span className={'dice-pool' + (poolStr() ? '' : ' empty')}>{poolStr() || 'Tap dice to build a roll'}</span>
          <button className="pbtn dice-clear" type="button" onClick={clearPool}>Clear</button>
        </div>
        <div className="dice-adv" title="Applies to d20 rolls">
          {[['normal', 'Normal'], ['adv', 'Advantage'], ['dis', 'Disadvantage']].map(([k, label]) => (
            <button key={k} type="button" className={'dice-adv-btn' + (advMode === k ? ' on' : '')} onClick={() => setAdvMode(k)}>{label}</button>
          ))}
        </div>
        <div className="dice-controls">
          <label className="dice-mod-label">Mod
            <input type="number" value={modifier} onChange={(e) => setModifier(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') roll(); }} />
          </label>
          <button className="add-btn dice-roll" type="button" onClick={roll}>Roll</button>
        </div>
        <div className="dice-result">
          {result && result.hint && <div className="dice-hint">{result.hint}</div>}
          {result && result.lines && (
            <>
              {result.lines.map((l, i) => (
                <div className="dice-line" key={i}>
                  <span className="dice-line-die">d{l.sides === 100 ? '100' : l.sides}</span>
                  <span className="dice-line-rolls">{l.entries.map((e, j) => (
                    <b key={j} className={e.dropped ? 'dropped' : (e.v === l.sides ? 'crit' : (e.v === 1 ? 'fail' : ''))}>{e.v}</b>
                  ))}</span>
                </div>
              ))}
              <div className="dice-total"><span className="dice-total-label">{result.formula}</span><span className="dice-total-val">{result.total}</span></div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
