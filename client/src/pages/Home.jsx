import { useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import { classData, spellData } from '../rules/builtin-data.js';
import { defaultCharacter } from '../rules/core.js';
import { deriveStats } from '../rules/abilities.js';
import { applyClassesToState } from '../rules/classes.js';
import * as api from '../api/client.js';

// Migration-status landing page at /next/. Replaced by the character sheet in
// Phase 3; until then it doubles as the smoke test for data + API wiring.
export default function Home() {
  const [characters, setCharacters] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.listCharacters().then(setCharacters).catch((e) => setError(e.message));
  }, []);

  const rulesCheck = (() => {
    const c = defaultCharacter();
    c.classes = [{ name: 'Wizard', level: 5 }, { name: 'Paladin', level: 2 }];
    c.abilities.dex = 16;
    c.equipment = [{ name: 'Plate', equipped: true, ac: '=18', abilities: {}, skills: [], spells: [], attack: {} }];
    applyClassesToState(c);
    const d = deriveStats(c);
    return `Wizard 5/Paladin 2: level ${c.level}, PB +${d.pb}, AC ${d.ac.ac}, L3 slots ${c.spellSlots[2].total}, hit dice ${c.hitDice}.`;
  })();

  return (
    <Layout page="sheet" title="React Client (migration)">
      <div className="panel">
        <h2><span>Migration status</span><span className="rune">⚙</span></h2>
        <p>The React frontend is being built here page by page. Ported so far: <a href="/next/sessions">Sessions</a>.</p>
        <p>Everything else still lives on the <a href="/">legacy pages</a>.</p>
      </div>
      <div className="panel">
        <h2><span>Wiring checks</span><span className="rune">✦</span></h2>
        <p>{Object.keys(classData || {}).length} classes, {Object.keys(spellData || {}).length} spell entries loaded from shared globals.</p>
        <p>Rules check — {rulesCheck}</p>
        {error && <p>Failed to reach /api/characters: {error}</p>}
        {characters && <p>API check — {characters.length} character{characters.length === 1 ? '' : 's'} on your account.</p>}
      </div>
    </Layout>
  );
}
