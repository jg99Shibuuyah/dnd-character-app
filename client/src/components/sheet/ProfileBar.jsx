import { useRef, useState } from 'react';
import { useCharacter } from '../../state/characterStore.jsx';
import * as api from '../../api/client.js';
import { resolveReferences, applyResolutions, stubPayloadFor, normalizeName } from '../../rules/import-linking.js';
import ImportReviewModal from '../ImportReviewModal.jsx';

// Profile switcher + save status (ports partials/profile-bar.html and
// bindProfileBar). The sidebar collapse toggle now lives inside the sidebar.
//
// Character import runs a linking pass first (rules/import-linking.js):
// exact references import silently; near/missing ones open ImportReviewModal,
// which can rewrite names to library entries and create stub Homebrew entries
// before the normal importCharacterJson path runs.
export default function ProfileBar() {
  const {
    character, profiles, loadCharacter, newCharacter, duplicateCharacter,
    importCharacterJson, saveStatus, viewOnly, data, customSpells, reloadRegistry
  } = useCharacter();
  const fileRef = useRef(null);
  // { parsed, raw, report } while the review modal is open.
  const [pending, setPending] = useState(null);
  const [busy, setBusy] = useState(false);
  const [modalError, setModalError] = useState('');

  const onImportFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      // Same unwrap importCharacterJson performs; resolution needs the raw character.
      const raw = (parsed && parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data))
        ? parsed.data : parsed;
      const report = (raw && typeof raw === 'object' && !Array.isArray(raw) && data)
        ? resolveReferences(raw, data, customSpells)
        : [];
      if (report.some((r) => r.status !== 'exact')) {
        setModalError('');
        setPending({ parsed, raw, report });
        return;
      }
      await importCharacterJson(parsed);
    } catch (err) {
      window.alert('Import failed: ' + err.message);
    }
  };

  // Stub parents may themselves have been renamed in the review — a stubbed
  // subclass under a near-matched class must attach to the linked class name.
  const resolvedParentFor = (d, decisions) => {
    if (!d.parent) return undefined;
    const parentType = d.type === 'subclass' ? 'class' : 'species';
    const pd = decisions.find((x) => x.type === parentType && normalizeName(x.name) === normalizeName(d.parent));
    return (pd && pd.linkTo) || d.parent;
  };

  const onReviewConfirm = async (decisions) => {
    setBusy(true);
    setModalError('');
    try {
      const renamed = applyResolutions(pending.raw, decisions);
      for (const d of decisions) {
        if (d.action !== 'stub') continue;
        const { path, payload } = stubPayloadFor(
          { ...d, parent: resolvedParentFor(d, decisions) }, renamed);
        await api[path].import(payload);
      }
      await reloadRegistry();
      const wrapped = pending.parsed !== pending.raw
        ? { ...pending.parsed, data: renamed }
        : renamed;
      await importCharacterJson(wrapped);
      setPending(null);
    } catch (err) {
      setModalError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const statusText = saveStatus === 'saving' ? 'Saving…'
    : saveStatus === 'error' ? 'Save failed — check the server' : 'Saved';

  return (
    <div className="profile-bar">
      <label>Profile</label>
      <select value={character.id || ''} onChange={(e) => { if (e.target.value) loadCharacter(e.target.value); }}>
        {profiles.length === 0 && <option value="">No saved characters</option>}
        {profiles.map((c) => (
          <option key={c.id} value={c.id}>{(c.name || 'Unnamed')} — {c.class || '?'} {c.level || 1}</option>
        ))}
      </select>
      <button className="pbtn" onClick={newCharacter}>+ New</button>
      <button className="pbtn" title="Import a character from a JSON file" onClick={() => fileRef.current?.click()}>Import</button>
      <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={onImportFile} />
      <button className="pbtn" onClick={duplicateCharacter}>Duplicate</button>
      <span className={'save-status' + (saveStatus === 'saving' ? ' saving' : '')}>
        {viewOnly ? 'View only' : statusText}
      </span>
      {pending && (
        <ImportReviewModal report={pending.report} busy={busy} error={modalError}
          onCancel={() => { if (!busy) setPending(null); }}
          onConfirm={onReviewConfirm} />
      )}
    </div>
  );
}
