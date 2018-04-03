var dojoConfig, jimuConfig;

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
      window.path + "libs/json3.min.js",
      window.path + "libs/leaflet/leaflet.css",
      window.path + "libs/leaflet/leaflet.js",
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
      function(url, loaded) {},
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
