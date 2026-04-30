import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Ensure proper MIME types for Safari
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8'
    }
  },
  build: {
    // Ensure proper module format
    target: 'es2015',
    minify: 'esbuild',
    sourcemap: true
  }
})
