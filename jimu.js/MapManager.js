define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/topic"
], function (
  declare,
  lang,
  topic
) {
  var instance = null, clazz;

  clazz = declare(null, {
    appConfig: null,
    mapDivId: "",
    map: null,

    constructor: function(options, mapDivId) {
      this.appConfig = options.appConfig;
      this.mapDivId = mapDivId;
      this.id = mapDivId;
    },
    
    showMap: function () {
      
    }
  });

  clazz.getInstance = function(options, mapDivId) {
    if (instance === null) {
      instance = new clazz(options, mapDivId);
    }
    return instance;
  };

  return clazz;
});