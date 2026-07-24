import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SessionsPage from './pages/SessionsPage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import ImportPage from './pages/ImportPage.jsx';
import SheetPage from './pages/SheetPage.jsx';
import DmScreenPage from './pages/DmScreenPage.jsx';
import DmNotesHistoryPage from './pages/DmNotesHistoryPage.jsx';

// The React app is served at / (see vite.config.js `base` and the SPA fallback
// in src/app.js). login/reset stay server-rendered by Express.
export default function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<SheetPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/dm/:sessionId" element={<DmScreenPage />} />
        <Route path="/dm-notes" element={<DmNotesHistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
