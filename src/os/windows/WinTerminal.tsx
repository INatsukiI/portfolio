import { useState, useEffect, useRef, useCallback } from 'react'
import { PROFILE } from '../../profile'
import { OS } from '../theme'
import { OS_VERSION } from '../constants'

interface TermLine {
  type: 'input' | 'output' | 'error'
  text: string
}

const PROMPT = 'omu@OMU/OS:~$'

const LS_FILES = [
  'about.txt', 'skills.txt', 'projects.txt',
  'career.log', 'contact.app', 'zenn.dev/',
]

const OPEN_MAP: Record<string, string> = {
  'about': 'about', 'about.txt': 'about', 'profile': 'about', 'profile.txt': 'about',
  'skills': 'skills', 'skills.txt': 'skills', 'skills.app': 'skills',
  'projects': 'projects', 'projects.txt': 'projects', 'projects/': 'projects',
  'career': 'career', 'career.log': 'career',
  'contact': 'contact', 'contact.app': 'contact',
  'zenn': 'zenn', 'zenn.dev': 'zenn', 'zenn.dev/': 'zenn',
  'readme': 'readme', 'welcome': 'readme', 'welcome.txt': 'readme',
  'terminal': 'terminal', 'terminal.app': 'terminal',
}

function buildCat(file: string): string[] | null {
  switch (file) {
    case 'about.txt':
      return [
        `name    : ${PROFILE.name}`,
        `title   : ${PROFILE.title}`,
        `location: ${PROFILE.location}`,
        `exp     : ${PROFILE.exp}`,
        ``,
        PROFILE.bio,
        ``,
        `tagline : ${PROFILE.tagline}`,
      ]
    case 'skills.txt':
      return [
        'SKILLS',
        '──────',
        ...PROFILE.skills.map(s => `  ${s.lv.padEnd(6)} ${s.name.padEnd(20)} [${s.cat}]`),
      ]
    case 'projects.txt':
      return [
        'PROJECTS',
        '────────',
        ...PROFILE.projects.flatMap(p => [
          `  ${p.name} (${p.status})`,
          `    ${p.desc}`,
          `    tech: ${p.tech.join(', ')}`,
          p.url ? `    url : ${p.url}` : '',
          '',
        ]),
      ]
    case 'career.log':
      return [
        'CAREER LOG',
        '──────────',
        ...PROFILE.history.flatMap(h => [
          `  [${h.year}] ${h.title}`,
          `    ${h.org}`,
          `    ${h.body}`,
          '',
        ]),
      ]
    case 'contact.app':
      return [
        'CONTACT',
        '───────',
        ...PROFILE.contact.map(c => `  ${c.label.padEnd(8)}: ${c.val}`),
        `  Email   : ${PROFILE.email}`,
      ]
    case 'zenn.dev/':
      return [`zenn.dev/${PROFILE.contact.find(c => c.key === 'zenn')?.val.replace('zenn.dev/', '') ?? ''}`]
    default:
      return null
  }
}

const HELP_LINES = [
  'Available commands:',
  '',
  '  help                 このヘルプを表示',
  '  ls                   ファイル一覧',
  '  cat <file>           ファイルの内容を表示',
  '  open <app>           ウィンドウを開く',
  '  whoami               ユーザー情報',
  '  date                 現在日時',
  '  history              コマンド履歴',
  '  clear                画面クリア',
]

interface WinTerminalProps {
  onOpen?: (id: string) => void
}

export function WinTerminal({ onOpen }: WinTerminalProps) {
  const [lines, setLines] = useState<TermLine[]>([
    { type: 'output', text: `OMU/OS terminal ${OS_VERSION} — type "help" for available commands.` },
    { type: 'output', text: '' },
  ])
  const [input, setInput]     = useState('')
  const [histIdx, setHistIdx] = useState(-1)
  const cmdHistory = useRef<string[]>([])
  const bottomRef  = useRef<HTMLDivElement>(null)
  const inputRef   = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const pushLines = useCallback((newLines: string[], type: TermLine['type'] = 'output') => {
    setLines(prev => [...prev, ...newLines.map(text => ({ type, text }))])
  }, [])

  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim()
    if (!trimmed) return

    // 入力行を履歴に追加
    setLines(prev => [...prev, { type: 'input', text: `${PROMPT} ${trimmed}` }])
    cmdHistory.current = [trimmed, ...cmdHistory.current.slice(0, 49)]
    setHistIdx(-1)

    const [cmd, ...args] = trimmed.split(/\s+/)

    switch (cmd.toLowerCase()) {
      case 'help':
        pushLines(HELP_LINES)
        break

      case 'ls':
        pushLines([LS_FILES.join('    ')])
        break

      case 'cat': {
        const file = args[0]
        if (!file) { pushLines(['Usage: cat <file>'], 'error'); break }
        const content = buildCat(file)
        if (!content) { pushLines([`cat: ${file}: No such file`], 'error'); break }
        pushLines(content)
        break
      }

      case 'open': {
        const target = args[0]
        if (!target) { pushLines(['Usage: open <app>'], 'error'); break }
        const id = OPEN_MAP[target.toLowerCase()]
        if (!id) { pushLines([`open: ${target}: not found`], 'error'); break }
        pushLines([`Opening ${target}...`])
        onOpen?.(id)
        break
      }

      case 'whoami':
        pushLines([
          `${PROFILE.handle}`,
          `${PROFILE.title} @ ${PROFILE.location}`,
          `exp: ${PROFILE.exp}`,
        ])
        break

      case 'date':
        pushLines([new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })])
        break

      case 'history':
        if (cmdHistory.current.length === 0) { pushLines(['(no history)']); break }
        pushLines(cmdHistory.current.slice(0, 20).map((c, i) => `  ${String(i + 1).padStart(3)}  ${c}`))
        break

      case 'clear':
        setLines([])
        break

      default:
        pushLines([`${cmd}: command not found — type "help" for available commands`], 'error')
    }

    pushLines([''])
  }, [onOpen, pushLines])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const next = Math.min(histIdx + 1, cmdHistory.current.length - 1)
      setHistIdx(next)
      setInput(cmdHistory.current[next] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = histIdx - 1
      if (next < 0) { setHistIdx(-1); setInput('') }
      else { setHistIdx(next); setInput(cmdHistory.current[next] ?? '') }
    }
  }

  return (
    <div
      className="h-full flex flex-col font-mono text-xs"
      style={{ background: 'rgba(4,10,20,0.95)', color: OS.chromeFg }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* 出力エリア */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {lines.map((line, i) => (
          <div
            key={i}
            className="leading-5 whitespace-pre-wrap break-all"
            style={{
              color: line.type === 'input' ? OS.accent
                   : line.type === 'error' ? OS.red
                   : OS.chromeFg,
            }}
          >
            {line.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* 入力行 */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-t shrink-0"
        style={{ borderColor: OS.bodyEdge }}
      >
        <span style={{ color: OS.accent, whiteSpace: 'nowrap' }}>{PROMPT}</span>
        <input
          ref={inputRef}
          autoFocus
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none caret-cyan-400"
          style={{ color: OS.chromeFg }}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  )
}
