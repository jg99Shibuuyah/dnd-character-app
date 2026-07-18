// Content registry: builtin game data merged with the user's DB-imported
// (custom) content. The legacy app mutates the shared globals in place
// (loadCustomClasses & friends); here the merge produces CLONES so the
// builtin globals stay pristine — a re-merge after import/delete just
// rebuilds the bundle.

import { useCallback, useEffect, useState } from 'react';
import { gameData } from '../rules/builtin-data.js';
import * as api from '../api/client.js';

const clone = (o) => JSON.parse(JSON.stringify(o));

// Merge one record list into a cloned registry keyed by name.
function mergeByName(registry, list, extra = {}) {
  list.forEach((rec) => {
    registry[rec.name] = Object.assign({}, rec.data, {
      source: rec.source, custom: true, customId: rec.id, builtin: false
    }, extra(rec));
  });
}

const subKey = (parent, name) => parent + '::' + name;

// Fetch all six custom-content lists and return { data, customSpells }.
// `data` has the same shape as rules/builtin-data.js gameData.
export async function loadRegistry() {
  const [classes, species, backgrounds, subclasses, subspecies, spells] = await Promise.all([
    api.classes.list().catch(() => []),
    api.species.list().catch(() => []),
    api.backgrounds.list().catch(() => []),
    api.subclasses.list().catch(() => []),
    api.subspecies.list().catch(() => []),
    api.spells.list().catch(() => [])
  ]);

  const data = { ...gameData };
  data.classData = clone(gameData.classData);
  data.speciesData = clone(gameData.speciesData);
  data.backgroundData = clone(gameData.backgroundData);
  data.subclassData = clone(gameData.subclassData);
  data.subspeciesData = clone(gameData.subspeciesData);

  mergeByName(data.classData, classes, (rec) => ({ homebrew: rec.source === 'Homebrew' }));
  mergeByName(data.speciesData, species, () => ({}));
  mergeByName(data.backgroundData, backgrounds, () => ({}));
  subclasses.forEach((rec) => {
    data.subclassData[subKey(rec.parent, rec.name)] = Object.assign(
      { parent: rec.parent, name: rec.name }, rec.data,
      { source: rec.source, custom: true, customId: rec.id });
  });
  subspecies.forEach((rec) => {
    data.subspeciesData[subKey(rec.parent, rec.name)] = Object.assign(
      { parent: rec.parent, name: rec.name }, rec.data,
      { source: rec.source, custom: true, customId: rec.id });
  });

  const customSpells = {};
  spells.forEach((rec) => {
    customSpells[rec.name] = Object.assign({}, rec.data, {
      source: rec.source, custom: true, customId: rec.id
    });
  });

  return { data, customSpells };
}

// Combined builtin + imported subclass/subspecies name lists (the merged-data
// equivalents of the global helpers in resources/builtin/*.js).
export function subclassNamesForClass(data, className) {
  const own = (data.classData[className] && data.classData[className].subclasses) || [];
  const imported = Object.values(data.subclassData).filter((s) => s.parent === className).map((s) => s.name);
  return [...new Set([...own, ...imported])];
}

export function subspeciesNamesForSpecies(data, speciesName) {
  const own = (data.speciesData[speciesName] && data.speciesData[speciesName].subraces) || [];
  const imported = Object.values(data.subspeciesData).filter((s) => s.parent === speciesName && s.custom).map((s) => s.name);
  return [...new Set([...own, ...imported])];
}

// React hook: load once on mount; `reload` re-merges after an import/delete.
export function useRegistry() {
  const [registry, setRegistry] = useState(null);
  const [error, setError] = useState(null);
  const reload = useCallback(() => {
    loadRegistry().then(setRegistry).catch((e) => setError(e.message));
  }, []);
  useEffect(() => { reload(); }, [reload]);
  return { registry, error, reload };
}
