// UI 目視確認用のスクリーンショット取得スクリプト。
//
// 使い方:
//   1. 別ターミナルで `npm run dev` を起動しておく
//   2. `npm run screenshot -- [出力パス] [URL] [viewport幅x高さ]`
//
// 例:
//   npm run screenshot                                  → e2e/__screenshots__/preview.png
//   npm run screenshot -- tmp/contact.png "http://localhost:5173/portfolio/"
//   npm run screenshot -- tmp/mobile.png "" 390x844      → モバイル幅で撮影
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

const out = process.argv[2] || 'e2e/__screenshots__/preview.png'
const url = process.argv[3] || 'http://localhost:5173/portfolio/'
const [w, h] = (process.argv[4] || '1280x800').split('x').map(Number)

await mkdir(dirname(out), { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: w, height: h } })

try {
  await page.goto(url, { waitUntil: 'load', timeout: 30_000 })
  // ブート演出（約2秒）とフォント読み込みの完了を待つ
  await page.getByText('LOADING KERNEL...').waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => {})
  await page.waitForTimeout(500)
  await page.screenshot({ path: out })
  console.log(`saved: ${out}`)
} finally {
  await browser.close()
}
