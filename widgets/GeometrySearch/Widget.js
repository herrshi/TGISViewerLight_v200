define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/topic",
  "jimu/BaseWidget"
], function(declare, lang, array, topic, BaseWidget) {
  return declare([BaseWidget], {
    _searchCallback: null,

    postCreate: function() {
      this.inherited(arguments);

      topic.subscribe("geometrySearch", lang.hitch(this, this.onTopicHandler_geometrySearch));
    },

    onTopicHandler_geometrySearch: function (params) {
      var paramsObj = JSON.parse(params.params);
      this._searchCallback = params.callback;

      var userDraw = !!paramsObj.userDraw;
      if (userDraw) {
        topic.publish("startDraw", '{"type":"polygon"}');
      }
    }
  });
});
