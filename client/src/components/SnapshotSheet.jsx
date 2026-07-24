import { useEffect, useMemo, useState } from 'react';
import { mod, fmt } from '../rules/core.js';
import { deriveStats } from '../rules/abilities.js';
import { applyClassesToState } from '../rules/classes.js';
import { getCharacter } from '../api/client.js';

const clone = (o) => (typeof structuredClone === 'function' ? structuredClone(o) : JSON.parse(JSON.stringify(o)));

// Read-only snapshot of a character's main tab for the DM Screen. Loads FROZEN
// at open (captured once); the Refresh button re-fetches and, if the character
// changed since capture, flags it and applies on click. No editing.
export default function SnapshotSheet({ characterId, name, registry }) {
  const [snap, setSnap] = useState(null);      // the frozen, displayed copy
  const [pending, setPending] = useState(null); // a newer copy found by Refresh
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getCharacter(characterId).then((c) => { if (alive) { setSnap(c); setLoading(false); } })
      .catch((e) => { if (alive) { setError(e.message); setLoading(false); } });
    return () => { alive = false; };
  }, [characterId]);

  const refresh = async () => {
    setError('');
    try {
      const fresh = await getCharacter(characterId);
      const changed = JSON.stringify(fresh.data) !== JSON.stringify(snap && snap.data);
      if (changed) setPending(fresh); else setPending(null);
    } catch (e) { setError(e.message); }
  };
  const applyPending = () => { setSnap(pending); setPending(null); };

  // Mirror characterStore.jsx's derive pipeline: clone the frozen snapshot,
  // apply class-driven fields (mutates the clone), then derive display numbers.
  // Without this step, class-driven AC (e.g. Unarmored Defense) and other
  // class-applied fields would be wrong.
  const derived = useMemo(() => {
    if (!registry || !snap) return null;
    const c = clone(snap.data);
    applyClassesToState(c, registry.data);
    return deriveStats(c, registry.data);
  }, [registry, snap]);

  if (loading) return <div className="snapshot-sheet"><div className="action-empty">Loading…</div></div>;
  if (error) return <div className="snapshot-sheet"><div className="action-empty">Could not load: {error}</div></div>;
  if (!snap) return null;

  const ch = snap.data || {};
  const data = registry ? registry.data : null;
  const abilities = (data && data.abilities) || [
    { key: 'str' }, { key: 'dex' }, { key: 'con' }, { key: 'int' }, { key: 'wis' }, { key: 'cha' }
  ];

  return (
    <div className="snapshot-sheet">
      <div className="snapshot-toolbar">
        <button type="button" className="pbtn" onClick={refresh}>↻ Refresh</button>
        {pending && <button type="button" className="pbtn dm-changed" onClick={applyPending}>Changes available — apply</button>}
      </div>

      <div className="panel">
        <h2><span>Ability Scores</span><span className="rune">✦</span></h2>
        {abilities.map((a) => {
          const base = (ch.abilities && ch.abilities[a.key]) || 0;
          const m = derived && derived.mods ? derived.mods[a.key] : mod(base);
          return (
            <div className="ability" key={a.key}>
              <div className="abbr">{a.key.toUpperCase()}</div>
              <div className="mod-badge">{fmt(m)}</div>
              <div className="score-input snapshot-score">{base}</div>
            </div>
          );
        })}
      </div>

      <div className="panel">
        <h2><span>Combat</span><span className="rune">⚔</span></h2>
        <div className="stat-strip">
          <div className="stat-box"><label>Armor Class</label><div className="computed">{derived && derived.ac ? derived.ac.ac : ch.ac}</div></div>
          <div className="stat-box"><label>Initiative</label><div className="computed">{fmt(derived ? derived.initiative : 0)}</div></div>
          <div className="stat-box"><label>Speed</label><div className="computed">{ch.speed}</div></div>
        </div>
        <div className="hp-row">
          <div className="hp-field"><label>Max HP</label><div className="computed">{ch.hpMax}</div></div>
          <div className="hp-field current"><label>Current HP</label><div className="computed">{ch.hpCurrent}</div></div>
          <div className="hp-field"><label>Temp HP</label><div className="computed">{ch.hpTemp}</div></div>
        </div>
        <div className="stat-strip" style={{ marginBottom: 0 }}>
          <div className="stat-box"><label>Hit Dice</label><div className="computed">{ch.hitDice}</div></div>
          <div className="stat-box"><label>Prof. Bonus</label><div className="computed">{derived ? fmt(derived.pb) : ''}</div></div>
        </div>
      </div>
    </div>
  );
}
