import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Bind to all interfaces so the dev server is reachable from a phone on the same network.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: true
  }
})
