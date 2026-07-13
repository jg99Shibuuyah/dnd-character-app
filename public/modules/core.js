window.characterSheetModules = window.characterSheetModules || {};

(function(){
  const modules = window.characterSheetModules;

  function register(name, factory){
    modules[name] = factory;
    // app.js loads before the modules and exposes the app object synchronously,
    // so each module can wire itself as soon as it registers. This runs during
    // initial script execution, before DOMContentLoaded fires.
    if (window.characterSheetApp) factory(window.characterSheetApp);
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
