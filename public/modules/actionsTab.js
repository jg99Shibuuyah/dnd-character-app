(function(){
  function init(app){
    const { buildActions } = app;

    document.addEventListener('DOMContentLoaded', () => {
      buildActions();

      // Adding (and editing) a resource goes through a popup asking for a
      // name, a max, and — when companions exist — who the pool belongs to.
      document.getElementById('addResource')?.addEventListener('click', () => {
        app.openResourceModal();
      });
    });
  }

  window.characterSheetModules.register('actionsTab', init);
})();
