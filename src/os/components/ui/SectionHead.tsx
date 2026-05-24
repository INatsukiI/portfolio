import type { CSSProperties, ReactNode } from 'react'
import { OS } from '../../theme'

interface SectionHeadProps {
  children: ReactNode
  style?: CSSProperties
}

export function SectionHead({ children, style }: SectionHeadProps) {
  return (
    <div style={{
      fontFamily: 'ui-monospace, monospace',
      fontSize: 11, color: OS.inkSoft,
      letterSpacing: 0.5,
      marginTop: 4,
      ...style,
    }}>{children}</div>
  )
}
