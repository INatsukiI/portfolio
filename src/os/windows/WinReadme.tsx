import { PROFILE } from '../../profile'
import { SectionHead } from '../components/ui/SectionHead'
import { OSButton } from '../components/ui/OSButton'

interface WinReadmeProps {
  onOpen: (id: string) => void
}

export function WinReadme({ onOpen }: WinReadmeProps) {
  return (
    <div>
      <div style={{
        fontFamily: '"Press Start 2P", monospace', fontSize: 14,
        marginBottom: 12, letterSpacing: 1,
      }}>WELCOME TO OMU OS</div>
      <p style={{ margin: '0 0 10px' }}>
        ようこそ、{PROFILE.name} のポートフォリオへ。
      </p>
      <p style={{ margin: '0 0 10px' }}>
        左のデスクトップアイコンをクリックすると、各セクションがウィンドウで開きます。
      </p>
      <SectionHead style={{ marginTop: 16 }}>// quickstart</SectionHead>
      <ul style={{ paddingLeft: 18, margin: '6px 0 14px' }}>
        <li><b>profile.txt</b> ─ 自己紹介・経歴の要約</li>
        <li><b>skills.app</b> ─ 装備中のスキルと得意分野</li>
        <li><b>projects/</b> ─ つくってきたもの</li>
        <li><b>career.log</b> ─ git log 形式の職歴</li>
        <li><b>mail.app</b> ─ 連絡先・SNS</li>
      </ul>
      <SectionHead>// tips</SectionHead>
      <ul style={{ paddingLeft: 18, margin: '6px 0' }}>
        <li>タイトルバーをドラッグして移動</li>
        <li>赤い ✕ でウィンドウを閉じる</li>
        <li>下のタスクバーから再オープン</li>
      </ul>
      <div style={{ marginTop: 14, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <OSButton onClick={() => onOpen('about')} primary>👤 自己紹介を開く</OSButton>
        <OSButton onClick={() => onOpen('projects')}>📁 プロジェクトを見る</OSButton>
      </div>
    </div>
  )
}
