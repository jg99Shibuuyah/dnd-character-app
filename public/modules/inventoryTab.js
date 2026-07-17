(function(){
  function init(app){
    function wireInventoryEvents(){
      // Both buttons open the add/edit popup (item-modal.html); nothing is
      // pushed to state until the form is saved.
      document.getElementById('addItem')?.addEventListener('click', () => app.openItemModal());
      document.getElementById('addEquip')?.addEventListener('click', () => app.openEquipModal());
    }

    document.addEventListener('DOMContentLoaded', wireInventoryEvents);
  }

  window.characterSheetModules.register('inventoryTab', init);
})();
