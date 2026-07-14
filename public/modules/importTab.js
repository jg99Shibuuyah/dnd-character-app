(function(){
  function init(app){
    // The Import page's forms, imported lists, and load-existing pickers are all
    // bound by app.js initImportPage() (bindClassImport, bindSpeciesImport,
    // bindSubclassImport, bindSpellImport, bindLibraryEditSelects), because they
    // must wait for the custom entries fetched from the database.
    // Nothing extra to wire here.
  }

  window.characterSheetModules.register('importTab', init);
})();
