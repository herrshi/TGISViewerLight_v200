define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/topic",
  "jimu/BaseWidget"
], function(declare, lang, array, topic, BaseWidget) {
  return declare([BaseWidget], {
    _odLayer: null,

    _oIcon: null,
    _dIcon: null,

    postCreate: function() {
      this.inherited(arguments);

      this._oIcon = L.icon({
        iconUrl: window.path + "images/BlueSphere.png",
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
      this._dIcon = L.icon({
        iconUrl: window.path + "images/RedSphere.png",
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      this._odLayer = L.layerGroup().addTo(this.map);

      topic.subscribe("showOD", lang.hitch(this, this.onTopicHandler_showOD));
    },

    onTopicHandler_showOD: function (params) {
      var paramsObj = JSON.parse(params);
      var type = paramsObj.type;

      //加入起点
      if (!isNaN(paramsObj.startPoint.x) && !isNaN(paramsObj.startPoint.y)) {
        var startPoint = L.marker([paramsObj.startPoint.y, paramsObj.startPoint.x], {
          icon: type.toLowerCase() === "o" ? this._oIcon : this._dIcon
        });
        startPoint.addTo(this._odLayer);

        //加入终点
        var totalFlow = 0;
        array.forEach(paramsObj.endFlows, function (endObj) {
          if (!isNaN(endObj.endPoint.x) && !isNaN(endObj.endPoint.y)) {
            totalFlow += endObj.flow;
            var endPoint = L.marker([endObj.endPoint.y, endObj.endPoint.x], {
              icon: type.toLowerCase() === "o" ? this._dIcon : this._oIcon
            });
            endPoint.addTo(this._odLayer);
            endPoint.bindPopup((type.toLowerCase() === "o" ? "迄" : "起") + ": " + Math.round(endObj.flow), {
              autoClose: false,
              className: "custom-popup",
              closeButton: false
            }).openPopup();
          }
        }, this);

        startPoint.bindPopup((type.toLowerCase() === "o" ? "起" : "迄") + ": " + Math.round(totalFlow), {
          autoClose: false,
          className: "custom-popup",
          closeButton: false
        }).openPopup();
      }
    }
  });
});
