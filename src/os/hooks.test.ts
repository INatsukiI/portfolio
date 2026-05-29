import { describe, it, expect, vi, afterEach } from 'vitest'
import { currentClock } from './hooks'

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
