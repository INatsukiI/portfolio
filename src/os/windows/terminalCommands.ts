// 擬似ターミナルのコマンドレジストリ。
// { name, usage, desc, run } を 1 つの配列にまとめることで、
// help 表示・Tab 補完（terminalComplete.ts）・コマンド実行（WinTerminal.tsx）が
// 常に同じ定義から生成される（コマンド名の二重管理を避ける）。
//
// run() は副作用を持たず、実行結果を CommandResult として返す純粋関数にしてある。
// ウィンドウを開く／閉じるなどの副作用は WinTerminal.tsx 側が CommandResult を見て行う。

import { PROFILE } from '../../profile'
import { OS_VERSION } from '../constants'

export const LS_FILES = [
  'about.txt', 'skills.txt', 'projects.txt',
  'career.log', 'contact.app', 'zenn.dev/',
]

export const OPEN_MAP: Record<string, string> = {
  'about': 'about', 'about.txt': 'about', 'profile': 'about', 'profile.txt': 'about',
  'skills': 'skills', 'skills.txt': 'skills', 'skills.app': 'skills',
  'projects': 'projects', 'projects.txt': 'projects', 'projects/': 'projects',
  'career': 'career', 'career.log': 'career',
  'contact': 'contact', 'contact.app': 'contact',
  'zenn': 'zenn', 'zenn.dev': 'zenn', 'zenn.dev/': 'zenn',
  'readme': 'readme', 'welcome': 'readme', 'welcome.txt': 'readme',
  'terminal': 'terminal', 'terminal.app': 'terminal',
}

// open 補完候補 = id と同名の代表キーのみ（.txt などの別名は除外）
export const OPEN_TARGETS = Object.keys(OPEN_MAP).filter(k => k === OPEN_MAP[k])

export interface CommandContext {
  /** 実行時点のコマンド履歴（新しい順。今回実行したコマンド自身を含む） */
  history: string[]
}

export interface CommandResult {
  lines: string[]
  variant?: 'output' | 'error'
  /** true の場合、行を積まずに画面を完全にクリアする（clear 専用） */
  clear?: boolean
  /** 指定した id のウィンドウを開く（open 専用） */
  openId?: string
  /** true の場合、ターミナルウィンドウを閉じる（exit / quit 専用） */
  exit?: boolean
}

export interface Command {
  name: string
  usage: string
  desc: string
  run: (args: string[], ctx: CommandContext) => CommandResult
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

const NEOFETCH_LOGO = [
  '     ⬡⬡⬡⬡⬡     ',
  '   ⬡       ⬡   ',
  '  ⬡    ◆    ⬡  ',
  '   ⬡       ⬡   ',
  '     ⬡⬡⬡⬡⬡     ',
]

function buildNeofetch(): string[] {
  const title = PROFILE.handle
  const info = [
    title,
    '─'.repeat(title.length),
    `OS       : OMU/OS ${OS_VERSION}`,
    `Host     : omu-node.local`,
    `Shell    : omu-sh`,
    `Role     : ${PROFILE.title}`,
    `Location : ${PROFILE.location}`,
    `Uptime   : ${PROFILE.exp}`,
    `Skills   : ${PROFILE.skills.length}`,
  ]
  const logoWidth = Math.max(...NEOFETCH_LOGO.map(l => l.length))
  const rows = Math.max(NEOFETCH_LOGO.length, info.length)
  const lines: string[] = []
  for (let i = 0; i < rows; i++) {
    const left = (NEOFETCH_LOGO[i] ?? '').padEnd(logoWidth)
    const right = info[i] ?? ''
    lines.push(`${left}  ${right}`)
  }
  return lines
}

function buildHelpLines(): string[] {
  return [
    'Available commands:',
    '',
    ...COMMANDS.map(c => `  ${c.usage.padEnd(20)} ${c.desc}`),
  ]
}

// コマンド定義の単一ソース。help 表示・Tab 補完・実行はすべてこの配列から導出する。
export const COMMANDS: Command[] = [
  {
    name: 'help',
    usage: 'help',
    desc: 'このヘルプを表示',
    run: () => ({ lines: buildHelpLines() }),
  },
  {
    name: 'ls',
    usage: 'ls',
    desc: 'ファイル一覧',
    run: () => ({ lines: [LS_FILES.join('    ')] }),
  },
  {
    name: 'cat',
    usage: 'cat <file>',
    desc: 'ファイルの内容を表示（複数指定時は先頭のみ使用）',
    run: (args) => {
      const file = args[0]
      if (!file) return { lines: ['Usage: cat <file>'], variant: 'error' }
      const content = buildCat(file)
      if (!content) return { lines: [`cat: ${file}: No such file`], variant: 'error' }
      return { lines: content }
    },
  },
  {
    name: 'open',
    usage: 'open <app>',
    desc: 'ウィンドウを開く',
    run: (args) => {
      const target = args[0]
      if (!target) return { lines: ['Usage: open <app>'], variant: 'error' }
      const id = OPEN_MAP[target.toLowerCase()]
      if (!id) return { lines: [`open: ${target}: not found`], variant: 'error' }
      return { lines: [`Opening ${target}...`], openId: id }
    },
  },
  {
    name: 'whoami',
    usage: 'whoami',
    desc: 'ユーザー情報',
    run: () => ({
      lines: [
        `${PROFILE.handle}`,
        `${PROFILE.title} @ ${PROFILE.location}`,
        `exp: ${PROFILE.exp}`,
      ],
    }),
  },
  {
    name: 'date',
    usage: 'date',
    desc: '現在日時',
    run: () => ({ lines: [new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })] }),
  },
  {
    name: 'history',
    usage: 'history',
    desc: 'コマンド履歴',
    run: (_args, ctx) => {
      const total = ctx.history.length
      if (total === 0) return { lines: ['(no history)'] }
      // history は新しい順で保持しているので、bash 同様「古い順・実際の通番」で表示する
      const shown = ctx.history.slice(0, 20)
      const oldestFirst = [...shown].reverse()
      const startNum = total - oldestFirst.length + 1
      return { lines: oldestFirst.map((c, i) => `  ${String(startNum + i).padStart(3)}  ${c}`) }
    },
  },
  {
    name: 'clear',
    usage: 'clear',
    desc: '画面クリア',
    run: () => ({ lines: [], clear: true }),
  },
  {
    name: 'echo',
    usage: 'echo <text>',
    desc: '引数をそのまま表示',
    run: (args) => ({ lines: [args.join(' ')] }),
  },
  {
    name: 'pwd',
    usage: 'pwd',
    desc: '現在のディレクトリを表示',
    run: () => ({ lines: ['~'] }),
  },
  {
    name: 'neofetch',
    usage: 'neofetch',
    desc: 'システム情報を表示',
    run: () => ({ lines: buildNeofetch() }),
  },
  {
    name: 'exit',
    usage: 'exit',
    desc: 'ターミナルを閉じる',
    run: () => ({ lines: [], exit: true }),
  },
  {
    name: 'quit',
    usage: 'quit',
    desc: 'ターミナルを閉じる（exit と同じ）',
    run: () => ({ lines: [], exit: true }),
  },
]
