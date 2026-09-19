import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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
  beforeEach(() => {
    window.sessionStorage.clear()
  })

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

  it('初回起動時はブートスプラッシュが表示される', () => {
    render(<OSScene />)
    expect(screen.getByText('LOADING KERNEL...')).toBeTruthy()
    expect(screen.getByText('press any key to skip')).toBeTruthy()
  })

  it('キー押下でブートスプラッシュが即座に消える', async () => {
    const user = userEvent.setup()
    render(<OSScene />)
    expect(screen.getByText('LOADING KERNEL...')).toBeTruthy()

    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.queryByText('LOADING KERNEL...')).toBeNull()
    })
  })

  it('クリックでもブートスプラッシュが消える', async () => {
    const user = userEvent.setup()
    render(<OSScene />)
    expect(screen.getByText('LOADING KERNEL...')).toBeTruthy()

    await user.click(document.body)

    await waitFor(() => {
      expect(screen.queryByText('LOADING KERNEL...')).toBeNull()
    })
  })

  it('同一タブでの再訪時はブートスプラッシュを省略する', async () => {
    const user = userEvent.setup()
    const { unmount } = render(<OSScene />)
    expect(screen.getByText('LOADING KERNEL...')).toBeTruthy()

    // 1 回目のブートを完了（スキップ）させ、sessionStorage にフラグを立てる
    await user.keyboard('{Enter}')
    await waitFor(() => {
      expect(screen.queryByText('LOADING KERNEL...')).toBeNull()
    })
    unmount()

    // 2 回目のマウント（同一タブでの再訪を模す）ではスプラッシュが出ない
    render(<OSScene />)
    expect(screen.queryByText('LOADING KERNEL...')).toBeNull()
  })
})
