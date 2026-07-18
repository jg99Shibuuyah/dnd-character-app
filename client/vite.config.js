import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The React client is served under /next/ so it can coexist with the legacy
// vanilla frontend until cutover. In dev, Vite proxies everything the Express
// server owns (JSON API, builtin game-data scripts, legacy stylesheet) to the
// API server; set API_TARGET if yours runs on a different port.
const target = process.env.API_TARGET || 'http://localhost:4186';

export default defineConfig({
  base: '/next/',
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': { target },
      // Vite's dev server prefixes root-absolute asset URLs in index.html with
      // the /next/ base (the production build leaves them alone — Express
      // serves them from public/). Strip the prefix and hand them to Express.
      '/next/resources': { target, rewrite: (p) => p.replace(/^\/next/, '') },
      '/next/styles.css': { target, rewrite: (p) => p.replace(/^\/next/, '') },
      '/resources': { target },
      '/styles.css': { target }
    }
  }
});
