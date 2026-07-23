import { useEffect, useRef, useState } from 'react';

// A draggable, resizable floating window that hosts arbitrary content (a
// popped-out character tab, the Themes panel, …). It renders inline in the React
// tree (so children keep live, shared state) but is position:fixed, so it floats
// over the app and can be moved anywhere.
//
// Chrome mirrors a real window manager: the header carries minimize (collapse to
// just the title bar), split (dock to a viewport half, side-by-side with the
// sheet) and close. Windows open centred mid-screen and drag freely; dragging
// the header into the left/right edge also snaps to that half. `defaultSize`
// sets the starting box; `offset` cascades stacked windows.

let zTop = 1500; // shared z high-water mark so the last-focused window is on top

const SNAP_EDGE = 48; // px from a viewport edge that triggers a dock

const snapZone = (x) =>
  x < SNAP_EDGE ? 'split-left' : x > window.innerWidth - SNAP_EDGE ? 'split-right' : null;

export default function SheetWindow({ title, icon, defaultSize, offset = 0, onClose, children }) {
  const elRef = useRef(null);
  const floatGeom = useRef(null); // remembered {width,height} to restore after un-split
  const size = defaultSize || { width: 480, height: Math.min(640, window.innerHeight - 120) };

  const [z, setZ] = useState(() => ++zTop);
  const [mode, setMode] = useState('windowed'); // 'windowed' | 'split-left' | 'split-right'
  const [minimized, setMinimized] = useState(false);
  const [preview, setPreview] = useState(null); // snap hint while dragging
  // Centre mid-screen. `left`/`top` are CSS px but the app applies a global CSS
  // `zoom` to <html>, which scales them at render; dividing the viewport by the
  // zoom keeps the window visually centred at any zoom level.
  const [box, setBox] = useState(() => {
    const zoom = parseFloat(getComputedStyle(document.documentElement).zoom) || 1;
    return {
      left: Math.max(12, Math.round((window.innerWidth / zoom - size.width) / 2) + offset),
      top: Math.max(12, Math.round((window.innerHeight / zoom - size.height) / 2) + offset),
      width: size.width,
      height: size.height
    };
  });

  const focus = () => setZ(++zTop);
  const split = mode !== 'windowed';

  // When docked, squeeze the main sheet into the opposite half (autofill) via a
  // body class; cleared when un-split, closed, or unmounted.
  useEffect(() => {
    const cls = mode === 'split-left' ? 'content-split-left' : mode === 'split-right' ? 'content-split-right' : null;
    if (!cls) return undefined;
    document.body.classList.add(cls);
    return () => document.body.classList.remove(cls);
  }, [mode]);

  const enterSplit = (zone) => {
    if (!split) floatGeom.current = { width: elRef.current.offsetWidth, height: elRef.current.offsetHeight };
    setMode(zone);
  };
  const toggleSplit = () => {
    if (split) { const g = floatGeom.current; setMode('windowed'); if (g) setBox((b) => ({ ...b, ...g })); }
    else enterSplit('split-right');
  };

  const onHeadDown = (e) => {
    if (e.target.closest('button')) return; // let the header buttons work
    e.preventDefault();
    focus();
    const el = elRef.current;
    const rect = el.getBoundingClientRect();
    let offX = e.clientX - rect.left, offY = e.clientY - rect.top;

    // Grabbing a docked window pops it back out to a floating box under the cursor.
    if (split) {
      const g = floatGeom.current || { width: Math.min(480, rect.width), height: rect.height };
      offX = Math.min(offX, g.width - 40);
      setMode('windowed');
      setBox({ left: e.clientX - offX, top: e.clientY - offY, width: g.width, height: g.height });
    }

    const onMove = (ev) => {
      const w = el.offsetWidth, h = el.offsetHeight;
      const left = Math.max(0, Math.min(ev.clientX - offX, window.innerWidth - w));
      const top = Math.max(0, Math.min(ev.clientY - offY, window.innerHeight - h));
      setBox((b) => ({ ...b, left, top }));
      setPreview(snapZone(ev.clientX));
    };
    const onUp = (ev) => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      setPreview(null);
      const zone = snapZone(ev.clientX);
      if (zone) enterSplit(zone);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  // Anchor a docked window to the real viewport edge (right:0 / left:0) rather
  // than left:50vw — under the global CSS `zoom`, a vw offset would land short of
  // the edge and overlap the autofilled content. Edge-anchored + a matching
  // padding on the content makes the two halves abut exactly.
  const style = split
    ? {
        top: 0, height: minimized ? 'auto' : '100vh', width: '50vw', zIndex: z,
        ...(mode === 'split-left' ? { left: 0, right: 'auto' } : { right: 0, left: 'auto' })
      }
    : { left: box.left, top: box.top, width: box.width, height: minimized ? 'auto' : box.height, zIndex: z };

  const cls = 'sheet-window panel' + (split ? ' split' : '') + (minimized ? ' minimized' : '');

  return (
    <>
      {preview && <div className="snap-preview" style={preview === 'split-left' ? { left: 0, right: 'auto' } : { right: 0, left: 'auto' }} />}
      <div ref={elRef} className={cls} style={style} onMouseDown={focus} role="dialog" aria-label={title + ' (floating)'}>
        <header className="sheet-window-head" onMouseDown={onHeadDown} onDoubleClick={() => setMinimized((v) => !v)}>
          <span className="sheet-window-title">{icon && <span className="sheet-window-icon">{icon}</span>}{title}</span>
          <div className="sheet-window-controls">
            <button className="sheet-window-btn" type="button" aria-label={minimized ? 'Restore panel' : 'Minimize panel'}
              title={minimized ? 'Restore' : 'Minimize'} onClick={() => setMinimized((v) => !v)}>{minimized ? '▢' : '—'}</button>
            <button className={'sheet-window-btn' + (split ? ' on' : '')} type="button"
              aria-label={split ? 'Restore to window' : 'Split to half screen'} aria-pressed={split}
              title={split ? 'Windowed' : 'Split view'} onClick={toggleSplit}>⇔</button>
            <button className="sheet-window-btn sheet-window-close" type="button" aria-label="Close panel" title="Close" onClick={onClose}>✕</button>
          </div>
        </header>
        {!minimized && <div className="sheet-window-body">{children}</div>}
      </div>
    </>
  );
}
