(function(){
  function init(app){
    const { buildSkills, buildClassList, renderClassInfoStack, buildSkillPicker, buildClassFeatures, buildClassFilterBar, buildSpeciesSelect, buildSubraceSelect, renderSpeciesInfo, buildSpeciesTraits, buildClassFromForm, buildSpeciesFromForm, buildSubclassParentSelect, buildSubclassFromForm, buildAlignmentSelect, buildNotes, renderCharacter } = app;

    function wireSettingsEvents(){
      buildClassFilterBar();
      buildClassList();
      renderClassInfoStack();
      buildSkillPicker();
      buildClassFeatures();
      buildSpeciesSelect();
      buildSubraceSelect();
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
