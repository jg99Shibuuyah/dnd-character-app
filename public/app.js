// Character sheet behaviour: state, rendering, and the import/DB plumbing.
//
// The built-in game content (SPELL_DATA, CLASS_DATA, SPECIES_DATA, the
// BUILTIN_* snapshots, …) lives in /resources/builtin/ — one classic script per
// content type; see its README for the load order. The views load them all
// immediately before this file, so their top-level consts are globals here.
// Adding new built-in content means editing those files, not this one.

// Imported spells (global, DB-backed), keyed by name. A custom spell with the
// same name as a built-in SPELL_DATA entry shadows it in the Spell Library.
let CUSTOM_SPELLS = {};

function defaultCharacter(){
  return {
    id: null,
    name:'Unnamed Adventurer', class:'', level:1, race:'', subrace:'', background:'', alignment:'', xp:0,
    classes: [], // multiclass list: [{name, level}]; first entry is the primary class
    abilities:{str:10,dex:10,con:10,int:10,wis:10,cha:10},
    saveProf:{str:false,dex:false,con:false,int:false,wis:false,cha:false},
    skillProf:{},
    ac:10, speed:30, hpMax:10, hpCurrent:10, hpTemp:0, hitDice:'1d10',
    deathSuccess:[false,false,false], deathFail:[false,false,false],
    attacks:[{name:'',bonus:'',dmg:''}],
    features:'', persTraits:'', persIdeals:'', persBonds:'', persFlaws:'',
    currency:{cp:0,sp:0,ep:0,gp:0,pp:0},
    inventory:[{name:'',qty:1}],
    spellSlots: [1,2,3,4,5,6,7,8,9].map(()=>({total:0, used:0})),
    pactSlots: {total:0, used:0, level:1}, // Warlock pact magic (tracked separately)
    autoSlots: true, // auto-fill slots from class levels (PHB multiclass rules)
    spellClass: 'Wizard',
    knownSpells: [], // {name, level, custom:bool, tags:[...]}
    // Worn/wielded gear with mechanical effects. Each item:
    // {name, description, equipped, attack:{bonus,dmg},
    //  abilities:{str,dex,con,int,wis,cha} (string "+2" or "=19"),
    //  skills:[{name,bonus}], spells:[{name,level}]}
    equipment: [],
    // Freeform point trackers on the Actions tab: each is a named pool of pips
    // (a spell slot, Focus Point, Ki, etc.) that the player fills in as used.
    actionResources: [], // {name, total, used}
    // Companions (Character tab): auto-generated ones store a templateId from
    // COMPANION_TEMPLATES (resources/companions.js) and recompute their stats
    // from the character's level/abilities; manual ones carry their own numbers.
    // {uid, templateId|null, name, hpCurrent, hpTemp, notes, collapsed,
    //  ...manual-only: ac, hpMax, speed, typeLine, abilities{}, skillsText,
    //  featuresText, actionsText, spellsText}
    companions: [],
    journal: [], // character journal entries: {id, title, text, created, updated}
    rollLog: [] // dice roller history: {id, formula, detail, total, time}
  };
}

let state = defaultCharacter();

// Which page this script is running on: 'sheet' (index), 'import', 'library',
// or 'sessions'. Standalone pages set data-page on <body>; shared handlers
// check this to skip character-sheet-only work (autosave, sheet panel rebuilds).
const PAGE = document.body.dataset.page || 'sheet';

// /?view=<id> opens another user's sheet. For a session DM the server allows a
// read and the UI freezes (save() no-ops, inputs disabled, profile bar hidden).
// For a player who claimed the character from a session's loaner pool the
// server also allows writes; BORROWED_EDIT then unfreezes the sheet and saves
// go back to the host's copy.
const VIEW_CHARACTER_ID = PAGE==='sheet' ? new URLSearchParams(location.search).get('view') : null;
const VIEW_ONLY = !!VIEW_CHARACTER_ID;
let BORROWED_EDIT = false; // set during init once the server says editable

function mod(score){ return Math.floor((score-10)/2); }
function fmt(n){ return (n>=0?'+':'') + n; }
function profBonus(level){
  if(level>=17) return 6;
  if(level>=13) return 5;
  if(level>=9) return 4;
  if(level>=5) return 3;
  return 2;
}

function el(tag, cls, html){
  const e = document.createElement(tag);
  if(cls) e.className = cls;
  if(html!==undefined) e.innerHTML = html;
  return e;
}

// Escape user text before interpolating into innerHTML (names, descriptions).
function esc(s){
  return (s==null?'':String(s))
    .replace(/&/g,'&amp;').replace(/"/g,'&quot;')
    .replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ---------- Equipment helpers ----------
function equipList(){
  if(!Array.isArray(state.equipment)) state.equipment = [];
  return state.equipment;
}
function newEquipItem(){
  return { name:'', description:'', equipped:true,
    attack:{bonus:'',dmg:''}, ac:'',
    abilities:{str:'',dex:'',con:'',int:'',wis:'',cha:''},
    skills:[], spells:[] };
}
function equippedEquip(){ return equipList().filter(it=>it.equipped); }

// Parse an ability-effect string: "+2"/"-1" → additive, "=19" → set score.
function parseAbilityEffect(v){
  const s = (v==null?'':String(v)).trim();
  if(!s) return null;
  if(s[0]==='='){ const n=parseInt(s.slice(1),10); return isNaN(n)?null:{mode:'set',value:n}; }
  const n = parseInt(s,10);
  return isNaN(n)?null:{mode:'add',value:n};
}

// Base ability scores modified by equipped gear (adds stack; sets take the max,
// then adds apply on top). Used everywhere derived stats are computed.
function effectiveAbilities(){
  const eff={}, adds={}, sets={};
  ABILITIES.forEach(a=> eff[a.key]=state.abilities[a.key]||0);
  equippedEquip().forEach(it=>{
    const ab = it.abilities||{};
    ABILITIES.forEach(a=>{
      const e = parseAbilityEffect(ab[a.key]);
      if(!e) return;
      if(e.mode==='add') adds[a.key]=(adds[a.key]||0)+e.value;
      else sets[a.key]=Math.max(a.key in sets ? sets[a.key] : -Infinity, e.value);
    });
  });
  ABILITIES.forEach(a=>{
    let v = eff[a.key];
    if(a.key in sets) v = Math.max(v, sets[a.key]);
    eff[a.key] = v + (adds[a.key]||0);
  });
  return eff;
}
function equipSkillBonus(skillName){
  let n=0;
  equippedEquip().forEach(it=> (it.skills||[]).forEach(s=>{ if(s.name===skillName) n += Number(s.bonus)||0; }));
  return n;
}

// ---------- Granted skill proficiencies ----------
// Species and backgrounds GRANT fixed skill proficiencies (classes only offer
// choices — those stay manual picks in Settings). Grants are computed live from
// the current species/background, never written into state.skillProf, so
// switching background/species adds and removes them automatically.
function grantedSkillSources(skillName){
  const out = [];
  const sd = SPECIES_DATA[state.race];
  if(sd && Array.isArray(sd.skills) && sd.skills.includes(skillName)) out.push({ by: state.race, kind: 'species' });
  const bd = BACKGROUND_DATA[state.background];
  if(bd && Array.isArray(bd.skills) && bd.skills.includes(skillName)) out.push({ by: state.background, kind: 'background' });
  return out;
}
// Effective proficiency for SKILLS[i]: manually toggled OR granted.
function skillProficient(i){
  return !!state.skillProf['sk'+i] || grantedSkillSources(SKILLS[i].name).length>0;
}
function equipmentAttacks(){
  return equippedEquip()
    .filter(it=> it.attack && (it.attack.dmg || it.attack.bonus))
    .map(it=>({ name: it.name||'Unnamed weapon', bonus: it.attack.bonus||'', dmg: it.attack.dmg||'' }));
}
function equipmentGrantedSpells(){
  return equippedEquip().flatMap(it=>
    (it.spells||[]).map(sp=>({ name: sp.name, level: Number(sp.level)||0, from: it.name||'item' })));
}

// Computed Armor Class: base 10 + DEX mod (gear-adjusted), with equipped armor.
// Armor field syntax matches abilities: "+2" stacks (shield, ring of protection);
// "=16" is a flat armor base that replaces 10+DEX (heavy armor) — the higher of
// the two bases wins, then bonuses apply on top.
function computeAC(){
  const dexMod = mod(effectiveAbilities().dex);
  const unarmored = 10 + dexMod;
  let adds = 0; const sets = [];
  equippedEquip().forEach(it=>{
    const e = parseAbilityEffect(it.ac);
    if(!e) return;
    if(e.mode==='set') sets.push(e.value); else adds += e.value;
  });
  const armorBase = sets.length ? Math.max(...sets) : null;
  const usedArmor = armorBase!==null && armorBase >= unarmored;
  const base = usedArmor ? armorBase : unarmored;
  return { ac: base + adds, dexMod, usedArmor, armorBase, adds };
}

// ---------- Build Abilities Panel ----------
function buildAbilities(){
  const panel = document.getElementById('abilitiesPanel');
  panel.querySelectorAll('.ability').forEach(n=>n.remove());
  ABILITIES.forEach(a=>{
    const row = el('div','ability');
    row.innerHTML = `
      <div class="abbr">${a.key.toUpperCase()}</div>
      <div class="mod-badge" id="modBadge_${a.key}">+0</div>
      <input class="score-input" type="number" id="score_${a.key}" value="${state.abilities[a.key]}">
    `;
    panel.appendChild(row);
  });
  ABILITIES.forEach(a=>{
    document.getElementById('score_'+a.key).addEventListener('input', e=>{
      state.abilities[a.key] = parseInt(e.target.value)||0;
      renderClassInfoStack(); // multiclass prerequisite badges depend on scores
      recalc(); save();
    });
  });
}

// Read-only rows: the bonus already includes proficiency (dot = proficient).
// Save proficiencies come from the class; skills are picked in Settings.
function buildSaves(){
  const panel = document.getElementById('savesPanel');
  panel.innerHTML='';
  ABILITIES.forEach(a=>{
    const row = el('div','check-row');
    row.innerHTML = `
      <span class="prof-dot ${state.saveProf[a.key]?'on':''}"></span>
      <span class="abbr-tag">${a.key.toUpperCase()}</span>
      <span class="name">${a.name} Save</span>
      <span class="bonus" id="saveBonus_${a.key}">+0</span>
    `;
    panel.appendChild(row);
  });
}

function buildSkills(){
  const panel = document.getElementById('skillsPanel');
  panel.innerHTML='';
  SKILLS.forEach((s,i)=>{
    const key = 'sk'+i;
    if(!(key in state.skillProf)) state.skillProf[key]=false;
    const granted = grantedSkillSources(s.name);
    const prof = state.skillProf[key] || granted.length>0;
    const row = el('div','check-row skill-row'+(prof?' proficient':'')+(granted.length?' granted':''));
    row.title = 'Click for a quick description';
    row.innerHTML = `
      <span class="prof-dot ${prof?'on':''}${granted.length?' granted':''}"></span>
      <span class="abbr-tag">${s.ability.toUpperCase()}</span>
      <span class="name">${s.name}</span>
      ${granted.map(g=>`<span class="grant-tag">${esc(g.kind)}</span>`).join('')}
      <span class="bonus" id="skillBonus_${key}">+0</span>
    `;
    row.addEventListener('click', ()=> openSkillDetail(i));
    panel.appendChild(row);
  });
  const count = document.getElementById('skillProfCount');
  if(count) count.textContent = `${SKILLS.filter((s,i)=>skillProficient(i)).length} / ${SKILLS.length}`;
}

// Small floating legend explaining the skill-proficiency markers (opened from
// the "?" buttons on the Skills tab and the Settings skill picker — same
// draggable window system as the dice roller and notes popups).
function openSkillLegend(){
  const win = openNotesModal({
    name: 'Skill Proficiencies — Legend',
    badges: ['Reference'],
    detail: `
      <p>Click any skill for a quick description. <span class="hl">Highlighted rows are proficiencies</span> — toggle them on the <a href="#" class="skills-to-settings-link hl">Character Settings</a> tab. Tagged rows are granted by your species or background.</p>
      <div class="legend-row"><span class="prof-dot on"></span><span>Proficient — your proficiency bonus is added to the skill.</span></div>
      <div class="legend-row"><span class="prof-dot on granted"></span><span>Granted proficiency — applied automatically by your <span class="hl">species</span> or <span class="hl">background</span>. Locked: it goes away only if you change the source in Settings.</span></div>
      <div class="legend-row"><span class="skill-chip classpick legend-chip">chip</span><span>Offered by your <span class="hl">class</span> — pick your allowed number of these in Settings (the class decides how many).</span></div>
      <div class="legend-row"><span class="skill-chip on legend-chip">chip</span><span>Toggled on manually — proficiencies from feats, training, or DM fiat.</span></div>
      <div class="legend-row"><span class="grant-tag">background</span><span>Tag showing where a granted proficiency comes from.</span></div>
      <p class="nr-hint">Skill bonuses everywhere on the sheet update automatically: ability modifier + proficiency bonus (if proficient) + equipped-gear bonuses.</p>`
  });
  // The "Character Settings" link inside the popup jumps to that tab.
  if(win) win.el.querySelectorAll('.skills-to-settings-link').forEach(a=>
    a.addEventListener('click', e=>{
      e.preventDefault();
      const btn = document.querySelector('.tab-btn[data-tab="settings"]');
      if(btn) btn.click();
      nrCloseWindow(win);
    }));
}

// Same treatment for the Equipment panel: the how-it-works blurb lives in the
// "?" button's title (hover) and this popup (click) instead of inline text.
function openEquipLegend(){
  openNotesModal({
    name: 'Equipment — How it works',
    badges: ['Reference'],
    detail: `
      <p>Gear you're wearing or wielding. <span class="hl">Equipped</span> items feed your attacks, spellcasting, ability scores, and skill bonuses on the other tabs.</p>
      <p class="nr-hint">Ability fields accept <span class="hl">+2</span> (bonus) or <span class="hl">=19</span> (set score).</p>`
  });
}

function bindSkillLegendButtons(){
  document.querySelectorAll('.skill-legend-btn').forEach(btn=>
    btn.addEventListener('click', e=>{ e.stopPropagation(); openSkillLegend(); }));
  document.querySelectorAll('.equip-legend-btn').forEach(btn=>
    btn.addEventListener('click', e=>{ e.stopPropagation(); openEquipLegend(); }));
}

// ---------- Quick-tools launcher (bottom-right "⋯" FAB) ----------
// Expands into a collapsible stack of tools: Dice, Notes, Skills. Dice/Notes
// popups are toggled by their own modules (bound to #diceFab / #journalFab);
// the Skills quick-reference popup is owned here. Picking a tool collapses
// the stack so its popup isn't covered.
function renderSkillsPop(){
  const list = document.getElementById('skillsPopList');
  if(!list) return;
  const pb = profBonus(state.level);
  const eff = effectiveAbilities();
  list.innerHTML = SKILLS.map((s,i)=>{
    const granted = grantedSkillSources(s.name);
    const prof = skillProficient(i);
    const bonus = mod(eff[s.ability]) + (prof?pb:0) + equipSkillBonus(s.name);
    return `<div class="check-row skill-row${prof?' proficient':''}${granted.length?' granted':''}" data-i="${i}" title="Click for a quick description">
      <span class="prof-dot ${prof?'on':''}${granted.length?' granted':''}"></span>
      <span class="abbr-tag">${s.ability.toUpperCase()}</span>
      <span class="name">${s.name}</span>
      ${granted.map(g=>`<span class="grant-tag">${esc(g.kind)}</span>`).join('')}
      <span class="bonus">${fmt(bonus)}</span>
    </div>`;
  }).join('');
  list.querySelectorAll('.skill-row').forEach(row=>
    row.addEventListener('click', ()=> openSkillDetail(Number(row.dataset.i))));
}

function toggleSkillsPopup(open){
  const popup = document.getElementById('skillsPopup');
  const fab = document.getElementById('skillsFab');
  if(!popup) return;
  const willOpen = open!==undefined ? open : !popup.classList.contains('open');
  popup.classList.toggle('open', willOpen);
  if(fab) fab.classList.toggle('open', willOpen);
  if(willOpen){
    // Mutually exclusive with the dice / journal popups so they don't overlap.
    ['dicePopup','diceFab','journalPopup','journalFab'].forEach(id=>{
      const n = document.getElementById(id); if(n) n.classList.remove('open');
    });
    renderSkillsPop();
  }
}

function bindCornerLauncher(){
  const stack = document.getElementById('fabStack');
  const launcher = document.getElementById('fabLauncher');
  if(!stack || !launcher) return;
  const setOpen = open=>{
    stack.classList.toggle('open', open);
    launcher.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  launcher.addEventListener('click', ()=> setOpen(!stack.classList.contains('open')));
  // Any tool pick collapses the stack (each item's own handler opens its popup).
  stack.querySelectorAll('.fab-item').forEach(btn=>
    btn.addEventListener('click', ()=> setOpen(false)));
  document.getElementById('skillsFab').addEventListener('click', ()=> toggleSkillsPopup());
  document.getElementById('skillsPopClose').addEventListener('click', ()=> toggleSkillsPopup(false));
  document.addEventListener('keydown', e=>{
    if(e.key!=='Escape') return;
    const popup = document.getElementById('skillsPopup');
    if(popup && popup.classList.contains('open')) toggleSkillsPopup(false);
    else setOpen(false);
  });
}

// Floating quick-reference popup for one skill (reuses the Notes window system).
function openSkillDetail(i){
  const s = SKILLS[i];
  const key = 'sk'+i;
  const pb = profBonus(state.level);
  const m = mod(effectiveAbilities()[s.ability]);
  const granted = grantedSkillSources(s.name);
  const prof = !!state.skillProf[key] || granted.length>0;
  const gear = equipSkillBonus(s.name);
  const total = m + (prof?pb:0) + gear;
  const parts = [`${s.ability.toUpperCase()} ${fmt(m)}`];
  if(prof) parts.push(`proficiency ${fmt(pb)}`);
  if(gear) parts.push(`gear ${fmt(gear)}`);
  openNotesModal({
    name: s.name,
    badges: ['Skill', s.ability.toUpperCase(), prof ? 'Proficient' : 'Not proficient'],
    detail: `<p>${SKILL_DESC[s.name]||''}</p>
      <p><strong>Bonus ${fmt(total)}</strong> = ${parts.join(' + ')}</p>
      ${granted.map(g=>`<p class="nr-hint">Proficiency granted by your ${esc(g.kind)} — <span class="hl">${esc(g.by)}</span>.</p>`).join('')}
      ${prof ? '' : '<p class="nr-hint">Not proficient — toggle skill proficiencies on the Character Settings tab.</p>'}`
  });
}

// Floating quick-reference popup for a passive sense (Skills tab). Shows the
// current score with its breakdown plus a short description and play example.
function openPassiveDetail(skillName){
  const info = PASSIVE_SENSE_INFO[skillName];
  if(!info) return;
  const i = SKILLS.findIndex(s=>s.name===skillName);
  const s = SKILLS[i];
  const pb = profBonus(state.level);
  const m = mod(effectiveAbilities()[s.ability]);
  const prof = skillProficient(i);
  const gear = equipSkillBonus(s.name);
  const bonus = m + (prof?pb:0) + gear;
  const parts = ['10', `${s.ability.toUpperCase()} ${fmt(m)}`];
  if(prof) parts.push(`proficiency ${fmt(pb)}`);
  if(gear) parts.push(`gear ${fmt(gear)}`);
  openNotesModal({
    name: 'Passive ' + skillName,
    badges: ['Passive Sense', s.ability.toUpperCase(), prof ? 'Proficient' : 'Not proficient'],
    detail: `<p>${info.desc}</p>
      <p><strong>Score ${10 + bonus}</strong> = ${parts.join(' + ')}</p>
      <p class="nr-hint"><span class="hl">Example:</span> ${info.example}</p>`
  });
}

function bindPassiveSenseRows(){
  document.querySelectorAll('.passive-row').forEach(row=>
    row.addEventListener('click', ()=> openPassiveDetail(row.dataset.passive)));
}

function buildAttacks(){
  const body = document.getElementById('attacksBody');
  body.innerHTML='';
  state.attacks.forEach((a,i)=>{
    const tr = el('tr');
    tr.innerHTML = `
      <td><input value="${a.name}" data-i="${i}" class="atk-name" placeholder="Longsword"></td>
      <td><input value="${a.bonus}" data-i="${i}" class="atk-bonus narrow" placeholder="+5"></td>
      <td><input value="${a.dmg}" data-i="${i}" class="atk-dmg" placeholder="1d8+3 slashing"></td>
      <td><span class="row-del" data-i="${i}">✕</span></td>
    `;
    body.appendChild(tr);
  });
  body.querySelectorAll('.atk-name').forEach(i=>i.addEventListener('input', e=>{state.attacks[e.target.dataset.i].name=e.target.value; save();}));
  body.querySelectorAll('.atk-bonus').forEach(i=>i.addEventListener('input', e=>{state.attacks[e.target.dataset.i].bonus=e.target.value; save();}));
  body.querySelectorAll('.atk-dmg').forEach(i=>i.addEventListener('input', e=>{state.attacks[e.target.dataset.i].dmg=e.target.value; save();}));
  body.querySelectorAll('.row-del').forEach(i=>i.addEventListener('click', e=>{
    state.attacks.splice(e.target.dataset.i,1);
    if(state.attacks.length===0) state.attacks.push({name:'',bonus:'',dmg:''});
    buildAttacks(); save();
  }));
}

function buildInventory(){
  const list = document.getElementById('inventoryList');
  list.innerHTML='';
  // Equipment items are carried gear, so they appear here automatically.
  // Read-only: they're managed on the Equipment tab (click a row to jump there).
  const gear = equipList().filter(it=> it.name && it.name.trim());
  if(gear.length){
    list.insertAdjacentHTML('beforeend',
      '<div class="equip-atk-head">From equipment — managed on the Equipment tab</div>'
      + gear.map(it=>`
        <div class="inv-row inv-gear" title="Edit on the Equipment tab">
          <span class="item-name gear-name">${esc(it.name)}</span>
          <span class="action-badge ${it.equipped?'':'dim'}">${it.equipped?'Equipped':'Packed'}</span>
        </div>`).join(''));
    list.querySelectorAll('.inv-gear').forEach(row=>row.addEventListener('click', ()=>{
      document.querySelector('.tab-btn[data-tab="equipment"]').click();
    }));
  }
  // Items are added/renamed through the popup (openItemModal); drop blank
  // leftovers from the old inline flow instead of rendering empty rows.
  const items = state.inventory.filter(it=> it.name && it.name.trim());
  if(!items.length && !gear.length){
    list.insertAdjacentHTML('beforeend', '<div class="action-empty">Nothing carried yet — add an item below.</div>');
  }
  state.inventory.forEach((item,i)=>{
    if(!(item.name && item.name.trim())) return;
    const row = el('div','inv-row');
    row.innerHTML = `
      <span class="item-name inv-edit" data-i="${i}" title="Click to edit">${esc(item.name)}</span>
      <input class="item-qty" data-i="${i}" type="number" value="${item.qty}">
      <span class="row-del" data-i="${i}">✕</span>
    `;
    list.appendChild(row);
  });
  list.querySelectorAll('.inv-edit').forEach(s=>s.addEventListener('click', e=>{ openItemModal(Number(e.target.dataset.i)); }));
  list.querySelectorAll('.item-qty').forEach(i=>i.addEventListener('input', e=>{state.inventory[e.target.dataset.i].qty=parseInt(e.target.value)||0; save();}));
  list.querySelectorAll('.row-del').forEach(i=>i.addEventListener('click', e=>{
    state.inventory.splice(e.target.dataset.i,1);
    buildInventory(); save();
  }));
}

// Compute leveled + pact slots from the class list using the PHB tables.
function computeSpellSlots(picked){
  const totals=[0,0,0,0,0,0,0,0,0];
  const leveled = picked.filter(c=>{ const t=CLASS_DATA[c.name]&&CLASS_DATA[c.name].casting; return t&&(t.type==='full'||t.type==='half'); });
  const warlocks = picked.filter(c=>{ const t=CLASS_DATA[c.name]&&CLASS_DATA[c.name].casting; return t&&t.type==='pact'; });
  let table=null, lvl=0;
  if(leveled.length===1){
    const c=leveled[0]; const cast=CLASS_DATA[c.name].casting;
    if(cast.roundUp){ // Artificer: half caster rounded UP — reads the full table at ceil(level/2).
      lvl = Math.ceil((c.level||1)/2); table = FULL_SLOTS;
    } else {
      lvl = c.level||1; table = cast.type==='full' ? FULL_SLOTS : HALF_SLOTS;
    }
  } else if(leveled.length>1){
    // Multiclass: full levels + half of half-caster levels (Artificer rounds up), read off the full table.
    lvl = leveled.reduce((s,c)=>{ const cast=CLASS_DATA[c.name].casting;
      if(cast.type==='full') return s + (c.level||1);
      return s + (cast.roundUp ? Math.ceil((c.level||1)/2) : Math.floor((c.level||1)/2));
    }, 0);
    table = FULL_SLOTS;
  }
  if(table && lvl>0){ (table[Math.min(20,Math.max(1,lvl))]||[]).forEach((n,i)=>totals[i]+=n); }
  const wl = warlocks.reduce((s,c)=>s+(c.level||1),0);
  const pact = wl>0 ? PACT_SLOTS[Math.min(20,wl)] : null;
  return { totals, pact, hasCaster: leveled.length>0 || wl>0 };
}

// Overwrite slot totals from the class list when auto mode is on, preserving
// how many are already spent. Non-casters are left alone so manual values survive.
function refreshAutoSlots(){
  if(!state.autoSlots) return;
  const { totals, pact, hasCaster } = computeSpellSlots(pickedClasses());
  if(!hasCaster) return;
  state.spellSlots.forEach((s,i)=>{ s.total = totals[i]; if(s.used>s.total) s.used=s.total; });
  if(!state.pactSlots) state.pactSlots={total:0,used:0,level:1};
  if(pact){ state.pactSlots.total=pact.n; state.pactSlots.level=pact.l; if(state.pactSlots.used>pact.n) state.pactSlots.used=pact.n; }
  else { state.pactSlots.total=0; state.pactSlots.used=0; }
}

function slotRow(label, slot, key, extraClass){
  let pips='';
  for(let p=0;p<slot.total;p++) pips += `<span class="slot-pip ${p<slot.used?'filled':''}" data-lvl="${key}" data-p="${p}"></span>`;
  const disabled = state.autoSlots ? 'disabled' : '';
  const totalCell = key==='pact'
    ? `<span class="total pact-total">${slot.total}</span>`
    : `<input class="total" type="number" min="0" max="9" value="${slot.total}" data-lvl="${key}" ${disabled}>`;
  return `<div class="slot-level ${extraClass||''}"><div class="lv">${label}</div>${totalCell}<div class="slot-pips">${pips}</div></div>`;
}

function buildSpellSlots(){
  const panel = document.getElementById('spellSlots');
  if(state.autoSlots) refreshAutoSlots();
  const auto = state.autoSlots;
  let html = `<div class="slot-mode">
    <span class="slot-mode-label">${auto?'⚙ Auto-filled from class levels':'✎ Manual entry'}</span>
    <button class="pbtn slot-mode-btn" id="slotModeBtn">${auto?'Switch to manual':'Switch to auto'}</button>
  </div>`;
  html += state.spellSlots.map((slot,idx)=> slotRow('Level '+(idx+1), slot, String(idx))).join('');
  if(state.pactSlots && state.pactSlots.total>0){
    html += slotRow(`Pact · Lv ${state.pactSlots.level}`, state.pactSlots, 'pact', 'pact-row');
    html += `<div class="import-note">Pact slots cast at level ${state.pactSlots.level} and recharge on a short rest.</div>`;
  }
  panel.innerHTML = html;

  document.getElementById('slotModeBtn').addEventListener('click', ()=>{
    state.autoSlots = !state.autoSlots;
    if(state.autoSlots) refreshAutoSlots();
    buildSpellSlots(); buildActions(); save();
  });
  if(!auto){
    panel.querySelectorAll('input.total').forEach(inp=>{
      inp.addEventListener('input', e=>{
        const lvl = e.target.dataset.lvl;
        state.spellSlots[lvl].total = Math.max(0, parseInt(e.target.value)||0);
        if(state.spellSlots[lvl].used > state.spellSlots[lvl].total) state.spellSlots[lvl].used = state.spellSlots[lvl].total;
        buildSpellSlots(); buildActions(); save();
      });
    });
  }
  panel.querySelectorAll('.slot-pip').forEach(p=>{
    p.addEventListener('click', e=>{
      const key = e.target.dataset.lvl, idx = parseInt(e.target.dataset.p);
      const slot = key==='pact' ? state.pactSlots : state.spellSlots[key];
      slot.used = (idx < slot.used) ? idx : idx+1;
      buildSpellSlots(); buildActions(); save();
    });
  });
}

function levelLabel(lvl){ return lvl===0 ? 'Cantrip' : 'Level '+lvl; }

// <option> list for spell-level dropdowns: 0 renders as "Cantrip".
function levelOptions(selected){
  return Array.from({length:10},(_,i)=>
    `<option value="${i}" ${i===Number(selected)?'selected':''}>${levelLabel(i)}</option>`).join('');
}

// Fill the static spell-level dropdowns (Library import + custom spell row).
function buildSpellLevelSelects(){
  ['splLevel','customSpellLevel'].forEach(id=>{
    const sel = document.getElementById(id);
    if(sel && !sel.options.length) sel.innerHTML = levelOptions(0);
  });
}

// ---------- Tag pickers (dropdown + removable chips) ----------
// Tags are chosen from a dropdown instead of typed. The option list is the
// default set plus every tag already used on an imported or known spell.
const DEFAULT_SPELL_TAGS = ['5E','5E (legacy)','5.5E','Homebrew'];
const tagPickerState = {}; // container id -> currently selected tags

function allSpellTags(){
  const tags = new Set(DEFAULT_SPELL_TAGS);
  Object.values(CUSTOM_SPELLS).forEach(s=> (s.tags||[]).forEach(t=>tags.add(t)));
  (state.knownSpells||[]).forEach(s=> (Array.isArray(s.tags)?s.tags:[]).forEach(t=>tags.add(t)));
  Object.values(tagPickerState).forEach(sel=> sel.forEach(t=>tags.add(t)));
  return [...tags].sort((a,b)=>a.localeCompare(b));
}

function buildTagPicker(id){
  const box = document.getElementById(id);
  if(!box) return;
  const selected = tagPickerState[id] || (tagPickerState[id]=[]);
  const options = allSpellTags().filter(t=>!selected.includes(t));
  box.innerHTML =
    selected.map((t,i)=>`<span class="picker-tag">${esc(t)}<span class="tag-del" data-i="${i}" title="Remove tag">✕</span></span>`).join('')
    + `<select class="tag-select"><option value="">+ tag…</option>${options.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join('')}</select>`;
  box.querySelector('.tag-select').addEventListener('change', e=>{
    if(e.target.value){ selected.push(e.target.value); buildTagPicker(id); }
  });
  box.querySelectorAll('.tag-del').forEach(x=>x.addEventListener('click', e=>{
    selected.splice(parseInt(e.target.dataset.i),1); buildTagPicker(id);
  }));
}
function setTagPicker(id, tags){ tagPickerState[id] = [...(tags||[])]; buildTagPicker(id); }
function getTagPicker(id){ return [...(tagPickerState[id]||[])]; }
function refreshTagPickers(){ Object.keys(tagPickerState).forEach(buildTagPicker); }

function isKnown(name){
  return state.knownSpells.some(s=>s.name.toLowerCase()===name.toLowerCase());
}

// Imported spells that belong to a class's library: an explicit class list
// restricts them; an empty/missing list makes them available to every class.
function customSpellsForClass(className){
  return Object.entries(CUSTOM_SPELLS)
    .filter(([,s])=> !(Array.isArray(s.classes) && s.classes.length) || s.classes.includes(className))
    .map(([name,s])=>({ name, level: Number(s.level)||0, imported:true, spell:s }));
}

function spellClassNames(){
  const fromCustoms = Object.values(CUSTOM_SPELLS).flatMap(s=> Array.isArray(s.classes)?s.classes:[]);
  return [...new Set([...SPELL_CLASSES, ...fromCustoms])].sort();
}

function buildSpellClassSelect(){
  const sel = document.getElementById('spellClassSelect');
  if(!sel) return;
  sel.innerHTML = spellClassNames().map(c=>`<option value="${esc(c)}" ${c===state.spellClass?'selected':''}>${esc(c)}</option>`).join('');
  sel.onchange = e=>{
    state.spellClass = e.target.value;
    buildSpellLibrary(); save();
  };
}

// Resolve a spell's detail from imported data first, then the built-in
// reference (SPELL_DETAILS + SPELL_DATA). Used by both the row markers and the
// detail popup so the Spells and Actions tabs describe a spell identically.
function spellInfo(name){
  const imp = CUSTOM_SPELLS[name];
  const bi = imp ? null : builtinSpellInfo(name);
  return { imp, bi, det: imp || bi || {}, kind: imp ? 'imported' : (bi ? 'built-in' : 'homebrew') };
}

// Concentration isn't a structured field on built-ins, so sniff the duration
// and description text (imported spells often say "Concentration, up to …").
function spellNeedsConcentration(det){
  return /concentration/i.test([det.duration, det.desc].filter(Boolean).join(' '));
}

// Small at-a-glance markers on a spell row: concentration and the components
// ("need") you have to supply. The mini legend under each list explains them.
function spellRowMarkers(name){
  const { det } = spellInfo(name);
  let out = '';
  if(spellNeedsConcentration(det))
    out += '<span class="spell-mark conc" title="Concentration — you must keep concentration or the spell ends">◈ Conc</span>';
  if(det.components)
    out += `<span class="spell-mark comp" title="Components you need to cast this spell">${esc(det.components)}</span>`;
  return out;
}

// Build a Notes-search-style popup entry for a single spell so the Spells and
// Actions tabs can open the exact same detail popup as the reference search.
function spellDetailEntry(name, fallbackLevel){
  const { imp, bi, det, kind } = spellInfo(name);
  const level = imp ? (Number(imp.level)||0) : (bi ? bi.level : (Number(fallbackLevel)||0));
  const classes = imp
    ? (Array.isArray(imp.classes) && imp.classes.length ? imp.classes : ['every class'])
    : (bi ? bi.classes : []);
  const bits = [det.school, det.castingTime&&'cast '+det.castingTime, det.range&&'range '+det.range,
    det.components&&'needs '+det.components, det.duration&&'duration '+det.duration].filter(Boolean).join(' · ');
  const conc = spellNeedsConcentration(det);
  return {
    name,
    badges: [levelLabel(level), imp?imp.source:null, kind, conc?'concentration':null].filter(Boolean),
    full: `<div class="nr-meta">${esc(levelLabel(level))}${classes.length?' · '+esc(classes.join(', ')):''}</div>
       ${bits?`<div class="nr-meta">${esc(bits)}</div>`:''}
       ${(det.tags||[]).length?`<div class="nr-meta">tags: ${esc(det.tags.join(', '))}</div>`:''}
       ${det.desc
         ? `<div class="feat-desc">${esc(det.desc)}</div>`
         : '<div class="feat-desc">No description on file — this is a name-only spell. Import it in the Library to add details.</div>'}`,
    edit: editLink('spell', name, 'Edit spell in Library')
  };
}

function openSpellDetail(name, level){
  openNotesModal(spellDetailEntry(name, level));
}

function buildSpellLibrary(){
  const container = document.getElementById('spellLibraryList');
  if(!container) return;
  const query = (document.getElementById('spellSearch').value || '').toLowerCase();
  const customs = customSpellsForClass(state.spellClass);
  const customNames = new Set(customs.map(s=>s.name.toLowerCase()));
  // Imported spells shadow built-ins with the same name.
  const builtins = (SPELL_DATA[state.spellClass] || []).filter(s=>!customNames.has(s.name.toLowerCase()));
  const list = [...builtins, ...customs].filter(s => s.name.toLowerCase().includes(query));
  if(list.length===0){
    container.innerHTML = '<div class="spell-lib-empty">No spells match.</div>';
    return;
  }
  const byLevel = {};
  list.forEach(s=>{ (byLevel[s.level] = byLevel[s.level]||[]).push(s); });
  const levels = Object.keys(byLevel).map(Number).sort((a,b)=>a-b);
  let html='';
  levels.forEach(lvl=>{
    html += `<div class="spell-lib-group-label">${levelLabel(lvl)}</div>`;
    byLevel[lvl].sort((a,b)=>a.name.localeCompare(b.name)).forEach(s=>{
      const already = isKnown(s.name);
      const meta = s.imported
        ? ` <span class="custom-tag">${esc(s.spell.source||'Imported')}</span>`
        : '';
      html += `<div class="spell-lib-item">
        <span class="spell-info" data-name="${esc(s.name)}" data-level="${lvl}" title="Click for full details">
          <span class="spell-name-link">${esc(s.name)}</span>${meta}${spellRowMarkers(s.name)}
        </span>
        <span class="spell-add-btn ${already?'added':''}" data-name="${esc(s.name)}" data-level="${lvl}">${already?'Added':'+ Add'}</span>
      </div>`;
    });
  });
  container.innerHTML = html + spellLegendHtml();
  container.querySelectorAll('.spell-info').forEach(el=>{
    el.addEventListener('click', ()=> openSpellDetail(el.dataset.name, parseInt(el.dataset.level)));
  });
  container.querySelectorAll('.spell-add-btn:not(.added)').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const name = e.target.dataset.name, level = parseInt(e.target.dataset.level);
      if(!isKnown(name)){
        const imp = CUSTOM_SPELLS[name];
        state.knownSpells.push({name, level, custom:!!imp, tags: (imp && Array.isArray(imp.tags)) ? imp.tags : []});
        buildSpellLibrary(); buildKnownSpells(); save();
      }
    });
  });
}

