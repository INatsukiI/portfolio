import { describe, it, expect, vi, afterEach } from 'vitest'
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

// jsdom は getBoundingClientRect が常に 0 を返すため、useContainerSize をモックして
// window.innerWidth / innerHeight をそのままコンテナサイズとして扱う（デスクトップ幅の検証用）
vi.mock('./hooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./hooks')>()
  return {
    ...actual,
    useContainerSize: () => ({ w: window.innerWidth, h: window.innerHeight }),
  }
})

// window.innerWidth / innerHeight を書き換えて、起動直後ウィンドウの初期クランプ計算を検証するヘルパー
function setViewport(width: number, height: number) {
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height })
}

const DEFAULT_INNER_WIDTH = window.innerWidth
const DEFAULT_INNER_HEIGHT = window.innerHeight

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

  // issue #120: compact の閾値（720px）以上の通常デスクトップ表示でも、
  // WIN_DEFAULTS のウィンドウ幅が画面に対して大きすぎるとアイコン列・SYSTEM パネルと重なっていた。
  describe('狭めのデスクトップ幅（720〜1000px）でのウィンドウクランプ', () => {
    afterEach(() => {
      setViewport(DEFAULT_INNER_WIDTH, DEFAULT_INNER_HEIGHT)
    })

    it('768px 幅では起動直後の readme ウィンドウがアイコン列と重ならない位置・幅にクランプされる', () => {
      setViewport(768, 1024)
      render(<OSScene />)

      const win = screen.getByTestId('window-readme')
      const x = parseFloat(win.style.left)
      const w = parseFloat(win.style.width)

      // アイコン列（left-3 + w-24 ≈ 108px）の右側に十分な余白を残して開始する
      expect(x).toBeGreaterThanOrEqual(160 + 16)
      // 右端（EDGE=16）も超えない
      expect(x + w).toBeLessThanOrEqual(768 - 16)
      // WIN_DEFAULTS.readme.w（640）より縮小されている
      expect(w).toBeLessThan(640)
    })

    it('900px 未満では SYSTEM パネルを表示しない（起動直後ウィンドウとの重なりを避ける）', () => {
      setViewport(768, 1024)
      render(<OSScene />)
      expect(screen.queryByText('SYSTEM')).toBeNull()
    })

    it('1000px 幅では SYSTEM パネルを表示しつつ、ウィンドウはパネルと重ならない範囲に収まる', () => {
      setViewport(1000, 900)
      render(<OSScene />)

      expect(screen.getByText('SYSTEM')).toBeTruthy()

      const win = screen.getByTestId('window-readme')
      const x = parseFloat(win.style.left)
      const w = parseFloat(win.style.width)
      // SYSTEM パネル（w-52=208px + right-3=12px）の左端より左でウィンドウが終わる
      expect(x + w).toBeLessThanOrEqual(1000 - 208 - 12)
    })

    it('十分広い（1280px）デスクトップ幅では従来どおり WIN_DEFAULTS の幅のまま開く', () => {
      setViewport(1280, 900)
      render(<OSScene />)

      const win = screen.getByTestId('window-readme')
      expect(parseFloat(win.style.width)).toBe(640)
    })
  })
})
