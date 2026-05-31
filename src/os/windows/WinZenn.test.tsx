import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WinZenn } from './WinZenn'

const MOCK_ARTICLES = [
  {
    id: 1,
    title: 'テスト記事1',
    slug: 'test-article-1',
    emoji: '🚀',
    article_type: 'tech' as const,
    liked_count: 5,
    published_at: '2025-03-17T00:00:00Z',
    path: '/ooooomu/articles/test-article-1',
  },
  {
    id: 2,
    title: 'テスト記事2',
    slug: 'test-article-2',
    emoji: '💡',
    article_type: 'idea' as const,
    liked_count: 2,
    published_at: '2025-01-01T00:00:00Z',
    path: '/ooooomu/articles/test-article-2',
  },
]

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn())
})

afterEach(() => {
  vi.unstubAllGlobals()
})

const mockFetchSuccess = () => {
  vi.mocked(fetch).mockResolvedValue({
    ok: true,
    json: async () => ({ articles: MOCK_ARTICLES }),
  } as Response)
}

const mockFetchFailure = () => {
  vi.mocked(fetch).mockRejectedValue(new Error('Network error'))
}

describe('WinZenn', () => {
  it('初期表示でローディングスケルトンが表示される', () => {
    // fetch を pending のままにしてローディング状態を確認
    vi.mocked(fetch).mockReturnValue(new Promise(() => {}))
    render(<WinZenn />)
    // スケルトンは animate-pulse クラスで表示
    expect(document.querySelector('.animate-pulse')).toBeTruthy()
  })

  it('フェッチ成功時に記事一覧が表示される', async () => {
    mockFetchSuccess()
    render(<WinZenn />)
    await waitFor(() => {
      expect(screen.getByText('テスト記事1')).toBeTruthy()
      expect(screen.getByText('テスト記事2')).toBeTruthy()
    })
  })

  it('TECH / IDEA バッジが表示される', async () => {
    mockFetchSuccess()
    render(<WinZenn />)
    await waitFor(() => {
      expect(screen.getByText('TECH')).toBeTruthy()
      expect(screen.getByText('IDEA')).toBeTruthy()
    })
  })

  it('記事の日付が正しくフォーマットされる', async () => {
    mockFetchSuccess()
    render(<WinZenn />)
    await waitFor(() => {
      expect(screen.getByText('2025.03.17')).toBeTruthy()
      expect(screen.getByText('2025.01.01')).toBeTruthy()
    })
  })

  it('いいね数が表示される', async () => {
    mockFetchSuccess()
    render(<WinZenn />)
    await waitFor(() => {
      expect(screen.getByText('5')).toBeTruthy()
      expect(screen.getByText('2')).toBeTruthy()
    })
  })

  it('フェッチ失敗時にエラーメッセージが表示される', async () => {
    mockFetchFailure()
    render(<WinZenn />)
    await waitFor(() => {
      expect(screen.getByText(/FETCH FAILED/)).toBeTruthy()
    })
  })

  it('エラー時に Zenn への直リンクが表示される', async () => {
    mockFetchFailure()
    render(<WinZenn />)
    await waitFor(() => {
      const link = screen.getByRole('link', { name: /zenn\.dev\// })
      expect(link).toBeTruthy()
    })
  })

  it('REFRESH ボタンが存在する', async () => {
    mockFetchSuccess()
    render(<WinZenn />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /REFRESH/i })).toBeTruthy()
    })
  })

  it('REFRESH ボタンを押すと再フェッチされる', async () => {
    mockFetchSuccess()
    const user = userEvent.setup()
    render(<WinZenn />)
    await waitFor(() => screen.getByText('テスト記事1'))

    const refreshBtn = screen.getByRole('button', { name: /REFRESH/i })
    await user.click(refreshBtn)

    // 再フェッチされること（fetch が2回以上呼ばれる）
    await waitFor(() => {
      expect(vi.mocked(fetch).mock.calls.length).toBeGreaterThanOrEqual(2)
    })
  })
})
