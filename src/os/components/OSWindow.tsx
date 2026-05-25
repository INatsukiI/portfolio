import type { CSSProperties, ReactNode, PointerEvent as ReactPointerEvent } from 'react'
import { motion } from 'framer-motion'
import { OS } from '../theme'
import type { IconKey } from '../icons'

interface OSWindowProps {
  id: string
  title: string
  icon: IconKey
  x: number
  y: number
  w: number
  h?: number
  z: number
  compact: boolean
  onClose: () => void
  onFocus: () => void
  onMove: (x: number, y: number) => void
  children: ReactNode
}

export function OSWindow({ title, x, y, w, z, compact, onClose, onFocus, onMove, children }: OSWindowProps) {
  const startDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (compact) return
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
  const positionStyle: CSSProperties = compact ? {
    position: 'absolute',
    left: '3%', right: '3%', top: 38, bottom: 44,
    width: 'auto', minHeight: 0,
  } : {
    position: 'absolute',
    left: x, top: y, width: w, minHeight: 0, maxHeight: '92%',
  }
  return (
    <motion.div
      onPointerDown={onFocus}
      initial={{ opacity: 0, scale: 0.94, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -6 }}
      transition={{ duration: 0.12, ease: 'easeOut' }}
      style={{
        ...positionStyle,
        zIndex: z,
        fontFamily: '"DotGothic16", "Hiragino Kaku Gothic ProN", monospace',
        boxShadow: `4px 4px 0 ${OS.shadow}`,
        display: 'flex', flexDirection: 'column',
      }}>
      <div style={{
        background: OS.chrome,
        padding: 2,
        flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
      }}>
        <div style={{
          background: OS.body,
          border: `1px solid ${OS.chromeLite}`,
          flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
        }}>
          <div
            onPointerDown={startDrag}
            style={{
              background: OS.chrome,
              backgroundImage: `repeating-linear-gradient(0deg, ${OS.chromeLite} 0 2px, ${OS.chrome} 2px 4px)`,
              color: OS.chromeFg,
              padding: '4px 4px 4px 8px',
              display: 'flex', alignItems: 'center', gap: 8,
              cursor: compact ? 'default' : 'grab',
              userSelect: 'none',
              borderBottom: `2px solid ${OS.chrome}`,
              touchAction: 'none',
            }}>
            <div style={{
              background: OS.body, color: OS.chrome,
              padding: '3px 8px',
              fontFamily: '"Press Start 2P", monospace', fontSize: compact ? 8 : 9,
              flex: 1, textAlign: 'center',
              letterSpacing: 1,
              boxShadow: `1px 1px 0 ${OS.chromeHi}`,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{title}</div>
            <button
              onClick={(e) => { e.stopPropagation(); onClose() }}
              onPointerDown={(e) => e.stopPropagation()}
              style={{
                width: compact ? 26 : 18, height: compact ? 26 : 18, border: 0,
                background: OS.red,
                boxShadow: `inset 1px 1px 0 ${OS.bodyEdge}, inset -1px -1px 0 ${OS.redDark}`,
                cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: '"Press Start 2P", monospace', fontSize: compact ? 12 : 8,
                color: OS.body,
                imageRendering: 'pixelated',
                flex: '0 0 auto',
              }} title="閉じる">×</button>
          </div>
          <div style={{
            flex: 1, minHeight: 0,
            background: OS.body, color: OS.ink,
            padding: compact ? 12 : 16, overflow: 'auto',
            fontSize: compact ? 12 : 13, lineHeight: 1.65,
            WebkitOverflowScrolling: 'touch',
          } as CSSProperties}>
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
