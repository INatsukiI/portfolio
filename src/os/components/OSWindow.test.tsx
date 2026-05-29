import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OSWindow } from './OSWindow'

// framer-motion の motion.div をシンプルな div に差し替え
vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, style, className, onPointerDown }: any) => (
      <div style={style} className={className} onPointerDown={onPointerDown}>
        {children}
      </div>
    ),
  },
}))

describe('OSWindow', () => {
  const baseProps = {
    id: 'about',
    title: 'profile.txt — メモ帳',
    icon: 'about',
    x: 100,
    y: 100,
    w: 400,
    h: 300,
    z: 10,
    compact: false,
    onClose: vi.fn(),
    onFocus: vi.fn(),
    onMove: vi.fn(),
    onMinimize: vi.fn(),
    onMaximize: vi.fn(),
  } as const

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('タイトルを表示する', () => {
    render(<OSWindow {...baseProps}><div>content</div></OSWindow>)
    expect(screen.getByText('profile.txt — メモ帳')).toBeTruthy()
  })

  it('子要素を表示する', () => {
    render(<OSWindow {...baseProps}><div>テストコンテンツ</div></OSWindow>)
    expect(screen.getByText('テストコンテンツ')).toBeTruthy()
  })

  it('閉じるボタンで onClose が呼ばれる', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<OSWindow {...baseProps} onClose={onClose}><div>content</div></OSWindow>)
    await user.click(screen.getByTitle('閉じる'))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('最小化ボタンで onMinimize が呼ばれる', async () => {
    const onMinimize = vi.fn()
    const user = userEvent.setup()
    render(<OSWindow {...baseProps} onMinimize={onMinimize}><div>content</div></OSWindow>)
    await user.click(screen.getByTitle('最小化'))
    expect(onMinimize).toHaveBeenCalledOnce()
  })

  it('最大化ボタンで onMaximize が呼ばれる', async () => {
    const onMaximize = vi.fn()
    const user = userEvent.setup()
    render(<OSWindow {...baseProps} onMaximize={onMaximize}><div>content</div></OSWindow>)
    await user.click(screen.getByTitle('最大化'))
    expect(onMaximize).toHaveBeenCalledOnce()
  })
})
