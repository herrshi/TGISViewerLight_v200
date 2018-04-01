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

      var lon = 103.862;
      var lat = 36.046;
      var zoom = 13;
      var map = L.map(this.mapDivId).setView([lat, lon], zoom);

      var my_merge_tile_layer = L.tileLayer('http://114.215.146.210:25003/v3/tile?z={z}&x={x}&y={y}', {
        maxZoom: 18,
        minZoom: 4,
        id: '3'
      });

      my_merge_tile_layer.addTo(map);

      console.timeEnd("Load Map");
      
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