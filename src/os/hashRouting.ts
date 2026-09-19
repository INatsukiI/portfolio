import { WIN_DEFAULTS } from './constants'

/**
 * URL の `location.hash` から既知のウィンドウ ID 一覧を取り出す純粋関数。
 * - 複数は `#about,projects` のようにカンマ区切り
 * - `WIN_DEFAULTS` に存在しない ID（スキップリンク用の `#os-main` など）は無視する
 * - 重複は先勝ちで除去する
 */
export function parseWindowIdsFromHash(hash: string): string[] {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash
  if (!raw.trim()) return []

  const seen = new Set<string>()
  const ids: string[] = []
  for (const part of raw.split(',')) {
    const trimmed = part.trim()
    if (!trimmed) continue
    let id: string
    try {
      id = decodeURIComponent(trimmed)
    } catch {
      continue
    }
    if (!(id in WIN_DEFAULTS) || seen.has(id)) continue
    seen.add(id)
    ids.push(id)
  }
  return ids
}

/**
 * 現在開いているウィンドウ ID 一覧から URL ハッシュ文字列を組み立てる。
 * 開いているウィンドウがなければ空文字（ハッシュなし）を返す。
 */
export function buildHashFromWindowIds(ids: string[]): string {
  return ids.length > 0 ? `#${ids.join(',')}` : ''
}
