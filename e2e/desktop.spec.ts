import { test, expect } from '@playwright/test'
import { gotoDesktop, openWindowFromIcon } from './helpers'

test.describe('デスクトップ操作', () => {
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

  test('ランチャーの検索欄から下キーでメニュー項目へフォーカスを移せる', async ({ page }) => {
    await page.getByTestId('launcher-trigger').click()
    const search = page.getByLabel('アプリを検索')
    await search.fill('term')
    await search.press('ArrowDown')

    const item = page.getByRole('menuitem', { name: 'terminal.app' })
    await expect(item).toBeFocused()

    await page.keyboard.press('Enter')
    await expect(page.getByTestId('window-terminal')).toBeVisible()
  })

  test('同じアイコンを再度開いても最前面に復帰するだけで重複しない', async ({ page }) => {
    await openWindowFromIcon(page, 'about')
    await openWindowFromIcon(page, 'about')
    await expect(page.getByTestId('window-about')).toHaveCount(1)
  })
})

// URL ハッシュでウィンドウを直接開くディープリンク（#projects など）。
// このブロックでは beforeEach で /portfolio/ に事前遷移しない。同一オリジンの既存ページに対して
// ハッシュだけが異なる URL へ goto すると、ブラウザはフルナビゲーションではなく同一ドキュメント内の
// ハッシュ変更（hashchange）として扱ってしまい、初回アクセス（フレッシュロード）を再現できないため。
test.describe('URL ハッシュでウィンドウを直接開く（ディープリンク）', () => {
  test('#projects 付きでアクセスすると projects ウィンドウが最前面で開き、readme は開かない', async ({ page }) => {
    await page.goto('/portfolio/#projects')
    await expect(page.getByText('LOADING KERNEL...')).toBeHidden({ timeout: 15_000 })

    await expect(page.getByTestId('window-projects')).toBeVisible()
    await expect(page.getByTestId('window-readme')).toBeHidden()
    await expect(page.getByTestId('taskbar-tab-projects')).toHaveAttribute('aria-pressed', 'true')
  })

  test('#about,projects のようにカンマ区切りで複数ウィンドウを開ける（最後が最前面）', async ({ page }) => {
    await page.goto('/portfolio/#about,projects')
    await expect(page.getByText('LOADING KERNEL...')).toBeHidden({ timeout: 15_000 })

    await expect(page.getByTestId('window-about')).toBeVisible()
    await expect(page.getByTestId('window-projects')).toBeVisible()
    await expect(page.getByTestId('taskbar-tab-projects')).toHaveAttribute('aria-pressed', 'true')
  })

  test('ハッシュで開いたウィンドウを閉じると URL ハッシュが消える', async ({ page }) => {
    await page.goto('/portfolio/#projects')
    await expect(page.getByText('LOADING KERNEL...')).toBeHidden({ timeout: 15_000 })

    const win = page.getByTestId('window-projects')
    await win.getByRole('button', { name: '閉じる' }).click()
    await expect(win).toBeHidden()
    await expect(page).toHaveURL(/\/portfolio\/$/)
  })

  test('デスクトップアイコンからウィンドウを開くと URL ハッシュに反映される', async ({ page }) => {
    await page.goto('/portfolio/')
    await expect(page.getByText('LOADING KERNEL...')).toBeHidden({ timeout: 15_000 })

    await openWindowFromIcon(page, 'contact')
    await expect(page).toHaveURL(/#contact$/)
  })
})
