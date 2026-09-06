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
  archived: '#93a7ba',
}

export function WinProjects() {
  const { projects } = PROFILE

  return (
    <div className="font-sans">
      <SectionHead as="h3">projects/</SectionHead>
      <div className="mt-3 flex flex-col gap-3">
        {projects.map((p) => (
          <div
            key={p.name}
            className="fc-border rounded-lg p-4"
            style={{
              background: 'rgba(0,212,255,0.03)',
              border: `1px solid ${OS.bodyEdge}`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4
                className="font-bold tracking-wide m-0 text-base"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: OS.white }}
              >
                {p.name}
              </h4>
              <span
                className="text-xs tracking-wide font-mono px-2 py-0.5 rounded"
                style={{
                  color: STATUS_COLOR[p.status],
                  border: `1px solid ${STATUS_COLOR[p.status]}`,
                  background: `${STATUS_COLOR[p.status]}22`,
                }}
              >
                {STATUS_LABEL[p.status]}
              </span>
            </div>

            {/* Description */}
            <p
              className="text-sm leading-relaxed mb-3"
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
                  className="h-auto py-0.5 text-xs font-mono border-primary/40 text-primary px-2"
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
                className="inline-flex items-center gap-1 text-sm underline underline-offset-2 transition-opacity hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                style={{ fontFamily: "'JetBrains Mono', monospace", color: OS.accent }}
              >
                <ExternalLink size={13} aria-hidden="true" />
                {p.url.replace('https://', '')}
                <span className="sr-only">（新しいタブで開く）</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
