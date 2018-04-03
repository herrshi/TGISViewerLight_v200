define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/topic",
  "jimu/BaseWidget"
], function(declare, lang, topic, BaseWidget) {
  return declare([BaseWidget], {
    postCreate: function() {
      this.inherited(arguments);

      topic.subscribe(
        "addPoints",
        lang.hitch(this, this.onTopicHandler_addPoints)
      );
    },

    _getIconOption: function(symbol) {
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

    onTopicHandler_addPoints: function(parmas) {
      // L.marker([36.0342, 103.8535]).addTo(this.map);
      var paramsObj = JSON.parse(parmas);
      var defaultIcon = this._getIconOption(paramsObj.defaultSymbol);

      paramsObj.points.forEach(function(pointObj) {
        var geometry = pointObj.geometry;
        if (!isNaN(geometry.x) && !isNaN(geometry.y)) {
          var icon = this._getIconOption(pointObj.symbol);
          var marker;
          if (icon !== null || defaultIcon !== null) {
            marker = L.marker([geometry.y, geometry.x], {
              icon: icon || defaultIcon
            });
          } else {
            marker = L.marker([geometry.y, geometry.x]);
          }
          marker.id = pointObj.id;
          marker.type = pointObj.type;
          marker.addTo(this.map);
        }
      }, this);
    }
  });
});
