import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// バンドル内訳を確認したいときだけ `ANALYZE=true npm run build` で stats.html を生成する
const analyze = process.env.ANALYZE === 'true'

export default defineConfig({
  base: '/portfolio/',
  plugins: [
    react(),
    tailwindcss(),
    ...(analyze
      ? [visualizer({ filename: 'dist/stats.html', gzipSize: true, brotliSize: true, open: false })]
      : []),
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  build: {
    rollupOptions: {
      output: {
        // react / radix-ui / framer-motion を vendor チャンクへ分離してキャッシュ効率を上げる
        // （node_modules 配下のそれ以外は 'vendor' へ、index チャンクはアプリコードのみにする）
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('/framer-motion/')) return 'vendor-motion'
          if (id.includes('/radix-ui/') || id.includes('/@radix-ui/')) return 'vendor-radix'
          if (id.includes('/react-dom/') || id.includes('/react/') || id.includes('/scheduler/')) return 'vendor-react'
          return 'vendor'
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // e2e/ は Playwright Test 専用（vitest では実行しない）
    exclude: ['node_modules', 'dist', '.claude/**', 'e2e/**'],
  },
})
