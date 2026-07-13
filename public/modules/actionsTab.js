(function(){
  function init(app){
    const { buildActions } = app;

    document.addEventListener('DOMContentLoaded', () => {
      buildActions();
    });
  }

  window.characterSheetModules.register('actionsTab', init);
})();
