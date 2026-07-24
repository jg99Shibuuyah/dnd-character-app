// Theme system, ported from public/app.js. Named themes (dark/light/ember)
// swap the CSS-variable blocks in styles.css via body[data-theme]; the custom
// theme writes derived variables inline on :root. Selection persists in
// localStorage under the same keys as the legacy app, so a user's theme
// carries over between the two frontends during the migration.

export function hexToRgb(hex) {
  const trimmed = hex.replace('#', '');
  const value = trimmed.length === 3 ? trimmed.split('').map((ch) => ch + ch).join('') : trimmed;
  const num = parseInt(value, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

export function rgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [clamp(r), clamp(g), clamp(b)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function mixHex(hexA, hexB, amount) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const mix = (x, y) => x + (y - x) * amount;
  return rgbToHex(mix(a.r, b.r), mix(a.g, b.g), mix(a.b, b.b));
}

export function alphaHex(hex, alpha) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getDefaultCustomTheme() {
  return {
    accent: '#00ffd5',
    accent2: '#ff2a6d',
    surface: '#12141d',
    text: '#c8c8d4',
    background: '#0a0a0f'
  };
}

export function getStoredCustomTheme() {
  try {
    const stored = JSON.parse(localStorage.getItem('characterSheetCustomTheme') || 'null');
    return stored || getDefaultCustomTheme();
  } catch {
    return getDefaultCustomTheme();
  }
}

const CUSTOM_THEME_VARS = ['--void', '--void-2', '--void-3', '--neon-cyan', '--neon-magenta', '--ink', '--ink-dim', '--ink-soft', '--parchment', '--parchment-2', '--parchment-line', '--gold', '--gold-bright', '--crimson', '--crimson-bright', '--border-glow', '--shadow', '--dark-panel'];

export function applyCustomTheme(theme) {
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

export function applyTheme(theme) {
  if (theme === 'custom') {
    applyCustomTheme(getStoredCustomTheme());
  } else {
    document.body.dataset.theme = theme;
    if (theme === 'dark') document.body.removeAttribute('data-theme');
    CUSTOM_THEME_VARS.forEach((v) => document.documentElement.style.removeProperty(v));
  }
  localStorage.setItem('characterSheetTheme', theme);
}

export function storedTheme() {
  return localStorage.getItem('characterSheetTheme') || 'rain';
}

// ---- Per-account persistence ----
// localStorage stays the instant-apply cache (and the only store under
// SKIP_AUTH / when signed out); the server copy follows the account across
// devices. persistTheme() debounces a PUT of the current theme + custom colors;
// reconcileTheme() runs once on load to adopt the account's saved theme.

let persistTimer = null;
export function persistTheme() {
  clearTimeout(persistTimer);
  persistTimer = setTimeout(() => {
    const lt = storedLineToggles();
    import('./api/client.js')
      .then((api) => api.updateSettings({
        theme: storedTheme(), customTheme: getStoredCustomTheme(),
        cyberGrid: lt.grid, cyberScanlines: lt.scanlines,
      }))
      .catch(() => {}); // best-effort; the localStorage cache already holds it
  }, 400);
}

export async function reconcileTheme() {
  try {
    const { authMe } = await import('./api/client.js');
    const s = (await authMe())?.settings || {};
    if (s.customTheme && typeof s.customTheme === 'object') {
      localStorage.setItem('characterSheetCustomTheme', JSON.stringify(s.customTheme));
    }
    if (typeof s.cyberGrid === 'boolean') localStorage.setItem('characterSheetCyberGrid', s.cyberGrid ? 'true' : 'false');
    if (typeof s.cyberScanlines === 'boolean') localStorage.setItem('characterSheetCyberScanlines', s.cyberScanlines ? 'true' : 'false');
    applyLineToggles(storedLineToggles());
    if (typeof s.theme === 'string' && s.theme && s.theme !== storedTheme()) {
      applyTheme(s.theme); // updates the cache + repaints
      return s.theme;
    }
    // Same named theme but custom colors may have changed on another device.
    if (storedTheme() === 'custom' && s.customTheme) applyCustomTheme(getStoredCustomTheme());
    return storedTheme();
  } catch {
    return storedTheme();
  }
}

export function saveCustomThemeField(field, value) {
  const current = getStoredCustomTheme();
  current[field] = value;
  localStorage.setItem('characterSheetCustomTheme', JSON.stringify(current));
  localStorage.setItem('characterSheetTheme', 'custom');
  applyCustomTheme(current);
  return current;
}

// ---- Cyberpunk line overlays (grid + CRT scanlines) ----
// Global body::before (grid) and body::after (scanlines) can each be switched
// off. Stored as 'true'/'false' strings; absent means on. Persisted alongside
// the theme via persistTheme()/reconcileTheme().

export function storedLineToggles() {
  const on = (k) => localStorage.getItem(k) !== 'false'; // absent or 'true' => on
  return { grid: on('characterSheetCyberGrid'), scanlines: on('characterSheetCyberScanlines') };
}

export function applyLineToggles(toggles) {
  const t = toggles || storedLineToggles();
  document.body.classList.toggle('no-cyber-grid', !t.grid);
  document.body.classList.toggle('no-cyber-scanlines', !t.scanlines);
}

export function saveLineToggle(field, value) {
  const key = field === 'grid' ? 'characterSheetCyberGrid' : 'characterSheetCyberScanlines';
  localStorage.setItem(key, value ? 'true' : 'false');
  const toggles = storedLineToggles();
  applyLineToggles(toggles);
  persistTheme();
  return toggles;
}
