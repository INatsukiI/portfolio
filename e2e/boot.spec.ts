import { test, expect } from '@playwright/test'

// issue #118: ブート演出はクリック / キー操作でスキップでき、同一タブでの再訪時は省略される
test.describe('ブート演出', () => {
  test('Enter キーを押すと即座にデスクトップへ遷移する', async ({ page }) => {
    await page.goto('/portfolio/')
    await expect(page.getByText('LOADING KERNEL...')).toBeVisible()

    await page.keyboard.press('Enter')

    // スキップは即時なので、通常の 2 秒待ちより十分短いタイムアウトで消えることを確認する
    await expect(page.getByText('LOADING KERNEL...')).toBeHidden({ timeout: 1_000 })
    await expect(page.getByTestId('window-readme')).toBeVisible()
  })

  test('クリックでも即座にデスクトップへ遷移する', async ({ page }) => {
    await page.goto('/portfolio/')
    await expect(page.getByText('LOADING KERNEL...')).toBeVisible()

    await page.mouse.click(10, 10)

    await expect(page.getByText('LOADING KERNEL...')).toBeHidden({ timeout: 1_000 })
    await expect(page.getByTestId('window-readme')).toBeVisible()
  })

  test('同一タブでの再訪時（リロード）はブート演出を省略する', async ({ page }) => {
    await page.goto('/portfolio/')
    await expect(page.getByText('LOADING KERNEL...')).toBeHidden({ timeout: 15_000 })
    await expect(page.getByTestId('window-readme')).toBeVisible()

    await page.reload()

    // sessionStorage にフラグが立っているため、演出なしで即デスクトップが出る
    await expect(page.getByTestId('window-readme')).toBeVisible({ timeout: 2_000 })
    await expect(page.getByText('LOADING KERNEL...')).toHaveCount(0)
  })
})
