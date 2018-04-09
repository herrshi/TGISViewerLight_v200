define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/topic",
  "dojo/on",
  "dojo/dom-style",
  "jimu/BaseWidget"
], function(declare, lang, array, topic, on, domStyle, BaseWidget) {
  return declare([BaseWidget], {
    _drawType: "",
    _drawLayer: null,
    _pointList: [],
    _defaultCursor: "auto",

    _currentPolyline: null,
    _currentPolygon: null,
    _tempPolyline: null,
    _tempPolygon: null,

    postCreate: function() {
      this.inherited(arguments);
      this._drawLayer = L.layerGroup().addTo(this.map);
      this._defaultCursor = domStyle.get(
        document.getElementById(jimuConfig.mapId),
        "cursor"
      );
      topic.subscribe("startDraw", lang.hitch(this, this.onStartDraw));
      topic.subscribe("stopDraw", lang.hitch(this, this.onStopDraw));
    },

    onStartDraw: function(params) {
      var paramsObj = JSON.parse(params);
      this._drawType = paramsObj.type;
      //禁用双击放大, 将双击事件留给停止绘制
      this.map.doubleClickZoom.disable();
      this._pointList = [];
      //改变鼠标指针
      domStyle.set(
        document.getElementById(jimuConfig.mapId),
        "cursor",
        "crosshair"
      );

      this.map.on("click", lang.hitch(this, this.onMapClick));
      this.map.on("mousemove", lang.hitch(this, this.onMapMouseMove));
      this.map.on("dblclick", lang.hitch(this, this.onMapDoubleClick));
    },

    onStopDraw: function() {
      this.map.doubleClickZoom.enable();
      this.map.off("click");
      this.map.off("mousemove");
      this.map.off("dblclick");
      this._pointList = [];
      this._tempPolyline = null;
      this._currentPolyline = null;
      //改变鼠标指针
      domStyle.set(
        document.getElementById(jimuConfig.mapId),
        "cursor",
        this._defaultCursor
      );
    },

    onMapClick: function(event) {
      var point = event.latlng;
      this._pointList.push(point);
      var latlngs = array.map(this._pointList, function(point) {
        return [point.lat, point.lng];
      });

      switch (this._drawType.toLowerCase()) {
        //点
        case "point":
          var marker = L.marker(point);
          marker.addTo(this._drawLayer);
          break;

        //线
        case "line":
          //删除辅助线
          if (this._tempPolyline) {
            this._drawLayer.removeLayer(this._tempPolyline);
          }
          if (this._pointList.length === 2) {
            //两个点时创建线对象
            this._currentPolyline = L.polyline(latlngs).addTo(this._drawLayer);
            this._refreshMap();
          } else if (this._pointList.length > 2) {
            //超过两个点时往线对象里加点
            this._currentPolyline.addLatLng(point);
          }
          break;

        //面
        case "polygon":
          //删除辅助线和面
          if (this._tempPolyline) {
            this._drawLayer.removeLayer(this._tempPolyline);
          }
          if (this._tempPolygon) {
            this._drawLayer.removeLayer(this._tempPolygon);
          }
          if (this._pointList.length === 2) {
            //两个点时连线
            this._currentPolyline = L.polyline(latlngs).addTo(this._drawLayer);
            this._refreshMap();
          } else if (this._pointList.length === 3) {
            //三个点时先删除前两个点的连线, 再创建面对象
            this._drawLayer.removeLayer(this._currentPolyline);
            this._currentPolygon = L.polygon(latlngs).addTo(this._drawLayer);
          } else if (this._pointList.length > 3) {
            //超过三个点时往面对象里加点
            this._currentPolygon.addLatLng(point);
          }
          break;
      }
    },

    onMapMouseMove: function(event) {
      var point = event.latlng;

      switch (this._drawType.toLowerCase()) {
        case "line":
          //至少有一个点时画辅助线
          if (this._pointList.length >= 1) {
            var lastPoint = this._pointList[this._pointList.length - 1];
            if (!this._tempPolyline) {
              //创建辅助线
              this._tempPolyline = L.polyline([
                [lastPoint.lat, lastPoint.lng],
                [point.lat, point.lng]
              ]).addTo(this._drawLayer);
              this._refreshMap();
            } else {
              //改变辅助线坐标
              this._tempPolyline.setLatLngs([
                [lastPoint.lat, lastPoint.lng],
                [point.lat, point.lng]
              ]);
            }
          }

          break;

        case "polygon":
          if (this._pointList.length === 1) {
            //只有一个点时画辅助线
            lastPoint = this._pointList[0];
            if (!this._tempPolyline) {
              //创建辅助线
              this._tempPolyline = L.polyline([
                [lastPoint.lat, lastPoint.lng],
                [point.lat, point.lng]
              ]).addTo(this._drawLayer);
              this._refreshMap();
            } else {
              //改变辅助线坐标
              this._tempPolyline.setLatLngs([
                [lastPoint.lat, lastPoint.lng],
                [point.lat, point.lng]
              ]);
            }
          } else if (this._pointList.length >= 2) {
            //超过2个点时画辅助面
            var latlngs = array.map(this._pointList, function(point) {
              return [point.lat, point.lng];
            });
            latlngs.push([point.lat, point.lng]);
            if (!this._tempPolygon) {
              this._tempPolygon = L.polygon(latlngs).addTo(this._drawLayer);
            } else {
              this._tempPolygon.setLatLng(latlngs);
            }
          }
          break;
      }
    },

    onMapDoubleClick: function(event) {
      this._pointList = [];
      this._tempPolyline = null;
      this._currentPolyline = null;
      this._currentPolygon = null;
    },

    _refreshMap: function() {
      this.map.panTo(this.map.getCenter());
    }
  });
});
