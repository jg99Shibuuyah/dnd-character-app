#!/usr/bin/env bash
# SessionEnd hook — append commits made during this session to docs/CHANGELOG.md.
#
# The hook is a shell command, so it can't judge what counts as a "feature"; it
# uses the most reliable signal available — git commits made since the last run.
# A marker file (.claude/.changelog-last-commit) tracks the last-logged commit so
# each session only appends its own new commits. Commit your work to have it logged;
# uncommitted changes are invisible to git and therefore to this hook.
#
# Silent by design: it prints nothing and always exits 0 so it never blocks session end.

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
cd "$ROOT" || exit 0

CHANGELOG="docs/CHANGELOG.md"
MARKER=".claude/.changelog-last-commit"

git rev-parse --short HEAD >/dev/null 2>&1 || exit 0   # no commits yet

LAST=""
[ -f "$MARKER" ] && LAST="$(cat "$MARKER" 2>/dev/null || true)"

# Range of commits to log. If the marker points at a real commit, log everything
# since it; otherwise (first run with no marker) log nothing but seed the marker,
# so an existing repo's whole history isn't dumped on first session end.
if [ -n "$LAST" ] && git cat-file -e "${LAST}^{commit}" 2>/dev/null; then
  COMMITS="$(git log "${LAST}..HEAD" --no-merges --reverse --format='- %s (`%h`)' 2>/dev/null || true)"
else
  COMMITS=""
fi

if [ -n "$COMMITS" ]; then
  mkdir -p "$(dirname "$CHANGELOG")"
  if [ ! -f "$CHANGELOG" ]; then
    printf '# Changelog\n\nFeatures and changes added, appended automatically at the end of each session.\n\n<!-- New entries are appended below. -->\n' > "$CHANGELOG"
  fi
  {
    printf '\n## %s\n\n' "$(date +%Y-%m-%d)"
    printf '%s\n' "$COMMITS"
  } >> "$CHANGELOG"
fi

# Advance the marker so the next session starts from here.
git rev-parse --short HEAD > "$MARKER" 2>/dev/null || true
exit 0
