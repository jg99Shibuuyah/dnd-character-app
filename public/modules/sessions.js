// Sessions page: create/join campaigns, see members, and (as DM) open any
// attached character sheet read-only via /?view=<id>. app.js calls
// window.initSessionsPage() when body[data-page="sessions"].
(function(){
  const err = () => document.getElementById('sessionsError');

  function showError(message){
    const el = err();
    el.textContent = message;
    el.hidden = !message;
  }

  async function api(url, options){
    const r = await fetch(url, options);
    if(r.status === 401){ location.href = '/login'; throw new Error('unauthorized'); }
    const data = await r.json().catch(() => ({}));
    if(!r.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g,
      c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function characterOption(c){
    return `<option value="${c.id}">${esc(c.name || 'Unnamed')} — ${esc(c.class || '?')} ${c.level || 1}</option>`;
  }

  async function fillCharacterSelects(){
    const chars = await api('/api/characters');
    const opts = '<option value="">— no character —</option>' + chars.map(characterOption).join('');
    document.getElementById('joinCharacter').innerHTML = opts;
    document.getElementById('attachCharacter').innerHTML = opts;
    return chars;
  }

  async function renderList(){
    const sessions = await api('/api/sessions');
    const box = document.getElementById('sessionList');
    if(sessions.length === 0){
      box.innerHTML = '<div class="session-empty">No sessions yet — create one above, or join with a code from your DM.</div>';
      return;
    }
    box.innerHTML = sessions.map(s => `
      <button class="session-row" data-id="${s.id}" type="button">
        <span class="session-name">${esc(s.name)}</span>
        <span class="session-badge ${s.role === 'dm' ? 'dm' : ''}">${s.role === 'dm' ? 'DM' : 'Player'}</span>
        <span class="session-count">${s.memberCount} member${s.memberCount === 1 ? '' : 's'}</span>
        <span class="session-code">code ${esc(s.code)}</span>
      </button>
    `).join('');
    box.querySelectorAll('.session-row').forEach(row => {
      row.addEventListener('click', () => openDetail(row.dataset.id));
    });
  }

  async function openDetail(id){
    showError('');
    let detail;
    try { detail = await api('/api/sessions/' + id); }
    catch(e){ showError(e.message); return; }

    const panel = document.getElementById('sessionDetailPanel');
    panel.hidden = false;
    document.getElementById('sessionDetailTitle').textContent = detail.name;
    document.getElementById('sessionMeta').innerHTML =
      `Join code: <span class="session-code big">${esc(detail.code)}</span> — share it with your players.`;

    document.getElementById('sessionMembers').innerHTML = `
      <table class="session-members">
        <tr><th>Player</th><th>Role</th><th>Character</th><th></th></tr>
        ${detail.members.map(m => {
          const c = m.character;
          const summary = c ? `${esc(c.name)} — ${esc(c.class || '?')} ${c.level || 1}${c.race ? ' · ' + esc(c.race) : ''}` : '<span class="session-dim">none attached</span>';
          const link = c && c.id && !m.isYou
            ? `<a class="pbtn session-view" href="/?view=${c.id}">View sheet</a>` : '';
          return `<tr>
            <td>${esc(m.username)}${m.isYou ? ' <span class="session-dim">(you)</span>' : ''}</td>
            <td><span class="session-badge ${m.role === 'dm' ? 'dm' : ''}">${m.role === 'dm' ? 'DM' : 'Player'}</span></td>
            <td>${summary}</td>
            <td>${link}</td>
          </tr>`;
        }).join('')}
      </table>`;

    const attach = document.getElementById('attachCharacter');
    const me = detail.members.find(m => m.isYou);
    attach.value = me && me.character && me.character.id ? String(me.character.id) : '';
    attach.onchange = async () => {
      try {
        await api(`/api/sessions/${detail.id}/character`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ characterId: attach.value || null })
        });
        openDetail(detail.id);
      } catch(e){ showError(e.message); }
    };

    const leaveBtn = document.getElementById('leaveSessionBtn');
    const deleteBtn = document.getElementById('deleteSessionBtn');
    leaveBtn.hidden = detail.isDm;
    deleteBtn.hidden = !detail.isDm;
    leaveBtn.onclick = async () => {
      if(!confirm(`Leave "${detail.name}"?`)) return;
      try { await api(`/api/sessions/${detail.id}/leave`, { method: 'POST' }); }
      catch(e){ showError(e.message); return; }
      panel.hidden = true;
      renderList();
    };
    deleteBtn.onclick = async () => {
      if(!confirm(`Delete "${detail.name}" for everyone? This can't be undone.`)) return;
      try { await api('/api/sessions/' + detail.id, { method: 'DELETE' }); }
      catch(e){ showError(e.message); return; }
      panel.hidden = true;
      renderList();
    };
  }

  window.initSessionsPage = async function(){
    await fillCharacterSelects();
    await renderList();

    document.getElementById('createSessionForm').addEventListener('submit', async e => {
      e.preventDefault();
      showError('');
      const name = document.getElementById('newSessionName').value.trim();
      try {
        const created = await api('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });
        document.getElementById('newSessionName').value = '';
        await renderList();
        openDetail(created.id);
      } catch(err2){ showError(err2.message); }
    });

    document.getElementById('joinSessionForm').addEventListener('submit', async e => {
      e.preventDefault();
      showError('');
      const code = document.getElementById('joinCode').value.trim();
      const characterId = document.getElementById('joinCharacter').value || null;
      try {
        const joined = await api('/api/sessions/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, characterId })
        });
        document.getElementById('joinCode').value = '';
        await renderList();
        openDetail(joined.id);
      } catch(err2){ showError(err2.message); }
    });
  };
})();
