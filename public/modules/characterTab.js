(function(){
  function init(app){
    const { state, save, refreshEffects, buildActions, buildKnownSpells, buildAttacks, buildSaves, buildSkills, buildAbilities, buildInventory, buildEquipment, buildSpellSlots, buildSpellLibrary, buildKnownSpells: buildKnown } = app;

    function buildCharacterTab(){
      buildAbilities();
      buildSaves();
      buildSkills();
      buildAttacks();
      buildInventory();
      buildEquipment();
      buildSpellSlots();
      buildSpellLibrary();
      buildKnown();
      buildActions();
      refreshEffects();
      save();
    }

    document.addEventListener('DOMContentLoaded', () => {
      buildCharacterTab();
    });
  }

  window.characterSheetModules.register('characterTab', init);
})();
