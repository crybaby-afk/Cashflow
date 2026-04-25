import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Upper Hill Academy Morit Cashflow System',
        short_name: 'UpperHill Cashflow',
        description: 'School finance desk for Upper Hill Academy Morit',
        theme_color: '#1d2f61',
        background_color: '#ece7de',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/upperhill-badge.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
})
