import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { applyZoom, storedZoom } from './zoom.js';

// Apply the persisted UI zoom before first paint so the whole app renders at
// the user's chosen scale (defaults slightly reduced).
applyZoom(storedZoom());

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
