import { useEffect, useState } from 'react';
import { CharacterProvider, useCharacter } from '../state/characterStore.jsx';
import * as api from '../api/client.js';
import { applyTheme, storedTheme } from '../theme.js';
import ProfileBar from '../components/sheet/ProfileBar.jsx';
import Hero from '../components/sheet/Hero.jsx';
import CharacterTab from '../components/sheet/CharacterTab.jsx';
import SkillsTab from '../components/sheet/SkillsTab.jsx';
import InventoryTab from '../components/sheet/InventoryTab.jsx';
import JournalTab from '../components/sheet/JournalTab.jsx';
import FeaturesTab from '../components/sheet/FeaturesTab.jsx';
import SettingsTab from '../components/sheet/SettingsTab.jsx';
import SpellsTab from '../components/sheet/SpellsTab.jsx';

const TABS = [
  { id: 'sheet', label: 'Character' },
  { id: 'skills', label: 'Skills' },
  { id: 'actions', label: 'Actions' },
  { id: 'inventory', label: 'Inventory & Equipment' },
  { id: 'features', label: 'Features & Traits' },
  { id: 'spells', label: 'Spells' },
  { id: 'journal', label: 'Journal' },
  { id: 'settings', label: 'Character Settings' }
];

// Placeholder for tabs not yet ported — keeps the sheet navigable end-to-end
// while Phase 3 fills them in one at a time.
function ComingSoon({ label }) {
  return (
    <div className="tab-pane active">
      <div className="panel">
        <h2><span>{label}</span><span className="rune">⋯</span></h2>
        <div className="action-empty">This tab is being ported to React. Use the <a href="/">legacy sheet</a> for it in the meantime.</div>
      </div>
    </div>
  );
}

// Sidebar shared with the other pages, minus the Layout wrapper (the sheet owns
// its own profile bar rather than the standalone page bar).
function Sidebar({ open, onClose }) {
  const [user, setUser] = useState(null);
  useEffect(() => { api.authMe().then(setUser).catch(() => setUser(null)); }, []);
  const nav = [
    { page: 'sheet', label: 'Character Sheet', href: '/next/' },
    { page: 'library', label: 'Library', href: '/next/library' },
    { page: 'sessions', label: 'Sessions', href: '/next/sessions' },
    { page: 'import', label: 'Import', href: '/next/import' }
  ];
  const logout = async () => { await api.logout().catch(() => {}); window.location.href = '/login'; };
  return (
    <>
      <div className={'sidebar-backdrop' + (open ? ' open' : '')} onClick={onClose} />
      <nav className={'sidebar' + (open ? ' open' : '')} aria-label="Pages">
        <div className="sidebar-head">Character Ledger</div>
        {nav.map((n) => <a key={n.page} className={'side-link' + (n.page === 'sheet' ? ' active' : '')} href={n.href}>{n.label}</a>)}
        <div className="sidebar-account">
          <span className="sidebar-user">Signed in as <strong>{user?.username || '…'}</strong></span>
          <button className="pbtn" type="button" onClick={logout}>Sign out</button>
        </div>
      </nav>
    </>
  );
}

function SheetShell() {
  const { ready } = useCharacter();
  const [tab, setTab] = useState('sheet');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => { applyTheme(storedTheme()); }, []);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="sheet">
        <ProfileBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <Hero />
        <nav className="tab-bar">
          {TABS.map((t) => (
            <button key={t.id} className={'tab-btn' + (tab === t.id ? ' active' : '')} onClick={() => setTab(t.id)}>{t.label}</button>
          ))}
        </nav>
        {!ready && <div className="panel"><div className="action-empty">Loading character…</div></div>}
        {ready && tab === 'sheet' && <CharacterTab />}
        {ready && tab === 'skills' && <SkillsTab />}
        {ready && tab === 'inventory' && <InventoryTab onGoToEquipment={() => setTab('inventory')} />}
        {ready && tab === 'journal' && <JournalTab />}
        {ready && tab === 'features' && <FeaturesTab />}
        {ready && tab === 'settings' && <SettingsTab />}
        {ready && tab === 'spells' && <SpellsTab />}
        {ready && !['sheet', 'skills', 'inventory', 'journal', 'features', 'settings', 'spells'].includes(tab) && <ComingSoon label={TABS.find((t) => t.id === tab).label} />}
        <div className="footer-note">Saved to your local database — switch profiles above to load a different character.</div>
      </div>
    </>
  );
}

export default function SheetPage() {
  const params = new URLSearchParams(window.location.search);
  const viewId = params.get('view');
  return (
    <CharacterProvider viewCharacterId={viewId} viewOnly={!!viewId}>
      <SheetShell />
    </CharacterProvider>
  );
}
