(function(){
  // Standard D&D dice set.
  const DICE = [4, 6, 8, 10, 12, 20, 100];

  // 2D SVG silhouettes on a 0..40 viewBox. 'rect' is the d6 square; everything
  // else is a polygon whose points give a recognisable die outline.
  const SHAPES = {
    4:  '20,3 37,36 3,36',                  // upward triangle
    6:  'rect',                             // square
    8:  '20,2 38,20 20,38 2,20',            // diamond
    10: '20,2 36,15 29,37 11,37 4,15',      // kite / pentagon
    12: '20,2 37,16 30,37 10,37 3,16',      // pentagon
    20: '20,2 36,11 36,29 20,38 4,29 4,11', // hexagon
    100:'20,2 36,15 29,37 11,37 4,15'       // like d10, labelled %
  };

  function dieSvg(sides){
    const label = sides===100 ? '%' : sides;
    const spec = SHAPES[sides];
    const shape = spec==='rect'
      ? '<rect x="5" y="5" width="30" height="30" rx="4" class="die-shape"/>'
      : `<polygon points="${spec}" class="die-shape"/>`;
    return `<svg viewBox="0 0 40 40" class="die-svg" aria-hidden="true">${shape}`
      + `<text x="20" y="24" class="die-label">${label}</text></svg>`;
  }

  function init(app){
    let pool = {};            // sides -> count
    let advMode = 'normal';   // 'normal' | 'adv' | 'dis' — applies to d20

    const rand = sides => Math.floor(Math.random()*sides) + 1;

    // Pool as a formula string; d20 carries an (adv)/(dis) tag when active.
    function poolStr(){
      return DICE.filter(s=>pool[s]).map(s=>{
        const tag = (s===20 && advMode!=='normal') ? ` (${advMode==='adv'?'adv':'dis'})` : '';
        return `${pool[s]}d${s===100?'%':s}${tag}`;
      }).join(' + ');
    }

    function renderTray(){
      const tray = document.getElementById('diceTray');
      if(!tray) return;
      tray.innerHTML = DICE.map(s=>`
        <button class="die-btn" type="button" data-sides="${s}" title="Add d${s===100?'100':s} (right-click to remove)">
          ${dieSvg(s)}
          <span class="die-name">d${s===100?'100':s}</span>
          <span class="die-count" data-count="${s}">${pool[s]||''}</span>
        </button>`).join('');
    }

    function renderPool(){
      const el = document.getElementById('dicePool');
      if(!el) return;
      const str = poolStr();
      el.textContent = str || 'Tap dice to build a roll';
      el.classList.toggle('empty', !str);
      DICE.forEach(s=>{
        const c = document.querySelector(`.die-count[data-count="${s}"]`);
        if(c) c.textContent = pool[s] || '';
      });
    }

    function roll(){
      const kinds = DICE.filter(s=>pool[s]);
      const box = document.getElementById('diceResult');
      if(!kinds.length){ box.innerHTML = '<div class="dice-hint">Add some dice first.</div>'; return; }
      const mod = parseInt(document.getElementById('diceModifier').value, 10) || 0;
      let total = 0;

      // Each line's `entries` are {v, dropped}. Advantage/disadvantage on d20
      // rolls each die twice and keeps the higher/lower; the other is dropped.
      const lines = kinds.map(s=>{
        const entries = [];
        const useAdv = (s===20 && advMode!=='normal');
        for(let i=0;i<pool[s];i++){
          if(useAdv){
            const a = rand(s), b = rand(s);
            const kept = advMode==='adv' ? Math.max(a,b) : Math.min(a,b);
            const drop = advMode==='adv' ? Math.min(a,b) : Math.max(a,b);
            entries.push({ v:kept, dropped:false });
            entries.push({ v:drop, dropped:true });
            total += kept;
          } else {
            const r = rand(s);
            entries.push({ v:r, dropped:false });
            total += r;
          }
        }
        return { sides:s, entries };
      });
      total += mod;

      const modStr = mod ? ` ${mod>0?'+':'−'} ${Math.abs(mod)}` : '';
      const formula = poolStr() + modStr;

      const detail = lines.map(l=>`
        <div class="dice-line">
          <span class="dice-line-die">d${l.sides===100?'100':l.sides}</span>
          <span class="dice-line-rolls">${l.entries.map(e=>`<b class="${e.dropped?'dropped':(e.v===l.sides?'crit':(e.v===1?'fail':''))}">${e.v}</b>`).join('')}</span>
        </div>`).join('');
      box.innerHTML = detail
        + `<div class="dice-total"><span class="dice-total-label">${formula}</span>`
        + `<span class="dice-total-val">${total}</span></div>`;

      logRoll(lines, formula, total);
    }

    // Append the roll to the character's roll log (a section of the Journal tab).
    function logRoll(lines, formula, total){
      if(!app || !app.state) return;
      if(!Array.isArray(app.state.rollLog)) app.state.rollLog = [];
      const detail = lines.map(l=>
        `d${l.sides===100?'100':l.sides}: ${l.entries.map(e=>e.dropped?`(${e.v})`:e.v).join(', ')}`
      ).join('  •  ');
      app.state.rollLog.unshift({
        id: 'r'+Date.now().toString(36)+Math.random().toString(36).slice(2,6),
        formula, detail, total, time: new Date().toISOString()
      });
      if(app.state.rollLog.length > 200) app.state.rollLog.length = 200; // cap history
      if(app.save) app.save();
      if(app.buildRollLog) app.buildRollLog();
    }

    function clearPool(){
      pool = {};
      renderPool();
      const box = document.getElementById('diceResult');
      if(box) box.innerHTML = '';
    }

    function togglePopup(open){
      const popup = document.getElementById('dicePopup');
      const fab = document.getElementById('diceFab');
      if(!popup) return;
      const willOpen = open!==undefined ? open : !popup.classList.contains('open');
      popup.classList.toggle('open', willOpen);
      if(fab) fab.classList.toggle('open', willOpen);
      if(willOpen){
        // Mutually exclusive with the journal popup so the two don't overlap.
        const jp = document.getElementById('journalPopup'); if(jp) jp.classList.remove('open');
        const jf = document.getElementById('journalFab'); if(jf) jf.classList.remove('open');
        renderTray();
        renderPool();
      }
    }

    function wireDice(){
      const fab = document.getElementById('diceFab');
      if(!fab) return; // dice roller only exists on the sheet page
      renderTray();
      renderPool();

      fab.addEventListener('click', ()=>togglePopup());
      document.getElementById('diceClose').addEventListener('click', ()=>togglePopup(false));

      const tray = document.getElementById('diceTray');
      tray.addEventListener('click', e=>{
        const btn = e.target.closest('.die-btn'); if(!btn) return;
        const s = parseInt(btn.dataset.sides, 10);
        pool[s] = (pool[s]||0) + 1;
        renderPool();
      });
      // Right-click a die to remove one from the pool.
      tray.addEventListener('contextmenu', e=>{
        const btn = e.target.closest('.die-btn'); if(!btn) return;
        e.preventDefault();
        const s = parseInt(btn.dataset.sides, 10);
        if(pool[s]){ pool[s]--; if(!pool[s]) delete pool[s]; renderPool(); }
      });

      // Advantage / Disadvantage segmented control (affects d20 rolls).
      const adv = document.getElementById('diceAdv');
      adv.addEventListener('click', e=>{
        const btn = e.target.closest('.dice-adv-btn'); if(!btn) return;
        advMode = btn.dataset.adv;
        adv.querySelectorAll('.dice-adv-btn').forEach(b=>b.classList.toggle('on', b===btn));
        renderPool();
      });

      document.getElementById('diceRoll').addEventListener('click', roll);
      document.getElementById('diceClear').addEventListener('click', clearPool);
      document.getElementById('diceModifier').addEventListener('keydown', e=>{ if(e.key==='Enter') roll(); });

      document.addEventListener('keydown', e=>{
        if(e.key==='Escape' && document.getElementById('dicePopup').classList.contains('open')) togglePopup(false);
      });
    }

    document.addEventListener('DOMContentLoaded', wireDice);
  }

  window.characterSheetModules.register('dice', init);
})();
