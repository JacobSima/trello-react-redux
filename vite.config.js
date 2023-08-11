import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: process.env.VITE_REACT_PORT,
    proxy: {
      '/api': {
        // target: process.env.VITE_REACT_LOCAL_URL,  // localhost
        target: process.env.VITE_REACT_DOCKER_URL, // connect to the backend server service
        changeOrigin: true
      }
    }
  },
})
