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

  function summaryText(c){
    return `${esc(c.name || 'Unnamed')} — ${esc(c.class || '?')} ${c.level || 1}${c.race ? ' · ' + esc(c.race) : ''}`;
  }

  let myCharacters = []; // own profiles, cached for the join chooser & DM pool form

  async function fillCharacterSelects(){
    myCharacters = await api('/api/characters');
    document.getElementById('attachCharacter').innerHTML =
      '<option value="">— no character —</option>' + myCharacters.map(characterOption).join('');
    return myCharacters;
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

  // The host's loaner pool. The DM offers/withdraws their own characters;
  // players can take an unclaimed one (read + edit), copy it into their own
  // account, or hand it back.
  function renderHostCharacters(detail){
    const box = document.getElementById('hostCharacters');
    const rows = detail.hostCharacters.map(c => {
      const status = c.claimedByYou
        ? '<span class="session-badge">in use by you</span>'
        : (c.claimedBy
          ? `<span class="session-dim">in use by ${esc(c.claimedBy)}</span>`
          : '<span class="session-dim">available</span>');
      const actions = [];
      if(detail.isDm){
        actions.push(`<a class="pbtn session-view" href="/?view=${c.id}">View sheet</a>`);
        actions.push(`<button class="pbtn danger" data-withdraw="${c.id}" type="button">Withdraw</button>`);
      } else if(c.claimedByYou){
        actions.push(`<a class="pbtn session-view" href="/?view=${c.id}">Open &amp; edit</a>`);
        actions.push(`<button class="pbtn" data-copy="${c.id}" type="button">Save a copy</button>`);
        actions.push(`<button class="pbtn" data-release="${c.id}" type="button">Hand back</button>`);
      } else if(!c.claimedBy){
        actions.push(`<button class="pbtn" data-claim="${c.id}" type="button">Use this character</button>`);
      }
      return `<tr>
        <td>${summaryText(c)}</td>
        <td>${status}</td>
        <td>${actions.join(' ')}</td>
      </tr>`;
    }).join('');

    const offerable = detail.isDm
      ? myCharacters.filter(c => !detail.hostCharacters.some(h => h.id === c.id))
      : [];
    const offerForm = detail.isDm
      ? `<div class="sessions-form host-offer">
          <select id="offerCharacter">${offerable.length
            ? offerable.map(characterOption).join('')
            : '<option value="">— no characters left to offer —</option>'}</select>
          <button class="pbtn" id="offerBtn" type="button" ${offerable.length ? '' : 'disabled'}>Offer to players</button>
        </div>`
      : '';

    if(!detail.hostCharacters.length && !detail.isDm){ box.innerHTML = ''; return; }
    box.innerHTML = `
      <h3 class="host-pool-title">Host&#39;s characters</h3>
      ${detail.hostCharacters.length
        ? `<table class="session-members">${rows}</table>`
        : '<div class="session-dim">You haven&#39;t offered any characters yet.</div>'}
      ${offerForm}`;

    const put = body => api(`/api/sessions/${detail.id}/character`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const refresh = () => openDetail(detail.id);

    box.querySelectorAll('[data-claim]').forEach(b => b.addEventListener('click', async () => {
      try { await put({ hostCharacterId: Number(b.dataset.claim) }); refresh(); }
      catch(e){ showError(e.message); }
    }));
    box.querySelectorAll('[data-release]').forEach(b => b.addEventListener('click', async () => {
      try { await put({ characterId: null }); refresh(); }
      catch(e){ showError(e.message); }
    }));
    box.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
      try {
        await api(`/api/characters/${b.dataset.copy}/duplicate`, { method: 'POST' });
        alert('Saved a copy into your characters.');
      } catch(e){ showError(e.message); }
    }));
    box.querySelectorAll('[data-withdraw]').forEach(b => b.addEventListener('click', async () => {
      if(!confirm('Withdraw this character? Any player using it will be detached.')) return;
      try {
        await api(`/api/sessions/${detail.id}/host-characters/${b.dataset.withdraw}`, { method: 'DELETE' });
        refresh();
      } catch(e){ showError(e.message); }
    }));
    const offerBtn = box.querySelector('#offerBtn');
    if(offerBtn) offerBtn.addEventListener('click', async () => {
      const characterId = Number(box.querySelector('#offerCharacter').value);
      if(!characterId) return;
      try {
        await api(`/api/sessions/${detail.id}/host-characters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ characterId })
        });
        refresh();
      } catch(e){ showError(e.message); }
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
          const summary = c
            ? summaryText(c) + (c.borrowed ? ' <span class="session-dim">(host&#39;s)</span>' : '')
            : '<span class="session-dim">none attached</span>';
          const link = c && c.id && !m.isYou
            ? `<a class="pbtn session-view" href="/?view=${c.id}">View sheet</a>`
            : (c && c.id && m.isYou && c.borrowed
              ? `<a class="pbtn session-view" href="/?view=${c.id}">Open &amp; edit</a>` : '');
          return `<tr>
            <td>${esc(m.username)}${m.isYou ? ' <span class="session-dim">(you)</span>' : ''}</td>
            <td><span class="session-badge ${m.role === 'dm' ? 'dm' : ''}">${m.role === 'dm' ? 'DM' : 'Player'}</span></td>
            <td>${summary}</td>
            <td>${link}</td>
          </tr>`;
        }).join('')}
      </table>`;

    renderHostCharacters(detail);

    const attach = document.getElementById('attachCharacter');
    const me = detail.members.find(m => m.isYou);
    const mc = me && me.character;
    // The select lists only your own profiles; a borrowed host character gets
    // a temporary entry so the current pick reads back correctly.
    const tmp = attach.querySelector('option[data-temp]');
    if(tmp) tmp.remove();
    if(mc && mc.id && mc.borrowed){
      const o = document.createElement('option');
      o.value = 'host:' + mc.id;
      o.dataset.temp = '1';
      o.textContent = `Host's: ${mc.name}`;
      attach.prepend(o);
      attach.value = 'host:' + mc.id;
    } else {
      attach.value = mc && mc.id ? String(mc.id) : '';
    }
    attach.onchange = async () => {
      if(attach.value.startsWith('host:')) return; // re-picked the borrowed character — nothing to do
      try {
        await api(`/api/sessions/${detail.id}/character`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ characterId: attach.value ? Number(attach.value) : null })
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

    // Joining is two steps: the code looks up the session (name + which loaner
    // characters the host is offering), then the player picks what to play as.
    const chooser = document.getElementById('joinChooser');
    const joinSelect = document.getElementById('joinCharacter');

    document.getElementById('joinSessionForm').addEventListener('submit', async e => {
      e.preventDefault();
      showError('');
      const code = document.getElementById('joinCode').value.trim();
      let preview;
      try {
        preview = await api('/api/sessions/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
      } catch(err2){ showError(err2.message); return; }
      if(preview.alreadyIn){ showError('You are already in that session.'); return; }

      document.getElementById('joinChooserTitle').textContent = `Joining "${preview.name}" — play as:`;
      let opts = '<option value="">— no character yet —</option>';
      if(myCharacters.length){
        opts += '<optgroup label="Your characters">'
          + myCharacters.map(c => `<option value="own:${c.id}">${esc(c.name || 'Unnamed')} — ${esc(c.class || '?')} ${c.level || 1}</option>`).join('')
          + '</optgroup>';
      }
      if(preview.hostCharacters.length){
        opts += '<optgroup label="Host&#39;s characters">'
          + preview.hostCharacters.map(c =>
              `<option value="host:${c.id}" ${c.available ? '' : 'disabled'}>${summaryText(c)}${c.available ? '' : ' (in use)'}</option>`
            ).join('')
          + '</optgroup>';
      }
      joinSelect.innerHTML = opts;
      chooser.hidden = false;
      chooser.dataset.code = code;
      joinSelect.focus();
    });

    document.getElementById('joinCancelBtn').addEventListener('click', () => {
      chooser.hidden = true;
    });

    document.getElementById('joinConfirmBtn').addEventListener('click', async () => {
      showError('');
      const choice = joinSelect.value;
      const body = { code: chooser.dataset.code };
      if(choice.startsWith('own:')) body.characterId = Number(choice.slice(4));
      if(choice.startsWith('host:')) body.hostCharacterId = Number(choice.slice(5));
      try {
        const joined = await api('/api/sessions/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        chooser.hidden = true;
        document.getElementById('joinCode').value = '';
        await renderList();
        openDetail(joined.id);
      } catch(err2){ showError(err2.message); }
    });
  };
})();
