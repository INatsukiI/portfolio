import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OSScene from './OSScene'

// framer-motion の motion.div / AnimatePresence をシンプルな DOM に差し替え
vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    button: ({ children, ...rest }: any) => <button {...rest}>{children}</button>,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('OSScene', () => {
  it('起動時に readme ウィンドウが開いている', () => {
    render(<OSScene />)
    expect(screen.getByText('welcome.txt — メモ帳')).toBeTruthy()
  })

  it('Esc キーで最前面のウィンドウが閉じる', async () => {
    const user = userEvent.setup()
    render(<OSScene />)
    expect(screen.getByText('welcome.txt — メモ帳')).toBeTruthy()

    await user.keyboard('{Escape}')

    await waitFor(() => {
      expect(screen.queryByText('welcome.txt — メモ帳')).toBeNull()
    })
  })
})

describe('OSScene — URL ハッシュ連携（ディープリンク）', () => {
  afterEach(() => {
    // location.hash への直接代入は履歴エントリを増やすため、テストごとにリセットする
    window.history.replaceState(null, '', window.location.pathname + window.location.search)
  })

  it('#projects 付きでアクセスすると projects ウィンドウが最前面で開き、readme は開かない', () => {
    window.location.hash = '#projects'
    render(<OSScene />)

    expect(screen.getByTestId('window-projects')).toBeTruthy()
    expect(screen.queryByTestId('window-readme')).toBeNull()
    expect(screen.getByTestId('taskbar-tab-projects').getAttribute('aria-pressed')).toBe('true')
  })

  it('#about,projects のようにカンマ区切りで複数ウィンドウを開ける（最後が最前面）', () => {
    window.location.hash = '#about,projects'
    render(<OSScene />)

    expect(screen.getByTestId('window-about')).toBeTruthy()
    expect(screen.getByTestId('window-projects')).toBeTruthy()
    expect(screen.getByTestId('taskbar-tab-projects').getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByTestId('taskbar-tab-about').getAttribute('aria-pressed')).toBe('false')
  })

  it('未知の ID は無視して readme をデフォルト表示する', () => {
    window.location.hash = '#unknown-window'
    render(<OSScene />)

    expect(screen.getByTestId('window-readme')).toBeTruthy()
  })

  it('ハッシュで開いたウィンドウを閉じるとハッシュが消える', async () => {
    const user = userEvent.setup()
    window.location.hash = '#projects'
    render(<OSScene />)

    const win = screen.getByTestId('window-projects')
    await user.click(within(win).getByRole('button', { name: '閉じる' }))

    await waitFor(() => {
      expect(window.location.hash).toBe('')
    })
  })

  it('ウィンドウを開くと URL ハッシュに反映される（readme は対象外）', async () => {
    const user = userEvent.setup()
    render(<OSScene />)
    expect(window.location.hash).toBe('')

    await user.click(screen.getByTestId('desktop-icon-about'))

    await waitFor(() => {
      expect(window.location.hash).toBe('#about')
    })
  })

  it('外部からの hashchange イベントに追従して該当ウィンドウを開く', async () => {
    render(<OSScene />)
    expect(screen.queryByTestId('window-contact')).toBeNull()

    window.location.hash = '#contact'
    window.dispatchEvent(new Event('hashchange'))

    await waitFor(() => {
      expect(screen.getByTestId('window-contact')).toBeTruthy()
    })
  })
})
