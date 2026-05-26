# OMU/OS — Portfolio

近未来ダークデスクトップ OS 風のポートフォリオサイト。
グラスモーフィズム × サイバーパンク調の UI を、Tailwind CSS + shadcn/ui で構築している。

## 目的

- 個人ポートフォリオとして公開する静的サイト
- Claude Code による自律的な機能追加・修正を想定した構成

## 技術スタック

| 種別 | 内容 |
|---|---|
| 言語 | TypeScript + JSX（TSX） |
| UI フレームワーク | React 19 |
| アニメーション | Framer Motion |
| UI コンポーネント | shadcn/ui（Radix UI ベース） |
| ビルドツール | Vite 8 |
| スタイリング | Tailwind CSS v4（`@tailwindcss/vite`）+ インラインスタイル併用 |
| アイコン | lucide-react |
| フォント | JetBrains Mono / Space Grotesk（Google Fonts） |
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

## ルール

- コードを変更したら必ず `npm run check` を実行し、エラーゼロを確認してから作業完了とすること。
- コードをコミットする際はブランチを確認して、mainにいる場合はfeature/xxxのブランチを切ってコミットすること。
- `package.json` を変更したら `npm install` を実行して `package-lock.json` を同期すること。
- UI に関わる変更は、ブラウザプレビュー（`preview_start` → `preview_screenshot`）で目視確認してから完了とすること。
- スタック・ディレクトリ構成・コーディング規約が変わったら、このファイル（CLAUDE.md）を都度更新すること。
- 新しい npm パッケージを追加する前に、既存の依存関係で代替できないか確認すること。
- 繰り返し使う作業フロー（PR 作成・コンポーネント追加パターンなど）は `.claude/skills/` に skill として追加することを検討する。

---

## ディレクトリ構成（主要部分）

```
src/
├── components/ui/       # shadcn/ui コンポーネント（npx shadcn@latest add で追加）
│   ├── button.tsx
│   ├── badge.tsx
│   ├── progress.tsx
│   ├── separator.tsx
│   ├── table.tsx
│   └── textarea.tsx
├── os/
│   ├── components/
│   │   ├── DesktopIcon.tsx
│   │   ├── OSWindow.tsx
│   │   └── ui/          # OS 固有の薄いラッパーコンポーネント
│   │       ├── OSButton.tsx   # shadcn Button のラッパー
│   │       ├── SectionHead.tsx # shadcn Separator を使ったセクション見出し
│   │       └── DataRow.tsx
│   ├── windows/         # 各ウィンドウのコンテンツ
│   ├── icons.tsx        # lucide-react アイコンのマッピング（OSIcon）
│   ├── theme.ts         # OS カラーパレット（OS オブジェクト）
│   ├── constants.ts     # ウィンドウ初期設定など
│   ├── hooks.ts
│   └── OSScene.tsx      # デスクトップ本体
├── lib/utils.ts         # cn() ユーティリティ
├── profile.ts           # ポートフォリオコンテンツ（ここを編集して情報を更新）
└── index.css            # Tailwind + shadcn テーマ変数
```

---

## コーディング規約

### 命名規則

| 対象 | 規則 | 例 |
|---|---|---|
| コンポーネント | PascalCase | `WinAbout`, `OSWindow` |
| 関数・変数 | camelCase | `openWindow`, `zTop` |
| 定数オブジェクト | UPPER_SNAKE | `OS`, `PROFILE`, `WIN_DEFAULTS` |
| ファイル名 | PascalCase（コンポーネント）/ camelCase（ユーティリティ） | `OSScene.tsx`, `profile.ts` |

### スタイリングルール

- **shadcn/ui コンポーネントを優先して使う**。`Button`, `Badge`, `Progress`, `Separator`, `Table`, `Textarea` はすでに導入済み
- 新しい UI パーツが必要なら `npx shadcn@latest add <component>` で追加する
- テーマカラーは `src/index.css` の `:root` CSS 変数で管理（`--primary` = シアン `#00d4ff` など）
- OS 固有の色は `src/os/theme.ts` の `OS` オブジェクトを参照する。直接 HEX を書かない（グラデーション文字列内は除く）
- Tailwind クラスは `cn()` 経由で使用する（`src/lib/utils.ts`）
- レイアウト（flex/grid/padding/gap）は Tailwind クラス、色・border は `OS.*` またはテーマ変数（`text-primary`, `border-border` など）で書き分ける

### アイコン

- `lucide-react` から直接インポートする（shadcn/ui も内部で lucide-react を使用しているため、これが正しい方法）
- 新しいアイコンが必要な場合は `src/os/icons.tsx` の `ICONS` マップに追加する

### TypeScript

- `any` は使わない
