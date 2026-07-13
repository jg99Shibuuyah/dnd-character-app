(function(){
  function init(app){
    // The Library tab's import forms, imported lists, and load-existing pickers
    // are all bound by app.js init() (bindClassImport, bindSpeciesImport,
    // bindSubclassImport, bindSpellImport, bindLibraryEditSelects), because
    // they must wait for the custom entries fetched from the database.
    // Nothing extra to wire here.
  }

  window.characterSheetModules.register('libraryTab', init);
})();
