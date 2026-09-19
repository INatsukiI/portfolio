import { describe, it, expect, vi, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { currentClock, useClock } from './hooks'

describe('currentClock', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('HH:MM 形式の文字列を返す', () => {
    expect(currentClock()).toMatch(/^\d{2}:\d{2}$/)
  })

  it('1桁の時・分をゼロ埋めする（09:05）', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 1, 9, 5))
    expect(currentClock()).toBe('09:05')
  })

  it('深夜 0:00 を正しく返す', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 1, 0, 0))
    expect(currentClock()).toBe('00:00')
  })

  it('23:59 を正しく返す', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 1, 23, 59))
    expect(currentClock()).toBe('23:59')
  })
})

describe('useClock', () => {
  const setVisibility = (state: DocumentVisibilityState) => {
    Object.defineProperty(document, 'visibilityState', { value: state, configurable: true })
    document.dispatchEvent(new Event('visibilitychange'))
  }

  afterEach(() => {
    vi.useRealTimers()
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
  })

  it('分が変わったら 1 秒以内（分境界）に表示が更新される（59 秒→00 秒）', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 1, 9, 0, 59))
    const { result } = renderHook(() => useClock())
    expect(result.current).toBe('09:00')

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe('09:01')
  })

  it('分境界同期後は 60 秒間隔で更新され続ける', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 1, 9, 0, 0))
    const { result } = renderHook(() => useClock())
    expect(result.current).toBe('09:00')

    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(result.current).toBe('09:01')

    act(() => {
      vi.advanceTimersByTime(60_000)
    })
    expect(result.current).toBe('09:02')
  })

  it('タブが非表示の間は更新を止め、復帰時に即時更新する', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2024, 0, 1, 9, 0, 0))
    const { result } = renderHook(() => useClock())
    expect(result.current).toBe('09:00')

    act(() => {
      setVisibility('hidden')
    })

    // 非表示中に 5 分経過（タイマーは止まっているため表示は更新されない）
    act(() => {
      vi.advanceTimersByTime(5 * 60_000)
    })
    expect(result.current).toBe('09:00')

    act(() => {
      setVisibility('visible')
    })
    expect(result.current).toBe('09:05')
  })
})
