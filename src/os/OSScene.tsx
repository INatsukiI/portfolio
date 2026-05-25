import { useState, useEffect, useRef } from 'react'
import { PROFILE } from '../profile'
import { OS } from './theme'
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

export default function OSScene() {
  const screenRef = useRef<HTMLDivElement>(null)
  const { w: cw } = useContainerSize(screenRef)
  const compact = cw < 720
  const [windows, setWindows] = useState<WindowState[]>([{ id: 'readme', ...WIN_DEFAULTS.readme, z: 11 }])
  const [zTop, setZTop] = useState(11)
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null)
  const [booting, setBooting] = useState(true)
  const [clock, setClock] = useState(currentClock())
  const [startMenu, setStartMenu] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1500)
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
      if (ex) return ws.map(w => w.id === id ? { ...w, z: newZ } : w)
      const d = WIN_DEFAULTS[id]
      if (!d) return ws
      const offset = (ws.length % 5) * 18
      return [...ws, { id, ...d, x: d.x + offset, y: d.y + offset, z: newZ }]
    })
  }

  const closeWindow = (id: string) => setWindows(ws => ws.filter(w => w.id !== id))

  const focusWindow = (id: string) => {
    const newZ = zTop + 1
    setZTop(newZ)
    setWindows(ws => ws.map(w => w.id === id ? { ...w, z: newZ } : w))
  }

  const moveWindow = (id: string, x: number, y: number) => {
    setWindows(ws => ws.map(w => w.id === id ? { ...w, x, y } : w))
  }

  return (
    <div
      ref={screenRef}
      onClick={(e) => { if (e.target === screenRef.current) { setSelectedIcon(null); setStartMenu(false) } }}
      style={{
        position: 'relative',
        width: '100%', height: '100%',
        background: OS.desktop,
        backgroundImage: `
          radial-gradient(${OS.wallDot} 1px, transparent 1px),
          radial-gradient(${OS.desktopDark} 1px, transparent 1px)
        `,
        backgroundSize: '8px 8px, 16px 16px',
        backgroundPosition: '0 0, 4px 4px',
        fontFamily: '"DotGothic16", "Hiragino Kaku Gothic ProN", monospace',
        overflow: 'hidden',
        color: OS.chromeFg,
        imageRendering: 'pixelated',
        userSelect: 'none',
      }}>
      {/* Top menu bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: compact ? 24 : 26,
        background: OS.chrome,
        backgroundImage: `linear-gradient(180deg, ${OS.chromeHi} 0, ${OS.chrome} 100%)`,
        color: OS.chromeFg,
        display: 'flex', alignItems: 'center',
        padding: compact ? '0 6px' : '0 10px', gap: compact ? 8 : 18,
        borderBottom: `2px solid ${OS.ink}`,
        boxShadow: `0 1px 0 ${OS.chromeLite}`,
        fontSize: 11,
        zIndex: 100,
      }}>
        <div style={{
          fontFamily: '"Press Start 2P", monospace', fontSize: 9,
          letterSpacing: 1,
          color: OS.yellow,
          padding: '2px 6px',
        }}>★ OMU OS</div>
        {!compact && <><div>ファイル</div><div>編集</div><div>表示</div><div>ウィンドウ</div><div>ヘルプ</div></>}
      </div>

      {/* Desktop icons */}
      <div style={compact ? {
        position: 'absolute', top: 28, left: 0, right: 0,
        padding: '8px 6px',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 4,
        zIndex: 1,
      } : {
        position: 'absolute', top: 36, left: 8,
        display: 'flex', flexDirection: 'column', gap: 4,
        zIndex: 1,
      }}>
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

      {/* Right-side system info — desktop only */}
      {!compact && (
        <div style={{
          position: 'absolute', top: 36, right: 8,
          zIndex: 1, width: 200,
          fontSize: 11, color: OS.chromeFg,
        }}>
          <div style={{
            background: OS.chrome,
            border: `1px solid ${OS.chromeLite}`,
            padding: 8,
            boxShadow: `2px 2px 0 ${OS.shadow}`,
          }}>
            <div style={{
              fontFamily: '"Press Start 2P", monospace', fontSize: 8,
              marginBottom: 6, letterSpacing: 1,
            }}>SYSTEM</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
              <span>User</span><span>{PROFILE.handle}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
              <span>HOST</span><span>omu-mbp.local</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10 }}>
              <span>UPTIME</span><span>{PROFILE.exp}</span>
            </div>
            <div style={{ marginTop: 6, height: 6, background: OS.shadow, position: 'relative' }}>
              <div style={{
                position: 'absolute', inset: 0, width: '72%',
                background: `repeating-linear-gradient(90deg, ${OS.green} 0 4px, ${OS.greenDark} 4px 5px)`,
              }} />
            </div>
            <div style={{ fontSize: 9, marginTop: 2, opacity: 0.7 }}>CPU 72% · MEM 4.3GB</div>
          </div>
        </div>
      )}

      {/* Start menu */}
      {startMenu && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute', bottom: compact ? 40 : 36, left: 0,
            width: 220, zIndex: 200,
            background: OS.chrome,
            border: `2px solid ${OS.ink}`,
            boxShadow: `4px 0 0 ${OS.chromeLite}, 4px 4px 0 ${OS.shadow}`,
            display: 'flex', flexDirection: 'column',
          }}>
          {/* Header */}
          <div style={{
            background: `linear-gradient(180deg, ${OS.chromeLite} 0%, ${OS.chrome} 100%)`,
            padding: '10px 12px',
            borderBottom: `1px solid ${OS.ink}`,
            display: 'flex', flexDirection: 'column', gap: 2,
          }}>
            <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: 11, letterSpacing: 1, color: OS.yellow }}>★ OMU OS</div>
            <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 10, color: OS.chromeFg, opacity: 0.8 }}>{PROFILE.handle}</div>
          </div>
          {/* Menu items */}
          {DESKTOP_ICONS.map(ic => (
            <div
              key={ic.id}
              onClick={() => { openWindow(ic.id); setStartMenu(false) }}
              style={{
                padding: '7px 14px',
                fontSize: 12, fontFamily: '"DotGothic16", monospace',
                color: OS.chromeFg, cursor: 'pointer',
                borderBottom: `1px solid ${OS.chromeLite}22`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = OS.chromeLite)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <OSIcon kind={ic.kind} size={20} />
              {ic.label}
            </div>
          ))}
        </div>
      )}

      {/* Windows */}
      {windows.map(w => (
        <OSWindow
          key={w.id}
          {...w}
          compact={compact}
          onClose={() => closeWindow(w.id)}
          onFocus={() => focusWindow(w.id)}
          onMove={(x, y) => moveWindow(w.id, x, y)}
        >
          {w.id === 'readme'   && <WinReadme onOpen={openWindow} />}
          {w.id === 'about'    && <WinAbout />}
          {w.id === 'skills'   && <WinSkills />}
          {w.id === 'projects' && <WinProjects />}
          {w.id === 'career'   && <WinCareer />}
          {w.id === 'contact'  && <WinContact />}
        </OSWindow>
      ))}

      {/* Bottom taskbar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: compact ? 36 : 32,
        background: OS.chrome,
        borderTop: `2px solid ${OS.ink}`,
        boxShadow: `0 -1px 0 ${OS.chromeLite}`,
        display: 'flex', alignItems: 'center',
        padding: '0 6px', gap: 6,
        zIndex: 100,
        overflow: 'hidden',
      }}>
        <div
          onClick={(e) => { e.stopPropagation(); setStartMenu(v => !v) }}
          style={{
            fontFamily: '"Press Start 2P", monospace', fontSize: 9,
            letterSpacing: 1,
            background: startMenu
              ? `linear-gradient(180deg, ${OS.chromeLite} 0%, ${OS.chromeHi} 100%)`
              : `linear-gradient(180deg, ${OS.chromeHi} 0%, ${OS.chromeLite} 100%)`,
            color: OS.chromeFg,
            padding: '4px 10px',
            boxShadow: startMenu
              ? `inset 1px 1px 0 ${OS.ink}, inset -1px -1px 0 ${OS.chromeHi}`
              : `inset 1px 1px 0 ${OS.chromeHi}, inset -1px -1px 0 ${OS.ink}`,
            cursor: 'pointer',
            flex: '0 0 auto',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
          <span style={{ color: OS.yellow, fontSize: 10 }}>★</span>
          {!compact && 'スタート'}
        </div>
        <div style={{ width: 2, height: 22, background: OS.chromeLite, marginLeft: 2, marginRight: 4, flex: '0 0 auto' }} />
        <div style={{ display: 'flex', gap: 4, flex: 1, minWidth: 0, overflowX: 'auto' }}>
          {windows.map(w => (
            <div
              key={w.id}
              onClick={() => focusWindow(w.id)}
              style={{
                background: w.z === zTop ? OS.chromeLite : OS.chrome,
                color: OS.chromeFg,
                padding: '4px 10px',
                border: `1px solid ${OS.ink}`,
                boxShadow: w.z === zTop
                  ? `inset 1px 1px 0 ${OS.chromeHi}`
                  : `inset 1px 1px 0 ${OS.chromeHi}, inset -1px -1px 0 ${OS.ink}`,
                fontSize: 11,
                cursor: 'pointer',
                maxWidth: compact ? 120 : 180, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                display: 'flex', alignItems: 'center', gap: 6,
                flex: '0 0 auto',
              }}>
              <OSIcon kind={w.icon} size={16} />
              {!compact && <span>{w.title.split('—')[0].trim()}</span>}
            </div>
          ))}
        </div>
        {!compact && (
          <div style={{
            padding: '4px 8px',
            fontFamily: 'ui-monospace, monospace', fontSize: 11,
            color: OS.chromeFg,
          }}>🔋 87%</div>
        )}
        <div style={{
          padding: '4px 8px',
          fontFamily: 'ui-monospace, monospace', fontSize: 11,
          color: OS.chromeFg,
          flex: '0 0 auto',
        }}>{clock}</div>
      </div>

      {/* Boot splash overlay */}
      {booting && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 999,
          background: OS.ink, color: OS.chromeFg,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 18,
          fontFamily: '"Press Start 2P", monospace',
        }}>
          <div style={{ fontSize: 24, letterSpacing: 3 }}>★ OMU OS</div>
          <div style={{ fontSize: 10, opacity: 0.7, letterSpacing: 1 }}>v1.0 · OMU EDITION</div>
          <div style={{
            width: 240, height: 10,
            background: OS.chromeLite,
            border: `1px solid ${OS.chromeFg}`,
            position: 'relative',
            marginTop: 12,
          }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0,
              animation: 'pxbar 1.4s ease-out forwards',
              background: `repeating-linear-gradient(90deg, ${OS.yellow} 0 4px, ${OS.yellowDark} 4px 6px)`,
            }} />
          </div>
          <div style={{ fontSize: 9, opacity: 0.5, marginTop: 8 }}>loading kernel...</div>
          <style>{`@keyframes pxbar { from { width: 0 } to { width: 100% } }`}</style>
        </div>
      )}
    </div>
  )
}
