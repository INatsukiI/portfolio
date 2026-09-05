import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OSScene from './OSScene'

// framer-motion の motion.div / AnimatePresence をシンプルな DOM に差し替え
vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
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
