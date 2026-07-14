(function(){
  function init(app){
    const { buildActions, buildActionResources, save } = app;

    document.addEventListener('DOMContentLoaded', () => {
      buildActions();

      document.getElementById('addResource')?.addEventListener('click', () => {
        (app.state.actionResources || (app.state.actionResources = [])).push({ name:'', total:3, used:0 });
        buildActionResources();
        save();
      });
    });
  }

  window.characterSheetModules.register('actionsTab', init);
})();
