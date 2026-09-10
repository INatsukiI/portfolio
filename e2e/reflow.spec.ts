import { test, expect } from '@playwright/test'

// WCAG 2.2 SC 1.4.10 Reflow: 320 CSS px 幅（1280px を 400% 拡大した相当）で
// 2 次元スクロールなしに全コンテンツへ到達できることを担保する。
test.describe('狭幅・拡大表示（Reflow）', () => {
  test.use({ viewport: { width: 320, height: 512 } })

  const hasHorizontalScroll = () =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth + 1

  test('320px 幅で横スクロールが出ず、複数ウィンドウが縦に積まれて全内容へ到達できる', async ({ page }) => {
    await page.goto('/portfolio/')
    await expect(page.getByText('LOADING KERNEL...')).toBeHidden({ timeout: 15_000 })
    await expect(page.getByTestId('window-readme')).toBeVisible()

    expect(await page.evaluate(hasHorizontalScroll)).toBe(false)

    // 最大化ボタンは縦 1 カラム表示では出ない
    await expect(
      page.getByTestId('window-readme').getByRole('button', { name: '最大化' }),
    ).toHaveCount(0)

    // ウィンドウを複数開くと縦方向に積まれる（重ならない）
    await page.getByTestId('desktop-icon-about').click()
    await page.getByTestId('desktop-icon-skills').click()
    const about = page.getByTestId('window-about')
    const skills = page.getByTestId('window-skills')
    await expect(about).toBeVisible()
    await expect(skills).toBeVisible()

    const aboxTop = (await about.boundingBox())!.y
    const aboxBottom = aboxTop + (await about.boundingBox())!.height
    const sboxTop = (await skills.boundingBox())!.y
    expect(sboxTop).toBeGreaterThanOrEqual(aboxBottom - 1)

    // ウィンドウを増やしても横スクロールは発生しない
    expect(await page.evaluate(hasHorizontalScroll)).toBe(false)

    // 末尾ウィンドウの最下部コンテンツまでページスクロールで到達できる
    const lastRow = skills.getByRole('heading', { name: 'skills', exact: true })
    await lastRow.scrollIntoViewIfNeeded()
    await expect(lastRow).toBeInViewport()
    expect(await page.evaluate(hasHorizontalScroll)).toBe(false)
  })

  test('タスクバーとトップバーはスクロールしても画面内に留まる', async ({ page }) => {
    await page.goto('/portfolio/')
    await expect(page.getByText('LOADING KERNEL...')).toBeHidden({ timeout: 15_000 })

    await page.getByTestId('desktop-icon-career').click()
    await page.getByTestId('desktop-icon-projects').click()

    await page.mouse.wheel(0, 2000)
    await page.waitForTimeout(200)

    await expect(page.getByTestId('launcher-trigger')).toBeInViewport()
    await expect(page.getByRole('banner')).toBeInViewport()
  })

  test('コンテンツがビューポートより短くてもタスクバーは画面下端に張り付く', async ({ page }) => {
    await page.goto('/portfolio/')
    await expect(page.getByText('LOADING KERNEL...')).toBeHidden({ timeout: 15_000 })

    // 全ウィンドウを閉じてページをビューポートより短くする
    await page.getByTestId('window-readme').getByRole('button', { name: '閉じる' }).click()
    await expect(page.getByTestId('window-readme')).toHaveCount(0)

    // 縦スクロールが発生しない（＝コンテンツがビューポートに収まっている）
    expect(
      await page.evaluate(
        () => document.documentElement.scrollHeight <= document.documentElement.clientHeight + 1,
      ),
    ).toBe(true)

    // それでもタスクバーの下端はビューポート下端にある
    const bar = page.getByRole('navigation', { name: 'タスクバー' })
    const box = (await bar.boundingBox())!
    const vh = page.viewportSize()!.height
    expect(box.y + box.height).toBeGreaterThan(vh - 2)
  })

  test('下方スクロール時に「トップへ戻る」ボタンが出て、押すと最上部へ戻る', async ({ page }) => {
    await page.goto('/portfolio/')
    await expect(page.getByText('LOADING KERNEL...')).toBeHidden({ timeout: 15_000 })

    const btn = page.getByTestId('scroll-to-top')
    // 最上部では非表示
    await expect(btn).toHaveCount(0)

    await page.getByTestId('desktop-icon-career').click()
    await page.getByTestId('desktop-icon-projects').click()

    await page.mouse.wheel(0, 2000)
    await expect(btn).toBeVisible()
    await expect(btn).toBeInViewport()

    await btn.click()
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10)
    await expect(btn).toHaveCount(0)
  })
})
