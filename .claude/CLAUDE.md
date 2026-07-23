# CLAUDE.md — D&D Character Ledger

Context primer for Claude Code sessions on this repo. For living project memory
(status, diary, decisions), see the Obsidian vault at
`/Users/jg/Documents/Obsidian/AI-Workflow/AI Memory/Dnd-character-app/`.

## What this is

A local-first **D&D 5e character sheet**. Express + `better-sqlite3` serve a JSON
REST API and a React 19 + Vite frontend. Everything runs on the user's machine
against a single `characters.db` file — no cloud, no external network calls.
Multi-user accounts + a DM session/loaner pool are supported.

## Current state (as of 2026-07-22)

- **React migration is complete** (all 4 phases). React serves at `/`; the legacy
  vanilla frontend is deleted (recover from the `historic-vanilla-frontend`
  branch). EJS renders only `login`/`reset`.
- **Active branch:** `react-refactor` — 19 commits ahead of `main`, not yet merged.
- **Open thread:** the perf pass on `local/session-2026-07-22-perf` may be ahead of
  `docs/react-perf-optimizations.md` (still marked ☐). Confirm what merged before
  trusting the doc.

## Layout

```
src/                 Express server (JSON API; EJS only for login/reset)
client/              React 19 + Vite app  →  built to client/dist, served at /
  src/rules/         Pure D&D logic (no DOM) + node:test unit tests
  src/state/         characterStore.jsx: update(mutator) + 500ms debounced autosave
  src/components/    Shared UI (Layout, sheet tabs, modals, dice roller)
  src/pages/         Sheet, Import, Library, Sessions
public/              Served static assets: styles.css, login.js, resources/ (builtin game data)
docs/                CHANGELOG, react-migration-plan, react-perf-optimizations, architecture-client-vs-public, companion-sources
```

`client/` (build source) and `public/` (served static) are intentionally
separate — see `docs/architecture-client-vs-public.md`. Don't merge them.

## Run / build / test

```bash
npm install        # server deps
npm run build      # builds React client into client/dist
npm start          # http://localhost:3000  (login: admin / testing)
```

Frontend dev with hot reload:

```bash
SKIP_AUTH=true npm start   # API on :3000, skips login
npm run client:dev         # Vite dev server (HMR)
```

Rules-logic tests:

```bash
npm run test:client        # node:test suite in client/src/rules/__tests__
```

## Conventions

- New branches: `local/session-YYYY-MM-DD`.
- `docs/CHANGELOG.md` is auto-appended by `.claude/hooks/update-changelog.sh` at
  session end — only committed work is logged.
- Frontend is JSX + JSDoc (not TypeScript, by choice).
- Pure rules logic goes in `client/src/rules/` (unit-tested); builtin game data
  stays in `public/resources/` as classic-script globals.