// Shared mini legend appended under each spell list, explaining the row markers
// and that a click opens the full "what it does" description.
function spellLegendHtml(){
  return `<div class="spell-legend">
    <span class="spell-legend-item"><span class="spell-mark conc">◈ Conc</span> needs concentration</span>
    <span class="spell-legend-item"><span class="spell-mark comp">V·S·M</span> components you need</span>
    <span class="spell-legend-item"><span class="spell-legend-tip">click a spell</span> what it does</span>
  </div>`;
}

function buildKnownSpells(){
  const container = document.getElementById('knownSpellsList');
  const granted = equipmentGrantedSpells();
  if(state.knownSpells.length===0 && granted.length===0){
    container.innerHTML = '<div class="spell-lib-empty">No spells added yet — pick from the library above.</div>';
    return;
  }
  const byLevel = {};
  state.knownSpells.forEach((s,i)=>{ (byLevel[s.level] = byLevel[s.level]||[]).push({...s, idx:i}); });
  const levels = Object.keys(byLevel).map(Number).sort((a,b)=>a-b);
  let html='';
  levels.forEach(lvl=>{
    html += `<div class="known-spell-group-label">${levelLabel(lvl)}</div>`;
    byLevel[lvl].forEach(s=>{
      const spellTags = Array.isArray(s.tags) ? s.tags : [];
      html += `<div class="known-spell-item">
        <span class="spell-summary spell-info" data-name="${esc(s.name)}" data-level="${s.level}" title="Click for full details">
          <span class="spell-name-link">${esc(s.name)}</span>
          ${s.custom?'<span class="custom-tag">Homebrew</span>':''}
          ${spellRowMarkers(s.name)}
          ${spellTags.length ? `<span class="spell-tags">${spellTags.map(tag=>`<span class="spell-tag">${esc(tag)}</span>`).join('')}</span>` : ''}
        </span>
        <span class="spell-remove" data-idx="${s.idx}">✕</span>
      </div>`;
    });
  });
  if(granted.length){
    html += `<div class="known-spell-group-label">From Equipment</div>`;
    granted.sort((a,b)=>a.level-b.level || a.name.localeCompare(b.name)).forEach(s=>{
      html += `<div class="known-spell-item">
        <span class="spell-info" data-name="${esc(s.name)}" data-level="${s.level}" title="Click for full details">
          <span class="spell-name-link">${esc(s.name)}</span> <span class="custom-tag">${levelLabel(s.level)} · ${esc(s.from)}</span>${spellRowMarkers(s.name)}
        </span>
      </div>`;
    });
  }
  container.innerHTML = html + spellLegendHtml();
  container.querySelectorAll('.spell-info').forEach(el=>{
    el.addEventListener('click', ()=> openSpellDetail(el.dataset.name, parseInt(el.dataset.level)));
  });
  container.querySelectorAll('.spell-remove').forEach(btn=>{
    btn.addEventListener('click', e=>{
      state.knownSpells.splice(parseInt(e.target.dataset.idx),1);
      buildSpellLibrary(); buildKnownSpells(); save();
    });
  });
}

function addCustomSpellFromForm(){
  const nameEl = document.getElementById('customSpellName');
  const lvlEl = document.getElementById('customSpellLevel');
  const name = nameEl?.value.trim();
  if(!name) return false;
  const level = Math.max(0, Math.min(9, parseInt(lvlEl?.value, 10) || 0));
  state.knownSpells.push({ name, level, custom:true, tags: getTagPicker('customSpellTagPicker') });
  if(nameEl) nameEl.value = '';
  if(lvlEl) lvlEl.value = '0';
  setTagPicker('customSpellTagPicker', []);
  buildSpellLibrary();
  buildKnownSpells();
  save();
  return true;
}

// ---------- Class & Settings (multiclass) ----------
// Migrate older single-class saves into the classes array.
function ensureClasses(){
  if(!Array.isArray(state.classes)) state.classes = [];
  if(state.classes.length===0 && state.class){
    const base = state.class.split(' / ')[0];
    if(CLASS_DATA[base]) state.classes = [{name: base, level: state.level||1}];
  }
}

function pickedClasses(){
  ensureClasses();
  return state.classes.filter(c=>c.name && CLASS_DATA[c.name]);
}

// Recompute everything derived from the class list: total level (drives
// proficiency bonus), joined class string, primary-class saves, hit dice
// pools, and the default spell library.
function applyClassesToState(){
  const picked = pickedClasses();
  state.level = Math.max(1, picked.reduce((s,c)=>s+(c.level||1), 0));
  state.class = picked.map(c=>c.name).join(' / ');
  const primary = picked[0] && CLASS_DATA[picked[0].name];
  ABILITIES.forEach(a=> state.saveProf[a.key] = primary ? primary.saves.includes(a.key) : false);
  if(picked.length){
    const dice = {};
    picked.forEach(c=>{ const d='d'+CLASS_DATA[c.name].hitDie; dice[d]=(dice[d]||0)+(c.level||1); });
    state.hitDice = Object.entries(dice).map(([d,n])=>n+d).join(' + ');
    document.getElementById('hitDice').value = state.hitDice;
    const caster = picked.find(c=> SPELL_DATA[c.name]);
    if(caster) state.spellClass = caster.name;
  }
  refreshAutoSlots();
}

function updateHero(){
  document.getElementById('heroName').textContent = state.name || 'Unnamed Adventurer';
  const picked = pickedClasses();
  const clsText = picked.length
    ? picked.map(c=>`${c.name} ${c.level}`).join(' / ')
    : (state.class || '[no class]');
  const parts = ['Lv '+(state.level||1)+' '+clsText];
  if(state.race) parts.push(state.race);
  if(state.background) parts.push(state.background);
  if(state.alignment) parts.push(state.alignment);
  document.getElementById('heroSummary').innerHTML = parts.join('<span class="sep">//</span>');
  document.getElementById('heroXP').textContent = state.xp || 0;
}

function afterClassChange(){
  if(PAGE!=='sheet') return; // sheet-only refresh cascade
  applyClassesToState();
  buildClassList();
  renderClassInfoStack();
  buildSaves();
  buildSkills();
  buildSkillPicker();
  buildClassFeatures();
  buildSpellClassSelect();
  buildSpellLibrary();
  buildSpellSlots();
  buildActions();
  recalc(); save();
}

// ---------- Class source tags & filtering ----------
function sourceKey(src){ return src==='5E' ? '5e' : src==='5E (legacy)' ? '5eleg' : src==='5.5E' ? '55e' : 'homebrew'; }
function sourceTag(src){ return `<span class="src-tag src-${sourceKey(src)}">${src}</span>`; }

let classFilter = 'all';
// Class names matching the active source filter; the currently-selected class
// is always included so a filtered-out selection stays visible in its dropdown.
function classNamesForFilter(alwaysInclude){
  return Object.keys(CLASS_DATA).filter(n=>
    classFilter==='all' || CLASS_DATA[n].source===classFilter || n===alwaysInclude);
}

function buildClassFilterBar(){
  const bar = document.getElementById('classFilterBar');
  if(!bar) return;
  const opts = ['all', ...CLASS_SOURCES];
  bar.innerHTML = '<span class="filter-label">Filter</span>' + opts.map(o=>
    `<span class="filter-chip ${classFilter===o?'on':''}" data-f="${o}">${o==='all'?'All':o}</span>`).join('');
  bar.querySelectorAll('.filter-chip').forEach(chip=>chip.addEventListener('click',()=>{
    classFilter = chip.dataset.f;
    buildClassFilterBar();
    buildClassList();
  }));
}

function buildClassList(){
  ensureClasses();
  const wrap = document.getElementById('classList');
  if(!wrap) return;
  wrap.innerHTML='';
  state.classes.forEach((entry,i)=>{
    const taken = state.classes.filter((c,j)=>j!==i).map(c=>c.name);
    const names = classNamesForFilter(entry.name);
    const subs = entry.name ? subclassNamesForClass(entry.name) : [];
    const cd = CLASS_DATA[entry.name];
    const subLevel = cd ? cd.subclassLevel : 0;
    const subReady = cd && (entry.level||1) >= subLevel;
    const row = el('div','class-row');
    row.innerHTML = `
      <select class="mc-class" data-i="${i}">
        <option value="">— pick a class —</option>
        ${names.filter(n=>!taken.includes(n)).map(n=>
          `<option value="${n}" ${entry.name===n?'selected':''}>${n} · ${CLASS_DATA[n].source}</option>`).join('')}
      </select>
      <input class="mc-level" type="number" min="1" max="20" value="${entry.level||1}" data-i="${i}">
      ${i===0?'<span class="primary-tag">primary</span>':''}
      <span class="row-del mc-del" data-i="${i}">✕</span>
      ${subs.length ? `<select class="mc-subclass" data-i="${i}" title="${subReady?'':'unlocks at Lv '+subLevel}">
        <option value="">${subReady?'— subclass —':'— subclass (Lv '+subLevel+') —'}</option>
        ${subs.map(s=>`<option value="${esc(s)}" ${entry.subclass===s?'selected':''}>${esc(s)}${SUBCLASS_DATA[subKey(entry.name,s)]?' ✦':''}</option>`).join('')}
      </select>` : ''}
    `;
    wrap.appendChild(row);

    // Always present (possibly empty) so a level change can refill it in place
    // without rebuilding the row and stealing focus from the level input.
    const box = el('div','feat-choice-box');
    box.dataset.i = i;
    wrap.appendChild(box);
    renderFeatureChoices(i);
  });
  if(state.classes.length===0){
    wrap.innerHTML = '<div class="action-empty">No classes yet — add one below.</div>';
  }

  wrap.querySelectorAll('.mc-class').forEach(sel=>sel.addEventListener('change', e=>{
    state.classes[e.target.dataset.i].name = e.target.value;
    state.classes[e.target.dataset.i].subclass = ''; // reset subclass when class changes
    afterClassChange();
  }));
  wrap.querySelectorAll('.mc-subclass').forEach(sel=>sel.addEventListener('change', e=>{
    state.classes[e.target.dataset.i].subclass = e.target.value;
    buildClassList(); // the new subclass may bring its own choice prompts
    renderClassInfoStack();
    buildClassFeatures();
    buildActions();
    save();
  }));
  // Level edits keep focus: recompute derived state without rebuilding this list.
  wrap.querySelectorAll('.mc-level').forEach(inp=>inp.addEventListener('input', e=>{
    const lvl = Math.max(1, Math.min(20, parseInt(e.target.value)||1));
    state.classes[e.target.dataset.i].level = lvl;
    applyClassesToState();
    renderFeatureChoices(e.target.dataset.i); // a new level can unlock more choices
    renderClassInfoStack();
    buildClassFeatures();
    buildSpellSlots();
    buildActions();
    recalc(); save();
  }));
  wrap.querySelectorAll('.mc-del').forEach(btn=>btn.addEventListener('click', e=>{
    state.classes.splice(e.target.dataset.i, 1);
    afterClassChange();
  }));
}

// One-line description of when a class gets access to which spell levels.
function castingSummary(cd){
  if(!cd.casting) return null;
  const c = cd.casting;
  const ab = c.ability ? c.ability.toUpperCase() : '';
  let text = null;
  if(c.type==='full') text = `Full caster (${ab}). Spell levels: 1st@L1, 2nd@L3, 3rd@L5, 4th@L7, 5th@L9, 6th@L11, 7th@L13, 8th@L15, 9th@L17.`;
  else if(c.type==='half' && c.roundUp) text = `Half caster, rounded up (${ab}). Spell levels: 1st@L1, 2nd@L5, 3rd@L9, 4th@L13, 5th@L17.`;
  else if(c.type==='half') text = `Half caster (${ab}). Spell levels: 1st@L2, 2nd@L5, 3rd@L9, 4th@L13, 5th@L17.`;
  else if(c.type==='pact') text = `Pact magic (${ab}): slots refresh on a short rest. Slot level: 1st@L1, 2nd@L3, 3rd@L5, 4th@L7, 5th@L9; Mystic Arcanum adds 6th–9th at L11/13/15/17.`;
  if(c.note) text = text ? text+' '+c.note : c.note;
  return text;
}

// PHB multiclass prerequisite check against current ability scores.
function mcReqStatus(name){
  const req = MC_REQS[name];
  if(!req) return null;
  const met = req.some(opt=> Object.entries(opt).every(([k,v])=> (state.abilities[k]||0) >= v));
  const text = req.map(opt=> Object.entries(opt).map(([k,v])=>k.toUpperCase()+' '+v).join(' & ')).join(' or ');
  return {met, text};
}

// PHB multiclass spellcasting: full-caster levels + half of paladin/ranger levels.
// Warlock pact magic stacks separately.
function multiclassCasterLevel(picked){
  return picked.reduce((s,c)=>{
    const cast = CLASS_DATA[c.name] && CLASS_DATA[c.name].casting;
    if(!cast) return s;
    if(cast.type==='full') return s + (c.level||1);
    if(cast.type==='half') return s + (cast.roundUp ? Math.ceil((c.level||1)/2) : Math.floor((c.level||1)/2));
    return s;
  }, 0);
}

