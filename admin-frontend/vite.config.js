import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5174,
        proxy: {
            '/api': {
                target: 'http://35.154.236.138:8080',
                changeOrigin: true, // Needed for virtual hosted sites
                secure: false,
                headers: {
                    Origin: 'http://35.154.236.138:8080'
                }
            }
        }
    }
})
