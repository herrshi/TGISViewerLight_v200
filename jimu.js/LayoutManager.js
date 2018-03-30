define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/html",
  "dijit/_WidgetBase"
], function (
  declare,
  lang,
  html,
  _WidgetBase) {

  var instance = null, clazz;

  clazz = declare([_WidgetBase], {
    map: null,
    mapId: "map",

    constructor: function(domId) {

    }
  });

  clazz.getInstance = function(domId) {
    if (instance === null) {
      instance = new clazz(domId);
      // window._layoutManager = instance;
    }
    return instance;
  };
  return clazz;

});