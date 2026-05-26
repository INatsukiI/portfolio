import { PROFILE } from '../../profile'
import { OS } from '../theme'
import { SectionHead } from '../components/ui/SectionHead'

export function WinCareer() {
  const profile = PROFILE
  return (
    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
      <SectionHead>git log --oneline career</SectionHead>
      <div style={{ marginTop: 10 }}>
        {profile.history.slice().reverse().map((h, i) => (
          <div key={i} style={{ marginBottom: 14, paddingLeft: 16, position: 'relative' }}>
            <div style={{
              position: 'absolute', left: 0, top: 6,
              width: 6, height: 6, borderRadius: '50%',
              background: OS.accent,
              boxShadow: `0 0 8px ${OS.accent}`,
            }} />
            <div style={{
              position: 'absolute', left: 2, top: 12,
              width: 1, bottom: -14,
              background: OS.bodyEdge,
            }} />
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 2 }}>
              <span style={{ color: OS.inkSoft }}>commit</span>{' '}
              <span style={{ color: OS.accent, fontSize: 10 }}>{(0xa1b2c3d + i * 0xdeadbe).toString(16).slice(0, 7)}</span>
            </div>
            <div style={{ color: OS.inkSoft, fontSize: 10, marginBottom: 4 }}>Date: {h.year}</div>
            <div style={{ color: OS.white, fontSize: 13, fontWeight: 600, marginBottom: 2, fontFamily: "'Space Grotesk', sans-serif" }}>{h.title}</div>
            <div style={{ color: OS.inkSoft, fontSize: 11, marginBottom: 3 }}>{h.org}</div>
            <div style={{ color: OS.chromeFg, fontSize: 11, lineHeight: 1.6 }}>{h.body}</div>
          </div>
        ))}
      </div>

      <SectionHead style={{ marginTop: 16 }}>achievements</SectionHead>
      <ul style={{ paddingLeft: 0, margin: '10px 0 0', listStyle: 'none' }}>
        {profile.achievements.map((a, i) => (
          <li key={i} style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: OS.yellow, fontSize: 10 }}>★</span>
            <span style={{ color: OS.chromeFg }}>{a.name}</span>
            <span style={{ color: OS.inkSoft, fontSize: 10 }}>{a.year}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
