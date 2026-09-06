import { test, expect } from '@playwright/test'
import { gotoDesktop, openWindowFromIcon } from './helpers'

test.beforeEach(async ({ page }) => {
  await gotoDesktop(page)
})

test('起動時に readme ウィンドウが開く', async ({ page }) => {
  await expect(page.getByTestId('window-readme')).toBeVisible()
  await expect(page.getByText('WELCOME TO OMU/OS')).toBeVisible()
})

// デスクトップアイコンから開けるウィンドウ（terminal は launchOnly なので別枠）
const ICON_WINDOWS = ['about', 'skills', 'projects', 'career', 'contact', 'zenn', 'trash'] as const

for (const id of ICON_WINDOWS) {
  test(`デスクトップアイコンから ${id} ウィンドウを開閉できる`, async ({ page }) => {
    await openWindowFromIcon(page, id)

    const win = page.getByTestId(`window-${id}`)
    await win.getByRole('button', { name: '閉じる' }).click()
    await expect(win).toBeHidden()
  })
}

test('ランチャーから terminal ウィンドウを開ける', async ({ page }) => {
  await page.getByTestId('launcher-trigger').click()
  await page.getByRole('menuitem', { name: 'terminal.app' }).click()

  const win = page.getByTestId('window-terminal')
  await expect(win).toBeVisible()
  await win.getByRole('button', { name: '閉じる' }).click()
  await expect(win).toBeHidden()
})

test('同じアイコンを再度開いても最前面に復帰するだけで重複しない', async ({ page }) => {
  await openWindowFromIcon(page, 'about')
  await openWindowFromIcon(page, 'about')
  await expect(page.getByTestId('window-about')).toHaveCount(1)
})
