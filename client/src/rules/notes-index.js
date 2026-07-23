// The Library reference index — buildNotesIndex() and friends, ported from
// public/app.js. A flat searchable index over everything the app knows:
// built-in and imported classes (+features), subclasses, species (+traits),
// subspecies, spells, companions, fighting styles, alignments, and weapon
// mastery. Detail/full fields are HTML strings rendered inside the floating
// windows (notes-windows.js) and result rows.

import { esc, mod, fmt, levelLabel } from './core.js';
import { companionBaselineCtx } from './companions.js';
import { subclassNamesForClass, subspeciesNamesForSpecies } from '../state/registry.js';

export const NOTES_TYPES = ['All', 'Classes', 'Species', 'Spells', 'Companions', 'Fighting Styles', 'Alignments', 'Mastery'];
// The DM Screen's library adds Monsters to the base type list; the public
// Library uses NOTES_TYPES (no Monsters) so monsters never surface there.
export const NOTES_TYPES_DM = [...NOTES_TYPES, 'Monsters'];
// Subclasses and subspecies stay in the index (chips inside a class/species
// window open them by key) but never appear as their own search results.
export const NOTES_HIDDEN_TYPES = new Set(['Subclasses', 'Subspecies']);
export const NOTES_PAGE_SIZE = 20;

const subKey = (parent, name) => parent + '::' + name;
const subspKey = (parent, name) => parent + '::' + name;

function notesEntry(type, name, source, badges, haystack, detail, edit) {
  return { type, name, source: source || 'Other', badges: badges.filter(Boolean).map(String),
    text: (name + ' ' + haystack).toLowerCase(), detail, edit };
}

// Deep link into the Import page's forms: /import?edit=<type>:<key>.
export function editLink(type, key, label) {
  return { href: '/import?edit=' + type + ':' + encodeURIComponent(key), label };
}

export function classFeaturesHtml(features) {
  return (features || []).map((f) => `
    <div class="feat-item">
      <div class="feat-head"><span class="f-lvl">L${f.lv}</span><span class="f-name">${esc(f.name)}</span>
        ${f.use ? `<span class="nr-badge">${esc(f.use)}</span>` : ''}${f.cost ? `<span class="nr-badge">${esc(f.cost)}</span>` : ''}</div>
      ${f.desc ? `<div class="feat-desc">${esc(f.desc)}</div>` : ''}
    </div>`).join('');
}

export function castingLabel(c) {
  if (!c || c.type === 'none') return 'non-caster';
  const ab = c.ability ? ' (' + c.ability.toUpperCase() + ')' : '';
  return c.type === 'full' ? 'full caster' + ab : c.type === 'half' ? 'half caster' + ab : 'pact magic' + ab;
}

function featuresHaystack(features) {
  return (features || []).map((f) =>
    [f.name, f.desc, f.use, f.cost, (f.choices || []).join(' ')].filter(Boolean).join(' ')).join(' ');
}

export function companionStatsHtml(stats, abilities) {
  const section = (label, rows) => (rows && rows.length)
    ? `<div class="equip-atk-head">${label}</div>` + rows.map((r) =>
        `<div class="comp-line"><b>${esc(r.name)}.</b> ${esc(r.desc)}</div>`).join('')
    : '';
  const listRow = (label, val) => val ? `<div class="comp-line"><b>${label}:</b> ${esc(val)}</div>` : '';
  return `
    <div class="comp-typeline">${esc(stats.typeLine || '')}</div>
    <div class="comp-abilities">
      ${abilities.map((a) => {
        const v = (stats.abilities || {})[a.key];
        return `<div class="comp-ab"><label>${a.key.toUpperCase()}</label><span>${v == null ? '—' : v + ' (' + fmt(mod(v)) + ')'}</span></div>`;
      }).join('')}
    </div>
    ${listRow('AC', String(stats.ac) + (stats.acNote ? ` (${stats.acNote})` : ''))}
    ${listRow('Max HP', String(stats.hpMax) + (stats.hpFormula ? ` — ${stats.hpFormula}` : ''))}
    ${listRow('Speed', stats.speed)}
    ${listRow('Saves', (stats.saves || []).join(', '))}
    ${listRow('Skills', (stats.skills || []).join(', '))}
    ${listRow('Senses', (stats.senses || []).join(', '))}
    ${listRow('Immunities', (stats.immunities || []).join(', '))}
    ${listRow('Languages', stats.languages)}
    ${section('Features', stats.features)}
    ${section('Actions', stats.actions)}
    ${section('Reactions', stats.reactions)}
    ${section('Spells', stats.spells)}
    ${stats.note ? `<div class="comp-line comp-note">${esc(stats.note)}</div>` : ''}`;
}

