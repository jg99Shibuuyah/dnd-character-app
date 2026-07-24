import { useState } from 'react';

function fmtTime(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

// The DM Screen's combat log: round/turn changes are appended automatically by
// the turn-order tracker; the DM can also type manual entries. Newest first.
export default function CombatLog({ log = [], onAdd, onClear }) {
  const [text, setText] = useState('');
  const add = () => { const t = text.trim(); if (!t) return; onAdd(t); setText(''); };

  return (
    <div className="panel combat-log">
      <h2><span>Combat Log</span>
        <button className="pbtn rolllog-clear" type="button" onClick={onClear} disabled={!log.length}>Clear</button></h2>
      <div className="picker-hint">Round &amp; turn changes are recorded automatically — add your own entries below.</div>
      <div className="journal-compose">
        <input type="text" placeholder="Log an event (a hit, a death, a plot beat)…" value={text}
          onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') add(); }} />
        <button className="add-btn" onClick={add}>+ Log</button>
      </div>
      <div className="combat-log-list">
        {log.length === 0
          ? <div className="journal-empty">No log entries yet — advance a turn or add one above.</div>
          : [...log].reverse().map((e) => (
            <div key={e.id} className={'combat-log-row' + (e.manual ? ' manual' : '')}>
              <span className="combat-log-time">{fmtTime(e.time)}</span>
              <span className="combat-log-text">{e.text}</span>
            </div>
          ))}
      </div>
    </div>
  );
}
