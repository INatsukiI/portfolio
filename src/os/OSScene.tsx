import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DropdownMenu } from 'radix-ui'
import { PROFILE } from '../profile'
import { OSIcon } from './icons'
import { useContainerSize, currentClock } from './hooks'
import { DESKTOP_ICONS, WIN_DEFAULTS } from './constants'
import type { WindowState } from './constants'
import { DesktopIcon } from './components/DesktopIcon'
import { OSWindow } from './components/OSWindow'
import { WinAbout } from './windows/WinAbout'
import { WinSkills } from './windows/WinSkills'
import { WinProjects } from './windows/WinProjects'
import { WinCareer } from './windows/WinCareer'
import { WinContact } from './windows/WinContact'
import { WinReadme } from './windows/WinReadme'
import { WinTrash } from './windows/WinTrash'
import { WinZenn } from './windows/WinZenn'
import { cn } from '@/lib/utils'

const DESKTOP_STYLE = {
  background: '#080c14',
  backgroundImage: `
    radial-gradient(circle at 20% 20%, rgba(0,212,255,0.04) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(100,50,255,0.04) 0%, transparent 50%),
    linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)
  `,
  backgroundSize: '100% 100%, 100% 100%, 40px 40px, 40px 40px',
  fontFamily: "'Space Grotesk', system-ui, sans-serif",
  color: '#c8d8e8',
} as const

