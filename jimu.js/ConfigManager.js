define(["dojo/_base/declare", "dojo/_base/lang", "dojo/topic"], function(
  declare,
  lang,
  topic
) {
  var instance = null,
    clazz;

  clazz = declare(null, {
    appConfig: null,
    configFile: null,
    _configLoaded: false,

    loadConfig: function () {
      
    }
  });

  clazz.getInstance = function() {
    if (instance === null) {
      instance = new clazz();
    }

    window.getAppConfig = lang.hitch(instance, instance.getAppConfig);
    return instance;
  };

  return clazz;
});
