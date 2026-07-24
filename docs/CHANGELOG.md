# Changelog

Features and changes added to this project, appended automatically at the end of
each Claude Code session by the `SessionEnd` hook (`.claude/hooks/update-changelog.sh`).

Each session's entry lists the git commits made during that session, so anything you
commit is captured here. Uncommitted work is **not** recorded — commit it to have it
logged. Edit or reword entries freely; the hook only appends, it never rewrites history.

<!-- New entries are appended below. -->

## 2026-07-18

- React refactor pt2 (`874c351`)

## 2026-07-22

- Refactor PT (`d5f5c63`)
- Refactor Pt2 (`d585429`)
## 2026-07-23

- Updated views (`d654e83`)
- update ignored files (`5789e32`)

## 2026-07-23

- Add DM Screen design spec (`1a2e5f2`)

## 2026-07-24

- Revise DM Screen spec: turn-order tracker, counters, monster items (`6bd4554`)
- Add DM Screen implementation plan (`ca98c26`)
- Fix SnapshotSheet example: use direct getCharacter import (`e6017f1`)
- feat: add custom_monsters model and /api/monsters routes (`ff927e6`)
- feat: add per-session dm_notes and combat storage with DM-gated endpoints (`e38b50a`)
- feat: add monster form/data parsers to import-forms (`49c3d03`)
- fix: coerce all monsterDataToForm string fields to strings (`efefd9f`)
- feat: add monster statblock html and monster-aware notes index (`b0e3792`)
- fix: single-escape acNote/hpFormula/cr in monsterStatblockHtml (`b16d32d`)
- feat: wire monster api + registry and dm-notes/combat api (`a775a03`)
- feat: seed Adult Copper Dragon (SRD 5.1) built-in monster (`e3a32c9`)
- feat: add Monsters import tab (`bce57e1`)
- refactor: extract shared LibrarySearch; public Library excludes monsters (`fd388c5`)
- fix: preserve public Library load/error and reference-panel behavior in LibrarySearch (`ed4d191`)
- feat: add MonsterDetail statblock window with add-to-tracker (`736491c`)
- feat: add DM Screen page, route, and Open DM Screen button (`89da2e0`)
- fix: gate DM Screen tools on resolved session detail to close guard race (`37e3a25`)
- feat: add read-only party snapshots (frozen + refresh) to DM Screen (`c1f16f0`)
- feat: add persisted DM notepad to DM Screen (`d5899d9`)
- feat: add persisted free-form turn-order tracker with counters (`6837f65`)

## 2026-07-24

- DM progress (`e7d00ac`)

## 2026-07-24

- feat: DM Screen round 2 — snapshot tabs, tracker linking/drag, combat log, notes history (`e1e0c74`)
- fix: guard SnapshotSheet derive so a partial character can't crash the DM Screen (`ed3f82d`)
