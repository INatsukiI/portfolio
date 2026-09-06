# OMU/OS — Portfolio

近未来ダークデスクトップ OS 風のポートフォリオサイト。
グラスモーフィズム × サイバーパンク調の UI を、Tailwind CSS + shadcn/ui で構築している。

## 目的

- 個人ポートフォリオとして公開する静的サイト
- Claude Code による自律的な機能追加・修正を想定した構成

## 対話・出力形式
- 必ず日本語を使用する
- 結論ファーストで感想などは省く

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
| テスト（単体） | Vitest + @testing-library/react |
| テスト（E2E）・UI目視確認 | Playwright（`@playwright/test`、Chromium のみ） |
| デプロイ | GitHub Pages（`main` push で `deploy.yml` が自動デプロイ） |

---

## 開発コマンド

```bash
npm run dev          # 開発サーバー起動 → http://localhost:5173
npm run build        # 本番ビルド（型エラーも検出される）
npm run lint         # ESLint チェック
npm run check        # lint + build を一括実行（修正後は必ずこれを通す）
npm run preview      # ビルド成果物をローカルで確認
npm run test         # 単体テスト一括実行（vitest run）
npm run test:watch   # 単体テストウォッチモード（開発中）
npm run test:e2e     # E2E テスト（Playwright）。dev サーバーは自動起動される
npm run test:e2e:ui  # Playwright UI モード（デバッグ用）
npm run screenshot   # 目視確認用スクリーンショット。事前に別ターミナルで npm run dev が必要
```

初回のみ Chromium バイナリの取得が必要:

```bash
npx playwright install chromium
```

## ルール

- コードを変更したら必ず `npm run check`,`npm run test`を実行し、エラーゼロを確認してから作業完了とすること。
- コードをコミットする際はブランチを確認して、mainにいる場合はfeature/xxxのブランチを切ってコミットすること。
- `package.json` を変更したら `npm install` を実行して `package-lock.json` を同期すること。
- UI に関わる変更は、実際の画面を目視確認してから完了とすること。手順:
  1. `npm run dev` を起動する
  2. `npm run screenshot -- <出力パス> [URL] [幅x高さ]` でスクリーンショットを撮り、画像を確認する（`.claude/skills/ui-preview` skill も参照）
  3. 主要フローに関わる変更なら `npm run test:e2e` も通す
- **見た目に変更が入る PR（レイアウト・色・アニメーション・文言・新規/変更コンポーネント等）は、変更後のスクリーンショットまたは操作を示す動画を PR に添付すること。**
  - `gh pr create` / `gh pr comment` の `--attach` を使う（`gh` 2.99.0 以上が必要）。例: `gh pr create ... --attach './after.png#変更後'`。複数枚はフラグを繰り返す。
  - before/after が示せる場合は両方添付し、PR 本文の表で並べる。
  - PR 本文に `![](path)` を書いてその場で URL 置換させたい場合、参照文字列と `--attach` に渡すパスを**完全一致**させる（不一致だと置換されず末尾に追記される）。確実を期すなら本文に画像参照を書かず、投稿後に返る `user-attachments/assets/...` URL で本文を編集する。
  - `gh` が古く `--attach` が使えない環境では、本文にその旨を明記し `npm run screenshot` の結果を別途共有する。
- スタック・ディレクトリ構成・コーディング規約が変わったら、このファイル（CLAUDE.md）を都度更新すること。
- 新しい npm パッケージを追加する前に、既存の依存関係で代替できないか確認すること。
- 繰り返し使う作業フロー（PR 作成・コンポーネント追加パターンなど）は `.claude/skills/` に skill として追加することを検討する。

### テストに関するルール

- `src/os/windows/Win*.tsx` を新規作成した場合は、必ず同階層に `Win*.test.tsx` を作成すること。
- 既存コンポーネントの **表示内容・Props・ロジック** を変更した場合は、対応する `*.test.tsx` が壊れていないか確認し、必要なら更新すること。
- テストは「ユーザーが見る振る舞い」を中心に書く（実装詳細ではなく、表示・インタラクション・状態変化を検証）。
- 外部 API（fetch）はモックし、成功・失敗の両パスをカバーすること。

