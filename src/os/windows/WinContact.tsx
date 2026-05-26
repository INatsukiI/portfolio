import { PROFILE } from '../../profile'
import { OS } from '../theme'
import { SectionHead } from '../components/ui/SectionHead'
import { Textarea } from '@/components/ui/textarea'

export function WinContact() {
  const profile = PROFILE
  return (
    <div className="font-sans text-sm">
      <SectionHead>links</SectionHead>
      <div className="mt-3 rounded-md border border-border overflow-hidden">
        {profile.contact.map((c, i) => (
          <a
            key={i}
            href={`https://${c.val}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex justify-between items-center px-4 py-2.5 transition-colors hover:bg-accent border-b border-border/50 last:border-0 no-underline"
          >
            <span className="text-muted-foreground font-mono text-[10px] tracking-widest uppercase">{c.label}</span>
            <span className="text-primary font-mono text-xs">{c.val}</span>
          </a>
        ))}
      </div>

      <SectionHead style={{ marginTop: 16 }}>contact</SectionHead>
      <div className="mt-3 rounded-md border border-border bg-card/50 p-4">
        <div className="font-mono text-[10px] tracking-widest uppercase text-primary mb-3">NEW MESSAGE</div>
        <div className="text-[11px] text-muted-foreground font-mono mb-2">
          To: <span className="text-foreground">{profile.contact[0].val}</span>
        </div>
        <Textarea
          readOnly
          defaultValue={`${profile.name}さま\n\nポートフォリオを拝見しました。\nぜひ一度お話ししたく…`}
          className="font-mono text-xs min-h-[90px] resize-none"
          style={{ background: 'rgba(0,0,0,0.3)', color: OS.chromeFg }}
        />
      </div>
    </div>
  )
}
