import { useCallback, useEffect, useState } from 'react';
import Layout from '../components/Layout.jsx';
import * as api from '../api/client.js';

// Sessions page — React port of public/modules/sessions.js. Create/join
// campaigns, see members, manage the DM's loaner-character pool, and open
// attached sheets read-only via /?view=<id> (still served by the legacy sheet
// until Phase 3).

const summaryText = (c) => `${c.name || 'Unnamed'} — ${c.class || '?'} ${c.level || 1}${c.race ? ' · ' + c.race : ''}`;
const optionText = (c) => `${c.name || 'Unnamed'} — ${c.class || '?'} ${c.level || 1}`;

function CharacterOptions({ characters }) {
  return characters.map((c) => <option key={c.id} value={c.id}>{optionText(c)}</option>);
}

// The host's loaner pool. The DM offers/withdraws their own characters;
// players can take an unclaimed one, copy it, or hand it back.
function HostCharacters({ detail, myCharacters, onError, refresh }) {
  const [offerId, setOfferId] = useState('');
  const offerable = detail.isDm
    ? myCharacters.filter((c) => !detail.hostCharacters.some((h) => h.id === c.id))
    : [];

  if (!detail.hostCharacters.length && !detail.isDm) return null;

  const act = (fn) => async () => {
    try { await fn(); refresh(); } catch (e) { onError(e.message); }
  };

  return (
    <div>
      <h3 className="host-pool-title">Host's characters</h3>
      {detail.hostCharacters.length ? (
        <table className="session-members">
          <tbody>
            {detail.hostCharacters.map((c) => (
              <tr key={c.id}>
                <td>{summaryText(c)}</td>
                <td>{c.claimedByYou
                  ? <span className="session-badge">in use by you</span>
                  : c.claimedBy
                    ? <span className="session-dim">in use by {c.claimedBy}</span>
                    : <span className="session-dim">available</span>}</td>
                <td>
                  {detail.isDm && <>
                    <a className="pbtn session-view" href={'/?view=' + c.id}>View sheet</a>{' '}
                    <button className="pbtn danger" type="button" onClick={() => {
                      if (!window.confirm('Withdraw this character? Any player using it will be detached.')) return;
                      act(() => api.withdrawHostCharacter(detail.id, c.id))();
                    }}>Withdraw</button>
                  </>}
                  {!detail.isDm && c.claimedByYou && <>
                    <a className="pbtn session-view" href={'/?view=' + c.id}>Open &amp; edit</a>{' '}
                    <button className="pbtn" type="button" onClick={async () => {
                      try {
                        await api.duplicateCharacter(c.id);
                        window.alert('Saved a copy into your characters.');
                      } catch (e) { onError(e.message); }
                    }}>Save a copy</button>{' '}
                    <button className="pbtn" type="button"
                      onClick={act(() => api.setSessionCharacter(detail.id, { characterId: null }))}>Hand back</button>
                  </>}
                  {!detail.isDm && !c.claimedByYou && !c.claimedBy &&
                    <button className="pbtn" type="button"
                      onClick={act(() => api.setSessionCharacter(detail.id, { hostCharacterId: Number(c.id) }))}>Use this character</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <div className="session-dim">You haven't offered any characters yet.</div>}
      {detail.isDm && (
        <div className="sessions-form host-offer">
          <select value={offerId} onChange={(e) => setOfferId(e.target.value)}>
            {offerable.length
              ? <CharacterOptions characters={offerable} />
              : <option value="">— no characters left to offer —</option>}
          </select>
          <button className="pbtn" type="button" disabled={!offerable.length}
            onClick={act(() => api.offerHostCharacter(detail.id, Number(offerId || offerable[0]?.id)))}>
            Offer to players
          </button>
        </div>
      )}
    </div>
  );
}

function SessionDetail({ detail, myCharacters, onError, refresh, onClosed }) {
  const me = detail.members.find((m) => m.isYou);
  const mc = me && me.character;
  // The select lists only your own profiles; a borrowed host character gets a
  // temporary entry so the current pick reads back correctly.
  const attachValue = mc && mc.id ? (mc.borrowed ? 'host:' + mc.id : String(mc.id)) : '';

  const changeAttached = async (value) => {
    if (value.startsWith('host:')) return; // re-picked the borrowed character
    try {
      await api.setSessionCharacter(detail.id, { characterId: value ? Number(value) : null });
      refresh();
    } catch (e) { onError(e.message); }
  };

  const leave = async () => {
    if (!window.confirm(`Leave "${detail.name}"?`)) return;
    try { await api.leaveSession(detail.id); } catch (e) { onError(e.message); return; }
    onClosed();
  };

  const remove = async () => {
    if (!window.confirm(`Delete "${detail.name}" for everyone? This can't be undone.`)) return;
    try { await api.deleteSession(detail.id); } catch (e) { onError(e.message); return; }
    onClosed();
  };

  return (
    <div className="panel">
      <h2><span>{detail.name}</span></h2>
      <div className="session-meta">
        Join code: <span className="session-code big">{detail.code}</span> — share it with your players.
      </div>
      <div>
        <table className="session-members">
          <tbody>
            <tr><th>Player</th><th>Role</th><th>Character</th><th></th></tr>
            {detail.members.map((m) => {
              const c = m.character;
              return (
                <tr key={m.username}>
                  <td>{m.username}{m.isYou && <span className="session-dim"> (you)</span>}</td>
                  <td><span className={'session-badge' + (m.role === 'dm' ? ' dm' : '')}>{m.role === 'dm' ? 'DM' : 'Player'}</span></td>
                  <td>{c
                    ? <>{summaryText(c)}{c.borrowed && <span className="session-dim"> (host's)</span>}</>
                    : <span className="session-dim">none attached</span>}</td>
                  <td>{c && c.id && !m.isYou
                    ? <a className="pbtn session-view" href={'/?view=' + c.id}>View sheet</a>
                    : c && c.id && m.isYou && c.borrowed
                      ? <a className="pbtn session-view" href={'/?view=' + c.id}>Open &amp; edit</a>
                      : null}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <HostCharacters detail={detail} myCharacters={myCharacters} onError={onError} refresh={refresh} />
      <div className="session-detail-actions">
        <label>Your character in this session{' '}
          <select value={attachValue} onChange={(e) => changeAttached(e.target.value)}>
            {mc && mc.id && mc.borrowed && <option value={'host:' + mc.id}>Host's: {mc.name}</option>}
            <option value="">— no character —</option>
            <CharacterOptions characters={myCharacters} />
          </select>
        </label>
        {!detail.isDm && <button className="pbtn danger" type="button" onClick={leave}>Leave session</button>}
        {detail.isDm && <button className="pbtn danger" type="button" onClick={remove}>Delete session</button>}
      </div>
    </div>
  );
}

export default function SessionsPage() {
  const [myCharacters, setMyCharacters] = useState([]);
  const [sessions, setSessions] = useState(null);
  const [detail, setDetail] = useState(null);
  const [error, setError] = useState('');
  const [newName, setNewName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [preview, setPreview] = useState(null); // join chooser state
  const [joinChoice, setJoinChoice] = useState('');

  const loadList = useCallback(async () => {
    try { setSessions(await api.listSessions()); }
    catch (e) { setError(e.message); }
  }, []);

  useEffect(() => {
    api.listCharacters().then(setMyCharacters).catch((e) => setError(e.message));
    loadList();
  }, [loadList]);

  const openDetail = async (id) => {
    setError('');
    try { setDetail(await api.sessionDetail(id)); }
    catch (e) { setError(e.message); }
  };

  const create = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const created = await api.createSession(newName.trim());
      setNewName('');
      await loadList();
      openDetail(created.id);
    } catch (e2) { setError(e2.message); }
  };

  // Joining is two steps: the code looks up the session (name + which loaner
  // characters the host is offering), then the player picks what to play as.
  const lookupJoin = async (e) => {
    e.preventDefault();
    setError('');
    let p;
    try { p = await api.previewSession(joinCode.trim()); }
    catch (e2) { setError(e2.message); return; }
    if (p.alreadyIn) { setError('You are already in that session.'); return; }
    setJoinChoice('');
    setPreview({ ...p, code: joinCode.trim() });
  };

  const confirmJoin = async () => {
    setError('');
    const body = { code: preview.code };
    if (joinChoice.startsWith('own:')) body.characterId = Number(joinChoice.slice(4));
    if (joinChoice.startsWith('host:')) body.hostCharacterId = Number(joinChoice.slice(5));
    try {
      const joined = await api.joinSession(body);
      setPreview(null);
      setJoinCode('');
      await loadList();
      openDetail(joined.id);
    } catch (e) { setError(e.message); }
  };

  const closeDetail = () => { setDetail(null); loadList(); };

  return (
    <Layout page="sessions" title="Sessions">
      <div className="panel">
        <h2><span>Start or join a session</span></h2>
        <div className="sessions-actions">
          <form className="sessions-form" onSubmit={create}>
            <input placeholder="New session name" maxLength={60} required
              value={newName} onChange={(e) => setNewName(e.target.value)} />
            <button className="pbtn" type="submit">Create (you become the DM)</button>
          </form>
          <form className="sessions-form" onSubmit={lookupJoin}>
            <input placeholder="Join code, e.g. K7MPQ2" maxLength={6} required
              value={joinCode} onChange={(e) => setJoinCode(e.target.value)} />
            <button className="pbtn" type="submit">Join as player</button>
          </form>
        </div>
        {preview && (
          <div className="join-chooser">
            <div className="join-chooser-title">{`Joining "${preview.name}" — play as:`}</div>
            <div className="sessions-form">
              <select value={joinChoice} onChange={(e) => setJoinChoice(e.target.value)} autoFocus>
                <option value="">— no character yet —</option>
                {myCharacters.length > 0 && (
                  <optgroup label="Your characters">
                    {myCharacters.map((c) => <option key={c.id} value={'own:' + c.id}>{optionText(c)}</option>)}
                  </optgroup>
                )}
                {preview.hostCharacters.length > 0 && (
                  <optgroup label="Host's characters">
                    {preview.hostCharacters.map((c) => (
                      <option key={c.id} value={'host:' + c.id} disabled={!c.available}>
                        {summaryText(c)}{c.available ? '' : ' (in use)'}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              <button className="pbtn" type="button" onClick={confirmJoin}>Join session</button>
              <button className="pbtn" type="button" onClick={() => setPreview(null)}>Cancel</button>
            </div>
            <div className="session-dim">Pick one of your own characters, take one the host is offering
              (you can read, edit, and copy it), or join without one and decide later.</div>
          </div>
        )}
        {error && <div className="sessions-error">{error}</div>}
      </div>

      <div className="panel">
        <h2><span>Your sessions</span></h2>
        <div className="session-list">
          {sessions && sessions.length === 0 &&
            <div className="session-empty">No sessions yet — create one above, or join with a code from your DM.</div>}
          {(sessions || []).map((s) => (
            <button key={s.id} className="session-row" type="button" onClick={() => openDetail(s.id)}>
              <span className="session-name">{s.name}</span>
              <span className={'session-badge' + (s.role === 'dm' ? ' dm' : '')}>{s.role === 'dm' ? 'DM' : 'Player'}</span>
              <span className="session-count">{s.memberCount} member{s.memberCount === 1 ? '' : 's'}</span>
              <span className="session-code">code {s.code}</span>
            </button>
          ))}
        </div>
      </div>

      {detail && (
        <SessionDetail detail={detail} myCharacters={myCharacters} onError={setError}
          refresh={() => openDetail(detail.id)} onClosed={closeDetail} />
      )}

      <div className="footer-note">Sessions link players together — the DM can open every attached character sheet; players only see each other's name, class and level.</div>
    </Layout>
  );
}
