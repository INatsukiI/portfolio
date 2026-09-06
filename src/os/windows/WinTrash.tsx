import { Trash2 } from 'lucide-react'
import { OS } from '../theme'

export function WinTrash() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
      <div style={{ color: OS.inkSoft }} aria-hidden="true">
        <Trash2 size={48} strokeWidth={1} />
      </div>
      <p className="font-mono text-sm tracking-wide uppercase m-0" style={{ color: OS.inkSoft }}>
        ゴミ箱は空です
      </p>
    </div>
  )
}
