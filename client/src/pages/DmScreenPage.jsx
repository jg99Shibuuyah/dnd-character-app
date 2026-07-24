import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout.jsx';
import LibrarySearch from '../components/LibrarySearch.jsx';
import MonsterDetail from '../components/MonsterDetail.jsx';
import SheetWindow from '../components/sheet/SheetWindow.jsx';
import { useRegistry } from '../state/registry.js';
import * as api from '../api/client.js';

export default function DmScreenPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { registry } = useRegistry();
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [monsterWindows, setMonsterWindows] = useState([]); // [{key, monster}]

  // Combat tracker state is owned here so both the tracker (Task 13) and the
  // "Add to turn order" button on monster windows can mutate it.
  const [combat, setCombat] = useState(null);

  useEffect(() => {
    api.sessionDetail(sessionId)
      .then((d) => {
        if (!d.isDm) { setError('Only the DM can open the DM Screen for this session.'); return; }
        setDetail(d);
      })
      .catch((e) => setError(e.message));
  }, [sessionId]);

  // Load persisted combat once we know the user is the DM.
  useEffect(() => {
    if (!detail) return;
    api.getCombat(sessionId).then((r) => setCombat(r.combat)).catch(() => setCombat({ combatants: [], activeIndex: 0, round: 1 }));
  }, [detail, sessionId]);

  const openMonster = (entry) => setMonsterWindows((ws) => [...ws,
    { key: 'mw' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), monster: entry.monster || { name: entry.name, data: {} } }]);
  const closeMonster = (key) => setMonsterWindows((ws) => ws.filter((w) => w.key !== key));

  // Seed a free-form combatant from a monster (used in Task 13).
  const addMonsterToTracker = useCallback((monster) => {
    const d = monster.data || {};
    setCombat((c) => {
      const base = c || { combatants: [], activeIndex: 0, round: 1 };
      const combatant = {
        id: 'cb' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        name: monster.name, initiative: 0, hp: d.hpMax || 0, hpMax: d.hpMax || 0,
        legendaryMax: d.legendaryCount || 0, legendaryUsed: 0, resources: [], note: d.cr ? 'CR ' + d.cr : ''
      };
      return { ...base, combatants: [...base.combatants, combatant] };
    });
  }, []);

  if (error) {
    return (
      <Layout page="sessions" title="DM Screen">
        <div className="panel"><div className="action-empty">{error}</div>
          <button className="pbtn" type="button" onClick={() => navigate('/sessions')}>← Back to sessions</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout page="sessions" title={detail ? `DM Screen — ${detail.name}` : 'DM Screen'}>
      <div className="panel dm-screen-head">
        <button className="pbtn" type="button" onClick={() => navigate('/sessions')}>← Sessions</button>
        <h2 style={{ display: 'inline-block', marginLeft: 12 }}><span>{detail ? detail.name : 'Loading…'}</span></h2>
      </div>

      {/* Region 2 — Party snapshots (Task 11 inserts <PartySnapshots …/> here) */}

      {/* Region 3 — Turn order (Task 13 inserts the button + <TurnOrderTracker …/> here) */}

      {/* Region 1 — Reference + monsters */}
      {registry && <LibrarySearch registry={registry} includeMonsters onOpenMonster={openMonster} />}

      {/* Region 4 — DM notepad (Task 12 inserts <DmNotes …/> here) */}

      {monsterWindows.map((w, i) => (
        <SheetWindow key={w.key} title={w.monster.name} icon="🐉" offset={i * 26} onClose={() => closeMonster(w.key)}>
          <MonsterDetail entry={{ name: w.monster.name, monster: w.monster }} onAddToTracker={addMonsterToTracker} />
        </SheetWindow>
      ))}
    </Layout>
  );
}
