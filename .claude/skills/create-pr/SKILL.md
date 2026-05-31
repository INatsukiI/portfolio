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

**本文テンプレート:**

```
## 概要

- <変更内容の箇条書き（何を・なぜ）>

## Test plan

- [ ] <手動確認項目>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

実行：

```bash
gh pr create --title "<title>" --base <base> --body "$(cat <<'EOF'
<body>
EOF
)"
```

## ステップ 6: URL を返す

`gh pr create` が成功したら、PR の URL を以下の形式で出力してください：

```
<pr-created>https://github.com/owner/repo/pull/N</pr-created>
```
