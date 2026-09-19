import { test, expect } from '@playwright/test'
import { gotoDesktop, openWindowFromIcon } from './helpers'

// CSP 違反は `Refused to ...` という console.error として出力される。
// 主要ウィンドウ（fetch を伴う zenn / contact を含む）を一通り開いて
// コンソールにエラー（CSP 違反含む）が出ないことを確認する。
const ICON_WINDOWS = ['about', 'skills', 'projects', 'career', 'contact', 'zenn', 'trash'] as const

test('主要ウィンドウを開いてもコンソールエラー（CSP 違反含む）が出ない', async ({ page }) => {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))

  await gotoDesktop(page)

  for (const id of ICON_WINDOWS) {
    await openWindowFromIcon(page, id)
  }

  // zenn は同一オリジンの JSON フェッチが完了するまで待つ
  await page.waitForLoadState('networkidle')

  expect(errors, `コンソールエラー:\n${errors.join('\n')}`).toEqual([])
})
