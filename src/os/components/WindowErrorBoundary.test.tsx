import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WindowErrorBoundary } from './WindowErrorBoundary'

/** throwWhen() が true を返す間だけ throw するテスト用コンポーネント */
function Bomb({ throwWhen }: { throwWhen: () => boolean }) {
  if (throwWhen()) throw new Error('boom')
  return <div>復旧しました</div>
}

describe('WindowErrorBoundary', () => {
  beforeEach(() => {
    // React / componentDidCatch が例外を console.error に出すため、テスト出力を静かにする
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('子が正常な場合はそのまま子を表示する', () => {
    render(
      <WindowErrorBoundary title="profile.txt">
        <div>通常のコンテンツ</div>
      </WindowErrorBoundary>,
    )
    expect(screen.getByText('通常のコンテンツ')).toBeTruthy()
  })

  it('子が throw するとフォールバック UI を表示する', () => {
    render(
      <WindowErrorBoundary title="profile.txt">
        <Bomb throwWhen={() => true} />
      </WindowErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toBeTruthy()
    expect(screen.getByText(/SEGMENTATION FAULT/)).toBeTruthy()
    expect(screen.getByText(/profile.txt/)).toBeTruthy()
  })

  it('1 つのウィンドウが throw しても他のウィンドウは影響を受けない', () => {
    const onOpenOther = vi.fn()
    render(
      <div>
        <WindowErrorBoundary title="crashed.app">
          <Bomb throwWhen={() => true} />
        </WindowErrorBoundary>
        <WindowErrorBoundary title="healthy.app">
          <button onClick={onOpenOther}>健全なウィンドウの操作</button>
        </WindowErrorBoundary>
      </div>,
    )

    // 片方はフォールバック表示
    expect(screen.getByText(/SEGMENTATION FAULT/)).toBeTruthy()
    // もう片方は通常どおり操作できる
    const button = screen.getByRole('button', { name: '健全なウィンドウの操作' })
    expect(button).toBeTruthy()
  })

  it('onClose を渡すと「閉じる」ボタンから呼ばれる', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(
      <WindowErrorBoundary title="profile.txt" onClose={onClose}>
        <Bomb throwWhen={() => true} />
      </WindowErrorBoundary>,
    )
    await user.click(screen.getByRole('button', { name: '閉じる' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('onClose 未指定の場合「閉じる」ボタンは表示されない', () => {
    render(
      <WindowErrorBoundary title="profile.txt">
        <Bomb throwWhen={() => true} />
      </WindowErrorBoundary>,
    )
    expect(screen.queryByRole('button', { name: '閉じる' })).toBeNull()
  })

  it('「再読込」ボタンで子を再マウントし、再発しなければ復旧する', async () => {
    let shouldThrow = true
    const user = userEvent.setup()
    render(
      <WindowErrorBoundary title="profile.txt">
        <Bomb throwWhen={() => shouldThrow} />
      </WindowErrorBoundary>,
    )
    expect(screen.getByRole('alert')).toBeTruthy()

    // 再読込前に原因を解消（例: 一時的なデータ不整合が直った想定）
    shouldThrow = false
    await user.click(screen.getByRole('button', { name: '再読込' }))

    expect(screen.getByText('復旧しました')).toBeTruthy()
    expect(screen.queryByRole('alert')).toBeNull()
  })
})
