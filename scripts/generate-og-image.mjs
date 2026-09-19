// OGP 用画像（public/og.png、1200×630）を生成するスクリプト。
//
// 新しい画像生成ツールは導入せず、既存依存の Playwright（Chromium）で
// OMU/OS のブート画面風 HTML をレンダリングしてスクリーンショットを撮る。
// ビルドには組み込まず、デザインを変えたいときに手動で実行する。
//
// 使い方: node scripts/generate-og-image.mjs
import { chromium } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PROFILE } from '../src/profile.ts'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/og.png')

const WIDTH = 1200
const HEIGHT = 630

// src/os/theme.ts の OS カラーパレットに合わせる（og:image 用の静的 HTML なので値を直書き）。
const html = `<!doctype html>
<html>
<head>
<meta charset="UTF-8" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&family=Space+Grotesk:wght@500;600&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${WIDTH}px; height: ${HEIGHT}px; overflow: hidden; }
  body {
    background-color: #050810;
    background-image:
      radial-gradient(rgba(0,212,255,0.16) 1px, transparent 1px),
      radial-gradient(circle at 18% 18%, rgba(0,212,255,0.12), transparent 45%),
      radial-gradient(circle at 85% 82%, rgba(0,212,255,0.10), transparent 40%);
    background-size: 28px 28px, auto, auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .card {
    width: 1080px;
    height: 510px;
    border-radius: 20px;
    border: 1px solid rgba(0,212,255,0.28);
    background: rgba(6,14,30,0.9);
    box-shadow: 0 0 0 1px rgba(255,255,255,0.04) inset, 0 40px 120px rgba(0,0,0,0.6);
    display: flex;
    flex-direction: column;
  }
  .titlebar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px 28px;
    border-bottom: 1px solid rgba(0,212,255,0.16);
    flex-shrink: 0;
  }
  .dot { width: 16px; height: 16px; border-radius: 50%; }
  .path {
    margin-left: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 20px;
    color: #93a7ba;
    letter-spacing: 0.05em;
  }
  .body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 24px;
    text-align: center;
    padding: 0 60px;
  }
  .logo {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 100px;
    letter-spacing: 0.14em;
    color: #00d4ff;
    text-shadow: 0 0 60px rgba(0,212,255,0.55);
  }
  .tagline {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 34px;
    font-weight: 500;
    color: #e8f4ff;
  }
  .sub {
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px;
    letter-spacing: 0.06em;
    color: #93a7ba;
  }
  .bar {
    width: 360px;
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(90deg, transparent, #00d4ff, transparent);
  }
</style>
</head>
<body>
  <div class="card">
    <div class="titlebar">
      <span class="dot" style="background:#ff4d6a"></span>
      <span class="dot" style="background:#ffbd2e"></span>
      <span class="dot" style="background:#28c840"></span>
      <span class="path">omu@portfolio:~$</span>
    </div>
    <div class="body">
      <div class="logo">OMU/OS</div>
      <div class="tagline">${PROFILE.tagline}</div>
      <div class="sub">${PROFILE.title} ${PROFILE.name} のポートフォリオ</div>
      <div class="bar"></div>
    </div>
  </div>
</body>
</html>`

await mkdir(dirname(OUT), { recursive: true })

const browser = await chromium.launch()
try {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } })
  await page.setContent(html, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: OUT })
  console.log(`saved: ${OUT}`)
} finally {
  await browser.close()
}
