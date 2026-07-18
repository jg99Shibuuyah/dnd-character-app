import { useRef, useState } from 'react';

// A draggable, resizable floating panel that renders a popped-out character-sheet
// tab. It renders inline in the React tree (so the tab keeps live, shared
// character state) but is position:fixed, so it floats over the sheet and can be
// moved anywhere. Rendering inline — rather than through a portal to <body> —
// keeps React's event delegation working for the drag/close handlers. Drag the
// header to move; drag the bottom-right grip (CSS resize) to size; both clamp to
// the viewport.

let zTop = 1500; // shared z high-water mark so the last-focused panel is on top

export default function SheetWindow({ title, offset = 0, onClose, children }) {
  const elRef = useRef(null);
  const [z, setZ] = useState(() => ++zTop);
  const [pos, setPos] = useState(() => ({
    left: Math.max(20, Math.min(window.innerWidth - 500, 140 + offset)),
    top: Math.max(20, 96 + offset)
  }));

  const focus = () => setZ(++zTop);

  const onHeadDown = (e) => {
    if (e.target.closest('button')) return; // let the close button work
    e.preventDefault();
    focus();
    const el = elRef.current;
    const rect = el.getBoundingClientRect();
    const offX = e.clientX - rect.left, offY = e.clientY - rect.top;
    const onMove = (ev) => {
      const w = el.offsetWidth, h = el.offsetHeight;
      const left = Math.max(0, Math.min(ev.clientX - offX, window.innerWidth - w));
      const top = Math.max(0, Math.min(ev.clientY - offY, window.innerHeight - h));
      setPos({ left, top });
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  return (
    <div ref={elRef} className="sheet-window panel" style={{ left: pos.left, top: pos.top, zIndex: z }}
      onMouseDown={focus} role="dialog" aria-label={title + ' (floating)'}>
      <header className="sheet-window-head" onMouseDown={onHeadDown}>
        <span className="sheet-window-title">{title}</span>
        <button className="sheet-window-close" type="button" aria-label="Close panel" onClick={onClose}>✕</button>
      </header>
      <div className="sheet-window-body">{children}</div>
    </div>
  );
}
