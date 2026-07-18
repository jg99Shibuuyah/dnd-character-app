// Floating, draggable, edge-snappable reference-detail windows — the nr*
// system ported from public/app.js. Deliberately kept as imperative DOM (not
// React): the windows are modeless, live on their own layer outside the React
// tree, and manage their own drag/snap/z-order lifecycle, exactly like an
// embedded third-party widget library. React components just call
// openNotesModal(entry).
//
// Entries are the objects produced by rules/notes-index.js: { name, badges,
// detail, full?, edit?, key?, parent? }. setNotesIndex() gives the module the
// active index so parent tags and sub-links can resolve their targets.

import { esc } from './rules/core.js';

let NOTES_INDEX = [];
export function setNotesIndex(ix) { NOTES_INDEX = ix; }

let nrWindows = []; // open windows: { el, refs, stack, current, restore }
let nrTopZ = 1200;  // z-index high-water mark for click-to-front
let nrModalBound = false;
const NR_WIN_MOBILE = 640; // viewport width at/below which windows go full-screen
const NR_EDGE = 26;        // px from a viewport edge that arms a snap zone

function nrViewport() {
  return {
    w: window.innerWidth || document.documentElement.clientWidth || window.screen.width || 1024,
    h: window.innerHeight || document.documentElement.clientHeight || window.screen.height || 768
  };
}

function nrIsMobile() { return nrViewport().w <= NR_WIN_MOBILE; }

// The window layer + snap-preview divs (legacy: partials/detail-modal.html).
// Created on demand so any page can open windows without special markup.
function ensureLayer() {
  let layer = document.getElementById('nrWindowLayer');
  if (!layer) {
    layer = document.createElement('div');
    layer.className = 'nr-window-layer';
    layer.id = 'nrWindowLayer';
    document.body.appendChild(layer);
    const snap = document.createElement('div');
    snap.className = 'nr-snap-zone';
    snap.id = 'nrSnapZone';
    snap.hidden = true;
    document.body.appendChild(snap);
  }
  bindNotesModal();
  return layer;
}

function windowShell() {
  const el = document.createElement('section');
  el.className = 'nr-window panel';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Reference detail');
  el.innerHTML = `
    <header class="nr-window-head" data-role="head">
      <button class="nr-modal-back" data-role="back" type="button" aria-label="Back to previous" hidden>‹ Back</button>
      <span class="f-name" data-role="title"></span>
      <span class="nr-modal-badges" data-role="badges"></span>
      <button class="nr-modal-close" data-role="close" type="button" aria-label="Close">✕</button>
    </header>
    <div class="nr-window-body" data-role="body"></div>
    <div class="nr-modal-foot" data-role="foot"></div>`;
  return el;
}

// Public entry point: spawn a NEW window for an entry. Returns the window.
export function openNotesModal(entry) {
  if (!entry) return null;
  const layer = ensureLayer();
  const el = windowShell();
  const win = {
    el, stack: [], current: null, restore: null,
    refs: {
      head: el.querySelector('[data-role=head]'),
      back: el.querySelector('[data-role=back]'),
      title: el.querySelector('[data-role=title]'),
      badges: el.querySelector('[data-role=badges]'),
      body: el.querySelector('[data-role=body]'),
      foot: el.querySelector('[data-role=foot]'),
      close: el.querySelector('[data-role=close]')
    }
  };
  layer.appendChild(el);
  nrWindows.push(win);
  win.refs.close.addEventListener('click', () => nrCloseWindow(win));
  win.refs.back.addEventListener('click', () => nrNavigate(win, null, 'pop'));
  el.addEventListener('mousedown', () => nrFocusWindow(win), true);
  nrEnableDrag(win);
  nrPlaceWindow(win);
  nrFocusWindow(win);
  nrNavigate(win, entry, 'fresh');
  nrScheduleClamp(win); // once laid out, keep it fully on-screen
  nrUpdateClearAll();
  return win;
}

export function closeAllNotesWindows() { nrCloseAllWindows(); }

