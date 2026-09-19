import type { MouseEvent as ReactMouseEvent } from 'react'
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
  const handleClick = (e: ReactMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onOpen()
  }

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={label}
      data-testid={testId}
      onClick={handleClick}
      className={cn(
        'flex flex-col items-center gap-2 p-2 rounded-lg cursor-pointer select-none transition-all duration-150 group',
        'border-0 bg-transparent text-left appearance-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent focus-visible:ring-primary',
        compact ? 'w-full' : 'w-24',
        selected
          ? 'bg-cyan-500/10 ring-1 ring-cyan-500/50'
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
          size={22}
          color={selected ? '#00d4ff' : '#c8d8e8'}
        />
      </div>
      <span
        className="text-center leading-tight text-sm font-mono"
        style={{
          color: selected ? '#00d4ff' : '#c8d8e8',
        }}
      >
        {label}
      </span>
    </button>
  )
}
