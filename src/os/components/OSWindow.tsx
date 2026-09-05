import type { CSSProperties, ReactNode, PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { motion } from 'framer-motion'
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

export function OSWindow({ title, x, y, w, h, z, compact, maximized, onClose, onFocus, onMove, onResize, onMinimize, onMaximize, children, plain }: OSWindowProps) {
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
        className="relative flex flex-col flex-1 min-h-0 rounded-lg overflow-hidden"
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
          className={cn(
            'relative flex items-center gap-3 px-4 py-3 flex-shrink-0 select-none',
            !compact && 'cursor-grab active:cursor-grabbing',
          )}
          style={{
            background: 'rgba(0, 212, 255, 0.04)',
            borderBottom: '1px solid rgba(0, 212, 255, 0.12)',
            touchAction: 'none',
          }}
        >
          {/* Window controls */}
          <button
            onClick={(e) => { e.stopPropagation(); onClose() }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full flex-shrink-0 transition-opacity hover:opacity-80"
            style={{ background: '#ff4d6a', boxShadow: '0 0 6px rgba(255,77,106,0.5)' }}
            title="閉じる"
          />
          <button
            onClick={(e) => { e.stopPropagation(); onMinimize() }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full flex-shrink-0 transition-opacity hover:opacity-80"
            style={{ background: '#ffbd2e', boxShadow: '0 0 6px rgba(255,189,46,0.5)' }}
            title="最小化"
          />
          <button
            onClick={(e) => { e.stopPropagation(); onMaximize() }}
            onPointerDown={(e) => e.stopPropagation()}
            className="w-3 h-3 rounded-full flex-shrink-0 transition-opacity hover:opacity-80"
            style={{ background: '#28c840', boxShadow: '0 0 6px rgba(40,200,64,0.5)' }}
            title="最大化"
          />

          {/* Title — absolutely centered so traffic-light buttons don't offset it */}
          <div
            className="absolute inset-x-0 text-center text-xs tracking-widest truncate px-16 pointer-events-none"
            style={{
              color: 'rgba(200,216,232,0.6)',
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {title}
          </div>
        </div>

        {/* Content */}
        <div
          className={cn('flex-1 min-h-0', plain ? 'overflow-hidden' : 'overflow-auto p-5')}
          style={{
            fontSize: compact ? 12 : 13,
            lineHeight: 1.7,
            color: '#c8d8e8',
            fontFamily: "'Space Grotesk', system-ui, sans-serif",
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
              className="absolute top-0 right-0 bottom-0 w-1.5"
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
              className="absolute left-0 right-0 bottom-0 h-1.5"
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
              className="absolute right-0 bottom-0 w-3.5 h-3.5"
              style={{ cursor: 'nwse-resize', touchAction: 'none' }}
              role="slider"
              tabIndex={0}
              title="サイズを変更"
              aria-label="サイズを変更"
              aria-valuenow={w}
              aria-orientation="horizontal"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" className="absolute right-0.5 bottom-0.5 pointer-events-none">
                <path d="M12 3 L3 12 M12 7.5 L7.5 12 M12 11 L11 12" stroke="rgba(0,212,255,0.4)" strokeWidth="1" />
              </svg>
            </div>
          </>
        ) : null}
      </div>
    </motion.div>
  )
}