// Update a window's content in place. mode: 'fresh' | 'push' | 'pop'.
function nrNavigate(win, entry, mode) {
  if (mode === 'push') { if (win.current) win.stack.push(win.current); win.current = entry; }
  else if (mode === 'pop') { win.current = win.stack.pop() || win.current; }
  else { win.stack = []; win.current = entry; }
  entry = win.current;
  if (!entry) return;
  const r = win.refs;
  r.back.hidden = win.stack.length === 0;
  r.title.textContent = entry.name;
  // The parent tag (a subclass's class, a subrace's species) is a live link to
  // that parent's own view, opened in this same window when it's in the index.
  const parentEntry = entry.parent
    ? NOTES_INDEX.find((e) => e.type === entry.parent.type && e.name === entry.parent.name) : null;
  r.badges.innerHTML = entry.badges.map((b) => (parentEntry && b === entry.parent.name)
    ? `<span class="nr-badge nr-parent-link" title="Open ${esc(b)}">${esc(b)} ↗</span>`
    : `<span class="nr-badge">${esc(b)}</span>`).join('');
  r.body.innerHTML = entry.full || entry.detail;
  r.foot.innerHTML = entry.edit
    ? `<a class="pbtn nr-edit-link" href="${entry.edit.href}">✎ ${esc(entry.edit.label)}</a>
       <span class="nr-hint">opens the Library form with this entry loaded — re-import to save changes</span>`
    : '<span class="nr-hint">Built-in rule — not editable.</span>';
  // Click follows the link in this window (Back returns); Alt+click opens the
  // target as its own new window instead, so both can sit side by side.
  r.body.querySelectorAll('.nr-sub-link').forEach((chip) => {
    chip.title = 'Click to view here — Alt+click opens a new window';
    chip.addEventListener('click', (ev) => {
      const target = NOTES_INDEX.find((e) => e.key === chip.dataset.key);
      if (!target) return;
      if (ev.altKey) openNotesModal(target);
      else nrNavigate(win, target, 'push');
    });
  });
  if (parentEntry) {
    const link = r.badges.querySelector('.nr-parent-link');
    if (link) {
      link.title = `Open ${entry.parent.name} here — Alt+click opens a new window`;
      link.addEventListener('click', (ev) => {
        if (ev.altKey) openNotesModal(parentEntry);
        else nrNavigate(win, parentEntry, 'push');
      });
    }
  }
  r.body.scrollTop = 0;
  nrScheduleClamp(win); // navigating can change height — keep it on-screen
}

function nrFocusWindow(win) {
  win.el.style.zIndex = String(++nrTopZ);
  nrWindows.forEach((w) => w.el.classList.toggle('focused', w === win));
}

function nrCloseWindow(win) {
  win.el.remove();
  nrWindows = nrWindows.filter((w) => w !== win);
  nrUpdateClearAll();
}

function nrCloseAllWindows() {
  nrWindows.forEach((w) => w.el.remove());
  nrWindows = [];
  nrUpdateClearAll();
}

// Initial placement: mobile → full-screen; desktop → a cascading offset so
// stacked windows don't hide each other.
function nrPlaceWindow(win) {
  if (nrIsMobile()) { win.el.classList.add('nr-window-max'); return; }
  const { w: vw, h: vh } = nrViewport();
  const w = Math.max(280, Math.min(460, vw - 40));
  const n = (nrWindows.length - 1) % 6;
  const x = Math.max(10, Math.round((vw - w) / 2 - 90) + n * 30);
  const y = Math.max(10, Math.round(vh / 2 - 260) + n * 30);
  win.el.style.width = w + 'px';
  win.el.style.left = x + 'px';
  win.el.style.top = y + 'px';
}

// Keep a floating window fully on-screen. The CSS caps its width/height to the
// viewport (and the body scrolls), so here we only nudge the position so its
// bottom/right edge doesn't run off — call it once content (and thus height) is
// in place. Larger-than-viewport windows pin to the top-left margin.
function nrClampIntoView(win) {
  if (win.el.classList.contains('nr-window-max') || win.el.classList.contains('nr-window-snapped')) return;
  const { w: vw, h: vh } = nrViewport();
  const rect = win.el.getBoundingClientRect();
  let left = parseFloat(win.el.style.left);
  let top = parseFloat(win.el.style.top);
  if (!Number.isFinite(left)) left = rect.left;
  if (!Number.isFinite(top)) top = rect.top;
  left = rect.width >= vw - 20 ? 10 : Math.max(10, Math.min(left, vw - rect.width - 10));
  top = rect.height >= vh - 20 ? 10 : Math.max(10, Math.min(top, vh - rect.height - 10));
  win.el.style.left = left + 'px';
  win.el.style.top = top + 'px';
}

// Clamp after layout settles: measuring in the same frame the content is set
// reports the pre-layout (minimum) height, so wait two frames for the final
// height before nudging the window on-screen.
function nrScheduleClamp(win) {
  requestAnimationFrame(() => requestAnimationFrame(() => nrClampIntoView(win)));
}

