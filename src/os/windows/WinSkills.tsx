import { PROFILE } from '../../profile'
import { SectionHead } from '../components/ui/SectionHead'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'

export function WinSkills() {
  const profile = PROFILE
  return (
    <div className="font-sans text-sm">
      <SectionHead>stats</SectionHead>
      <div className="mt-3 mb-5 space-y-3">
        {profile.stats.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-28 text-xs text-muted-foreground font-mono">{s.key}</div>
            <Progress
              value={s.val}
              className="flex-1 h-1.5"
              indicatorStyle={{
                background: s.color,
                boxShadow: `0 0 8px ${s.color}88`,
              }}
            />
            <div className="w-8 text-right font-mono text-xs text-foreground">{s.val}</div>
          </div>
        ))}
      </div>

      <SectionHead>skills</SectionHead>
      <div className="mt-2 rounded-md border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-mono text-[10px] tracking-widest uppercase text-primary h-8 bg-accent/30">NAME</TableHead>
              <TableHead className="font-mono text-[10px] tracking-widest uppercase text-primary h-8 bg-accent/30">CAT</TableHead>
              <TableHead className="font-mono text-[10px] tracking-widest uppercase text-primary h-8 bg-accent/30">LEVEL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profile.skills.map((sk, i) => (
              <TableRow key={i} className="border-border/50">
                <TableCell className="text-foreground">{sk.name}</TableCell>
                <TableCell className="text-muted-foreground">{sk.cat}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-primary/40 text-primary font-mono text-[10px]">
                    {sk.lv}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
