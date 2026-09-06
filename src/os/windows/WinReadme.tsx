import { PROFILE } from '../../profile'
import { SectionHead } from '../components/ui/SectionHead'
import { Button } from '@/components/ui/button'

interface WinReadmeProps {
  onOpen: (id: string) => void
}

const QUICKSTART: Array<{ id: string; label: string; desc: string }> = [
  { id: 'about',    label: 'profile.txt', desc: '自己紹介・経歴の要約' },
  { id: 'skills',   label: 'skills.app',  desc: 'スキルと得意分野' },
  { id: 'projects', label: 'projects/',   desc: '制作物の一覧' },
  { id: 'career',   label: 'career.log',  desc: '職歴' },
  { id: 'contact',  label: 'contact.app', desc: '連絡先・SNS' },
  { id: 'zenn',     label: 'zenn.dev/',   desc: 'Zenn 記事一覧' },
]

export function WinReadme({ onOpen }: WinReadmeProps) {
  return (
    <div className="font-sans">
      <h2
        className="font-mono text-lg tracking-widest text-primary mb-3 mt-0"
        style={{ textShadow: '0 0 20px rgba(0,212,255,0.4)' }}
      >
        WELCOME TO OMU/OS
      </h2>
      <p className="text-foreground leading-relaxed mb-2">
        ようこそ、{PROFILE.name} のポートフォリオへ。
      </p>
      <p className="text-muted-foreground mb-5">
        アイコンをタップ / クリックすると、各セクションがウィンドウで開きます。
      </p>

      <SectionHead as="h3">quickstart</SectionHead>
      <ul className="mt-3 mb-5 space-y-1.5 list-none p-0">
        {QUICKSTART.map(item => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onOpen(item.id)}
              className="flex w-full items-baseline gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <span className="text-primary font-mono min-w-[96px]">{item.label}</span>
              <span className="text-muted-foreground">— {item.desc}</span>
            </button>
          </li>
        ))}
      </ul>

      <SectionHead as="h3">tips</SectionHead>
      <ul className="mt-3 mb-5 space-y-1.5 list-none p-0">
        {['アイコンをタップ / クリックしてウィンドウを開く', 'タイトルバー左の × ボタン、または Esc キーでウィンドウを閉じる', '画面下のタスクバーから閉じたウィンドウを再オープン'].map((tip, i) => (
          <li key={i} className="flex gap-2 text-muted-foreground">
            <span className="text-border" aria-hidden="true">›</span>{tip}
          </li>
        ))}
      </ul>

      <div className="flex gap-2 flex-wrap">
        <Button size="sm" onClick={() => onOpen('about')} className="font-mono text-sm tracking-wide">
          自己紹介を開く
        </Button>
        <Button size="sm" variant="outline" onClick={() => onOpen('projects')} className="font-mono text-sm tracking-wide">
          プロジェクトを見る
        </Button>
      </div>
    </div>
  )
}
