---
name: create-pr
description: 現在のブランチの変更を GitHub の PR として作成するスキル。「PRを作って」「ブランチ切ってPR作成して」「プルリクを出して」「変更をPRにまとめて」「push してPR作成」など、変更をレビュー依頼したいときは必ずこのスキルを使う。未コミットの変更があればコミットまで行い、main/master にいればブランチ作成も行う。`gh` CLI が設定済みの任意のリポジトリで動作する。
---

# create-pr

このスキルは PR 作成のワークフローを自動化します。コミット漏れの確認 → ブランチ作成 → プッシュ → `gh pr create` の流れを一気通貫で行います。

ユーザーとのやり取りは **日本語** で行ってください。

## ステップ 1: 現在の状態を把握する

以下を並列で実行し、状況を把握します：

```bash
git status
git branch --show-current
git log --oneline -5
git diff --stat HEAD
```

## ステップ 2: 未コミットの変更を処理する

**変更がある場合:**

1. 変更内容を読んで「何を・なぜ変えたか」を理解する
2. コミットメッセージを英語で生成する（what ではなく **why** を重視）
3. ユーザーに日本語で提示して確認・修正を求める
4. 承認されたら `git add <具体的なファイル名>` でステージング（`git add .` は使わない）
5. 以下の形式でコミット：

```
<メッセージ本文>

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
```

`.env` や認証情報を含むファイルは絶対にコミットしないでください。

**変更がない場合:** ステップ 3 へ。

## ステップ 3: ブランチを確認する

**`main` または `master` にいる場合:**
- 変更内容から適切なブランチ名を提案する（例: `feat/add-animations`, `fix/auth-bug`）
- ユーザーに確認してから `git checkout -b <branch-name>` を実行

**すでにフィーチャーブランチにいる場合:** そのまま進む。

## ステップ 4: プッシュする

```bash
git push -u origin <current-branch>
```

## ステップ 5: PR を作成する

PR の内容を決めるために確認：

```bash
git log main..HEAD --oneline
git diff main...HEAD --stat
```

**ベースブランチの決定:**
- 通常は `main`
- `git log` を見てフィーチャーブランチ上にブランチを切った場合はそのブランチ

**タイトル:** 英語・命令形・70 文字以内

**対応 issue の確認（必須）:**

PR 作成前に、この変更が対応する既存 issue がないか必ず確認する：

```bash
gh issue list --repo <owner>/<repo> --state open --limit 50
```

対応する issue があれば、本文に **`Closes #<番号>`** を書く（マージ時に自動クローズされる）。

- **複数 issue を閉じる場合はキーワードを issue ごとに繰り返す。** `Closes #46, #47` はカンマ区切りが効かず **#46 しか閉じない**。必ず `Closes #46, Closes #47, Closes #48` の形式で書く。
- 部分対応にとどまる issue は `Closes` ではなく `Refs #<番号>` にする。
- Tracking issue など残す必要があるものは閉じない。

**本文テンプレート:**

```
## 概要

- <変更内容の箇条書き（何を・なぜ）>

## Test plan

- [ ] <手動確認項目>

Closes #<番号>, Closes #<番号>   ← 対応 issue があれば。なければこの行は省く

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

**見た目の変更が含まれる場合（レイアウト・色・アニメーション・文言・新規/変更コンポーネント等）:**

1. `npm run dev` を起動し `npm run screenshot -- <出力パス>` で変更後のスクリーンショットを撮る（before/after が示せるなら両方）
2. `gh pr create` に `--attach '<path>#<alt text>'` を付ける（複数はフラグを繰り返す。`gh` 2.99.0 以上が必要）
3. 本文の表で before/after を並べたい場合は、投稿後に返る `user-attachments/assets/...` URL で `gh api -X PATCH ...` して本文を編集する（本文の `![](path)` と `--attach` のパスが完全一致していないと自動置換されないため）

実行：

```bash
gh pr create --title "<title>" --base <base> --body "$(cat <<'EOF'
<body>
EOF
)"
# 見た目の変更がある場合は末尾に付ける:
#   --attach './tmp/after.png#変更後' --attach './tmp/before.png#変更前'
```

## ステップ 6: URL を返す

`gh pr create` が成功したら、PR の URL を以下の形式で出力してください：

```
<pr-created>https://github.com/owner/repo/pull/N</pr-created>
```
