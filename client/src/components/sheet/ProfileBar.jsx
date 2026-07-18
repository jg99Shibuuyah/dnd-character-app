import { useRef } from 'react';
import { useCharacter } from '../../state/characterStore.jsx';
import OptionsMenu from '../OptionsMenu.jsx';

// Profile switcher + save status (ports partials/profile-bar.html and
// bindProfileBar). Sidebar toggle is owned by the parent shell.
export default function ProfileBar({ onToggleSidebar, sidebarOpen }) {
  const { character, profiles, loadCharacter, newCharacter, duplicateCharacter, deleteCharacter, importCharacterJson, saveStatus, viewOnly } = useCharacter();
  const fileRef = useRef(null);

  const onImportFile = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      await importCharacterJson(parsed);
    } catch (err) {
      window.alert('Import failed: ' + err.message);
    }
  };

  const statusText = saveStatus === 'saving' ? 'Saving…'
    : saveStatus === 'error' ? 'Save failed — check the server' : 'Saved';

  return (
    <div className="profile-bar">
      <button className="sidebar-toggle" type="button" aria-expanded={sidebarOpen}
        title="Menu" onClick={onToggleSidebar}>☰</button>
      <label>Profile</label>
      <select value={character.id || ''} onChange={(e) => { if (e.target.value) loadCharacter(e.target.value); }}>
        {profiles.length === 0 && <option value="">No saved characters</option>}
        {profiles.map((c) => (
          <option key={c.id} value={c.id}>{(c.name || 'Unnamed')} — {c.class || '?'} {c.level || 1}</option>
        ))}
      </select>
      <button className="pbtn" onClick={newCharacter}>+ New</button>
      <button className="pbtn" onClick={duplicateCharacter}>Duplicate</button>
      <button className="pbtn" title="Import a character from a JSON file" onClick={() => fileRef.current?.click()}>Import</button>
      <input ref={fileRef} type="file" accept=".json,application/json" hidden onChange={onImportFile} />
      <button className="pbtn danger" onClick={deleteCharacter}>Delete</button>
      <OptionsMenu />
      <span className={'save-status' + (saveStatus === 'saving' ? ' saving' : '')}>
        {viewOnly ? 'View only' : statusText}
      </span>
    </div>
  );
}
