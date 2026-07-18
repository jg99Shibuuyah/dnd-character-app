import { useEffect, useState } from 'react';
import { classData, spellData } from './rules/builtin-data.js';
import { defaultCharacter } from './rules/core.js';
import { deriveStats } from './rules/abilities.js';
import { applyClassesToState } from './rules/classes.js';

// Phase 0 smoke-test page: proves the Vite client can reach the Express API
// (session cookie included) and see the builtin game-data globals. Replaced
// by the real pages as migration phases land.
export default function App() {
  const [characters, setCharacters] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/characters')
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then(setCharacters)
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="wrap">
      <h1>React client — Phase 0</h1>
      <div className="panel">
        <h2><span>Builtin data</span><span className="rune">✦</span></h2>
        <p>{Object.keys(classData || {}).length} classes, {Object.keys(spellData || {}).length} spell entries loaded from shared globals.</p>
        <p>{(() => {
          // Rules smoke test: a Wizard 5 / Paladin 2 with DEX 16 in plate.
          const c = defaultCharacter();
          c.classes = [{ name: 'Wizard', level: 5 }, { name: 'Paladin', level: 2 }];
          c.abilities.dex = 16;
          c.equipment = [{ name: 'Plate', equipped: true, ac: '=18', abilities: {}, skills: [], spells: [], attack: {} }];
          applyClassesToState(c);
          const d = deriveStats(c);
          return `Rules check — Wizard 5/Paladin 2: level ${c.level}, PB +${d.pb}, AC ${d.ac.ac}, `
            + `L3 slots ${c.spellSlots[2].total}, hit dice ${c.hitDice}.`;
        })()}</p>
      </div>
      <div className="panel">
        <h2><span>API</span><span className="rune">⇄</span></h2>
        {error && <p>Failed to reach /api/characters: {error}</p>}
        {!error && !characters && <p>Loading characters…</p>}
        {characters && (
          <ul>
            {characters.map((c) => <li key={c.id}>{c.name}</li>)}
            {characters.length === 0 && <li>No characters yet — the API answered with an empty list.</li>}
          </ul>
        )}
      </div>
    </div>
  );
}
