import { useRef, useState } from 'react';

// A draggable, resizable floating panel that renders a popped-out character-sheet
// tab. It renders inline in the React tree (so the tab keeps live, shared
// character state) but is position:fixed, so it floats over the sheet and can be
// moved anywhere. Rendering inline — rather than through a portal to <body> —
// keeps React's event delegation working for the drag/close handlers.
//
// Drag the header to move; drag the bottom-right grip (CSS resize) to size; both
// clamp to the viewport. Dragging the header into the left/right edge of the
// screen snaps the window to fill that half (docked side-by-side with the
// sheet); dragging it back toward the centre un-snaps and restores the floating
// size. A `spawn` descriptor sets where the window first appears: `{ left, top }`
// for a free-floating window at a drop point, or `{ snap: 'left'|'right' }` to
// open already docked.

let zTop = 1500; // shared z high-water mark so the last-focused panel is on top

const SNAP_EDGE = 48; // px from a viewport edge that triggers a dock

const snapZone = (x) =>
  x < SNAP_EDGE ? 'left' : x > window.innerWidth - SNAP_EDGE ? 'right' : null;

export default function SheetWindow({ title, spawn, offset = 0, onClose, children }) {
  const elRef = useRef(null);
  const floatGeom = useRef(null); // remembered {width,height} to restore after un-snap
  const [z, setZ] = useState(() => ++zTop);
  const [snap, setSnap] = useState(() => spawn?.snap || null);
  const [size, setSize] = useState(null); // forced {width,height} after un-snap; else CSS-driven
  const [preview, setPreview] = useState(null); // 'left'|'right' snap hint while dragging
  const [pos, setPos] = useState(() => ({
    left: spawn?.left != null ? Math.max(0, Math.min(spawn.left, window.innerWidth - 320)) : Math.max(20, Math.min(window.innerWidth - 500, 140 + offset)),
    top: spawn?.top != null ? Math.max(0, spawn.top) : Math.max(20, 96 + offset)
  }));

  const focus = () => setZ(++zTop);

  const onHeadDown = (e) => {
    if (e.target.closest('button')) return; // let the close button work
    e.preventDefault();
    focus();
    const el = elRef.current;
    const rect = el.getBoundingClientRect();
    let offX = e.clientX - rect.left, offY = e.clientY - rect.top;

    // Grabbing a docked window pops it back out to a floating box under the cursor.
    if (snap) {
      const g = floatGeom.current || { width: Math.min(480, rect.width), height: rect.height };
      offX = Math.min(offX, g.width - 40);
      setSnap(null);
      setSize(g);
      setPos({ left: e.clientX - offX, top: e.clientY - offY });
    }

    const onMove = (ev) => {
      const w = el.offsetWidth, h = el.offsetHeight;
      const left = Math.max(0, Math.min(ev.clientX - offX, window.innerWidth - w));
      const top = Math.max(0, Math.min(ev.clientY - offY, window.innerHeight - h));
      setPos({ left, top });
      setPreview(snapZone(ev.clientX));
    };
    const onUp = (ev) => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      setPreview(null);
      const zone = snapZone(ev.clientX);
      if (zone) {
        floatGeom.current = { width: el.offsetWidth, height: el.offsetHeight };
        setSnap(zone);
      }
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const style = snap
    ? { top: 0, height: '100vh', width: '50vw', left: snap === 'left' ? 0 : '50vw', zIndex: z }
    : { left: pos.left, top: pos.top, zIndex: z, ...(size ? { width: size.width, height: size.height } : {}) };

  return (
    <>
      {preview && <div className="snap-preview" style={{ left: preview === 'left' ? 0 : '50vw' }} />}
      <div ref={elRef} className={'sheet-window panel' + (snap ? ' snapped' : '')} style={style}
        onMouseDown={focus} role="dialog" aria-label={title + ' (floating)'}>
        <header className="sheet-window-head" onMouseDown={onHeadDown}>
          <span className="sheet-window-title">{title}</span>
          <button className="sheet-window-close" type="button" aria-label="Close panel" onClick={onClose}>✕</button>
        </header>
        <div className="sheet-window-body">{children}</div>
      </div>
    </>
  );
}
