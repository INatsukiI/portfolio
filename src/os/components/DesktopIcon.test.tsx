import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DesktopIcon } from './DesktopIcon'

describe('DesktopIcon', () => {
  const baseProps = {
    kind: 'about',
    label: 'profile.txt',
    selected: false,
    compact: false,
    onOpen: vi.fn(),
  } as const

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('ラベルを表示する', () => {
    render(<DesktopIcon {...baseProps} />)
    expect(screen.getByText('profile.txt')).toBeTruthy()
  })

  it('クリックで onOpen が呼ばれる', async () => {
    const onOpen = vi.fn()
    const user = userEvent.setup()
    render(<DesktopIcon {...baseProps} onOpen={onOpen} />)
    await user.click(screen.getByText('profile.txt'))
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it('selected=true のとき aria-pressed が true になる', () => {
    render(<DesktopIcon {...baseProps} selected={true} />)
    expect(screen.getByRole('button', { name: 'profile.txt' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('selected=false のとき aria-pressed が false になる', () => {
    render(<DesktopIcon {...baseProps} selected={false} />)
    expect(screen.getByRole('button', { name: 'profile.txt' }).getAttribute('aria-pressed')).toBe('false')
  })

  it('testId を渡すと data-testid に設定される', () => {
    render(<DesktopIcon {...baseProps} testId="desktop-icon-about" />)
    expect(screen.getByTestId('desktop-icon-about')).toBeTruthy()
  })

  it('testId 未指定のとき data-testid は付与されない', () => {
    render(<DesktopIcon {...baseProps} />)
    expect(screen.getByRole('button', { name: 'profile.txt' }).hasAttribute('data-testid')).toBe(false)
  })

  it('ネイティブ button 要素として描画され、aria-label が設定される', () => {
    render(<DesktopIcon {...baseProps} />)
    const el = screen.getByRole('button', { name: 'profile.txt' })
    expect(el.tagName).toBe('BUTTON')
    expect(el.getAttribute('type')).toBe('button')
  })

  it('Enter キーで onOpen が呼ばれる', async () => {
    const onOpen = vi.fn()
    const user = userEvent.setup()
    render(<DesktopIcon {...baseProps} onOpen={onOpen} />)
    screen.getByRole('button', { name: 'profile.txt' }).focus()
    await user.keyboard('{Enter}')
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it('Space キーで onOpen が呼ばれる', async () => {
    const onOpen = vi.fn()
    const user = userEvent.setup()
    render(<DesktopIcon {...baseProps} onOpen={onOpen} />)
    screen.getByRole('button', { name: 'profile.txt' }).focus()
    await user.keyboard(' ')
    expect(onOpen).toHaveBeenCalledOnce()
  })
})
