import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 8001,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000/',
        changeOrigin: true
      }
    }
  },
  preview: {
    host: true,
    port: 8001,
    proxy: {
      '/api': {
        target: 'http://server:8000/', // connect to the backend server service
        changeOrigin: true
      }
    }
  },
})
