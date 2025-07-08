import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5111,
    proxy: {
      '/api': {
        target: "https://ecommerse-api.zoomtech.co.il",
        // target: "http://localhost:5001",
        changeOrigin: true
      },
      '/uploads': {
        target: "https://ecommerse-api.zoomtech.co.il",
        // target: "http://localhost:5001",
        changeOrigin: true
      }
    }
  }
})