function classInfoCard(entry, showReq){
  const cd = CLASS_DATA[entry.name];
  const lvl = entry.level||1;
  const saveNames = cd.saves.map(k=>k.toUpperCase()).join(', ');
  const skills = cd.skills==='any' ? `any ${cd.choose} skills` : `choose ${cd.choose} from the dashed chips`;
  const spells = castingSummary(cd);
  const req = showReq ? mcReqStatus(entry.name) : null;

  const byLv = {};
  (cd.features||[]).forEach(f=>{ (byLv[f.lv]=byLv[f.lv]||[]).push(f.name); });
  const progRows = Object.keys(byLv).map(Number).sort((a,b)=>a-b).map(lv=>
    `<div class="ci-row ${lv<=lvl?'unlocked':''}"><span class="ci-key">lv_${String(lv).padStart(2,'0')}</span><span>${byLv[lv].join(', ')}</span></div>`
  ).join('');

  return `<div class="class-info">
    <div class="ci-title">${entry.name} — Lv ${lvl}${sourceTag(cd.source)}</div>
    <div class="ci-row"><span class="ci-key">hit_die</span><span>d${cd.hitDie} → ${lvl}d${cd.hitDie} from this class</span></div>
    <div class="ci-row"><span class="ci-key">save_prof</span><span>${saveNames}</span></div>
    <div class="ci-row"><span class="ci-key">skills</span><span>${skills}</span></div>
    ${(()=>{ const subs=subclassNamesForClass(entry.name); if(!subs.length) return ''; const chosen=entry.subclass;
      return `<div class="ci-row"><span class="ci-key">subclasses</span><span>choose at Lv ${cd.subclassLevel}: ${subs.map(s=> s===chosen?`<b class="sub-chosen">${esc(s)}</b>`:esc(s)).join(' · ')}</span></div>`; })()}
    ${spells?`<div class="ci-row"><span class="ci-key">spellcasting</span><span>${spells}</span></div>`:''}
    ${req?`<div class="ci-row"><span class="ci-key">mc_req</span><span class="${req.met?'req-ok':'req-bad'}">${req.text} — ${req.met?'✓ met':'✗ not met'}</span></div>`:''}
    <div class="ci-row"><span class="ci-key">source</span><span>${cd.custom ? 'Imported · '+cd.source : cd.homebrew ? 'World Anvil · Homebrew' : 'Official · '+cd.source}</span></div>
    ${progRows?`<div class="ci-prog-label">// ability progression — highlighted rows are unlocked at this class's level</div><div class="ci-prog">${progRows}</div>`:''}
    ${cd.desc?`<div class="ci-desc">${cd.desc}</div>`:''}
  </div>`;
}

function renderClassInfoStack(){
  const box = document.getElementById('classInfoStack');
  if(!box) return;
  document.getElementById('totalLevelDisplay').textContent = state.level||1;
  const picked = pickedClasses();
  if(!picked.length){
    box.innerHTML = '<div class="class-info"><div class="ci-desc">// no class selected — saves & skills fall back to raw ability modifiers</div></div>';
    return;
  }
  const multi = picked.length>1;
  let summary = '';
  if(multi){
    const casterLvl = multiclassCasterLevel(picked);
    const hasWarlock = picked.some(c=>c.name==='Warlock');
    summary = `<div class="class-info">
      <div class="ci-title">Multiclass — Lv ${state.level}</div>
      <div class="ci-row"><span class="ci-key">prof_bonus</span><span>+${profBonus(state.level)} (from total level ${state.level})</span></div>
      <div class="ci-row"><span class="ci-key">hit_dice</span><span>${state.hitDice}</span></div>
      <div class="ci-row"><span class="ci-key">save_prof</span><span>from primary class only (${picked[0].name})</span></div>
      ${casterLvl>0?`<div class="ci-row"><span class="ci-key">mc_caster</span><span>combined caster level ${casterLvl} — use the PHB multiclass slot table${hasWarlock?'; Warlock pact slots stack separately':''}</span></div>`:''}
    </div>`;
  }
  box.innerHTML = summary + picked.map(entry=> classInfoCard(entry, multi)).join('');
}

function buildSkillPicker(){
  const picked = pickedClasses();
  const primary = picked[0] && CLASS_DATA[picked[0].name];
  const hint = document.getElementById('skillHint');
  const parts = [];
  if(primary && primary.skills!=='any'){
    parts.push(`<span class="hl">${picked[0].name}</span> (primary) grants <span class="hl">${primary.choose}</span> picks from the dashed chips.${picked.length>1?' Multiclass dips grant fewer skills (PHB).':''}`);
  } else if(primary){
    parts.push(`<span class="hl">${picked[0].name}</span> (primary) grants <span class="hl">${primary.choose}</span> picks from any skill.`);
  }
  const grantedNames = SKILLS.map(s=>s.name).filter(n=>grantedSkillSources(n).length);
  if(grantedNames.length){
    parts.push(`Solid chips are <span class="hl">granted automatically</span> by your species / background (${grantedNames.map(esc).join(', ')}).`);
  }
  parts.push('Any other chip can be toggled for proficiencies from feats or DM fiat — click <span class="hl">?</span> above for the legend.');
  if(hint) hint.innerHTML = parts.join(' ');
  const wrap = document.getElementById('skillPicker');
  if(!wrap) return;
  wrap.innerHTML='';
  SKILLS.forEach((s,i)=>{
    const key='sk'+i;
    if(!(key in state.skillProf)) state.skillProf[key]=false;
    const fromClass = picked.some(c=>{
      const cd = CLASS_DATA[c.name];
      return cd.skills!=='any' && cd.skills.includes(s.name);
    });
    const granted = grantedSkillSources(s.name);
    const chip = el('div', 'skill-chip'
      + (state.skillProf[key]||granted.length ? ' on':'')
      + (fromClass ? ' classpick':'')
      + (granted.length ? ' granted':''));
    chip.innerHTML = `${s.name}<span class="chip-abbr">${s.ability}</span>`
      + granted.map(g=>`<span class="chip-grant">${esc(g.kind)}</span>`).join('');
    if(granted.length){
      // Granted proficiencies are locked on — remove the source to remove them.
      chip.title = granted.map(g=>`Granted by your ${g.kind} — ${g.by}`).join('; ');
      chip.addEventListener('click', ()=>{
        chip.classList.add('shake');
        setTimeout(()=>chip.classList.remove('shake'), 350);
      });
    } else {
      chip.addEventListener('click', ()=>{
        state.skillProf[key] = !state.skillProf[key];
        chip.classList.toggle('on', state.skillProf[key]);
        buildSkills(); recalc(); save();
      });
    }
    wrap.appendChild(chip);
  });
}

// ---------- Feature choices ----------
// A feature with a `choices` list is a pick-one, offered on both the Features
// tab (inline on the feature) and the Settings tab (under its class row).
// The pick is stored per class entry in state.classes[i].featureChoices, keyed
// owner::feature (owner is the class or subclass granting it). A stored value is
// either the option name (a listed choice) or {custom:true, name, desc} for an
// "Other…" entry the player wrote themselves.
const CHOICE_OTHER = '__other';

function featureChoiceKey(owner, name){ return owner + '::' + name; }

function hasChoices(f){ return Array.isArray(f.choices) && f.choices.length > 0; }

function normalizeChoice(v){
  if(!v) return null;
  if(typeof v === 'string') return { name:v, desc:'', custom:false };
  return { name: v.name||'', desc: v.desc||'', custom: !!v.custom };
}

function chosenFeatureOption(entry, owner, f){
  return normalizeChoice((entry.featureChoices || {})[featureChoiceKey(owner, f.name)]);
}

// Reference detail for a listed option. Only fighting styles have a table today;
// anything else is a bare name and previews as nothing.
function choiceInfo(name){ return fightingStyleByName(name); }

// The description and class availability shown under a picked option.
function choicePreviewHtml(choice){
  if(!choice || !choice.name) return '';
  // A custom pick reads "Other…" in the dropdown, so the preview is the only
  // place its name appears — show that alongside whatever was written for it.
  if(choice.custom){
    return `<div class="nr-meta"><b class="fc-custom-name">${esc(choice.name)}</b> <span class="chip-abbr">custom</span></div>
      ${choice.desc ? `<div class="feat-desc">${esc(choice.desc)}</div>` : ''}`;
  }
  const info = choiceInfo(choice.name);
  if(!info) return '';
  return `<div class="feat-desc">${esc(info.desc)}</div>
    <div class="nr-meta">Available to: ${esc(info.classes.join(', '))}</div>`;
}

// Every choice-offering feature unlocked at this entry's level, from the class
// and its selected subclass.
function choiceFeaturesFor(entry){
  const out = [];
  const cd = CLASS_DATA[entry.name];
  if(!cd) return out;
  const lvl = entry.level || 1;
  const collect = (owner, feats)=> (feats||[]).forEach(f=>{
    if(hasChoices(f) && f.lv <= lvl) out.push({ owner, f, key: featureChoiceKey(owner, f.name) });
  });
  collect(entry.name, cd.features);
  if(entry.subclass){
    const sc = SUBCLASS_DATA[subKey(entry.name, entry.subclass)];
    if(sc) collect(entry.subclass, sc.features);
  }
  return out;
}

// Drop picks that no longer belong to the entry's class/subclass, or whose stored
// option is no longer offered. Level is ignored on purpose: dropping to a lower
// level shouldn't discard a pick the character makes again on the way back up.
function pruneFeatureChoices(entry){
  const fc = entry.featureChoices;
  if(!fc) return;
  const valid = new Map();
  const collect = (owner, feats)=> (feats||[]).forEach(f=>{
    if(hasChoices(f)) valid.set(featureChoiceKey(owner, f.name), f.choices);
  });
  const cd = CLASS_DATA[entry.name];
  if(cd) collect(entry.name, cd.features);
  if(entry.subclass){
    const sc = SUBCLASS_DATA[subKey(entry.name, entry.subclass)];
    if(sc) collect(entry.subclass, sc.features);
  }
  Object.keys(fc).forEach(k=>{
    const opts = valid.get(k);
    if(!opts){ delete fc[k]; return; } // the feature itself is gone
    const c = normalizeChoice(fc[k]);
    // A custom "Other…" pick is the player's own text — keep it as long as the
    // feature exists. A listed pick only survives while it's still offered.
    if(!c || (!c.custom && !opts.includes(c.name))) delete fc[k];
  });
  if(!Object.keys(fc).length) delete entry.featureChoices;
}

// Fill one class row's choice box with a pick-one control per unlocked
// choice-feature. Re-rendered on its own so level edits keep the list stable.
function renderFeatureChoices(i){
  const entry = state.classes[i];
  const box = document.querySelector(`.feat-choice-box[data-i="${i}"]`);
  if(!box || !entry) return;
  pruneFeatureChoices(entry);
  box.innerHTML = choiceFeaturesFor(entry).map(cf=>
    choiceControlHtml(i, cf, chosenFeatureOption(entry, cf.owner, cf.f), true)).join('');
  bindFeatureChoiceControls(box);
}

// The Other… option carries the custom pick's name, so the dropdown reads back
// what was chosen instead of a bare "Other…".
function otherOptionLabel(choice){
  return choice && choice.custom && choice.name ? 'Other… — ' + choice.name : 'Other…';
}

// One pick-one control: the dropdown, an Edit button for a custom pick, and the
// preview of whatever is currently picked. Shared by the Features and Settings
// tabs; `i` indexes state.classes. `showLabel` is for Settings, where the
// feature's name isn't already on screen. Picking "Other…" opens the popup.
function choiceControlHtml(i, cf, choice, showLabel){
  const isCustom = !!(choice && choice.custom);
  const sel = choice ? (isCustom ? CHOICE_OTHER : choice.name) : '';
  return `<div class="feat-choice-ctl${choice && choice.name ? '' : ' pending'}">
    <div class="fc-head">
      ${showLabel ? `<label class="feat-choice-label" title="${esc(cf.f.desc||'')}">
        ${esc(cf.f.name)} <span class="chip-abbr">${esc(cf.owner)} · Lv ${cf.f.lv}</span>
      </label>` : ''}
      <select class="feat-choice" data-i="${i}" data-key="${esc(cf.key)}" data-label="${esc(cf.f.name + ' — ' + cf.owner)}">
        <option value="">— choose —</option>
        ${cf.f.choices.map(c=>`<option value="${esc(c)}" ${sel===c?'selected':''}>${esc(c)}</option>`).join('')}
        <option value="${CHOICE_OTHER}" ${isCustom?'selected':''}>${esc(otherOptionLabel(choice))}</option>
      </select>
      <button type="button" class="pbtn fc-edit" ${isCustom?'':'hidden'}>Edit note…</button>
    </div>
    <div class="feat-choice-preview">${choicePreviewHtml(choice)}</div>
  </div>`;
}

function bindFeatureChoiceControls(scope){
  scope.querySelectorAll('.feat-choice').forEach(sel=> sel.addEventListener('change', onFeatureChoiceChange));
  scope.querySelectorAll('.fc-edit').forEach(btn=> btn.addEventListener('click', e=>{
    const sel = e.target.closest('.feat-choice-ctl').querySelector('.feat-choice');
    openChoiceModal(sel.dataset.i, sel.dataset.key, sel.dataset.label);
  }));
}

// Update one control in place, without re-rendering its select.
function refreshChoiceControl(ctl, choice){
  if(!ctl) return;
  const edit = ctl.querySelector('.fc-edit');
  if(edit) edit.hidden = !(choice && choice.custom);
  // The select isn't rebuilt here, so retitle the Other… option by hand.
  const other = ctl.querySelector(`.feat-choice option[value="${CHOICE_OTHER}"]`);
  if(other) other.textContent = otherOptionLabel(choice);
  const preview = ctl.querySelector('.feat-choice-preview');
  if(preview) preview.innerHTML = choicePreviewHtml(choice);
  ctl.classList.toggle('pending', !choice || !choice.name);
}

// Re-sync every rendered control for one pick — the Features and Settings tabs
// each render their own, and both must reflect what the popup just saved.
function syncChoiceControls(i, key){
  const entry = state.classes[i];
  const choice = entry ? normalizeChoice((entry.featureChoices||{})[key]) : null;
  document.querySelectorAll('.feat-choice').forEach(sel=>{
    if(String(sel.dataset.i) !== String(i) || sel.dataset.key !== key) return;
    sel.value = choice ? (choice.custom ? CHOICE_OTHER : choice.name) : '';
    refreshChoiceControl(sel.closest('.feat-choice-ctl'), choice);
  });
}

function onFeatureChoiceChange(e){
  const sel = e.target;
  const entry = state.classes[sel.dataset.i];
  if(!entry) return;
  const key = sel.dataset.key;
  entry.featureChoices = entry.featureChoices || {};
  if(sel.value === CHOICE_OTHER){
    // Keep any custom text already written when Other… is re-picked, then let
    // the popup commit the change.
    const prev = normalizeChoice(entry.featureChoices[key]);
    if(!prev || !prev.custom) entry.featureChoices[key] = { custom:true, name:'', desc:'' };
    refreshChoiceControl(sel.closest('.feat-choice-ctl'), normalizeChoice(entry.featureChoices[key]));
    openChoiceModal(sel.dataset.i, key, sel.dataset.label);
    return;
  }
  if(sel.value) entry.featureChoices[key] = sel.value;
  else delete entry.featureChoices[key];
  syncChoiceControls(sel.dataset.i, key);
  buildActions();
  save();
}

// ---------- Custom choice popup ----------
// "Other…" opens this dialog to name and describe a homebrew option. It writes
// straight to the character; the picker just reflects what it saved.
let choiceModalTarget = null;

function setChoiceModalStatus(msg){
  const el = document.getElementById('choiceModalStatus');
  if(el) el.textContent = msg || '';
}

function openChoiceModal(i, key, featureLabel){
  const backdrop = document.getElementById('choiceModalBackdrop');
  const entry = state.classes[i];
  if(!backdrop || !entry) return;
  const cur = normalizeChoice((entry.featureChoices||{})[key]);
  choiceModalTarget = { i, key };
  document.getElementById('choiceModalFeature').textContent = featureLabel || '';
  document.getElementById('choiceModalName').value = cur && cur.custom ? cur.name : '';
  document.getElementById('choiceModalDesc').value = cur && cur.custom ? cur.desc : '';
  setChoiceModalStatus('');
  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden','false');
  setTimeout(()=>{ const n = document.getElementById('choiceModalName'); if(n) n.focus(); }, 0);
}

function closeChoiceModal(){
  choiceModalTarget = null;
  const backdrop = document.getElementById('choiceModalBackdrop');
  if(!backdrop) return;
  backdrop.classList.remove('open');
  backdrop.setAttribute('aria-hidden','true');
}

function saveChoiceModal(){
  if(!choiceModalTarget) return;
  const { i, key } = choiceModalTarget;
  const entry = state.classes[i];
  if(!entry) return closeChoiceModal();
  const name = document.getElementById('choiceModalName').value.trim();
  const desc = document.getElementById('choiceModalDesc').value.trim();
  if(!name){ setChoiceModalStatus('Give it a name first.'); return; }
  entry.featureChoices = entry.featureChoices || {};
  entry.featureChoices[key] = { custom:true, name, desc };
  syncChoiceControls(i, key);
  buildActions();
  save();
  closeChoiceModal();
}

// Drop the pick entirely, resetting the dropdown back to "— choose —".
function clearChoiceModal(){
  if(!choiceModalTarget) return;
  const { i, key } = choiceModalTarget;
  const entry = state.classes[i];
  if(entry && entry.featureChoices){
    delete entry.featureChoices[key];
    if(!Object.keys(entry.featureChoices).length) delete entry.featureChoices;
  }
  syncChoiceControls(i, key);
  buildActions();
  save();
  closeChoiceModal();
}

function bindChoiceModal(){
  const backdrop = document.getElementById('choiceModalBackdrop');
  if(!backdrop) return;
  document.getElementById('choiceModalClose').addEventListener('click', closeChoiceModal);
  document.getElementById('choiceModalSave').addEventListener('click', saveChoiceModal);
  document.getElementById('choiceModalClear').addEventListener('click', clearChoiceModal);
  backdrop.addEventListener('click', e=>{ if(e.target===backdrop) closeChoiceModal(); });
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape' && backdrop.classList.contains('open')) closeChoiceModal();
  });
}

// `ctx` ({i, owner}) turns on the inline picker; without it the feature renders
// read-only (the Library's detail popups pass nothing).
function featItem(f, choice, ctx){
  const showPicker = ctx && hasChoices(f);
  return `<div class="feat-item">
    <div class="feat-head">
      <span class="f-lvl">LV ${f.lv}</span>
      <span class="f-name">${esc(f.name)}</span>
      ${f.use && f.use!=='passive' ? `<span class="action-badge">${esc(f.use)}${f.cost?' · '+esc(f.cost):''}</span>`:''}
      ${hasChoices(f) && !showPicker && choice && choice.name ? `<span class="choice-badge">${esc(choice.name)}</span>` : ''}
    </div>
    ${f.desc?`<div class="feat-desc">${esc(f.desc)}</div>`:''}
    ${showPicker ? choiceControlHtml(ctx.i, { key: featureChoiceKey(ctx.owner, f.name), owner: ctx.owner, f }, choice, false) : ''}
  </div>`;
}

function buildClassFeatures(){
  const box = document.getElementById('classFeaturesList');
  if(!box) return;
  const picked = pickedClasses();
  // Custom class features are listed even with no class picked, so they never
  // vanish behind the empty-state message.
  if(!picked.length){
    box.innerHTML = '<div class="action-empty">Select a class in Settings to see its features here.</div>'
      + customFeaturesHtml('class');
    bindCustomFeatureRows(box);
    return;
  }
  box.innerHTML = picked.map(entry=>{
    const cd = CLASS_DATA[entry.name];
    const lvl = entry.level||1;
    const all = cd.features||[];
    const feats = all.filter(f=>f.lv<=lvl);
    const upcoming = all.length - feats.length;
    // The picker writes back to state.classes, so it needs that array's index —
    // pickedClasses() is filtered, so its own index would be wrong.
    const ci = state.classes.indexOf(entry);
    pruneFeatureChoices(entry);
    let html = `<div class="known-spell-group-label">${esc(entry.name)} ${entry.level}</div>`
      + (feats.length ? feats.map(f=>featItem(f, chosenFeatureOption(entry, entry.name, f), { i:ci, owner:entry.name })).join('') : '<div class="action-empty">No features at this level.</div>')
      + (upcoming>0?`<div class="action-empty">+ ${upcoming} more at higher ${esc(entry.name)} levels.</div>`:'');
    // Chosen subclass features (imported detail, gated by class level).
    if(entry.subclass){
      const sc = SUBCLASS_DATA[subKey(entry.name, entry.subclass)];
      html += `<div class="subclass-label">↳ ${esc(entry.subclass)}${sc?' '+sourceTag(sc.source):''}</div>`;
      const sfeatsAll = (sc && sc.features) || [];
      if(sfeatsAll.length){
        const sfeats = sfeatsAll.filter(f=>f.lv<=lvl);
        const sUpcoming = sfeatsAll.length - sfeats.length;
        html += (sfeats.length ? sfeats.map(f=>featItem(f, chosenFeatureOption(entry, entry.subclass, f), { i:ci, owner:entry.subclass })).join('') : '<div class="action-empty">No subclass features unlocked at this level yet.</div>')
          + (sUpcoming>0?`<div class="action-empty">+ ${sUpcoming} more at higher levels.</div>`:'');
      } else {
        html += '<div class="action-empty">No feature detail imported — add it on the Library tab.</div>';
      }
    }
    return html;
  }).join('') + customFeaturesHtml('class');
  bindFeatureChoiceControls(box);
  bindCustomFeatureRows(box);
}

// ---------- Actions tab (derived from attacks, spells, and inventory) ----------
// A spell of level L can be cast using any unspent slot of level L or higher.
function slotsRemainingAtOrAbove(level){
  let n=0;
  for(let i=level-1;i<9;i++) n += Math.max(0, state.spellSlots[i].total - state.spellSlots[i].used);
  const pact = state.pactSlots;
  if(pact && pact.level>=level) n += Math.max(0, pact.total - pact.used);
  return n;
}

// Short effect summaries shown on the compact equipment rows. Raw strings —
// caller escapes.
function equipSummaryBadges(it){
  const b=[], atk=it.attack||{}, ab=it.abilities||{};
  const atkTxt=[atk.bonus,atk.dmg].map(s=>(s==null?'':String(s).trim())).filter(Boolean).join(' · ');
  if(atkTxt) b.push('⚔ '+atkTxt);
  if(it.ac!=null && String(it.ac).trim()) b.push('AC '+String(it.ac).trim());
  ABILITIES.forEach(a=>{ const v=(ab[a.key]==null?'':String(ab[a.key]).trim()); if(v) b.push(a.key.toUpperCase()+' '+v); });
  (it.skills||[]).forEach(s=> b.push(`${s.name} ${fmt(Number(s.bonus)||0)}`));
  (it.spells||[]).forEach(sp=> b.push('✦ '+sp.name));
  return b;
}

function buildEquipment(){
  const wrap = document.getElementById('equipmentList');
  if(!wrap) return;
  const list = equipList();
  if(list.length===0){
    wrap.innerHTML = '<div class="action-empty">No equipment yet — add a weapon, armor, or magic item below.</div>';
    return;
  }
  // Compact rows: toggle + name + effect badges. Details live in the popup
  // editor (openEquipModal) — click the row to open it.
  wrap.innerHTML = list.map((it,i)=>{
    const named = it.name && it.name.trim();
    const badges = equipSummaryBadges(it).map(t=>`<span class="eq-badge">${esc(t)}</span>`).join('');
    return `<div class="equip-row ${it.equipped?'equipped':''}">
      <label class="equip-toggle" title="Equipped / packed"><input type="checkbox" class="eq-equipped" data-i="${i}" ${it.equipped?'checked':''}></label>
      <div class="eq-row-main" data-i="${i}" title="Click to edit">
        <span class="eq-row-name ${named?'':'unnamed'}">${named?esc(it.name):'Unnamed item'}</span>
        ${badges}
      </div>
      <span class="row-del eq-del" data-i="${i}">✕</span>
    </div>`;
  }).join('');
  bindEquipList(wrap);
}

// Re-derive everything equipped gear can affect. Also used by the tab modules.
function refreshEffects(){ recalc(); buildActions(); buildKnownSpells(); buildEquipAttackList(); buildInventory(); }

function bindEquipList(wrap){
  const list = equipList();
  wrap.querySelectorAll('.eq-equipped').forEach(inp=>inp.addEventListener('change', e=>{
    list[e.target.dataset.i].equipped = e.target.checked; buildEquipment(); refreshEffects(); save();
  }));
  wrap.querySelectorAll('.eq-del').forEach(btn=>btn.addEventListener('click', e=>{
    list.splice(e.target.dataset.i,1); buildEquipment(); refreshEffects(); save();
  }));
  wrap.querySelectorAll('.eq-row-main').forEach(row=>row.addEventListener('click', ()=>{
    openEquipModal(Number(row.dataset.i));
  }));
}

// ---------- Add/Edit item popup (Inventory tab) ----------
// One modal (partials/item-modal.html) serves both flavors: 'equip' shows the
// full effects form working on a draft copy committed on Save; 'item' is just
// name + quantity. The Type toggle flips `kind`; when it no longer matches
// `originKind`, Save moves the entry to the other list (item ⇄ equipment).
// index null = adding a new entry.
let itemModalCtx = null; // { originKind:'equip'|'item', index, kind, draft }

function setItemModalStatus(msg){
  const el = document.getElementById('itemModalStatus');
  if(el) el.textContent = msg || '';
}

// Skill/spell chips edit the draft only; nothing touches state until Save.
function renderItemModalChips(){
  if(!itemModalCtx || !itemModalCtx.draft) return;
  const d = itemModalCtx.draft;
  const skills = document.getElementById('itemModalSkillList');
  const spells = document.getElementById('itemModalSpellList');
  skills.innerHTML = d.skills.map((s,si)=>`<span class="eq-chip">${esc(s.name)} ${fmt(Number(s.bonus)||0)}<span class="eq-skill-del" data-si="${si}">✕</span></span>`).join('');
  spells.innerHTML = d.spells.map((sp,si)=>`<span class="eq-chip">${esc(sp.name)} <em>${sp.level==0?'C':'L'+sp.level}</em><span class="eq-spell-del" data-si="${si}">✕</span></span>`).join('');
  skills.querySelectorAll('.eq-skill-del').forEach(x=>x.addEventListener('click', e=>{
    d.skills.splice(e.target.dataset.si,1); renderItemModalChips();
  }));
  spells.querySelectorAll('.eq-spell-del').forEach(x=>x.addEventListener('click', e=>{
    d.spells.splice(e.target.dataset.si,1); renderItemModalChips();
  }));
}

// Switch which flavor the form shows; Save moves the entry if it changed.
function setItemModalKind(kind){
  if(!itemModalCtx) return;
  itemModalCtx.kind = kind;
  const backdrop = document.getElementById('itemModalBackdrop');
  backdrop.classList.toggle('mode-equip', kind==='equip');
  backdrop.classList.toggle('mode-item', kind==='item');
  document.getElementById('itemKindEquip').classList.toggle('active', kind==='equip');
  document.getElementById('itemKindItem').classList.toggle('active', kind==='item');
  const editing = itemModalCtx.index!=null;
  document.getElementById('itemModalHeading').textContent =
    (editing?'Edit ':'Add ') + (kind==='equip'?'Equipment':'Item');
  const hint = document.getElementById('itemModalHint');
  if(kind==='equip') hint.textContent = 'Effects apply while the item is equipped';
  else hint.textContent = (editing && itemModalCtx.originKind==='equip')
    ? 'Saving as a plain item drops its equipment effects' : '';
}

function normalizeEquipDraft(d){
  d.attack = d.attack||{bonus:'',dmg:''};
  d.abilities = d.abilities||{};
  d.skills = d.skills||[];
  d.spells = d.spells||[];
  return d;
}

function fillItemModalEquipFields(draft){
  document.getElementById('itemModalEquipped').checked = draft.equipped!==false;
  document.getElementById('itemModalDesc').value = draft.description||'';
  document.getElementById('itemModalAtkBonus').value = draft.attack.bonus||'';
  document.getElementById('itemModalAtkDmg').value = draft.attack.dmg||'';
  document.getElementById('itemModalAC').value = draft.ac==null?'':draft.ac;
  // Rebuild the six ability inputs so they always reflect this draft.
  const abBox = document.getElementById('itemModalAbilities');
  abBox.querySelectorAll('.eq-ab').forEach(n=>n.remove());
  abBox.insertAdjacentHTML('beforeend', ABILITIES.map(a=>`<label class="eq-ab"><span>${a.key.toUpperCase()}</span><input class="eq-abil" data-k="${a.key}" value="${esc(draft.abilities[a.key])}" placeholder="—"></label>`).join(''));
  document.getElementById('itemModalSkillPick').value='';
  document.getElementById('itemModalSkillBonus').value='';
  document.getElementById('itemModalSpellName').value='';
  document.getElementById('itemModalSpellLvl').value='0';
  renderItemModalChips();
}

function openItemModalBackdrop(){
  const backdrop = document.getElementById('itemModalBackdrop');
  if(!backdrop) return false;
  setItemModalStatus('');
  backdrop.classList.add('open');
  backdrop.setAttribute('aria-hidden','false');
  setTimeout(()=>{ const n = document.getElementById('itemModalName'); if(n) n.focus(); }, 0);
  return true;
}

function openEquipModal(index){
  const editing = Number.isInteger(index);
  const src = editing ? equipList()[index] : newEquipItem();
  if(!src) return;
  const draft = normalizeEquipDraft(JSON.parse(JSON.stringify(src)));
  itemModalCtx = { originKind:'equip', index: editing?index:null, kind:'equip', draft };
  if(!openItemModalBackdrop()) return;
  document.getElementById('itemModalName').value = draft.name||'';
  document.getElementById('itemModalQty').value = 1;
  fillItemModalEquipFields(draft);
  setItemModalKind('equip');
}

function openItemModal(index){
  const editing = Number.isInteger(index);
  const src = editing ? state.inventory[index] : {name:'', qty:1};
  if(!src) return;
  // A fresh equip draft sits behind the simple form so flipping the Type
  // toggle to Equipment starts from a clean effects form.
  const draft = normalizeEquipDraft(newEquipItem());
  draft.name = src.name||'';
  itemModalCtx = { originKind:'item', index: editing?index:null, kind:'item', draft };
  if(!openItemModalBackdrop()) return;
  document.getElementById('itemModalName').value = src.name||'';
  document.getElementById('itemModalQty').value = src.qty==null?1:src.qty;
  fillItemModalEquipFields(draft);
  setItemModalKind('item');
}

function closeItemModal(){
  itemModalCtx = null;
  const backdrop = document.getElementById('itemModalBackdrop');
  if(!backdrop) return;
  backdrop.classList.remove('open');
  backdrop.setAttribute('aria-hidden','true');
}

function saveItemModal(){
  if(!itemModalCtx) return;
  const ctx = itemModalCtx;
  const name = document.getElementById('itemModalName').value.trim();
  if(!name){ setItemModalStatus('Give it a name first.'); return; }
  const equip = equipList();
  if(ctx.kind==='item'){
    const qty = parseInt(document.getElementById('itemModalQty').value,10);
    const item = { name, qty: isNaN(qty)?1:qty };
    if(ctx.originKind==='item' && ctx.index!=null){
      Object.assign(state.inventory[ctx.index], item);
    } else {
      // New entry, or equipment converted to a plain item.
      if(ctx.originKind==='equip' && ctx.index!=null) equip.splice(ctx.index,1);
      state.inventory.push(item);
    }
  } else {
    const d = ctx.draft;
    d.name = name;
    d.equipped = document.getElementById('itemModalEquipped').checked;
    d.description = document.getElementById('itemModalDesc').value;
    d.attack = {
      bonus: document.getElementById('itemModalAtkBonus').value,
      dmg: document.getElementById('itemModalAtkDmg').value
    };
    d.ac = document.getElementById('itemModalAC').value;
    document.querySelectorAll('#itemModalAbilities .eq-abil').forEach(inp=>{ d.abilities[inp.dataset.k]=inp.value; });
    if(ctx.originKind==='equip' && ctx.index!=null){
      equip[ctx.index] = d;
    } else {
      // New entry, or a plain item promoted to equipment.
      if(ctx.originKind==='item' && ctx.index!=null) state.inventory.splice(ctx.index,1);
      equip.push(d);
    }
  }
  // refreshEffects rebuilds the inventory list too, so this covers both lists
  // regardless of which one(s) changed.
  buildEquipment(); refreshEffects(); save();
  closeItemModal();
}

function bindItemModal(){
  const backdrop = document.getElementById('itemModalBackdrop');
  if(!backdrop) return;
  // Static option pools, filled once.
  document.getElementById('itemModalSkillPick').insertAdjacentHTML('beforeend', SKILLS.map(s=>`<option>${s.name}</option>`).join(''));
  document.getElementById('itemModalSpellLvl').innerHTML = levelOptions(0);
  document.getElementById('itemModalClose').addEventListener('click', closeItemModal);
  document.getElementById('itemModalSave').addEventListener('click', saveItemModal);
  document.getElementById('itemKindEquip').addEventListener('click', ()=>setItemModalKind('equip'));
  document.getElementById('itemKindItem').addEventListener('click', ()=>setItemModalKind('item'));
  backdrop.addEventListener('click', e=>{ if(e.target===backdrop) closeItemModal(); });
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape' && backdrop.classList.contains('open')) closeItemModal();
  });
  ['itemModalName','itemModalQty'].forEach(id=>document.getElementById(id).addEventListener('keydown', e=>{
    if(e.key==='Enter') saveItemModal();
  }));
  document.getElementById('itemModalSkillAdd').addEventListener('click', ()=>{
    if(!itemModalCtx || itemModalCtx.kind!=='equip') return;
    const name = document.getElementById('itemModalSkillPick').value;
    const bonus = parseInt(document.getElementById('itemModalSkillBonus').value,10);
    if(!name || isNaN(bonus)){ setItemModalStatus('Pick a skill and a bonus.'); return; }
    itemModalCtx.draft.skills.push({name,bonus});
    document.getElementById('itemModalSkillPick').value='';
    document.getElementById('itemModalSkillBonus').value='';
    setItemModalStatus('');
    renderItemModalChips();
  });
  document.getElementById('itemModalSpellAdd').addEventListener('click', ()=>{
    if(!itemModalCtx || itemModalCtx.kind!=='equip') return;
    const nameInp = document.getElementById('itemModalSpellName');
    const name = nameInp.value.trim();
    if(!name){ setItemModalStatus('Name the granted spell first.'); return; }
    const level = Math.max(0,Math.min(9,parseInt(document.getElementById('itemModalSpellLvl').value,10)||0));
    itemModalCtx.draft.spells.push({name,level});
    nameInp.value='';
    setItemModalStatus('');
    renderItemModalChips();
  });
}

// Read-only mirror of equipped weapons under the Actions-tab attacks table.
function buildEquipAttackList(){
  const box = document.getElementById('equipAttackList');
  if(!box) return;
  const atks = equipmentAttacks();
  box.innerHTML = atks.length
    ? '<div class="equip-atk-head">From equipped gear</div>' + atks.map(a=>
        `<div class="equip-atk-row"><span>${esc(a.name)}</span><span>${a.bonus?esc(a.bonus)+' hit':''}${a.bonus&&a.dmg?' · ':''}${esc(a.dmg||'')}</span></div>`).join('')
    : '';
}

// ---------- Companions (Character tab) ----------
// Auto-generated companions store only a templateId + mutable bits (name, HP,
// notes); their stat block is recomputed from COMPANION_TEMPLATES every time
// the character changes, so they scale with level automatically. Manual
// companions carry all their own numbers.

function companionTemplates(){
  return (typeof COMPANION_TEMPLATES !== 'undefined') ? COMPANION_TEMPLATES : [];
}
function companionTemplate(id){ return companionTemplates().find(t=>t.id===id) || null; }
function companions(){
  if(!Array.isArray(state.companions)) state.companions = [];
  return state.companions;
}

// Everything a template needs to compute its stat block for this character.
function companionCtx(){
  const eff = effectiveAbilities();
  const pb = profBonus(state.level);
  const picked = pickedClasses();
  const amod = k => mod(eff[k]||10);
  const classLevel = name => { const c = picked.find(p=>p.name===name); return c ? (c.level||1) : 0; };
  const subclassLevel = (cls, sub) => { const c = picked.find(p=>p.name===cls && p.subclass===sub); return c ? (c.level||1) : 0; };
  // Spellcasting mod for a class; with no class given (or a class the character
  // doesn't cast with), fall back to the best casting stat among picked classes.
  const castMod = name => {
    const cd = name && CLASS_DATA[name];
    if(cd && cd.casting && cd.casting.ability) return amod(cd.casting.ability);
    const mods = picked.map(p=>CLASS_DATA[p.name])
      .filter(d=>d && d.casting && d.casting.ability)
      .map(d=>amod(d.casting.ability));
    return mods.length ? Math.max(...mods) : amod('int');
  };
  const known = new Set([...state.knownSpells.map(s=>s.name), ...equipmentGrantedSpells().map(s=>s.name)]
    .map(n=>(n||'').toLowerCase()));
  const bestSlotLevel = min => {
    let best = 0;
    (state.spellSlots||[]).forEach((s,i)=>{ if(s && s.total>0) best = Math.max(best, i+1); });
    if(state.pactSlots && state.pactSlots.total>0) best = Math.max(best, state.pactSlots.level||1);
    return Math.max(min||1, best);
  };
  return { pb, level: state.level||1, abilities: eff, amod, fmt,
    classLevel, subclassLevel, castMod, spellAtk: name => pb + castMod(name),
    knowsSpell: n => known.has((n||'').toLowerCase()), bestSlotLevel };
}

// Library popups have no character loaded: render templates for a baseline
// character (fresh unlock, +2 PB, +0 modifiers) and lean on the formula text.
function companionBaselineCtx(){
  return { pb:2, level:3, abilities:{str:10,dex:10,con:10,int:10,wis:10,cha:10},
    amod:()=>0, fmt,
    classLevel:()=>3, subclassLevel:()=>3, castMod:()=>0, spellAtk:()=>2,
    knowsSpell:()=>true, bestSlotLevel:min=>Math.max(1,min||1) };
}

function newManualCompanion(){
  return { uid: 'c'+Date.now()+Math.floor(Math.random()*1000), templateId: null,
    name:'New Companion', typeLine:'', ac:12, hpMax:10, hpCurrent:10, hpTemp:0,
    speed:'30 ft.', abilities:{str:10,dex:10,con:10,int:10,wis:10,cha:10},
    skillsText:'', featuresText:'', actionsText:'', spellsText:'', notes:'', collapsed:false };
}

// The computed portion of an auto card (no inputs here — this region is
// re-rendered wholesale by updateCompanionComputed on every recalc).
function companionStatsHtml(stats){
  const section = (label, rows) => (rows && rows.length)
    ? `<div class="equip-atk-head">${label}</div>` + rows.map(r=>
        `<div class="comp-line"><b>${esc(r.name)}.</b> ${esc(r.desc)}</div>`).join('')
    : '';
  const listRow = (label, val) => val ? `<div class="comp-line"><b>${label}:</b> ${esc(val)}</div>` : '';
  return `
    <div class="comp-typeline">${esc(stats.typeLine||'')}</div>
    <div class="comp-abilities">
      ${ABILITIES.map(a=>{
        const v = (stats.abilities||{})[a.key];
        return `<div class="comp-ab"><label>${a.key.toUpperCase()}</label><span>${v==null?'—':v+' ('+fmt(mod(v))+')'}</span></div>`;
      }).join('')}
    </div>
    ${listRow('AC', String(stats.ac) + (stats.acNote?` (${stats.acNote})`:''))}
    ${listRow('Max HP', String(stats.hpMax) + (stats.hpFormula?` — ${stats.hpFormula}`:''))}
    ${listRow('Speed', stats.speed)}
    ${listRow('Saves', (stats.saves||[]).join(', '))}
    ${listRow('Skills', (stats.skills||[]).join(', '))}
    ${listRow('Senses', (stats.senses||[]).join(', '))}
    ${listRow('Immunities', (stats.immunities||[]).join(', '))}
    ${listRow('Languages', stats.languages)}
    ${section('Features', stats.features)}
    ${section('Actions', stats.actions)}
    ${section('Reactions', stats.reactions)}
    ${section('Spells', stats.spells)}
    ${stats.note ? `<div class="comp-line comp-note">${esc(stats.note)}</div>` : ''}`;
}

// Editable stats region for a manual companion (bound in buildCompanions).
function companionManualHtml(c){
  const abil = c.abilities||{};
  const area = (label, field, ph) => `
    <div class="equip-atk-head">${label}</div>
    <textarea class="comp-area" data-field="${field}" rows="2" placeholder="${ph}">${esc(c[field]||'')}</textarea>`;
  return `
    <div class="comp-manual-grid">
      <div class="stat-box"><label>Type</label><input class="comp-field" data-field="typeLine" value="${esc(c.typeLine||'')}" placeholder="Medium beast"></div>
      <div class="stat-box"><label>AC</label><input class="comp-field" data-field="ac" data-num="1" type="number" value="${c.ac||0}"></div>
      <div class="stat-box"><label>Max HP</label><input class="comp-field" data-field="hpMax" data-num="1" type="number" value="${c.hpMax||0}"></div>
      <div class="stat-box"><label>Speed</label><input class="comp-field" data-field="speed" value="${esc(c.speed||'')}"></div>
    </div>
    <div class="comp-abilities">
      ${ABILITIES.map(a=>`<div class="comp-ab"><label>${a.key.toUpperCase()}</label><input class="comp-ab-input" data-ab="${a.key}" type="number" value="${abil[a.key]==null?10:abil[a.key]}"></div>`).join('')}
    </div>
    ${area('Skills','skillsText','Perception +4, Stealth +6…')}
    ${area('Features','featuresText','Keen Hearing — advantage on hearing checks…')}
    ${area('Actions','actionsText','Bite: +5 to hit, 1d6+3 piercing…')}
    ${area('Spells','spellsText','Spells it can cast, if any')}`;
}

function buildCompanions(){
  const list = document.getElementById('companionList');
  if(!list) return;
  const ctx = companionCtx();
  list.innerHTML = '';
  if(!companions().length){
    list.innerHTML = '<div class="action-empty">No companions yet — auto-generate one from your features &amp; spells, or add one manually.</div>';
    return;
  }
  companions().forEach((c,i)=>{
    const tpl = c.templateId ? companionTemplate(c.templateId) : null;
    const stats = tpl ? tpl.build(ctx) : null;
    const card = el('div','companion-card'+(c.collapsed?' collapsed':''));
    card.dataset.i = i;
    if(tpl) card.dataset.templateId = tpl.id;
    card.innerHTML = `
      <div class="comp-head">
        <button class="comp-collapse" type="button" title="${c.collapsed?'Expand':'Collapse'}">${c.collapsed?'▸':'▾'}</button>
        <input class="comp-name" value="${esc(c.name||'')}" placeholder="Companion name">
        <span class="action-badge">${tpl ? (tpl.kind==='spell'?'Spell':'Feature') : 'Manual'}</span>
        <span class="row-del comp-del" title="Remove companion">✕</span>
      </div>
      ${tpl ? `<div class="comp-src">${esc(tpl.source)}</div>` : ''}
      <div class="stat-strip comp-hp-strip">
        ${stats ? `<div class="stat-box"><label>Max HP</label><div class="computed comp-hpmax">${stats.hpMax}</div></div>` : ''}
        <div class="stat-box"><label>Current HP</label><input class="comp-field" data-field="hpCurrent" data-num="1" type="number" value="${c.hpCurrent==null?(stats?stats.hpMax:10):c.hpCurrent}"></div>
        <div class="stat-box"><label>Temp HP</label><input class="comp-field" data-field="hpTemp" data-num="1" type="number" value="${c.hpTemp||0}"></div>
      </div>
      <div class="comp-body">
        ${stats ? `<div class="comp-stats">${companionStatsHtml(stats)}</div>` : companionManualHtml(c)}
        <textarea class="comp-area comp-notes" data-field="notes" rows="2" placeholder="Notes — tricks, current orders, damage taken…">${esc(c.notes||'')}</textarea>
      </div>`;
    list.appendChild(card);

    card.querySelector('.comp-collapse').addEventListener('click', ()=>{
      c.collapsed = !c.collapsed; buildCompanions(); save();
    });
    card.querySelector('.comp-del').addEventListener('click', ()=>{
      if(!confirm(`Remove ${c.name||'this companion'}?`)) return;
      companions().splice(i,1); buildCompanions(); save();
    });
    card.querySelector('.comp-name').addEventListener('input', e=>{ c.name = e.target.value; save(); });
    card.querySelectorAll('.comp-field, .comp-area').forEach(inp=> inp.addEventListener('input', e=>{
      const f = e.target.dataset.field;
      c[f] = e.target.dataset.num ? (parseInt(e.target.value,10)||0) : e.target.value;
      save();
    }));
    card.querySelectorAll('.comp-ab-input').forEach(inp=> inp.addEventListener('input', e=>{
      if(!c.abilities) c.abilities = {};
      c.abilities[e.target.dataset.ab] = parseInt(e.target.value,10)||0;
      save();
    }));
  });
}

// Called from recalc(): refresh the computed stat regions in place (no inputs
// live inside .comp-stats, so this never steals focus mid-typing).
function updateCompanionComputed(){
  const list = document.getElementById('companionList');
  if(!list) return;
  const ctx = companionCtx();
  list.querySelectorAll('.companion-card[data-template-id]').forEach(card=>{
    const tpl = companionTemplate(card.dataset.templateId);
    if(!tpl) return;
    const stats = tpl.build(ctx);
    const hpEl = card.querySelector('.comp-hpmax');
    if(hpEl) hpEl.textContent = stats.hpMax;
    const box = card.querySelector('.comp-stats');
    if(box) box.innerHTML = companionStatsHtml(stats);
    // Scaling resource pools (e.g. Unleash Incarnation = CON mod) track the
    // template's current total; spent points are preserved.
    const c = companions()[Number(card.dataset.i)];
    if(c && Array.isArray(c.resources) && (stats.resources||[]).length){
      stats.resources.forEach(sr=>{
        const own = c.resources.find(r=>r.name===sr.name);
        if(own && own.total !== sr.total){
          own.total = sr.total;
          own.used = Math.min(own.used, own.total);
        }
      });
    }
  });
}

function addCompanionFromTemplate(tpl){
  const stats = tpl.build(companionCtx());
  companions().push({ uid:'c'+Date.now()+Math.floor(Math.random()*1000),
    templateId: tpl.id, name: tpl.name,
    hpCurrent: stats.hpMax, hpTemp: 0, notes:'', collapsed:false,
    // Limited-use abilities (Repair 3/Day…) become trackers in Resource Points.
    resources: (stats.resources||[]).map(r=>({name:r.name, total:r.total, used:0})) });
  buildCompanions(); buildActionResources(); save();
}

// The auto-generate picker. Only sources this character actually qualifies for
// are offered (matching subclass feature or known spell) — everything else can
// still be entered by hand with "+ Add companion manually", or browsed in the
// Library under the Companions filter.
function openCompanionPicker(){
  const ctx = companionCtx();
  const tmpls = companionTemplates();
  if(!tmpls.length){ alert('No companion templates loaded.'); return; }
  const avail = tmpls.filter(t=>{ try{ return t.match(ctx); }catch(e){ return false; } });
  const row = t => `
    <div class="action-row comp-pick" data-tid="${t.id}" title="Add this companion">
      <span class="a-name">${esc(t.name)}</span>
      <span class="a-detail">${esc(t.source)}</span>
      <span class="action-badge">${t.kind==='spell'?'Spell':'Feature'}</span>
    </div>`;
  const win = openNotesModal({
    name:'Auto-generate a Companion',
    badges:['Companions'],
    detail: `
      <p>Companions scale with your level, proficiency bonus, and spellcasting — their stat blocks update automatically as your character grows.</p>
      ${avail.length
        ? '<div class="equip-atk-head">From your features &amp; spells</div>' + avail.map(row).join('')
        : '<p class="nr-hint">No companion-granting feature or known spell detected on this character. Pick a qualifying subclass (e.g. Battle Smith) or learn a summoning spell — or add one manually. Browse all companion sources in the <span class="hl">Library</span>.</p>'}`
  });
  if(win) win.el.querySelectorAll('.comp-pick').forEach(r=> r.addEventListener('click', ()=>{
    const tpl = companionTemplate(r.dataset.tid);
    if(tpl){ addCompanionFromTemplate(tpl); nrCloseWindow(win); }
  }));
}

function openCompanionLegend(){
  openNotesModal({
    name:'Companions — How it works',
    badges:['Reference'],
    detail: `
      <p>Creatures that fight alongside you. <span class="hl">Auto-generate</span> scans your class features and known spells for anything that grants a scaling companion (a Battle Smith's Steel Defender, a Homunculus Servant, the Tasha's summon spells…) and builds its mini character sheet — skills, health, features, actions — from your current level. It re-scales automatically when you level up.</p>
      <p class="nr-hint"><span class="hl">Manual</span> companions are free-form: fill in any creature's numbers yourself. Current/Temp HP and notes are always yours to track either way.</p>`
  });
}

