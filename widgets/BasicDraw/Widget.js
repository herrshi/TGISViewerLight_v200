define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/topic",
  "dojo/on",
  "jimu/BaseWidget"
], function (
  declare,
  lang,
  topic,
  on,
  BaseWidget
) {
  return declare([BaseWidget], {
    _drawType: "",

    postCreate: function() {
      this.inherited(arguments);
      topic.subscribe("startDraw", lang.hitch(this, this.onStartDraw));
    },
    
    onStartDraw: function (params) {
      var paramsObj = JSON.parse(params);
      this._drawType = paramsObj.type;
      this.own(on(this.map, "mousemove", lang.hitch(this, this.onMapMouseMove)));
    },
    
    onMapClick: function (event) {
      
    },
    
    onMapMouseMove: function (event) {
      L.popup()
        .setLatLng(event.latlng)
        .setContent('<p>Hello world!<br />This is a nice popup.</p>')
        .openOn(this.map);
    }

  });
});