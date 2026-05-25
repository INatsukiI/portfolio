import { PROFILE } from '../../profile'
import { OS } from '../theme'
import { PixelIcon } from '../icons'
import { SectionHead } from '../components/ui/SectionHead'
import { DataRow } from '../components/ui/DataRow'

export function WinAbout() {
  const profile = PROFILE
  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 14, alignItems: 'flex-start' }}>
        <div style={{
          width: 96, height: 120,
          background: OS.bodyEdge,
          border: `2px solid ${OS.chrome}`,
          boxShadow: `inset 0 0 0 2px ${OS.body}`,
          padding: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flex: '0 0 auto',
        }}>
          <PixelIcon
            p={`
................
.........afff...
....abbbbaafff..
...abbbgbbaaff..
..aebbbbbba.af..
..aeabbbba......
...aabbbacccc...
...acccccccca...
..accdddddcca...
..acdddddddcca..
..acddddddccca..
..acccccccccca..
...aacccccaaa...
....aeaa.aeaa...
...aaeaa.aeaaa..
................
`}
            legend={{ a: OS.chrome, b: OS.teal, c: OS.chromeLite, d: OS.bodyEdge, e: OS.yellow, f: OS.green, g: OS.ink }}
            size={84}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: '"Press Start 2P", monospace', fontSize: 13,
            marginBottom: 6, letterSpacing: 1,
          }}>{profile.name}</div>
          <div style={{ fontSize: 12, marginBottom: 8, color: OS.inkSoft }}>
            {profile.handle}
          </div>
          <DataRow label="Title" val={profile.title} />
          <DataRow label="Level" val={`Lv.${profile.level} （${profile.exp}）`} />
          <DataRow label="Loc"   val={profile.location} />
        </div>
      </div>
      <SectionHead>// bio</SectionHead>
      <p style={{ margin: '6px 0 12px', fontStyle: 'italic', color: OS.inkSoft }}>
        {profile.tagline}
      </p>
      <p style={{ margin: 0 }}>{profile.bio}</p>
    </div>
  )
}
