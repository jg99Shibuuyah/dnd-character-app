(function(){
  function init(app){
    const { buildSkills, buildClassList, renderClassInfoStack, buildSkillPicker, buildClassFeatures, buildClassFilterBar, buildSpeciesSelect, renderSpeciesInfo, buildSpeciesTraits, buildClassFromForm, buildSpeciesFromForm, buildSubclassParentSelect, buildSubclassFromForm, buildAlignmentSelect, buildNotes, renderCharacter } = app;

    function wireSettingsEvents(){
      buildClassFilterBar();
      buildClassList();
      renderClassInfoStack();
      buildSkillPicker();
      buildClassFeatures();
      buildSpeciesSelect();
      renderSpeciesInfo();
      buildSpeciesTraits();
      buildSubclassParentSelect();
      buildAlignmentSelect();
      buildNotes();
      renderCharacter();
      buildSkills();
    }

    document.addEventListener('DOMContentLoaded', wireSettingsEvents);
  }

  window.characterSheetModules.register('settingsTab', init);
})();