export default function OSScene() {
  const screenRef = useRef<HTMLDivElement>(null)
  const { w: cw, h: ch } = useContainerSize(screenRef)
  const compact = cw < 720
  // window.innerWidth は同期で取れるので lazy initializer で中央 x を計算
  const [windows, setWindows] = useState<WindowState[]>(() => {
    const d = WIN_DEFAULTS.readme
    const cx = Math.max(0, Math.floor((window.innerWidth - d.w) / 2))
    return [{ id: 'readme', ...d, x: cx, z: 11 }]
  })
  const [zTop, setZTop] = useState(11)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [booting, setBooting] = useState(true)
  const [clock, setClock] = useState(currentClock())
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 2000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const i = setInterval(() => setClock(currentClock()), 30000)
    return () => clearInterval(i)
  }, [])

  const openWindow = (id: string) => {
    const newZ = zTop + 1
    setZTop(newZ)
    setWindows((ws) => {
      const ex = ws.find(w => w.id === id)
      if (ex) return ws.map(w => w.id === id ? { ...w, z: newZ, minimized: false } : w)
      const d = WIN_DEFAULTS[id]
      if (!d) return ws
      const offset = (ws.length % 5) * 20
      // xAlign に応じて基準 x を決める（right: 画面右端寄り、left: サイドバー右、center: 中央）
      const EDGE = 16
      const SIDEBAR = compact ? 0 : 160
      let baseX: number
      if (d.xAlign === 'right') {
        baseX = Math.max(0, cw - d.w - EDGE)
      } else if (d.xAlign === 'left') {
        baseX = SIDEBAR + EDGE
      } else {
        baseX = Math.max(0, Math.floor((cw - d.w) / 2))
      }
      // right/left 寄せの場合は x 方向のオフセットを小さめに抑える
      const xOff = d.xAlign && d.xAlign !== 'center' ? Math.min(offset, 10) : offset
      const finalX = Math.max(0, Math.min(cw - EDGE, baseX + xOff))
      return [...ws, { id, ...d, x: finalX, y: d.y + offset, z: newZ }]
    })
  }

  const closeWindow = (id: string) => setWindows(ws => ws.filter(w => w.id !== id))
  const focusWindow = (id: string) => {
    const newZ = zTop + 1
    setZTop(newZ)
    setWindows(ws => ws.map(w => w.id === id ? { ...w, z: newZ, minimized: false } : w))
  }
  const moveWindow = (id: string, x: number, y: number) => {
    const topBar    = compact ? 36 : 40
    const bottomBar = 52
    const TITLE_H   = 44   // タイトルバーの高さ目安
    const MARGIN    = 80   // 画面端に残す最小幅
    setWindows(ws => ws.map(w => {
      if (w.id !== id) return w
      const cx = Math.max(-(w.w - MARGIN), Math.min(cw - MARGIN, x))
      const cy = Math.max(topBar, Math.min(ch - bottomBar - TITLE_H, y))
      return { ...w, x: cx, y: cy }
    }))
  }
  const minimizeWindow = (id: string) =>
    setWindows(ws => ws.map(w => w.id === id ? { ...w, minimized: true } : w))
  const maximizeWindow = (id: string) =>
    setWindows(ws => ws.map(w => w.id === id ? { ...w, maximized: !w.maximized } : w))

  const renderWindowContent = (w: WindowState) => {
    if (w.id === 'readme')   return <WinReadme onOpen={openWindow} />
    if (w.id === 'about')    return <WinAbout />
    if (w.id === 'skills')   return <WinSkills />
    if (w.id === 'projects') return <WinProjects />
    if (w.id === 'career')   return <WinCareer />
    if (w.id === 'contact')  return <WinContact />
    if (w.id === 'trash')    return <WinTrash />
    if (w.id === 'zenn')     return <WinZenn />
    return null
  }

  return (
    <div
      ref={screenRef}
      onClick={(e) => { if (e.target === screenRef.current) setSelectedIcon(null) }}
      className="relative w-full h-full overflow-hidden select-none"
      style={DESKTOP_STYLE}
    >
      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 flex items-center px-4 z-[100]"
        style={{
          height: compact ? 36 : 40,
          background: 'rgba(6,14,28,0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,212,255,0.1)',
        }}
      >
        <div
          className="font-bold tracking-[0.2em] text-xs"
          style={{ color: '#00d4ff', fontFamily: "'JetBrains Mono', monospace" }}
        >
          OMU/OS
        </div>
        {compact ? null : (
          <div className="flex items-center gap-6 ml-8 text-xs" style={{ color: 'rgba(200,216,232,0.45)' }}>
            {['FILE', 'EDIT', 'VIEW', 'WINDOW'].map(m => (
              <span key={m} className="hover:text-cyan-400 cursor-default transition-colors">{m}</span>
            ))}
          </div>
        )}
        <div className="ml-auto flex items-center gap-4 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(200,216,232,0.45)' }}>
          {compact ? null : <span>{PROFILE.handle}</span>}
          <span style={{ color: '#00d4ff' }}>{clock}</span>
        </div>
      </div>

      {/* Desktop icons */}
      <div
        className={cn('absolute z-[1]', compact
          ? 'top-10 left-0 right-0 p-2 grid grid-cols-3 gap-1'
          : 'top-12 left-3 flex flex-col gap-1'
        )}
      >
        {DESKTOP_ICONS.map(ic => (
          <DesktopIcon
            key={ic.id}
            kind={ic.kind}
            label={ic.label}
            selected={selectedIcon === ic.id}
            compact={compact}
            onOpen={(e) => {
              e.stopPropagation()
              setSelectedIcon(ic.id)
              openWindow(ic.id)
            }}
          />
        ))}
      </div>

      {/* System info panel — desktop only */}
      {compact ? null : (
        <div
          className="absolute top-12 right-3 z-[1] w-48 rounded-lg p-3 text-xs"
          style={{
            background: 'rgba(6,14,28,0.7)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(0,212,255,0.1)',
            fontFamily: "'JetBrains Mono', monospace",
            color: 'rgba(200,216,232,0.5)',
          }}
        >
          <div className="flex items-center gap-1.5 text-[10px] tracking-widest mb-3" style={{ color: '#00d4ff' }}>
            <OSIcon kind="cpu" size={11} color="#00d4ff" />SYSTEM
          </div>
          {[
            ['USER', PROFILE.handle],
            ['HOST', 'omu-node.local'],
            ['UP',   PROFILE.exp],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between mb-1">
              <span>{k}</span><span style={{ color: 'rgba(200,216,232,0.8)' }}>{v}</span>
            </div>
          ))}
          <div className="mt-3 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed)', width: '72%' }}
              initial={{ width: 0 }}
              animate={{ width: '72%' }}
              transition={{ duration: 1.2, delay: 2.2, ease: 'easeOut' }}
            />
          </div>
          <div className="mt-1 text-[10px]">CPU 72% · MEM 4.3 GB</div>
        </div>
      )}

      {/* Windows */}
      <AnimatePresence>
        {windows.filter(w => !w.minimized).map(w => (
          <OSWindow
            key={w.id}
            {...w}
            compact={compact}
            onClose={() => closeWindow(w.id)}
            onFocus={() => focusWindow(w.id)}
            onMove={(x, y) => moveWindow(w.id, x, y)}
            onMinimize={() => minimizeWindow(w.id)}
            onMaximize={() => maximizeWindow(w.id)}
          >
            {renderWindowContent(w)}
          </OSWindow>
        ))}
      </AnimatePresence>

      {/* Bottom taskbar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center gap-2 px-3 z-[100] overflow-visible"
        style={{
          height: compact ? 48 : 44,
          background: 'rgba(6,14,28,0.85)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(0,212,255,0.1)',
        }}
      >
        {/* Start / launcher */}
        <DropdownMenu.Root onOpenChange={setMenuOpen}>
          <DropdownMenu.Trigger asChild>
            <button
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 rounded-md text-xs tracking-widest transition-all duration-150 outline-none flex-shrink-0',
                menuOpen
                  ? 'bg-cyan-500/20 text-cyan-400 ring-1 ring-cyan-500/40'
                  : 'bg-white/5 hover:bg-cyan-500/10 hover:text-cyan-400',
              )}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              <span style={{ color: '#00d4ff' }}>⬡</span>
              {compact ? null : 'LAUNCH'}
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              side="top"
              align="start"
              sideOffset={6}
              className="outline-none z-[9999] w-56 rounded-xl overflow-hidden"
              style={{
                background: 'rgba(6,14,30,0.92)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(0,212,255,0.18)',
                boxShadow: '0 -8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
              }}
            >
              {/* Header */}
              <div
                className="px-4 py-3 border-b"
                style={{ borderColor: 'rgba(0,212,255,0.12)' }}
              >
                <div
                  className="text-xs tracking-widest font-bold"
                  style={{ color: '#00d4ff', fontFamily: "'JetBrains Mono', monospace" }}
                >
                  OMU/OS
                </div>
                <div className="text-[11px] mt-0.5" style={{ color: 'rgba(200,216,232,0.4)' }}>
                  {PROFILE.handle}
                </div>
              </div>

              {/* Items */}
              <div className="py-1">
                {DESKTOP_ICONS.map(ic => (
                  <DropdownMenu.Item
                    key={ic.id}
                    onSelect={() => openWindow(ic.id)}
                    className="flex items-center gap-3 px-4 py-2.5 text-xs cursor-pointer outline-none transition-colors"
                    style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(200,216,232,0.7)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(0,212,255,0.08)'
                      e.currentTarget.style.color = '#00d4ff'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent'
                      e.currentTarget.style.color = 'rgba(200,216,232,0.7)'
                    }}
                  >
                    <OSIcon kind={ic.kind} size={16} color="currentColor" />
                    {ic.label}
                  </DropdownMenu.Item>
                ))}
              </div>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>

        {/* Separator */}
        <div className="w-px h-5 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }} />

        {/* Open window tabs */}
        <div className="flex gap-2 flex-1 min-w-0 overflow-x-auto">
          {windows.map(w => (
            <button
              key={w.id}
              onClick={() => focusWindow(w.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-1 rounded-md text-xs flex-shrink-0 transition-all duration-150',
                w.z === zTop
                  ? 'bg-cyan-500/15 ring-1 ring-cyan-500/30 text-cyan-300'
                  : 'bg-white/5 text-[rgba(200,216,232,0.5)] hover:bg-white/8 hover:text-[rgba(200,216,232,0.8)]',
              )}
              style={{
                maxWidth: compact ? 100 : 160,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              <OSIcon kind={w.icon} size={12} color="currentColor" />
              {compact ? null : (
                <span className="truncate">{w.title.split('—')[0].trim()}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Boot splash */}
      <AnimatePresence>
        {booting ? (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute inset-0 z-[999] flex flex-col items-center justify-center gap-6"
            style={{ background: '#050810' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-[0.3em]"
              style={{ color: '#00d4ff', fontFamily: "'JetBrains Mono', monospace", textShadow: '0 0 40px rgba(0,212,255,0.5)' }}
            >
              OMU/OS
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xs tracking-widest"
              style={{ color: 'rgba(200,216,232,0.3)', fontFamily: "'JetBrains Mono', monospace" }}
            >
              v1.0 · INITIALIZING
            </motion.div>
            <div
              className="w-48 h-px overflow-hidden mt-2"
              style={{ background: 'rgba(0,212,255,0.1)' }}
            >
              <motion.div
                className="h-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.6, delay: 0.4, ease: 'easeInOut' }}
                style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)' }}
              />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.2, delay: 0.6, repeat: 1 }}
              className="text-[10px]"
              style={{ color: 'rgba(0,212,255,0.4)', fontFamily: "'JetBrains Mono', monospace" }}
            >
              LOADING KERNEL...
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
