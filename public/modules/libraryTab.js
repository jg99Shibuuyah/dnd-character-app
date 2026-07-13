(function(){
  function init(app){
    const { buildClassFromForm, buildSpeciesFromForm, buildSubclassFromForm, renderImportedList, renderSpeciesImportedList, renderSubclassImportedList } = app;

    function wireLibraryEvents(){
      document.getElementById('importClassBtn')?.addEventListener('click', buildClassFromForm);
      document.getElementById('importSpeciesBtn')?.addEventListener('click', buildSpeciesFromForm);
      document.getElementById('importSubclassBtn')?.addEventListener('click', buildSubclassFromForm);
      renderImportedList();
      renderSpeciesImportedList();
      renderSubclassImportedList();
    }

    document.addEventListener('DOMContentLoaded', wireLibraryEvents);
  }

  window.characterSheetModules.register('libraryTab', init);
})();
