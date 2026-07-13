(function(){
  function init(app){
    const { save, buildInventory, buildEquipment, refreshEffects } = app;

    function wireInventoryEvents(){
      // Read app.state at click time — the state object is replaced whenever a
      // different character profile is loaded.
      document.getElementById('addItem')?.addEventListener('click', () => {
        app.state.inventory.push({name:'', qty:1});
        buildInventory(); save();
      });

      document.getElementById('addEquip')?.addEventListener('click', () => {
        app.state.equipment.push(app.newEquipItem());
        buildEquipment(); refreshEffects(); save();
      });
    }

    document.addEventListener('DOMContentLoaded', wireInventoryEvents);
  }

  window.characterSheetModules.register('inventoryTab', init);
})();
