import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  base: '/portfolio/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['node_modules', 'dist', '.claude/**'],
  },
})
