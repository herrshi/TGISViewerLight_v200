define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/html",
  "dojo/Deferred",
  "dojo/promise/all",
  "dojo/request/xhr",
  "jimu/utils"
], function(
  declare,
  lang,
  html,
  Deferred,
  all,
  xhr,
  jimuUtils) {
  var instance = null,
    clazz;

  clazz = declare(null, {
    constructor: function() {

    },

    loadWidget: function(setting){
      var def = new Deferred();

      all([
        this._loadWidgetClass(setting),
        this._loadWidgetManifest(setting)
      ]).then(lang.hitch(this, function (results) {
        console.log(results);
      }));

      return def;

    },

    _loadWidgetManifest: function(setting){
      var def = new Deferred();

      var info = jimuUtils.getUriInfo(setting.uri);
      var url;
      if(info.isRemote){
        url = info.folderUrl + "manifest.json?f=json";
      }else{
        url = info.folderUrl + "manifest.json";
      }

      if(setting.manifest){
        def.resolve(setting);
        return def;
      }

      xhr(url, {
        handleAs: "json",
        headers: {
          "X-Requested-With": null
        }
      }).then(lang.hitch(this, function (manifest) {
        manifest.category = "widget";
        lang.mixin(manifest, jimuUtils.getUriInfo(setting.uri));
        jimuUtils.manifest.addManifestProperties(manifest);
        jimuUtils.widgetJson.addManifest2WidgetJson(setting, manifest);
        def.resolve(setting);
      }));

      return def;
    },

    _loadWidgetClass: function(setting) {
      var def = new Deferred();

      var uri = window.path + setting.uri + ".js";
      require([uri], lang.hitch(this, function(clazz) {
        def.resolve(clazz);
      }));

      return def;
    }
  });

  clazz.getInstance = function() {
    if (instance === null) {
      instance = new clazz();
    }
    return instance;
  };
  return clazz;
});
