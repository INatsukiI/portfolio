import { describe, it, expect } from 'vitest'
import { COMMANDS } from './terminalCommands'

const run = (name: string, args: string[] = [], history: string[] = []) => {
  const command = COMMANDS.find(c => c.name === name)
  if (!command) throw new Error(`unknown command: ${name}`)
  return command.run(args, { history })
}

describe('COMMANDS レジストリ', () => {
  it('コマンド名に重複がない', () => {
    const names = COMMANDS.map(c => c.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it('help はすべてのコマンドの usage/desc を一覧表示する（単一ソース）', () => {
    const result = run('help')
    for (const c of COMMANDS) {
      expect(result.lines.some(l => l.includes(c.usage) && l.includes(c.desc))).toBe(true)
    }
  })

  it('ls はファイル一覧を1行で返す', () => {
    const result = run('ls')
    expect(result.lines).toHaveLength(1)
    expect(result.lines[0]).toContain('about.txt')
  })

  it('cat は引数なしで Usage エラーを返す', () => {
    const result = run('cat')
    expect(result.variant).toBe('error')
    expect(result.lines[0]).toMatch(/Usage/)
  })

  it('cat は存在しないファイルでエラーを返す', () => {
    const result = run('cat', ['notexist.txt'])
    expect(result.variant).toBe('error')
    expect(result.lines[0]).toMatch(/No such file/)
  })

  it('cat に複数引数を渡した場合は先頭のみ使用する', () => {
    const result = run('cat', ['about.txt', 'skills.txt'])
    expect(result.variant).toBeUndefined()
    expect(result.lines.some(l => l.includes('name'))).toBe(true)
  })

  it('open は id を openId として返す', () => {
    const result = run('open', ['about'])
    expect(result.openId).toBe('about')
  })

  it('open は未知のターゲットでエラーを返す', () => {
    const result = run('open', ['foobar'])
    expect(result.variant).toBe('error')
  })

  it('clear は clear フラグを立てて空の行を返す', () => {
    const result = run('clear')
    expect(result.clear).toBe(true)
    expect(result.lines).toEqual([])
  })

  it('exit / quit は exit フラグを立てる', () => {
    expect(run('exit').exit).toBe(true)
    expect(run('quit').exit).toBe(true)
  })

  it('echo は引数をそのまま返す', () => {
    expect(run('echo', ['hello', 'world']).lines).toEqual(['hello world'])
  })

  it('pwd は ~ を返す', () => {
    expect(run('pwd').lines).toEqual(['~'])
  })

  it('neofetch は OS ロゴとプロフィール要約を返す', () => {
    const result = run('neofetch')
    expect(result.lines.length).toBeGreaterThan(0)
    expect(result.lines.some(l => l.includes('OMU/OS'))).toBe(true)
  })

  it('history は履歴が空なら (no history) を返す', () => {
    expect(run('history', [], [])).toEqual({ lines: ['(no history)'] })
  })

  it('history は bash 同様「古い順・実際の通番」で表示する', () => {
    // cmdHistory は新しい順で保持される想定（最新が先頭）
    const history = ['c', 'b', 'a']
    const result = run('history', [], history)
    expect(result.lines).toEqual([
      '    1  a',
      '    2  b',
      '    3  c',
    ])
  })
})