function bindCompanionButtons(){
  const auto = document.getElementById('autoCompanionBtn');
  if(auto) auto.addEventListener('click', openCompanionPicker);
  const add = document.getElementById('addCompanionBtn');
  if(add) add.addEventListener('click', ()=>{ companions().push(newManualCompanion()); buildCompanions(); save(); });
  document.querySelectorAll('.companion-legend-btn').forEach(btn=>
    btn.addEventListener('click', e=>{ e.stopPropagation(); openCompanionLegend(); }));
}

// A spell casts as a reaction if its imported casting time or tags say so, or
// (for built-ins) its SPELL_DETAILS summary leads with "Reaction".
function isReactionSpell(s){
  if(Array.isArray(s.tags) && s.tags.some(t=>/^reaction$/i.test(t))) return true;
  const imp = CUSTOM_SPELLS[s.name];
  if(imp) return /reaction/i.test(imp.castingTime||'') || (imp.tags||[]).some(t=>/^reaction$/i.test(t));
  const det = SPELL_DETAILS[s.name];
  return !!(det && /^reaction\b/i.test(det.desc||''));
}

function buildActions(){
  const spellsEl0 = document.getElementById('actSpells');
  if(!spellsEl0) return;
  // The Attacks panel on this tab holds the editable attack table (buildAttacks)
  // plus the equipped-gear mirror (buildEquipAttackList) — nothing to do here.

  // Reaction spells & class abilities are pulled out of their parent panels
  // and gathered under the Reactions sub-category below.
  const reactions = [];

  const spellsEl = document.getElementById('actSpells');
  const known = state.knownSpells.map(s=>({name:s.name, level:s.level, tags:s.tags, from:null}));
  const combined = [...known, ...equipmentGrantedSpells()];
  const reactionSpells = combined.filter(isReactionSpell);
  const actionSpells = combined.filter(s=>!isReactionSpell(s));
  reactionSpells.forEach(s=> reactions.push({
    name: s.name,
    level: s.level,
    detail: s.level===0 ? 'Cantrip' : levelLabel(s.level),
    badge: s.from ? 'Item spell' : 'Spell',
    kind: 'spell',
    from: s.from
  }));
  if(actionSpells.length===0){
    spellsEl.innerHTML = '<div class="action-empty">No known spells — add some on the Spells tab or equip an item that grants spells.</div>';
  } else {
    const sorted = actionSpells.sort((a,b)=> a.level-b.level || a.name.localeCompare(b.name));
    spellsEl.innerHTML = sorted.map(s=>{
      const src = s.from ? ` <span class="chip-abbr">${esc(s.from)}</span>` : '';
      const attrs = `class="action-row spell-info" data-name="${esc(s.name)}" data-level="${s.level}" title="Click for full details"`;
      const marks = spellRowMarkers(s.name);
      if(s.from){
        return `<div ${attrs}>
          <span class="a-name spell-name-link">${esc(s.name)}${src}${marks}</span>
          <span class="a-detail">${s.level===0?'Cantrip':levelLabel(s.level)}</span>
          <span class="action-badge">Item</span>
        </div>`;
      }
      if(s.level===0){
        return `<div ${attrs}>
          <span class="a-name spell-name-link">${esc(s.name)}${marks}</span>
          <span class="a-detail">Cantrip</span>
          <span class="action-badge">At will</span>
        </div>`;
      }
      const remaining = slotsRemainingAtOrAbove(s.level);
      const ok = remaining>0;
      return `<div ${attrs}>
        <span class="a-name spell-name-link">${esc(s.name)}${marks}</span>
        <span class="a-detail">${levelLabel(s.level)}${ok ? ` — ${remaining} slot${remaining===1?'':'s'} usable` : ''}</span>
        <span class="action-badge ${ok?'':'dim'}">${ok?'Castable':'No slots'}</span>
      </div>`;
    }).join('') + spellLegendHtml();
  }

  const classEl = document.getElementById('actClassAbilities');
  const picked = pickedClasses();
  const abilities = picked.flatMap(entry=>{
    const lvl = entry.level||1;
    const fromClass = (CLASS_DATA[entry.name].features||[])
      .filter(f=>f.lv<=lvl && f.use && f.use!=='passive')
      .map(f=>({...f, cls:entry.name}));
    const sc = entry.subclass && SUBCLASS_DATA[subKey(entry.name, entry.subclass)];
    const fromSub = (sc && sc.features || [])
      .filter(f=>f.lv<=lvl && f.use && f.use!=='passive')
      .map(f=>({...f, cls:entry.subclass}));
    return [...fromClass, ...fromSub];
  });
  const showCls = f => picked.length>1 || f.cls!==picked[0].name;
  const reactionAbilities = abilities.filter(f=>f.use==='reaction');
  const actionAbilities = abilities.filter(f=>f.use!=='reaction');
  reactionAbilities.forEach(f=> reactions.push({
    name: f.name,
    cls: showCls(f) ? f.cls : null,
    detail: f.desc||'',
    badge: f.cost || 'Reaction',
    kind: 'ability'
  }));
  classEl.innerHTML = actionAbilities.length ? actionAbilities.map(f=>`
    <div class="action-row">
      <span class="a-name">${esc(f.name)}${showCls(f)?` <span class="chip-abbr">${esc(f.cls)}</span>`:''}</span>
      <span class="a-detail">${esc(f.desc||'')}</span>
      <span class="action-badge">${esc(f.use)}${f.cost?' · '+esc(f.cost):''}</span>
    </div>`).join('')
    : '<div class="action-empty">No class ability data — pick a class with a detailed feature reference (e.g. Jaeger) in Settings.</div>';

  const itemsEl = document.getElementById('actItems');
  const isUsableName = n=> n && USABLE_ITEM_WORDS.some(w=> n.toLowerCase().includes(w));
  const usable = [
    ...state.inventory.filter(i=> i.qty>0 && isUsableName(i.name)),
    ...equipList().filter(it=> isUsableName(it.name)).map(it=>({name:it.name, qty:1}))
  ];
  itemsEl.innerHTML = usable.length ? usable.map(i=>`
    <div class="action-row">
      <span class="a-name">${i.name}</span>
      <span class="a-detail">×${i.qty}</span>
      <span class="action-badge">Use item</span>
    </div>`).join('')
    : '<div class="action-empty">No usable items in your inventory (potions, scrolls, kits…).</div>';

  document.getElementById('actStandard').innerHTML = STANDARD_ACTIONS.map(a=>`
    <div class="action-row">
      <span class="a-name">${a.name}</span>
      <span class="a-detail">${a.desc}</span>
    </div>`).join('');

  // Companion actions mirror the character's list: one sub-section per
  // companion, rows from its computed stat block (auto) or free text (manual).
  const compEl = document.getElementById('actCompanions');
  if(compEl){
    const ctx = companionCtx();
    const sections = companions().map(c=>{
      const tpl = c.templateId ? companionTemplate(c.templateId) : null;
      let rows = [];
      if(tpl){
        const stats = tpl.build(ctx);
        rows = [
          ...(stats.actions||[]).map(a=>({...a, badge:'Action'})),
          ...(stats.reactions||[]).map(a=>({...a, badge:'Reaction'}))
        ];
      } else {
        // Manual companions: one row per non-empty line of the Actions text.
        rows = (c.actionsText||'').split('\n').map(s=>s.trim()).filter(Boolean)
          .map(line=>{
            const m = line.match(/^([^:.]{1,40})[:.]\s*(.*)$/); // "Bite: +5 to hit…"
            return { name: m?m[1]:line, desc: m?m[2]:'', badge:'Action' };
          });
      }
      if(!rows.length) return '';
      return `<div class="equip-atk-head">${esc(c.name||'Companion')}</div>` + rows.map(a=>`
        <div class="action-row">
          <span class="a-name">${esc(a.name)}</span>
          <span class="a-detail">${esc(a.desc||'')}</span>
          <span class="action-badge">${esc(a.badge)}</span>
        </div>`).join('');
    }).filter(Boolean);
    compEl.innerHTML = sections.length ? sections.join('')
      : '<div class="action-empty">No companions — add one on the Character tab and its actions appear here.</div>';
  }

  const reactionsEl = document.getElementById('actReactions');
  if(reactionsEl){
    reactions.sort((a,b)=> a.name.localeCompare(b.name));
    reactionsEl.innerHTML = reactions.length ? reactions.map(r=>{
      const isSpell = r.kind==='spell';
      const attrs = isSpell
        ? `class="action-row spell-info" data-name="${esc(r.name)}" data-level="${r.level}" title="Click for full details"`
        : 'class="action-row"';
      return `
      <div ${attrs}>
        <span class="a-name${isSpell?' spell-name-link':''}">${esc(r.name)}${r.cls?` <span class="chip-abbr">${esc(r.cls)}</span>`:''}${isSpell?spellRowMarkers(r.name):''}</span>
        <span class="a-detail">${esc(r.detail||'')}</span>
        <span class="action-badge">${esc(r.badge)}</span>
      </div>`;
    }).join('')
      : '<div class="action-empty">No reactions — reaction spells (e.g. Shield, Counterspell) and reaction class abilities appear here.</div>';
  }

  // Whole-row click opens the shared spell detail popup (Spells-tab parity).
  document.querySelectorAll('#actSpells .spell-info, #actReactions .spell-info').forEach(el=>{
    el.addEventListener('click', ()=> openSpellDetail(el.dataset.name, parseInt(el.dataset.level)));
  });

  buildActionResources();
}

// Spell slots surface as auto trackers at the top of Resource Points, synced
// with the Spells tab: totals are managed there (auto-filled from class levels
// or manual), and clicking a pip here spends or restores that actual slot.
function spellSlotResourceRows(){
  const rows = [];
  (state.spellSlots||[]).forEach((s,i)=>{
    if(s && s.total>0) rows.push({ key:String(i), label:'Level '+(i+1)+' Slots', total:s.total, used:s.used });
  });
  if(state.pactSlots && state.pactSlots.total>0){
    rows.push({ key:'pact', label:'Pact Slots · Lv '+state.pactSlots.level, total:state.pactSlots.total, used:state.pactSlots.used });
  }
  return rows;
}

// A resource list by owner key: 'char' is the character's freeform pools,
// a numeric key is the matching companion's pools.
function resourceOwnerList(key){
  if(key==='char') return state.actionResources || (state.actionResources = []);
  const c = companions()[Number(key)];
  if(!c) return [];
  return c.resources || (c.resources = []);
}

// The spend/restore widget for one pool. Up to 10 points it's clickable pips;
// above 10 it's a "remaining/total" counter with − (spend) and + (restore).
function resourceMeterHtml(total, used, attrs){
  if(total<=10){
    let pips='';
    for(let p=0;p<total;p++) pips += `<span class="res-pip ${p<used?'filled':''}" ${attrs} data-p="${p}"></span>`;
    return `<div class="res-pips">${pips || '<span class="res-none">— no points —</span>'}</div>`;
  }
  return `<div class="res-counter">
    <button class="res-step" ${attrs} data-d="1" title="Spend a point" aria-label="Spend a point">−</button>
    <span class="res-count-num">${total-used}/${total}</span>
    <button class="res-step" ${attrs} data-d="-1" title="Restore a point" aria-label="Restore a point">+</button>
  </div>`;
}

// Resource Points on the Actions tab: auto spell-slot rows, companion pools
// (seeded from limited-use companion abilities like Repair 3/Day), and the
// player's freeform pools. Rows are added/edited through a popup
// (openResourceModal) that asks for a name and a max.
function buildActionResources(){
  const body = document.getElementById('actResources');
  if(!body) return;
  const slotRows = spellSlotResourceRows();

  const autoHtml = slotRows.map(r=>{
    let pips='';
    for(let p=0;p<r.total;p++) pips += `<span class="res-slot-pip ${p<r.used?'filled':''}" data-key="${r.key}" data-p="${p}"></span>`;
    return `<tr class="res-row res-row-auto">
      <td><span class="res-auto-name">${esc(r.label)}</span><span class="res-auto-tag" title="Auto from your spell slots — set totals on the Spells tab">auto</span></td>
      <td>
        <div class="res-pip-cell">
          <div class="res-pips">${pips}</div>
          <div class="res-controls"><span class="res-count">${r.total-r.used} left</span></div>
        </div>
      </td>
    </tr>`;
  }).join('');

  // A sub-divider row labelling which sheet the pools beneath it belong to.
  const groupRow = label =>
    `<tr class="res-group-row"><td colspan="2"><span class="res-group-label">${esc(label)}</span></td></tr>`;

  const poolRow = (ownerKey, i, r) => `<tr class="res-row">
      <td><span class="res-auto-name">${esc(r.name||'—')}</span></td>
      <td>
        <div class="res-pip-cell">
          ${resourceMeterHtml(r.total, r.used, `data-o="${ownerKey}" data-i="${i}"`)}
          <div class="res-controls">
            <button class="res-adj res-edit" data-o="${ownerKey}" data-i="${i}" title="Edit name & max" aria-label="Edit resource">✎</button>
            <span class="row-del res-del" data-o="${ownerKey}" data-i="${i}" title="Delete row">✕</span>
          </div>
        </div>
      </td>
    </tr>`;

  const charList = resourceOwnerList('char');
  // Group the table under owner sub-dividers: spell slots, then the character's
  // own pools, then one section per companion that has resources.
  const groups = [];
  if(slotRows.length) groups.push(groupRow('Spell Slots') + autoHtml);
  if(charList.length) groups.push(groupRow('Character') + charList.map((r,i)=> poolRow('char', i, r)).join(''));
  companions().forEach((c,ci)=>{
    const rows = c.resources||[];
    if(rows.length) groups.push(groupRow(c.name||('Companion '+(ci+1))) + rows.map((r,ri)=> poolRow(String(ci), ri, r)).join(''));
  });

  body.innerHTML = groups.length
    ? groups.join('')
    : `<tr><td colspan="2" class="res-empty">No trackers yet — spell slots appear here automatically once you have them; add other pools (Ki, Sorcery Points…) with the button below.</td></tr>`;

  // Auto spell-slot pips write straight back to the real slot state and keep the
  // Spells tab in sync.
  body.querySelectorAll('.res-slot-pip').forEach(pip=> pip.addEventListener('click', e=>{
    const key = e.target.dataset.key, p = +e.target.dataset.p;
    const slot = key==='pact' ? state.pactSlots : state.spellSlots[key];
    if(!slot) return;
    slot.used = (p < slot.used) ? p : p+1;
    buildActionResources(); buildSpellSlots(); save();
  }));

  body.querySelectorAll('.res-pip').forEach(pip=> pip.addEventListener('click', e=>{
    const r = resourceOwnerList(e.target.dataset.o)[+e.target.dataset.i];
    if(!r) return;
    const p = +e.target.dataset.p;
    // Click a filled pip to free it and everything after; an empty pip fills up to it.
    r.used = (p < r.used) ? p : p+1;
    buildActionResources(); save();
  }));
  body.querySelectorAll('.res-step').forEach(btn=> btn.addEventListener('click', e=>{
    const t = e.currentTarget;
    const r = resourceOwnerList(t.dataset.o)[+t.dataset.i];
    if(!r) return;
    r.used = Math.max(0, Math.min(r.total, r.used + Number(t.dataset.d)));
    buildActionResources(); save();
  }));
  body.querySelectorAll('.res-edit').forEach(btn=> btn.addEventListener('click', e=>{
    const t = e.currentTarget;
    openResourceModal({ owner: t.dataset.o, index: +t.dataset.i });
  }));
  body.querySelectorAll('.res-del').forEach(x=> x.addEventListener('click', e=>{
    const t = e.currentTarget;
    resourceOwnerList(t.dataset.o).splice(+t.dataset.i, 1);
    buildActionResources(); save();
  }));
}

// Add/edit popup for a resource pool: name + max points, and (when companions
// exist) which sheet the pool belongs to.
function openResourceModal(edit){
  const comps = companions();
  const owners = [{key:'char', label:'Character'}]
    .concat(comps.map((c,ci)=>({key:String(ci), label: c.name||('Companion '+(ci+1))})));
  const cur = edit ? resourceOwnerList(edit.owner)[edit.index] : null;
  if(edit && !cur) return;
  const win = openNotesModal({
    name: cur ? 'Edit Resource' : 'Add Resource',
    badges: ['Resource Points'],
    detail: `
      <div class="res-form">
        <label>Name</label>
        <input id="resFormName" placeholder="Ki, Sorcery Points, Repair…" value="${esc(cur?cur.name:'')}">
        <label>Max points</label>
        <input id="resFormMax" type="number" min="1" max="99" value="${cur?cur.total:3}">
        ${owners.length>1 ? `<label>Belongs to</label>
        <select id="resFormOwner">${owners.map(o=>`<option value="${o.key}" ${(edit?edit.owner:'char')===o.key?'selected':''}>${esc(o.label)}</option>`).join('')}</select>` : ''}
        <p class="nr-hint">Pools of more than <span class="hl">10</span> points show as a <span class="hl">11/11</span> counter with − / + instead of pips.</p>
        <button class="add-btn" id="resFormSave">${cur?'Save changes':'Add resource'}</button>
      </div>`
  });
  if(!win) return;
  const nameEl = win.el.querySelector('#resFormName');
  const maxEl = win.el.querySelector('#resFormMax');
  nameEl.focus();
  const submit = ()=>{
    const name = nameEl.value.trim();
    if(!name){ nameEl.focus(); return; }
    const total = Math.max(1, Math.min(99, parseInt(maxEl.value,10)||1));
    const ownerSel = win.el.querySelector('#resFormOwner');
    const ownerKey = ownerSel ? ownerSel.value : 'char';
    if(cur){
      cur.name = name; cur.total = total; cur.used = Math.min(cur.used, total);
      if(ownerKey !== edit.owner){
        resourceOwnerList(edit.owner).splice(edit.index, 1);
        resourceOwnerList(ownerKey).push(cur);
      }
    } else {
      resourceOwnerList(ownerKey).push({ name, total, used:0 });
    }
    buildActionResources(); save();
    nrCloseWindow(win);
  };
  win.el.querySelector('#resFormSave').addEventListener('click', submit);
  [nameEl, maxEl].forEach(inp=> inp.addEventListener('keydown', e=>{ if(e.key==='Enter') submit(); }));
}

function bindTabs(){
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.toggle('active', b===btn));
      document.querySelectorAll('.tab-pane').forEach(p=>p.classList.toggle('active', p.id==='tab-'+btn.dataset.tab));
      // Rebuild on entry so the list reflects edits made on the other tabs.
      if(btn.dataset.tab==='actions') buildActions();
      if(btn.dataset.tab==='journal' && window.characterSheetApp.buildJournal) window.characterSheetApp.buildJournal();
      // Feature choices are pickable on both of these tabs — rebuild so each
      // shows what the other one chose.
      if(btn.dataset.tab==='features') refreshFeatureLists();
      if(btn.dataset.tab==='settings') buildClassList();
    });
  });
}

// ---------- Sidebar navigation drawer ----------
// Shared by every page (partials/sidebar.html): ☰ opens it, backdrop click or
// Escape hides it away. The current page's link is highlighted via PAGE.
function bindSidebar(){
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebarToggle');
  const backdrop = document.getElementById('sidebarBackdrop');
  if(!sidebar || !toggle) return;
  const setOpen = open=>{
    sidebar.classList.toggle('open', open);
    if(backdrop) backdrop.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  toggle.addEventListener('click', ()=> setOpen(!sidebar.classList.contains('open')));
  if(backdrop) backdrop.addEventListener('click', ()=> setOpen(false));
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') setOpen(false); });
  const current = sidebar.querySelector(`.side-link[data-page="${PAGE}"]`);
  if(current) current.classList.add('active');
  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn) logoutBtn.addEventListener('click', async ()=>{
    await fetch('/api/auth/logout', { method:'POST' });
    location.href = '/login';
  });
}

// ---------- Options menu & themes ----------
// Named themes (dark/light/ember) swap the CSS-variable blocks in styles.css
// via body[data-theme]; the custom theme writes derived variables inline on
// :root. Selection persists in localStorage.
function closeOptionsMenu(){
  const menu = document.getElementById('optionsMenu');
  const btn = document.getElementById('optionsBtn');
  if(!menu || !btn) return;
  menu.classList.remove('open');
  btn.classList.remove('active');
  btn.setAttribute('aria-expanded','false');
  menu.setAttribute('aria-hidden','true');
}

function toggleOptionsMenu(){
  const menu = document.getElementById('optionsMenu');
  const btn = document.getElementById('optionsBtn');
  if(!menu || !btn) return;
  const willOpen = !menu.classList.contains('open');
  menu.classList.toggle('open', willOpen);
  btn.classList.toggle('active', willOpen);
  btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  menu.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
}

function hexToRgb(hex){
  const trimmed = hex.replace('#','');
  const value = trimmed.length===3 ? trimmed.split('').map(ch=>ch+ch).join('') : trimmed;
  const num = parseInt(value, 16);
  return { r:(num>>16)&255, g:(num>>8)&255, b:num&255 };
}

function rgbToHex(r,g,b){
  const clamp = v=> Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [clamp(r), clamp(g), clamp(b)].map(v=> v.toString(16).padStart(2,'0')).join('');
}

function mixHex(hexA, hexB, amount){
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const mix = (x,y) => x + (y-x)*amount;
  return rgbToHex(mix(a.r,b.r), mix(a.g,b.g), mix(a.b,b.b));
}

function alphaHex(hex, alpha){
  const {r,g,b}=hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getDefaultCustomTheme(){
  return {
    accent:'#00ffd5',
    accent2:'#ff2a6d',
    surface:'#12141d',
    text:'#c8c8d4',
    background:'#0a0a0f'
  };
}

function getStoredCustomTheme(){
  try {
    const stored = JSON.parse(localStorage.getItem('characterSheetCustomTheme') || 'null');
    return stored || getDefaultCustomTheme();
  } catch (e) { return getDefaultCustomTheme(); }
}

const CUSTOM_THEME_VARS = ['--void','--void-2','--void-3','--neon-cyan','--neon-magenta','--ink','--ink-dim','--ink-soft','--parchment','--parchment-2','--parchment-line','--gold','--gold-bright','--crimson','--crimson-bright','--border-glow','--shadow','--dark-panel'];

function applyCustomTheme(theme){
  const t = theme || getStoredCustomTheme();
  const accent = t.accent || '#00ffd5';
  const accent2 = t.accent2 || '#ff2a6d';
  const surface = t.surface || '#12141d';
  const text = t.text || '#c8c8d4';
  const background = t.background || '#0a0a0f';
  const root = document.documentElement;
  root.style.setProperty('--void', background);
  root.style.setProperty('--void-2', mixHex(background, surface, 0.22));
  root.style.setProperty('--void-3', mixHex(background, surface, 0.38));
  root.style.setProperty('--neon-cyan', accent);
  root.style.setProperty('--neon-magenta', accent2);
  root.style.setProperty('--ink', text);
  root.style.setProperty('--ink-dim', alphaHex(text, 0.5));
  root.style.setProperty('--ink-soft', alphaHex(text, 0.72));
  root.style.setProperty('--parchment', surface);
  root.style.setProperty('--parchment-2', mixHex(surface, background, 0.18));
  root.style.setProperty('--parchment-line', alphaHex(accent, 0.18));
  root.style.setProperty('--gold', accent);
  root.style.setProperty('--gold-bright', mixHex(accent, '#ffffff', 0.34));
  root.style.setProperty('--crimson', accent2);
  root.style.setProperty('--crimson-bright', mixHex(accent2, '#ffffff', 0.34));
  root.style.setProperty('--border-glow', alphaHex(accent, 0.35));
  root.style.setProperty('--shadow', `0 0 0 1px ${alphaHex(accent, 0.08)}, 0 0 18px ${alphaHex(accent, 0.06)}`);
  root.style.setProperty('--dark-panel', mixHex(surface, '#ffffff', 0.07));
  document.body.dataset.theme = 'custom';
}

function updateCustomControls(theme){
  const controls = document.getElementById('customThemeControls');
  if(!controls) return;
  controls.classList.toggle('open', theme === 'custom');
  const values = theme === 'custom' ? getStoredCustomTheme() : getDefaultCustomTheme();
  document.getElementById('customAccent').value = values.accent;
  document.getElementById('customAccent2').value = values.accent2;
  document.getElementById('customSurface').value = values.surface;
  document.getElementById('customText').value = values.text;
  document.getElementById('customBackground').value = values.background;
}

function applyTheme(theme){
  document.querySelectorAll('.theme-option').forEach(btn=>{
    btn.classList.toggle('active', btn.dataset.theme===theme);
  });
  if(theme === 'custom'){
    applyCustomTheme(getStoredCustomTheme());
  } else {
    document.body.dataset.theme = theme;
    if(theme === 'dark') document.body.removeAttribute('data-theme');
    CUSTOM_THEME_VARS.forEach(v=> document.documentElement.style.removeProperty(v));
  }
  updateCustomControls(theme);
  localStorage.setItem('characterSheetTheme', theme);
}

function initTheme(){
  const saved = localStorage.getItem('characterSheetTheme') || 'dark';
  applyTheme(saved);
}

function bindOptionsMenu(){
  const optionsBtn = document.getElementById('optionsBtn');
  if(optionsBtn){ optionsBtn.addEventListener('click', e=>{ e.stopPropagation(); toggleOptionsMenu(); }); }
  document.querySelectorAll('.theme-option').forEach(btn=>btn.addEventListener('click', ()=>{
    applyTheme(btn.dataset.theme);
    if(btn.dataset.theme !== 'custom') closeOptionsMenu();
  }));
  const fieldByInput = { customAccent:'accent', customAccent2:'accent2', customSurface:'surface', customText:'text', customBackground:'background' };
  Object.keys(fieldByInput).forEach(id=>{
    const input = document.getElementById(id);
    if(!input) return;
    input.addEventListener('input', ()=>{
      const current = getStoredCustomTheme();
      current[fieldByInput[id]] = input.value;
      localStorage.setItem('characterSheetCustomTheme', JSON.stringify(current));
      localStorage.setItem('characterSheetTheme', 'custom');
      applyCustomTheme(current);
      document.querySelectorAll('.theme-option').forEach(btn=> btn.classList.toggle('active', btn.dataset.theme==='custom'));
    });
  });
  document.addEventListener('click', e=>{ if(!e.target.closest('.options-shell')) closeOptionsMenu(); });
}

function recalc(){
  const pb = profBonus(state.level);
  document.getElementById('profBonusDisplay').textContent = fmt(pb);
  const pbSkills = document.getElementById('profBonusSkills');
  if(pbSkills) pbSkills.textContent = fmt(pb);
  document.getElementById('sealLevel').textContent = state.level;

  // Effective scores fold in bonuses/overrides from equipped gear.
  const eff = effectiveAbilities();
  ABILITIES.forEach(a=>{
    const base = state.abilities[a.key]||0;
    const m = mod(eff[a.key]);
    const badge = document.getElementById('modBadge_'+a.key);
    badge.textContent = fmt(m);
    const diff = eff[a.key] - base;
    badge.classList.toggle('buffed', diff>0);
    badge.classList.toggle('nerfed', diff<0);
    badge.title = diff ? `${a.key.toUpperCase()} ${eff[a.key]} (base ${base}, gear ${fmt(diff)})` : '';
    const saveBonus = m + (state.saveProf[a.key] ? pb : 0);
    document.getElementById('saveBonus_'+a.key).textContent = fmt(saveBonus);
  });

  SKILLS.forEach((s,i)=>{
    const key = 'sk'+i;
    const m = mod(eff[s.ability]);
    const bonus = m + (skillProficient(i) ? pb : 0) + equipSkillBonus(s.name);
    const elBonus = document.getElementById('skillBonus_'+key);
    if(elBonus) elBonus.textContent = fmt(bonus);
    // Passive senses on the Skills tab: 10 + the skill's bonus.
    if(s.name==='Perception'||s.name==='Investigation'||s.name==='Insight'){
      const pEl = document.getElementById('passive'+s.name);
      if(pEl) pEl.textContent = 10 + bonus;
    }
  });

  document.getElementById('statInit').textContent = fmt(mod(eff.dex));

  const acInfo = computeAC();
  const acEl = document.getElementById('acComputedDisplay');
  if(acEl){
    acEl.textContent = acInfo.ac;
    document.getElementById('acBreakdown').textContent =
      (acInfo.usedArmor ? `armor ${acInfo.armorBase}` : `10 + DEX ${fmt(acInfo.dexMod)}`)
      + (acInfo.adds ? ` + gear ${fmt(acInfo.adds)}` : '');
  }

  state.deathSuccess.forEach((v,i)=>{
    const p = document.querySelector(`.pip.success[data-idx="${i}"]`);
    if(p) p.classList.toggle('filled', v);
  });
  state.deathFail.forEach((v,i)=>{
    const p = document.querySelector(`.pip.fail[data-idx="${i}"]`);
    if(p) p.classList.toggle('filled', v);
  });

  updateCompanionComputed(); // companion stat blocks scale with level/abilities
  updateHero();
}

function bindStaticInputs(){
  const bind = (id, prop, isNum) => {
    const e = document.getElementById(id);
    e.addEventListener('input', ()=>{
      state[prop] = isNum ? (parseFloat(e.value)||0) : e.value;
      recalc(); save();
    });
  };
  bind('charName','name');
  bind('charAlignment','alignment'); // charRace / charBackground handled by buildSpeciesSelect / buildBackgroundSelect
  bind('charXP','xp',true);
  document.getElementById('addClassBtn').addEventListener('click', ()=>{
    ensureClasses();
    state.classes.push({name:'', level:1});
    buildClassList();
  });
  bind('statAC','ac',true); bind('statSpeed','speed',true);
  const addAtk = document.getElementById('addAttack'); // Actions tab: manual attack rows
  if(addAtk) addAtk.addEventListener('click', ()=>{
    state.attacks.push({name:'',bonus:'',dmg:''});
    buildAttacks(); save();
  });
  bindCompanionButtons(); // Character tab: auto-generate / add companion
  bind('hpMax','hpMax',true); bind('hpCurrent','hpCurrent',true); bind('hpTemp','hpTemp',true);
  bind('hitDice','hitDice');
  bind('persTraits','persTraits'); bind('persIdeals','persIdeals');
  bind('persBonds','persBonds'); bind('persFlaws','persFlaws');

  document.getElementById('spellSearch').addEventListener('input', ()=> buildSpellLibrary());
  document.getElementById('cCP').addEventListener('input', e=>{state.currency.cp=parseInt(e.target.value)||0; save();});
  document.getElementById('cSP').addEventListener('input', e=>{state.currency.sp=parseInt(e.target.value)||0; save();});
  document.getElementById('cEP').addEventListener('input', e=>{state.currency.ep=parseInt(e.target.value)||0; save();});
  document.getElementById('cGP').addEventListener('input', e=>{state.currency.gp=parseInt(e.target.value)||0; save();});
  document.getElementById('cPP').addEventListener('input', e=>{state.currency.pp=parseInt(e.target.value)||0; save();});

  document.querySelectorAll('.pip.success').forEach(p=>{
    p.addEventListener('click', e=>{
      const i = parseInt(e.target.dataset.idx);
      state.deathSuccess[i] = !state.deathSuccess[i];
      recalc(); save();
    });
  });
  document.querySelectorAll('.pip.fail').forEach(p=>{
    p.addEventListener('click', e=>{
      const i = parseInt(e.target.dataset.idx);
      state.deathFail[i] = !state.deathFail[i];
      recalc(); save();
    });
  });

}

function applyStateToInputs(){
  document.getElementById('charName').value = state.name;
  document.getElementById('charRace').value = state.race;
  document.getElementById('charBackground').value = state.background;
  document.getElementById('charAlignment').value = state.alignment;
  document.getElementById('charXP').value = state.xp;
  document.getElementById('statAC').value = state.ac;
  document.getElementById('statSpeed').value = state.speed;
  document.getElementById('hpMax').value = state.hpMax;
  document.getElementById('hpCurrent').value = state.hpCurrent;
  document.getElementById('hpTemp').value = state.hpTemp;
  document.getElementById('hitDice').value = state.hitDice;
  document.getElementById('persTraits').value = state.persTraits;
  document.getElementById('persIdeals').value = state.persIdeals;
  document.getElementById('persBonds').value = state.persBonds;
  document.getElementById('persFlaws').value = state.persFlaws;
  document.getElementById('cCP').value = state.currency.cp;
  document.getElementById('cSP').value = state.currency.sp;
  document.getElementById('cEP').value = state.currency.ep;
  document.getElementById('cGP').value = state.currency.gp;
  document.getElementById('cPP').value = state.currency.pp;
}

// ---------- API helpers ----------
// A 401 means the login cookie expired mid-session — bounce to the sign-in
// page instead of letting callers choke on an error payload.
function apiGuard(r){
  if(r.status===401){ location.href='/login'; throw new Error('Not signed in'); }
  return r;
}
async function apiListCharacters(){
  const r = apiGuard(await fetch('/api/characters'));
  return r.json();
}
async function apiGetCharacter(id){
  const r = apiGuard(await fetch('/api/characters/'+id));
  if(!r.ok){
    const body = await r.json().catch(()=>({}));
    throw new Error(body.error || 'Could not load character');
  }
  return r.json();
}
async function apiCreateCharacter(name, data){
  const r = await fetch('/api/characters', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name, data })
  });
  return r.json();
}
async function apiUpdateCharacter(id, name, data){
  const r = await fetch('/api/characters/'+id, {
    method:'PUT', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ name, data })
  });
  return r.json();
}
async function apiDuplicateCharacter(id){
  const r = await fetch(`/api/characters/${id}/duplicate`, { method:'POST' });
  return r.json();
}
async function apiDeleteCharacter(id){
  const r = await fetch('/api/characters/'+id, { method:'DELETE' });
  return r.json();
}
async function apiListClasses(){
  const r = await fetch('/api/classes');
  return r.json();
}
async function apiImportClass(payload){
  const r = await fetch('/api/classes', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!r.ok){ const e = await r.json().catch(()=>({})); throw new Error(e.error||('HTTP '+r.status)); }
  return r.json();
}
async function apiDeleteClass(id){
  const r = await fetch('/api/classes/'+id, { method:'DELETE' });
  return r.json();
}
async function apiListSpecies(){
  const r = await fetch('/api/species');
  return r.json();
}
async function apiImportSpecies(payload){
  const r = await fetch('/api/species', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!r.ok){ const e = await r.json().catch(()=>({})); throw new Error(e.error||('HTTP '+r.status)); }
  return r.json();
}
async function apiDeleteSpecies(id){
  const r = await fetch('/api/species/'+id, { method:'DELETE' });
  return r.json();
}
async function apiListBackgrounds(){
  const r = await fetch('/api/backgrounds');
  return r.json();
}
async function apiImportBackground(payload){
  const r = await fetch('/api/backgrounds', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!r.ok){ const e = await r.json().catch(()=>({})); throw new Error(e.error||('HTTP '+r.status)); }
  return r.json();
}
async function apiDeleteBackground(id){
  const r = await fetch('/api/backgrounds/'+id, { method:'DELETE' });
  return r.json();
}
async function apiListSubclasses(){
  const r = await fetch('/api/subclasses');
  return r.json();
}
async function apiImportSubclass(payload){
  const r = await fetch('/api/subclasses', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!r.ok){ const e = await r.json().catch(()=>({})); throw new Error(e.error||('HTTP '+r.status)); }
  return r.json();
}
async function apiDeleteSubclass(id){
  const r = await fetch('/api/subclasses/'+id, { method:'DELETE' });
  return r.json();
}
async function apiListSubspecies(){
  const r = await fetch('/api/subspecies');
  return r.json();
}
async function apiImportSubspecies(payload){
  const r = await fetch('/api/subspecies', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!r.ok){ const e = await r.json().catch(()=>({})); throw new Error(e.error||('HTTP '+r.status)); }
  return r.json();
}
async function apiDeleteSubspecies(id){
  const r = await fetch('/api/subspecies/'+id, { method:'DELETE' });
  return r.json();
}
async function apiListSpells(){
  const r = await fetch('/api/spells');
  return r.json();
}
async function apiImportSpell(payload){
  const r = await fetch('/api/spells', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  if(!r.ok){ const e = await r.json().catch(()=>({})); throw new Error(e.error||('HTTP '+r.status)); }
  return r.json();
}
async function apiDeleteSpell(id){
  const r = await fetch('/api/spells/'+id, { method:'DELETE' });
  return r.json();
}

// ---------- Custom class import ----------
// Merge server-stored custom classes into CLASS_DATA. Called at startup and
// after any import/delete so the dropdowns and cards stay in sync.
// Drop a custom entry from an in-memory registry, restoring the built-in
// definition if the custom one was shadowing it.
function restoreOrDelete(registry, builtins, name){
  if(builtins[name]) registry[name] = JSON.parse(JSON.stringify(builtins[name]));
  else delete registry[name];
}

async function loadCustomClasses(){
  let list = [];
  try { list = await apiListClasses(); } catch(e){ return; }
  Object.keys(CLASS_DATA).forEach(n=>{ if(CLASS_DATA[n].custom) restoreOrDelete(CLASS_DATA, BUILTIN_CLASSES, n); });
  list.forEach(rec=>{
    CLASS_DATA[rec.name] = Object.assign({}, rec.data, {
      source: rec.source,
      homebrew: rec.source==='Homebrew',
      custom: true, customId: rec.id, builtin: false
    });
  });
}

// "lv | name | desc | use | cost | choice; choice; …" — the trailing choices field
// is optional and turns the feature into a pick-one prompt on the Settings tab.
function parseFeatureLines(text){
  return (text||'').split('\n').map(l=>l.trim()).filter(Boolean).map(line=>{
    const [lvRaw, name, desc, use, cost, choicesRaw] = line.split('|').map(s=>(s||'').trim());
    const f = { lv: Math.max(1, Math.min(20, parseInt(lvRaw)||1)), name };
    if(desc) f.desc = desc;
    if(use) f.use = use;
    if(cost) f.cost = cost;
    const choices = parseChoiceList(choicesRaw);
    if(choices.length) f.choices = choices;
    return f;
  }).filter(f=>f.name);
}

// Choices are semicolon-separated so option text can still contain commas.
function parseChoiceList(raw){
  return (raw||'').split(';').map(s=>s.trim()).filter(Boolean);
}

function buildClassFromForm(){
  const name = document.getElementById('impName').value.trim();
  if(!name) throw new Error('Class name is required.');
  const source = document.getElementById('impSource').value;
  const saves = [...document.querySelectorAll('#impSaves .mini-toggle.on')].map(t=>t.dataset.k);
  const skillsRaw = document.getElementById('impSkills').value.trim();
  const skills = skillsRaw ? skillsRaw.split(',').map(s=>s.trim()).filter(Boolean) : 'any';
  const subsRaw = document.getElementById('impSubclasses').value.trim();
  const castingType = document.getElementById('impCasting').value;
  const castAbility = document.getElementById('impCastAbility').value;
  const casting = { type: castingType };
  if(castAbility) casting.ability = castAbility;
  const data = {
    hitDie: parseInt(document.getElementById('impHitDie').value)||8,
    saves,
    choose: parseInt(document.getElementById('impChoose').value)||0,
    skills,
    subclassLevel: Math.max(1, Math.min(20, parseInt(document.getElementById('impSubLevel').value)||3)),
    casting,
    features: parseFeatureLines(document.getElementById('impFeatures').value)
  };
  if(subsRaw) data.subclasses = subsRaw.split(',').map(s=>s.trim()).filter(Boolean);
  const desc = document.getElementById('impDesc').value.trim();
  if(desc) data.desc = desc;
  return { name, source, data };
}

async function submitImport(payload){
  const msg = document.getElementById('impMsg');
  try{
    if(!payload) payload = buildClassFromForm();
    if(!payload.name) throw new Error('Class name is required.');
    if(!payload.data || typeof payload.data!=='object') throw new Error('Class data is required.');
    const source = CLASS_SOURCES.includes(payload.source) ? payload.source : 'Homebrew';
    const res = await apiImportClass({ name: payload.name, source, data: payload.data });
    CLASS_DATA[payload.name] = Object.assign({}, payload.data, {
      source, homebrew: source==='Homebrew', custom:true, customId: res.id, builtin:false
    });
    msg.className = 'import-msg ok';
    msg.textContent = `Imported "${payload.name}" (${source}) — now available in the class dropdown.`;
    buildClassFilterBar(); buildClassList(); renderImportedList();
    buildSubclassParentSelect(); buildLibraryEditSelects();
  }catch(err){
    msg.className = 'import-msg err';
    msg.textContent = 'Import failed: ' + err.message;
  }
}

function renderImportedList(){
  const box = document.getElementById('importedList');
  if(!box) return;
  const customs = Object.entries(CLASS_DATA).filter(([n,cd])=>cd.custom);
  if(!customs.length){ box.innerHTML=''; return; }
  box.innerHTML = '<div class="picker-hint" style="margin-bottom:6px;">Imported classes</div>' + customs.map(([n,cd])=>`
    <div class="imported-item">
      <span class="ii-name">${n}</span>
      ${sourceTag(cd.source)}
      <span class="ii-edit" data-name="${n}" title="Load into the form to edit">✎</span>
      <span class="row-del" data-id="${cd.customId}" data-name="${n}">✕</span>
    </div>`).join('');
  box.querySelectorAll('.ii-edit').forEach(btn=>btn.addEventListener('click', e=>{
    fillClassForm(e.target.dataset.name);
  }));
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', e=>
    deleteClassEntry(e.target.dataset.id, e.target.dataset.name)));
}

