import { useState, useEffect } from 'react'
import type { RefObject } from 'react'

export function useContainerSize(ref: RefObject<HTMLDivElement | null>): { w: number; h: number } {
  const [size, setSize] = useState({ w: 1024, h: 720 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const r = el.getBoundingClientRect()
      setSize({ w: r.width, h: r.height })
    }
    measure()
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measure)
      ro.observe(el)
      return () => ro.disconnect()
    } else {
      window.addEventListener('resize', measure)
      return () => window.removeEventListener('resize', measure)
    }
  }, [ref])
  return size
}

export function currentClock(): string {
  const d = new Date()
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${hh}:${mm}`
}

/**
 * トップバーの時計表示（HH:MM）。分境界に同期して更新する。
 * - マウント時 / タブ復帰時に即時更新し、次の分境界までの残り ms を待ってから
 *   以降は 60 秒間隔で更新する（表示が実時刻から最大 30 秒ずれる問題の対策）。
 * - タブが非表示の間はタイマーを止め、無駄な再レンダーを抑制する。
 */
export function useClock(): string {
  const [clock, setClock] = useState(currentClock())

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let intervalId: ReturnType<typeof setInterval> | undefined

    const clearTimers = () => {
      if (timeoutId !== undefined) clearTimeout(timeoutId)
      if (intervalId !== undefined) clearInterval(intervalId)
      timeoutId = undefined
      intervalId = undefined
    }

    const start = () => {
      clearTimers()
      setClock(currentClock())
      const now = new Date()
      const msToNextMinute = 60_000 - (now.getSeconds() * 1000 + now.getMilliseconds())
      timeoutId = setTimeout(() => {
        setClock(currentClock())
        intervalId = setInterval(() => setClock(currentClock()), 60_000)
      }, msToNextMinute)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        start()
      } else {
        clearTimers()
      }
    }

    if (document.visibilityState === 'visible') {
      start()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      clearTimers()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return clock
}
