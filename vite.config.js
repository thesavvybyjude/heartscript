import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['heart.svg', 'vite.svg'],
      manifest: {
        name: 'HeartScript',
        short_name: 'HeartScript',
        description: 'Encrypted Digital Messages',
        theme_color: '#F43F5E',
        background_color: '#F8F0E5',
        display: 'standalone',
        icons: [
          {
            src: '/heart.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: '/heart.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
})
