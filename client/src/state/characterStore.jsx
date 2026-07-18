import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { defaultCharacter } from '../rules/core.js';
import { deriveStats } from '../rules/abilities.js';
import { applyClassesToState } from '../rules/classes.js';
import { loadRegistry } from './registry.js';
import * as api from '../api/client.js';

// Central character store — the React equivalent of the legacy `state` global
// plus its save()/loadCharacter()/bindProfileBar() machinery in app.js.
//
// Mutations go through update(mutator): it clones the character, lets the
// mutator mutate the draft in place (the same ergonomics as the legacy code's
// direct `state.x = y`), commits the new object, and schedules a debounced
// autosave. Derived stats are recomputed from the committed character via the
// Phase 1 rules, replacing the manual recalc()/refreshEffects() cascades.

const CharacterContext = createContext(null);

const clone = (o) => (typeof structuredClone === 'function' ? structuredClone(o) : JSON.parse(JSON.stringify(o)));

export function CharacterProvider({ viewCharacterId = null, viewOnly = false, children }) {
  const [character, setCharacter] = useState(() => defaultCharacter());
  const [registry, setRegistry] = useState(null); // { data, customSpells }
  const [profiles, setProfiles] = useState([]);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved' | 'saving' | 'error'
  const [ready, setReady] = useState(false);
  const [borrowedEdit, setBorrowedEdit] = useState(false);

  const saveTimer = useRef(null);
  const characterRef = useRef(character);
  characterRef.current = character;

  const editable = !viewOnly || borrowedEdit;

  // ---- Registry (builtin + imported content) ----
  const reloadRegistry = useCallback(() => loadRegistry().then(setRegistry), []);

  // ---- Debounced autosave (ports save()) ----
  const scheduleSave = useCallback((next) => {
    if (!editable) return; // DM viewing another player's sheet — never write back
    clearTimeout(saveTimer.current);
    setSaveStatus('saving');
    saveTimer.current = setTimeout(async () => {
      try {
        const c = next;
        if (c.id) {
          await api.updateCharacter(c.id, c.name, c);
        } else {
          const res = await api.createCharacter(c.name, c);
          // Stamp the new id without disturbing later edits.
          setCharacter((cur) => (cur.id ? cur : { ...cur, id: res.id }));
        }
        if (!borrowedEdit) {
          api.listCharacters().then(setProfiles).catch(() => {});
        }
        setSaveStatus('saved');
      } catch (err) {
        console.error('Save failed', err);
        setSaveStatus('error');
      }
    }, 500);
  }, [editable, borrowedEdit]);

  // ---- Mutation entry point (ports the state-mutate-then-save() idiom) ----
  const update = useCallback((mutator) => {
    setCharacter((cur) => {
      const draft = clone(cur);
      mutator(draft);
      characterRef.current = draft;
      scheduleSave(draft);
      return draft;
    });
  }, [scheduleSave]);

  // Replace the whole character (load / new / import) without autosaving —
  // the caller has already persisted it.
  const setLoaded = useCallback((next) => {
    clearTimeout(saveTimer.current);
    const c = Object.assign(defaultCharacter(), next);
    characterRef.current = c;
    setCharacter(c);
    setSaveStatus('saved');
  }, []);

  // ---- Profile actions (port bindProfileBar handlers) ----
  const refreshProfiles = useCallback((selectedId) => api.listCharacters().then((list) => {
    setProfiles(list);
    return selectedId;
  }), []);

  const loadCharacter = useCallback(async (id) => {
    const res = await api.getCharacter(id);
    setLoaded(Object.assign({}, res.data, { id: res.id, name: res.name }));
  }, [setLoaded]);

  const newCharacter = useCallback(async () => {
    const fresh = defaultCharacter();
    const res = await api.createCharacter(fresh.name, fresh);
    fresh.id = res.id;
    setLoaded(fresh);
    await refreshProfiles(res.id);
  }, [setLoaded, refreshProfiles]);

  const duplicateCharacter = useCallback(async () => {
    const c = characterRef.current;
    if (!c.id) { window.alert('Save the current character before duplicating it.'); return; }
    const res = await api.duplicateCharacter(c.id);
    await loadCharacter(res.id);
    await refreshProfiles(res.id);
  }, [loadCharacter, refreshProfiles]);

  const deleteCharacter = useCallback(async () => {
    const c = characterRef.current;
    if (!c.id) { setLoaded(defaultCharacter()); return; }
    if (!window.confirm(`Delete "${c.name}"? This can't be undone.`)) return;
    await api.deleteCharacter(c.id);
    const list = await api.listCharacters();
    if (list.length > 0) await loadCharacter(list[0].id);
    else setLoaded(defaultCharacter());
    await refreshProfiles(characterRef.current.id);
  }, [loadCharacter, refreshProfiles, setLoaded]);

  // Import a character from parsed JSON: a raw character object or an
  // API-style { name, data } wrapper. Saves it as a new profile and loads it.
  const importCharacterJson = useCallback(async (parsed) => {
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Expected a JSON object describing one character.');
    }
    if (Array.isArray(parsed.entries) || ['class', 'species', 'subclass', 'subspecies', 'spell'].includes(parsed.type)) {
      throw new Error('This looks like Library JSON — use the Import page for classes, species, and spells.');
    }
    const raw = (parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data)) ? parsed.data : parsed;
    const incoming = Object.assign(defaultCharacter(), raw);
    incoming.id = null;
    if (typeof parsed.name === 'string' && parsed.name.trim()) incoming.name = parsed.name.trim();
    if (typeof incoming.name !== 'string' || !incoming.name.trim()) incoming.name = 'Unnamed Adventurer';
    const res = await api.createCharacter(incoming.name, incoming);
    await loadCharacter(res.id);
    await refreshProfiles(res.id);
  }, [loadCharacter, refreshProfiles]);

  // ---- Initial load ----
  useEffect(() => {
    (async () => {
      await reloadRegistry();
      if (viewCharacterId) {
        // A shared view (/?view=id): the server decides read vs. read+write.
        try {
          const res = await api.getCharacter(viewCharacterId);
          setLoaded(Object.assign({}, res.data, { id: res.id, name: res.name }));
          setBorrowedEdit(!!res.editable);
        } catch (e) { console.error(e); }
      } else {
        const list = await api.listCharacters().catch(() => []);
        setProfiles(list);
        if (list.length > 0) await loadCharacter(list[0].id);
      }
      setReady(true);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived state: apply class-driven fields, then compute display numbers.
  // applyClassesToState mutates, so run it on a clone to keep render pure.
  const derived = useMemo(() => {
    if (!registry) return null;
    const c = clone(character);
    applyClassesToState(c, registry.data);
    return { ...deriveStats(c, registry.data), applied: c };
  }, [character, registry]);

  const value = {
    character, update, setLoaded,
    registry, reloadRegistry,
    data: registry?.data || null,
    customSpells: registry?.customSpells || {},
    derived,
    profiles, refreshProfiles,
    saveStatus, ready, editable, viewOnly,
    loadCharacter, newCharacter, duplicateCharacter, deleteCharacter, importCharacterJson
  };

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
}

export function useCharacter() {
  const ctx = useContext(CharacterContext);
  if (!ctx) throw new Error('useCharacter must be used within CharacterProvider');
  return ctx;
}
