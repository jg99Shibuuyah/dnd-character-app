// UI zoom, persisted like the theme (localStorage). A single knob scales the
// whole app via the CSS `zoom` property on the root element, which also scales
// the fixed-position popups/launcher and keeps their layout math consistent.
// Default is slightly reduced so more of the sheet fits on screen.

const KEY = 'characterSheetZoom';
export const ZOOM_MIN = 0.7;
export const ZOOM_MAX = 1.1;
export const ZOOM_STEP = 0.05;
export const ZOOM_DEFAULT = 0.9;

const round = (z) => Math.round(z * 100) / 100;
const clamp = (z) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, round(z)));

export function storedZoom() {
  const raw = parseFloat(localStorage.getItem(KEY));
  return Number.isFinite(raw) ? clamp(raw) : ZOOM_DEFAULT;
}

export function applyZoom(z) {
  const zoom = clamp(z);
  document.documentElement.style.zoom = String(zoom);
  localStorage.setItem(KEY, String(zoom));
  return zoom;
}

export function nudgeZoom(delta) {
  return applyZoom(storedZoom() + delta);
}
