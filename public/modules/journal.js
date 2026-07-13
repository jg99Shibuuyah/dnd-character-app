(function(){
  function init(app){
    const { save } = app;

    const escText = s => (s==null?'':String(s))
      .replace(/&/g,'&amp;').replace(/"/g,'&quot;')
      .replace(/</g,'&lt;').replace(/>/g,'&gt;');

    // Entries live on the character itself so every profile keeps its own log.
    function entries(){
      if(!Array.isArray(app.state.journal)) app.state.journal = [];
      return app.state.journal;
    }

    function fmtDate(iso){
      const d = new Date(iso);
      if(isNaN(d)) return '';
      return d.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'})
        + ' · ' + d.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'});
    }

    let editingId = null;

    function buildJournal(){
      const list = document.getElementById('journalEntries');
      if(!list) return;

      const nameEl = document.getElementById('journalCharName');
      if(nameEl) nameEl.textContent = app.state.name || 'Unnamed Adventurer';

      const items = entries();
      const badge = document.getElementById('journalCount');
      if(badge){
        badge.textContent = items.length || '';
        badge.style.display = items.length ? '' : 'none';
      }

      if(items.length===0){
        list.innerHTML = '<div class="journal-empty">No entries yet — record your first adventure above.</div>';
        return;
      }

      list.innerHTML = items.map(en=>{
        if(en.id===editingId){
          return `<div class="journal-entry editing" data-id="${en.id}">
            <input class="journal-edit-title" type="text" value="${escText(en.title)}" placeholder="Entry title (optional)">
            <textarea class="journal-edit-text" rows="4">${escText(en.text)}</textarea>
            <div class="journal-entry-actions">
              <button class="add-btn journal-save-edit">Save</button>
              <button class="pbtn journal-cancel-edit">Cancel</button>
            </div>
          </div>`;
        }
        return `<div class="journal-entry" data-id="${en.id}">
          <div class="journal-entry-head">
            <span class="journal-entry-title">${escText(en.title) || '<i>Untitled</i>'}</span>
            <span class="journal-entry-tools">
              <span class="journal-edit" title="Edit entry">✎</span>
              <span class="journal-del" title="Delete entry">✕</span>
            </span>
          </div>
          <div class="journal-entry-date">${fmtDate(en.created)}${en.updated && en.updated!==en.created ? ' · edited' : ''}</div>
          <div class="journal-entry-text">${escText(en.text)}</div>
        </div>`;
      }).join('');
    }

    function togglePopup(open){
      const popup = document.getElementById('journalPopup');
      const fab = document.getElementById('journalFab');
      if(!popup) return;
      const willOpen = open!==undefined ? open : !popup.classList.contains('open');
      popup.classList.toggle('open', willOpen);
      if(fab) fab.classList.toggle('open', willOpen);
      if(willOpen){
        editingId = null;
        buildJournal();
        const txt = document.getElementById('journalNewText');
        if(txt) txt.focus();
      }
    }

    function addEntry(){
      const titleEl = document.getElementById('journalNewTitle');
      const textEl = document.getElementById('journalNewText');
      const title = titleEl.value.trim();
      const text = textEl.value.trim();
      if(!title && !text) return;
      const now = new Date().toISOString();
      entries().unshift({ id: 'j'+Date.now().toString(36)+Math.random().toString(36).slice(2,6), title, text, created: now, updated: now });
      titleEl.value=''; textEl.value='';
      buildJournal();
      save();
    }

    function wireJournal(){
      const fab = document.getElementById('journalFab');
      if(!fab) return;
      fab.addEventListener('click', ()=>togglePopup());
      document.getElementById('journalCloseBtn').addEventListener('click', ()=>togglePopup(false));
      document.addEventListener('keydown', e=>{
        if(e.key==='Escape') togglePopup(false);
      });
      document.getElementById('journalAddBtn').addEventListener('click', addEntry);
      // Ctrl/Cmd+Enter in the composer adds the entry without reaching for the button.
      document.getElementById('journalNewText').addEventListener('keydown', e=>{
        if((e.ctrlKey||e.metaKey) && e.key==='Enter') addEntry();
      });

      document.getElementById('journalEntries').addEventListener('click', e=>{
        const card = e.target.closest('.journal-entry');
        if(!card) return;
        const id = card.dataset.id;

        if(e.target.classList.contains('journal-del')){
          const en = entries().find(x=>x.id===id);
          if(!confirm(`Delete "${(en&&en.title)||'this entry'}"? This can't be undone.`)) return;
          app.state.journal = entries().filter(x=>x.id!==id);
          buildJournal();
          save();
        } else if(e.target.classList.contains('journal-edit')){
          editingId = id;
          buildJournal();
          const t = document.querySelector('.journal-entry.editing .journal-edit-text');
          if(t) t.focus();
        } else if(e.target.classList.contains('journal-save-edit')){
          const en = entries().find(x=>x.id===id);
          if(en){
            en.title = card.querySelector('.journal-edit-title').value.trim();
            en.text = card.querySelector('.journal-edit-text').value.trim();
            en.updated = new Date().toISOString();
          }
          editingId = null;
          buildJournal();
          save();
        } else if(e.target.classList.contains('journal-cancel-edit')){
          editingId = null;
          buildJournal();
        }
      });
    }

    app.buildJournal = buildJournal;
    document.addEventListener('DOMContentLoaded', wireJournal);
  }

  window.characterSheetModules.register('journal', init);
})();
