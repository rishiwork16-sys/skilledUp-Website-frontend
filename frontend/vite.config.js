import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
                target: 'http://35.154.236.138:8080',
                changeOrigin: true,
                secure: false,
                headers: {
                    Origin: 'http://35.154.236.138:8080'
                }
            },
            '/auth': {
                target: 'http://35.154.236.138:8080',
                changeOrigin: true,
                secure: false,
                headers: {
                    Origin: 'http://35.154.236.138:8080'
                }
            },
    },
  },
})
