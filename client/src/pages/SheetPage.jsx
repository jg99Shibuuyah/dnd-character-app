import { useEffect, useRef, useState } from 'react';
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
import ActionsTab from '../components/sheet/ActionsTab.jsx';
import QuickTools from '../components/sheet/QuickTools.jsx';
import SheetWindow from '../components/sheet/SheetWindow.jsx';

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

const TAB_COMPONENTS = {
  sheet: CharacterTab, skills: SkillsTab, actions: ActionsTab, inventory: InventoryTab,
  features: FeaturesTab, spells: SpellsTab, journal: JournalTab, settings: SettingsTab
};
const TAB_LABEL = Object.fromEntries(TABS.map((t) => [t.id, t.label]));

// Tab order persists (drag to reorder); unknown/missing ids fall back to the
// default order so tabs added later still show up.
const TAB_ORDER_KEY = 'characterSheetTabOrder';
function loadTabOrder() {
  const known = TABS.map((t) => t.id);
  try {
    const saved = JSON.parse(localStorage.getItem(TAB_ORDER_KEY) || 'null');
    if (!Array.isArray(saved)) return known;
    const ordered = saved.filter((id) => known.includes(id));
    return [...ordered, ...known.filter((id) => !ordered.includes(id))];
  } catch { return known; }
}

// Renders one tab's content — used both inline and inside a popped-out panel.
function TabView({ tabId, onGoToTab }) {
  const C = TAB_COMPONENTS[tabId];
  if (!C) return null;
  if (tabId === 'inventory') return <C onGoToEquipment={() => onGoToTab('inventory')} />;
  return <C />;
}

// Sidebar shared with the other pages, minus the Layout wrapper (the sheet owns
// its own profile bar rather than the standalone page bar).
function Sidebar({ open, onClose }) {
  const [user, setUser] = useState(null);
  useEffect(() => { api.authMe().then(setUser).catch(() => setUser(null)); }, []);
  const nav = [
    { page: 'sheet', label: 'Character Sheet', href: '/' },
    { page: 'library', label: 'Library', href: '/library' },
    { page: 'sessions', label: 'Sessions', href: '/sessions' },
    { page: 'import', label: 'Import', href: '/import' }
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
  const [order, setOrder] = useState(loadTabOrder);
  const [tab, setTab] = useState(() => loadTabOrder()[0] || 'sheet');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [panels, setPanels] = useState([]); // popped-out tabs: [{ key, tabId }]
  const dragId = useRef(null);

  useEffect(() => { applyTheme(storedTheme()); }, []);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSidebarOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const reorder = (fromId, toId) => {
    if (!fromId || fromId === toId) return;
    const next = order.filter((id) => id !== fromId);
    const idx = next.indexOf(toId);
    next.splice(idx < 0 ? next.length : idx, 0, fromId);
    setOrder(next);
    localStorage.setItem(TAB_ORDER_KEY, JSON.stringify(next));
  };
  const popOut = (tabId) => setPanels((p) => p.some((x) => x.tabId === tabId)
    ? p : [...p, { key: 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), tabId }]);
  const closePanel = (key) => setPanels((p) => p.filter((x) => x.key !== key));

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="sheet">
        <ProfileBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <Hero />
        <nav className="tab-bar" aria-label="Character sheet tabs">
          {order.map((id) => (
            <div key={id} className={'tab-btn' + (tab === id ? ' active' : '')}
              role="button" tabIndex={0} draggable
              title="Drag to reorder"
              onClick={() => setTab(id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTab(id); } }}
              onDragStart={(e) => { dragId.current = id; e.dataTransfer.effectAllowed = 'move'; }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); reorder(dragId.current, id); dragId.current = null; }}>
              <span className="tab-btn-label">{TAB_LABEL[id]}</span>
              <span className="tab-pop" role="button" tabIndex={-1} aria-label={'Pop out ' + TAB_LABEL[id]}
                title="Pop out into a floating panel"
                onClick={(e) => { e.stopPropagation(); popOut(id); }}>⧉</span>
            </div>
          ))}
        </nav>
        {!ready && <div className="panel"><div className="action-empty">Loading character…</div></div>}
        {ready && <TabView tabId={tab} onGoToTab={setTab} />}
        <div className="footer-note">Saved to your local database — switch profiles above to load a different character.</div>
      </div>
      {ready && panels.map((p, i) => (
        <SheetWindow key={p.key} title={TAB_LABEL[p.tabId]} offset={i * 28} onClose={() => closePanel(p.key)}>
          <TabView tabId={p.tabId} onGoToTab={setTab} />
        </SheetWindow>
      ))}
      {ready && <QuickTools />}
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
