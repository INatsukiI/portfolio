import { PROFILE } from '../../profile'
import { OS } from '../theme'
import { SectionHead } from '../components/ui/SectionHead'
import { DataRow } from '../components/ui/DataRow'

export function WinAbout() {
  const profile = PROFILE
  return (
    <div style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif", fontSize: 13 }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-start' }}>
        <img
          src={`${import.meta.env.BASE_URL}avatar.png`}
          alt="avatar"
          width={88}
          height={88}
          className="flex-shrink-0 rounded-lg border border-border"
          style={{ imageRendering: 'pixelated', objectFit: 'cover' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 15,
            fontWeight: 700, color: OS.white,
            marginBottom: 4, letterSpacing: 1,
          }}>{profile.name}</div>
          <div style={{ fontSize: 11, marginBottom: 10, color: OS.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1 }}>
            {profile.handle}
          </div>
          <DataRow label="Title" val={profile.title} />
          <DataRow label="Level" val={`Lv.${profile.level} （${profile.exp}）`} />
          <DataRow label="Loc"   val={profile.location} />
        </div>
      </div>
      <SectionHead>bio</SectionHead>
      <p style={{ margin: '8px 0', fontStyle: 'italic', color: OS.accent, fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
        {profile.tagline}
      </p>
      <p style={{ margin: 0, color: OS.chromeFg, lineHeight: 1.7 }}>{profile.bio}</p>
    </div>
  )
}
