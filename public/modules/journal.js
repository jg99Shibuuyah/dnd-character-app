(function(){
  function init(app){
    const { save } = app;

    const esc = s => (s==null?'':String(s))
      .replace(/&/g,'&amp;').replace(/"/g,'&quot;')
      .replace(/</g,'&lt;').replace(/>/g,'&gt;');

    // Entries live on the character itself so every profile keeps its own log.
    function entries(){
      if(!Array.isArray(app.state.journal)) app.state.journal = [];
      return app.state.journal;
    }

    // Dice roll history, also per-character; written by the dice roller.
    function rollLog(){
      if(!Array.isArray(app.state.rollLog)) app.state.rollLog = [];
      return app.state.rollLog;
    }

    function fmtDate(iso){
      const d = new Date(iso);
      if(isNaN(d)) return '';
      return d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})
        + ' · ' + d.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'});
    }

    function preview(text){
      const t = (text||'').trim();
      return t.length > 180 ? t.slice(0,180)+'…' : t;
    }

    // ---------- Journal tab: grid of note cards ----------
    function buildTab(){
      const grid = document.getElementById('journalEntries');
      if(!grid) return;

      const nameEl = document.getElementById('journalCharName');
      if(nameEl) nameEl.textContent = app.state.name || 'Unnamed Adventurer';

      const items = entries();
      const countEl = document.getElementById('journalCount');
      if(countEl) countEl.textContent = items.length
        ? (items.length + (items.length===1 ? ' note' : ' notes'))
        : 'No notes yet';

      if(items.length===0){
        grid.innerHTML = '<div class="journal-empty">No entries yet — use the box above to record your first note.</div>';
        return;
      }

      grid.innerHTML = items.map(en=>`
        <div class="journal-card" data-id="${en.id}" role="button" tabindex="0" aria-label="Open journal entry">
          <div class="journal-card-head">
            <span class="journal-card-title">${esc(en.title) || '<i>Untitled</i>'}</span>
            <span class="journal-card-del" data-id="${en.id}" title="Delete note" aria-label="Delete note">✕</span>
          </div>
          <div class="journal-card-date">${fmtDate(en.created)}${en.updated && en.updated!==en.created ? ' · edited' : ''}</div>
          <div class="journal-card-preview">${esc(preview(en.text)) || '<span class="journal-card-empty">(no text)</span>'}</div>
        </div>`).join('');
    }

    // ---------- Floating quick-note popup: compact list ----------
    function buildPopup(){
      const list = document.getElementById('journalPopList');
      if(!list) return;

      const nameEl = document.getElementById('journalPopCharName');
      if(nameEl) nameEl.textContent = app.state.name || 'Unnamed Adventurer';

      const items = entries();
      const badge = document.getElementById('journalPopCount');
      if(badge){
        badge.textContent = items.length || '';
        badge.style.display = items.length ? '' : 'none';
      }

      if(items.length===0){
        list.innerHTML = '<div class="journal-empty">No entries yet.</div>';
        return;
      }

      list.innerHTML = items.map(en=>`
        <div class="jpop-row" data-id="${en.id}" role="button" tabindex="0" aria-label="Open journal entry">
          <div class="jpop-row-main">
            <div class="jpop-row-title">${esc(en.title) || '<i>Untitled</i>'}</div>
            <div class="jpop-row-date">${fmtDate(en.created)}${en.updated && en.updated!==en.created ? ' · edited' : ''}</div>
            <div class="jpop-row-preview">${esc(preview(en.text))}</div>
          </div>
          <span class="jpop-row-del" data-id="${en.id}" title="Delete note" aria-label="Delete note">✕</span>
        </div>`).join('');
    }

    // ---------- Roll log: a section of the Journal tab ----------
    function buildRollLog(){
      const box = document.getElementById('rollLogList');
      if(!box) return;
      const log = rollLog();
      const countEl = document.getElementById('rollLogCount');
      if(countEl) countEl.textContent = log.length
        ? (log.length + (log.length===1 ? ' roll' : ' rolls'))
        : 'No rolls yet';
      if(log.length===0){
        box.innerHTML = '<div class="journal-empty">No rolls yet — open the dice roller (🎲, bottom-right) and hit Roll.</div>';
        return;
      }
      box.innerHTML = log.map(r=>`
        <div class="rolllog-row" data-id="${r.id}">
          <div class="rolllog-main">
            <div class="rolllog-formula">${esc(r.formula)}<span class="rolllog-total">${esc(r.total)}</span></div>
            <div class="rolllog-detail">${esc(r.detail)}</div>
            <div class="rolllog-time">${fmtDate(r.time)}</div>
          </div>
          <span class="rolllog-del" data-id="${r.id}" title="Remove from log" aria-label="Remove from log">✕</span>
        </div>`).join('');
    }

    // Refresh every journal surface after any change.
    function renderJournal(){ buildTab(); buildPopup(); buildRollLog(); }

    // ---------- Detail modal: editable Title + Entry sections ----------
    let openId = null;

    function setStatus(msg){
      const el = document.getElementById('jrnlModalStatus');
      if(el) el.textContent = msg || '';
    }

    function openModal(id){
      const en = entries().find(x=>x.id===id);
      if(!en) return;
      openId = id;
      document.getElementById('jrnlModalTitle').value = en.title || '';
      document.getElementById('jrnlModalText').value = en.text || '';
      document.getElementById('jrnlModalDate').textContent =
        'Created ' + fmtDate(en.created) + (en.updated && en.updated!==en.created ? ' · edited ' + fmtDate(en.updated) : '');
      setStatus('');
      const backdrop = document.getElementById('jrnlModalBackdrop');
      backdrop.classList.add('open');
      backdrop.setAttribute('aria-hidden','false');
      setTimeout(()=>{ const t = document.getElementById('jrnlModalTitle'); if(t) t.focus(); }, 0);
    }

    function closeModal(){
      openId = null;
      const backdrop = document.getElementById('jrnlModalBackdrop');
      backdrop.classList.remove('open');
      backdrop.setAttribute('aria-hidden','true');
    }

    function saveModal(closeAfter){
      const en = entries().find(x=>x.id===openId);
      if(!en) return;
      const title = document.getElementById('jrnlModalTitle').value.trim();
      const text = document.getElementById('jrnlModalText').value.trim();
      const changed = title!==(en.title||'') || text!==(en.text||'');
      if(changed){
        en.title = title;
        en.text = text;
        en.updated = new Date().toISOString();
        save();
      }
      renderJournal();
      if(closeAfter) closeModal();
      else setStatus(changed ? 'Saved' : 'No changes');
    }

    function deleteEntry(id){
      const en = entries().find(x=>x.id===id);
      if(!confirm(`Delete "${(en&&en.title)||'this entry'}"? This can't be undone.`)) return false;
      app.state.journal = entries().filter(x=>x.id!==id);
      renderJournal();
      save();
      return true;
    }

    // Generic add used by both the tab composer and the popup composer.
    function addEntry(titleEl, textEl){
      const title = titleEl.value.trim();
      const text = textEl.value.trim();
      if(!title && !text) return;
      const now = new Date().toISOString();
      entries().unshift({ id:'j'+Date.now().toString(36)+Math.random().toString(36).slice(2,6), title, text, created:now, updated:now });
      titleEl.value=''; textEl.value='';
      renderJournal();
      save();
    }

    // ---------- Floating popup open/close ----------
    function togglePopup(open){
      const popup = document.getElementById('journalPopup');
      const fab = document.getElementById('journalFab');
      if(!popup) return;
      const willOpen = open!==undefined ? open : !popup.classList.contains('open');
      popup.classList.toggle('open', willOpen);
      if(fab) fab.classList.toggle('open', willOpen);
      if(willOpen){
        // Mutually exclusive with the dice popup so the two don't overlap.
        const dp = document.getElementById('dicePopup'); if(dp) dp.classList.remove('open');
        const df = document.getElementById('diceFab'); if(df) df.classList.remove('open');
        buildPopup();
        const t = document.getElementById('journalPopText'); if(t) t.focus();
      }
    }

    function wireJournal(){
      // ----- Journal tab -----
      const grid = document.getElementById('journalEntries');
      if(grid){
        document.getElementById('journalAddBtn').addEventListener('click', ()=>
          addEntry(document.getElementById('journalNewTitle'), document.getElementById('journalNewText')));
        document.getElementById('journalNewText').addEventListener('keydown', e=>{
          if((e.ctrlKey||e.metaKey) && e.key==='Enter')
            addEntry(document.getElementById('journalNewTitle'), document.getElementById('journalNewText'));
        });
        grid.addEventListener('click', e=>{
          const card = e.target.closest('.journal-card');
          if(!card) return;
          if(e.target.classList.contains('journal-card-del')){ e.stopPropagation(); deleteEntry(card.dataset.id); return; }
          openModal(card.dataset.id);
        });
        grid.addEventListener('keydown', e=>{
          if(e.key!=='Enter' && e.key!==' ') return;
          const card = e.target.closest('.journal-card');
          if(!card) return;
          e.preventDefault();
          openModal(card.dataset.id);
        });
      }

      // ----- Floating quick-note popup -----
      const fab = document.getElementById('journalFab');
      if(fab){
        fab.addEventListener('click', ()=>togglePopup());
        document.getElementById('journalPopClose').addEventListener('click', ()=>togglePopup(false));
        document.getElementById('journalPopAdd').addEventListener('click', ()=>
          addEntry(document.getElementById('journalPopTitle'), document.getElementById('journalPopText')));
        document.getElementById('journalPopText').addEventListener('keydown', e=>{
          if((e.ctrlKey||e.metaKey) && e.key==='Enter')
            addEntry(document.getElementById('journalPopTitle'), document.getElementById('journalPopText'));
        });
        document.getElementById('journalPopList').addEventListener('click', e=>{
          const row = e.target.closest('.jpop-row');
          if(!row) return;
          if(e.target.classList.contains('jpop-row-del')){ e.stopPropagation(); deleteEntry(row.dataset.id); return; }
          openModal(row.dataset.id);
        });
      }

      // ----- Roll log (Journal tab section) -----
      const logBox = document.getElementById('rollLogList');
      if(logBox){
        document.getElementById('rollLogClear').addEventListener('click', ()=>{
          if(!rollLog().length) return;
          if(!confirm('Clear the entire roll log? This can\'t be undone.')) return;
          app.state.rollLog = [];
          buildRollLog();
          save();
        });
        logBox.addEventListener('click', e=>{
          const del = e.target.closest('.rolllog-del');
          if(!del) return;
          app.state.rollLog = rollLog().filter(x=>x.id!==del.dataset.id);
          buildRollLog();
          save();
        });
      }

      // ----- Shared detail modal -----
      const backdrop = document.getElementById('jrnlModalBackdrop');
      if(backdrop){
        document.getElementById('jrnlModalClose').addEventListener('click', closeModal);
        document.getElementById('jrnlModalSave').addEventListener('click', ()=>saveModal(true));
        document.getElementById('jrnlModalDelete').addEventListener('click', ()=>{ if(openId && deleteEntry(openId)) closeModal(); });
        backdrop.addEventListener('click', e=>{ if(e.target===backdrop) closeModal(); });
        // Modal keys take precedence over the popup Escape handler below.
        document.addEventListener('keydown', e=>{
          if(!backdrop.classList.contains('open')) return;
          if(e.key==='Escape'){ closeModal(); e.stopImmediatePropagation(); }
          else if((e.ctrlKey||e.metaKey) && e.key==='Enter') saveModal(true);
        });
      }

      // Escape closes the popup when the modal isn't the thing being dismissed.
      document.addEventListener('keydown', e=>{
        if(e.key!=='Escape') return;
        const b = document.getElementById('jrnlModalBackdrop');
        if(b && b.classList.contains('open')) return;
        togglePopup(false);
      });
    }

    app.buildJournal = renderJournal;
    app.buildRollLog = buildRollLog;
    document.addEventListener('DOMContentLoaded', wireJournal);
  }

  window.characterSheetModules.register('journal', init);
})();
