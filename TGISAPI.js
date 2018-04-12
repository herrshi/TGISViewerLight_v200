var //TGISViewer所在的url
path = null;
//项目配置文件
projectConfig = null;
//全部加载完成以后的回调
loadFinishCallback = null;

var TMap = {
  createNew: function(options, divId, callback) {
    window.path = addSlash(options.viewerUrl);
    window.projectConfig = options.config;
    window.loadFinishCallback = callback;

    var loaderScript = document.createElement("script");
    loaderScript.setAttribute("type", "text/javascript");
    loaderScript.setAttribute("src", path + "simpleLoader.js");
    document.body.appendChild(loaderScript);

    var initScript = document.createElement("script");
    initScript.setAttribute("type", "text/javascript");
    initScript.setAttribute("src", path + "init.js");
    document.body.appendChild(initScript);

    var mainPageDiv = document.createElement("div");
    mainPageDiv.id = "main-page";
    mainPageDiv.style.width = "100%";
    mainPageDiv.style.height = "100%";
    mainPageDiv.style.position = "relative";
    document.getElementById(divId).appendChild(mainPageDiv);

    var layoutManagerDiv = document.createElement("div");
    layoutManagerDiv.id = "jimu-layout-manager";
    layoutManagerDiv.style.width = "100%";
    layoutManagerDiv.style.height = "100%";
    layoutManagerDiv.style.position = "absolute";
    mainPageDiv.appendChild(layoutManagerDiv);

    return TMap;

    function addSlash(url) {
      if (url.substr(url.length - 1, url.length) !== "/") {
        url += "/";
      }
      return url;
    }
  },

  /************************ Overlay BEGIN **************************/
  /**
   * 在地图上添加点覆盖物
   * symbol: 点覆盖物的图标样式
   *   url: string, required. 图标的绝对地址.
   *   width: number, optional. 图标宽度.
   *          单位为px.
   *   height: number, optional. 图标高度.
   *           单位为px.
   *   xoffset: number, optional. 图标在横轴上的偏移量, >0图标往左偏移, <0图标往右偏移, 原点为图标左上角.
   *            单位为px.
   *   yoffset: number, optional. 图标在纵轴上的偏移量, >0往上偏移, <0往下偏移, 原点为图标左上角.
   *            单位为px.
   * @param params: string, json字符串
   *   defaultSymbol: optional, 默认样式.
   *   points: [{}], required.
   *     id: string, required. 编号
   *     type: string, optional. 类型
   *     fields: {}, optional. 属性
   *       点击以后在弹出框中显示fields中的键值对
   *     content: string, optional. html, 自定义的弹出框内容. 使用以后会覆盖fields.
   *     geometry: object, required. 几何属性.
   *       x: x坐标
   *       y: y坐标
   *     symbol: object, optional. 样式.
   *       会覆盖defaultSymbol.
   *       若defaultSymbol和symbol都没有定义, 则使用箭头图标
   * @sample
   *   添加三个点, 其中两个使用images/RedSphere.png, 另一个使用images/BlueSphere.png
   *     map.addPoints('{"defaultSymbol":{"url":"images/RedSphere.png","xoffset":32,"yoffset":32},"points":[{"id":"pt001","type":"police","geometry":{"x":103.8535,"y":36.0342},"symbol":{"url":"images/BlueSphere.png","xoffset":32,"yoffset":32}},{"id":"pt002","type":"police","geometry":{"x":103.8431,"y":36.053}},{"id":"pt003","type":"police","geometry":{"x":103.8541,"y":36.05}}]}');
   * */
  addPoints: function(params) {
    require(["dojo/topic"], function(topic) {
      topic.publish("addPoints", params);
    });
  },

  /**
   * 删除指定点覆盖物
   * @param params: string, json字符串
   *   types: [string], optional, 要删除的类型
   *   ids: [string], optional, 要删除的id
   * @sample
   *   删除所有类型为"police"的覆盖物
   *     map.deletePoints('{"types":["police"]}');
   *   删除类型为"car"，且id是"沪A11111", "沪A22222"的覆盖物
   *     map.deletePoints('{types: ["car"], ids: ["沪A11111", "沪A22222"]}');
   * */
  deletePoints: function(params) {
    require(["dojo/topic"], function(topic) {
      topic.publish("deletePoints", params);
    });
  },

  /**删除所有点覆盖物*/
  deleteAllPoints: function() {
    require(["dojo/topic"], function(topic) {
      topic.publish("deleteAllPoints");
    });
  },

  /**
   * 显示指定覆盖物
   * 参数同deletePoints
   * */
  showPoints: function(params) {
    require(["dojo/topic"], function(topic) {
      topic.publish("showPoints", params);
    });
  },

  /**
   * 隐藏指定覆盖物
   * 参数同deletePoints, 但不删除, 只是隐藏
   * */
  hidePoints: function(params) {
    require(["dojo/topic"], function(topic) {
      topic.publish("hidePoints", params);
    });
  },

  /**
   * 在地图上添加线覆盖物
   * symbol: 线覆盖物的样式
   *   color: string, optional. 颜色.
   *     默认为#3388ff
   *   width: number, optional. 线宽
   *     默认为3
   *   alpha: number, optional. 透明度. 0--1, 0: 完全透明, 1: 完全不透明
   *     默认为1
   * @param params: string, json字符串
   *   defaultSymbol: optional, 默认样式.
   *   lines: [{}], required.
   *     id: string, required. 编号
   *     type: string, optional. 类型
   *     fields: {}, optional. 属性
   *       点击以后在弹出框中显示fields中的键值对
   *     content: string, optional. html, 自定义的弹出框内容. 使用以后会覆盖fields.
   *     geometry: object, required. 几何属性.
   *       paths : [
   *         [ [x11, y11], [x12, y12], ..., [x1n, y1n] ],
   *         [ [x21, y21], [x22, y22], ..., [x2n, y2n] ],
   *         ...,
   *         [ [xm1, ym1], [xm2, ym2], ..., [xmn, ymn] ]
   *       ]
   *       一个polyline对象可以包含多段分离的折线，所有paths是一个数组. 一般情况下paths中只会有一个元素, 即一条连续折线.
   *     symbol: object, optional. 样式.
   *       会覆盖defaultSymbol.
   * @sample
   *   map.addLines('{"defaultSymbol":{"color":"#ff0000"},"lines":[{"id":"wx001","type":"GPS","geometry":{"paths":[[[103.8535,36.0342],[103.8431,36.053],[103.8541,36.05]]]},"symbol":{"alpha":0.5, "width":5}}]}');
   * */
  addLines: function (params) {
    require(["dojo/topic"], function(topic) {
      topic.publish("addLines", params);
    });
  },

  /**
   * 删除指定线覆盖物
   * 参数同deletePoints
   * */
  deleteLines: function (params) {
    require(["dojo/topic"], function(topic) {
      topic.publish("deleteLines", params);
    });
  },

  /**删除所有线覆盖物*/
  deleteAllLines: function () {
    require(["dojo/topic"], function(topic) {
      topic.publish("deleteAllLines");
    });
  },

  /**
   * 开始绘制
   * @param params: string, json字符串
   *   type: string, required. 绘制类型
   *     "point" || "line" || "polygon" || "circle" || "rectangle"
   * */
  startDraw: function (params) {
    require(["dojo/topic"], function(topic) {
      topic.publish("startDraw", params);
    });
  },

  /**停止绘制*/
  stopDraw: function () {
    require(["dojo/topic"], function(topic) {
      topic.publish("stopDraw");
    });
  },

  /**清除绘制内容*/
  clearDraw: function () {
    require(["dojo/topic"], function(topic) {
      topic.publish("clearDraw");
    });
  },
  /************************ Overlay END **************************/

  /************************ Search BEGIN **************************/
  /**
   * 根据id查找要素
   * @param params: string, json字符串
   *   id: string, required.
   * */
  findFeature: function (params) {
    require(["dojo/topic"], function(topic) {
      topic.publish("findFeature", params);
    });
  },
  /************************ Search END **************************/

  /************************ Utils END **************************/
  /**
   * 显示OD数据
   * @param params: string, json字符串
   *   type: string, required. 类型, "O" || "D".
   *   startID: string, optional. O分析时为O点ID, D分析时为D点ID.
   *   startPoint: object, optional. 不传ID时使用坐标定位.
   *     x: number, required.
   *     y: number, required.
   *   endFlows: [object]. required. O分析时为D点数据, D分析时为O点数据.
   *     ID: string, optional. O分析时为D点ID, D分析时为O点ID.
   *     point: object, optional. 不传ID时使用坐标定位.
   *     x: number, required.
   *     y: number, required.
   *     flow: number, required. O分析时为D点流量, D分析时为O点流量
   * */
  addOD: function (params) {
    require(["dojo/topic"], function(topic) {
      topic.publish("addOD", params);
    });
  },

  /**清除OD数据*/
  deleteOD: function () {
    require(["dojo/topic"], function(topic) {
      topic.publish("deleteOD");
    });
  }
  /************************ Utils END **************************/
};
