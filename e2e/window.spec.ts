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

test('最小化したウィンドウをタスクバーから復帰すると、そのウィンドウの dialog にフォーカスが移る（WCAG 2.4.3）', async ({ page }) => {
  const win = page.getByTestId('window-about')
  const aboutDialog = page.getByRole('dialog', { name: 'profile.txt — メモ帳' })

  await win.getByRole('button', { name: '最小化' }).click()
  await expect(win).toBeHidden()

  await page.getByTestId('taskbar-tab-about').click()
  await expect(win).toBeVisible()
  await expect(aboutDialog).toBeFocused()
})

test('タスクバータブで背面のウィンドウを前面化すると、そのウィンドウの dialog にフォーカスが移る（WCAG 2.4.3）', async ({ page }) => {
  // beforeEach で about を開いた時点で about にフォーカスがあり、起動時に開いていた
  // readme は背面に回っている（最小化はされていない）。この状態から readme を前面化する。
  const readmeDialog = page.getByRole('dialog', { name: 'welcome.txt — メモ帳' })

  await page.getByTestId('taskbar-tab-readme').click()

  await expect(readmeDialog).toBeFocused()
})

test('タスクバータブを Enter キーで操作しても、そのウィンドウの dialog にフォーカスが移る', async ({ page }) => {
  const readmeDialog = page.getByRole('dialog', { name: 'welcome.txt — メモ帳' })

  await page.getByTestId('taskbar-tab-readme').focus()
  await page.keyboard.press('Enter')

  await expect(readmeDialog).toBeFocused()
})

test('最大化で画面幅いっぱいに広がり、もう一度押すと元に戻る', async ({ page }) => {
  const win = page.getByTestId('window-about')

  await win.getByRole('button', { name: '最大化' }).click()
  await expect.poll(async () => (await box(win)).width).toBeGreaterThan(1000)

  // 最大化中はトグルボタンの名前が「元のサイズに戻す」に変わる
  await win.getByRole('button', { name: '元のサイズに戻す' }).click()
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
