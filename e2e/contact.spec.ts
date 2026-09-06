import { test, expect } from '@playwright/test'
import { gotoDesktop, openWindowFromIcon } from './helpers'

test.beforeEach(async ({ page }) => {
  await gotoDesktop(page)
  await openWindowFromIcon(page, 'contact')
})

test('必須項目が未入力のあいだ送信ボタンは無効', async ({ page }) => {
  const win = page.getByTestId('window-contact')
  await expect(win.getByRole('button', { name: 'MAIL APP' })).toBeDisabled()
  await expect(win.getByRole('button', { name: 'GMAIL' })).toBeDisabled()
  await expect(win.getByText('お名前を入力してください')).toBeVisible()
})

test('不正なメールアドレスはインラインエラーを表示し送信不可のまま', async ({ page }) => {
  const win = page.getByTestId('window-contact')
  await win.getByPlaceholder('お名前').fill('テスト太郎')
  await win.getByPlaceholder('メールアドレス').fill('invalid-email')
  await win.getByPlaceholder('メールアドレス').blur()

  await expect(win.getByText('有効なメールアドレスを入力してください')).toBeVisible()
  await expect(win.getByRole('button', { name: 'GMAIL' })).toBeDisabled()
})

test('必須項目を正しく埋めると送信ボタンが有効になり、送信後にフィードバックが出る', async ({ page }) => {
  const win = page.getByTestId('window-contact')
  await win.getByPlaceholder('お名前').fill('テスト太郎')
  await win.getByPlaceholder('メールアドレス').fill('test@example.com')

  // 本文が未入力のあいだはヒントが出て無効
  await expect(win.getByText('メッセージを入力してください')).toBeVisible()
  await expect(win.getByRole('button', { name: 'MAIL APP' })).toBeDisabled()

  await win.getByPlaceholder('メッセージを入力してください...').fill('E2E テストからのメッセージです。')

  const mailApp = win.getByRole('button', { name: 'MAIL APP' })
  await expect(mailApp).toBeEnabled()

  await mailApp.click()
  await expect(win.getByText('メールアプリを開きました')).toBeVisible()
})
