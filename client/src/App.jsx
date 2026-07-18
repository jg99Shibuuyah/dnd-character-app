import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SessionsPage from './pages/SessionsPage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import ImportPage from './pages/ImportPage.jsx';
import SheetPage from './pages/SheetPage.jsx';

// Routes live under /next/ until cutover (see vite.config.js `base` and the
// /next/* handler in src/app.js).
export default function App() {
  return (
    <BrowserRouter basename="/next">
      <Routes>
        <Route path="/" element={<SheetPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/import" element={<ImportPage />} />
      </Routes>
    </BrowserRouter>
  );
}
