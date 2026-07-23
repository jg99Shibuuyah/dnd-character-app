import { useEffect, useState } from 'react';
import { applyTheme, storedTheme, reconcileTheme } from '../theme.js';
import { SidebarNav, useSidebarCollapsed } from './SidebarNav.jsx';
import ThemesWindow from './ThemesWindow.jsx';

// Shared page chrome for the standalone pages: the persistent, collapsible
// sidebar (its collapse toggle lives inside it) + a page bar with the title.
// The sidebar and Themes window are shared with the character sheet.
export default function Layout({ page, title, children }) {
  const [collapsed, setCollapsed] = useSidebarCollapsed();
  const [themesOpen, setThemesOpen] = useState(false);

  useEffect(() => { applyTheme(storedTheme()); reconcileTheme(); }, []);

  return (
    <>
      <SidebarNav activePage={page} collapsed={collapsed} onCollapse={setCollapsed} onOpenThemes={() => setThemesOpen(true)} />
      <div className="sheet">
        <div className="profile-bar page-bar">
          <span className="page-title">{title}</span>
        </div>
        {children}
      </div>
      {themesOpen && <ThemesWindow onClose={() => setThemesOpen(false)} />}
    </>
  );
}
