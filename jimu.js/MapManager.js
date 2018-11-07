define(["dojo/_base/declare", "dojo/_base/lang", "dojo/topic"], function(
  declare,
  lang,
  topic
) {
  var instance = null,
    clazz;

  clazz = declare(null, {
    appConfig: null,
    mapDivId: "",
    map: null,
    layerList: [],

    constructor: function(options, mapDivId) {
      this.appConfig = options.appConfig;
      this.mapDivId = mapDivId;
      this.id = mapDivId;

      topic.subscribe(
        "setLayerVisibility",
        lang.hitch(this, this._onTopicHandler_setLayerVisibility)
      );
    },

    showMap: function() {
      console.time("Load Map");

      var mapOptions = this.appConfig.map.mapOptions;
      //百度坐标系
      if (this.appConfig.map.coordinateSystem === "BD09") {
        mapOptions = lang.mixin(mapOptions, { crs: L.CRS.Baidu });
      }
      var map = L.map(this.mapDivId, mapOptions);

      this.appConfig.map.basemaps.forEach(
        lang.hitch(this, function(layerConfig) {
          this._createMap(map, layerConfig);
        })
      );

      console.timeEnd("Load Map");
      this.map = map;
      topic.publish("mapLoaded", this.map);
    },

    _createMap: function(map, layerConfig) {
      var keyProperties = ["label", "url", "type"];
      var options = [];
      for (var p in layerConfig) {
        if (layerConfig.hasOwnProperty(p)) {
          if (keyProperties.indexOf(p) < 0) {
            options[p] = layerConfig[p];
          }
        }
      }

      var layer;
      var miniMapLayer;
      switch (layerConfig.type) {
        case "tile":
          var url = layerConfig.url.replace(
            /{gisServer}/i,
            this.appConfig.map.gisServer
          );
          layer = L.tileLayer(url, options);

          if (layerConfig.label === this.appConfig.map.miniMap.layer) {
            miniMapLayer = L.tileLayer(url, options);
          }
          break;

        case "csv":
          break;

        case "BD_vec":
          layer = L.tileLayer.baidu({
            url: layerConfig.url,
            layer: "vec",
            bigFont: layerConfig.bigFont
          });

          if (
            this.appConfig.map.miniMap.show &&
            layerConfig.label === this.appConfig.map.miniMap.layer
          ) {
            miniMapLayer = L.tileLayer.baidu({
              url: layerConfig.url,
              layer: "vec",
              bigFont: layerConfig.bigFont
            });
          }
          break;

        case "BD_img":
          layer = L.tileLayer.baidu({
            url: layerConfig.url,
            layer: "img_d"
          });

          if (layerConfig.label === this.appConfig.map.miniMap.layer) {
            miniMapLayer = L.tileLayer.baidu({
              url: layerConfig.url,
              layer: "img_d"
            });
          }
          break;

        case "BD_ano":
          layer = L.tileLayer.baidu({
            url: layerConfig.url,
            layer: "img_z",
            bigFont: layerConfig.bigFont
          });
          break;

        case "BD_custom":
          layer = L.tileLayer.baidu({
            url: layerConfig.url,
            layer: "custom",
            customid: layerConfig.style
          });

          if (layerConfig.label === this.appConfig.map.miniMap.layer) {
            miniMapLayer = L.tileLayer.baidu({
              url: layerConfig.url,
              layer: "custom",
              customid: layerConfig.style
            });
          }
          break;

        case "BD_time":
          layer = L.tileLayer.baidu({
            url: layerConfig.url,
            layer: "time"
          });
          break;
      }
      layer.label = layerConfig.label;

      this.layerList.push(layer);

      layer.layerConfig = layerConfig;
      if (layerConfig.visible) {
        layer.addTo(map);
      }
      if (layerConfig.refreshInterval) {
        layer.refreshInterval = layerConfig.refreshInterval;
        this._setrefresh(map, layer, layerConfig);
      }

      if (miniMapLayer) {
        var miniMap = new L.Control.MiniMap(miniMapLayer, {
          toggleDisplay: true,
          zoomLevelOffset: -4,
          minimized: true,
          zoomAnimation: true,
          strings: {
            hideText: "隐藏鹰眼图",
            showText: "显示鹰眼图"
          }
        }).addTo(map);
      }
    },
    _setrefresh: function(map, layer, layerConfig) {
      setInterval(
        lang.hitch(this, function() {
          this.map.eachLayer(
            lang.hitch(this, function(layeritem) {
              if (layeritem.label === layer.label) {
                layeritem.remove();
                this.layerList.forEach(function(item, index) {
                  if (item.label === layeritem.label) {
                    this.layerList.splice(index, 1);
                  }
                }, this);
                this._refreshLayer(map, layerConfig);
              }
            })
          );
        }),
        layerConfig.refreshInterval * 1000 * 60
      );
    },
    _refreshLayer: function(map, layerConfig) {
      switch (layerConfig.type) {
        case "tile":
          var url = layerConfig.url.replace(
            /{gisServer}/i,
            this.appConfig.map.gisServer
          );
          layer = L.tileLayer(url, options);

          break;

        case "csv":
          break;

        case "BD_vec":
          layer = L.tileLayer.baidu({
            url: layerConfig.url,
            layer: "vec",
            bigFont: layerConfig.bigFont
          });

          if (
            this.appConfig.map.miniMap.show &&
            layerConfig.label === this.appConfig.map.miniMap.layer
          ) {
            miniMapLayer = L.tileLayer.baidu({
              url: layerConfig.url,
              layer: "vec",
              bigFont: layerConfig.bigFont
            });
          }
          break;

        case "BD_img":
          layer = L.tileLayer.baidu({
            url: layerConfig.url,
            layer: "img_d"
          });

          if (layerConfig.label === this.appConfig.map.miniMap.layer) {
            miniMapLayer = L.tileLayer.baidu({
              url: layerConfig.url,
              layer: "img_d"
            });
          }
          break;

        case "BD_ano":
          layer = L.tileLayer.baidu({
            url: layerConfig.url,
            layer: "img_z",
            bigFont: layerConfig.bigFont
          });
          break;

        case "BD_custom":
          layer = L.tileLayer.baidu({
            url: layerConfig.url,
            layer: "custom",
            customid: layerConfig.style
          });

          if (layerConfig.label === this.appConfig.map.miniMap.layer) {
            miniMapLayer = L.tileLayer.baidu({
              url: layerConfig.url,
              layer: "custom",
              customid: layerConfig.style
            });
          }
          break;

        case "BD_time":
          layer = L.tileLayer.baidu({
            url: layerConfig.url,
            layer: "time"
          });
          break;
      }
      layer.label = layerConfig.label;

      layer.addTo(map);

      this.layerList.push(layer);
    },
    _onTopicHandler_setLayerVisibility: function(params) {
      this.layerList.forEach(function(layer) {
        if (layer.label === params.label) {
          if (params.visible && !this.map.hasLayer(layer)) {
            this.map.addLayer(layer);
          } else if (!params.visible && this.map.hasLayer(layer)) {
            this.map.removeLayer(layer);
          }
        }
      }, this);
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
