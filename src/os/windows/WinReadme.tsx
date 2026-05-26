import { PROFILE } from '../../profile'
import { SectionHead } from '../components/ui/SectionHead'
import { Button } from '@/components/ui/button'

interface WinReadmeProps {
  onOpen: (id: string) => void
}

export function WinReadme({ onOpen }: WinReadmeProps) {
  return (
    <div className="font-sans text-sm">
      <div className="font-mono text-base tracking-widest text-primary mb-3" style={{ textShadow: '0 0 20px rgba(0,212,255,0.4)' }}>
        WELCOME TO OMU/OS
      </div>
      <p className="text-foreground leading-relaxed mb-2">
        ようこそ、{PROFILE.name} のポートフォリオへ。
      </p>
      <p className="text-muted-foreground text-xs mb-5">
        左のデスクトップアイコンをダブルクリックすると、各セクションがウィンドウで開きます。
      </p>

      <SectionHead>quickstart</SectionHead>
      <ul className="mt-3 mb-5 space-y-2 list-none p-0">
        {[
          { id: 'about',    label: 'profile.txt', desc: '自己紹介・経歴の要約' },
          { id: 'skills',   label: 'skills.app',  desc: 'スキルと得意分野' },
          { id: 'projects', label: 'projects/',    desc: '制作物の一覧' },
          { id: 'career',   label: 'career.log',  desc: '職歴' },
          { id: 'contact',  label: 'contact.app',    desc: '連絡先・SNS' },
        ].map(item => (
          <li key={item.id} className="flex gap-3 items-baseline">
            <span className="text-primary font-mono text-xs min-w-[90px]">{item.label}</span>
            <span className="text-muted-foreground text-xs">— {item.desc}</span>
          </li>
        ))}
      </ul>

      <SectionHead>tips</SectionHead>
      <ul className="mt-3 mb-5 space-y-1.5 list-none p-0">
        {['タイトルバーをドラッグして移動', '× でウィンドウを閉じる', '下のタスクバーから再オープン'].map((tip, i) => (
          <li key={i} className="flex gap-2 text-muted-foreground text-xs">
            <span className="text-border">›</span>{tip}
          </li>
        ))}
      </ul>

      <div className="flex gap-2 flex-wrap">
        <Button size="sm" onClick={() => onOpen('about')} className="font-mono text-xs tracking-widest">
          自己紹介を開く
        </Button>
        <Button size="sm" variant="outline" onClick={() => onOpen('projects')} className="font-mono text-xs tracking-widest">
          プロジェクトを見る
        </Button>
      </div>
    </div>
  )
}
