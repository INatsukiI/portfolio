# PixelOS — Portfolio

レトロデスクトップ OS 風のポートフォリオサイト。
Win95 × Mac System 7 ハイブリッドの見た目を、React の純粋なインラインスタイルで再現している。

## 目的

- 個人ポートフォリオとして公開する静的サイト
- Claude Code による自律的な機能追加・修正を想定した構成

## 技術スタック

| 種別 | 内容 |
|---|---|
| 言語 | TypeScript + JSX（TSX） |
| UI ライブラリ | React 19 |
| ビルドツール | Vite 8 |
| スタイリング | インラインスタイルのみ（CSS ファイル・CSS Modules・Tailwind は使わない） |
| フォント | DotGothic16 / Press Start 2P（Google Fonts） |
| テスト | 未導入（将来 Vitest を想定） |
| デプロイ | 静的ホスティング（GitHub Pages / Netlify / Vercel） |

---

## 開発コマンド

```bash
npm run dev        # 開発サーバー起動 → http://localhost:5173
npm run build      # 本番ビルド（型エラーも検出される）
npm run lint       # ESLint チェック
npm run check      # lint + build を一括実行（修正後は必ずこれを通す）
npm run preview    # ビルド成果物をローカルで確認
```

> **ルール**: コードを変更したら必ず `npm run check` を実行し、エラーゼロを確認してから作業完了とすること。

---

## コーディング規約

### 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| コンポーネント | PascalCase | `WinAbout`, `PixelIcon` |
| 関数・変数 | camelCase | `openWindow`, `zTop` |
| 定数オブジェクト | UPPER_SNAKE | `OS`, `PROFILE`, `WIN_DEFAULTS` |
| ファイル名 | PascalCase（コンポーネント）/ camelCase（ユーティリティ） | `PixelOS.tsx`, `profile.ts` |

### スタイリングルール

- 色は必ず `OS.xxx` を参照する。直接 HEX を書かない
- 新しい色が必要な場合は `OS` オブジェクトに追加してから使う
- CSS ファイル・Tailwind・shadcn/ui は使わない（レトロ OS の見た目が崩れるため）

### TypeScript

- `any` は使わない