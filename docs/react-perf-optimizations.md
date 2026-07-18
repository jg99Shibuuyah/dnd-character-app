# React sheet — performance optimizations

Tracks the changes made to fix the "feels slower than the vanilla app" regression in
the React character sheet. Each entry notes **what changed** and a **back-port note**
for the legacy vanilla frontend (removed in commit `7a97fb9`, Phase 4 — recover from
git history if needed). Most of these are React-specific problems the vanilla app never
had; the back-port column says so where that's the case.

Status legend: ☐ planned · ◐ in progress · ☑ done

---

## Root cause

Every keystroke in any field triggered, in order:
1. `structuredClone` of the whole character in `update()`
2. a **second** deep clone in the `derived` memo
3. a full `applyClassesToState` + `deriveStats` recompute
4. re-render of **all 14** `useCharacter()` consumers (the context `value` object was
   recreated every render, defeating memoization)

The vanilla app mutated in place, did targeted `recalc()`/`refreshEffects()`, and touched
the DOM surgically — so it never paid this cost.

---

## Changes

### 1. Memoize the CharacterContext value ☐
- **File:** `client/src/state/characterStore.jsx` (~L171-180)
- **What:** Wrap the `value` object in `useMemo` so consumers only re-render when real
  data changes, not on every provider render.
- **Back-port note:** N/A — React-context-specific. Vanilla app has no equivalent.

### 2. Split store into stable-actions vs. changing-data contexts ☐
- **File:** `client/src/state/characterStore.jsx`
- **What:** Put mutation/action callbacks in one context, changing `character`/`derived`
  in another, so action-only consumers (DiceRoller, ProfileBar buttons) stop re-rendering
  on edits. Alternative: selector store (Zustand / `useSyncExternalStore`).
- **Back-port note:** N/A — React-specific.

### 3. Eliminate the double deep-clone per mutation ☐
- **Files:** `client/src/state/characterStore.jsx` (L66 `update`, L166 `derived`);
  `client/src/rules/classes.js` (`applyClassesToState`)
- **What:** Make `applyClassesToState` non-mutating (return a new object) so `derived`
  works off the committed character without a second clone. Target ≤1 clone per mutation.
- **Back-port note:** Partially relevant. If the vanilla `applyClassesToState` mutates
  shared data, making it pure is a correctness win there too — but the vanilla app didn't
  clone per keystroke, so no perf gain.

### 4. Localize/debounce controlled inputs ☐
- **Files:** `client/src/components/sheet/CharacterTab.jsx` (NumField, HP/AC/hitDice),
  journal/notes text areas
- **What:** Hold field state in local `useState`, push to the store on blur / short
  debounce, so typing doesn't hit global state every character.
- **Back-port note:** Relevant in spirit. Vanilla app already writes to the DOM directly;
  if any legacy handler calls `save()`/`recalc()` on every `input` event, debouncing that
  is the same idea and worth applying.

### 5. Gate the derived-stats recompute ☐
- **File:** `client/src/state/characterStore.jsx` (L164-169)
- **What:** Only recompute `derived` when fields that actually feed the calculation change
  (not on name/journal/notes edits).
- **Back-port note:** This is exactly what the vanilla app already did with targeted
  `recalc()`/`refreshEffects()`. The React port regressed it; this restores parity.
  Nothing to back-port — reference the legacy recalc logic as the model.

### 6. Profile before/after + leaf `memo()` ☐
- **Files:** across `client/src/components/sheet/*`
- **What:** React-profiler baseline, then `React.memo` on expensive leaf components (tab
  rows, spell/inventory lists) with stable props; `useCallback`/`useMemo` for passed-down
  props. Confirm the reduction.
- **Back-port note:** N/A — React-specific.

---

## Summary for the legacy app

If you ever revive the vanilla frontend, only items **3, 4, 5** carry any conceptual
weight, and **5** is just restoring what it already did. The bulk of this work (1, 2, 6)
fixes React-render overhead that the vanilla architecture never introduced — i.e. the
"slower" feeling is a port regression, not a missing feature in the old app.
