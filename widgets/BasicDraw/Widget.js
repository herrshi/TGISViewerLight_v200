define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/_base/array",
  "dojo/topic",
  "dojo/on",
  "dojo/dom-style",
  "dojo/dom-construct",
  "jimu/BaseWidget",
  "jimu/utils"
], function(
  declare,
  lang,
  array,
  topic,
  on,
  domStyle,
  domConstruct,
  BaseWidget,
  jimuUtils
) {
  return declare([BaseWidget], {
    baseClass: "jimu-widget-BasicDraw",

    _drawType: "",
    _showMeasure: false,
    _drawLayer: null,
    _pointList: [],
    _defaultCursor: "auto",

    _tooltipDiv: null,

    _currentPolyline: null,
    _currentPolygon: null,
    _tempPolyline: null,
    _tempPolygon: null,

    _vectorIcon: null,

    _callbackFunction: null,

    postCreate: function() {
      this.inherited(arguments);

      this._drawLayer = L.layerGroup().addTo(this.map);
      this._defaultCursor = domStyle.get(
        document.getElementById(jimuConfig.mapId),
        "cursor"
      );

      this._vectorIcon = L.icon({
        iconUrl: window.path + "images/dot_clicked.png",
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      });

      //显示tooltip
      this._tooltipDiv = domConstruct.place(
        "<div id='drawTooltip' class='tooltipDiv'></div>",
        document.getElementById(jimuConfig.mapId)
      );

      topic.subscribe("startDraw", lang.hitch(this, this.onStartDraw));
      topic.subscribe("stopDraw", lang.hitch(this, this.onStopDraw));
    },

    onStartDraw: function(params) {
      var paramsObj = JSON.parse(params.params);
      this._drawType = paramsObj.type;
      this._showMeasure = !!paramsObj.showMeasure;
      this._callbackFunction = params.callback;
      //禁用双击放大, 将双击事件留给停止绘制
      this.map.doubleClickZoom.disable();
      this._pointList = [];
      //改变鼠标指针
      domStyle.set(
        document.getElementById(jimuConfig.mapId),
        "cursor",
        "crosshair"
      );

      this._tooltipDiv.innerHTML = this.config.tooltip.startDraw;

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
      //隐藏tooltip
      domStyle.set(this._tooltipDiv, "display", "none");
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
          if (this._callbackFunction) {
            this._callbackFunction({x: point.lng, y: point.lat});
          }
          break;

        //线
        case "line":
          //删除辅助线
          if (this._tempPolyline) {
            this._drawLayer.removeLayer(this._tempPolyline);
            this._tempPolyline = null;
          }

          //添加节点图标
          var vectorMarker = L.marker(point, { icon: this._vectorIcon }).addTo(
            this._drawLayer
          );
          //显示线段长度
          if (this._showMeasure) {
            if (!L.Browser.ielt9) {
              if (this._pointList.length === 1) {
                vectorMarker.bindTooltip("起点", {
                  permanent: true,
                  className: "tooltipDiv"
                });
              } else {
                var distance = this.map.distance(
                  this._pointList[this._pointList.length - 1],
                  this._pointList[this._pointList.length - 2]
                );
                var tooltipText =
                  distance < 1000
                    ? Math.round(distance) + "米"
                    : (distance / 1000).toFixed(2) + "公里";
                vectorMarker.bindTooltip(tooltipText, {
                  permanent: true,
                  className: "tooltipDiv"
                });
              }
            }
          }

          if (!this._showMeasure) {
            this._tooltipDiv.innerHTML = this.config.tooltip.finishDraw;
          }

          if (this._pointList.length === 2) {
            //两个点时创建线对象
            this._currentPolyline = L.polyline(latlngs).addTo(this._drawLayer);
            if (L.Browser.ielt9){
              this._refreshMap();
            }
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
            this._tempPolyline = null;
          }
          if (this._tempPolygon) {
            this._drawLayer.removeLayer(this._tempPolygon);
            this._tempPolygon = null;
          }
          this._tooltipDiv.innerHTML = this.config.tooltip.continueDraw;
          if (this._pointList.length === 2) {
            this._tooltipDiv.innerHTML = this.config.tooltip.finishDraw;
            //两个点时连线
            this._currentPolyline = L.polyline(latlngs).addTo(this._drawLayer);
            if (L.Browser.ielt9){
              this._refreshMap();
            }
          } else if (this._pointList.length === 3) {
            this._tooltipDiv.innerHTML = this.config.tooltip.finishDraw;
            //三个点时先删除前两个点的连线, 再创建面对象
            this._drawLayer.removeLayer(this._currentPolyline);
            this._currentPolygon = L.polygon(latlngs).addTo(this._drawLayer);
          } else if (this._pointList.length > 3) {
            this._tooltipDiv.innerHTML = this.config.tooltip.finishDraw;
            //超过三个点时往面对象里加点
            this._currentPolygon.addLatLng(point);
          }
          break;
      }
    },

    onMapMouseMove: function(event) {
      var point = event.latlng;

      //tooltip
      var containerPoint = event.containerPoint;
      domStyle.set(this._tooltipDiv, "display", "block");
      domStyle.set(this._tooltipDiv, "top", containerPoint.y - 15 + "px");
      domStyle.set(this._tooltipDiv, "left", containerPoint.x + 15 + "px");

      var tooltip = "";
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

            //计算长度
            if (this._showMeasure) {
              var totalLength = 0;
              if (this._pointList.length >= 2) {
                for (var i = 0; i < this._pointList.length - 1; i++) {
                  totalLength += this.map.distance(
                    this._pointList[i],
                    this._pointList[i + 1]
                  );
                }
              }
              totalLength += this.map.distance(lastPoint, point);
              var tooltipText =
                totalLength < 1000
                  ? "<font color='#ff8000'>" +
                    Math.round(totalLength) +
                    "</font>米"
                  : "<font color='#ff8000'>" +
                    (totalLength / 1000).toFixed(2) +
                    "</font>公里";

              this._tooltipDiv.innerHTML =
                "总长: " +
                tooltipText +
                "<br>" +
                this.config.tooltip.finishDraw;
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
              this._tempPolygon.setLatLngs(latlngs);
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
      this._tooltipDiv.innerHTML = this.config.tooltip.startDraw;
    },

    _refreshMap: function() {
      this.map.panTo(this.map.getCenter());
    }
  });
});
