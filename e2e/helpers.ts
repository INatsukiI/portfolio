import { expect, type Page } from '@playwright/test'

/**
 * デスクトップを開き、ブートスプラッシュが消えて操作可能になるまで待つ。
 * 起動直後は readme ウィンドウが開いた状態になる。
 */
export async function gotoDesktop(page: Page): Promise<void> {
  await page.goto('/portfolio/')
  // ブート画面（z-index 最上位のオーバーレイ）が消えるまで待つ
  await expect(page.getByText('LOADING KERNEL...')).toBeHidden({ timeout: 15_000 })
  await expect(page.getByTestId('window-readme')).toBeVisible()
}

/** 指定 id のデスクトップアイコンからウィンドウを開く */
export async function openWindowFromIcon(page: Page, id: string): Promise<void> {
  await page.getByTestId(`desktop-icon-${id}`).click()
  await expect(page.getByTestId(`window-${id}`)).toBeVisible()
}
