(function(){
  function init(app){
    const { state, save, buildInventory, buildEquipment, refreshEffects, buildActions, buildKnownSpells } = app;

    function wireInventoryEvents(){
      document.getElementById('addItem')?.addEventListener('click', () => {
        state.inventory.push({name:'', qty:1});
        buildInventory(); save();
      });

      document.getElementById('addEquip')?.addEventListener('click', () => {
        state.equipment.push({name:'', desc:'', equipped:false, skills:[], spells:[], attackBonus:'', attackDamage:'', abilities:{}, effects:{}});
        buildEquipment(); refreshEffects(); buildActions(); buildKnownSpells(); save();
      });
    }

    document.addEventListener('DOMContentLoaded', wireInventoryEvents);
  }

  window.characterSheetModules.register('inventoryTab', init);
})();
