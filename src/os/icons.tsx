import { User, Code2, FolderOpen, Briefcase, Contact, FileText, Trash2, Cpu, BookOpen, Terminal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { OS } from './theme'

const ICONS: Record<string, LucideIcon> = {
  about:    User,
  skills:   Code2,
  projects: FolderOpen,
  career:   Briefcase,
  contact:  Contact,
  readme:   FileText,
  trash:    Trash2,
  cpu:      Cpu,
  zenn:     BookOpen,
  terminal: Terminal,
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
