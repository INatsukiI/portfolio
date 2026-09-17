import { defineConfig, devices } from '@playwright/test'

// Vite の base 設定に合わせて /portfolio/ 配下で配信される
const BASE_URL = 'http://localhost:5173/portfolio/'

export default defineConfig({
  testDir: './e2e',
  // E2E は目視確認と回帰防止が目的。CI ランナー（ubuntu-latest / 4 vCPU）で
  // 並列実行し、フレークは retries: 1 で吸収する
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 3 : undefined,
  reporter: process.env.CI
    ? [['github'], ['list'], ['html', { open: 'never' }]]
    : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      // デスクトップ OS 風 UI。全デスクトップアイコンがタスクバーに隠れない高さを確保する
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
