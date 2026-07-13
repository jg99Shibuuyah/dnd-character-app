(function(){
  function init(app){
    const { addCustomSpellFromForm } = app;

    function wireSpellEvents(){
      document.getElementById('addCustomSpell')?.addEventListener('click', addCustomSpellFromForm);
    }

    document.addEventListener('DOMContentLoaded', wireSpellEvents);
  }

  window.characterSheetModules.register('spellsTab', init);
})();
