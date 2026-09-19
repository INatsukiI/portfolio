import { useState, useEffect, useRef, useCallback } from 'react'
import { OS } from '../theme'
import { OS_VERSION } from '../constants'
import { completeInput } from './terminalComplete'
import { COMMANDS } from './terminalCommands'

interface TermLine {
  type: 'input' | 'output' | 'error'
  text: string
}

const PROMPT = 'omu@OMU/OS:~$'
const MAX_LINES = 500

const trim = (lines: TermLine[]) =>
  lines.length > MAX_LINES ? lines.slice(lines.length - MAX_LINES) : lines

interface WinTerminalProps {
  onOpen?: (id: string) => void
  onClose?: () => void
}

export function WinTerminal({ onOpen, onClose }: WinTerminalProps) {
  const [lines, setLines] = useState<TermLine[]>([
    { type: 'output', text: `OMU/OS terminal ${OS_VERSION} — type "help" for available commands.` },
    { type: 'output', text: '' },
  ])
  const [input, setInput]       = useState('')
  const [cursorPos, setCursorPos] = useState(0)
  const [histIdx, setHistIdx]   = useState(-1)
  const cmdHistory   = useRef<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef     = useRef<HTMLInputElement>(null)
  const lastKeyRef   = useRef<string>('')

  useEffect(() => {
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  const pushLines = useCallback((newLines: string[], type: TermLine['type'] = 'output') => {
    setLines(prev => trim([...prev, ...newLines.map(text => ({ type, text }))]))
  }, [])

  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    const [cmdName, ...args] = trimmed.split(/\s+/)
    const command = COMMANDS.find(c => c.name === cmdName.toLowerCase())

    cmdHistory.current = [trimmed, ...cmdHistory.current.slice(0, 49)]
    setHistIdx(-1)

    // clear は入力エコー・末尾の空行も残さず画面を完全にクリアする
    if (command?.name === 'clear') {
      setLines([])
      return
    }

    setLines(prev => trim([...prev, { type: 'input', text: `${PROMPT} ${trimmed}` }]))

    if (!command) {
      pushLines([`${cmdName}: command not found — type "help" for available commands`], 'error')
      pushLines([''])
      return
    }

    const result = command.run(args, { history: cmdHistory.current })
    pushLines(result.lines, result.variant ?? 'output')

    if (result.openId) onOpen?.(result.openId)
    if (result.exit) { onClose?.(); return }

    pushLines([''])
  }, [onOpen, onClose, pushLines])

  const syncCursor = (el: HTMLInputElement) => {
    setCursorPos(el.selectionStart ?? el.value.length)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    setCursorPos(e.target.selectionStart ?? e.target.value.length)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const prevKey = lastKeyRef.current
    lastKeyRef.current = e.key

    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
      setCursorPos(0)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const res = completeInput(input, cursorPos, prevKey === 'Tab')
      if (res.list) pushLines([res.list.join('    ')])
      setInput(res.text)
      setCursorPos(res.cursor)
      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(res.cursor, res.cursor)
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, cmdHistory.current.length - 1)
      setHistIdx(next)
      const val = cmdHistory.current[next] ?? ''
      setInput(val)
      setCursorPos(val.length)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = histIdx - 1
      if (next < 0) { setHistIdx(-1); setInput(''); setCursorPos(0) }
      else {
        setHistIdx(next)
        const val = cmdHistory.current[next] ?? ''
        setInput(val)
        setCursorPos(val.length)
      }
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    syncCursor(e.currentTarget)
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto p-3 font-mono text-sm"
      style={{ background: 'rgba(4,10,20,0.95)', color: OS.chromeFg }}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className="leading-6 whitespace-pre-wrap break-all"
          style={{
            color: line.type === 'input' ? OS.accent
                 : line.type === 'error' ? OS.red
                 : OS.chromeFg,
          }}
        >
          {line.text}
        </div>
      ))}
      <div className="leading-6 flex items-center relative">
        <span style={{ color: OS.accent, whiteSpace: 'nowrap' }}>{PROMPT}&nbsp;</span>
        <span style={{ color: OS.chromeFg, whiteSpace: 'pre' }}>{input.slice(0, cursorPos)}</span>
        <span
          className="terminal-cursor"
          style={{
            '--cursor-on-bg': OS.accent,
            '--cursor-on-fg': 'rgba(4,10,20,0.95)',
            '--cursor-off-fg': OS.chromeFg,
            whiteSpace: 'pre',
          } as React.CSSProperties}
        >{input[cursorPos] ?? ''}</span>
        <span style={{ color: OS.chromeFg, whiteSpace: 'pre' }}>{input.slice(cursorPos + 1)}</span>
        {/* inset-0 でプロンプト行全体を覆い、opacity-0 で透明にしてキーボード入力を受け取る */}
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onSelect={e => syncCursor(e.currentTarget)}
          className="absolute inset-0 opacity-0 cursor-default bg-transparent outline-none"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  )
}
