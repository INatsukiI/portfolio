import { describe, it, expect } from 'vitest'
import { completeInput } from './terminalComplete'

const run = (input: string, showList = false) =>
  completeInput(input, input.length, showList)

describe('completeInput', () => {
  it('コマンド名を一意に補完する', () => {
    expect(run('he')).toEqual({ text: 'help ', cursor: 5 })
    expect(run('ca')).toEqual({ text: 'cat ', cursor: 4 })
  })

  it('共通接頭辞が伸びない場合は変化しない', () => {
    expect(run('c')).toEqual({ text: 'c', cursor: 1 })
  })

  it('cat の第1引数をファイル名で補完する', () => {
    expect(run('cat abou')).toEqual({ text: 'cat about.txt ', cursor: 14 })
  })

  it('末尾 / のディレクトリ様はスペースを付けない', () => {
    expect(run('cat zenn')).toEqual({ text: 'cat zenn.dev/', cursor: 13 })
  })

  it('候補複数・接頭辞を伸ばせない場合、2回目の Tab で一覧を返す', () => {
    expect(run('cat ', false).list).toBeUndefined()
    expect(run('cat ', true).list).toEqual([
      'about.txt', 'skills.txt', 'projects.txt',
      'career.log', 'contact.app', 'zenn.dev/',
    ])
  })

  it('open の第1引数は代表名のみで補完する', () => {
    expect(run('open ab')).toEqual({ text: 'open about ', cursor: 11 })
  })

  it('未知コマンドの引数は補完しない', () => {
    expect(run('xyz abc')).toEqual({ text: 'xyz abc', cursor: 7 })
  })

  it('候補0件では何もしない', () => {
    expect(run('cat zzz')).toEqual({ text: 'cat zzz', cursor: 7 })
  })

  it('コマンド名は case-insensitive でマッチし正規表記へ置換する', () => {
    expect(run('HE')).toEqual({ text: 'help ', cursor: 5 })
  })
})
