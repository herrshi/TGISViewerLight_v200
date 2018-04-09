define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/_base/fx",
  "dojo/topic",
  "dojo/dom-style",
  "jimu/BaseWidget"
], function(declare, lang, array, fx, topic, domStyle, BaseWidget) {
  return declare([BaseWidget], {
    _markerLayer: null,
    _polylineLayer: null,
    _polygonLayer: null,

    postCreate: function() {
      this.inherited(arguments);

      this._markerLayer = L.layerGroup().addTo(this.map);
      this._polylineLayer = L.layerGroup().addTo(this.map);
      this._polygonLayer = L.layerGroup().addTo(this.map);

      topic.subscribe(
        "addPoints",
        lang.hitch(this, this.onTopicHandler_addPoints)
      );
      topic.subscribe(
        "deletePoints",
        lang.hitch(this, this.onTopicHandler_deletePoints)
      );
      topic.subscribe(
        "deleteAllPoints",
        lang.hitch(this, this.onTopicHandler_deleteAllPoints)
      );
      topic.subscribe(
        "showPoints",
        lang.hitch(this, this.onTopicHandler_showPoints)
      );
      topic.subscribe(
        "hidePoints",
        lang.hitch(this, this.onTopicHandler_hidePoints)
      );

      topic.subscribe(
        "addLines",
        lang.hitch(this, this.onTopicHandler_addLines)
      );
      topic.subscribe(
        "deleteLines",
        lang.hitch(this, this.onTopicHandler_deleteLines)
      );
      topic.subscribe(
        "deleteAllLines",
        lang.hitch(this, this.onTopicHandler_deleteAllLines)
      );
    },

    /**将arcgis的PictureMarkerSymbol转换为leaflet的icon*/
    _getIcon: function(symbol) {
      if (symbol && symbol.url !== "") {
        var url = symbol.url;
        var size =
          isNaN(symbol.width) || isNaN(symbol.height)
            ? null
            : [symbol.width, symbol.height];
        var anchor = [
          isNaN(symbol.xoffset) ? 0 : symbol.xoffset,
          isNaN(symbol.yoffset) ? 0 : symbol.yoffset
        ];
        return L.icon({
          iconUrl: url,
          iconSize: size,
          iconAnchor: anchor
        });
      } else {
        return null;
      }
    },

    /**将arcgis的SimpleLineSymbol转换为leaflet样式*/
    _getPolylineOption: function(symbol) {
      var option = {};
      for (var key in symbol) {
        if (symbol.hasOwnProperty(key)) {
          if (key === "alpha") {
            option["opacity"] = symbol[key];
          } else if (key === "width") {
            option["weight"] = symbol[key];
          } else {
            option[key] = symbol[key];
          }
        }
      }
      return option;
    },

    _getPopupContent: function(fields) {
      var content = "";
      for (var key in fields) {
        if (fields.hasOwnProperty(key)) {
          content += "<b>" + key + "</b>: " + fields[key] + "<br>";
        }
      }

      return content;
    },

    /**删除overlay*/
    _deleteOverlay: function(layerGroup, types, ids) {
      for (var i = 0; i < layerGroup.getLayers().length; i++) {
        var marker = layerGroup.getLayers()[i];

        if (
          (types.length > 0 &&
            ids.length === 0 &&
            array.indexOf(types, marker.type) >= 0) ||
          (types.length === 0 &&
            ids.length > 0 &&
            array.indexOf(ids, marker.id) >= 0) ||
          (types.length > 0 &&
            ids.length > 0 &&
            array.indexOf(types, marker.type) >= 0 &&
            array.indexOf(ids, marker.id) >= 0)
        ) {
          layerGroup.removeLayer(marker);
          i--;
        }
      }
    },

    _setOpacity: function(layerGroup, types, ids, opacity) {
      for (var i = 0; i < layerGroup.getLayers().length; i++) {
        var marker = layerGroup.getLayers()[i];

        if (
          (types.length > 0 &&
            ids.length === 0 &&
            array.indexOf(types, marker.type) >= 0) ||
          (types.length === 0 &&
            ids.length > 0 &&
            array.indexOf(ids, marker.id) >= 0) ||
          (types.length > 0 &&
            ids.length > 0 &&
            array.indexOf(types, marker.type) >= 0 &&
            array.indexOf(ids, marker.id) >= 0)
        ) {
          if (opacity === 0) {
            if (L.Browser.ielt9) {
              domStyle.set(marker._icon, "display", "none");
            }
            else {
              fx.fadeOut({node: marker._icon}).play();
            }
          } else {
            if (L.Browser.ielt9) {
              domStyle.set(marker._icon, "display", "block");
            }
            else {
              fx.fadeIn({node: marker._icon}).play();
            }
          }

        }
      }
    },

    onTopicHandler_addPoints: function(params) {
      var paramsObj = JSON.parse(params);
      var defaultIcon = this._getIcon(paramsObj.defaultSymbol);

      paramsObj.points.forEach(function(pointObj) {
        var geometry = pointObj.geometry;
        if (!isNaN(geometry.x) && !isNaN(geometry.y)) {
          var icon = this._getIcon(pointObj.symbol) || defaultIcon;
          var marker;
          if (icon !== null) {
            marker = L.marker([geometry.y, geometry.x], {
              icon: icon
            });
          } else {
            marker = L.marker([geometry.y, geometry.x]);
          }
          if (pointObj.content || pointObj.fields) {
            marker.bindPopup(
              pointObj.content || this._getPopupContent(pointObj.fields)
            );
          }
          marker.id = pointObj.id;
          marker.type = pointObj.type;
          marker.addTo(this._markerLayer);
        }
      }, this);
    },

    onTopicHandler_deletePoints: function(params) {
      var paramsObj = JSON.parse(params);
      var types = paramsObj.types || [];
      var ids = paramsObj.ids || [];

      this._deleteOverlay(this._markerLayer, types, ids);
    },

    onTopicHandler_showPoints: function(params) {
      var paramsObj = JSON.parse(params);
      var types = paramsObj.types || [];
      var ids = paramsObj.ids || [];

      this._setOpacity(this._markerLayer, types, ids, 1.0);
    },

    onTopicHandler_hidePoints: function(params) {
      var paramsObj = JSON.parse(params);
      var types = paramsObj.types || [];
      var ids = paramsObj.ids || [];

      this._setOpacity(this._markerLayer, types, ids, 0.0);
    },

    onTopicHandler_deleteAllPoints: function() {
      this._markerLayer.clearLayers();
    },

    onTopicHandler_addLines: function(params) {
      var paramsObj = JSON.parse(params);
      var defaultSymbol = this._getPolylineOption(paramsObj.defaultSymbol);

      paramsObj.lines.forEach(function(lineObj) {
        var paths = lineObj.geometry.paths;
        var symbol = lang.mixin(
          defaultSymbol,
          this._getPolylineOption(lineObj.symbol)
        );
        //leaflet使用[纬度, 经度], 需要交换一下
        var leafletPaths = array.map(paths, function(path) {
          return array.map(path, function(coords) {
            return [coords[1], coords[0]];
          });
        });
        var line = L.polyline(leafletPaths, symbol);
        line.id = lineObj.id;
        line.type = lineObj.type;
        line.addTo(this._polylineLayer);
      }, this);

      //ie7需要刷新一下地图才会显示Polyline
      this._refreshMap();
    },

    onTopicHandler_deleteLines: function(params) {
      var paramsObj = JSON.parse(params);
      var types = paramsObj.types || [];
      var ids = paramsObj.ids || [];

      this._deleteOverlay(this._polylineLayer, types, ids);
    },

    onTopicHandler_deleteAllLines: function() {
      this._polylineLayer.clearLayers();
    },

    _refreshMap: function() {
      this.map.panTo(this.map.getCenter());
    }
  });
});