// Full monster statblock HTML for a SheetWindow (DM Screen only). Mirrors the
// companion stat-block style but adds the monster-only lines (CR/PB/XP,
// resistances/vulnerabilities/condition immunities, legendary actions, items).
export function monsterStatblockHtml(data) {
  const d = data || {};
  const ab = d.abilities || {};
  const abilities = ['str', 'dex', 'con', 'int', 'wis', 'cha'];
  const line = (label, val) => val ? `<div class="comp-line"><b>${label}:</b> ${esc(String(val))}</div>` : '';
  const acText = d.ac != null ? String(d.ac) + (d.acNote ? ` (${esc(d.acNote)})` : '') : '';
  const hpText = d.hpMax != null ? String(d.hpMax) + (d.hpFormula ? ` (${esc(d.hpFormula)})` : '') : '';
  const crText = d.cr ? `${esc(d.cr)}${d.xp ? ` (${esc(d.xp)} XP)` : ''}${d.pb ? ` · PB ${esc(d.pb)}` : ''}` : '';
  const section = (label, rows) => (rows && rows.length)
    ? `<div class="equip-atk-head">${label}</div>` + rows.map((r) =>
        `<div class="comp-line"><b>${esc(r.name)}.</b> ${esc(r.desc || '')}</div>`).join('')
    : '';
  return `
    <div class="comp-typeline">${esc([d.size, d.type, d.alignment].filter(Boolean).join(', '))}</div>
    ${line('Armor Class', acText)}
    ${line('Hit Points', hpText)}
    ${line('Speed', d.speed)}
    <div class="comp-abilities">
      ${abilities.map((a) => {
        const v = ab[a];
        return `<div class="comp-ab"><label>${a.toUpperCase()}</label><span>${v == null ? '—' : v + ' (' + fmt(mod(v)) + ')'}</span></div>`;
      }).join('')}
    </div>
    ${line('Saving Throws', d.saves)}
    ${line('Skills', d.skills)}
    ${line('Damage Resistances', d.resistances)}
    ${line('Damage Immunities', d.immunities)}
    ${line('Damage Vulnerabilities', d.vulnerabilities)}
    ${line('Condition Immunities', d.conditionImmunities)}
    ${line('Senses', d.senses)}
    ${line('Languages', d.languages)}
    ${line('Challenge', crText)}
    ${section('Traits', d.traits)}
    ${section('Actions', d.actions)}
    ${section('Reactions', d.reactions)}
    ${d.legendaryNote ? `<div class="equip-atk-head">Legendary Actions</div><div class="comp-line comp-note">${esc(d.legendaryNote)}</div>` : (d.legendary && d.legendary.length ? '<div class="equip-atk-head">Legendary Actions</div>' : '')}
    ${(d.legendary || []).map((r) => `<div class="comp-line"><b>${esc(r.name)}.</b> ${esc(r.desc || '')}</div>`).join('')}
    ${section('Items', d.items)}
    ${d.lore ? `<div class="comp-line comp-note">${esc(d.lore)}</div>` : ''}`;
}

