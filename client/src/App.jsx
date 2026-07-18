import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SessionsPage from './pages/SessionsPage.jsx';
import LibraryPage from './pages/LibraryPage.jsx';
import Home from './pages/Home.jsx';

// Routes live under /next/ until cutover (see vite.config.js `base` and the
// /next/* handler in src/app.js).
export default function App() {
  return (
    <BrowserRouter basename="/next">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
