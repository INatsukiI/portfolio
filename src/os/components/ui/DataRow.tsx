import { OS } from '../../theme'

interface DataRowProps {
  label: string
  val: string
  mono?: boolean
}

export function DataRow({ label, val, mono }: DataRowProps) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between',
      borderBottom: `1px dashed ${OS.bodyEdge}`,
      padding: '2px 0',
      fontSize: 12,
    }}>
      <span style={{ color: OS.inkSoft, fontFamily: '"Press Start 2P", monospace', fontSize: 8, letterSpacing: 1 }}>{label}</span>
      <span style={{ fontFamily: mono ? 'ui-monospace, monospace' : 'inherit' }}>{val}</span>
    </div>
  )
}
