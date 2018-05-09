define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/topic",
  "jimu/BaseWidget",
  "jimu/utils"
], function(declare, lang, array, topic, BaseWidget, jimuUtils) {
  return declare([BaseWidget], {
    _searchCallback: null,
    _onlyVisible: true,
    _types: [],

    postCreate: function() {
      this.inherited(arguments);

      topic.subscribe(
        "geometrySearch",
        lang.hitch(this, this.onTopicHandler_geometrySearch)
      );
      topic.subscribe(
        "stopGeometrySearch",
        lang.hitch(this, this.onTopicHandler_stopGeometrySearch)
      );
    },

    onTopicHandler_geometrySearch: function(params) {
      var paramsObj = JSON.parse(params.params);
      this._searchCallback = params.callback;
      this._onlyVisible = !!paramsObj.onlyVisible;
      this._types = paramsObj.types;

      var userDraw = !!paramsObj.userDraw;
      if (userDraw) {
        topic.publish("startDraw", {
          params:
            '{"type":"' + paramsObj.geoType + '", "continuousDraw":false}',
          callback: lang.hitch(this, this._drawEndCallback)
        });
      }
    },

    onTopicHandler_stopGeometrySearch: function() {
      topic.publish("clearDraw");
    },

    _drawEndCallback: function(result) {
      //查询范围
      var searchScope = result;
      var searchResults = [];
      //要查询的要素
      topic.publish("getPoints", {
        params: { onlyVisible: this._onlyVisible, types: this._types },
        callback: lang.hitch(this, function(points) {
          array.forEach(points, function(point) {
            var inside = jimuUtils.geometryUtils.isMarkerInsidePolygon(
              point,
              searchScope
            );
            if (inside) {
              searchResults.push({ type: point.type, id: point.id });
            }
          });

          if (this._searchCallback) {
            this._searchCallback(searchResults);
          }
        })
      });
    }
  });
});
