import { useEffect, useState } from 'react';
import OptionsMenu from './OptionsMenu.jsx';
import * as api from '../api/client.js';

// Links mix React routes (ported pages) and legacy URLs (not yet ported).
// As each page ports over, its entry flips from `legacy` to `route`; at
// cutover they all become routes. Plain <a> everywhere keeps this trivial —
// full page loads between pages are fine for this app.
const NAV = [
  { page: 'sheet', label: 'Character Sheet', href: '/' },
  { page: 'library', label: 'Library', href: '/next/library' },
  { page: 'sessions', label: 'Sessions', href: '/next/sessions' },
  { page: 'import', label: 'Import', href: '/next/import' }
];

// Shared page chrome: slide-in sidebar + page bar (☰, title, Options menu).
// Markup mirrors src/views/partials/{sidebar,page-bar}.html for styles.css.
export default function Layout({ page, title, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.authMe().then(setUser).catch(() => setUser(null));
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const logout = async () => {
    await api.logout().catch(() => {});
    window.location.href = '/login';
  };

  return (
    <>
      <div className={'sidebar-backdrop' + (sidebarOpen ? ' open' : '')} onClick={() => setSidebarOpen(false)} />
      <nav className={'sidebar' + (sidebarOpen ? ' open' : '')} aria-label="Pages">
        <div className="sidebar-head">Character Ledger</div>
        {NAV.map((n) => (
          <a key={n.page} className={'side-link' + (n.page === page ? ' active' : '')} href={n.href}>{n.label}</a>
        ))}
        <div className="sidebar-account">
          <span className="sidebar-user">Signed in as <strong>{user?.username || '…'}</strong></span>
          <button className="pbtn" type="button" onClick={logout}>Sign out</button>
        </div>
      </nav>
      <div className="sheet">
        <div className="profile-bar page-bar">
          <button className="sidebar-toggle" type="button" aria-expanded={sidebarOpen}
            title="Menu" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <span className="page-title">{title}</span>
          <OptionsMenu />
        </div>
        {children}
      </div>
    </>
  );
}
