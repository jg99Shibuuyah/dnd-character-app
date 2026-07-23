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
import DisplayOptions from '../components/DisplayOptions.jsx';

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
        <DisplayOptions />
        <div className="sidebar-account">
          <span className="sidebar-user">Signed in as <strong>{user?.username || '…'}</strong></span>
          <button className="pbtn" type="button" onClick={logout}>Sign out</button>
        </div>
      </nav>
    </>
  );
}

const SNAP_EDGE = 48; // px from a viewport edge that pops-out a dragged tab already docked

function SheetShell() {
  const { ready } = useCharacter();
  const [order, setOrder] = useState(loadTabOrder);
  const [tab, setTab] = useState(() => loadTabOrder()[0] || 'sheet');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [panels, setPanels] = useState([]); // popped-out tabs: [{ key, tabId, spawn }]
  const [drag, setDrag] = useState(null); // { id, label, x, y, snap } while dragging a tab out
  const tabBarRef = useRef(null);

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
  const popOut = (tabId, spawn) => setPanels((p) => p.some((x) => x.tabId === tabId)
    ? p : [...p, { key: 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), tabId, spawn }]);
  const closePanel = (key) => setPanels((p) => p.filter((x) => x.key !== key));

  // Pointer-based tab gesture: a plain click switches tabs; dragging sideways
  // within the bar reorders; dragging a tab out of the bar pops it into a
  // floating window at the drop point (or docked, if dropped in an edge zone).
  const snapZone = (x) => (x < SNAP_EDGE ? 'left' : x > window.innerWidth - SNAP_EDGE ? 'right' : null);
  const tabIdAtPoint = (x, y) => document.elementFromPoint(x, y)?.closest('[data-tab-id]')?.getAttribute('data-tab-id') || null;

  const startTabDrag = (e, id) => {
    if (e.button !== 0) return;
    e.preventDefault();
    const start = { x: e.clientX, y: e.clientY };
    let moved = false;
    const onMove = (ev) => {
      if (!moved && Math.hypot(ev.clientX - start.x, ev.clientY - start.y) < 6) return;
      moved = true;
      setDrag({ id, label: TAB_LABEL[id], x: ev.clientX, y: ev.clientY, snap: snapZone(ev.clientX) });
    };
    const onUp = (ev) => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      setDrag(null);
      if (!moved) { setTab(id); return; }
      const bar = tabBarRef.current?.getBoundingClientRect();
      const inBar = bar && ev.clientY >= bar.top && ev.clientY <= bar.bottom && ev.clientX >= bar.left && ev.clientX <= bar.right;
      if (inBar) {
        const targetId = tabIdAtPoint(ev.clientX, ev.clientY);
        if (targetId) reorder(id, targetId);
      } else {
        const zone = snapZone(ev.clientX);
        popOut(id, zone ? { snap: zone } : { left: ev.clientX - 60, top: ev.clientY - 12 });
      }
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  const visibleTabs = order.filter((id) => id !== 'settings');

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="sheet">
        <ProfileBar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <Hero onOpenSettings={() => setTab('settings')} settingsActive={tab === 'settings'} />
        <nav ref={tabBarRef} className="tab-bar" aria-label="Character sheet tabs">
          {visibleTabs.map((id) => (
            <div key={id} data-tab-id={id} className={'tab-btn' + (tab === id ? ' active' : '') + (drag?.id === id ? ' dragging' : '')}
              role="button" tabIndex={0}
              title="Click to open · drag out to pop into a floating panel"
              onMouseDown={(e) => startTabDrag(e, id)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTab(id); } }}>
              <span className="tab-btn-label">{TAB_LABEL[id]}</span>
            </div>
          ))}
        </nav>
        {!ready && <div className="panel"><div className="action-empty">Loading character…</div></div>}
        {ready && <TabView tabId={tab} onGoToTab={setTab} />}
        <div className="footer-note">Saved to your local database — switch profiles above to load a different character.</div>
      </div>
      {drag && (
        <>
          {drag.snap && <div className="snap-preview" style={{ left: drag.snap === 'left' ? 0 : '50vw' }} />}
          <div className="tab-drag-ghost" style={{ left: drag.x + 14, top: drag.y + 14 }}>{drag.label}</div>
        </>
      )}
      {ready && panels.map((p, i) => (
        <SheetWindow key={p.key} title={TAB_LABEL[p.tabId]} spawn={p.spawn} offset={i * 28} onClose={() => closePanel(p.key)}>
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
