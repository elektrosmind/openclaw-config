#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="${OPENCLAW_REPO_DIR:-$HOME/.openclaw}"
REMOTE="${OPENCLAW_GIT_REMOTE:-origin}"
LOCK_DIR="${OPENCLAW_GIT_SYNC_LOCK_DIR:-$REPO_DIR/.git-sync.lock}"
LOG_FILE="${OPENCLAW_GIT_SYNC_LOG:-$REPO_DIR/logs/git-sync.log}"
DRY_RUN="${OPENCLAW_GIT_SYNC_DRY_RUN:-0}"

timestamp() {
  date -u +"%Y-%m-%dT%H:%M:%SZ"
}

log() {
  printf '[%s] %s\n' "$(timestamp)" "$*"
}

mkdir -p "$(dirname "$LOG_FILE")"
exec >>"$LOG_FILE" 2>&1

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

log "git-sync starting"

if ! mkdir "$LOCK_DIR" 2>/dev/null; then
  log "another git-sync run is active; exiting"
  exit 0
fi

cleanup() {
  rmdir "$LOCK_DIR" 2>/dev/null || true
}
trap cleanup EXIT

if [[ ! -d "$REPO_DIR/.git" ]]; then
  log "not a git repo: $REPO_DIR"
  exit 1
fi

cd "$REPO_DIR"

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  log "missing remote: $REMOTE"
  exit 1
fi

if [[ -f .git/index.lock ]]; then
  log "stale index lock found: .git/index.lock"
  exit 1
fi

if ! git fetch "$REMOTE" --prune; then
  log "git fetch failed"
  exit 1
fi

DEFAULT_BRANCH="$(git symbolic-ref --short "refs/remotes/$REMOTE/HEAD" 2>/dev/null | sed "s#^$REMOTE/##" || true)"
if [[ -z "$DEFAULT_BRANCH" ]]; then
  DEFAULT_BRANCH="main"
fi

CURRENT_BRANCH="$(git symbolic-ref --short HEAD 2>/dev/null || true)"
if [[ -z "$CURRENT_BRANCH" ]]; then
  log "detached HEAD; refusing to run"
  exit 1
fi

if [[ "$CURRENT_BRANCH" != "$DEFAULT_BRANCH" ]]; then
  log "switching branch: $CURRENT_BRANCH -> $DEFAULT_BRANCH"
  if ! git checkout "$DEFAULT_BRANCH"; then
    log "failed to checkout $DEFAULT_BRANCH"
    exit 1
  fi
fi

if git rev-parse --verify "$REMOTE/$DEFAULT_BRANCH" >/dev/null 2>&1; then
  if ! git rev-parse --abbrev-ref --symbolic-full-name "@{u}" >/dev/null 2>&1; then
    git branch --set-upstream-to="$REMOTE/$DEFAULT_BRANCH" "$DEFAULT_BRANCH" >/dev/null 2>&1 || true
  fi
fi

if ! git pull --rebase --autostash "$REMOTE" "$DEFAULT_BRANCH"; then
  log "pull --rebase failed"
  git rebase --abort >/dev/null 2>&1 || true
  exit 1
fi

if ! git status --porcelain | grep -q .; then
  log "no changes to sync"
  exit 0
fi

# Stage tracked changes in curated config/memory paths first.
git add -u -- \
  AGENTS.md HEARTBEAT.md IDENTITY.md SOUL.md TOOLS.md USER.md \
  .env.example .gitignore openclaw.json \
  maintenance memory skills identity git-sync.sh 2>/dev/null || true

# Stage untracked markdown/config files that are part of the intended backup set.
for file in AGENTS.md HEARTBEAT.md IDENTITY.md SOUL.md TOOLS.md USER.md \
  .env.example .gitignore openclaw.json git-sync.sh maintenance/weekly-updates-playbook.md; do
  [[ -e "$file" ]] && git add -- "$file"
done

if [[ -d memory ]]; then
  while IFS= read -r -d '' md; do
    git add -- "$md"
  done < <(find memory -type f -name '*.md' -print0)
fi

if [[ -d skills ]]; then
  while IFS= read -r -d '' skill_file; do
    git add -- "$skill_file"
  done < <(find skills -type f -print0)
fi

# Exclude volatile/sensitive state from automated backups.
git reset -q HEAD -- \
  'identity/device-auth.json' \
  'memory/main.sqlite' \
  'memory/main.sqlite.backup-*' \
  'memory/main.sqlite.tmp-*' 2>/dev/null || true

STAGED_FILES="$(git diff --cached --name-only)"
if [[ -n "$STAGED_FILES" ]] && printf '%s\n' "$STAGED_FILES" | grep -E -q '(^|/)\.env($|[.])|(^|/)[^/]+\.env$|^identity/device-auth\.json$|^memory/main\.sqlite'; then
  log "refusing to commit env/sensitive runtime files"
  git reset -q
  exit 1
fi

if git diff --cached --quiet; then
  log "nothing staged after filtering"
  exit 0
fi

if [[ "$DRY_RUN" == "1" ]]; then
  log "dry-run mode enabled; staged files:"
  printf '%s\n' "$STAGED_FILES" | sed 's/^/  - /'
  git reset -q
  exit 0
fi

COMMIT_MSG="chore(sync): automated daily backup $(timestamp)"
if ! git commit -m "$COMMIT_MSG"; then
  log "git commit failed"
  exit 1
fi

if ! git push "$REMOTE" "$DEFAULT_BRANCH"; then
  log "git push failed"
  exit 1
fi

log "sync complete"