// Fully remove an imported class from the shared database. If it shadowed a
// built-in of the same name, that built-in is restored. Shared by the imported
// list's ✕ and the edit form's Delete button.
async function deleteClassEntry(id, name){
  if(!confirm(`Remove imported class "${name}"? Characters using it will lose it${BUILTIN_CLASSES[name]?' (the built-in version is restored)':''}.`)) return false;
  await apiDeleteClass(id);
  restoreOrDelete(CLASS_DATA, BUILTIN_CLASSES, name);
  if(!CLASS_DATA[name]) state.classes = (state.classes||[]).filter(c=>c.name!==name);
  afterClassChange();
  renderImportedList();
  buildLibraryEditSelects();
  return true;
}

function bindClassImport(){
  const saves = document.getElementById('impSaves');
  saves.innerHTML = ABILITIES.map(a=>`<span class="mini-toggle" data-k="${a.key}">${a.key}</span>`).join('');
  saves.querySelectorAll('.mini-toggle').forEach(t=>t.addEventListener('click', ()=>t.classList.toggle('on')));

  document.getElementById('impJsonToggle').addEventListener('click', ()=>{
    const w = document.getElementById('impJsonWrap');
    w.style.display = (w.style.display==='none') ? '' : 'none';
  });

  document.getElementById('impSubmit').addEventListener('click', ()=>{
    const jsonWrap = document.getElementById('impJsonWrap');
    const jsonText = document.getElementById('impJson').value.trim();
    if(jsonWrap.style.display!=='none' && jsonText){
      let obj;
      try { obj = JSON.parse(jsonText); }
      catch(e){
        const m = document.getElementById('impMsg');
        m.className = 'import-msg err'; m.textContent = 'Invalid JSON: ' + e.message;
        return;
      }
      const { name, source, data, ...rest } = obj;
      submitImport({ name, source, data: data || rest });
    } else {
      submitImport();
    }
  });
}

// ---------- Species (character selection + Features tab) ----------
async function loadCustomSpecies(){
  let list = [];
  try { list = await apiListSpecies(); } catch(e){ return; }
  Object.keys(SPECIES_DATA).forEach(n=>{ if(SPECIES_DATA[n].custom) restoreOrDelete(SPECIES_DATA, BUILTIN_SPECIES, n); });
  list.forEach(rec=>{
    SPECIES_DATA[rec.name] = Object.assign({}, rec.data, {
      source: rec.source, custom:true, customId: rec.id, builtin:false
    });
  });
}

function buildSpeciesSelect(){
  const sel = document.getElementById('charRace');
  if(!sel) return;
  const names = Object.keys(SPECIES_DATA).sort();
  sel.innerHTML = '<option value="">— none —</option>' + names.map(n=>
    `<option value="${n}" ${state.race===n?'selected':''}>${n} · ${SPECIES_DATA[n].source}</option>`).join('');
  // Preserve a pre-existing freeform species that isn't in the library.
  if(state.race && !SPECIES_DATA[state.race]){
    sel.insertAdjacentHTML('beforeend', `<option value="${state.race}" selected>${state.race} (custom)</option>`);
  }
  sel.onchange = ()=>{
    state.race = sel.value;
    state.subrace = ''; // a new species has its own subraces; clear the old pick
    const sd = SPECIES_DATA[state.race];
    if(sd && sd.speed){ state.speed = sd.speed; const sp = document.getElementById('statSpeed'); if(sp) sp.value = sd.speed; }
    buildSubraceSelect();
    renderSpeciesInfo();
    buildSpeciesTraits();
    buildSkillPicker(); // species-granted skill chips change with the species
    buildSkills();
    updateHero(); recalc(); save();
  };
}

// Subrace picker: shown only when the selected species has subraces (built-in
// names on the species plus any imported subspecies for it).
function buildSubraceSelect(){
  const field = document.getElementById('charSubraceField');
  const sel = document.getElementById('charSubrace');
  if(!field || !sel) return;
  const names = subspeciesNamesForSpecies(state.race);
  if(!names.length){ field.style.display='none'; sel.innerHTML=''; return; }
  field.style.display='';
  sel.innerHTML = '<option value="">— none —</option>' + names.map(n=>{
    const ss = SUBSPECIES_DATA[subspKey(state.race, n)];
    return `<option value="${esc(n)}" ${state.subrace===n?'selected':''}>${esc(n)}${ss&&ss.custom?' ✦':''}</option>`;
  }).join('');
  // Preserve a pre-existing freeform subrace not in the library.
  if(state.subrace && !names.includes(state.subrace)){
    sel.insertAdjacentHTML('beforeend', `<option value="${esc(state.subrace)}" selected>${esc(state.subrace)} (custom)</option>`);
  }
  sel.onchange = ()=>{
    state.subrace = sel.value;
    renderSpeciesInfo();
    buildSpeciesTraits();
    recalc(); save();
  };
}

function renderSpeciesInfo(){
  const box = document.getElementById('speciesInfo');
  if(!box) return;
  const sd = SPECIES_DATA[state.race];
  if(!sd){
    box.innerHTML = state.race
      ? '<div class="ci-desc">// custom species — add it on the Library tab to attach traits, size & speed</div>'
      : '<div class="ci-desc">// no species selected</div>';
    return;
  }
  const ss = state.subrace ? SUBSPECIES_DATA[subspKey(state.race, state.subrace)] : null;
  box.innerHTML = `
    <div class="ci-title">${state.race}${sourceTag(sd.source)}</div>
    <div class="ci-row"><span class="ci-key">size</span><span>${sd.size||'—'}</span></div>
    <div class="ci-row"><span class="ci-key">speed</span><span>${sd.speed||0} ft${sd.darkvision?` · darkvision ${sd.darkvision} ft`:''}</span></div>
    ${sd.asi?`<div class="ci-row"><span class="ci-key">asi</span><span>${sd.asi}</span></div>`:''}
    ${sd.languages?`<div class="ci-row"><span class="ci-key">languages</span><span>${sd.languages}</span></div>`:''}
    ${state.subrace?`<div class="ci-row"><span class="ci-key">subrace</span><span>${esc(state.subrace)}${ss&&ss.asi?` · ${esc(ss.asi)}`:''}</span></div>`:''}
    <div class="ci-row"><span class="ci-key">source</span><span>${sd.custom?'Imported · '+sd.source:'Official · '+sd.source}</span></div>
    ${sd.desc?`<div class="ci-desc">${sd.desc}</div>`:''}
    ${ss&&ss.desc?`<div class="ci-desc">${ss.desc}</div>`:''}`;
}

function buildSpeciesTraits(){
  const box = document.getElementById('speciesTraitsList');
  if(!box) return;
  const sd = SPECIES_DATA[state.race];
  const traitRow = t=>`
    <div class="feat-item">
      <div class="feat-head"><span class="f-name">${t.name}</span></div>
      ${t.desc?`<div class="feat-desc">${t.desc}</div>`:''}
    </div>`;
  let html;
  if(!sd){
    html = `<div class="action-empty">${state.race ? 'Custom species — import "'+state.race+'" on the Library tab to list its traits here.' : 'Pick a species in Settings to see its traits here.'}</div>`;
  } else {
    html = (sd.traits||[]).map(traitRow).join('');
    // Append the selected subrace's traits under a labelled divider.
    const ss = state.subrace ? SUBSPECIES_DATA[subspKey(state.race, state.subrace)] : null;
    if(ss && Array.isArray(ss.traits) && ss.traits.length){
      html += `<div class="subrace-divider">${esc(state.subrace)} <span class="chip-abbr">subrace</span></div>` + ss.traits.map(traitRow).join('');
    }
    if(!html) html = '<div class="action-empty">No traits listed for this species.</div>';
  }
  // Custom traits append in every case, including the no-species empty state.
  box.innerHTML = html + customFeaturesHtml('species');
  bindCustomFeatureRows(box);
}

// ---------- Backgrounds (character selection + Features tab) ----------
async function loadCustomBackgrounds(){
  let list = [];
  try { list = await apiListBackgrounds(); } catch(e){ return; }
  Object.keys(BACKGROUND_DATA).forEach(n=>{ if(BACKGROUND_DATA[n].custom) restoreOrDelete(BACKGROUND_DATA, BUILTIN_BACKGROUNDS, n); });
  list.forEach(rec=>{
    BACKGROUND_DATA[rec.name] = Object.assign({}, rec.data, {
      source: rec.source, custom:true, customId: rec.id, builtin:false
    });
  });
}

function buildBackgroundSelect(){
  const sel = document.getElementById('charBackground');
  if(!sel) return;
  const names = Object.keys(BACKGROUND_DATA).sort();
  sel.innerHTML = '<option value="">— none —</option>' + names.map(n=>
    `<option value="${esc(n)}" ${state.background===n?'selected':''}>${esc(n)} · ${BACKGROUND_DATA[n].source}</option>`).join('');
  // Preserve a pre-existing freeform background that isn't in the library.
  if(state.background && !BACKGROUND_DATA[state.background]){
    sel.insertAdjacentHTML('beforeend', `<option value="${esc(state.background)}" selected>${esc(state.background)} (custom)</option>`);
  }
  sel.onchange = ()=>{
    state.background = sel.value;
    renderBackgroundInfo();
    buildBackgroundFeature();
    buildSkillPicker(); // granted chips change with the background
    buildSkills();
    recalc(); save();
  };
}

function renderBackgroundInfo(){
  const box = document.getElementById('backgroundInfo');
  if(!box) return;
  const bd = BACKGROUND_DATA[state.background];
  if(!bd){
    box.innerHTML = state.background
      ? '<div class="ci-desc">// custom background — import it on the Import page to attach skills & a feature</div>'
      : '<div class="ci-desc">// no background selected</div>';
    return;
  }
  box.innerHTML = `
    <div class="ci-title">${esc(state.background)}${sourceTag(bd.source)}</div>
    ${bd.skills&&bd.skills.length?`<div class="ci-row"><span class="ci-key">skills</span><span>${bd.skills.map(esc).join(', ')} (granted)</span></div>`:''}
    ${bd.tools?`<div class="ci-row"><span class="ci-key">tools</span><span>${esc(bd.tools)}</span></div>`:''}
    ${bd.languages?`<div class="ci-row"><span class="ci-key">languages</span><span>${esc(bd.languages)}</span></div>`:''}
    ${bd.feature?`<div class="ci-row"><span class="ci-key">feature</span><span>${esc(bd.feature.name)}</span></div>`:''}
    <div class="ci-row"><span class="ci-key">source</span><span>${bd.custom?'Imported · '+bd.source:'Official · '+bd.source}</span></div>
    ${bd.desc?`<div class="ci-desc">${esc(bd.desc)}</div>`:''}`;
}

// ---------- Custom features & traits ----------
// Player-authored entries added on the Features tab. `cat` decides which list
// each one joins — the class features, the species traits, or the standalone
// "Other" list — and they're stored on the character as state.customFeatures.
const CUSTOM_FEAT_CATS = { class:'Class Features', species:'Species Traits', other:'Other Features & Traits' };

function newFeatureId(){ return 'cf' + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }

function ensureCustomFeatures(){
  if(!Array.isArray(state.customFeatures)) state.customFeatures = [];
  // One-time migration: "Other Features & Traits" used to be a free-text box, and
  // an imported character can still carry that field. Move anything written there
  // into the list rather than dropping it on the floor.
  if(typeof state.features === 'string' && state.features.trim()){
    state.customFeatures.push({ id:newFeatureId(), cat:'other', name:'Notes', desc:state.features.trim() });
    state.features = '';
  }
  return state.customFeatures;
}

function customFeaturesFor(cat){
  return ensureCustomFeatures().filter(f=> f.cat === cat);
}

function customFeatItem(cf){
  return `<div class="feat-item" data-cf="${esc(cf.id)}">
    <div class="feat-head">
      <span class="f-name">${esc(cf.name)}</span>
      <span class="action-badge dim">custom</span>
      <span class="cf-edit" data-id="${esc(cf.id)}" title="Edit this feature">✎</span>
      <span class="row-del cf-del" data-id="${esc(cf.id)}" title="Remove this feature">✕</span>
    </div>
    ${cf.desc?`<div class="feat-desc">${esc(cf.desc)}</div>`:''}
  </div>`;
}

// Custom rows appended to a built-in list, under a divider that marks them apart
// from the class/species entries above.
function customFeaturesHtml(cat){
  const list = customFeaturesFor(cat);
  if(!list.length) return '';
  return `<div class="subrace-divider">Custom <span class="chip-abbr">added by you</span></div>`
    + list.map(customFeatItem).join('');
}

function bindCustomFeatureRows(scope){
  scope.querySelectorAll('.cf-edit').forEach(b=> b.addEventListener('click', e=> editCustomFeature(e.target.dataset.id)));
  scope.querySelectorAll('.cf-del').forEach(b=> b.addEventListener('click', e=> deleteCustomFeature(e.target.dataset.id)));
}

function renderOtherFeatures(){
  const box = document.getElementById('otherFeaturesList');
  if(!box) return;
  const list = customFeaturesFor('other');
  box.innerHTML = list.length ? list.map(customFeatItem).join('')
    : '<div class="action-empty">Nothing here yet — add a feat, boon, or custom trait below.</div>';
  bindCustomFeatureRows(box);
}

// Every list a custom feature can land in.
function refreshFeatureLists(){
  buildClassFeatures();
  buildSpeciesTraits();
  renderOtherFeatures();
}

// ---------- Add / edit feature form (Features tab) ----------
// The same form adds and edits: ✎ on a row loads it here and the button becomes
// Save Changes until the edit is committed or cancelled.
let editingFeatureId = null;

function setCfMsg(kind, text){
  const m = document.getElementById('cfMsg');
  if(!m) return;
  m.className = 'import-msg ' + kind;
  m.textContent = text || '';
}

function resetCustomFeatureForm(){
  editingFeatureId = null;
  const name = document.getElementById('cfName');
  const desc = document.getElementById('cfDesc');
  if(name) name.value = '';
  if(desc) desc.value = '';
  const submit = document.getElementById('cfSubmit');
  if(submit) submit.textContent = '+ Add Feature';
  const cancel = document.getElementById('cfCancel');
  if(cancel) cancel.style.display = 'none';
}

function editCustomFeature(id){
  const cf = ensureCustomFeatures().find(f=> f.id === id);
  if(!cf) return;
  editingFeatureId = id;
  document.getElementById('cfCat').value = cf.cat;
  document.getElementById('cfName').value = cf.name;
  document.getElementById('cfDesc').value = cf.desc || '';
  document.getElementById('cfSubmit').textContent = 'Save Changes';
  document.getElementById('cfCancel').style.display = '';
  setCfMsg('ok', `Editing "${cf.name}" — change it and press Save Changes.`);
  document.getElementById('cfName').focus();
}

function deleteCustomFeature(id){
  const list = ensureCustomFeatures();
  const cf = list.find(f=> f.id === id);
  if(!cf) return;
  if(!confirm(`Remove "${cf.name}" from ${CUSTOM_FEAT_CATS[cf.cat]||'your features'}?`)) return;
  state.customFeatures = list.filter(f=> f.id !== id);
  if(editingFeatureId === id){ resetCustomFeatureForm(); setCfMsg('', ''); }
  refreshFeatureLists();
  save();
}

function submitCustomFeature(){
  const cat = document.getElementById('cfCat').value;
  const name = document.getElementById('cfName').value.trim();
  const desc = document.getElementById('cfDesc').value.trim();
  if(!name) return setCfMsg('err', 'Give the feature a name.');
  if(!CUSTOM_FEAT_CATS[cat]) return setCfMsg('err', 'Pick which list it goes in.');
  ensureCustomFeatures();
  if(editingFeatureId){
    const cf = state.customFeatures.find(f=> f.id === editingFeatureId);
    if(cf){ cf.cat = cat; cf.name = name; cf.desc = desc; }
  } else {
    state.customFeatures.push({ id:newFeatureId(), cat, name, desc });
  }
  const verb = editingFeatureId ? 'Saved' : 'Added';
  resetCustomFeatureForm();
  setCfMsg('ok', `${verb} "${name}" to ${CUSTOM_FEAT_CATS[cat]}.`);
  refreshFeatureLists();
  save();
}

function bindCustomFeatureForm(){
  const submit = document.getElementById('cfSubmit');
  if(!submit) return;
  submit.addEventListener('click', submitCustomFeature);
  document.getElementById('cfCancel').addEventListener('click', ()=>{
    resetCustomFeatureForm();
    setCfMsg('', '');
  });
}

// Features & Traits tab: the selected background's feature + equipment notes.
function buildBackgroundFeature(){
  const box = document.getElementById('backgroundFeatureList');
  if(!box) return;
  const bd = BACKGROUND_DATA[state.background];
  if(!bd){
    box.innerHTML = `<div class="action-empty">${state.background ? 'Custom background — import "'+esc(state.background)+'" on the Import page to list its feature here.' : 'Pick a background in Settings to see its feature here.'}</div>`;
    return;
  }
  let html = '';
  if(bd.feature && bd.feature.name){
    html += `<div class="feat-item">
      <div class="feat-head"><span class="f-name">${esc(bd.feature.name)}</span><span class="action-badge dim">background</span></div>
      ${bd.feature.desc?`<div class="feat-desc">${esc(bd.feature.desc)}</div>`:''}
    </div>`;
  }
  if(bd.skills && bd.skills.length) html += `<div class="feat-item"><div class="feat-head"><span class="f-name">Skill Proficiencies</span></div><div class="feat-desc">${bd.skills.map(esc).join(', ')} — applied automatically on the Skills tab.</div></div>`;
  if(bd.equipment) html += `<div class="feat-item"><div class="feat-head"><span class="f-name">Equipment</span></div><div class="feat-desc">${esc(bd.equipment)}</div></div>`;
  box.innerHTML = html || '<div class="action-empty">No feature listed for this background.</div>';
}

// ---------- Species import (Library tab) ----------
function parseTraitLines(text){
  return (text||'').split('\n').map(l=>l.trim()).filter(Boolean).map(line=>{
    const [name, desc] = line.split('|').map(s=>(s||'').trim());
    const t = { name };
    if(desc) t.desc = desc;
    return t;
  }).filter(t=>t.name);
}

function buildSpeciesFromForm(){
  const name = document.getElementById('spName').value.trim();
  if(!name) throw new Error('Species name is required.');
  const source = document.getElementById('spSource').value;
  const data = {
    size: document.getElementById('spSize').value,
    speed: parseInt(document.getElementById('spSpeed').value)||30,
    darkvision: parseInt(document.getElementById('spDarkvision').value)||0,
    traits: parseTraitLines(document.getElementById('spTraits').value)
  };
  const asi = document.getElementById('spAsi').value.trim();
  const langs = document.getElementById('spLanguages').value.trim();
  const desc = document.getElementById('spDesc').value.trim();
  if(asi) data.asi = asi;
  if(langs) data.languages = langs;
  if(desc) data.desc = desc;
  return { name, source, data };
}

async function submitSpeciesImport(payload){
  const msg = document.getElementById('spMsg');
  try{
    if(!payload) payload = buildSpeciesFromForm();
    if(!payload.name) throw new Error('Species name is required.');
    if(!payload.data || typeof payload.data!=='object') throw new Error('Species data is required.');
    const source = CLASS_SOURCES.includes(payload.source) ? payload.source : 'Homebrew';
    const res = await apiImportSpecies({ name: payload.name, source, data: payload.data });
    SPECIES_DATA[payload.name] = Object.assign({}, payload.data, { source, custom:true, customId: res.id, builtin:false });
    msg.className = 'import-msg ok';
    msg.textContent = `Imported "${payload.name}" (${source}) — now available in the Species picker on the Settings tab.`;
    buildSpeciesSelect(); renderSpeciesInfo(); renderSpeciesImportedList(); buildLibraryEditSelects();
  }catch(err){
    msg.className = 'import-msg err';
    msg.textContent = 'Import failed: ' + err.message;
  }
}

function renderSpeciesImportedList(){
  const box = document.getElementById('speciesImportedList');
  if(!box) return;
  const customs = Object.entries(SPECIES_DATA).filter(([n,sd])=>sd.custom);
  if(!customs.length){ box.innerHTML=''; return; }
  box.innerHTML = '<div class="picker-hint" style="margin-bottom:6px;">Imported species</div>' + customs.map(([n,sd])=>`
    <div class="imported-item">
      <span class="ii-name">${n}</span>
      ${sourceTag(sd.source)}
      <span class="ii-edit" data-name="${n}" title="Load into the form to edit">✎</span>
      <span class="row-del" data-id="${sd.customId}" data-name="${n}">✕</span>
    </div>`).join('');
  box.querySelectorAll('.ii-edit').forEach(btn=>btn.addEventListener('click', e=>{
    fillSpeciesForm(e.target.dataset.name);
  }));
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', e=>
    deleteSpeciesEntry(e.target.dataset.id, e.target.dataset.name)));
}

async function deleteSpeciesEntry(id, name){
  if(!confirm(`Remove imported species "${name}"?${BUILTIN_SPECIES[name]?' The built-in version is restored.':''}`)) return false;
  await apiDeleteSpecies(id);
  restoreOrDelete(SPECIES_DATA, BUILTIN_SPECIES, name);
  buildSpeciesSelect(); renderSpeciesInfo(); buildSpeciesTraits(); renderSpeciesImportedList();
  buildLibraryEditSelects();
  return true;
}

function bindSpeciesImport(){
  document.getElementById('spJsonToggle').addEventListener('click', ()=>{
    const w = document.getElementById('spJsonWrap');
    w.style.display = (w.style.display==='none') ? '' : 'none';
  });
  document.getElementById('spSubmit').addEventListener('click', ()=>{
    const jsonWrap = document.getElementById('spJsonWrap');
    const jsonText = document.getElementById('spJson').value.trim();
    if(jsonWrap.style.display!=='none' && jsonText){
      let obj;
      try { obj = JSON.parse(jsonText); }
      catch(e){
        const m = document.getElementById('spMsg');
        m.className = 'import-msg err'; m.textContent = 'Invalid JSON: ' + e.message;
        return;
      }
      const { name, source, data, ...rest } = obj;
      submitSpeciesImport({ name, source, data: data || rest });
    } else {
      submitSpeciesImport();
    }
  });
}

// ---------- Background import (Import page) ----------
// Comma-separated skill names → canonical SKILLS names (case-insensitive);
// unknown names are rejected so granted proficiencies always match the sheet.
function parseSkillNames(text){
  const out = [];
  (text||'').split(',').map(s=>s.trim()).filter(Boolean).forEach(nm=>{
    const hit = SKILLS.find(s=>s.name.toLowerCase()===nm.toLowerCase());
    if(!hit) throw new Error(`Unknown skill "${nm}" — use the 5e skill names (e.g. ${SKILLS[0].name}, ${SKILLS[6].name}).`);
    if(!out.includes(hit.name)) out.push(hit.name);
  });
  return out;
}

function buildBackgroundFromForm(){
  const name = document.getElementById('bgName').value.trim();
  if(!name) throw new Error('Background name is required.');
  const source = document.getElementById('bgSource').value;
  const data = { skills: parseSkillNames(document.getElementById('bgSkills').value) };
  const tools = document.getElementById('bgTools').value.trim();
  const langs = document.getElementById('bgLanguages').value.trim();
  const equipment = document.getElementById('bgEquipment').value.trim();
  const desc = document.getElementById('bgDesc').value.trim();
  const featName = document.getElementById('bgFeatureName').value.trim();
  const featDesc = document.getElementById('bgFeatureDesc').value.trim();
  if(tools) data.tools = tools;
  if(langs) data.languages = langs;
  if(equipment) data.equipment = equipment;
  if(desc) data.desc = desc;
  if(featName) data.feature = { name: featName, desc: featDesc };
  return { name, source, data };
}