// ----- Dragging + Aero-style edge snapping -----
function nrEnableDrag(win) {
  win.refs.head.addEventListener('mousedown', (e) => {
    if (e.target.closest('button') || nrIsMobile()) return;
    e.preventDefault();
    nrFocusWindow(win);
    // Restore floating size before dragging a snapped window.
    if (win.el.classList.contains('nr-window-snapped')) {
      win.el.classList.remove('nr-window-snapped');
      const rest = win.restore || {};
      win.el.style.width = rest.width || '460px';
      win.el.style.height = rest.height || '';
    }
    const rect = win.el.getBoundingClientRect();
    let offX = e.clientX - rect.left, offY = e.clientY - rect.top;
    if (offX > rect.width) offX = rect.width / 2; // was snapped wider than restore
    let zone = null;
    const onMove = (ev) => {
      const { w: vw, h: vh } = nrViewport();
      const x = Math.max(-rect.width + 90, Math.min(ev.clientX - offX, vw - 90));
      const y = Math.max(0, Math.min(ev.clientY - offY, vh - 40));
      win.el.style.left = x + 'px';
      win.el.style.top = y + 'px';
      zone = nrSnapZoneFor(ev.clientX, ev.clientY);
      nrShowSnapPreview(zone);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      nrShowSnapPreview(null);
      if (zone) nrApplySnap(win, zone);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

function nrSnapZoneFor(px, py) {
  const { w: vw, h: vh } = nrViewport();
  const L = px <= NR_EDGE, R = px >= vw - NR_EDGE;
  const T = py <= NR_EDGE, B = py >= vh - NR_EDGE;
  if (T && L) return 'tl';
  if (T && R) return 'tr';
  if (B && L) return 'bl';
  if (B && R) return 'br';
  if (L) return 'left';
  if (R) return 'right';
  if (T) return 'max';
  return null;
}

function nrZoneRect(zone) {
  const { w: vw, h: vh } = nrViewport();
  const m = 6;
  // Clamped so a small viewport can never yield a negative (invalid) size.
  const colW = Math.max(160, vw / 2 - 1.5 * m);
  const rowH = Math.max(120, vh / 2 - 1.5 * m);
  const fullW = Math.max(160, vw - 2 * m);
  const fullH = Math.max(120, vh - 2 * m);
  const rightX = Math.max(m, vw / 2 + m / 2);
  const botY = Math.max(m, vh / 2 + m / 2);
  switch (zone) {
    case 'left': return { left: m, top: m, width: colW, height: fullH };
    case 'right': return { left: rightX, top: m, width: colW, height: fullH };
    case 'max': return { left: m, top: m, width: fullW, height: fullH };
    case 'tl': return { left: m, top: m, width: colW, height: rowH };
    case 'tr': return { left: rightX, top: m, width: colW, height: rowH };
    case 'bl': return { left: m, top: botY, width: colW, height: rowH };
    case 'br': return { left: rightX, top: botY, width: colW, height: rowH };
  }
  return null;
}

function nrShowSnapPreview(zone) {
  const z = document.getElementById('nrSnapZone');
  if (!z) return;
  const r = zone && nrZoneRect(zone);
  if (!r) { z.hidden = true; return; }
  z.style.left = r.left + 'px';
  z.style.top = r.top + 'px';
  z.style.width = r.width + 'px';
  z.style.height = r.height + 'px';
  z.hidden = false;
}

function nrApplySnap(win, zone) {
  const r = nrZoneRect(zone);
  if (!r) return;
  if (!win.el.classList.contains('nr-window-snapped')) {
    win.restore = { width: win.el.style.width, height: win.el.style.height };
  }
  win.el.classList.add('nr-window-snapped');
  win.el.style.left = r.left + 'px';
  win.el.style.top = r.top + 'px';
  win.el.style.width = r.width + 'px';
  win.el.style.height = r.height + 'px';
}

// A "Close all" button appears (bottom-centre) once two or more windows are open.
function nrUpdateClearAll() {
  let btn = document.getElementById('nrClearAll');
  if (nrWindows.length >= 2) {
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'nrClearAll';
      btn.type = 'button';
      btn.className = 'pbtn nr-clear-all';
      btn.addEventListener('click', nrCloseAllWindows);
      document.body.appendChild(btn);
    }
    btn.textContent = `✕ Close all (${nrWindows.length})`;
  } else if (btn) {
    btn.remove();
  }
}

// Global wiring (once per page): Esc closes the top window; a resize keeps
// floating windows on-screen and re-fits snapped ones.
function bindNotesModal() {
  if (nrModalBound) return;
  nrModalBound = true;
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nrWindows.length) {
      const top = nrWindows.reduce((a, b) =>
        Number(b.el.style.zIndex || 0) >= Number(a.el.style.zIndex || 0) ? b : a);
      nrCloseWindow(top);
    }
  });
  window.addEventListener('resize', () => {
    const { w: vw, h: vh } = nrViewport();
    nrWindows.forEach((w) => {
      if (w.el.classList.contains('nr-window-max') !== nrIsMobile()) {
        w.el.classList.toggle('nr-window-max', nrIsMobile());
      }
      if (nrIsMobile() || w.el.classList.contains('nr-window-snapped')) return;
      const rect = w.el.getBoundingClientRect();
      w.el.style.left = Math.max(0, Math.min(rect.left, vw - 90)) + 'px';
      w.el.style.top = Math.max(0, Math.min(rect.top, vh - 40)) + 'px';
    });
  });
}
