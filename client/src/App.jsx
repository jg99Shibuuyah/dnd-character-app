import { useEffect, useState } from 'react';
import { classData, spellData } from './rules/builtin-data.js';

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
