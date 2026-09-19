import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppErrorBoundary } from './AppErrorBoundary'

function Bomb(): never {
  throw new Error('boom')
}

describe('AppErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('子が正常な場合はそのまま子を表示する', () => {
    render(
      <AppErrorBoundary>
        <div>OMU/OS デスクトップ</div>
      </AppErrorBoundary>,
    )
    expect(screen.getByText('OMU/OS デスクトップ')).toBeTruthy()
  })

  it('子が throw すると復旧画面を表示する', () => {
    render(
      <AppErrorBoundary>
        <Bomb />
      </AppErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.getByText(/KERNEL PANIC/)).toBeTruthy()
    expect(screen.getByRole('button', { name: '再読み込み' })).toBeTruthy()
  })

  it('「再読み込み」ボタンで location.reload を呼ぶ', async () => {
    const reload = vi.fn()
    const originalLocation = window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...originalLocation, reload },
    })
    const user = userEvent.setup()

    render(
      <AppErrorBoundary>
        <Bomb />
      </AppErrorBoundary>,
    )
    await user.click(screen.getByRole('button', { name: '再読み込み' }))
    expect(reload).toHaveBeenCalledOnce()

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    })
  })
})
