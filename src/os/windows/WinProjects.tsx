import { OS } from '../theme'

export function WinProjects() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: 200, gap: 12,
      padding: 24,
    }}>
      <div style={{
        width: 48, height: 48,
        border: `2px solid ${OS.bodyEdge}`,
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 8,
      }}>
        <div style={{
          width: 16, height: 16,
          borderRadius: '50%',
          background: OS.accent,
          boxShadow: `0 0 20px ${OS.accent}`,
          animation: 'pulse 2s ease-in-out infinite',
        }} />
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 13, letterSpacing: 3,
        color: OS.accent,
        textTransform: 'uppercase',
      }}>COMING SOON</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 10, color: OS.inkSoft, letterSpacing: 1,
      }}>// 工事中です。しばらくお待ちください。</div>
    </div>
  )
}
