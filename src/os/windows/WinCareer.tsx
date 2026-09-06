import { PROFILE } from '../../profile'
import { OS } from '../theme'
import { SectionHead } from '../components/ui/SectionHead'

export function WinCareer() {
  const profile = PROFILE
  return (
    <div className="font-mono text-sm">
      <SectionHead as="h3">git log --oneline career</SectionHead>
      <div style={{ marginTop: 10 }}>
        {profile.history.slice().reverse().map((h, i) => (
          <div key={i} style={{ marginBottom: 16, paddingLeft: 16, position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 0, top: 7,
              width: 7, height: 7, borderRadius: '50%',
              background: OS.accent,
              boxShadow: `0 0 8px ${OS.accent}`,
            }} aria-hidden="true" />
            <div style={{
              position: 'absolute', left: 3, top: 14,
              width: 1, bottom: -16,
              background: OS.bodyEdge,
            }} aria-hidden="true" />
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 2 }}>
              <span style={{ color: OS.inkSoft }}>commit</span>{' '}
              <span style={{ color: OS.accent }}>{(0xa1b2c3d + i * 0xdeadbe).toString(16).slice(0, 7)}</span>
            </div>
            <div style={{ color: OS.inkSoft, marginBottom: 4 }}>Date: {h.year}</div>
            <h4 style={{ color: OS.white, fontSize: '1rem', fontWeight: 600, margin: '0 0 2px', fontFamily: "var(--font-sans)" }}>{h.title}</h4>
            <div style={{ color: OS.inkSoft, marginBottom: 3 }}>{h.org}</div>
            <div style={{ color: OS.chromeFg, lineHeight: 1.75 }}>{h.body}</div>
          </div>
        ))}
      </div>

      <SectionHead as="h3" style={{ marginTop: 16 }}>achievements</SectionHead>
      <ul style={{ paddingLeft: 0, margin: '10px 0 0', listStyle: 'none' }}>
        {profile.achievements.map((a, i) => (
          <li key={i} style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: OS.yellow }} aria-hidden="true">★</span>
            <span style={{ color: OS.chromeFg }}>{a.name}</span>
            <span style={{ color: OS.inkSoft }}>{a.year}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