export function buildNotesIndex(data, customSpells, monsters) {
  const ix = [];

  // Classes and their features.
  Object.entries(data.classData).forEach(([name, cd]) => {
    const skills = Array.isArray(cd.skills) ? cd.skills.join(', ') : 'any skill';
    const subNames = subclassNamesForClass(data, name); // built-in + imported
    const meta = `<div class="nr-meta">d${cd.hitDie || 8} hit die · saves ${(cd.saves || []).map((s) => s.toUpperCase()).join(' / ') || '—'} · ${esc(castingLabel(cd.casting))} · subclass at level ${cd.subclassLevel || '—'}</div>
       <div class="nr-meta">skills (choose ${cd.choose || 0}): ${esc(skills)}</div>`;
    ix.push(Object.assign(notesEntry('Classes', name, cd.source, [cd.source, cd.custom ? 'imported' : 'built-in'],
      [cd.desc, skills, subNames.join(' '), castingLabel(cd.casting), featuresHaystack(cd.features)].filter(Boolean).join(' '),
      meta
      + `${subNames.length ? `<div class="nr-meta">subclasses: ${esc(subNames.join(', '))}</div>` : ''}`,
      editLink('class', name, 'Edit class in Library')),
      { full: meta
        + (subNames.length ? `<div class="nr-sect">Subclasses — click to view</div><div class="nr-sub-list">${
            subNames.map((n) => `<span class="nr-sub-link" data-key="${esc(subKey(name, n))}">${esc(n)}</span>`).join('')}</div>` : '')
        + ((cd.features || []).length ? `<div class="nr-sect">Features</div>` + classFeaturesHtml(cd.features) : '') }));
  });

  // Subclasses: imported records carry detail; built-in ones are name-only lists.
  const seenSubs = new Set();
  Object.values(data.subclassData).forEach((sc) => {
    seenSubs.add(subKey(sc.parent, sc.name));
    const summary = `<div class="nr-meta">${esc(sc.parent)} subclass · chosen at level ${sc.subclassLevel || 3}</div>
       ${sc.desc ? `<div class="feat-desc">${esc(sc.desc)}</div>` : ''}`;
    ix.push(Object.assign(notesEntry('Subclasses', sc.name, sc.source || 'Homebrew', [sc.parent, sc.source || 'Homebrew', sc.custom ? 'imported' : 'built-in'],
      [sc.desc, sc.parent, featuresHaystack(sc.features)].filter(Boolean).join(' '),
      summary,
      editLink('subclass', subKey(sc.parent, sc.name), 'Edit subclass in Library')),
      { key: subKey(sc.parent, sc.name),
        parent: { type: 'Classes', name: sc.parent },
        full: summary + ((sc.features || []).length ? `<div class="nr-sect">Features</div>` + classFeaturesHtml(sc.features) : '') }));
  });
  Object.entries(data.classData).forEach(([parent, cd]) => {
    (cd.subclasses || []).forEach((n) => {
      if (seenSubs.has(subKey(parent, n))) return;
      ix.push(Object.assign(notesEntry('Subclasses', n, cd.source, [parent, 'built-in'], parent,
        `<div class="nr-meta">${esc(parent)} subclass · chosen at level ${cd.subclassLevel || 3}</div>`,
        editLink('subclass', subKey(parent, n), 'Edit subclass in Library')),
        { key: subKey(parent, n),
          parent: { type: 'Classes', name: parent },
          full: `<div class="nr-meta">${esc(parent)} subclass · chosen at level ${cd.subclassLevel || 3}</div>
                 <div class="feat-desc">Name-only entry — import it in the Library to add a description and features.</div>` }));
    });
  });

  // Species with their traits inline; subraces listed as click-through chips.
  Object.entries(data.speciesData).forEach(([name, sd]) => {
    const traits = sd.traits || [];
    const subNames = subspeciesNamesForSpecies(data, name); // built-in + imported
    const detail = `<div class="nr-meta">${esc(sd.size || 'Medium')} · ${sd.speed || 30} ft${sd.darkvision ? ' · darkvision ' + sd.darkvision + ' ft' : ''}${sd.asi ? ' · ' + esc(sd.asi) : ''}</div>
       ${sd.languages ? `<div class="nr-meta">languages: ${esc(sd.languages)}</div>` : ''}
       ${traits.map((t) => `<div class="feat-desc"><b>${esc(t.name)}</b>${t.desc ? ' — ' + esc(t.desc) : ''}</div>`).join('')}`;
    ix.push(Object.assign(notesEntry('Species', name, sd.source, [sd.source, sd.custom ? 'imported' : 'built-in'],
      [sd.desc, sd.asi, sd.languages, subNames.join(' '), traits.map((t) => t.name + ' ' + (t.desc || '')).join(' ')].filter(Boolean).join(' '),
      detail,
      editLink('species', name, 'Edit species in Library')),
      { full: detail
        + (subNames.length ? `<div class="nr-sect">Subraces — click to view</div><div class="nr-sub-list">${
            subNames.map((n) => `<span class="nr-sub-link" data-key="${esc(subspKey(name, n))}">${esc(n)}</span>`).join('')}</div>` : '') }));
  });

  // Subspecies (subraces): detailed records carry traits; species subrace
  // name-lists fill in the rest. Each links back to its parent species.
  const seenSubsp = new Set();
  Object.values(data.subspeciesData).forEach((ss) => {
    seenSubsp.add(subspKey(ss.parent, ss.name));
    const traits = ss.traits || [];
    const summary = `<div class="nr-meta">${esc(ss.parent)} subrace${ss.asi ? ' · ' + esc(ss.asi) : ''}</div>
       ${ss.desc ? `<div class="feat-desc">${esc(ss.desc)}</div>` : ''}`;
    ix.push(Object.assign(notesEntry('Subspecies', ss.name, ss.source || 'Homebrew', [ss.parent, ss.source || 'Homebrew', ss.custom ? 'imported' : 'built-in'],
      [ss.desc, ss.parent, ss.asi, traits.map((t) => t.name + ' ' + (t.desc || '')).join(' ')].filter(Boolean).join(' '),
      summary,
      editLink('subspecies', subspKey(ss.parent, ss.name), 'Edit subspecies in Library')),
      { key: subspKey(ss.parent, ss.name),
        parent: { type: 'Species', name: ss.parent },
        full: summary + (traits.length ? `<div class="nr-sect">Traits</div>` + traits.map((t) => `<div class="feat-desc"><b>${esc(t.name)}</b>${t.desc ? ' — ' + esc(t.desc) : ''}</div>`).join('') : '') }));
  });
  Object.entries(data.speciesData).forEach(([parent, sd]) => {
    (sd.subraces || []).forEach((n) => {
      if (seenSubsp.has(subspKey(parent, n))) return;
      ix.push(Object.assign(notesEntry('Subspecies', n, sd.source, [parent, 'built-in'], parent,
        `<div class="nr-meta">${esc(parent)} subrace</div>`,
        editLink('subspecies', subspKey(parent, n), 'Edit subspecies in Library')),
        { key: subspKey(parent, n),
          parent: { type: 'Species', name: parent },
          full: `<div class="nr-meta">${esc(parent)} subrace</div>
                 <div class="feat-desc">Name-only entry — import it in the Library to add a description and traits.</div>` }));
    });
  });

  // Spells: imported entries carry full detail and shadow built-in names.
  const builtinSpells = {};
  data.spellClasses.forEach((c) => data.spellData[c].forEach((s) => {
    (builtinSpells[s.name] = builtinSpells[s.name] || { level: s.level, classes: [] }).classes.push(c);
  }));
  new Set([...Object.keys(customSpells), ...Object.keys(builtinSpells)]).forEach((name) => {
    const imp = customSpells[name];
    const bi = builtinSpells[name];
    const det = imp || data.spellDetails[name] || {};
    const level = imp ? Number(imp.level) || 0 : bi.level;
    const classes = imp
      ? (Array.isArray(imp.classes) && imp.classes.length ? imp.classes : ['every class'])
      : bi.classes;
    const bits = [det.school, det.castingTime && 'cast ' + det.castingTime, det.range && 'range ' + det.range,
      det.components, det.duration && 'duration ' + det.duration].filter(Boolean).join(' · ');
    ix.push(notesEntry('Spells', name, imp ? imp.source : '5E', [levelLabel(level), imp ? imp.source : null, imp ? 'imported' : 'built-in'],
      [classes.join(' '), det.school, det.desc, (det.tags || []).join(' ')].filter(Boolean).join(' '),
      `<div class="nr-meta">${esc(levelLabel(level))} · ${esc(classes.join(', '))}</div>
       ${bits ? `<div class="nr-meta">${esc(bits)}</div>` : ''}
       ${(det.tags || []).length ? `<div class="nr-meta">tags: ${esc(det.tags.join(', '))}</div>` : ''}
       ${det.desc ? `<div class="feat-desc">${esc(det.desc)}</div>` : ''}`,
      editLink('spell', name, 'Edit spell in Library')));
  });

  // Companions — every template, with its stat block rendered at a baseline
  // (no character is loaded on the Library page).
  (data.companionTemplates || []).forEach((t) => {
    const stats = t.build(companionBaselineCtx());
    const srcLine = `<div class="nr-meta">${esc(t.kind === 'spell' ? 'Spell' : 'Class feature')} · ${esc(t.source)}</div>`;
    const summary = srcLine + `<div class="nr-meta">${esc(stats.typeLine || '')}</div>`;
    const hay = [t.source, stats.typeLine, stats.hpFormula,
      ...(stats.features || []).map((f) => f.name + ' ' + f.desc),
      ...(stats.actions || []).map((a) => a.name + ' ' + a.desc), 'companion'].filter(Boolean).join(' ');
    ix.push(Object.assign(
      notesEntry('Companions', t.name, 'Companion', [t.kind === 'spell' ? 'Spell' : 'Feature', t.source.split(' — ')[0]], hay, summary),
      { full: srcLine + companionStatsHtml(stats, data.abilities)
          + `<p class="nr-hint">Numbers shown for a baseline character (proficiency +2, +0 modifiers). Use <span class="hl">Auto-generate</span> on the Character tab to scale it to your character.</p>` }));
  });

  // Fighting styles — searchable by name, effect, or a class that can take one.
  data.fightingStyles.forEach((s) => ix.push(notesEntry('Fighting Styles', s.name, s.source, [s.source, s.classes.join(' / ')],
    [s.desc, s.classes.join(' '), 'fighting style'].join(' '),
    `<div class="nr-meta">Available to: ${esc(s.classes.join(', '))}</div>
     <div class="feat-desc">${esc(s.desc)}</div>`)));

  data.alignments.forEach((a) => ix.push(notesEntry('Alignments', a.name, '5E', [a.abbr], a.desc + ' ' + a.eg,
    `<div class="feat-desc">${esc(a.desc)}</div><div class="nr-meta">e.g. ${esc(a.eg)}</div>`)));

  // Weapon Mastery properties — searchable by property name or any weapon that has it.
  data.masteryProperties.forEach((m) => ix.push(notesEntry('Mastery', m.name, '5.5E', ['weapon mastery'],
    m.desc + ' ' + m.weapons.join(' '),
    `<div class="feat-desc">${esc(m.desc)}</div><div class="nr-meta">weapons: ${esc(m.weapons.join(', '))}</div>`)));

  // Monsters — DM Screen only. Callers on the public Library never pass this
  // argument, so monsters never surface there.
  (monsters || []).forEach((m) => {
    const d = m.data || {};
    const badges = [d.cr ? 'CR ' + d.cr : '', d.type].filter(Boolean);
    const haystack = [d.type, d.alignment, d.size, d.languages,
      ...(d.traits || []).map((t) => t.name + ' ' + (t.desc || '')),
      ...(d.actions || []).map((t) => t.name + ' ' + (t.desc || ''))].filter(Boolean).join(' ');
    ix.push(notesEntry('Monsters', m.name, m.source, badges, haystack,
      `<div class="nr-cite">${esc([d.size, d.type, d.alignment].filter(Boolean).join(', '))}${d.cr ? ' · CR ' + esc(d.cr) : ''}</div>`,
      null));
  });

  return ix;
}

// Distinct source tags present among the visible (non-hidden) index entries,
// ordered by the canonical source list with any extras appended alphabetically.
export function notesSourcesPresent(index, classSources) {
  const set = new Set(index.filter((e) => !NOTES_HIDDEN_TYPES.has(e.type)).map((e) => e.source));
  // 'Companion' is the companions' internal source tag, not a real content
  // source — keep it out of the Source filter chips.
  set.delete('Companion');
  const ordered = classSources.filter((s) => set.has(s));
  const extra = [...set].filter((s) => !classSources.includes(s)).sort();
  return [...ordered, ...extra];
}
