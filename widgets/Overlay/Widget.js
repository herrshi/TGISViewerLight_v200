define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/topic",
  "jimu/BaseWidget"
], function(declare, lang, topic, BaseWidget) {
  return declare([BaseWidget], {
    _markerLayer: null,

    postCreate: function() {
      this.inherited(arguments);

      this._markerLayer = L.layerGroup().addTo(this.map);

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
    },

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

      for (var i = 0; i < this._markerLayer.getLayers().length; i++) {
        var marker = this._markerLayer.getLayers()[i];

        if ((types.length > 0 && ids.length === 0 && types.indexOf(marker.type) >= 0) ||
          (types.length === 0 && ids.length > 0 && ids.indexOf(marker.id) >= 0) ||
          (types.length > 0 && ids.length > 0 && types.indexOf(marker.type) >= 0 && ids.indexOf(marker.id) >= 0)) {
          this._markerLayer.removeLayer(marker);
          i--;
        }
      }
    },

    onTopicHandler_deleteAllPoints: function () {
      this._markerLayer.clearLayers();
    }
  });
});
