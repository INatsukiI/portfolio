// 擬似ターミナルの Tab 入力補完ロジック。
// WinTerminal.tsx から分離し、純粋関数としてテスト可能にする。
// コマンド名・ファイル一覧・open 対象は terminalCommands.ts の単一ソースを参照する。

import { COMMANDS, LS_FILES, OPEN_TARGETS } from './terminalCommands'

const COMMAND_NAMES = COMMANDS.map(c => c.name)

export interface CompleteResult {
  text: string
  cursor: number
  list?: string[]
}

function commonPrefix(items: string[]): string {
  if (items.length === 0) return ''
  let prefix = items[0]
  for (const item of items.slice(1)) {
    let i = 0
    while (i < prefix.length && i < item.length && prefix[i] === item[i]) i++
    prefix = prefix.slice(0, i)
    if (!prefix) break
  }
  return prefix
}

/**
 * bash / macOS Terminal 準拠の Tab 補完。
 * @param input     現在の入力全体
 * @param cursor    カーソル位置
 * @param showList  直前キーも Tab だった場合 true（候補一覧を返す）
 */
export function completeInput(input: string, cursor: number, showList: boolean): CompleteResult {
  const unchanged: CompleteResult = { text: input, cursor }

  const before = input.slice(0, cursor)
  const after = input.slice(cursor)

  // 補完対象トークン = カーソル位置より前の、最後の空白以降の文字列
  const token = before.match(/(\S*)$/)?.[1] ?? ''
  const tokenStart = before.length - token.length

  // トークンより前を分割し、コマンド名か引数かを判定
  const leftParts = before.slice(0, tokenStart).trim().split(/\s+/).filter(Boolean)
  const isCommand = leftParts.length === 0
  const command = isCommand ? '' : leftParts[0].toLowerCase()
  const argIndex = leftParts.length - 1

  let candidates: string[]
  let caseInsensitive: boolean
  if (isCommand) {
    candidates = COMMAND_NAMES
    caseInsensitive = true
  } else if ((command === 'cat' || command === 'ls') && argIndex === 0) {
    candidates = LS_FILES
    caseInsensitive = false
  } else if (command === 'open' && argIndex === 0) {
    candidates = OPEN_TARGETS
    caseInsensitive = true
  } else {
    return unchanged
  }

  const matches = candidates.filter(c =>
    caseInsensitive
      ? c.toLowerCase().startsWith(token.toLowerCase())
      : c.startsWith(token),
  )

  if (matches.length === 0) return unchanged

  const applyCompletion = (completion: string): CompleteResult => {
    // ディレクトリ様（末尾 /）はスペースを付けない
    const suffix = completion.endsWith('/') ? '' : ' '
    const newBefore = before.slice(0, tokenStart) + completion + suffix
    return { text: newBefore + after, cursor: newBefore.length }
  }

  if (matches.length === 1) {
    return applyCompletion(matches[0])
  }

  const prefix = commonPrefix(matches)
  if (prefix.length > token.length) {
    // 共通接頭辞まで補完（スペースなし）
    const newBefore = before.slice(0, tokenStart) + prefix
    return { text: newBefore + after, cursor: newBefore.length }
  }

  // これ以上伸ばせない: 2 回連続 Tab で候補一覧を表示
  if (showList) {
    return { text: input, cursor, list: matches }
  }
  return unchanged
}
