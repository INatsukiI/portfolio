import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { PROFILE } from './src/profile.ts'
import { buildStructuredData } from './src/lib/structuredData.ts'

// JSON-LD 構造化データ（Person / WebSite）を profile.ts から生成し、
// index.html に埋め込む。src/profile.ts と index.html の二重管理を避けるため、
// ビルド時（dev / build 双方）に transformIndexHtml で注入する。
function structuredDataPlugin() {
  return {
    name: 'structured-data',
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify(buildStructuredData(PROFILE)),
          injectTo: 'head',
        },
      ]
    },
  }
}

export default defineConfig({
  base: '/portfolio/',
  plugins: [react(), tailwindcss(), structuredDataPlugin()],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // e2e/ は Playwright Test 専用（vitest では実行しない）
    exclude: ['node_modules', 'dist', '.claude/**', 'e2e/**'],
  },
})
