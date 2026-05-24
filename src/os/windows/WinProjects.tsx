import { OS } from '../theme'

export function WinProjects() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: 200, gap: 16,
      padding: 24,
    }}>
      <div style={{
        fontFamily: '"Press Start 2P", monospace',
        fontSize: 18, letterSpacing: 2,
        color: OS.chrome,
      }}>COMING SOON</div>
      <div style={{
        fontFamily: 'ui-monospace, monospace',
        fontSize: 12, color: OS.inkSoft,
      }}>// 工事中です。しばらくお待ちください。</div>
    </div>
  )
}
