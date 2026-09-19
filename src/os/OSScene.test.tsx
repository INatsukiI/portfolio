import { describe, it, expect, vi } from 'vitest'
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

  it('タスクバータブで背面のウィンドウを前面化すると、そのウィンドウの dialog にフォーカスが移る（WCAG 2.4.3）', async () => {
    const user = userEvent.setup()
    render(<OSScene />)

    // about を開く（前面に来て about の dialog にフォーカスが移る）
    await user.click(screen.getByTestId('desktop-icon-about'))
    const aboutDialog = within(await screen.findByTestId('window-about')).getByRole('dialog')
    await waitFor(() => expect(document.activeElement).toBe(aboutDialog))

    // 背面に回った readme をタスクバーのタブから前面化する
    const readmeDialog = within(screen.getByTestId('window-readme')).getByRole('dialog')
    await user.click(screen.getByTestId('taskbar-tab-readme'))

    await waitFor(() => expect(document.activeElement).toBe(readmeDialog))
  })

  it('タスクバータブを Enter で押しても、そのウィンドウの dialog にフォーカスが移る', async () => {
    const user = userEvent.setup()
    render(<OSScene />)

    await user.click(screen.getByTestId('desktop-icon-about'))
    const aboutDialog = within(await screen.findByTestId('window-about')).getByRole('dialog')
    await waitFor(() => expect(document.activeElement).toBe(aboutDialog))

    const readmeDialog = within(screen.getByTestId('window-readme')).getByRole('dialog')
    const readmeTab = screen.getByTestId('taskbar-tab-readme')
    readmeTab.focus()
    await user.keyboard('{Enter}')

    await waitFor(() => expect(document.activeElement).toBe(readmeDialog))
  })

  it('最小化したウィンドウをタスクバーから復帰させると、そのウィンドウの dialog にフォーカスが移る', async () => {
    const user = userEvent.setup()
    render(<OSScene />)

    const win = screen.getByTestId('window-readme')
    await user.click(within(win).getByRole('button', { name: '最小化' }))
    await waitFor(() => expect(screen.queryByTestId('window-readme')).toBeNull())

    await user.click(screen.getByTestId('taskbar-tab-readme'))

    const restored = await screen.findByTestId('window-readme')
    const restoredDialog = within(restored).getByRole('dialog')
    await waitFor(() => expect(document.activeElement).toBe(restoredDialog))
  })
})
