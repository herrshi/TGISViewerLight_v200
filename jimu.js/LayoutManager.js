define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/html",
  "dojo/topic",
  "dijit/_WidgetBase"
], function (
  declare,
  lang,
  html,
  topic,
  _WidgetBase) {

  var instance = null, clazz;

  clazz = declare([_WidgetBase], {
    map: null,
    mapId: "map",

    constructor: function(domId) {
      this.id = domId;

      this.own(topic.subscribe("appConfigLoaded", lang.hitch(this, this.onAppConfigLoaded)));
    },

    postCreate: function(){
      this.containerNode = this.domNode;
    },

    onAppConfigLoaded: function(config){
      this.appConfig = lang.clone(config);

      this._loadMap();

    },

    _loadMap: function () {
      html.create("div", {
        id: this.mapId,
        style: lang.mixin({
          position: "absolute",
          backgroundColor: "#EEEEEE",
          overflow: "hidden",
          minWidth:"1px",
          minHeight:"1px",
          display: "flex"
        })
      }, this.id);
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