#### E2E テスト（`e2e/`）

- Playwright Test で記述する。テストは `e2e/*.spec.ts`（vitest 対象外）。
- 主要フロー（ウィンドウの開閉・最小化・最大化・移動・リサイズ、Contact フォーム）の回帰を守るのが目的。デスクトップ OS の骨格に関わる変更をしたら該当 spec を更新すること。
- 要素の特定は `data-testid`（`desktop-icon-<id>` / `window-<id>` / `window-titlebar-<id>` / `taskbar-tab-<id>` / `launcher-trigger`）と ARIA ロール／ラベルを使う。CSS クラスに依存しない。
- `npm run check` には含めない（ローカルの実行速度優先）。CI では `ci.yml` の独立ジョブ「E2E (Playwright)」で実行される。

## PR レビュー・マージフロー

「PR をレビューしてマージして」のような指示を受けたら、確認を挟まず以下の流れで自動的に完結させる。

1. `gh pr list --repo <owner>/<repo> --state open` でオープン PR を全件取得する。
2. 各 PR について diff と CI ステータス（`gh pr checks`）を確認し、以下の観点で多角的にレビューする（件数が多い場合は fork/subagent で並列化してよい）。
   - 正確性・バグ・既存挙動の破壊がないか
   - セキュリティ
   - 本ファイルのコーディング規約・命名規則・テストに関するルールへの準拠
   - アクセシビリティ（該当する場合）
   - CI が実際に通っているか
3. 問題がなければ `gh pr merge <N> --merge` でそのまま main へマージする（人の承認は待たない）。必須チェック「Lint & Build & Test」は `pull_request`（対象 main）でも走るので、通常は `--admin` 不要。
4. 問題があれば、そのブランチをチェックアウト済みの子ワークツリー／セッションが存在すればそこへ修正を依頼し、存在しない・応答がない場合は新しい worktree を自分で作成して直接修正する。修正後は `npm run check` と `npm run test` を通してから push し、2 に戻って再レビューする。
5. 「修正 → 再レビュー」のループは **最大 3 回まで**。3 回試しても解決しない場合は自動マージを諦め、PR にコメントで指摘内容と試行結果を残し、ユーザーに報告して判断を仰ぐ。
6. 作業用に作った一時 worktree は完了後に必ず `git worktree remove` で片付ける。他セッションが使用中の worktree には手を出さない。

### Dependabot PR の扱い

- **patch / minor 更新**（グループ PR 含む）は `dependabot-auto-merge.yml` が GitHub の auto-merge を有効化し、`ci.yml`（`pull_request`）が緑になった時点で自動マージされる。**手動で触らない**。
- **major 更新・CI 失敗・グループ内に major を含む PR・長期スタック**は自動マージに載らない。これらの対応は `/review-dependabot` スキルに従う。
- `.github/dependabot.yml` の `groups` で react 系（react / react-dom / @types/react）は常に 1 PR に束ねている（版ズレによるテスト全滅の再発防止）。

---

## ディレクトリ構成（主要部分）

