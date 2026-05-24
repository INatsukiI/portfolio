import type { ReactNode } from 'react'
import { OS } from '../../theme'

interface OSButtonProps {
  children: ReactNode
  primary?: boolean
  onClick?: () => void
  disabled?: boolean
}

export function OSButton({ children, primary, onClick, disabled }: OSButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: primary ? OS.chrome : OS.bodyEdge,
        color: primary ? OS.chromeFg : OS.ink,
        border: 0,
        padding: '5px 10px',
        fontFamily: '"DotGothic16", monospace',
        fontSize: 11,
        boxShadow: `inset 1px 1px 0 ${primary ? OS.chromeLite : OS.body}, inset -1px -1px 0 ${primary ? '#000' : OS.chrome}, 2px 2px 0 ${OS.shadow}`,
        cursor: disabled ? 'default' : 'pointer',
      }}>{children}</button>
  )
}
