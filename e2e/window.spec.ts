import { test, expect, type Locator } from '@playwright/test'
import { gotoDesktop, openWindowFromIcon } from './helpers'

async function box(locator: Locator) {
  const b = await locator.boundingBox()
  if (!b) throw new Error('要素の位置が取得できません')
  return b
}

test.beforeEach(async ({ page }) => {
  await gotoDesktop(page)
  await openWindowFromIcon(page, 'about')
  // ウィンドウ出現アニメーション（0.15s）の収束を待つ
  await page.waitForTimeout(300)
})

test('最小化するとウィンドウが隠れ、タスクバーから復帰できる', async ({ page }) => {
  const win = page.getByTestId('window-about')

  await win.getByRole('button', { name: '最小化' }).click()
  await expect(win).toBeHidden()

  await page.getByTestId('taskbar-tab-about').click()
  await expect(win).toBeVisible()
})

test('最大化で画面幅いっぱいに広がり、もう一度押すと元に戻る', async ({ page }) => {
  const win = page.getByTestId('window-about')

  await win.getByRole('button', { name: '最大化' }).click()
  await expect.poll(async () => (await box(win)).width).toBeGreaterThan(1000)

  await win.getByRole('button', { name: '最大化' }).click()
  // about の初期幅は 520。最大化前のサイズ帯（600未満）へ戻る
  await expect.poll(async () => (await box(win)).width).toBeLessThan(600)
})

test('タイトルバーのドラッグでウィンドウを移動できる', async ({ page }) => {
  const win = page.getByTestId('window-about')
  const before = await box(win)
  const bar = await box(page.getByTestId('window-titlebar-about'))

  const cx = bar.x + bar.width / 2
  const cy = bar.y + bar.height / 2
  await page.mouse.move(cx, cy)
  await page.mouse.down()
  await page.mouse.move(cx + 120, cy + 60, { steps: 10 })
  await page.mouse.up()

  const after = await box(win)
  expect(after.x).toBeGreaterThan(before.x + 50)
  expect(after.y).toBeGreaterThan(before.y + 20)
})

test('右下ハンドルのドラッグでウィンドウをリサイズできる', async ({ page }) => {
  const win = page.getByTestId('window-about')
  const before = await box(win)
  const handle = await box(win.getByTestId('resize-handle-se'))

  await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2)
  await page.mouse.down()
  await page.mouse.move(handle.x + 90, handle.y + 70, { steps: 10 })
  await page.mouse.up()

  const after = await box(win)
  expect(after.width).toBeGreaterThan(before.width + 40)
  expect(after.height).toBeGreaterThan(before.height + 30)
})
