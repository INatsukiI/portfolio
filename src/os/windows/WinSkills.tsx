import { Fragment } from 'react'
import { PROFILE } from '../../profile'
import { OS } from '../theme'
import { SectionHead } from '../components/ui/SectionHead'

export function WinSkills() {
  const profile = PROFILE
  return (
    <div>
      <SectionHead>// stats</SectionHead>
      <div style={{ marginBottom: 14 }}>
        {profile.stats.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
            <div style={{ width: 110, fontSize: 12 }}>{s.key}</div>
            <div style={{
              flex: 1, height: 12,
              background: OS.bodyShade,
              border: `1px solid ${OS.chrome}`,
              boxShadow: `inset 1px 1px 0 ${OS.chromeLite}`,
            }}>
              <div style={{
                height: '100%',
                width: `${s.val}%`,
                background: `repeating-linear-gradient(90deg, ${s.color || OS.blue} 0 6px, ${OS.chrome}33 6px 7px)`,
              }} />
            </div>
            <div style={{ width: 38, textAlign: 'right', fontFamily: 'ui-monospace, monospace', fontSize: 11 }}>{s.val}</div>
          </div>
        ))}
      </div>
      <SectionHead>// skills.csv</SectionHead>
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 0,
        border: `1px solid ${OS.chrome}`,
        background: OS.body,
        fontFamily: 'ui-monospace, monospace', fontSize: 12,
      }}>
        {['NAME', 'CATEGORY', 'LEVEL'].map((h, i) => (
          <div key={i} style={{
            background: OS.chrome, color: OS.chromeFg,
            padding: '3px 8px',
            fontFamily: '"Press Start 2P", monospace', fontSize: 8,
            letterSpacing: 1,
          }}>{h}</div>
        ))}
        {profile.skills.map((sk, i) => (
          <Fragment key={i}>
            <div style={{ padding: '4px 8px', background: i % 2 ? OS.bodyAlt : OS.body, borderTop: `1px solid ${OS.bodyEdge}` }}>{sk.name}</div>
            <div style={{ padding: '4px 8px', background: i % 2 ? OS.bodyAlt : OS.body, borderTop: `1px solid ${OS.bodyEdge}`, color: OS.inkSoft }}>{sk.cat}</div>
            <div style={{ padding: '4px 8px', background: i % 2 ? OS.bodyAlt : OS.body, borderTop: `1px solid ${OS.bodyEdge}` }}>{sk.lv}</div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
