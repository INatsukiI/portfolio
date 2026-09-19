import { describe, it, expect } from 'vitest'
import {
  MIN_W,
  MIN_H,
  SIDEBAR_W,
  SYSTEM_PANEL_RESERVE,
  SYSTEM_PANEL_MIN_CW,
  isSystemPanelVisible,
  clampSize,
  initialWindowBand,
  resizeWindowMaxSize,
} from './windowLayout'

describe('isSystemPanelVisible', () => {
  it('compact 表示では常に非表示', () => {
    expect(isSystemPanelVisible(1280, true)).toBe(false)
  })

  it('非 compact でも 900px 未満では非表示（アイコン列・ウィンドウとの重なりを避ける）', () => {
    expect(isSystemPanelVisible(768, false)).toBe(false)
    expect(isSystemPanelVisible(899, false)).toBe(false)
  })

  it('非 compact かつ 900px 以上では表示', () => {
    expect(isSystemPanelVisible(900, false)).toBe(true)
    expect(isSystemPanelVisible(1280, false)).toBe(true)
  })
})

describe('clampSize', () => {
  it('上限以下ならそのまま返す', () => {
    expect(clampSize(400, 300, 800, 600)).toEqual({ w: 400, h: 300 })
  })

  it('上限を超える場合は上限にクランプする', () => {
    expect(clampSize(1000, 900, 800, 600)).toEqual({ w: 800, h: 600 })
  })

  it('最小サイズを下回らない', () => {
    expect(clampSize(10, 10, 800, 600)).toEqual({ w: MIN_W, h: MIN_H })
  })
})

describe('initialWindowBand', () => {
  it('768px 幅（iPad 縦など）では左のアイコン列を避けた帯になり、幅の上限が縮む', () => {
    // issue #120: compact の閾値（720px）以上だが WIN_DEFAULTS の幅は固定のため、
    // 768px 幅では素朴な中央寄せだとアイコン列と重なっていた。
    const band = initialWindowBand(768, 1024, false)
    expect(band.leftBound).toBe(SIDEBAR_W + 16)
    // SYSTEM パネルは 900px 未満では非表示なので右側の予約はない
    expect(band.rightBound).toBe(768 - 16)
    expect(band.maxW).toBeLessThan(640) // WIN_DEFAULTS.readme.w より狭い
    expect(band.maxW).toBeGreaterThanOrEqual(MIN_W)
  })

  it('1000px 幅では SYSTEM パネル分の余白も右側に確保される', () => {
    const band = initialWindowBand(1000, 900, false)
    expect(band.rightBound).toBe(1000 - SYSTEM_PANEL_RESERVE - 16)
    expect(band.maxW).toBe(band.rightBound - band.leftBound)
  })

  it('帯の外にウィンドウがはみ出さない（幅をクランプすれば leftBound〜rightBound に収まる）', () => {
    const cw = 768
    const band = initialWindowBand(cw, 1024, false)
    const clamped = clampSize(640, 560, band.maxW, band.maxH)
    expect(clamped.w).toBeLessThanOrEqual(band.rightBound - band.leftBound)
  })

  it('compact 時はアイコン列・SYSTEM パネルを考慮せず、EDGE 分だけ余白を取る', () => {
    const band = initialWindowBand(360, 640, true)
    expect(band.leftBound).toBe(16)
    expect(band.rightBound).toBe(360 - 16)
  })

  it('十分広い画面では WIN_DEFAULTS の幅より上限が広く、クランプされない', () => {
    const band = initialWindowBand(1280, 900, false)
    const clamped = clampSize(640, 560, band.maxW, band.maxH)
    expect(clamped).toEqual({ w: 640, h: 560 })
  })
})

describe('resizeWindowMaxSize', () => {
  it('既存のリサイズ上限ロジックと同じ値を返す（EDGE=8, bottomBar 分を差し引く）', () => {
    const cw = 1280
    const ch = 900
    const compact = false
    const edge = 8
    const { maxW, maxH } = resizeWindowMaxSize(cw, ch, compact, edge)
    expect(maxW).toBe(Math.max(MIN_W, cw - edge * 2))
    expect(maxH).toBe(Math.max(MIN_H, ch - 44))
  })

  it('compact 時は bottomBar（タスクバー）分が異なる', () => {
    const { maxH } = resizeWindowMaxSize(360, 640, true, 8)
    expect(maxH).toBe(Math.max(MIN_H, 640 - 48))
  })

  it('SYSTEM パネルの数値定数は width-52(208px) + right-3(12px) と一致する', () => {
    expect(SYSTEM_PANEL_RESERVE).toBe(220)
    expect(SYSTEM_PANEL_MIN_CW).toBe(900)
  })
})
