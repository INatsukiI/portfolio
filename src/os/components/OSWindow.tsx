import { useEffect, useId, useRef } from 'react'
import type { CSSProperties, ReactNode, PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { motion } from 'framer-motion'
import { X, Minus, Square } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { IconKey } from '../icons'

type ResizeDir = 'e' | 's' | 'se'

interface OSWindowProps {
  id: string
  title: string
  icon: IconKey
  x: number
  y: number
  w: number
  h: number
  z: number
  compact: boolean
  minimized?: boolean
  maximized?: boolean
  onClose: () => void
  onFocus: () => void
  onMove: (x: number, y: number) => void
  onResize: (w: number, h: number) => void
  onMinimize: () => void
  onMaximize: () => void
  children: ReactNode
  /** padding なし・overflow hidden にする（ターミナルなど自前でスクロール管理するコンテンツ用） */
  plain?: boolean
}

const MOVE_STEP = 20

export function OSWindow({ id, title, x, y, w, h, z, compact, maximized, onClose, onFocus, onMove, onResize, onMinimize, onMaximize, children, plain }: OSWindowProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  // ウィンドウを開いたらフォーカスをそのウィンドウへ移す（WCAG 2.4.3 / ダイアログ相当）
  useEffect(() => {
    panelRef.current?.focus({ preventScroll: true })
  }, [])

  const startDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (compact || maximized) return
    e.preventDefault()
    onFocus()
    const sx = e.clientX, sy = e.clientY
    const ox = x, oy = y
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* ignore */ }
    const onMv = (ev: PointerEvent) => onMove(ox + (ev.clientX - sx), oy + (ev.clientY - sy))
    const onUp = () => {
      window.removeEventListener('pointermove', onMv)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMv)
    window.addEventListener('pointerup', onUp)
  }

  // タイトルバーにフォーカスがある状態で矢印キー → ウィンドウ移動（WCAG 2.1.1）
  const handleTitleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (compact || maximized) return
    if (e.target !== e.currentTarget) return
    let dx = 0, dy = 0
    if (e.key === 'ArrowRight') dx = MOVE_STEP
    else if (e.key === 'ArrowLeft') dx = -MOVE_STEP
    else if (e.key === 'ArrowDown') dy = MOVE_STEP
    else if (e.key === 'ArrowUp') dy = -MOVE_STEP
    else return
    e.preventDefault()
    onFocus()
    onMove(x + dx, y + dy)
  }

  const startResize = (e: ReactPointerEvent<HTMLDivElement>, dir: ResizeDir) => {
    if (compact || maximized) return
    e.preventDefault()
    e.stopPropagation()
    onFocus()
    const sx = e.clientX, sy = e.clientY
    const ow = w, oh = h
    try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* ignore */ }
    const onMv = (ev: PointerEvent) => {
      const nw = dir === 's' ? ow : ow + (ev.clientX - sx)
      const nh = dir === 'e' ? oh : oh + (ev.clientY - sy)
      onResize(nw, nh)
    }
    const onUp = () => {
      window.removeEventListener('pointermove', onMv)
      window.removeEventListener('pointerup', onUp)
    }
    window.addEventListener('pointermove', onMv)
    window.addEventListener('pointerup', onUp)
  }

  const RESIZE_STEP = 20
  const handleResizeKeyDown = (dir: ResizeDir) => (e: ReactKeyboardEvent<HTMLDivElement>) => {
    let dw = 0, dh = 0
    if (dir !== 's') {
      if (e.key === 'ArrowRight') dw = RESIZE_STEP
      else if (e.key === 'ArrowLeft') dw = -RESIZE_STEP
    }
    if (dir !== 'e') {
      if (e.key === 'ArrowDown') dh = RESIZE_STEP
      else if (e.key === 'ArrowUp') dh = -RESIZE_STEP
    }
    if (dw === 0 && dh === 0) return
    e.preventDefault()
    onFocus()
    onResize(w + dw, h + dh)
  }

  const positionStyle: CSSProperties = (compact || maximized) ? {
    position: 'absolute',
    left: compact ? '2%' : 0,
    right: compact ? '2%' : 0,
    top: 40,
    bottom: compact ? 52 : 44,
    width: 'auto',
  } : {
    position: 'absolute',
    left: x, top: y, width: w, height: h,
  }

  return (
    <motion.div
      data-testid={`window-${id}`}
      onPointerDown={onFocus}
      initial={{ opacity: 0, scale: 0.96, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      style={{ ...positionStyle, zIndex: z }}
      className="flex flex-col"
    >
      {/* Glass panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="fc-border relative flex flex-col flex-1 min-h-0 rounded-lg overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary"
        style={{
          background: 'rgba(6, 14, 30, 0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(0, 212, 255, 0.18)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Title bar */}
        <div
          onPointerDown={startDrag}
          onKeyDown={handleTitleKeyDown}
          data-testid={`window-titlebar-${id}`}
          tabIndex={compact || maximized ? undefined : 0}
          aria-label={compact || maximized ? undefined : `${title} — 矢印キーでウィンドウを移動`}
          className={cn(
            'fc-border-b relative flex items-center gap-2 px-3 py-2 flex-shrink-0 select-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
            !compact && 'cursor-grab active:cursor-grabbing',
          )}
          style={{
            background: 'rgba(0, 212, 255, 0.04)',
            borderBottom: '1px solid rgba(0, 212, 255, 0.12)',
            touchAction: 'none',
          }}
        >
          {/* Window controls — 24px のヒットエリア + アイコンで色以外でも判別可能 */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose() }}
            onPointerDown={(e) => e.stopPropagation()}
            className="grid place-items-center w-6 h-6 rounded-md flex-shrink-0 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title="閉じる"
            aria-label="閉じる"
          >
            <span className="grid place-items-center w-3 h-3 rounded-full" style={{ background: '#ff4d6a' }}>
              <X size={8} strokeWidth={3} color="#1a0206" aria-hidden="true" />
            </span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize() }}
            onPointerDown={(e) => e.stopPropagation()}
            className="grid place-items-center w-6 h-6 rounded-md flex-shrink-0 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title="最小化"
            aria-label="最小化"
          >
            <span className="grid place-items-center w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }}>
              <Minus size={8} strokeWidth={3} color="#1a1200" aria-hidden="true" />
            </span>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize() }}
            onPointerDown={(e) => e.stopPropagation()}
            className="grid place-items-center w-6 h-6 rounded-md flex-shrink-0 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title={maximized ? '元のサイズに戻す' : '最大化'}
            aria-label={maximized ? '元のサイズに戻す' : '最大化'}
          >
            <span className="grid place-items-center w-3 h-3 rounded-full" style={{ background: '#28c840' }}>
              <Square size={7} strokeWidth={3} color="#04160a" aria-hidden="true" />
            </span>
          </button>

          {/* Title — absolutely centered so traffic-light buttons don't offset it */}
          <h2
            id={titleId}
            className="absolute inset-x-0 m-0 text-center text-sm font-normal tracking-wide truncate px-24 pointer-events-none"
            style={{
              color: '#c8d8e8',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {title}
          </h2>
        </div>

        {/* Content */}
        <div
          className={cn('flex-1 min-h-0', plain ? 'overflow-hidden' : 'overflow-auto p-5')}
          style={{
            fontSize: '1rem',
            lineHeight: 1.75,
            color: '#c8d8e8',
            fontFamily: "var(--font-sans)",
          }}
        >
          {children}
        </div>

        {/* Resize handles */}
        {!compact && !maximized ? (
          <>
            <div
              onPointerDown={(e) => startResize(e, 'e')}
              onKeyDown={handleResizeKeyDown('e')}
              data-testid="resize-handle-e"
              className="absolute top-0 right-0 bottom-0 w-2.5"
              style={{ cursor: 'ew-resize', touchAction: 'none' }}
              role="slider"
              tabIndex={0}
              title="幅を変更"
              aria-label="幅を変更"
              aria-valuenow={w}
              aria-orientation="horizontal"
            />
            <div
              onPointerDown={(e) => startResize(e, 's')}
              onKeyDown={handleResizeKeyDown('s')}
              data-testid="resize-handle-s"
              className="absolute left-0 right-0 bottom-0 h-2.5"
              style={{ cursor: 'ns-resize', touchAction: 'none' }}
              role="slider"
              tabIndex={0}
              title="高さを変更"
              aria-label="高さを変更"
              aria-valuenow={h}
              aria-orientation="vertical"
            />
            <div
              onPointerDown={(e) => startResize(e, 'se')}
              onKeyDown={handleResizeKeyDown('se')}
              data-testid="resize-handle-se"
              className="absolute right-0 bottom-0 w-6 h-6"
              style={{ cursor: 'nwse-resize', touchAction: 'none' }}
              role="slider"
              tabIndex={0}
              title="サイズを変更"
              aria-label="サイズを変更"
              aria-valuenow={w}
              aria-orientation="horizontal"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" className="absolute right-0.5 bottom-0.5 pointer-events-none">
                <path d="M12 3 L3 12 M12 7.5 L7.5 12 M12 11 L11 12" stroke="rgba(0,212,255,0.55)" strokeWidth="1.25" />
              </svg>
            </div>
          </>
        ) : null}
      </div>
    </motion.div>
  )
}
