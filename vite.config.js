import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // This site has no client-side routes to fall back for (in-page anchors
  // only, no react-router) — just the standalone static pages in public/
  // (privacy/, terms/, 404.html) plus the bundled second entry below. MPA
  // mode makes the dev server resolve those the same way `vite preview` and
  // real static hosts do, instead of silently serving index.html for every
  // unmatched path.
  appType: 'mpa',
  build: {
    rollupOptions: {
      // Standard Vite multi-page setup: components/index.html is a real
      // second entry (its own React root via src/pages/main.jsx), not a
      // public/ passthrough like privacy/terms — it needs the same JSX/CSS
      // module pipeline the homepage gets. Rollup places the output at
      // dist/components/ from the source path alone, so the object key
      // below is just an internal chunk name.
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        components: fileURLToPath(new URL('./components/index.html', import.meta.url)),
      },
    },
  },
})
