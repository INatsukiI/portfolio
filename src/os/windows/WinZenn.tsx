import { useState, useEffect } from 'react'
import { Heart, ExternalLink, RefreshCw, Rss } from 'lucide-react'
import { PROFILE } from '../../profile'
import { OS } from '../theme'
import { SectionHead } from '../components/ui/SectionHead'

interface ZennArticle {
  id: number
  title: string
  slug: string
  emoji: string
  article_type: 'tech' | 'idea'
  liked_count: number
  published_at: string
  path: string
}

const ZENN_USER = PROFILE.contact.find(c => c.key === 'zenn')?.val.replace('zenn.dev/', '') ?? ''

const TYPE_COLOR: Record<string, string> = {
  tech: '#00d4ff',
  idea: '#ffbd2e',
}

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

export function WinZenn() {
  const [articles, setArticles] = useState<ZennArticle[]>([])
  const [loading, setLoading]     = useState(true)   // 初回ロード（記事なし状態）のみ true
  const [refreshing, setRefreshing] = useState(false) // 再フェッチ中（記事を保持したまま）
  const [error, setError]         = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  // リフレッシュはイベントハンドラなので setState 直呼び OK
  const refresh = () => {
    // 記事が既にある場合はソフトリフレッシュ（記事を残したままスピナー表示）
    if (articles.length > 0) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(false)
    setRefreshKey(k => k + 1)
  }

  useEffect(() => {
    let cancelled = false
    // setState は必ず非同期コールバック内で呼ぶ（react-hooks/set-state-in-effect 対応）
    const API = `https://zenn.dev/api/articles?username=${ZENN_USER}&order=latest&count=20`
    // CORS が通る場合は直接、ブロックされたら corsproxy.io 経由で再試行
    const tryFetch = (url: string) =>
      fetch(url).then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json() })

    tryFetch(API)
      .catch(() => tryFetch(`https://corsproxy.io/?${encodeURIComponent(API)}`))
      .then((data: { articles: ZennArticle[] }) => {
        if (!cancelled) {
          setArticles(data.articles ?? [])
          setLoading(false)
          setRefreshing(false)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
          setRefreshing(false)
        }
      })
    return () => { cancelled = true }
  }, [refreshKey])

  return (
    <div className="font-sans text-sm flex flex-col gap-3">
      {/* ヘッダー */}
      <div className="flex items-center justify-between">
        <SectionHead>
          <span className="flex items-center gap-2">
            <Rss size={12} style={{ color: OS.accent }} />
            articles/
          </span>
        </SectionHead>
        <button
          onClick={refresh}
          disabled={loading || refreshing}
          className="flex items-center gap-1 font-mono text-[10px] tracking-widest transition-opacity hover:opacity-70 disabled:opacity-30"
          style={{ color: OS.inkSoft }}
        >
          <RefreshCw size={10} className={loading || refreshing ? 'animate-spin' : ''} />
          REFRESH
        </button>
      </div>

      {/* 初回ローディング（記事なし） */}
      {loading && (
        <div className="flex flex-col gap-2 mt-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-lg p-4 animate-pulse"
              style={{ background: OS.chromeHi, border: `1px solid ${OS.bodyEdge}` }}
            >
              <div className="h-3 rounded mb-2" style={{ background: OS.bodyEdge, width: `${60 + i * 10}%` }} />
              <div className="h-2 rounded" style={{ background: OS.bodyEdge, width: '40%' }} />
            </div>
          ))}
        </div>
      )}

      {/* エラー */}
      {error && !loading && (
        <div
          className="rounded-lg p-5 flex flex-col items-center gap-3 text-center"
          style={{ background: OS.chromeHi, border: `1px solid ${OS.bodyEdge}` }}
        >
          <span className="font-mono text-[10px] tracking-widest" style={{ color: OS.inkSoft }}>
            // FETCH FAILED — CORS または接続エラー
          </span>
          <a
            href={`https://zenn.dev/${ZENN_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs transition-opacity hover:opacity-70"
            style={{ color: OS.accent }}
          >
            <ExternalLink size={11} />
            zenn.dev/{ZENN_USER} で読む
          </a>
          <button
            onClick={refresh}
            className="font-mono text-[10px] tracking-widest transition-opacity hover:opacity-70"
            style={{ color: OS.inkSoft }}
          >
            再試行
          </button>
        </div>
      )}

      {/* 記事一覧（初回ロード完了 or ソフトリフレッシュ中） */}
      {!loading && !error && (
        <div className="relative">
          {/* ソフトリフレッシュ中のオーバーレイ */}
          {refreshing && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center rounded-lg"
              style={{ background: 'rgba(8,20,40,0.75)' }}
            >
              <RefreshCw size={20} className="animate-spin" style={{ color: OS.accent }} />
            </div>
          )}

          {/* 記事リスト本体（リフレッシュ中は薄く） */}
          <div
            className="flex flex-col gap-2 transition-opacity duration-200"
            style={{ opacity: refreshing ? 0.4 : 1 }}
          >
            {articles.length === 0 ? (
              <p className="font-mono text-[11px]" style={{ color: OS.inkSoft }}>
                // 記事が見つかりませんでした
              </p>
            ) : (
              articles.map((a) => (
                <a
                  key={a.id}
                  href={`https://zenn.dev${a.path}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg p-3.5 no-underline transition-colors hover:bg-accent/10"
                  style={{ border: `1px solid ${OS.bodyEdge}` }}
                >
                  <div className="flex items-start gap-3">
                    {/* emoji */}
                    <span className="text-xl leading-none mt-0.5 flex-shrink-0">{a.emoji}</span>

                    <div className="flex-1 min-w-0">
                      {/* タイトル */}
                      <p
                        className="text-xs font-bold leading-snug mb-1.5 truncate"
                        style={{ color: OS.white }}
                      >
                        {a.title}
                      </p>

                      {/* メタ情報 */}
                      <div className="flex items-center gap-3">
                        {/* 種別バッジ */}
                        <span
                          className="font-mono text-[9px] tracking-widest px-1.5 py-0.5 rounded"
                          style={{
                            color:       TYPE_COLOR[a.article_type],
                            border:      `1px solid ${TYPE_COLOR[a.article_type]}`,
                            background:  `${TYPE_COLOR[a.article_type]}11`,
                          }}
                        >
                          {a.article_type.toUpperCase()}
                        </span>

                        {/* 日付 */}
                        <span className="font-mono text-[10px]" style={{ color: OS.inkSoft }}>
                          {formatDate(a.published_at)}
                        </span>

                        {/* いいね */}
                        <span
                          className="flex items-center gap-0.5 font-mono text-[10px] ml-auto"
                          style={{ color: OS.inkSoft }}
                        >
                          <Heart size={9} />
                          {a.liked_count}
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
