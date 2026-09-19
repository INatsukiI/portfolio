import { describe, it, expect } from 'vitest'
import { parseWindowIdsFromHash, buildHashFromWindowIds } from './hashRouting'

describe('parseWindowIdsFromHash', () => {
  it('# 付きハッシュから既知の ID を取り出す', () => {
    expect(parseWindowIdsFromHash('#projects')).toEqual(['projects'])
  })

  it('# なしの文字列でも解釈できる', () => {
    expect(parseWindowIdsFromHash('projects')).toEqual(['projects'])
  })

  it('カンマ区切りで複数の ID を取り出す（順序を保持）', () => {
    expect(parseWindowIdsFromHash('#about,projects')).toEqual(['about', 'projects'])
  })

  it('前後の空白・URL エンコードを許容する', () => {
    expect(parseWindowIdsFromHash('# about , %70rojects ')).toEqual(['about', 'projects'])
  })

  it('未知の ID（スキップリンク用の #os-main を含む）は無視する', () => {
    expect(parseWindowIdsFromHash('#os-main')).toEqual([])
    expect(parseWindowIdsFromHash('#about,os-main,projects')).toEqual(['about', 'projects'])
  })

  it('空ハッシュは空配列を返す', () => {
    expect(parseWindowIdsFromHash('')).toEqual([])
    expect(parseWindowIdsFromHash('#')).toEqual([])
  })

  it('重複する ID は先勝ちで除去する', () => {
    expect(parseWindowIdsFromHash('#about,about,projects')).toEqual(['about', 'projects'])
  })

  it('壊れた % エンコードは無視して他の ID は処理を続ける', () => {
    expect(parseWindowIdsFromHash('#%,about')).toEqual(['about'])
  })
})

describe('buildHashFromWindowIds', () => {
  it('ID 配列からハッシュ文字列を組み立てる', () => {
    expect(buildHashFromWindowIds(['about', 'projects'])).toBe('#about,projects')
  })

  it('単一 ID の場合', () => {
    expect(buildHashFromWindowIds(['projects'])).toBe('#projects')
  })

  it('空配列の場合は空文字（ハッシュなし）を返す', () => {
    expect(buildHashFromWindowIds([])).toBe('')
  })
})
