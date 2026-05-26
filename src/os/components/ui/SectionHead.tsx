import type { CSSProperties, ReactNode } from 'react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SectionHeadProps {
  children: ReactNode
  style?: CSSProperties
  className?: string
}

export function SectionHead({ children, style, className }: SectionHeadProps) {
  return (
    <div
      className={cn('flex items-center gap-2 font-mono text-[10px] tracking-widest uppercase mt-1', className)}
      style={style}
    >
      <span className="text-muted-foreground">//</span>
      <span className="text-primary">{children}</span>
      <Separator className="flex-1" />
    </div>
  )
}
