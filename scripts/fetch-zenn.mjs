// Zenn API（https://zenn.dev/api/articles）は CORS ヘッダを一切返さないため、
// ブラウザから直接 fetch すると必ず CORS エラーになる。
// ここでビルド時に取得して public/zenn-articles.json に保存し、
// クライアントは同一オリジンのその JSON を読む。
//
// 取得に失敗してもビルドは止めず、既存スナップショットを温存する
// （オフラインでのローカルビルド対策）。初回のみ空スナップショットを生成する。
import { writeFile, mkdir, access } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/zenn-articles.json')
const USER = process.env.ZENN_USER || 'ooooomu'
const API = `https://zenn.dev/api/articles?username=${USER}&order=latest&count=20`

const fileExists = (p) => access(p).then(() => true).catch(() => false)

try {
  const res = await fetch(API, { headers: { 'User-Agent': 'omu-os-portfolio-build' } })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  const articles = (data.articles ?? []).map((a) => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    emoji: a.emoji,
    article_type: a.article_type,
    liked_count: a.liked_count,
    published_at: a.published_at,
    path: a.path,
  }))
  await mkdir(dirname(OUT), { recursive: true })
  await writeFile(OUT, JSON.stringify({ articles, fetchedAt: new Date().toISOString() }, null, 2) + '\n')
  console.log(`[fetch-zenn] ${articles.length} 件の記事を取得 -> ${OUT}`)
} catch (err) {
  const msg = err instanceof Error ? err.message : String(err)
  if (await fileExists(OUT)) {
    console.warn(`[fetch-zenn] 取得失敗、既存スナップショットを使用します: ${msg}`)
  } else {
    await mkdir(dirname(OUT), { recursive: true })
    await writeFile(OUT, JSON.stringify({ articles: [], fetchedAt: null }, null, 2) + '\n')
    console.warn(`[fetch-zenn] 取得失敗、空スナップショットを生成しました: ${msg}`)
  }
}
