import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react'
import { OSIcon } from '../icons'
import type { IconKey } from '../icons'
import { cn } from '@/lib/utils'

interface DesktopIconProps {
  kind: IconKey
  label: string
  onOpen: () => void
  selected: boolean
  compact: boolean
  /** E2E テスト用の識別子（`data-testid` に設定される） */
  testId?: string
}

export function DesktopIcon({ kind, label, onOpen, selected, compact, testId }: DesktopIconProps) {
  const handleClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    onOpen()
  }

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    e.stopPropagation()
    onOpen()
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      data-testid={testId}
      onClick={handleClick}
      onDoubleClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'flex flex-col items-center gap-2 p-2 rounded-lg cursor-default select-none transition-all duration-150 group',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60',
        compact ? 'w-full' : 'w-20',
        selected
          ? 'bg-cyan-500/10 ring-1 ring-cyan-500/40'
          : 'hover:bg-white/5',
      )}
      style={{ touchAction: 'manipulation' }}
    >
      <div
        className={cn(
          'rounded-xl p-3 transition-all duration-150',
          selected
            ? 'bg-cyan-500/15 shadow-[0_0_12px_rgba(0,212,255,0.3)]'
            : 'bg-white/5 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_10px_rgba(0,212,255,0.2)]',
        )}
      >
        <OSIcon
          kind={kind}
          size={compact ? 20 : 20}
          color={selected ? '#00d4ff' : 'rgba(200,216,232,0.75)'}
        />
      </div>
      <span
        className="text-center leading-tight"
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: selected ? '#00d4ff' : 'rgba(200,216,232,0.6)',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  )
}
