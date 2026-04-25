import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['upperhill-badge.svg', 'upperhill-lockup.svg', 'favicon.svg', 'icons.svg'],
      manifest: {
        name: 'Upper Hill Academy Morit Cashflow System',
        short_name: 'UpperHill Cashflow',
        description: 'School finance desk for Upper Hill Academy Morit',
        theme_color: '#153062',
        background_color: '#eef2f4',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: '/upperhill-badge.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/upperhill-lockup.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
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
