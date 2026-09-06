---
name: review-dependabot
description: Dependabot の PR のうち自動マージに載らなかったものだけをレビュー・対応するスキル。「dependabot の PR 見て」「依存更新の PR をマージして」「脆弱性対応の PR を確認して」など、Dependabot PR の処理を求められたときに使う。patch/minor は CI で自動マージされる前提で、major・CI 失敗・グループ内 major・スタックした PR を対象にする。
---

# review-dependabot

Dependabot PR 対応の分担：

| 種別 | 誰が処理するか |
|---|---|
| patch / minor 更新（グループ含む、CI 緑） | GitHub の auto-merge（`dependabot-auto-merge.yml`）。**このスキルは触らない** |
| major 更新 | このスキル（diff・リリースノートを確認して判断） |
| CI 失敗 | このスキル（原因を特定し、単純な協調ミスなら修正） |
| 長期間 BLOCKED / コンフリクト継続 | このスキル |

ユーザーとのやり取りは **日本語**・結論ファーストで行う。

---

## ステップ 1: 対象 PR を絞り込む

```bash
gh pr list --repo <owner>/<repo> --state open --author "app/dependabot" \
  --json number,title,mergeStateStatus,autoMergeRequest,labels
```

以下は **このスキルの対象外**（auto-merge に任せる）なので除外する：

- `autoMergeRequest` が設定済み かつ `mergeStateStatus` が `BLOCKED`（＝チェック待ち）／`CLEAN`
- ラベルや title から patch / minor と判断でき、CI が走っている（`gh pr checks <N>`）

**対象になるのは：**

- `gh pr checks <N>` に失敗（`fail`）があるもの
- major 更新（title の `bump X from a.b.c to (a+1).0.0`、または fetch-metadata 的に semver-major）
- `autoMergeRequest` が無く、CI も走っておらず放置されているもの
- 何日も `CONFLICTING` のままのもの

対象が無ければ「auto-merge に載っていない Dependabot PR はありません」と報告して終了。

## ステップ 2: 各 PR を多角的にレビュー

`gh pr diff <N>` と `gh pr checks <N>`、必要ならリリースノート（`gh api repos/<pkg-owner>/<pkg-repo>/releases` 等）を確認し、以下を見る：

- 破壊的変更・既存挙動への影響（major は特に）
- lockfile の整合性（`react` / `react-dom` のように版一致が必須の組が揃っているか）
- セキュリティ（脆弱性修正 PR なら advisory 番号と修正内容）
- CLAUDE.md のコーディング規約・テストルールへの準拠

## ステップ 3: ローカルで動作確認

Dependabot ブランチでは branch protection の必須チェックが `pull_request` トリガーで走るようになっているが、
CI が失敗している場合は手元で再現・修正する：

```bash
git fetch origin
git checkout <dependabot-branch>
git reset --hard origin/main         # main に載せ直す
# package.json を必要分だけ更新（例: npm pkg set dependencies.react-dom="^19.2.8"）
npm install
rm -rf node_modules && npm ci
npm run check && npm run test && npm audit --audit-level=high
```

**単純な協調ミス**（版ズレ・peer 不整合など）は上記のように修正して
`git commit` → `git push --force-with-lease origin <dependabot-branch>` する。
コミットメッセージ末尾は CLAUDE.md のルール（`Co-Authored-By` / `Claude-Session`）に従う。

## ステップ 4: マージ or エスカレーション

- 問題なし＆ CI 緑：`gh pr merge <N> --merge`（必須チェックが緑なら `--admin` 不要）
- major で挙動確認が必要・判断を要する：diff とリリースノートの要点を PR にコメントし、
  ユーザーに「マージしてよいか」を確認する。**勝手にマージしない**
- 修正 → 再レビューのループは **最大 3 回**。解決しなければ PR にコメントを残して報告

## ステップ 5: 後片付け

一時的に作った worktree があれば `git worktree remove` で削除する。
`git checkout` でブランチを切り替えた場合は元のブランチに戻す。
