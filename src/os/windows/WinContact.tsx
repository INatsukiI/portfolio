import { PROFILE } from '../../profile'
import { OS } from '../theme'
import { SectionHead } from '../components/ui/SectionHead'
import { DataRow } from '../components/ui/DataRow'
import { OSButton } from '../components/ui/OSButton'

export function WinContact() {
  const profile = PROFILE
  return (
    <div>
      <SectionHead>// mail.app</SectionHead>
      <div style={{
        background: OS.bodyAlt, border: `2px solid ${OS.chrome}`,
        padding: 12, marginTop: 8,
        boxShadow: `inset 1px 1px 0 ${OS.body}`,
      }}>
        <div style={{
          fontFamily: '"Press Start 2P", monospace', fontSize: 10,
          marginBottom: 8, letterSpacing: 1,
        }}>NEW MESSAGE</div>
        <DataRow label="To"      val={profile.contact[0].val} mono />
        <DataRow label="From"    val="あなた" mono />
        <DataRow label="Subject" val="お話ししませんか" mono />
        <textarea
          readOnly
          defaultValue={`${profile.name}さま\n\nポートフォリオを拝見しました。\nぜひ一度お話ししたく…`}
          style={{
            width: '100%', minHeight: 90, marginTop: 6,
            fontFamily: '"DotGothic16", monospace',
            fontSize: 12, lineHeight: 1.5,
            border: `1px solid ${OS.chrome}`,
            background: OS.body, color: OS.ink,
            padding: 8, resize: 'none', boxSizing: 'border-box',
          }} />
        <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
          <OSButton primary>送信</OSButton>
          <OSButton>下書き</OSButton>
        </div>
      </div>
      <SectionHead style={{ marginTop: 14 }}>// links</SectionHead>
      <div style={{ marginTop: 6, border: `1px solid ${OS.chrome}`, background: OS.body }}>
        {profile.contact.map((c, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '6px 10px',
            background: i % 2 ? OS.bodyAlt : OS.body,
            fontFamily: 'ui-monospace, monospace', fontSize: 12,
          }}>
            <span style={{ color: OS.inkSoft }}>{c.label}</span>
            <span>{c.val}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
