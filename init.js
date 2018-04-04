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
      //leaflet标准库
      window.path + "libs/leaflet/leaflet.css",
      window.path + "libs/leaflet/leaflet.js",
      //加入leaflet.draw
      window.path + "libs/leaflet/Leaflet.draw.js",
      window.path + "libs/leaflet/Leaflet.Draw.Event.js",
      window.path + "libs/leaflet/leaflet.draw.css",
      window.path + "libs/leaflet/Toolbar.js",
      window.path + "libs/leaflet/Tooltip.js",
      window.path + "libs/leaflet/ext/GeometryUtil.js",
      window.path + "libs/leaflet/ext/LatLngUtil.js",
      window.path + "libs/leaflet/ext/LineUtil.Intersect.js",
      window.path + "libs/leaflet/ext/Polygon.Intersect.js",
      window.path + "libs/leaflet/ext/Polyline.Intersect.js",
      window.path + "libs/leaflet/ext/TouchEvents.js",
      window.path + "libs/leaflet/draw/DrawToolbar.js",
      window.path + "libs/leaflet/draw/handler/Draw.Feature.js",
      window.path + "libs/leaflet/draw/handler/Draw.SimpleShape.js",
      window.path + "libs/leaflet/draw/handler/Draw.Polyline.js",
      window.path + "libs/leaflet/draw/handler/Draw.Marker.js",
      window.path + "libs/leaflet/draw/handler/Draw.CircleMarker.js",
      window.path + "libs/leaflet/draw/handler/Draw.Circle.js",
      window.path + "libs/leaflet/draw/handler/Draw.Polygon.js",
      window.path + "libs/leaflet/draw/handler/Draw.Rectangle.js",
      window.path + "libs/leaflet/edit/EditToolbar.js",
      window.path + "libs/leaflet/edit/handler/EditToolbar.Edit.js",
      window.path + "libs/leaflet/edit/handler/EditToolbar.Delete.js",
      window.path + "libs/leaflet/Control.Draw.js",
      window.path + "libs/leaflet/edit/handler/Edit.Poly.js",
      window.path + "libs/leaflet/edit/handler/Edit.SimpleShape.js",
      window.path + "libs/leaflet/edit/handler/Edit.Marker.js",
      window.path + "libs/leaflet/edit/handler/Edit.CircleMarker.js",
      window.path + "libs/leaflet/edit/handler/Edit.Circle.js",
      window.path + "libs/leaflet/edit/handler/Edit.Rectangle.js",
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
