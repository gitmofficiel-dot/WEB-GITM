import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { handleContentFeed } from './public/content-feed.js'

const contentApi = {
  name: 'gitm-content-api',
  configureServer(server) {
    server.middlewares.use('/api/content', async (req, res) => {
      const response = await handleContentFeed(new Request(`http://localhost/api/content${req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''}`, { method: req.method }));
      res.writeHead(response.status, Object.fromEntries(response.headers));
      res.end(await response.text());
    });
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    contentApi,
    react(),
    VitePWA({
      workbox: { globIgnores: ['**/_worker.js', '**/content-feed.js', '**/ai-proxy.js'], navigateFallbackDenylist: [/^\/api\//] },
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'logo.png'],
      manifest: {
        name: 'GITM Innovation Tech',
        short_name: 'GITM',
        description: 'GITM - Groupe Innovation Technologique Maroc',
        theme_color: '#00E5FF',
        background_color: '#0B0B14',
        display: 'standalone',
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-vendor';
            }
            if (id.includes('framer-motion') || id.includes('lucide-react') || id.includes('recharts')) {
              return 'ui-vendor';
            }
            return 'vendor';
          }
        }
      }
    }
  }
})
