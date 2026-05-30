import { PROFILE } from '../../profile'
import { OS } from '../theme'
import { SectionHead } from '../components/ui/SectionHead'
import { Badge } from '@/components/ui/badge'
import { ExternalLink } from 'lucide-react'

const STATUS_LABEL: Record<string, string> = {
  live:     'LIVE',
  wip:      'WIP',
  archived: 'ARCHIVED',
}

const STATUS_COLOR: Record<string, string> = {
  live:     '#00d4ff',
  wip:      '#ffbd2e',
  archived: 'rgba(200,216,232,0.3)',
}

export function WinProjects() {
  const { projects } = PROFILE

  return (
    <div className="font-sans text-sm">
      <SectionHead>projects/</SectionHead>
      <div className="mt-3 flex flex-col gap-3">
        {projects.map((p) => (
          <div
            key={p.name}
            className="rounded-lg p-4"
            style={{
              background: 'rgba(0,212,255,0.03)',
              border: `1px solid ${OS.bodyEdge}`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className="font-bold tracking-wide"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: OS.white }}
              >
                {p.name}
              </span>
              <span
                className="text-[10px] tracking-widest font-mono px-2 py-0.5 rounded"
                style={{
                  color: STATUS_COLOR[p.status],
                  border: `1px solid ${STATUS_COLOR[p.status]}`,
                  background: `${STATUS_COLOR[p.status]}11`,
                }}
              >
                {STATUS_LABEL[p.status]}
              </span>
            </div>

            {/* Description */}
            <p
              className="text-xs leading-relaxed mb-3"
              style={{ color: OS.chromeFg }}
            >
              {p.desc}
            </p>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {p.tech.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="text-[10px] font-mono border-primary/30 text-primary/80 px-1.5 py-0"
                >
                  {t}
                </Badge>
              ))}
            </div>

            {/* Link */}
            {p.url && (
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] transition-opacity hover:opacity-70"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: OS.accent }}
              >
                <ExternalLink size={11} />
                {p.url.replace('https://', '')}
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
