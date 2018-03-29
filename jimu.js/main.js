define([
  "dojo/_base/lang",
  "jimu/ConfigManager"
], function (
  lang,
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
  }

  mo.initApp = initApp;
  return mo;
});