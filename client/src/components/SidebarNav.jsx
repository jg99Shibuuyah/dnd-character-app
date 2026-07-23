import { useEffect, useState } from 'react';
import * as api from '../api/client.js';

const NAV = [
  { page: 'sheet', label: 'Character Sheet', href: '/', icon: '📜' },
  { page: 'library', label: 'Library', href: '/library', icon: '📚' },
  { page: 'sessions', label: 'Sessions', href: '/sessions', icon: '🎲' },
  { page: 'import', label: 'Import', href: '/import', icon: '📥' }
];

const COLLAPSE_KEY = 'sidebarCollapsed';

// Persistent-sidebar collapse state. The sidebar is always mounted; when
// collapsed it shrinks to a thin icon rail (never fully hidden on wide screens)
// and the main content reclaims the width. The `sidebar-collapsed` body class
// drives the layout reflow in styles.css.
export function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSE_KEY) === '1');
  // `has-sidebar` scopes the content shift to app pages only (the server-rendered
  // login/reset pages share styles.css but have no sidebar).
  useEffect(() => { document.body.classList.add('has-sidebar'); }, []);
  useEffect(() => {
    document.body.classList.toggle('sidebar-collapsed', collapsed);
    localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);
  return [collapsed, setCollapsed];
}

// The always-present navigation drawer, shared by the sheet and the standalone
// pages. The collapse toggle lives in the sidebar header; `onOpenThemes` opens
// the floating Themes window.
export function SidebarNav({ activePage, collapsed, onCollapse, onOpenThemes }) {
  const [user, setUser] = useState(null);
  useEffect(() => { api.authMe().then(setUser).catch(() => setUser(null)); }, []);
  const logout = async () => { await api.logout().catch(() => {}); window.location.href = '/login'; };
  return (
    <>
      {/* Backdrop only matters on narrow screens where the sidebar overlays. */}
      <div className={'sidebar-backdrop' + (collapsed ? '' : ' open')} onClick={() => onCollapse(true)} />
      <nav className={'sidebar' + (collapsed ? ' collapsed' : '')} aria-label="Pages">
        <div className="sidebar-head">
          <span className="sidebar-title">Character Ledger</span>
          <button type="button" className="sidebar-collapse-btn" onClick={() => onCollapse(!collapsed)}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed}>
            {collapsed ? '»' : '«'}
          </button>
        </div>
        {NAV.map((n) => (
          <a key={n.page} className={'side-link' + (n.page === activePage ? ' active' : '')} href={n.href} title={n.label}>
            <span className="side-link-icon">{n.icon}</span><span className="side-link-label">{n.label}</span>
          </a>
        ))}
        <button type="button" className="side-link side-link-btn" onClick={onOpenThemes} title="Themes">
          <span className="side-link-icon">🎨</span><span className="side-link-label">Themes</span>
        </button>
        <div className="sidebar-account">
          <span className="sidebar-user">Signed in as <strong>{user?.username || '…'}</strong></span>
          <button className="pbtn sidebar-signout" type="button" onClick={logout} title="Sign out">
            <span className="side-link-icon">⏻</span><span className="side-link-label">Sign out</span>
          </button>
        </div>
      </nav>
    </>
  );
}
