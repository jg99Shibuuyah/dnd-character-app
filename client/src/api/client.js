// JSON API client — ported from the api*() wrappers in public/app.js.
// Same endpoints, same error behaviour (401 anywhere → back to /login).

function guard(r) {
  if (r.status === 401) { window.location.href = '/login'; throw new Error('Not signed in'); }
  return r;
}

async function getJson(url) {
  const r = guard(await fetch(url));
  return r.json();
}

async function send(url, method, payload) {
  const r = guard(await fetch(url, {
    method,
    headers: payload !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: payload !== undefined ? JSON.stringify(payload) : undefined
  }));
  if (!r.ok) { const e = await r.json().catch(() => ({})); throw new Error(e.error || ('HTTP ' + r.status)); }
  return r.json();
}

// ---- Characters ----
export const listCharacters = () => getJson('/api/characters');
export async function getCharacter(id) {
  const r = guard(await fetch('/api/characters/' + id));
  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    throw new Error(body.error || 'Could not load character');
  }
  return r.json();
}
export const createCharacter = (name, data) => send('/api/characters', 'POST', { name, data });
export const updateCharacter = (id, name, data) => send('/api/characters/' + id, 'PUT', { name, data });
export const duplicateCharacter = (id) => send(`/api/characters/${id}/duplicate`, 'POST');
export const deleteCharacter = (id) => send('/api/characters/' + id, 'DELETE');

// ---- Imported content registries (classes, species, backgrounds, …) ----
// One trio per content type: list / import / delete.
const registry = (path) => ({
  list: () => getJson(`/api/${path}`),
  import: (payload) => send(`/api/${path}`, 'POST', payload),
  delete: (id) => send(`/api/${path}/` + id, 'DELETE')
});

export const classes = registry('classes');
export const species = registry('species');
export const backgrounds = registry('backgrounds');
export const subclasses = registry('subclasses');
export const subspecies = registry('subspecies');
export const spells = registry('spells');

// ---- Auth ----
export const authMe = () => getJson('/api/auth/me');
export const logout = () => send('/api/auth/logout', 'POST');
// Persist per-account preferences (theme, custom colors). Merges server-side.
export const updateSettings = (settings) => send('/api/auth/settings', 'PUT', { settings });

// ---- Game sessions (campaigns) ----
export const listSessions = () => getJson('/api/sessions');
export const sessionDetail = (id) => send('/api/sessions/' + id, 'GET');
export const createSession = (name) => send('/api/sessions', 'POST', { name });
export const previewSession = (code) => send('/api/sessions/preview', 'POST', { code });
export const joinSession = (body) => send('/api/sessions/join', 'POST', body);
export const setSessionCharacter = (id, body) => send(`/api/sessions/${id}/character`, 'PUT', body);
export const offerHostCharacter = (id, characterId) => send(`/api/sessions/${id}/host-characters`, 'POST', { characterId });
export const withdrawHostCharacter = (id, characterId) => send(`/api/sessions/${id}/host-characters/${characterId}`, 'DELETE');
export const leaveSession = (id) => send(`/api/sessions/${id}/leave`, 'POST');
export const deleteSession = (id) => send('/api/sessions/' + id, 'DELETE');
