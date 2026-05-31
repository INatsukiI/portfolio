import type { IconKey } from './icons'

export const DESKTOP_ICONS: Array<{ id: string; label: string; kind: IconKey }> = [
  { id: 'readme',   label: 'welcome.txt', kind: 'readme' },
  { id: 'about',    label: 'profile.txt', kind: 'about' },
  { id: 'skills',   label: 'skills.app',  kind: 'skills' },
  { id: 'projects', label: 'projects/',   kind: 'projects' },
  { id: 'career',   label: 'career.log',  kind: 'career' },
  { id: 'contact',  label: 'contact.app', kind: 'contact' },
  { id: 'zenn',     label: 'zenn.dev/',   kind: 'zenn' },
  { id: 'trash',    label: 'trash',       kind: 'trash' },
]

export interface WindowDefault {
  title: string
  icon: IconKey
  x: number
  y: number
  w: number
  h: number
}

export const WIN_DEFAULTS: Record<string, WindowDefault> = {
  readme:   { title: 'welcome.txt — メモ帳',    icon: 'readme',   x: 280, y: 60,  w: 460, h: 320 },
  about:    { title: 'profile.txt — メモ帳',     icon: 'about',    x: 120, y: 100, w: 520, h: 360 },
  skills:   { title: 'skills.app',              icon: 'skills',   x: 200, y: 80,  w: 540, h: 480 },
  projects: { title: 'projects — フォルダ',     icon: 'projects', x: 160, y: 110, w: 600, h: 440 },
  career:   { title: 'career.log — Terminal',   icon: 'career',   x: 220, y: 90,  w: 580, h: 460 },
  contact:  { title: 'contact.app',                icon: 'contact',  x: 250, y: 120, w: 520, h: 460 },
  zenn:     { title: 'zenn.dev — 記事一覧',        icon: 'zenn',     x: 240, y: 80,  w: 560, h: 500 },
  trash:    { title: 'ゴミ箱',                     icon: 'trash',    x: 300, y: 140, w: 380, h: 260 },
}

export interface WindowState extends WindowDefault {
  id: string
  z: number
  minimized?: boolean
  maximized?: boolean
}