async function submitBackgroundImport(payload){
  const msg = document.getElementById('bgMsg');
  try{
    if(!payload) payload = buildBackgroundFromForm();
    if(!payload.name) throw new Error('Background name is required.');
    if(!payload.data || typeof payload.data!=='object') throw new Error('Background data is required.');
    if(payload.data.skills) payload.data.skills = parseSkillNames([].concat(payload.data.skills).join(','));
    const source = CLASS_SOURCES.includes(payload.source) ? payload.source : 'Homebrew';
    const res = await apiImportBackground({ name: payload.name, source, data: payload.data });
    BACKGROUND_DATA[payload.name] = Object.assign({}, payload.data, { source, custom:true, customId: res.id, builtin:false });
    msg.className = 'import-msg ok';
    msg.textContent = `Imported "${payload.name}" (${source}) — now available in the Background picker on the Settings tab.`;
    buildBackgroundSelect(); renderBackgroundInfo(); renderBackgroundImportedList(); buildLibraryEditSelects();
  }catch(err){
    msg.className = 'import-msg err';
    msg.textContent = 'Import failed: ' + err.message;
  }
}

function renderBackgroundImportedList(){
  const box = document.getElementById('backgroundImportedList');
  if(!box) return;
  const customs = Object.entries(BACKGROUND_DATA).filter(([n,bd])=>bd.custom);
  if(!customs.length){ box.innerHTML=''; return; }
  box.innerHTML = '<div class="picker-hint" style="margin-bottom:6px;">Imported backgrounds</div>' + customs.map(([n,bd])=>`
    <div class="imported-item">
      <span class="ii-name">${esc(n)}</span>
      ${sourceTag(bd.source)}
      <span class="ii-edit" data-name="${esc(n)}" title="Load into the form to edit">✎</span>
      <span class="row-del" data-id="${bd.customId}" data-name="${esc(n)}">✕</span>
    </div>`).join('');
  box.querySelectorAll('.ii-edit').forEach(btn=>btn.addEventListener('click', e=>{
    fillBackgroundForm(e.target.dataset.name);
  }));
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', e=>
    deleteBackgroundEntry(e.target.dataset.id, e.target.dataset.name)));
}

async function deleteBackgroundEntry(id, name){
  if(!confirm(`Remove imported background "${name}"?${BUILTIN_BACKGROUNDS[name]?' The built-in version is restored.':''}`)) return false;
  await apiDeleteBackground(id);
  restoreOrDelete(BACKGROUND_DATA, BUILTIN_BACKGROUNDS, name);
  buildBackgroundSelect(); renderBackgroundInfo(); buildBackgroundFeature(); renderBackgroundImportedList();
  buildLibraryEditSelects();
  return true;
}

function bindBackgroundImport(){
  document.getElementById('bgJsonToggle').addEventListener('click', ()=>{
    const w = document.getElementById('bgJsonWrap');
    w.style.display = (w.style.display==='none') ? '' : 'none';
  });
  document.getElementById('bgSubmit').addEventListener('click', ()=>{
    const jsonWrap = document.getElementById('bgJsonWrap');
    const jsonText = document.getElementById('bgJson').value.trim();
    if(jsonWrap.style.display!=='none' && jsonText){
      let obj;
      try { obj = JSON.parse(jsonText); }
      catch(e){
        const m = document.getElementById('bgMsg');
        m.className = 'import-msg err'; m.textContent = 'Invalid JSON: ' + e.message;
        return;
      }
      const { name, source, data, ...rest } = obj;
      submitBackgroundImport({ name, source, data: data || rest });
    } else {
      submitBackgroundImport();
    }
  });
}

// ---------- Subclass import (Library tab) ----------
async function loadCustomSubclasses(){
  let list = [];
  try { list = await apiListSubclasses(); } catch(e){ return; }
  Object.keys(SUBCLASS_DATA).forEach(k=>{ if(SUBCLASS_DATA[k].custom) delete SUBCLASS_DATA[k]; });
  list.forEach(rec=>{
    SUBCLASS_DATA[subKey(rec.parent, rec.name)] = Object.assign(
      { parent: rec.parent, name: rec.name }, rec.data,
      { source: rec.source, custom:true, customId: rec.id });
  });
}

// Parent-class dropdown for the import form (every class can be a parent).
function buildSubclassParentSelect(){
  const sel = document.getElementById('subParent');
  if(!sel) return;
  const cur = sel.value;
  const names = Object.keys(CLASS_DATA).sort();
  sel.innerHTML = '<option value="">— pick parent class —</option>' + names.map(n=>
    `<option value="${esc(n)}">${esc(n)} · ${CLASS_DATA[n].source}</option>`).join('');
  if(cur && CLASS_DATA[cur]) sel.value = cur;
}

function buildSubclassFromForm(){
  const parent = document.getElementById('subParent').value;
  if(!parent) throw new Error('Pick a parent class.');
  if(!CLASS_DATA[parent]) throw new Error('Unknown parent class.');
  const name = document.getElementById('subName').value.trim();
  if(!name) throw new Error('Subclass name is required.');
  const source = document.getElementById('subSource').value;
  const data = {
    subclassLevel: Math.max(1, Math.min(20, parseInt(document.getElementById('subLevel').value)||CLASS_DATA[parent].subclassLevel||3)),
    features: parseFeatureLines(document.getElementById('subFeatures').value)
  };
  const desc = document.getElementById('subDesc').value.trim();
  if(desc) data.desc = desc;
  return { parent, name, source, data };
}

async function submitSubclassImport(payload){
  const msg = document.getElementById('subMsg');
  try{
    if(!payload) payload = buildSubclassFromForm();
    if(!payload.parent || !CLASS_DATA[payload.parent]) throw new Error('A valid parent class is required.');
    if(!payload.name) throw new Error('Subclass name is required.');
    if(!payload.data || typeof payload.data!=='object') throw new Error('Subclass data is required.');
    const source = CLASS_SOURCES.includes(payload.source) ? payload.source : 'Homebrew';
    const res = await apiImportSubclass({ parent: payload.parent, name: payload.name, source, data: payload.data });
    SUBCLASS_DATA[subKey(payload.parent, payload.name)] = Object.assign(
      { parent: payload.parent, name: payload.name }, payload.data,
      { source, custom:true, customId: res.id });
    msg.className = 'import-msg ok';
    msg.textContent = `Imported "${payload.name}" under ${payload.parent} (${source}) — now selectable on that class in Settings.`;
    // Reflect the new subclass everywhere it's listed.
    buildClassList(); renderClassInfoStack(); buildClassFeatures(); buildActions(); renderSubclassImportedList(); buildLibraryEditSelects();
  }catch(err){
    msg.className = 'import-msg err';
    msg.textContent = 'Import failed: ' + err.message;
  }
}

function renderSubclassImportedList(){
  const box = document.getElementById('subclassImportedList');
  if(!box) return;
  const customs = Object.values(SUBCLASS_DATA).filter(s=>s.custom);
  if(!customs.length){ box.innerHTML=''; return; }
  box.innerHTML = '<div class="picker-hint" style="margin-bottom:6px;">Imported subclasses</div>' + customs.map(s=>`
    <div class="imported-item">
      <span class="ii-name">${esc(s.name)} <span class="chip-abbr">${esc(s.parent)}</span></span>
      ${sourceTag(s.source)}
      <span class="ii-edit" data-parent="${esc(s.parent)}" data-name="${esc(s.name)}" title="Load into the form to edit">✎</span>
      <span class="row-del" data-id="${s.customId}" data-parent="${esc(s.parent)}" data-name="${esc(s.name)}">✕</span>
    </div>`).join('');
  box.querySelectorAll('.ii-edit').forEach(btn=>btn.addEventListener('click', e=>{
    fillSubclassForm(e.target.dataset.parent, e.target.dataset.name);
  }));
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', e=>
    deleteSubclassEntry(e.target.dataset.id, e.target.dataset.parent, e.target.dataset.name)));
}

async function deleteSubclassEntry(id, parent, name){
  if(!confirm(`Remove imported subclass "${name}" (${parent})?`)) return false;
  await apiDeleteSubclass(id);
  delete SUBCLASS_DATA[subKey(parent, name)];
  // Clear it from any character rows that had it selected.
  (state.classes||[]).forEach(c=>{ if(c.name===parent && c.subclass===name) c.subclass=''; });
  buildClassList(); renderClassInfoStack(); buildClassFeatures(); buildActions(); renderSubclassImportedList(); buildLibraryEditSelects(); save();
  return true;
}

function bindSubclassImport(){
  buildSubclassParentSelect();
  const parentSel = document.getElementById('subParent');
  // Default the subclass level to the parent class's own subclass level.
  parentSel.addEventListener('change', ()=>{
    const cd = CLASS_DATA[parentSel.value];
    if(cd) document.getElementById('subLevel').value = cd.subclassLevel || 3;
  });
  document.getElementById('subJsonToggle').addEventListener('click', ()=>{
    const w = document.getElementById('subJsonWrap');
    w.style.display = (w.style.display==='none') ? '' : 'none';
  });
  document.getElementById('subSubmit').addEventListener('click', ()=>{
    const jsonWrap = document.getElementById('subJsonWrap');
    const jsonText = document.getElementById('subJson').value.trim();
    if(jsonWrap.style.display!=='none' && jsonText){
      let obj;
      try { obj = JSON.parse(jsonText); }
      catch(e){
        const m = document.getElementById('subMsg');
        m.className = 'import-msg err'; m.textContent = 'Invalid JSON: ' + e.message;
        return;
      }
      const { parent, name, source, data, ...rest } = obj;
      submitSubclassImport({ parent, name, source, data: data || rest });
    } else {
      submitSubclassImport();
    }
  });
}

// ---------- Subspecies import (Library tab) ----------
async function loadCustomSubspecies(){
  let list = [];
  try { list = await apiListSubspecies(); } catch(e){ return; }
  // Drop previously-merged imports, restoring any built-in they shadowed.
  Object.keys(SUBSPECIES_DATA).forEach(k=>{ if(SUBSPECIES_DATA[k].custom) restoreOrDelete(SUBSPECIES_DATA, BUILTIN_SUBSPECIES, k); });
  list.forEach(rec=>{
    SUBSPECIES_DATA[subspKey(rec.parent, rec.name)] = Object.assign(
      { parent: rec.parent, name: rec.name }, rec.data,
      { source: rec.source, custom:true, customId: rec.id });
  });
}

// Parent-species dropdown for the import form (every species can be a parent).
function buildSubspeciesParentSelect(){
  const sel = document.getElementById('subspParent');
  if(!sel) return;
  const cur = sel.value;
  const names = Object.keys(SPECIES_DATA).sort();
  sel.innerHTML = '<option value="">— pick parent species —</option>' + names.map(n=>
    `<option value="${esc(n)}">${esc(n)} · ${SPECIES_DATA[n].source}</option>`).join('');
  if(cur && SPECIES_DATA[cur]) sel.value = cur;
}

function buildSubspeciesFromForm(){
  const parent = document.getElementById('subspParent').value;
  if(!parent) throw new Error('Pick a parent species.');
  if(!SPECIES_DATA[parent]) throw new Error('Unknown parent species.');
  const name = document.getElementById('subspName').value.trim();
  if(!name) throw new Error('Subspecies name is required.');
  const source = document.getElementById('subspSource').value;
  const data = { traits: parseTraitLines(document.getElementById('subspTraits').value) };
  const asi = document.getElementById('subspAsi').value.trim();
  const desc = document.getElementById('subspDesc').value.trim();
  if(asi) data.asi = asi;
  if(desc) data.desc = desc;
  return { parent, name, source, data };
}

async function submitSubspeciesImport(payload){
  const msg = document.getElementById('subspMsg');
  try{
    if(!payload) payload = buildSubspeciesFromForm();
    if(!payload.parent || !SPECIES_DATA[payload.parent]) throw new Error('A valid parent species is required.');
    if(!payload.name) throw new Error('Subspecies name is required.');
    if(!payload.data || typeof payload.data!=='object') throw new Error('Subspecies data is required.');
    const source = CLASS_SOURCES.includes(payload.source) ? payload.source : 'Homebrew';
    const res = await apiImportSubspecies({ parent: payload.parent, name: payload.name, source, data: payload.data });
    SUBSPECIES_DATA[subspKey(payload.parent, payload.name)] = Object.assign(
      { parent: payload.parent, name: payload.name }, payload.data,
      { source, custom:true, customId: res.id });
    msg.className = 'import-msg ok';
    msg.textContent = `Imported "${payload.name}" under ${payload.parent} (${source}) — now selectable as a subrace on that species in Settings.`;
    // Reflect the new subspecies everywhere it's listed.
    buildSubraceSelect(); renderSpeciesInfo(); buildSpeciesTraits(); renderSubspeciesImportedList(); buildLibraryEditSelects();
  }catch(err){
    msg.className = 'import-msg err';
    msg.textContent = 'Import failed: ' + err.message;
  }
}

function renderSubspeciesImportedList(){
  const box = document.getElementById('subspeciesImportedList');
  if(!box) return;
  const customs = Object.values(SUBSPECIES_DATA).filter(s=>s.custom);
  if(!customs.length){ box.innerHTML=''; return; }
  box.innerHTML = '<div class="picker-hint" style="margin-bottom:6px;">Imported subspecies</div>' + customs.map(s=>`
    <div class="imported-item">
      <span class="ii-name">${esc(s.name)} <span class="chip-abbr">${esc(s.parent)}</span></span>
      ${sourceTag(s.source)}
      <span class="ii-edit" data-parent="${esc(s.parent)}" data-name="${esc(s.name)}" title="Load into the form to edit">✎</span>
      <span class="row-del" data-id="${s.customId}" data-parent="${esc(s.parent)}" data-name="${esc(s.name)}">✕</span>
    </div>`).join('');
  box.querySelectorAll('.ii-edit').forEach(btn=>btn.addEventListener('click', e=>{
    fillSubspeciesForm(e.target.dataset.parent, e.target.dataset.name);
  }));
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', e=>
    deleteSubspeciesEntry(e.target.dataset.id, e.target.dataset.parent, e.target.dataset.name)));
}

async function deleteSubspeciesEntry(id, parent, name){
  if(!confirm(`Remove imported subspecies "${name}" (${parent})?${BUILTIN_SUBSPECIES[subspKey(parent,name)]?' The built-in version is restored.':''}`)) return false;
  await apiDeleteSubspecies(id);
  restoreOrDelete(SUBSPECIES_DATA, BUILTIN_SUBSPECIES, subspKey(parent, name));
  // Clear it from the character if it was the selected subrace.
  if(state.race===parent && state.subrace===name) state.subrace='';
  buildSubraceSelect(); renderSpeciesInfo(); buildSpeciesTraits(); renderSubspeciesImportedList(); buildLibraryEditSelects(); save();
  return true;
}

function bindSubspeciesImport(){
  buildSubspeciesParentSelect();
  document.getElementById('subspJsonToggle').addEventListener('click', ()=>{
    const w = document.getElementById('subspJsonWrap');
    w.style.display = (w.style.display==='none') ? '' : 'none';
  });
  document.getElementById('subspSubmit').addEventListener('click', ()=>{
    const jsonWrap = document.getElementById('subspJsonWrap');
    const jsonText = document.getElementById('subspJson').value.trim();
    if(jsonWrap.style.display!=='none' && jsonText){
      let obj;
      try { obj = JSON.parse(jsonText); }
      catch(e){
        const m = document.getElementById('subspMsg');
        m.className = 'import-msg err'; m.textContent = 'Invalid JSON: ' + e.message;
        return;
      }
      const { parent, name, source, data, ...rest } = obj;
      submitSubspeciesImport({ parent, name, source, data: data || rest });
    } else {
      submitSubspeciesImport();
    }
  });
}

// ---------- Spell import (Library tab) ----------
async function loadCustomSpells(){
  let list = [];
  try { list = await apiListSpells(); } catch(e){ return; }
  CUSTOM_SPELLS = {};
  list.forEach(rec=>{
    CUSTOM_SPELLS[rec.name] = Object.assign({}, rec.data, {
      source: rec.source, custom:true, customId: rec.id
    });
  });
}

function parseNameList(raw){
  return (raw||'').split(',').map(s=>s.trim()).filter(Boolean);
}

// A "select with an Other… escape hatch": read the picked option, or the
// free-text box when Other is selected.
function readSelectOther(selectId, otherId){
  const sel = document.getElementById(selectId);
  if(!sel) return '';
  if(sel.value === '__other') return (document.getElementById(otherId)?.value || '').trim();
  return sel.value.trim();
}

// Load a stored value back into a select-or-other pair: match an existing
// option, else fall back to Other with the value in the text box.
function setSelectOther(selectId, otherId, value){
  const sel = document.getElementById(selectId);
  const other = document.getElementById(otherId);
  if(!sel) return;
  const v = value || '';
  const known = [...sel.options].some(o=> o.value===v && o.value!=='__other');
  if(v && !known){
    sel.value = '__other';
    if(other){ other.value = v; other.style.display = ''; }
  } else {
    sel.value = v;
    if(other){ other.value = ''; other.style.display = 'none'; }
  }
}

// Show the free-text box only while Other is the current selection.
function toggleSelectOther(selectId, otherId){
  const sel = document.getElementById(selectId);
  const other = document.getElementById(otherId);
  if(!sel || !other) return;
  const isOther = sel.value === '__other';
  other.style.display = isOther ? '' : 'none';
  if(isOther) other.focus(); else other.value = '';
}

function buildSpellFromForm(){
  const name = document.getElementById('splName').value.trim();
  if(!name) throw new Error('Spell name is required.');
  const source = document.getElementById('splSource').value;
  const data = {
    level: Math.max(0, Math.min(9, parseInt(document.getElementById('splLevel').value, 10) || 0)),
    classes: parseNameList(document.getElementById('splClasses').value),
    tags: getTagPicker('splTagPicker')
  };
  const school = readSelectOther('splSchool', 'splSchoolOther');
  if(school) data.school = school;
  const castingTime = readSelectOther('splCastTime', 'splCastTimeOther');
  if(castingTime) data.castingTime = castingTime;
  [['range','splRange'],['components','splComponents'],['duration','splDuration'],['desc','splDesc']].forEach(([key,id])=>{
    const v = document.getElementById(id).value.trim();
    if(v) data[key] = v;
  });
  return { name, source, data };
}

async function submitSpellImport(payload){
  const msg = document.getElementById('splMsg');
  try{
    if(!payload) payload = buildSpellFromForm();
    if(!payload.name) throw new Error('Spell name is required.');
    if(!payload.data || typeof payload.data!=='object') throw new Error('Spell data is required.');
    const source = CLASS_SOURCES.includes(payload.source) ? payload.source : 'Homebrew';
    const res = await apiImportSpell({ name: payload.name, source, data: payload.data });
    CUSTOM_SPELLS[payload.name] = Object.assign({}, payload.data, { source, custom:true, customId: res.id });
    msg.className = 'import-msg ok';
    const cls = (payload.data.classes||[]);
    msg.textContent = `Imported "${payload.name}" (${source}) — in the Spell Library for ${cls.length?cls.join(', '):'every class'}.`;
    buildSpellClassSelect(); buildSpellLibrary(); renderSpellImportedList(); buildLibraryEditSelects(); refreshTagPickers();
  }catch(err){
    msg.className = 'import-msg err';
    msg.textContent = 'Import failed: ' + err.message;
  }
}

function renderSpellImportedList(){
  const box = document.getElementById('spellImportedList');
  if(!box) return;
  const customs = Object.entries(CUSTOM_SPELLS);
  if(!customs.length){ box.innerHTML=''; return; }
  box.innerHTML = '<div class="picker-hint" style="margin-bottom:6px;">Imported spells</div>' + customs.map(([n,s])=>`
    <div class="imported-item">
      <span class="ii-name">${esc(n)} <span class="chip-abbr">${levelLabel(Number(s.level)||0)}</span></span>
      ${sourceTag(s.source)}
      <span class="ii-edit" data-name="${esc(n)}" title="Load into the form to edit">✎</span>
      <span class="row-del" data-id="${s.customId}" data-name="${esc(n)}">✕</span>
    </div>`).join('');
  box.querySelectorAll('.ii-edit').forEach(btn=>btn.addEventListener('click', e=>{
    fillSpellForm(e.target.dataset.name);
  }));
  box.querySelectorAll('.row-del').forEach(btn=>btn.addEventListener('click', e=>
    deleteSpellEntry(e.target.dataset.id, e.target.dataset.name)));
}

async function deleteSpellEntry(id, name){
  if(!confirm(`Remove imported spell "${name}"?`)) return false;
  await apiDeleteSpell(id);
  delete CUSTOM_SPELLS[name];
  buildSpellClassSelect(); buildSpellLibrary(); renderSpellImportedList(); buildLibraryEditSelects(); refreshTagPickers();
  return true;
}

function bindSpellImport(){
  document.getElementById('splJsonToggle').addEventListener('click', ()=>{
    const w = document.getElementById('splJsonWrap');
    w.style.display = (w.style.display==='none') ? '' : 'none';
  });
  document.getElementById('splSchool')?.addEventListener('change', ()=>
    toggleSelectOther('splSchool', 'splSchoolOther'));
  document.getElementById('splCastTime')?.addEventListener('change', e=>{
    toggleSelectOther('splCastTime', 'splCastTimeOther');
    // A reaction casting time also carries the Reaction tag, so the spell
    // surfaces under the Actions tab's Reactions list.
    if(e.target.value === '1 Reaction'){
      const tags = getTagPicker('splTagPicker');
      if(!tags.some(t=>/^reaction$/i.test(t))) setTagPicker('splTagPicker', [...tags, 'Reaction']);
    }
  });
  document.getElementById('splSubmit').addEventListener('click', ()=>{
    const jsonWrap = document.getElementById('splJsonWrap');
    const jsonText = document.getElementById('splJson').value.trim();
    if(jsonWrap.style.display!=='none' && jsonText){
      let obj;
      try { obj = JSON.parse(jsonText); }
      catch(e){
        const m = document.getElementById('splMsg');
        m.className = 'import-msg err'; m.textContent = 'Invalid JSON: ' + e.message;
        return;
      }
      const { name, source, data, ...rest } = obj;
      submitSpellImport({ name, source, data: data || rest });
    } else {
      submitSpellImport();
    }
  });
}

// ---------- Bulk import (Library tab) ----------
// One JSON payload can carry many entries of every type. Entries are keyed by
// object type + name (subclasses/subspecies also by parent) so the batch is
// deduplicated the same way the database is — the same key overwrites rather
// than duplicating. Classes and species import before their subclasses and
// subspecies so a parent defined in the same batch is available to its children.
const BULK_TYPE_ALIASES = {
  class:'class', classes:'class',
  species:'species',
  subclass:'subclass', subclasses:'subclass',
  subspecies:'subspecies',
  spell:'spell', spells:'spell'
};
const BULK_TYPE_ORDER = { class:0, species:1, subclass:2, subspecies:3, spell:4 };

function bulkTypeFromString(s){
  return BULK_TYPE_ALIASES[String(s||'').trim().toLowerCase().replace(/[\s_-]+/g,'')] || null;
}

// Best-effort type guess for entries that omit an explicit `type`, based on the
// shape of their fields.
function inferBulkType(o){
  const d = (o && o.data && typeof o.data==='object') ? o.data : o;
  if(!d || typeof d!=='object') return null;
  if(o.parent!=null){
    if('subclassLevel' in d || Array.isArray(d.features)) return 'subclass';
    if(Array.isArray(d.traits) || 'asi' in d) return 'subspecies';
    return null;
  }
  if('hitDie' in d || 'saves' in d || Array.isArray(d.subclasses)) return 'class';
  if('level' in d || 'castingTime' in d || 'school' in d) return 'spell';
  if('size' in d || 'speed' in d || Array.isArray(d.traits)) return 'species';
  return null;
}

// Turn one raw object into a normalized {type,name,parent,source,data} entry,
// or {error} when the type can't be resolved. `typeHint` comes from a grouped
// payload's key (e.g. "classes") and wins over the object's own `type`.
function normalizeBulkEntry(o, typeHint){
  if(!o || typeof o!=='object' || Array.isArray(o)) return { error:'not an object' };
  const { name, source, parent, data, type, ...rest } = o;
  const t = typeHint || bulkTypeFromString(type) || inferBulkType(o);
  if(!t) return { error:'unknown type' };
  const entry = {
    type: t,
    name: typeof name==='string' ? name.trim() : '',
    source,
    data: (data && typeof data==='object' && !Array.isArray(data)) ? data : rest
  };
  if(t==='subclass' || t==='subspecies') entry.parent = typeof parent==='string' ? parent.trim() : '';
  return entry;
}

// Flatten any accepted shape (array of typed entries, grouped object of
// type→array, or a single entry) into a list of normalized entries.
function collectBulkEntries(root){
  const list = [];
  if(Array.isArray(root)){
    root.forEach(o=> list.push(normalizeBulkEntry(o)));
  } else if(root && typeof root==='object'){
    const groups = Object.keys(root).filter(k=> bulkTypeFromString(k) && Array.isArray(root[k]));
    if(groups.length){
      groups.forEach(k=>{
        const t = bulkTypeFromString(k);
        root[k].forEach(o=> list.push(normalizeBulkEntry(o, t)));
      });
    } else {
      list.push(normalizeBulkEntry(root));
    }
  }
  return list;
}

// Import a single normalized entry: hit the matching endpoint and merge the
// result into the in-memory registry, mirroring the per-form submit handlers
// (but without their per-item UI rebuilds — the bulk flow refreshes once).
async function importOneBulk(e){
  const source = CLASS_SOURCES.includes(e.source) ? e.source : 'Homebrew';
  if(e.type==='class'){
    const res = await apiImportClass({ name:e.name, source, data:e.data });
    CLASS_DATA[e.name] = Object.assign({}, e.data, { source, homebrew:source==='Homebrew', custom:true, customId:res.id, builtin:false });
  } else if(e.type==='species'){
    const res = await apiImportSpecies({ name:e.name, source, data:e.data });
    SPECIES_DATA[e.name] = Object.assign({}, e.data, { source, custom:true, customId:res.id, builtin:false });
  } else if(e.type==='subclass'){
    if(!CLASS_DATA[e.parent]) throw new Error(`unknown parent class "${e.parent}"`);
    const res = await apiImportSubclass({ parent:e.parent, name:e.name, source, data:e.data });
    SUBCLASS_DATA[subKey(e.parent, e.name)] = Object.assign({ parent:e.parent, name:e.name }, e.data, { source, custom:true, customId:res.id });
  } else if(e.type==='subspecies'){
    if(!SPECIES_DATA[e.parent]) throw new Error(`unknown parent species "${e.parent}"`);
    const res = await apiImportSubspecies({ parent:e.parent, name:e.name, source, data:e.data });
    SUBSPECIES_DATA[subspKey(e.parent, e.name)] = Object.assign({ parent:e.parent, name:e.name }, e.data, { source, custom:true, customId:res.id });
  } else if(e.type==='spell'){
    const res = await apiImportSpell({ name:e.name, source, data:e.data });
    CUSTOM_SPELLS[e.name] = Object.assign({}, e.data, { source, custom:true, customId:res.id });
  }
}

// Rebuild every Library list, picker, and edit select in one pass after a batch.
function refreshLibraryAfterBulk(){
  buildClassFilterBar(); buildClassList(); renderClassInfoStack(); buildClassFeatures(); buildActions();
  buildSpeciesSelect(); buildSubraceSelect(); renderSpeciesInfo(); buildSpeciesTraits();
  buildSpellClassSelect(); buildSpellLibrary();
  buildSubclassParentSelect(); buildSubspeciesParentSelect();
  renderImportedList(); renderSpeciesImportedList(); renderSubclassImportedList();
  renderSubspeciesImportedList(); renderSpellImportedList();
  buildLibraryEditSelects(); refreshTagPickers();
}

function setBulkMsg(kind, html){
  const msg = document.getElementById('bulkMsg');
  if(!msg) return;
  msg.className = 'import-msg ' + kind;
  msg.innerHTML = html;
}

async function submitBulkImport(){
  const raw = (document.getElementById('bulkJson').value || '').trim();
  if(!raw){ setBulkMsg('err', 'Paste JSON containing one or more entries to import.'); return; }
  let root;
  try { root = JSON.parse(raw); }
  catch(e){ setBulkMsg('err', 'Invalid JSON: ' + esc(e.message)); return; }

  const collected = collectBulkEntries(root);
  if(!collected.length){
    setBulkMsg('err', 'No importable entries found. Provide an array of typed entries, a { "classes":[…], "spells":[…] } object, or a single entry.');
    return;
  }

  // Validate + dedupe by type + parent + name (case-insensitive; last wins).
  const problems = [];
  const byKey = new Map();
  let dupes = 0;
  collected.forEach((e, i)=>{
    const n = i + 1;
    if(e.error){ problems.push(`#${n}: ${e.error} — add a "type" field (class, species, subclass, subspecies, or spell).`); return; }
    if(!e.name){ problems.push(`#${n} (${e.type}): missing name.`); return; }
    if((e.type==='subclass' || e.type==='subspecies') && !e.parent){ problems.push(`#${n} (${e.type} "${e.name}"): missing parent.`); return; }
    if(!e.data || typeof e.data!=='object' || Array.isArray(e.data) || !Object.keys(e.data).length){
      problems.push(`#${n} (${e.type} "${e.name}"): missing data fields.`); return;
    }
    const key = e.type + '\0' + (e.parent||'').toLowerCase() + '\0' + e.name.toLowerCase();
    if(byKey.has(key)) dupes++;
    byKey.set(key, e);
  });

  const queue = [...byKey.values()].sort((a,b)=> BULK_TYPE_ORDER[a.type] - BULK_TYPE_ORDER[b.type]);
  if(!queue.length){
    setBulkMsg('err', 'Nothing could be imported.<br>' + problems.map(esc).join('<br>'));
    return;
  }

  setBulkMsg('ok', `Importing ${queue.length} entr${queue.length===1?'y':'ies'}…`);
  const counts = {};
  const failed = [];
  for(const e of queue){
    try { await importOneBulk(e); counts[e.type] = (counts[e.type]||0) + 1; }
    catch(err){ failed.push(`${e.type} "${esc(e.name)}": ${esc(err.message)}`); }
  }
  refreshLibraryAfterBulk();

  const PLURALS = { class:'classes', species:'species', subclass:'subclasses', subspecies:'subspecies', spell:'spells' };
  const done = Object.values(counts).reduce((a,b)=>a+b, 0);
  const breakdown = Object.keys(counts).sort((a,b)=>BULK_TYPE_ORDER[a]-BULK_TYPE_ORDER[b])
    .map(t=>`${counts[t]} ${counts[t]>1 ? PLURALS[t] : t}`).join(', ');
  const lines = [];
  lines.push(`<strong>Imported ${done} entr${done===1?'y':'ies'}</strong>${breakdown?` — ${esc(breakdown)}`:''}.`);
  if(dupes) lines.push(`${dupes} in-batch duplicate${dupes>1?'s':''} merged by type + name.`);
  if(problems.length) lines.push(`Skipped ${problems.length}: ${problems.map(esc).join('; ')}`);
  if(failed.length) lines.push(`Failed ${failed.length}: ${failed.join('; ')}`);
  setBulkMsg(failed.length || problems.length ? 'err' : 'ok', lines.join('<br>'));
}

// Fill the box with every imported entry in the bulk format, so a library can be
// copied out and re-imported (round-trips through submitBulkImport).
function exportLibraryJson(){
  const strip = (obj)=>{ const { source, custom, customId, builtin, homebrew, parent, name, ...rest } = obj; return rest; };
  const entries = [];
  Object.entries(CLASS_DATA).filter(([,d])=>d.custom).forEach(([name,d])=> entries.push({ type:'class', name, source:d.source, data:strip(d) }));
  Object.entries(SPECIES_DATA).filter(([,d])=>d.custom).forEach(([name,d])=> entries.push({ type:'species', name, source:d.source, data:strip(d) }));
  Object.values(SUBCLASS_DATA).filter(d=>d.custom).forEach(d=> entries.push({ type:'subclass', parent:d.parent, name:d.name, source:d.source, data:strip(d) }));
  Object.values(SUBSPECIES_DATA).filter(d=>d.custom).forEach(d=> entries.push({ type:'subspecies', parent:d.parent, name:d.name, source:d.source, data:strip(d) }));
  Object.entries(CUSTOM_SPELLS).forEach(([name,d])=> entries.push({ type:'spell', name, source:d.source, data:strip(d) }));
  const box = document.getElementById('bulkJson');
  if(box) box.value = JSON.stringify(entries, null, 2);
  setBulkMsg(entries.length?'ok':'err', entries.length
    ? `Exported ${entries.length} imported entr${entries.length===1?'y':'ies'} into the box.`
    : 'No imported entries to export yet.');
}

function bindBulkImport(){
  const submit = document.getElementById('bulkSubmit');
  if(!submit) return;
  submit.addEventListener('click', submitBulkImport);
  document.getElementById('bulkExport')?.addEventListener('click', exportLibraryJson);
  const file = document.getElementById('bulkFile');
  file?.addEventListener('change', ()=>{
    const f = file.files && file.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      document.getElementById('bulkJson').value = reader.result || '';
      setBulkMsg('ok', `Loaded "${esc(f.name)}" — review it, then press Import All.`);
    };
    reader.onerror = ()=> setBulkMsg('err', `Could not read "${esc(f.name)}".`);
    reader.readAsText(f);
    file.value = ''; // allow re-selecting the same file
  });
}

