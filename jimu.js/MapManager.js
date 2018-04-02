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
      console.time("Load Map");

      var map = L.map(this.mapDivId, this.appConfig.map.mapOptions);

      this.appConfig.map.basemaps.forEach(lang.hitch(this, function (layerConfig) {
        this._createMap(map, layerConfig);
      }));

      console.timeEnd("Load Map");
      this.map = map;
      topic.publish("mapLoaded", this.map);
    },

    _createMap: function (map, layerConfig) {
      var keyProperties = ["label", "url", "type"];
      var options = [];
      for (var p in layerConfig) {
        if (layerConfig.hasOwnProperty(p)) {
          if (keyProperties.indexOf(p) < 0) {
            options[p] = layerConfig[p];
          }
        }
      }

      switch (layerConfig.type){
        case "tile":
          var layer = L.tileLayer(layerConfig.url, options);
          layer.label = layerConfig.label;
          layer.addTo(map);
          break;
      }
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