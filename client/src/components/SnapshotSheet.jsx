import { useEffect, useMemo, useState } from 'react';
import { mod, fmt } from '../rules/core.js';
import { deriveStats } from '../rules/abilities.js';
import { applyClassesToState, pickedClasses } from '../rules/classes.js';
import { getCharacter } from '../api/client.js';

const clone = (o) => (typeof structuredClone === 'function' ? structuredClone(o) : JSON.parse(JSON.stringify(o)));

// Read-only snapshot of a party character for the DM Screen. Loads FROZEN at
// open (captured once); Refresh re-fetches and flags/apply changes. Tabbed:
// Overview (abilities + combat), Features, Spells, Actions. No editing. An
// "Add to turn order" button seeds a combatant linked back to this character.
const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'spells', label: 'Spells' },
  { id: 'actions', label: 'Actions' }
];

export default function SnapshotSheet({ characterId, name, registry, onAddToTracker }) {
  const [snap, setSnap] = useState(null);      // the frozen, displayed copy
  const [pending, setPending] = useState(null); // a newer copy found by Refresh
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

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
      setPending(changed ? fresh : null);
    } catch (e) { setError(e.message); }
  };
  const applyPending = () => { setSnap(pending); setPending(null); };

  // Mirror characterStore's derive pipeline: clone, apply class-driven fields
  // (mutates the clone), then derive display numbers. Guarded so a partial or
  // malformed character never crashes the whole DM Screen — the render falls
  // back to the raw stored values when derivation fails.
  const derived = useMemo(() => {
    if (!registry || !snap) return null;
    try {
      const c = clone(snap.data);
      applyClassesToState(c, registry.data);
      return deriveStats(c, registry.data);
    } catch (e) { return null; }
  }, [registry, snap]);

  // Class features (up to each picked class's level) + species traits, read-only.
  const featureList = useMemo(() => {
    if (!registry || !snap) return [];
    try {
      const data = registry.data;
      const ch = snap.data;
      const out = [];
      pickedClasses(ch, data).forEach((pc) => {
        const cd = data.classData[pc.name];
        (cd && cd.features || []).filter((f) => (f.lv || 1) <= (pc.level || 1))
          .forEach((f) => out.push({ src: pc.name, lv: f.lv, name: f.name, desc: f.desc }));
      });
      const sp = ch.race && data.speciesData[ch.race];
      (sp && sp.traits || []).forEach((t) => out.push({ src: ch.race, name: t.name, desc: t.desc }));
      return out;
    } catch (e) { return []; }
  }, [registry, snap]);

  if (loading) return <div className="snapshot-sheet"><div className="action-empty">Loading…</div></div>;
  if (error) return <div className="snapshot-sheet"><div className="action-empty">Could not load: {error}</div></div>;
  if (!snap) return null;

  const ch = snap.data || {};
  const data = registry ? registry.data : null;
  const abilities = (data && data.abilities) || [
    { key: 'str' }, { key: 'dex' }, { key: 'con' }, { key: 'int' }, { key: 'wis' }, { key: 'cha' }
  ];

  const addToTracker = () => onAddToTracker && onAddToTracker({
    characterId, name: name || ch.name || 'Character',
    hp: ch.hpCurrent ?? ch.hpMax ?? 0, hpMax: ch.hpMax ?? 0
  });

  const spellsByLevel = {};
  (ch.knownSpells || []).forEach((s) => (spellsByLevel[s.level || 0] = spellsByLevel[s.level || 0] || []).push(s));
  const spellLevels = Object.keys(spellsByLevel).map(Number).sort((a, b) => a - b);
  const attacks = (ch.attacks || []).filter((a) => (a.name || '').trim());
  const resources = (ch.actionResources || []).filter((r) => (r.name || '').trim());

  return (
    <div className="snapshot-sheet">
      <div className="snapshot-toolbar">
        <button type="button" className="pbtn" onClick={refresh}>↻ Refresh</button>
        {pending && <button type="button" className="pbtn dm-changed" onClick={applyPending}>Changes available — apply</button>}
        {onAddToTracker && <button type="button" className="pbtn snapshot-add" onClick={addToTracker}>⚔ Add to turn order</button>}
      </div>

      <div className="snapshot-tabs">
        {TABS.map((t) => (
          <button key={t.id} type="button" className={'snapshot-tab' + (tab === t.id ? ' active' : '')}
            onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab === 'overview' && (<>
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
      </>)}

      {tab === 'features' && (
        <div className="panel">
          <h2><span>Features &amp; Traits</span><span className="rune">✦</span></h2>
          {(ch.features || '').trim() &&
            <div className="snapshot-freeform">{ch.features}</div>}
          {featureList.length === 0 && !(ch.features || '').trim()
            ? <div className="action-empty">No features recorded.</div>
            : featureList.map((f, i) => (
              <div className="feat-item" key={i}>
                <div className="feat-head">
                  {f.lv ? <span className="f-lvl">L{f.lv}</span> : null}
                  <span className="f-name">{f.name}</span>
                  <span className="nr-badge">{f.src}</span>
                </div>
                {f.desc && <div className="feat-desc">{f.desc}</div>}
              </div>
            ))}
        </div>
      )}

      {tab === 'spells' && (
        <div className="panel">
          <h2><span>Known Spells</span><span className="rune">✶</span></h2>
          {spellLevels.length === 0
            ? <div className="action-empty">No spells known.</div>
            : spellLevels.map((lv) => (
              <div key={lv}>
                <div className="nr-group">{lv === 0 ? 'Cantrips' : 'Level ' + lv}</div>
                {spellsByLevel[lv].map((s, i) => (
                  <div className="feat-item" key={i}>
                    <div className="feat-head"><span className="f-name">{s.name}</span>
                      {(s.tags || []).map((t, j) => <span key={j} className="nr-badge">{t}</span>)}</div>
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}

      {tab === 'actions' && (
        <div className="panel">
          <h2><span>Actions</span><span className="rune">⚔</span></h2>
          <div className="equip-atk-head">Attacks</div>
          {attacks.length === 0
            ? <div className="action-empty">No attacks recorded.</div>
            : attacks.map((a, i) => (
              <div className="feat-item" key={i}>
                <div className="feat-head"><span className="f-name">{a.name}</span>
                  {a.bonus ? <span className="nr-badge">{a.bonus}</span> : null}
                  {a.dmg ? <span className="nr-badge">{a.dmg}</span> : null}</div>
              </div>
            ))}
          {resources.length > 0 && <>
            <div className="equip-atk-head">Limited-Use</div>
            {resources.map((r, i) => (
              <div className="comp-line" key={i}><b>{r.name}:</b> {Math.max(0, (r.total || 0) - (r.used || 0))}/{r.total || 0}</div>
            ))}
          </>}
        </div>
      )}
    </div>
  );
}
