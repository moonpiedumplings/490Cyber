import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
      '/logout': {
        target: 'http://backend:8000',
        changeOrigin: true,
      },
    },
  },
})