// ---------- Load-existing pickers (Library tab) ----------
// Every panel gets a dropdown listing built-in AND imported entries; picking
// one fills the form so it can be tweaked and re-imported. Saving under the
// same name overwrites the entry (built-ins become imported overrides);
// saving under a new name creates a copy.

function setImportMsg(id, name){
  const msg = document.getElementById(id);
  if(!msg) return;
  msg.className = 'import-msg ok';
  msg.textContent = `Loaded "${name}" into the form — edit and press Import to save. Same name overwrites; a new name makes a copy.`;
}

// features [{lv,name,desc,use,cost}] → "lv | name | desc | use | cost" lines.
function featuresToLines(features){
  return (features||[]).map(f=>{
    const parts = [f.lv, f.name, f.desc||'', f.use||'', f.cost||'', (f.choices||[]).join('; ')]
      .map(p=>String(p==null?'':p));
    while(parts.length>2 && !parts[parts.length-1]) parts.pop();
    return parts.join(' | ');
  }).join('\n');
}
function traitsToLines(traits){
  return (traits||[]).map(t=> t.desc ? `${t.name} | ${t.desc}` : t.name).join('\n');
}

// Show/hide a form's Delete button. Only imported (custom) entries can be
// deleted; built-ins loaded for editing hide the button. `entry` is the deletion
// target ({id, name[, parent]}) or null to hide.
function setFormDelete(btnId, entry){
  const btn = document.getElementById(btnId);
  if(!btn) return;
  if(entry && entry.id != null){
    btn.style.display = '';
    btn.dataset.id = entry.id;
    btn.dataset.name = entry.name;
    if(entry.parent != null) btn.dataset.parent = entry.parent; else delete btn.dataset.parent;
  } else {
    btn.style.display = 'none';
    delete btn.dataset.id;
  }
}

// After deleting from an edit form: hide the Delete button and confirm in the
// form's message line.
function afterFormDelete(btnId, msgId, name){
  const btn = document.getElementById(btnId);
  if(btn){ btn.style.display = 'none'; delete btn.dataset.id; }
  const msg = document.getElementById(msgId);
  if(msg){ msg.className = 'import-msg ok'; msg.textContent = `Deleted "${name}".`; }
}

function fillClassForm(name){
  const cd = CLASS_DATA[name];
  if(!cd) return;
  document.getElementById('impName').value = name;
  document.getElementById('impSource').value = CLASS_SOURCES.includes(cd.source) ? cd.source : 'Homebrew';
  document.getElementById('impHitDie').value = String(cd.hitDie||8);
  document.querySelectorAll('#impSaves .mini-toggle').forEach(t=>
    t.classList.toggle('on', (cd.saves||[]).includes(t.dataset.k)));
  document.getElementById('impChoose').value = cd.choose||0;
  document.getElementById('impSubLevel').value = cd.subclassLevel||3;
  document.getElementById('impSkills').value = Array.isArray(cd.skills) ? cd.skills.join(', ') : '';
  document.getElementById('impSubclasses').value = (cd.subclasses||[]).join(', ');
  document.getElementById('impCasting').value = (cd.casting&&cd.casting.type)||'none';
  document.getElementById('impCastAbility').value = (cd.casting&&cd.casting.ability)||'';
  document.getElementById('impDesc').value = cd.desc||'';
  document.getElementById('impFeatures').value = featuresToLines(cd.features);
  setFormDelete('impDelete', cd.custom ? { id: cd.customId, name } : null);
  setImportMsg('impMsg', name);
}

function fillSpeciesForm(name){
  const sd = SPECIES_DATA[name];
  if(!sd) return;
  document.getElementById('spName').value = name;
  document.getElementById('spSource').value = CLASS_SOURCES.includes(sd.source) ? sd.source : 'Homebrew';
  document.getElementById('spSize').value = sd.size||'Medium';
  document.getElementById('spSpeed').value = sd.speed||30;
  document.getElementById('spDarkvision').value = sd.darkvision||0;
  document.getElementById('spAsi').value = sd.asi||'';
  document.getElementById('spLanguages').value = sd.languages||'';
  document.getElementById('spDesc').value = sd.desc||'';
  document.getElementById('spTraits').value = traitsToLines(sd.traits);
  setFormDelete('spDelete', sd.custom ? { id: sd.customId, name } : null);
  setImportMsg('spMsg', name);
}

function fillBackgroundForm(name){
  const bd = BACKGROUND_DATA[name];
  if(!bd) return;
  document.getElementById('bgName').value = name;
  document.getElementById('bgSource').value = CLASS_SOURCES.includes(bd.source) ? bd.source : 'Homebrew';
  document.getElementById('bgSkills').value = (bd.skills||[]).join(', ');
  document.getElementById('bgTools').value = bd.tools||'';
  document.getElementById('bgLanguages').value = bd.languages||'';
  document.getElementById('bgEquipment').value = bd.equipment||'';
  document.getElementById('bgDesc').value = bd.desc||'';
  document.getElementById('bgFeatureName').value = (bd.feature&&bd.feature.name)||'';
  document.getElementById('bgFeatureDesc').value = (bd.feature&&bd.feature.desc)||'';
  setFormDelete('bgDelete', bd.custom ? { id: bd.customId, name } : null);
  setImportMsg('bgMsg', name);
}

function fillSubclassForm(parent, name){
  const cd = CLASS_DATA[parent];
  if(!cd) return;
  const sc = SUBCLASS_DATA[subKey(parent, name)];
  buildSubclassParentSelect();
  document.getElementById('subParent').value = parent;
  document.getElementById('subName').value = name;
  const source = sc ? sc.source : cd.source;
  document.getElementById('subSource').value = CLASS_SOURCES.includes(source) ? source : 'Homebrew';
  document.getElementById('subLevel').value = (sc && sc.subclassLevel) || cd.subclassLevel || 3;
  document.getElementById('subDesc').value = (sc && sc.desc)||'';
  document.getElementById('subFeatures').value = featuresToLines(sc && sc.features);
  setFormDelete('subDelete', (sc && sc.custom) ? { id: sc.customId, parent, name } : null);
  setImportMsg('subMsg', `${name} (${parent})`);
}

function fillSubspeciesForm(parent, name){
  const sd = SPECIES_DATA[parent];
  if(!sd) return;
  const ss = SUBSPECIES_DATA[subspKey(parent, name)];
  buildSubspeciesParentSelect();
  document.getElementById('subspParent').value = parent;
  document.getElementById('subspName').value = name;
  const source = ss ? ss.source : sd.source;
  document.getElementById('subspSource').value = CLASS_SOURCES.includes(source) ? source : 'Homebrew';
  document.getElementById('subspAsi').value = (ss && ss.asi)||'';
  document.getElementById('subspDesc').value = (ss && ss.desc)||'';
  document.getElementById('subspTraits').value = traitsToLines(ss && ss.traits);
  setFormDelete('subspDelete', (ss && ss.custom) ? { id: ss.customId, parent, name } : null);
  setImportMsg('subspMsg', `${name} (${parent})`);
}

// Which built-in class lists carry a spell — used to prefill its class list.
// Folds in school + description from SPELL_DETAILS so editing a built-in
// spell in the Library starts from its reference data.
function builtinSpellInfo(name){
  const classes = [];
  let level = 0;
  SPELL_CLASSES.forEach(c=>{
    const hit = SPELL_DATA[c].find(s=>s.name===name);
    if(hit){ classes.push(c); level = hit.level; }
  });
  return classes.length ? Object.assign({}, SPELL_DETAILS[name]||{}, { level, classes }) : null;
}

function fillSpellForm(name){
  const imp = CUSTOM_SPELLS[name];
  const info = imp || builtinSpellInfo(name);
  if(!info) return;
  document.getElementById('splName').value = name;
  document.getElementById('splSource').value = CLASS_SOURCES.includes(info.source) ? info.source : (imp ? 'Homebrew' : '5E');
  document.getElementById('splLevel').value = Number(info.level)||0;
  document.getElementById('splClasses').value = (info.classes||[]).join(', ');
  setSelectOther('splSchool', 'splSchoolOther', info.school||'');
  setSelectOther('splCastTime', 'splCastTimeOther', info.castingTime||'');
  document.getElementById('splRange').value = info.range||'';
  document.getElementById('splComponents').value = info.components||'';
  document.getElementById('splDuration').value = info.duration||'';
  setTagPicker('splTagPicker', info.tags||[]);
  document.getElementById('splDesc').value = info.desc||'';
  setFormDelete('splDelete', imp ? { id: imp.customId, name } : null);
  setImportMsg('splMsg', name);
}

function buildLibraryEditSelects(){
  const fill = (id, options)=>{
    const sel = document.getElementById(id);
    if(!sel) return;
    sel.innerHTML = '<option value="">— pick an entry to edit —</option>' + options;
  };
  const tag = obj => obj.custom ? 'imported' : 'built-in';
  fill('impEdit', Object.keys(CLASS_DATA).sort().map(n=>
    `<option value="${esc(n)}">${esc(n)} · ${CLASS_DATA[n].source} · ${tag(CLASS_DATA[n])}</option>`).join(''));
  fill('spEdit', Object.keys(SPECIES_DATA).sort().map(n=>
    `<option value="${esc(n)}">${esc(n)} · ${SPECIES_DATA[n].source} · ${tag(SPECIES_DATA[n])}</option>`).join(''));
  fill('bgEdit', Object.keys(BACKGROUND_DATA).sort().map(n=>
    `<option value="${esc(n)}">${esc(n)} · ${BACKGROUND_DATA[n].source} · ${tag(BACKGROUND_DATA[n])}</option>`).join(''));
  // Subclasses: built-in name lists on each class plus imported records.
  const subEntries = [];
  Object.keys(CLASS_DATA).forEach(parent=>
    subclassNamesForClass(parent).forEach(n=>{
      const sc = SUBCLASS_DATA[subKey(parent, n)];
      subEntries.push({ parent, name:n, label:`${n} — ${parent} · ${sc?sc.source+' · imported':'built-in'}` });
    }));
  fill('subEdit', subEntries.sort((a,b)=>a.label.localeCompare(b.label)).map(s=>
    `<option value="${esc(subKey(s.parent, s.name))}">${esc(s.label)}</option>`).join(''));
  // Subspecies: built-in subrace name lists on each species plus imported records.
  const subspEntries = [];
  Object.keys(SPECIES_DATA).forEach(parent=>
    subspeciesNamesForSpecies(parent).forEach(n=>{
      const ss = SUBSPECIES_DATA[subspKey(parent, n)];
      subspEntries.push({ parent, name:n, label:`${n} — ${parent} · ${ss?(ss.custom?ss.source+' · imported':ss.source):'built-in'}` });
    }));
  fill('subspEdit', subspEntries.sort((a,b)=>a.label.localeCompare(b.label)).map(s=>
    `<option value="${esc(subspKey(s.parent, s.name))}">${esc(s.label)}</option>`).join(''));
  // Spells: unique built-in names plus imported ones (imported shadow built-ins).
  const spellNames = new Set(Object.keys(CUSTOM_SPELLS));
  SPELL_CLASSES.forEach(c=> SPELL_DATA[c].forEach(s=> spellNames.add(s.name)));
  fill('splEdit', [...spellNames].sort().map(n=>{
    const imp = CUSTOM_SPELLS[n];
    const lvl = imp ? (Number(imp.level)||0) : (builtinSpellInfo(n)||{}).level;
    return `<option value="${esc(n)}">${esc(n)} · ${levelLabel(lvl||0)} · ${imp?imp.source+' · imported':'built-in'}</option>`;
  }).join(''));
}

function bindLibraryEditSelects(){
  const wire = (id, fn)=>{
    const sel = document.getElementById(id);
    if(sel) sel.addEventListener('change', ()=>{ if(sel.value) fn(sel.value); });
  };
  wire('impEdit', fillClassForm);
  wire('spEdit', fillSpeciesForm);
  wire('bgEdit', fillBackgroundForm);
  wire('subEdit', key=>{
    const i = key.indexOf('::');
    if(i>0) fillSubclassForm(key.slice(0,i), key.slice(i+2));
  });
  wire('subspEdit', key=>{
    const i = key.indexOf('::');
    if(i>0) fillSubspeciesForm(key.slice(0,i), key.slice(i+2));
  });
  wire('splEdit', fillSpellForm);

  // Edit-form Delete buttons: fully remove the loaded imported entry. The
  // dataset is set by the matching fillXForm via setFormDelete().
  const wireDelete = (btnId, msgId, del)=>{
    const btn = document.getElementById(btnId);
    if(!btn) return;
    btn.addEventListener('click', async ()=>{
      if(!btn.dataset.id) return;
      const name = btn.dataset.name;
      if(await del(btn.dataset)) afterFormDelete(btnId, msgId, name);
    });
  };
  wireDelete('impDelete',   'impMsg',   d=>deleteClassEntry(d.id, d.name));
  wireDelete('spDelete',    'spMsg',    d=>deleteSpeciesEntry(d.id, d.name));
  wireDelete('bgDelete',    'bgMsg',    d=>deleteBackgroundEntry(d.id, d.name));
  wireDelete('subDelete',   'subMsg',   d=>deleteSubclassEntry(d.id, d.parent, d.name));
  wireDelete('subspDelete', 'subspMsg', d=>deleteSubspeciesEntry(d.id, d.parent, d.name));
  wireDelete('splDelete',   'splMsg',   d=>deleteSpellEntry(d.id, d.name));
}

// ---------- Save status indicator ----------
function setSaveStatus(status){
  const el = document.getElementById('saveStatus');
  if(!el) return;
  if(status==='saving'){ el.textContent='Saving…'; el.classList.add('saving'); }
  else if(status==='error'){ el.textContent='Save failed — check the server'; el.classList.remove('saving'); }
  else { el.textContent='Saved'; el.classList.remove('saving'); }
}

// ---------- Debounced autosave to the local database ----------
let saveTimeout=null;
function save(){
  if(PAGE!=='sheet') return; // no character is loaded on standalone pages
  if(VIEW_ONLY && !BORROWED_EDIT) return; // DM viewing another player's sheet — never write back
  clearTimeout(saveTimeout);
  setSaveStatus('saving');
  saveTimeout = setTimeout(async ()=>{
    try{
      if(state.id){
        await apiUpdateCharacter(state.id, state.name, state);
      } else {
        const res = await apiCreateCharacter(state.name, state);
        state.id = res.id;
      }
      // A borrowed character isn't one of this user's profiles — no list to sync.
      if(!BORROWED_EDIT) await refreshProfileList(state.id);
      setSaveStatus('saved');
    }catch(err){
      console.error('Save failed', err);
      setSaveStatus('error');
    }
  }, 500);
}

// ---------- Profile bar ----------
async function refreshProfileList(selectedId){
  const list = await apiListCharacters();
  const sel = document.getElementById('profileSelect');
  if(list.length===0){
    sel.innerHTML = '<option value="">No saved characters</option>';
    return;
  }
  sel.innerHTML = list.map(c=>
    `<option value="${c.id}" ${String(c.id)===String(selectedId)?'selected':''}>${(c.name||'Unnamed')} — ${c.class||'?'} ${c.level||1}</option>`
  ).join('');
}

function buildAlignmentSelect(){
  const sel = document.getElementById('charAlignment');
  const names = ALIGNMENTS.map(a=>a.name);
  sel.innerHTML = '<option value="">— unset —</option>'
    + ALIGNMENTS.map(a=>`<option value="${a.name}" ${state.alignment===a.name?'selected':''}>${a.abbr==='—'?'':a.abbr+' · '}${a.name}</option>`).join('');
  // Preserve any pre-existing free-text alignment that isn't in the list.
  if(state.alignment && !names.includes(state.alignment)){
    sel.insertAdjacentHTML('beforeend', `<option value="${state.alignment}" selected>${state.alignment} (custom)</option>`);
  }
}

// Static rules reference — built once; content doesn't change per character.
function buildNotes(){
  const grid = document.getElementById('alignGrid');
  if(grid && !grid.dataset.built){
    grid.innerHTML = ALIGNMENTS.map(a=>`
      <div class="align-card">
        <div><span class="a-abbr">${a.abbr}</span><span class="a-name">${a.name}</span></div>
        <div class="a-desc">${a.desc}</div>
        <div class="a-eg"><b>e.g.</b> ${a.eg}</div>
      </div>`).join('');
    grid.dataset.built = '1';
  }
  const mgrid = document.getElementById('masteryGrid');
  if(mgrid && !mgrid.dataset.built){
    mgrid.innerHTML = MASTERY_PROPERTIES.map(m=>`
      <div class="align-card">
        <div><span class="a-name">${m.name}</span></div>
        <div class="a-desc">${m.desc}</div>
        <div class="mastery-weapons">${m.weapons.map(w=>`<span class="mastery-chip">${w}</span>`).join('')}</div>
      </div>`).join('');
    mgrid.dataset.built = '1';
  }
}

// ---------- Notes page: reference search ----------
// A flat index over everything the app knows — built-in and imported classes,
// their features, subclasses, species & traits, spells, standard actions, and
// alignments — so the Notes page can look any of it up by name or text.
let NOTES_INDEX = [];
let notesFilter = 'All';
let notesSourceFilter = 'All'; // source-tag filter (5E, 5.5E, Homebrew…), independent of the type filter
let notesBrowsePage = 0; // current page when browsing a type filter with no search query
const NOTES_PAGE_SIZE = 20;
// Features and standard combat actions are deliberately absent: features are
// reachable through the class/subclass entry that owns them (their text is folded
// into that entry's haystack), so they don't clutter the results as separate rows.
const NOTES_TYPES = ['All','Classes','Species','Spells','Companions','Fighting Styles','Alignments','Mastery'];
// Subclasses and subspecies stay in the index (the chips inside a class/species
// window open them by key) but never appear as their own search/browse results —
// searching one by name surfaces its parent instead.
const NOTES_HIDDEN_TYPES = new Set(['Subclasses','Subspecies']);

function notesEntry(type, name, source, badges, haystack, detail, edit){
  return { type, name, source: source || 'Other', badges: badges.filter(Boolean).map(String),
    text: (name + ' ' + haystack).toLowerCase(), detail, edit };
}

// True when an entry passes the active source-tag filter.
function notesSourceMatch(e){ return notesSourceFilter==='All' || e.source===notesSourceFilter; }

// Deep link into the Import page's forms: /import?edit=<type>:<key>.
// The Import page loads the entry into the matching form (see openLibraryEditParam).
function editLink(type, key, label){
  return { href: '/import?edit=' + type + ':' + encodeURIComponent(key), label };
}

// Level-tagged feature list used inside the detail popup for classes and subclasses.
function classFeaturesHtml(features){
  return (features||[]).map(f=>`
    <div class="feat-item">
      <div class="feat-head"><span class="f-lvl">L${f.lv}</span><span class="f-name">${esc(f.name)}</span>
        ${f.use?`<span class="nr-badge">${esc(f.use)}</span>`:''}${f.cost?`<span class="nr-badge">${esc(f.cost)}</span>`:''}</div>
      ${f.desc?`<div class="feat-desc">${esc(f.desc)}</div>`:''}
    </div>`).join('');
}

function castingLabel(c){
  if(!c || c.type==='none') return 'non-caster';
  const ab = c.ability ? ' ('+c.ability.toUpperCase()+')' : '';
  return c.type==='full' ? 'full caster'+ab : c.type==='half' ? 'half caster'+ab : 'pact magic'+ab;
}

// Feature names/descriptions/choices, flattened into one string so a search for a
// feature still finds the class or subclass that grants it.
function featuresHaystack(features){
  return (features||[]).map(f=>
    [f.name, f.desc, f.use, f.cost, (f.choices||[]).join(' ')].filter(Boolean).join(' ')).join(' ');
}

function buildNotesIndex(){
  const ix = [];

  // Classes and their features.
  Object.entries(CLASS_DATA).forEach(([name, cd])=>{
    const skills = Array.isArray(cd.skills) ? cd.skills.join(', ') : 'any skill';
    const subNames = subclassNamesForClass(name); // built-in + imported
    const meta = `<div class="nr-meta">d${cd.hitDie||8} hit die · saves ${(cd.saves||[]).map(s=>s.toUpperCase()).join(' / ')||'—'} · ${esc(castingLabel(cd.casting))} · subclass at level ${cd.subclassLevel||'—'}</div>
       <div class="nr-meta">skills (choose ${cd.choose||0}): ${esc(skills)}</div>`;
    ix.push(Object.assign(notesEntry('Classes', name, cd.source, [cd.source, cd.custom?'imported':'built-in'],
      [cd.desc, skills, subNames.join(' '), castingLabel(cd.casting), featuresHaystack(cd.features)].filter(Boolean).join(' '),
      meta
      + `${subNames.length?`<div class="nr-meta">subclasses: ${esc(subNames.join(', '))}</div>`:''}`,
      editLink('class', name, 'Edit class in Library')),
      { full: meta
        + (subNames.length?`<div class="nr-sect">Subclasses — click to view</div><div class="nr-sub-list">${
            subNames.map(n=>`<span class="nr-sub-link" data-key="${esc(subKey(name, n))}">${esc(n)}</span>`).join('')}</div>`:'')
        + ((cd.features||[]).length?`<div class="nr-sect">Features</div>`+classFeaturesHtml(cd.features):'') }));
  });

  // Subclasses: imported records carry detail; built-in ones are name-only lists.
  const seenSubs = new Set();
  Object.values(SUBCLASS_DATA).forEach(sc=>{
    seenSubs.add(subKey(sc.parent, sc.name));
    const summary = `<div class="nr-meta">${esc(sc.parent)} subclass · chosen at level ${sc.subclassLevel||3}</div>
       ${sc.desc?`<div class="feat-desc">${esc(sc.desc)}</div>`:''}`;
    ix.push(Object.assign(notesEntry('Subclasses', sc.name, sc.source||'Homebrew', [sc.parent, sc.source||'Homebrew', 'imported'],
      [sc.desc, sc.parent, featuresHaystack(sc.features)].filter(Boolean).join(' '),
      summary,
      editLink('subclass', subKey(sc.parent, sc.name), 'Edit subclass in Library')),
      { key: subKey(sc.parent, sc.name),
        parent: { type:'Classes', name: sc.parent },
        full: summary + ((sc.features||[]).length?`<div class="nr-sect">Features</div>`+classFeaturesHtml(sc.features):'') }));
  });
  Object.entries(CLASS_DATA).forEach(([parent, cd])=>{
    (cd.subclasses||[]).forEach(n=>{
      if(seenSubs.has(subKey(parent, n))) return;
      ix.push(Object.assign(notesEntry('Subclasses', n, cd.source, [parent, 'built-in'], parent,
        `<div class="nr-meta">${esc(parent)} subclass · chosen at level ${cd.subclassLevel||3}</div>`,
        editLink('subclass', subKey(parent, n), 'Edit subclass in Library')),
        { key: subKey(parent, n),
          parent: { type:'Classes', name: parent },
          full: `<div class="nr-meta">${esc(parent)} subclass · chosen at level ${cd.subclassLevel||3}</div>
                 <div class="feat-desc">Name-only entry — import it in the Library to add a description and features.</div>` }));
    });
  });

  // Species with their traits inline; subraces listed as click-through chips.
  Object.entries(SPECIES_DATA).forEach(([name, sd])=>{
    const traits = sd.traits||[];
    const subNames = subspeciesNamesForSpecies(name); // built-in + imported
    const detail = `<div class="nr-meta">${esc(sd.size||'Medium')} · ${sd.speed||30} ft${sd.darkvision?' · darkvision '+sd.darkvision+' ft':''}${sd.asi?' · '+esc(sd.asi):''}</div>
       ${sd.languages?`<div class="nr-meta">languages: ${esc(sd.languages)}</div>`:''}
       ${traits.map(t=>`<div class="feat-desc"><b>${esc(t.name)}</b>${t.desc?' — '+esc(t.desc):''}</div>`).join('')}`;
    ix.push(Object.assign(notesEntry('Species', name, sd.source, [sd.source, sd.custom?'imported':'built-in'],
      [sd.desc, sd.asi, sd.languages, subNames.join(' '), traits.map(t=>t.name+' '+(t.desc||'')).join(' ')].filter(Boolean).join(' '),
      detail,
      editLink('species', name, 'Edit species in Library')),
      { full: detail
        + (subNames.length?`<div class="nr-sect">Subraces — click to view</div><div class="nr-sub-list">${
            subNames.map(n=>`<span class="nr-sub-link" data-key="${esc(subspKey(name, n))}">${esc(n)}</span>`).join('')}</div>`:'') }));
  });

  // Subspecies (subraces): detailed records carry traits; species subrace
  // name-lists fill in the rest. Each links back to its parent species.
  const seenSubsp = new Set();
  Object.values(SUBSPECIES_DATA).forEach(ss=>{
    seenSubsp.add(subspKey(ss.parent, ss.name));
    const traits = ss.traits||[];
    const summary = `<div class="nr-meta">${esc(ss.parent)} subrace${ss.asi?' · '+esc(ss.asi):''}</div>
       ${ss.desc?`<div class="feat-desc">${esc(ss.desc)}</div>`:''}`;
    ix.push(Object.assign(notesEntry('Subspecies', ss.name, ss.source||'Homebrew', [ss.parent, ss.source||'Homebrew', ss.custom?'imported':'built-in'],
      [ss.desc, ss.parent, ss.asi, traits.map(t=>t.name+' '+(t.desc||'')).join(' ')].filter(Boolean).join(' '),
      summary,
      editLink('subspecies', subspKey(ss.parent, ss.name), 'Edit subspecies in Library')),
      { key: subspKey(ss.parent, ss.name),
        parent: { type:'Species', name: ss.parent },
        full: summary + (traits.length?`<div class="nr-sect">Traits</div>`+traits.map(t=>`<div class="feat-desc"><b>${esc(t.name)}</b>${t.desc?' — '+esc(t.desc):''}</div>`).join(''):'') }));
  });
  Object.entries(SPECIES_DATA).forEach(([parent, sd])=>{
    (sd.subraces||[]).forEach(n=>{
      if(seenSubsp.has(subspKey(parent, n))) return;
      ix.push(Object.assign(notesEntry('Subspecies', n, sd.source, [parent, 'built-in'], parent,
        `<div class="nr-meta">${esc(parent)} subrace</div>`,
        editLink('subspecies', subspKey(parent, n), 'Edit subspecies in Library')),
        { key: subspKey(parent, n),
          parent: { type:'Species', name: parent },
          full: `<div class="nr-meta">${esc(parent)} subrace</div>
                 <div class="feat-desc">Name-only entry — import it in the Library to add a description and traits.</div>` }));
    });
  });

  // Spells: imported entries carry full detail and shadow built-in names.
  const builtinSpells = {};
  SPELL_CLASSES.forEach(c=> SPELL_DATA[c].forEach(s=>{
    (builtinSpells[s.name] = builtinSpells[s.name] || {level:s.level, classes:[]}).classes.push(c);
  }));
  new Set([...Object.keys(CUSTOM_SPELLS), ...Object.keys(builtinSpells)]).forEach(name=>{
    const imp = CUSTOM_SPELLS[name];
    const bi = builtinSpells[name];
    // Imported spells carry their own data; built-ins get school + description
    // from the SPELL_DETAILS reference table.
    const det = imp || SPELL_DETAILS[name] || {};
    const level = imp ? Number(imp.level)||0 : bi.level;
    const classes = imp
      ? (Array.isArray(imp.classes) && imp.classes.length ? imp.classes : ['every class'])
      : bi.classes;
    const bits = [det.school, det.castingTime&&'cast '+det.castingTime, det.range&&'range '+det.range,
      det.components, det.duration&&'duration '+det.duration].filter(Boolean).join(' · ');
    ix.push(notesEntry('Spells', name, imp?imp.source:'5E', [levelLabel(level), imp?imp.source:null, imp?'imported':'built-in'],
      [classes.join(' '), det.school, det.desc, (det.tags||[]).join(' ')].filter(Boolean).join(' '),
      `<div class="nr-meta">${esc(levelLabel(level))} · ${esc(classes.join(', '))}</div>
       ${bits?`<div class="nr-meta">${esc(bits)}</div>`:''}
       ${(det.tags||[]).length?`<div class="nr-meta">tags: ${esc(det.tags.join(', '))}</div>`:''}
       ${det.desc?`<div class="feat-desc">${esc(det.desc)}</div>`:''}`,
      editLink('spell', name, 'Edit spell in Library')));
  });

  // Companions — every template from resources/companions.js, with its stat
  // block rendered at a baseline (see companionBaselineCtx) since no character
  // is loaded on the Library page. The sheet's auto-generate scales the real one.
  companionTemplates().forEach(t=>{
    const stats = t.build(companionBaselineCtx());
    const srcLine = `<div class="nr-meta">${esc(t.kind==='spell'?'Spell':'Class feature')} · ${esc(t.source)}</div>`;
    const summary = srcLine + `<div class="nr-meta">${esc(stats.typeLine||'')}</div>`;
    const hay = [t.source, stats.typeLine, stats.hpFormula,
      ...(stats.features||[]).map(f=>f.name+' '+f.desc),
      ...(stats.actions||[]).map(a=>a.name+' '+a.desc), 'companion'].filter(Boolean).join(' ');
    ix.push(Object.assign(
      notesEntry('Companions', t.name, 'Companion', [t.kind==='spell'?'Spell':'Feature', t.source.split(' — ')[0]], hay, summary),
      { full: srcLine + companionStatsHtml(stats) // stats html already leads with the type line
          + `<p class="nr-hint">Numbers shown for a baseline character (proficiency +2, +0 modifiers). Use <span class="hl">Auto-generate</span> on the Character tab to scale it to your character.</p>` }));
  });

  // Fighting styles — searchable by name, effect, or a class that can take one.
  FIGHTING_STYLES.forEach(s=> ix.push(notesEntry('Fighting Styles', s.name, s.source, [s.source, s.classes.join(' / ')],
    [s.desc, s.classes.join(' '), 'fighting style'].join(' '),
    `<div class="nr-meta">Available to: ${esc(s.classes.join(', '))}</div>
     <div class="feat-desc">${esc(s.desc)}</div>`)));

  ALIGNMENTS.forEach(a=> ix.push(notesEntry('Alignments', a.name, '5E', [a.abbr], a.desc+' '+a.eg,
    `<div class="feat-desc">${esc(a.desc)}</div><div class="nr-meta">e.g. ${esc(a.eg)}</div>`)));

  // Weapon Mastery properties — searchable by property name or any weapon that has it.
  MASTERY_PROPERTIES.forEach(m=> ix.push(notesEntry('Mastery', m.name, '5.5E', ['weapon mastery'],
    m.desc+' '+m.weapons.join(' '),
    `<div class="feat-desc">${esc(m.desc)}</div><div class="nr-meta">weapons: ${esc(m.weapons.join(', '))}</div>`)));

  return ix;
}

function renderNotesResults(){
  const box = document.getElementById('notesResults');
  const ref = document.getElementById('notesReference');
  if(!box) return;
  const q = (document.getElementById('notesSearch').value||'').trim().toLowerCase();
  if(!q){
    // No search query: browse mode. With no source filter, "All", "Alignments"
    // and "Mastery" keep the static reference below (filtered to the matching
    // panel); every other filter — or any active source filter — shows a
    // paginated list.
    if(notesSourceFilter==='All' && (notesFilter==='All' || notesFilter==='Alignments' || notesFilter==='Mastery')){
      box.innerHTML = '';
      if(ref){
        ref.style.display = '';
        const alignPanel = document.getElementById('alignmentPanel');
        const masteryPanel = document.getElementById('masteryPanel');
        if(alignPanel) alignPanel.style.display = notesFilter==='Mastery' ? 'none' : '';
        if(masteryPanel) masteryPanel.style.display = notesFilter==='Alignments' ? 'none' : '';
      }
    } else {
      renderNotesBrowse();
    }
    return;
  }
  if(ref) ref.style.display = 'none';
  const hits = NOTES_INDEX.filter(e=> !NOTES_HIDDEN_TYPES.has(e.type)
    && (notesFilter==='All' || e.type===notesFilter) && notesSourceMatch(e) && e.text.includes(q));
  if(!hits.length){
    const scope = (notesFilter==='All'?'':' in '+notesFilter) + (notesSourceFilter==='All'?'':' ('+notesSourceFilter+')');
    box.innerHTML = `<div class="action-empty">No matches for "${esc(q)}"${scope}.</div>`;
    return;
  }
  // Name matches outrank text-only matches; earlier match positions rank higher.
  hits.sort((a,b)=>{
    const an = a.name.toLowerCase().indexOf(q), bn = b.name.toLowerCase().indexOf(q);
    return ((an<0)-(bn<0)) || (an-bn) || a.name.localeCompare(b.name);
  });
  const MAX = 80;
  notesHits = hits.slice(0, MAX);
  const grouped = {};
  notesHits.forEach(e=> (grouped[e.type] = grouped[e.type]||[]).push(e));
  let html = '';
  NOTES_TYPES.slice(1).forEach(type=>{
    const list = grouped[type];
    if(!list) return;
    html += `<div class="nr-group">${type}</div>` + list.map(e=>`
      <div class="feat-item nr-item" data-i="${notesHits.indexOf(e)}" title="Click for full details">
        <div class="feat-head">
          <span class="f-name">${esc(e.name)}</span>
          ${e.badges.map(b=>`<span class="nr-badge">${esc(b)}</span>`).join('')}
        </div>
        ${e.detail}
      </div>`).join('');
  });
  if(hits.length > MAX) html += `<div class="picker-hint" style="margin-top:8px;">Showing the first ${MAX} of ${hits.length} matches — narrow the search.</div>`;
  box.innerHTML = html;
  // Clicking a result opens its detail popup (with the edit action, when editable).
  box.querySelectorAll('.nr-item').forEach(item=>{
    item.addEventListener('click', ()=> openNotesModal(notesHits[Number(item.dataset.i)]));
  });
}

