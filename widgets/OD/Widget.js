define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/topic",
  "jimu/BaseWidget"
], function(declare, lang, topic, BaseWidget) {
  return declare([BaseWidget], {
    _odLayer: null,

    postCreate: function() {
      this.inherited(arguments);

      this._odLayer = L.layerGroup().addTo(this.map);

      topic.subscribe("showOD", lang.hitch(this, this.onTopicHandler_showOD));
    },

    onTopicHandler_showOD: function (params) {
      var paramsObj = JSON.parse(params);
      var type = paramsObj.type;

      //加入起点
      if (!isNaN(paramsObj.startPoint.x) && !isNaN(paramsObj.startPoint.y)) {
        var startPoint = L.marker([paramsObj.startPoint.y, paramsObj.startPoint.x]);
        if (!L.Browser.ielt9){
          startPoint.bindTooltip("起点", {
            permanent: true,
            className: "tooltipDiv"
          });
        }
        startPoint.addTo(this._odLayer);
      }
    }
  });
});
