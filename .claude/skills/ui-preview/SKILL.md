---
name: ui-preview
description: UI 変更をヘッドレスブラウザ（Playwright / Chromium）で目視確認するスキル。「画面を確認して」「スクリーンショットを撮って」「UIプレビュー」「見た目を見て」など、UI に関わる変更の確認をしたいときに使う。dev サーバー起動 → スクリーンショット取得 → 画像確認の流れを行う。
---

# ui-preview — UI 目視確認

この環境にはブラウザ拡張の目視確認ツールが無いため、Playwright（Chromium）で代替する。

ユーザーとのやり取りは **日本語** で行うこと。

## 前提

初回のみブラウザバイナリが必要:

```bash
npx playwright install chromium
```

## 手順

### 1. 開発サーバーを起動する（未起動なら）

```bash
npm run dev
```

バックグラウンド実行し、`http://localhost:5173/portfolio/` が 200 を返すまで待つ。

### 2. スクリーンショットを撮る

```bash
npm run screenshot -- <出力パス> [URL] [幅x高さ]
```

- 出力パスは scratchpad か `tmp/` 配下にする（リポジトリを汚さない。`tmp/` と `e2e/__screenshots__/` は .gitignore 済み）
- 例:
  - `npm run screenshot -- tmp/preview.png` … デスクトップ幅（1280x800）で全体
  - `npm run screenshot -- tmp/mobile.png "" 390x844` … モバイル幅（compact レイアウト確認）

特定ウィンドウを開いた状態を撮りたい・操作後の状態を撮りたい場合は、`e2e/` の spec を一時的に増やすか、`scripts/screenshot.mjs` を参考にインラインスクリプトを書く。

### 3. 画像を確認する

Read ツールで画像を開き、レイアウト崩れ・色・はみ出し・意図した変更が反映されているかを確認する。

### 4. 主要フローに影響する変更なら E2E も回す

ウィンドウの開閉・最小化・最大化・移動・リサイズ、Contact フォームの挙動に関わる変更をした場合:

```bash
npm run test:e2e
```

`e2e/*.spec.ts` が壊れていないか確認し、挙動を意図的に変えたなら spec を更新する。
