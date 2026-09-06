import { PROFILE } from '../../profile'
import { OS } from '../theme'
import { SectionHead } from '../components/ui/SectionHead'
import { DataRow } from '../components/ui/DataRow'

export function WinAbout() {
  const profile = PROFILE
  return (
    <div className="font-sans">
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, alignItems: 'flex-start' }}>
        <img
          src={`${import.meta.env.BASE_URL}avatar.png`}
          alt={`${profile.name} のアバター`}
          width={88}
          height={88}
          className="flex-shrink-0 rounded-lg border border-border"
          style={{ imageRendering: 'pixelated', objectFit: 'cover' }}
        />
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: '1.0625rem',
            fontWeight: 700, color: OS.white,
            margin: '0 0 4px', letterSpacing: 0.5,
          }}>{profile.name}</h3>
          <div className="text-sm" style={{ marginBottom: 10, color: OS.accent, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5 }}>
            {profile.handle}
          </div>
          <DataRow label="Title" val={profile.title} />
          <DataRow label="Level" val={`Lv.${profile.level} （${profile.exp}）`} />
          <DataRow label="Loc"   val={profile.location} />
        </div>
      </div>
      <SectionHead as="h3">bio</SectionHead>
      <p className="text-sm" style={{ margin: '8px 0', color: OS.accent, fontFamily: 'var(--font-sans)' }}>
        {profile.tagline}
      </p>
      <p style={{ margin: 0, color: OS.chromeFg, lineHeight: 1.75 }}>{profile.bio}</p>
    </div>
  )
}
