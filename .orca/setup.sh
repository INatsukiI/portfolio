#!/usr/bin/env bash
# Orca worktree setup hook: reuse node_modules across worktrees/sessions
# instead of running `npm install` from scratch every time.
#
# Keyed by a hash of package-lock.json so a changed lockfile invalidates
# the cache automatically. Uses `cp -c` (APFS clone) so restoring from
# cache is near-instant and each worktree still gets an independent copy.
set -euo pipefail

cd "$(dirname "$0")/.."

CACHE_ROOT="$HOME/.cache/orca-node-cache/portfolio"
LOCK_HASH="$(shasum -a 256 package-lock.json | cut -d' ' -f1)"
CACHE_DIR="$CACHE_ROOT/$LOCK_HASH"

if [ -d "$CACHE_DIR/node_modules" ]; then
  echo "[orca setup] cache hit ($LOCK_HASH) — restoring node_modules from cache"
  rm -rf node_modules
  cp -Rc "$CACHE_DIR/node_modules" ./node_modules
else
  echo "[orca setup] cache miss ($LOCK_HASH) — running npm ci"
  npm ci

  echo "[orca setup] saving node_modules to cache for future worktrees"
  mkdir -p "$CACHE_ROOT"
  TMP_DIR="$(mktemp -d "$CACHE_ROOT/.tmp.XXXXXX")"
  cp -Rc node_modules "$TMP_DIR/node_modules"
  rm -rf "$CACHE_DIR"
  mv "$TMP_DIR" "$CACHE_DIR"

  # bound disk usage: keep only the 2 most recently used cache entries
  ls -1dt "$CACHE_ROOT"/*/ 2>/dev/null | tail -n +3 | xargs -I{} rm -rf {}
fi
