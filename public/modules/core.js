window.characterSheetModules = window.characterSheetModules || {};

(function(){
  const modules = window.characterSheetModules;

  function register(name, factory){
    modules[name] = factory;
  }

  function initAll(app){
    Object.values(modules).forEach((module) => {
      if (typeof module === 'function') {
        module(app);
      }
    });
  }

  window.characterSheetModules.register = register;
  window.characterSheetModules.initAll = initAll;
})();
