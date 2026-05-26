import { Trash2 } from 'lucide-react'
import { OS } from '../theme'

export function WinTrash() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
      <div style={{ color: OS.inkSoft, opacity: 0.4 }}>
        <Trash2 size={48} strokeWidth={1} />
      </div>
      <div className="font-mono text-xs tracking-widest uppercase" style={{ color: OS.inkSoft }}>
        ゴミ箱は空です
      </div>
    </div>
  )
}
