import { cn } from '@/lib/utils'

interface DataRowProps {
  label: string
  val: string
  mono?: boolean
}

export function DataRow({ label, val, mono }: DataRowProps) {
  return (
    <div className="flex justify-between gap-3 border-b border-border py-1.5 text-sm">
      <span className="text-muted-foreground font-mono text-sm tracking-wide uppercase">{label}</span>
      <span className={cn('text-foreground text-right', mono && 'font-mono')}>{val}</span>
    </div>
  )
}
