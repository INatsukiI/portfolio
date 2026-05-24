import type { MouseEvent as ReactMouseEvent } from 'react'
import { OS } from '../theme'
import { OSIcon, ICONS } from '../icons'
import type { IconKey } from '../icons'

interface DesktopIconProps {
  kind: IconKey
  label: string
  onOpen: (e: ReactMouseEvent<HTMLDivElement>) => void
  selected: boolean
  compact: boolean
}

export function DesktopIcon({ kind, label, onOpen, selected, compact }: DesktopIconProps) {
  return (
    <div
      onClick={onOpen}
      onDoubleClick={onOpen}
      style={{
        width: compact ? '100%' : 80,
        padding: 4,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        cursor: 'default', userSelect: 'none',
        background: selected ? `${OS.chrome}88` : 'transparent',
        outline: selected ? `1px dotted ${OS.body}` : 'none',
        touchAction: 'manipulation',
      }}>
      <OSIcon {...ICONS[kind]} size={compact ? 44 : 40} />
      <div style={{
        marginTop: 4,
        fontFamily: '"DotGothic16", monospace',
        fontSize: compact ? 10 : 11, color: OS.chromeFg,
        textAlign: 'center',
        textShadow: `1px 1px 0 ${OS.chrome}, -1px 1px 0 ${OS.chrome}, 1px -1px 0 ${OS.chrome}, -1px -1px 0 ${OS.chrome}, 2px 2px 0 ${OS.chrome}66`,
        padding: '1px 4px',
        background: selected ? OS.chrome : 'transparent',
        whiteSpace: 'nowrap',
      }}>{label}</div>
    </div>
  )
}
