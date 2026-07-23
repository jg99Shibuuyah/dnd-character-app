import { useEffect, useState } from 'react';
import { applyTheme, storedTheme, getStoredCustomTheme, getDefaultCustomTheme, saveCustomThemeField } from '../theme.js';
import { storedZoom, applyZoom, nudgeZoom, ZOOM_STEP, ZOOM_MIN, ZOOM_MAX } from '../zoom.js';

const THEMES = ['dark', 'light', 'ember', 'rain', 'custom'];
const CUSTOM_FIELDS = [
  { field: 'accent', label: 'Accent' },
  { field: 'accent2', label: 'Accent 2' },
  { field: 'surface', label: 'Surface' },
  { field: 'text', label: 'Text' },
  { field: 'background', label: 'Background' }
];

// Theme picker + zoom controls, without any dropdown chrome. Rendered inline
// inside the slide-in sidebar (was the body of the old Options ▾ menu). Applies
// the persisted theme on mount so a fresh page load still themes correctly.
export default function DisplayOptions() {
  const [theme, setTheme] = useState(storedTheme);
  const [custom, setCustom] = useState(getStoredCustomTheme);
  const [zoom, setZoom] = useState(storedZoom);

  useEffect(() => { applyTheme(theme); }, []); // apply persisted theme on mount

  const changeZoom = (delta) => setZoom(nudgeZoom(delta));
  const resetZoom = () => setZoom(applyZoom(1));

  const pick = (t) => {
    applyTheme(t);
    setTheme(t);
    setCustom(t === 'custom' ? getStoredCustomTheme() : getDefaultCustomTheme());
  };

  const editCustom = (field, value) => {
    setCustom(saveCustomThemeField(field, value));
    setTheme('custom');
  };

  return (
    <div className="sidebar-options">
      <div className="options-section">
        <div className="options-label">Display</div>
        <div className="options-grid">
          {THEMES.map((t) => (
            <button key={t} type="button"
              className={'option-chip theme-option' + (theme === t ? ' active' : '')}
              onClick={() => pick(t)}>
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className={'custom-theme-controls' + (theme === 'custom' ? ' open' : '')}>
          {CUSTOM_FIELDS.map(({ field, label }) => (
            <div className="custom-theme-row" key={field}>
              <label htmlFor={'custom_' + field}>{label}</label>
              <input id={'custom_' + field} type="color" value={custom[field]}
                onChange={(e) => editCustom(field, e.target.value)} />
            </div>
          ))}
        </div>
      </div>
      <div className="options-section">
        <div className="options-label">Zoom</div>
        <div className="zoom-control">
          <button type="button" className="option-chip zoom-btn" aria-label="Zoom out"
            disabled={zoom <= ZOOM_MIN + 1e-9} onClick={() => changeZoom(-ZOOM_STEP)}>−</button>
          <button type="button" className="zoom-value" title="Reset to 100%" onClick={resetZoom}>{Math.round(zoom * 100)}%</button>
          <button type="button" className="option-chip zoom-btn" aria-label="Zoom in"
            disabled={zoom >= ZOOM_MAX - 1e-9} onClick={() => changeZoom(ZOOM_STEP)}>+</button>
        </div>
      </div>
    </div>
  );
}
