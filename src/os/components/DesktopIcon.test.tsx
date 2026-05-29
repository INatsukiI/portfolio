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

  it('selected=true のときリングのクラスが付く', () => {
    const { container } = render(<DesktopIcon {...baseProps} selected={true} />)
    expect((container.firstChild as HTMLElement).className).toContain('ring-1')
  })

  it('selected=false のときリングのクラスが付かない', () => {
    const { container } = render(<DesktopIcon {...baseProps} selected={false} />)
    expect((container.firstChild as HTMLElement).className).not.toContain('ring-1')
  })
})
