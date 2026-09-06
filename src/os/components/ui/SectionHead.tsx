import type { CSSProperties, ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SectionHeadProps {
  children: ReactNode
  style?: CSSProperties
  className?: string
  /** 見出しレベル。省略時は非見出し（従来通りの装飾ラベル） */
  as?: 'h2' | 'h3' | 'h4'
}

export function SectionHead({ children, style, className, as: As }: SectionHeadProps) {
  const label = <span className="text-primary">{children}</span>
  return (
    <div
      className={cn('flex items-center gap-2 font-mono text-sm tracking-wide uppercase mt-1', className)}
      style={style}
    >
      <span className="text-muted-foreground" aria-hidden="true">&gt;</span>
      {As ? <As className="m-0 text-sm font-mono font-semibold uppercase tracking-wide">{label}</As> : label}
      <Separator className="flex-1" />
    </div>
  )
}
