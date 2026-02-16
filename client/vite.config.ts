import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev-only convenience:
// - avoids CORS by proxying /api/* to the Spring Boot server
// - the frontend can fetch using relative URLs (e.g. /api/v1/products)
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})

