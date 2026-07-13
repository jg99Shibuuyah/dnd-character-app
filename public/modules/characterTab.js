(function(){
  function init(app){
    const { save, buildAttacks } = app;

    function wireCharacterEvents(){
      document.getElementById('addAttack')?.addEventListener('click', () => {
        app.state.attacks.push({name:'', bonus:'', dmg:''});
        buildAttacks(); save();
      });
    }

    document.addEventListener('DOMContentLoaded', wireCharacterEvents);
  }

  window.characterSheetModules.register('characterTab', init);
})();