// Browse mode: with no search query, a specific type filter lists every entry
// of that type, 20 per page, with prev/next paging. (All / Alignments / Mastery
// keep the static reference instead — see renderNotesResults.)
function renderNotesBrowse(){
  const box = document.getElementById('notesResults');
  const ref = document.getElementById('notesReference');
  if(!box) return;
  if(ref) ref.style.display = 'none';
  const all = NOTES_INDEX.filter(e=> !NOTES_HIDDEN_TYPES.has(e.type)
      && (notesFilter==='All' || e.type===notesFilter) && notesSourceMatch(e))
    .sort((a,b)=> a.name.localeCompare(b.name));
  const scopeLabel = (notesFilter==='All' ? 'entries' : notesFilter.toLowerCase())
    + (notesSourceFilter==='All' ? '' : ' tagged ' + notesSourceFilter);
  if(!all.length){
    notesHits = [];
    box.innerHTML = `<div class="action-empty">No ${esc(scopeLabel)} in the reference yet.</div>`;
    return;
  }
  const pageCount = Math.ceil(all.length / NOTES_PAGE_SIZE);
  notesBrowsePage = Math.min(Math.max(notesBrowsePage, 0), pageCount - 1);
  const start = notesBrowsePage * NOTES_PAGE_SIZE;
  const pageItems = all.slice(start, start + NOTES_PAGE_SIZE);
  notesHits = pageItems; // rows index into this via data-i, like search results
  let html = `<div class="nr-group">${esc(notesFilter==='All'?'All':notesFilter)}${notesSourceFilter==='All'?'':' · '+esc(notesSourceFilter)} — ${all.length} total</div>`
    + pageItems.map((e,i)=>`
      <div class="feat-item nr-item" data-i="${i}" title="Click for full details">
        <div class="feat-head">
          <span class="f-name">${esc(e.name)}</span>
          ${e.badges.map(b=>`<span class="nr-badge">${esc(b)}</span>`).join('')}
        </div>
        ${e.detail}
      </div>`).join('');
  if(pageCount > 1){
    html += `<div class="nr-pager">
      <button class="pbtn nr-page-prev" ${notesBrowsePage===0?'disabled':''}>‹ Prev</button>
      <span class="nr-page-info">Page ${notesBrowsePage+1} of ${pageCount}</span>
      <button class="pbtn nr-page-next" ${notesBrowsePage>=pageCount-1?'disabled':''}>Next ›</button>
    </div>`;
  }
  box.innerHTML = html;
  box.querySelectorAll('.nr-item').forEach(item=>{
    item.addEventListener('click', ()=> openNotesModal(notesHits[Number(item.dataset.i)]));
  });
  const prev = box.querySelector('.nr-page-prev');
  const next = box.querySelector('.nr-page-next');
  if(prev) prev.addEventListener('click', ()=>{ notesBrowsePage--; renderNotesBrowse(); });
  if(next) next.addEventListener('click', ()=>{ notesBrowsePage++; renderNotesBrowse(); });
}

// ---------- Notes detail popups (floating, draggable, edge-snappable) ----------
// Each opened entry becomes its own modeless window cloned from #nrWindowTpl and
// appended to #nrWindowLayer, so several can coexist. Drilling into a subclass /
// parent tag REPLACES content in the same window (with a per-window Back stack).
// Windows drag by their header and snap to viewport halves/quarters/full when
// dropped near an edge (Aero-style). Below NR_WIN_MOBILE they go full-screen and
// dragging is disabled. Also used by the sheet's Spells/Actions detail popups.
let notesHits = []; // entries behind the currently rendered result rows
let nrWindows = []; // open windows: { el, refs, stack, current, restore }
let nrTopZ = 1200;  // z-index high-water mark for click-to-front
let nrModalBound = false;
const NR_WIN_MOBILE = 640; // viewport width at/below which windows go full-screen
const NR_EDGE = 26;        // px from a viewport edge that arms a snap zone

// Viewport size, with fallbacks: some embedded/preview browsers report 0 for
// innerWidth. Treat an unknown (0) viewport as desktop rather than mobile.
function nrViewport(){
  return {
    w: window.innerWidth || document.documentElement.clientWidth || window.screen.width || 1024,
    h: window.innerHeight || document.documentElement.clientHeight || window.screen.height || 768
  };
}

function nrIsMobile(){ return nrViewport().w <= NR_WIN_MOBILE; }

// Public entry point: spawn a NEW window for an entry (from a result/browse row
// or a sheet spell/action). Returns the window object.
function openNotesModal(entry){
  const layer = document.getElementById('nrWindowLayer');
  const tpl = document.getElementById('nrWindowTpl');
  if(!layer || !tpl || !entry) return null;
  const el = tpl.content.firstElementChild.cloneNode(true);
  const win = {
    el, stack: [], current: null, restore: null,
    refs: {
      head:   el.querySelector('[data-role=head]'),
      back:   el.querySelector('[data-role=back]'),
      title:  el.querySelector('[data-role=title]'),
      badges: el.querySelector('[data-role=badges]'),
      body:   el.querySelector('[data-role=body]'),
      foot:   el.querySelector('[data-role=foot]'),
      close:  el.querySelector('[data-role=close]')
    }
  };
  layer.appendChild(el);
  nrWindows.push(win);
  win.refs.close.addEventListener('click', ()=> nrCloseWindow(win));
  win.refs.back.addEventListener('click', ()=> nrNavigate(win, null, 'pop'));
  el.addEventListener('mousedown', ()=> nrFocusWindow(win), true);
  nrEnableDrag(win);
  nrPlaceWindow(win);
  nrFocusWindow(win);
  nrNavigate(win, entry, 'fresh');
  nrUpdateClearAll();
  return win;
}

// Update a window's content in place. mode: 'fresh' | 'push' | 'pop'.
function nrNavigate(win, entry, mode){
  if(mode==='push'){ if(win.current) win.stack.push(win.current); win.current = entry; }
  else if(mode==='pop'){ win.current = win.stack.pop() || win.current; }
  else { win.stack = []; win.current = entry; }
  entry = win.current;
  if(!entry) return;
  const r = win.refs;
  r.back.hidden = win.stack.length === 0;
  r.title.textContent = entry.name;
  // The parent tag (a subclass's class, a subrace's species) is a live link to
  // that parent's own view, opened in this same window when it's in the index.
  const parentEntry = entry.parent
    ? NOTES_INDEX.find(e=> e.type===entry.parent.type && e.name===entry.parent.name) : null;
  r.badges.innerHTML = entry.badges.map(b=> (parentEntry && b===entry.parent.name)
    ? `<span class="nr-badge nr-parent-link" title="Open ${esc(b)}">${esc(b)} ↗</span>`
    : `<span class="nr-badge">${esc(b)}</span>`).join('');
  r.body.innerHTML = entry.full || entry.detail;
  r.foot.innerHTML = entry.edit
    ? `<a class="pbtn nr-edit-link" href="${entry.edit.href}">✎ ${esc(entry.edit.label)}</a>
       <span class="nr-hint">opens the Library form with this entry loaded — re-import to save changes</span>`
    : '<span class="nr-hint">Built-in rule — not editable.</span>';
  // Click follows the link in this window (Back returns); Alt+click opens the
  // target as its own new window instead, so both can sit side by side.
  r.body.querySelectorAll('.nr-sub-link').forEach(chip=>{
    chip.title = 'Click to view here — Alt+click opens a new window';
    chip.addEventListener('click', ev=>{
      const target = NOTES_INDEX.find(e=>e.key===chip.dataset.key);
      if(!target) return;
      if(ev.altKey) openNotesModal(target);
      else nrNavigate(win, target, 'push');
    });
  });
  if(parentEntry){
    const link = r.badges.querySelector('.nr-parent-link');
    if(link){
      link.title = `Open ${entry.parent.name} here — Alt+click opens a new window`;
      link.addEventListener('click', ev=>{
        if(ev.altKey) openNotesModal(parentEntry);
        else nrNavigate(win, parentEntry, 'push');
      });
    }
  }
  r.body.scrollTop = 0;
}

function nrFocusWindow(win){
  win.el.style.zIndex = String(++nrTopZ);
  nrWindows.forEach(w=> w.el.classList.toggle('focused', w===win));
}

function nrCloseWindow(win){
  win.el.remove();
  nrWindows = nrWindows.filter(w=> w!==win);
  nrUpdateClearAll();
}

function nrCloseAllWindows(){
  nrWindows.forEach(w=> w.el.remove());
  nrWindows = [];
  nrUpdateClearAll();
}

// Initial placement: mobile → full-screen; desktop → a cascading offset so
// stacked windows don't hide each other.
function nrPlaceWindow(win){
  if(nrIsMobile()){ win.el.classList.add('nr-window-max'); return; }
  const { w:vw, h:vh } = nrViewport();
  const w = Math.max(280, Math.min(460, vw - 40));
  const n = (nrWindows.length - 1) % 6;
  const x = Math.max(10, Math.round((vw - w) / 2 - 90) + n * 30);
  const y = Math.max(10, Math.round(vh / 2 - 260) + n * 30);
  win.el.style.width = w + 'px';
  win.el.style.left = x + 'px';
  win.el.style.top = y + 'px';
}

// ----- Dragging + Aero-style edge snapping -----
function nrEnableDrag(win){
  win.refs.head.addEventListener('mousedown', e=>{
    if(e.target.closest('button') || nrIsMobile()) return;
    e.preventDefault();
    nrFocusWindow(win);
    // Restore floating size before dragging a snapped window.
    if(win.el.classList.contains('nr-window-snapped')){
      win.el.classList.remove('nr-window-snapped');
      const rest = win.restore || {};
      win.el.style.width = rest.width || '460px';
      win.el.style.height = rest.height || '';
    }
    const rect = win.el.getBoundingClientRect();
    let offX = e.clientX - rect.left, offY = e.clientY - rect.top;
    if(offX > rect.width) offX = rect.width / 2; // was snapped wider than restore
    let zone = null;
    const onMove = ev=>{
      const { w:vw, h:vh } = nrViewport();
      const x = Math.max(-rect.width + 90, Math.min(ev.clientX - offX, vw - 90));
      const y = Math.max(0, Math.min(ev.clientY - offY, vh - 40));
      win.el.style.left = x + 'px';
      win.el.style.top = y + 'px';
      zone = nrSnapZoneFor(ev.clientX, ev.clientY);
      nrShowSnapPreview(zone);
    };
    const onUp = ()=>{
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      nrShowSnapPreview(null);
      if(zone) nrApplySnap(win, zone);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

function nrSnapZoneFor(px, py){
  const { w:vw, h:vh } = nrViewport();
  const L = px <= NR_EDGE, R = px >= vw - NR_EDGE;
  const T = py <= NR_EDGE, B = py >= vh - NR_EDGE;
  if(T && L) return 'tl';
  if(T && R) return 'tr';
  if(B && L) return 'bl';
  if(B && R) return 'br';
  if(L) return 'left';
  if(R) return 'right';
  if(T) return 'max';
  return null;
}

function nrZoneRect(zone){
  const { w:vw, h:vh } = nrViewport();
  const m = 6;
  // Clamped so a small viewport can never yield a negative (invalid) size.
  const colW = Math.max(160, vw / 2 - 1.5 * m);
  const rowH = Math.max(120, vh / 2 - 1.5 * m);
  const fullW = Math.max(160, vw - 2 * m);
  const fullH = Math.max(120, vh - 2 * m);
  const rightX = Math.max(m, vw / 2 + m / 2);
  const botY = Math.max(m, vh / 2 + m / 2);
  switch(zone){
    case 'left':  return { left:m,      top:m,    width:colW,  height:fullH };
    case 'right': return { left:rightX, top:m,    width:colW,  height:fullH };
    case 'max':   return { left:m,      top:m,    width:fullW, height:fullH };
    case 'tl':    return { left:m,      top:m,    width:colW,  height:rowH };
    case 'tr':    return { left:rightX, top:m,    width:colW,  height:rowH };
    case 'bl':    return { left:m,      top:botY, width:colW,  height:rowH };
    case 'br':    return { left:rightX, top:botY, width:colW,  height:rowH };
  }
  return null;
}

function nrShowSnapPreview(zone){
  const z = document.getElementById('nrSnapZone');
  if(!z) return;
  const r = zone && nrZoneRect(zone);
  if(!r){ z.hidden = true; return; }
  z.style.left = r.left + 'px';
  z.style.top = r.top + 'px';
  z.style.width = r.width + 'px';
  z.style.height = r.height + 'px';
  z.hidden = false;
}

function nrApplySnap(win, zone){
  const r = nrZoneRect(zone);
  if(!r) return;
  if(!win.el.classList.contains('nr-window-snapped')){
    win.restore = { width: win.el.style.width, height: win.el.style.height };
  }
  win.el.classList.add('nr-window-snapped');
  win.el.style.left = r.left + 'px';
  win.el.style.top = r.top + 'px';
  win.el.style.width = r.width + 'px';
  win.el.style.height = r.height + 'px';
}

// A "Close all" button appears (bottom-centre) once two or more windows are open.
function nrUpdateClearAll(){
  let btn = document.getElementById('nrClearAll');
  if(nrWindows.length >= 2){
    if(!btn){
      btn = document.createElement('button');
      btn.id = 'nrClearAll';
      btn.type = 'button';
      btn.className = 'pbtn nr-clear-all';
      btn.addEventListener('click', nrCloseAllWindows);
      document.body.appendChild(btn);
    }
    btn.textContent = `✕ Close all (${nrWindows.length})`;
  } else if(btn){
    btn.remove();
  }
}

// Global wiring (once per page): Esc closes the top window; a resize keeps
// floating windows on-screen and re-fits snapped ones.
function bindNotesModal(){
  if(nrModalBound) return;
  nrModalBound = true;
  document.addEventListener('keydown', e=>{
    if(e.key==='Escape' && nrWindows.length){
      const top = nrWindows.reduce((a,b)=>
        Number(b.el.style.zIndex||0) >= Number(a.el.style.zIndex||0) ? b : a);
      nrCloseWindow(top);
    }
  });
  window.addEventListener('resize', ()=>{
    const { w:vw, h:vh } = nrViewport();
    nrWindows.forEach(w=>{
      if(w.el.classList.contains('nr-window-max') !== nrIsMobile()){
        w.el.classList.toggle('nr-window-max', nrIsMobile());
      }
      if(nrIsMobile() || w.el.classList.contains('nr-window-snapped')) return;
      const rect = w.el.getBoundingClientRect();
      w.el.style.left = Math.max(0, Math.min(rect.left, vw - 90)) + 'px';
      w.el.style.top = Math.max(0, Math.min(rect.top, vh - 40)) + 'px';
    });
  });
}

function buildNotesFilterBar(){
  const bar = document.getElementById('notesFilterBar');
  if(!bar) return;
  bar.innerHTML = '<span class="filter-label">Show</span>' + NOTES_TYPES.map(t=>
    `<span class="filter-chip ${notesFilter===t?'on':''}" data-t="${t}">${t}</span>`).join('');
  bar.querySelectorAll('.filter-chip').forEach(chip=>chip.addEventListener('click', ()=>{
    notesFilter = chip.dataset.t;
    notesBrowsePage = 0; // start each browsed filter from its first page
    buildNotesFilterBar();
    renderNotesResults();
  }));
}

// Distinct source tags present among the visible (non-hidden) index entries,
// ordered by the canonical source list with any extras appended alphabetically.
function notesSourcesPresent(){
  const set = new Set(NOTES_INDEX.filter(e=> !NOTES_HIDDEN_TYPES.has(e.type)).map(e=> e.source));
  const ordered = CLASS_SOURCES.filter(s=> set.has(s));
  const extra = [...set].filter(s=> !CLASS_SOURCES.includes(s)).sort();
  return [...ordered, ...extra];
}

function buildNotesSourceFilterBar(){
  const bar = document.getElementById('notesSourceFilterBar');
  if(!bar) return;
  const opts = ['All', ...notesSourcesPresent()];
  bar.innerHTML = '<span class="filter-label">Source</span>' + opts.map(o=>
    `<span class="filter-chip ${notesSourceFilter===o?'on':''}" data-s="${esc(o)}">${esc(o)}</span>`).join('');
  bar.querySelectorAll('.filter-chip').forEach(chip=>chip.addEventListener('click', ()=>{
    notesSourceFilter = chip.dataset.s;
    notesBrowsePage = 0; // start each browsed filter from its first page
    buildNotesSourceFilterBar();
    renderNotesResults();
  }));
}

// The Notes page: a search box over the full reference index; the alignment
// tables stay visible underneath until a query is typed.
function initNotesPage(){
  buildNotes();
  NOTES_INDEX = buildNotesIndex();
  buildNotesFilterBar();
  buildNotesSourceFilterBar();
  bindNotesModal();
  const input = document.getElementById('notesSearch');
  if(input){
    input.addEventListener('input', renderNotesResults);
    input.focus();
  }
}

function renderCharacter(){
  ensureClasses();
  applyClassesToState();
  buildAlignmentSelect();
  buildSpeciesSelect();
  buildSubraceSelect();
  renderSpeciesInfo();
  buildSpeciesTraits();
  buildBackgroundSelect();
  renderBackgroundInfo();
  buildBackgroundFeature();
  buildAbilities();
  buildSaves();
  buildSkills();
  buildAttacks();
  buildInventory();
  buildEquipment();
  buildEquipAttackList();
  buildSpellSlots();
  buildSpellClassSelect();
  buildSpellLibrary();
  buildKnownSpells();
  buildClassList();
  renderClassInfoStack();
  buildSkillPicker();
  buildClassFeatures();
  renderOtherFeatures(); // custom entries also append to the class/species lists above
  buildActions();
  buildCompanions();
  applyStateToInputs();
  refreshTagPickers(); // known-spell tags feed the dropdown option pool
  // Journal lives in modules/journal.js; guard in case the module didn't load.
  if(window.characterSheetApp && window.characterSheetApp.buildJournal) window.characterSheetApp.buildJournal();
  recalc();
}

async function loadCharacter(id){
  const res = await apiGetCharacter(id);
  state = Object.assign(defaultCharacter(), res.data, { id: res.id, name: res.name });
  renderCharacter();
  setSaveStatus('saved');
}

// Import a character from parsed JSON: either a raw character state object
// (the shape defaultCharacter() returns) or an API-style { name, data } wrapper
// (the shape GET /api/characters/:id returns). Saves it as a new profile and
// switches to it. Unknown fields are dropped on next save; missing ones get defaults.
async function importCharacterJson(parsed){
  if(!parsed || typeof parsed !== 'object' || Array.isArray(parsed)){
    throw new Error('Expected a JSON object describing one character.');
  }
  if(Array.isArray(parsed.entries) || ['class','species','subclass','subspecies','spell'].includes(parsed.type)){
    throw new Error('This looks like Library JSON — use the Import page for classes, species, and spells.');
  }
  const raw = (parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data)) ? parsed.data : parsed;
  const incoming = Object.assign(defaultCharacter(), raw);
  incoming.id = null;
  if(typeof parsed.name === 'string' && parsed.name.trim()) incoming.name = parsed.name.trim();
  if(typeof incoming.name !== 'string' || !incoming.name.trim()) incoming.name = 'Unnamed Adventurer';
  const res = await apiCreateCharacter(incoming.name, incoming);
  await loadCharacter(res.id);
  await refreshProfileList(res.id);
}

function bindProfileBar(){
  document.getElementById('profileSelect').addEventListener('change', e=>{
    if(e.target.value) loadCharacter(e.target.value);
  });

  document.getElementById('importCharBtn').addEventListener('click', ()=>{
    document.getElementById('importCharFile').click();
  });
  document.getElementById('importCharFile').addEventListener('change', async e=>{
    const file = e.target.files[0];
    e.target.value = ''; // reset so picking the same file again re-fires change
    if(!file) return;
    try{
      const parsed = JSON.parse(await file.text());
      await importCharacterJson(parsed);
    }catch(err){
      alert('Import failed: ' + err.message);
    }
  });

  document.getElementById('newCharBtn').addEventListener('click', async ()=>{
    state = defaultCharacter();
    const res = await apiCreateCharacter(state.name, state);
    state.id = res.id;
    renderCharacter();
    await refreshProfileList(state.id);
    setSaveStatus('saved');
  });

  document.getElementById('dupCharBtn').addEventListener('click', async ()=>{
    if(!state.id){ alert('Save the current character before duplicating it.'); return; }
    const res = await apiDuplicateCharacter(state.id);
    await loadCharacter(res.id);
    await refreshProfileList(res.id);
  });

  document.getElementById('delCharBtn').addEventListener('click', async ()=>{
    if(!state.id){ state = defaultCharacter(); renderCharacter(); return; }
    if(!confirm(`Delete "${state.name}"? This can't be undone.`)) return;
    await apiDeleteCharacter(state.id);
    const list = await apiListCharacters();
    if(list.length>0){
      await loadCharacter(list[0].id);
    } else {
      state = defaultCharacter();
      renderCharacter();
    }
    await refreshProfileList(state.id);
  });
}

const app = {
  get state(){ return state; },
  set state(value){ state = value; },
  save,
  refreshEffects,
  newEquipItem,
  openEquipModal,
  openItemModal,
  buildActions,
  buildActionResources,
  openResourceModal,
  buildKnownSpells,
  buildAttacks,
  buildCompanions,
  buildSaves,
  buildSkills,
  buildAbilities,
  buildInventory,
  buildEquipment,
  buildSpellSlots,
  buildSpellLibrary,
  buildSpellClassSelect,
  addCustomSpellFromForm,
  buildClassFilterBar,
  buildClassList,
  renderClassInfoStack,
  buildSkillPicker,
  buildClassFeatures,
  buildSpeciesSelect,
  buildSubraceSelect,
  renderSpeciesInfo,
  buildSpeciesTraits,
  buildClassFromForm,
  buildSpeciesFromForm,
  buildSubclassFromForm,
  buildSubspeciesFromForm,
  buildSpellFromForm,
  renderImportedList,
  renderSpeciesImportedList,
  renderSubclassImportedList,
  renderSubspeciesImportedList,
  renderSpellImportedList,
  buildSubclassParentSelect,
  buildSubspeciesParentSelect,
  bindClassImport,
  bindSpeciesImport,
  bindSubclassImport,
  bindSubspeciesImport,
  bindSpellImport,
  bindBulkImport,
  submitBulkImport,
  exportLibraryJson,
  bindSubImportToggles,
  setSubImportOpen,
  bindCustomFeatureForm,
  submitCustomFeature,
  editCustomFeature,
  deleteCustomFeature,
  renderOtherFeatures,
  refreshFeatureLists,
  fillClassForm,
  fillSpeciesForm,
  fillSubclassForm,
  fillSubspeciesForm,
  fillSpellForm,
  buildLibraryEditSelects,
  bindLibraryEditSelects,
  buildAlignmentSelect,
  buildNotes,
  renderCharacter,
  recalc,
  applyStateToInputs,
  bindTabs,
  buildEquipAttackList,
  bindStaticInputs,
  bindProfileBar,
  refreshProfileList
};
window.characterSheetApp = app;

// A subclass / subspecies import form is tucked behind a toggle on its tab.
// Show or hide it and keep the toggle button's label + aria state in sync.
function setSubImportOpen(btnId, wrapId, open){
  const btn = document.getElementById(btnId);
  const wrap = document.getElementById(wrapId);
  if(!btn || !wrap) return;
  wrap.hidden = !open;
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  btn.textContent = open ? btn.dataset.hide : btn.dataset.show;
}

function bindSubImportToggles(){
  [['toggleSubclass','subclassWrap'], ['toggleSubspecies','subspeciesWrap']].forEach(([btnId, wrapId])=>{
    const btn = document.getElementById(btnId);
    const wrap = document.getElementById(wrapId);
    if(!btn || !wrap) return;
    btn.addEventListener('click', ()=> setSubImportOpen(btnId, wrapId, wrap.hidden));
  });
}

// Deep link from the Library search: /import?edit=<type>:<key> loads the entry
// into the matching import form and scrolls its panel into view.
function openLibraryEditParam(){
  const param = new URLSearchParams(location.search).get('edit');
  if(!param) return;
  const i = param.indexOf(':');
  if(i<1) return;
  const type = param.slice(0, i), key = param.slice(i+1);
  const map = {
    class:    { fill: ()=>fillClassForm(key),   sel:'impEdit', anchor:'impName' },
    species:  { fill: ()=>fillSpeciesForm(key), sel:'spEdit',  anchor:'spName' },
    subclass: { fill: ()=>{
        const j = key.indexOf('::');
        if(j>0) fillSubclassForm(key.slice(0, j), key.slice(j+2));
      }, sel:'subEdit', anchor:'subName' },
    subspecies: { fill: ()=>{
        const j = key.indexOf('::');
        if(j>0) fillSubspeciesForm(key.slice(0, j), key.slice(j+2));
      }, sel:'subspEdit', anchor:'subspName' },
    spell:    { fill: ()=>fillSpellForm(key),   sel:'splEdit', anchor:'splName' }
  };
  const m = map[type];
  if(!m) return;
  m.fill();
  const sel = document.getElementById(m.sel);
  if(sel && [...sel.options].some(o=>o.value===key)) sel.value = key;
  // Subclass / subspecies forms sit behind a toggle — reveal it so the deep link lands.
  if(type==='subclass') setSubImportOpen('toggleSubclass', 'subclassWrap', true);
  if(type==='subspecies') setSubImportOpen('toggleSubspecies', 'subspeciesWrap', true);
  const anchor = document.getElementById(m.anchor);
  const panel = anchor && anchor.closest('.panel');
  // The target form lives inside a tab pane — switch to that tab before scrolling.
  const pane = anchor && anchor.closest('.tab-pane');
  if(pane){
    const btn = document.querySelector(`.tab-btn[data-tab="${pane.id.replace(/^tab-/, '')}"]`);
    if(btn) btn.click();
  }
  // Deferred: a smooth scroll started during initial page layout gets cancelled
  // by the browser's own load-time scroll handling.
  if(panel) setTimeout(()=> panel.scrollIntoView({ behavior:'smooth', block:'start' }), 100);
}

// JSON Reference panels marked .collapsible fold down to their header (a caret
// on the rune shows state). Panels with .collapsed in the markup start folded,
// so the tab opens as a clean stack of headers. Not persisted across reloads.
function bindCollapsiblePanels(){
  document.querySelectorAll('.panel.collapsible > h2').forEach(h2=>{
    const panel = h2.parentElement;
    h2.setAttribute('role','button');
    h2.setAttribute('tabindex','0');
    const sync = ()=> h2.setAttribute('aria-expanded', String(!panel.classList.contains('collapsed')));
    const toggle = ()=>{ panel.classList.toggle('collapsed'); sync(); };
    h2.addEventListener('click', toggle);
    h2.addEventListener('keydown', e=>{
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggle(); }
    });
    sync();
  });
}

// The Import page: import forms, imported lists, and load-existing pickers.
// Registries are already loaded when this runs; no character is loaded here.
function initImportPage(){
  bindCollapsiblePanels();
  bindClassImport();
  renderImportedList();
  bindSpeciesImport();
  renderSpeciesImportedList();
  bindBackgroundImport();
  renderBackgroundImportedList();
  bindSubclassImport();
  renderSubclassImportedList();
  bindSubspeciesImport();
  renderSubspeciesImportedList();
  bindSpellImport();
  renderSpellImportedList();
  bindBulkImport();
  bindTabs(); // Import panels are split across tabs (Classes / Species / Spells / Bulk / Reference)
  bindSubImportToggles(); // Subclass / Subspecies forms are revealed by a toggle on their tab
  buildLibraryEditSelects();
  bindLibraryEditSelects();
  buildSpellLevelSelects();
  setTagPicker('splTagPicker', []);
  openLibraryEditParam(); // honor ?edit= deep links from the Library search
}

// The character sheet (index): loads a character and wires every tab.
async function initSheetPage(){
  if(VIEW_ONLY){
    let res;
    try{
      res = await apiGetCharacter(VIEW_CHARACTER_ID);
    }catch(err){
      alert(err.message || 'You do not have access to that character sheet.');
      location.href = '/sessions';
      return;
    }
    state = Object.assign(defaultCharacter(), res.data, { id: res.id, name: res.name });

    if(res.editable && !res.owned){
      // A host character claimed from a session's loaner pool: the full sheet
      // works and autosaves to the host's copy. No profile switcher — this
      // isn't one of the player's own profiles — but they can take a copy.
      BORROWED_EDIT = true;
      document.body.classList.add('borrowed');
      renderCharacter();
      const bar = document.querySelector('.profile-bar');
      if(bar){
        const banner = document.createElement('span');
        banner.className = 'view-banner';
        banner.textContent = `Playing "${state.name}" — host's character`;
        bar.appendChild(banner);
        const copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'pbtn';
        copyBtn.id = 'saveCopyBtn';
        copyBtn.textContent = 'Save a copy to my characters';
        copyBtn.addEventListener('click', async ()=>{
          if(!confirm(`Save a copy of "${state.name}" into your account? The host keeps the original.`)) return;
          const r = await apiDuplicateCharacter(state.id);
          if(r && r.id) location.href = '/';
          else alert(r && r.error || 'Could not copy the character.');
        });
        bar.appendChild(copyBtn);
      }
      bindStaticInputs();
      bindTabs();
      bindSkillLegendButtons();
      bindCornerLauncher();
      bindPassiveSenseRows();
      bindNotesModal();
      bindChoiceModal();
      bindItemModal();
      bindCustomFeatureForm();
      buildClassFilterBar();
      buildSpellLevelSelects();
      setTagPicker('customSpellTagPicker', []);
      setSaveStatus('saved');
      return;
    }

    // DM (or owner) viewing: banner instead of the profile switcher; no
    // autosave, no profile bar.
    document.body.classList.add('view-only');
    renderCharacter();
    setSaveStatus('saved');
    const bar = document.querySelector('.profile-bar');
    if(bar){
      const banner = document.createElement('span');
      banner.className = 'view-banner';
      banner.textContent = `Viewing "${state.name}" — read-only`;
      bar.appendChild(banner);
    }
    bindTabs();
    bindNotesModal();
    buildClassFilterBar();
    buildSpellLevelSelects();
    setTagPicker('customSpellTagPicker', []);
    return;
  }
  const list = await apiListCharacters();
  if(list.length>0){
    await loadCharacter(list[0].id);
  } else {
    const res = await apiCreateCharacter(state.name, state);
    state.id = res.id;
    renderCharacter();
  }
  await refreshProfileList(state.id);
  bindStaticInputs();
  bindProfileBar();
  bindTabs();
  bindSkillLegendButtons(); // "?" legend popups on the Skills tab & Settings skill picker
  bindCornerLauncher(); // "⋯" quick-tools stack (Dice / Notes / Skills)
  bindPassiveSenseRows(); // Passive Senses rows open a quick-reference popup
  bindNotesModal(); // shared spell-detail popup, used by the Spells & Actions tabs
  bindChoiceModal(); // "Other…" custom feature-choice popup
  bindItemModal(); // Inventory tab: add/edit equipment & item popup
  bindCustomFeatureForm(); // Features tab: add / edit your own features
  buildClassFilterBar();
  buildSpellLevelSelects();
  setTagPicker('customSpellTagPicker', []);
  setSaveStatus('saved');
}

async function init(){
  initTheme(); // apply the saved theme before any awaits so the page doesn't flash dark
  bindOptionsMenu();
  bindSidebar();
  await loadCustomClasses(); // merge imported classes before any character renders
  await loadCustomSpecies(); // merge imported species too
  await loadCustomBackgrounds(); // ...and imported backgrounds
  await loadCustomSubclasses(); // ...and imported subclasses (attach to parent classes)
  await loadCustomSubspecies(); // ...and imported subspecies (attach to parent species)
  await loadCustomSpells();  // ...and imported spells (merge into the Spell Library)
  if(PAGE==='import'){ initImportPage(); return; }
  if(PAGE==='library'){ initNotesPage(); return; } // the Library page's search needs the registries loaded
  if(PAGE==='sessions'){ if(window.initSessionsPage) await window.initSessionsPage(); return; } // modules/sessions.js
  await initSheetPage();
}

init();
