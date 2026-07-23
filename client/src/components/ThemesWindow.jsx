import { useState } from 'react';
import SheetWindow from './sheet/SheetWindow.jsx';
import { applyTheme, storedTheme, getStoredCustomTheme, getDefaultCustomTheme, saveCustomThemeField, persistTheme } from '../theme.js';
import { storedZoom, applyZoom, nudgeZoom, ZOOM_STEP, ZOOM_MIN, ZOOM_MAX } from '../zoom.js';

const THEMES = ['dark', 'light', 'ember', 'rain', 'space', 'custom'];
const CUSTOM_FIELDS = [
  { field: 'accent', label: 'Accent' },
  { field: 'accent2', label: 'Accent 2' },
  { field: 'surface', label: 'Surface' },
  { field: 'text', label: 'Text' },
  { field: 'background', label: 'Background' }
];

// The floating Themes panel (opened from the sidebar). Themes tab picks a named
// theme; Customize tab edits the custom palette with a live preview and an
// explicit Save that commits the colors to the account. Every commit path
// (picking a theme, Save) calls persistTheme() so the choice follows the login.
export default function ThemesWindow({ onClose }) {
  const [pane, setPane] = useState('themes'); // 'themes' | 'customize'
  const [theme, setTheme] = useState(storedTheme);
  const [custom, setCustom] = useState(getStoredCustomTheme);
  const [zoom, setZoom] = useState(storedZoom);
  const [saved, setSaved] = useState(false);

  const changeZoom = (delta) => setZoom(nudgeZoom(delta));
  const resetZoom = () => setZoom(applyZoom(1));

  const pick = (t) => {
    applyTheme(t);
    setTheme(t);
    setCustom(t === 'custom' ? getStoredCustomTheme() : getDefaultCustomTheme());
    persistTheme();
    if (t === 'custom') setPane('customize');
  };

  const editCustom = (field, value) => {
    setCustom(saveCustomThemeField(field, value)); // applies live + caches locally
    setTheme('custom');
    setSaved(false);
  };
  const saveCustom = () => { persistTheme(); setSaved(true); setTimeout(() => setSaved(false), 1600); };

  return (
    <SheetWindow title="Themes" icon="🎨" defaultSize={{ width: 520, height: 540 }} onClose={onClose}>
      <div className="themes-window">
        <div className="themes-tabs">
          <button type="button" className={'themes-tab' + (pane === 'themes' ? ' active' : '')} onClick={() => setPane('themes')}>Themes</button>
          <button type="button" className={'themes-tab' + (pane === 'customize' ? ' active' : '')} onClick={() => setPane('customize')}>Customize</button>
        </div>

        {pane === 'themes' && (
          <div className="options-section">
            <div className="options-label">Default Themes</div>
            <div className="options-grid themes-grid">
              {THEMES.map((t) => (
                <button key={t} type="button"
                  className={'option-chip theme-option' + (theme === t ? ' active' : '')}
                  onClick={() => pick(t)}>
                  {t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}

        {pane === 'customize' && (
          <div className="options-section">
            <div className="options-label">Custom Colors</div>
            <div className="custom-theme-controls open">
              {CUSTOM_FIELDS.map(({ field, label }) => (
                <div className="custom-theme-row" key={field}>
                  <label htmlFor={'custom_' + field}>{label}</label>
                  <input id={'custom_' + field} type="color" value={custom[field]}
                    onChange={(e) => editCustom(field, e.target.value)} />
                </div>
              ))}
            </div>
            <button type="button" className="add-btn theme-save-btn" onClick={saveCustom}>
              {saved ? '✓ Saved to account' : 'Save custom theme'}
            </button>

            <div className="options-label" style={{ marginTop: 16 }}>Zoom</div>
            <div className="zoom-control">
              <button type="button" className="option-chip zoom-btn" aria-label="Zoom out"
                disabled={zoom <= ZOOM_MIN + 1e-9} onClick={() => changeZoom(-ZOOM_STEP)}>−</button>
              <button type="button" className="zoom-value" title="Reset to 100%" onClick={resetZoom}>{Math.round(zoom * 100)}%</button>
              <button type="button" className="option-chip zoom-btn" aria-label="Zoom in"
                disabled={zoom >= ZOOM_MAX - 1e-9} onClick={() => changeZoom(ZOOM_STEP)}>+</button>
            </div>
          </div>
        )}
      </div>
    </SheetWindow>
  );
}
