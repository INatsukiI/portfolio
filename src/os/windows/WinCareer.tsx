import { PROFILE } from '../../profile'
import { OS } from '../theme'
import { SectionHead } from '../components/ui/SectionHead'

export function WinCareer() {
  const profile = PROFILE
  return (
    <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>
      <SectionHead>$ git log --oneline career</SectionHead>
      <div style={{
        background: OS.ink, color: OS.body,
        padding: 12, marginTop: 8,
        fontFamily: 'ui-monospace, monospace', fontSize: 12,
        lineHeight: 1.6,
        border: `2px solid ${OS.chrome}`,
        boxShadow: `inset 1px 1px 0 ${OS.chromeLite}`,
      }}>
        {profile.history.slice().reverse().map((h, i) => (
          <div key={i} style={{ marginBottom: 12, paddingLeft: 14, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, top: 4, color: OS.yellow }}>●</span>
            <div>
              <span style={{ color: OS.yellow }}>commit</span>{' '}
              <span style={{ color: OS.bodyEdge }}>{(0xa1b2c3d + i * 0xdeadbe).toString(16).slice(0, 7)}</span>
            </div>
            <div style={{ color: OS.bodyEdge }}>Date: {h.year}</div>
            <div style={{ marginTop: 4, color: OS.white }}>{h.title}</div>
            <div style={{ color: OS.bodyEdge, fontSize: 11, paddingLeft: 8 }}>{h.org}</div>
            <div style={{ marginTop: 2, fontSize: 11, paddingLeft: 8 }}>{h.body}</div>
          </div>
        ))}
      </div>
      <SectionHead style={{ marginTop: 14 }}>// achievements</SectionHead>
      <ul style={{ paddingLeft: 16, margin: '6px 0 0', fontFamily: '"DotGothic16", monospace' }}>
        {profile.achievements.map((a, i) => (
          <li key={i} style={{ marginBottom: 4 }}>
            <span style={{ color: OS.yellowDark }}>★</span> {a.name}
            <span style={{ color: OS.inkSoft }}> （{a.year}）</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