```
src/
├── components/ui/       # shadcn/ui コンポーネント（npx shadcn@latest add で追加、内容は ls で都度確認）
├── os/
│   ├── components/
│   │   ├── DesktopIcon.tsx
│   │   ├── OSWindow.tsx
│   │   └── ui/          # OS 固有の薄いラッパーコンポーネント
│   │       ├── OSButton.tsx   # shadcn Button のラッパー
│   │       ├── SectionHead.tsx # shadcn Separator を使ったセクション見出し
│   │       └── DataRow.tsx
│   ├── windows/         # 各ウィンドウのコンテンツ
│   │   └── terminalComplete.ts  # 擬似ターミナルの Tab 入力補完ロジック（純粋関数）
│   ├── icons.tsx        # lucide-react アイコンのマッピング（OSIcon）
│   ├── theme.ts         # OS カラーパレット（OS オブジェクト）
│   ├── constants.ts     # ウィンドウ初期設定など
│   ├── hooks.ts
│   └── OSScene.tsx      # デスクトップ本体
├── lib/utils.ts         # cn() ユーティリティ
├── profile.ts           # ポートフォリオコンテンツ（ここを編集して情報を更新）
└── index.css            # Tailwind + shadcn テーマ変数

e2e/                     # Playwright E2E テスト（*.spec.ts）＋ helpers.ts
scripts/screenshot.mjs   # 目視確認用スクリーンショット取得スクリプト
playwright.config.ts     # Playwright 設定（testDir: e2e / webServer: npm run dev / Chromium のみ）

.github/
├── dependabot.yml     # 依存更新（npm / github-actions）を weekly・groups で束ねて発行
├── actions/setup/action.yml  # Node セットアップ + npm ci の composite action（ci.yml / deploy.yml から利用）
└── workflows/
    ├── ci.yml          # main への pull_request で Lint & Build & Test（+ 独立ジョブで E2E）。マージは必ず PR 経由
    ├── dependabot-auto-merge.yml  # Dependabot の patch/minor PR に auto-merge を付与
    └── deploy.yml      # main への push で GitHub Pages へデプロイ
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

- **shadcn/ui コンポーネントを優先して使う**。導入済みコンポーネントは `src/components/ui/` を参照
- 新しい UI パーツが必要なら `npx shadcn@latest add <component>` で追加する
- テーマカラーは `src/index.css` の `:root` CSS 変数で管理（`--primary` = シアン `#00d4ff` など）
- OS 固有の色は `src/os/theme.ts` の `OS` オブジェクトを参照する。直接 HEX を書かない（グラデーション文字列内は除く）
- Tailwind クラスは `cn()` 経由で使用する（`src/lib/utils.ts`）
- レイアウト（flex/grid/padding/gap）は Tailwind クラス、色・border は `OS.*` またはテーマ変数（`text-primary`, `border-border` など）で書き分ける

### アクセシビリティ（デジタル庁デザインシステム / WCAG 2.2 AA 準拠）

- **フォントサイズは 14px（`text-sm`）を下限**とする。本文は 16px（`text-base` / `1rem`）基準。`text-xs`(12px) はバッジ・タグなど非本文の小コンポーネントに限る。`text-[10px]` 等は使わない
- テキスト色は**半透明ではなく不透明値**で指定し、暗背景で本文 4.5:1・UI/境界 3:1 以上を確保する（`OS.inkSoft` / `--muted-foreground` は調整済み）
- アニメーションは `@media (prefers-reduced-motion: reduce)`（`src/index.css` にグローバル定義）と `main.tsx` の `<MotionConfig reducedMotion="user">` で抑制される。新規の派手な動き・点滅は追加しない
- 境界を影・半透明のみで表現しない。強制カラーモード対策として `fc-border` / `fc-border-b` / `fc-border-t` ユーティリティ（`src/index.css`）を境界要素に付ける
- 見出しは `<h1>`〜を階層的に使う（`SectionHead` は `as="h2"|"h3"` を受け取る）。ランドマーク（`header`/`nav`/`main`）を維持する
- リンクは色以外の手がかり（下線）でも識別できるようにする。クリックできる見た目の要素は実際に操作可能にする（`<button>` / `<a>`）
- フォームは縦スタック＋`<label htmlFor>`。`outline-none` を使う場合は必ず `focus-visible:ring-*` の代替を付ける
- 操作ターゲットは実効 24×24px 以上（ヒットエリアで担保してよい）
- 和文フォントは `--font-sans` / `--font-mono` に Noto Sans JP を含めてある。日本語テキストに `font-mono` の広い字間や `italic` を当てない

### アイコン

- `lucide-react` から直接インポートする（shadcn/ui も内部で lucide-react を使用しているため、これが正しい方法）
- 新しいアイコンが必要な場合は `src/os/icons.tsx` の `ICONS` マップに追加する

### TypeScript

- `any` は使わない。型が不明な場合は `unknown` + 型ガード、または適切な型 / interface を定義する
