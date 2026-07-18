import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The React client is the app frontend, served at / in production (Express
// serves client/dist; see src/app.js). In dev, Vite serves it and proxies
// everything the Express server owns (JSON API, builtin game-data scripts,
// the shared stylesheet, login assets) to the API server; set API_TARGET if
// yours runs on a different port.
const target = process.env.API_TARGET || 'http://localhost:4186';

export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': { target },
      '/resources': { target },
      '/styles.css': { target },
      '/login.js': { target },
      // Auth pages are server-rendered by Express even in dev.
      '/login': { target },
      '/reset': { target }
    }
  }
});
