var dojoConfig, jimuConfig;

/*global weinreUrl, loadResources, _loadPolyfills, loadingCallback, debug, allCookies, unescape */

(function(argument) {
  var resources = [];

  if (!window.path) {
    console.error("No path.");
  } else {
    dojoConfig = {
      parseOnLoad: false,
      async: true,
      tlmSiblingOfDojo: false
    };
    dojoConfig.baseUrl = window.path + "libs/dojo";
    dojoConfig.packages = [
      {
        name: "dojo",
        location: window.path + "libs/dojo/dojo"
      },
      {
        name: "dijit",
        location: window.path + "libs/dojo/dijit"
      },
      {
        name: "dojox",
        location: window.path + "libs/dojo/dojox"
      },
      {
        name: "widgets",
        location: window.path + "widgets"
      },
      {
        name: "jimu",
        location: window.path + "jimu.js"
      },
      {
        name: "libs",
        location: window.path + "libs"
      }
    ];

    resources = [
      //ie7/8没有JSON
      window.path + "libs/json3.min.js",
      window.path + "libs/coordTransform.js",
      //leaflet标准库
      window.path + "libs/leaflet/leaflet.css",
      window.path + "libs/leaflet/leaflet.js",
      //leaflet plugins
      window.path + "libs/leaflet/Control.MiniMap.css",
      window.path + "libs/leaflet/Control.MiniMap.js",
      //Baidu for leaflet
      window.path + "libs/leaflet/Proj4Leaflet/lib/proj4.js",
      window.path + "libs/leaflet/Proj4Leaflet/src/proj4leaflet.js",
      window.path + "jimu.js/CustomLayers/tileLayer.baidu.js",
      //dojo
      window.path + "libs/dojo/dojo/dojo.js"
    ];

    jimuConfig = {
      loadingId: "main-loading",
      mainPageId: "main-page",
      layoutId: "jimu-layout-manager",
      mapId: "map"
    };

    loadResources(
      resources,
      null,
      function(url, loaded) {
        if (typeof loadingCallback === "function") {
          loadingCallback(url, loaded, resources.length);
        }
      },
      function() {
        continueLoad();

        function continueLoad() {
          if (typeof require === "undefined") {
            if (window.console) {
              console.log("Waiting for API loaded.");
            }
            setTimeout(continueLoad, 100);
          }
        }

        require(["jimu/main"], function(jimuMain) {
          jimuMain.initApp();
        });
      }
    );
  }
})();
