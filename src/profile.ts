// profile.ts — Portfolio content. Edit this file to update your info.

export interface Stat {
  key: string
  val: number
  max: number
  color: string
}

export interface Skill {
  name: string
  lv: string
  cat: string
}

export interface HistoryItem {
  year: string
  title: string
  org: string
  body: string
}

export interface Achievement {
  name: string
  year: string
}

export interface Contact {
  label: string
  val: string
  key: string
}

export interface Profile {
  name: string
  handle: string
  title: string
  level: number
  exp: string
  location: string
  tagline: string
  bio: string
  stats: Stat[]
  skills: Skill[]
  history: HistoryItem[]
  achievements: Achievement[]
  contact: Contact[]
}

// 2024年4月を入社起点として経験年数・レベルを動的計算
function calcExp(startYear: number, startMonth: number, extraMonths = 0): { level: number; exp: string } {
  const now = new Date()
  const totalMonths = (now.getFullYear() - startYear) * 12 + (now.getMonth() + 1 - startMonth) + extraMonths
  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12
  return {
    level: years,
    exp: months > 0 ? `${years}年${months}ヶ月` : `${years}年`,
  }
}

const { level, exp } = calcExp(2024, 4, 12) // +12ヶ月（アルバイト1年分）

export const PROFILE: Profile = {
  // ─── ヘッダ情報 ──────────────────────────────────
  name:     'omu',
  handle:   '@ooooomuuu',
  title:    'バックエンドエンジニア',
  level,   // 2024年4月起点で自動計算
  exp,     // 同上
  location: '東京',
  tagline:  '「ものをつくり、人にとどける。」',
  bio:      'Webサービスの設計から実装、運用までを一貫してこなすエンジニア。',

  // ─── ステータス（バー表示）────────────────────────
  // color は HEX を直接指定。OS のアクセントカラーから選ぶと馴染みます。
  stats: [
    { key: 'フロントエンド', val: 30, max: 100, color: '#3a6a8c' },
    { key: 'バックエンド',   val: 80, max: 100, color: '#3a7866' },
    { key: 'インフラ',       val: 20, max: 100, color: '#9a4632' },
  ],

  // ─── スキル一覧（テーブル表示）─────────────────────
  skills: [
    { name: 'TypeScript',       lv: 'Lv.2', cat: 'Lang' },
    { name: 'React / Next.js',  lv: 'Lv.2', cat: 'FE' },
    { name: 'Vue.js',           lv: 'Lv.2', cat: 'FE' },
    { name: 'Go',               lv: 'Lv.1', cat: 'BE' },
    { name: 'Laravel / PHP',    lv: 'Lv.1', cat: 'BE' },
    { name: 'Spring / Kotlin',  lv: 'Lv.4', cat: 'BE' },
    { name: 'Flutter / Dart',   lv: 'Lv.1', cat: 'Mobile' },
    { name: 'SQL',              lv: 'Lv.3', cat: 'DB' },
    { name: 'AWS',              lv: 'Lv.2', cat: 'Infra' },
  ],

  // ─── 経歴（git log 風に表示されます）───────────────
  history: [
    {
      year: '2023-2024',
      title: '古都で修行',
      org:   '京都 ベンチャー企業（アルバイト）',
      body:  'Vue(TypeScript) Webフロント開発 4.5ヶ月、Flutter(Dart) + Laravel(PHP) ネイティブアプリ開発 7.5ヶ月、Flutter(Dart) + Echo(Go) ネイティブアプリ開発 1ヶ月。',
    },
    {
      year: '2024-現在',
      title: '東の都でバックエンド戦線',
      org:   '東京（バックエンドエンジニア）',
      body:  '基本設計・詳細設計・実装・負荷試験・運用保守を担当。',
    },
  ],

  // ─── クエスト達成（実績）─────────────────────────
  achievements: [
    { name: 'AWS SAA 合格',     year: '2025' },
  ],

  // ─── 連絡先 / SNS ───────────────────────────────
  contact: [
    { label: 'GitHub', val: 'github.com/INatsukiI',  key: 'gh' },
    { label: 'X',      val: 'x.com/ooooomuu',       key: 'x' },
    { label: 'Zenn',   val: 'zenn.dev/ooooomu',        key: 'zenn' },
  ],
}
