import type { CSSProperties, ReactNode } from 'react'
import { User, Code2, FolderOpen, Briefcase, Mail, FileText, Trash2, Cpu } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { OS } from './theme'

// Pixel art renderer — used only for the profile avatar in WinAbout
interface PixelIconProps {
  p: string
  legend: Record<string, string>
  size?: number
  style?: CSSProperties
}

export function PixelIcon({ p, legend, size = 48, style }: PixelIconProps) {
  const lines = p.trim().split('\n')
  const rects: ReactNode[] = []
  for (let y = 0; y < lines.length; y++) {
    let runStart = -1, runColor: string | null = null
    for (let x = 0; x < lines[y].length; x++) {
      const c = lines[y][x]
      const col = legend[c]
      if (col === runColor) {
        // extend run
      } else {
        if (runColor) rects.push(<rect key={`${y}-${runStart}`} x={runStart} y={y} width={x - runStart} height={1} fill={runColor} />)
        runColor = col || null
        runStart = x
      }
    }
    if (runColor) rects.push(<rect key={`${y}-${runStart}-end`} x={runStart} y={y} width={lines[y].length - runStart} height={1} fill={runColor} />)
  }
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', display: 'block', ...style }} shapeRendering="crispEdges">
      {rects}
    </svg>
  )
}

const ICONS: Record<string, LucideIcon> = {
  about:    User,
  skills:   Code2,
  projects: FolderOpen,
  career:   Briefcase,
  contact:  Mail,
  readme:   FileText,
  trash:    Trash2,
  cpu:      Cpu,
}

export type IconKey = keyof typeof ICONS

interface OSIconProps {
  kind: IconKey
  size?: number
  color?: string
}

export function OSIcon({ kind, size = 32, color = OS.chromeFg }: OSIconProps) {
  const Icon = ICONS[kind]
  return <Icon size={size} color={color} strokeWidth={1.5} />
}
