(function(){
  function init(app){
    const { state, save, buildSpellSlots, buildSpellLibrary, buildKnownSpells } = app;

    function wireSpellEvents(){
      document.getElementById('addCustomSpell')?.addEventListener('click', () => {
        const name = document.getElementById('customSpellName').value.trim();
        const lvl = parseInt(document.getElementById('customSpellLevel').value, 10) || 0;
        if (!name) return;
        state.knownSpells.push({name, level:lvl, custom:true});
        document.getElementById('customSpellName').value = '';
        document.getElementById('customSpellLevel').value = '';
        buildKnownSpells(); save();
      });
    }

    document.addEventListener('DOMContentLoaded', wireSpellEvents);
  }

  window.characterSheetModules.register('spellsTab', init);
})();
