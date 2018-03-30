define([
  "dojo/_base/lang",
  "jimu/LayoutManager",
  "jimu/ConfigManager"
], function (
  lang,
  LayoutManager,
  ConfigManager
) {
  var mo = {};

  String.prototype.startWith = function(str) {
   return (this.substr(0, str.length) === str);
  };

  String.prototype.endWith = function(str) {
    return (this.substr(this.length - str.length, str.length) === str);
  };



  function initApp() {
    console.log("jimu.js init...");

    var layoutManager = LayoutManager.getInstance({
      mapId: jimuConfig.mapId
    }, jimuConfig.layoutId);
    layoutManager.startup();

    var configManager = ConfigManager.getInstance();
    configManager.loadConfig();
  }

  mo.initApp = initApp;
  return mo;
});