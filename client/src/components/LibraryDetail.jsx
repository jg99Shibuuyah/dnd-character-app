import { useEffect, useRef } from 'react';

// One reference entry rendered as the body of a floating SheetWindow: an
// optional Back button, the badges (the parent tag is a live link), the entry's
// pre-escaped HTML detail, and an edit/foot line. Sub-links inside the body and
// the parent tag navigate within this same window; Alt+click opens the target as
// a new window instead. Ports the content/navigation half of the legacy
// notes-windows.js onto React + SheetWindow.
export default function LibraryDetail({ entry, stack, index, onNavigate, onOpenNew }) {
  const bodyRef = useRef(null);

  const parentEntry = entry.parent
    ? index.find((e) => e.type === entry.parent.type && e.name === entry.parent.name) : null;

  // Wire the sub-links embedded in the HTML body after each render.
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return undefined;
    const handlers = [];
    body.querySelectorAll('.nr-sub-link').forEach((chip) => {
      chip.title = 'Click to view here — Alt+click opens a new window';
      const h = (ev) => {
        const target = index.find((e) => e.key === chip.dataset.key);
        if (!target) return;
        if (ev.altKey) onOpenNew(target); else onNavigate(target, 'push');
      };
      chip.addEventListener('click', h);
      handlers.push([chip, h]);
    });
    if (body) body.scrollTop = 0;
    return () => handlers.forEach(([el, h]) => el.removeEventListener('click', h));
  }, [entry, index, onNavigate, onOpenNew]);

  return (
    <div className="lib-detail">
      <div className="lib-detail-head">
        {stack.length > 0 && (
          <button type="button" className="nr-modal-back" onClick={() => onNavigate(null, 'pop')}>‹ Back</button>
        )}
        <span className="nr-modal-badges">
          {entry.badges.map((b, i) => (parentEntry && b === entry.parent.name)
            ? <span key={i} className="nr-badge nr-parent-link" title={`Open ${b} here — Alt+click opens a new window`}
                onClick={(ev) => (ev.altKey ? onOpenNew(parentEntry) : onNavigate(parentEntry, 'push'))}>{b} ↗</span>
            : <span key={i} className="nr-badge">{b}</span>)}
        </span>
      </div>
      <div ref={bodyRef} className="lib-detail-body" dangerouslySetInnerHTML={{ __html: entry.full || entry.detail }} />
      <div className="nr-modal-foot">
        {entry.edit
          ? <a className="pbtn nr-edit-link" href={entry.edit.href}>✎ {entry.edit.label}</a>
          : <span className="nr-hint">Built-in rule — not editable.</span>}
      </div>
    </div>
  );
}
