import { useEffect, useRef, useState } from 'react';
import { applyTheme, storedTheme, getStoredCustomTheme, getDefaultCustomTheme, saveCustomThemeField } from '../theme.js';

const THEMES = ['dark', 'light', 'ember', 'custom'];
const CUSTOM_FIELDS = [
  { field: 'accent', label: 'Accent' },
  { field: 'accent2', label: 'Accent 2' },
  { field: 'surface', label: 'Surface' },
  { field: 'text', label: 'Text' },
  { field: 'background', label: 'Background' }
];

// Options ▾ dropdown with the theme picker. Same markup/classes as the legacy
// partial (src/views/partials/options-menu.html) so styles.css applies as-is.
export default function OptionsMenu() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState(storedTheme);
  const [custom, setCustom] = useState(getStoredCustomTheme);
  const shellRef = useRef(null);

  useEffect(() => { applyTheme(theme); }, []); // apply persisted theme on mount

  useEffect(() => {
    const onDocClick = (e) => { if (!shellRef.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const pick = (t) => {
    applyTheme(t);
    setTheme(t);
    setCustom(t === 'custom' ? getStoredCustomTheme() : getDefaultCustomTheme());
    if (t !== 'custom') setOpen(false);
  };

  const editCustom = (field, value) => {
    setCustom(saveCustomThemeField(field, value));
    setTheme('custom');
  };

  return (
    <div className="options-shell" ref={shellRef}>
      <button className={'options-btn' + (open ? ' active' : '')} type="button"
        aria-expanded={open} onClick={() => setOpen(!open)}>Options ▾</button>
      <div className={'options-menu' + (open ? ' open' : '')} role="menu" aria-hidden={!open}>
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
      </div>
    </div>
  );
}
