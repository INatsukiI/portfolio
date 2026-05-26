import { cn } from '@/lib/utils'

interface DataRowProps {
  label: string
  val: string
  mono?: boolean
}

export function DataRow({ label, val, mono }: DataRowProps) {
  return (
    <div className="flex justify-between border-b border-border py-1 text-sm">
      <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">{label}</span>
      <span className={cn('text-foreground', mono && 'font-mono text-xs')}>{val}</span>
    </div>
  )
}
