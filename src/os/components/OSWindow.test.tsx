import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OSWindow } from './OSWindow'

// framer-motion の motion.div をシンプルな div に差し替え
vi.mock('framer-motion', () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, style, className, onPointerDown, 'data-testid': dataTestId }: any) => (
      <div style={style} className={className} onPointerDown={onPointerDown} data-testid={dataTestId}>
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
    onResize: vi.fn(),
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

  it('右下ハンドルのドラッグで幅・高さの両方を変更して onResize が呼ばれる', () => {
    const onResize = vi.fn()
    render(<OSWindow {...baseProps} onResize={onResize}><div>content</div></OSWindow>)
    const handle = screen.getByTestId('resize-handle-se')
    fireEvent.pointerDown(handle, { clientX: 0, clientY: 0 })
    fireEvent.pointerMove(window, { clientX: 50, clientY: 30 })
    expect(onResize).toHaveBeenCalledWith(450, 330)
  })

  it('右辺ハンドルのドラッグでは幅のみ変更される', () => {
    const onResize = vi.fn()
    render(<OSWindow {...baseProps} onResize={onResize}><div>content</div></OSWindow>)
    const handle = screen.getByTestId('resize-handle-e')
    fireEvent.pointerDown(handle, { clientX: 0, clientY: 0 })
    fireEvent.pointerMove(window, { clientX: 50, clientY: 30 })
    expect(onResize).toHaveBeenCalledWith(450, 300)
  })

  it('下辺ハンドルのドラッグでは高さのみ変更される', () => {
    const onResize = vi.fn()
    render(<OSWindow {...baseProps} onResize={onResize}><div>content</div></OSWindow>)
    const handle = screen.getByTestId('resize-handle-s')
    fireEvent.pointerDown(handle, { clientX: 0, clientY: 0 })
    fireEvent.pointerMove(window, { clientX: 50, clientY: 30 })
    expect(onResize).toHaveBeenCalledWith(400, 330)
  })

  it('compact のときリサイズハンドルが表示されない', () => {
    render(<OSWindow {...baseProps} compact={true}><div>content</div></OSWindow>)
    expect(screen.queryByTestId('resize-handle-se')).toBeNull()
  })

  it('maximized のときリサイズハンドルが表示されない', () => {
    render(<OSWindow {...baseProps} maximized={true}><div>content</div></OSWindow>)
    expect(screen.queryByTestId('resize-handle-se')).toBeNull()
  })

  it('3つのリサイズハンドルすべてに aria-label が付与されている', () => {
    render(<OSWindow {...baseProps}><div>content</div></OSWindow>)
    expect(screen.getByTestId('resize-handle-e').getAttribute('aria-label')).toBe('幅を変更')
    expect(screen.getByTestId('resize-handle-s').getAttribute('aria-label')).toBe('高さを変更')
    expect(screen.getByTestId('resize-handle-se').getAttribute('aria-label')).toBe('サイズを変更')
  })

  it('右辺ハンドルで矢印キー操作すると幅のみ変更される', () => {
    const onResize = vi.fn()
    render(<OSWindow {...baseProps} onResize={onResize}><div>content</div></OSWindow>)
    const handle = screen.getByTestId('resize-handle-e')
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(onResize).toHaveBeenCalledWith(420, 300)
  })

  it('下辺ハンドルで矢印キー操作すると高さのみ変更される', () => {
    const onResize = vi.fn()
    render(<OSWindow {...baseProps} onResize={onResize}><div>content</div></OSWindow>)
    const handle = screen.getByTestId('resize-handle-s')
    fireEvent.keyDown(handle, { key: 'ArrowDown' })
    expect(onResize).toHaveBeenCalledWith(400, 320)
  })

  it('ルート要素とタイトルバーに id ベースの data-testid が付与される', () => {
    render(<OSWindow {...baseProps}><div>content</div></OSWindow>)
    expect(screen.getByTestId('window-about')).toBeTruthy()
    expect(screen.getByTestId('window-titlebar-about')).toBeTruthy()
  })

  it('window control ボタンに aria-label が設定される', () => {
    render(<OSWindow {...baseProps}><div>content</div></OSWindow>)
    expect(screen.getByRole('button', { name: '閉じる' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '最小化' })).toBeTruthy()
    expect(screen.getByRole('button', { name: '最大化' })).toBeTruthy()
  })
})
