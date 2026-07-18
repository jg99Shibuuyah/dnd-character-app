import { esc } from '../../rules/core.js';
import { castingSummary, mcReqStatus } from '../../rules/spellcasting.js';
import { subclassNamesForClass } from '../../state/registry.js';

// Class reference card for the Settings class-info stack (ports classInfoCard).
// Built as an HTML string (the legacy markup is dense) and injected; all values
// come from builtin/imported data, no user free-text beyond names (escaped).

const sourceKey = (src) => src === '5E' ? '5e' : src === '5E (legacy)' ? '5eleg' : src === '5.5E' ? '55e' : 'homebrew';
const sourceTag = (src) => `<span class="src-tag src-${sourceKey(src)}">${src}</span>`;

export function classInfoCardHtml(entry, showReq, data, abilities) {
  const cd = data.classData[entry.name];
  if (!cd) return '';
  const lvl = entry.level || 1;
  const saveNames = cd.saves.map((k) => k.toUpperCase()).join(', ');
  const skills = cd.skills === 'any' ? `any ${cd.choose} skills` : `choose ${cd.choose} from the dashed chips`;
  const spells = castingSummary(cd);
  const req = showReq ? mcReqStatus(entry.name, abilities, data) : null;

  const byLv = {};
  (cd.features || []).forEach((f) => { (byLv[f.lv] = byLv[f.lv] || []).push(f.name); });
  const progRows = Object.keys(byLv).map(Number).sort((a, b) => a - b).map((lv) =>
    `<div class="ci-row ${lv <= lvl ? 'unlocked' : ''}"><span class="ci-key">lv_${String(lv).padStart(2, '0')}</span><span>${byLv[lv].join(', ')}</span></div>`
  ).join('');

  const subs = subclassNamesForClass(data, entry.name);
  const chosen = entry.subclass;

  return `<div class="class-info">
    <div class="ci-title">${esc(entry.name)} — Lv ${lvl}${sourceTag(cd.source)}</div>
    <div class="ci-row"><span class="ci-key">hit_die</span><span>d${cd.hitDie} → ${lvl}d${cd.hitDie} from this class</span></div>
    <div class="ci-row"><span class="ci-key">save_prof</span><span>${saveNames}</span></div>
    <div class="ci-row"><span class="ci-key">skills</span><span>${skills}</span></div>
    ${subs.length ? `<div class="ci-row"><span class="ci-key">subclasses</span><span>choose at Lv ${cd.subclassLevel}: ${subs.map((s) => s === chosen ? `<b class="sub-chosen">${esc(s)}</b>` : esc(s)).join(' · ')}</span></div>` : ''}
    ${spells ? `<div class="ci-row"><span class="ci-key">spellcasting</span><span>${spells}</span></div>` : ''}
    ${req ? `<div class="ci-row"><span class="ci-key">mc_req</span><span class="${req.met ? 'req-ok' : 'req-bad'}">${req.text} — ${req.met ? '✓ met' : '✗ not met'}</span></div>` : ''}
    <div class="ci-row"><span class="ci-key">source</span><span>${cd.custom ? 'Imported · ' + cd.source : cd.homebrew ? 'World Anvil · Homebrew' : 'Official · ' + cd.source}</span></div>
    ${progRows ? `<div class="ci-prog-label">// ability progression — highlighted rows are unlocked at this class's level</div><div class="ci-prog">${progRows}</div>` : ''}
    ${cd.desc ? `<div class="ci-desc">${cd.desc}</div>` : ''}
  </div>`;
}
