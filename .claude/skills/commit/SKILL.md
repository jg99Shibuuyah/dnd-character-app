---
name: commit
description: Commit the current working-tree changes with a clear note describing what changed. Use whenever the user asks to commit, checkpoint, or save work to git — "commit this", "make a commit", "commit with a note", "save my changes" — even when they don't provide a message. Not for pushing, merging, or PR creation unless the user also asks for those.
---

# Commit current changes

Create one commit that captures the pending work, with a message a future reader can trust: a summary of what changed plus a short note on what it does and why.

## Steps

1. **See what actually changed.** Run `git status --short` and read the diff (`git diff` and `git diff --cached`; list untracked files too). If the tree is clean, say so and stop. Write the message from the diff — not just from memory of the conversation — so the note matches what is really being committed.
2. **Stage explicitly.** `git add` the files that belong to the change by path. Never stage local data or noise: `characters.db`, `characters.db-shm`, `characters.db-wal`, `.DS_Store`, `node_modules`. If an unrelated-looking file shows up modified, leave it out and mention it to the user instead of silently committing it.
3. **Commit on the current branch.** This project intentionally works directly on `main` (or `WIP`); do not create a new branch unless the user asks.
4. **Confirm.** Show `git log -1 --stat` output so the user sees the commit hash, message, and files. Do not push unless the user asks.

## Message format

Follow the style already in this repo's history (`git log --oneline`):

- **Summary line:** `<area>: <what changed>` in the imperative, under ~72 characters. The area is the part of the app touched (e.g. `Inventory tab`, `Auth`, `Library`).
- **Body:** 1–4 sentences — the "note about the change". Say what changed and why it matters to a user of the app, not a file-by-file list (the diff already shows that). Mention behavior changes, moved/renamed concepts, and anything a future debugger would want to know.
- **Trailer:** end with the Claude co-author line the harness specifies, e.g.
  `Co-Authored-By: Claude <noreply@anthropic.com>` (use the exact trailer from the current session's instructions if it names a specific model).

**Example:**

```
Inventory tab: add/edit items via popup form, compact equipment rows

Both "+ Add Equipment" and "+ Add Item" now open a shared modal instead
of pushing empty inline editors. Equipment renders as compact rows with
effect summary badges; click a row to edit it in the popup.

Co-Authored-By: Claude <noreply@anthropic.com>
```

## Scope judgment

- If the diff contains several unrelated changes, prefer one commit per coherent change; propose the split to the user rather than making one grab-bag commit.
- If the user gives their own message text, use it (adding the trailer), lightly fixing only typos.
