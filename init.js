var dojoConfig;

(function (argument) {
  var resources = [];
  
  if (!window.path) {
    console.error("No path.");
  }
  else {
    dojoConfig = {
      parseOnLoad: false,
      async: true,
      tlmSiblingOfDojo: false
    };
    dojoConfig.baseUrl = window.path;
    dojoConfig.packages = [{
      name: "dojo",
      location: window.path + "dojo"
    }, {
      name: "dijit",
      location: window.apiUrl + "dijit"
    }, {
      name: "dojox",
      location: window.apiUrl + "dojox"
    }, {
      name: "put-selector",
      location: window.apiUrl + "put-selector"
    }, {
      name: "xstyle",
      location: window.apiUrl + "xstyle"
    }, {
      name: "dgrid",
      location: window.apiUrl + "dgrid"
    }, {
      name: "dgrid1",
      location: window.apiUrl + "dgrid1"
    }, {
      name: "dstore",
      location: window.apiUrl + "dstore"
    }, {
      name: "moment",
      location: window.apiUrl + "moment"
    }, {
      name: "esri",
      location: window.apiUrl + "esri"
    }, {
      name: "widgets",
      location: "widgets"
    }, {
      name: "jimu",
      location: "jimu.js"
    }, {
      name: "themes",
      location: "themes"
    }, {
      name: "libs",
      location: "libs"
    }, {
      name: "dynamic-modules",
      location: "dynamic-modules"
    }];

    resources = [
      window.path + "libs/dojo/dojo.js",
      window.path + "libs/leaflet/leaflet.css",
      window.path + "libs/leaflet/leaflet.js"
    ];
    
    loadResources(resources, null, function (url, loaded) {
      
    }, function () {
      continueLoad();
      
      function continueLoad() {
        if (typeof require === "undefined") {
          if (window.console) {
            console.log("Waiting for API loaded.");
          }
          setTimeout(continueLoad, 100);
          return;
        }
      }

      require(["jimu/main"], function (jimuMain) {
        jimuMain.initApp();
      })
    });
  }

})();