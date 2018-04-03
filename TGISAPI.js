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

    var loaderScript = document.createElement("script");
    loaderScript.setAttribute("type", "text/javascript");
    loaderScript.setAttribute("src", path + "simpleLoader.js");
    document.body.appendChild(loaderScript);

    var initScript = document.createElement("script");
    initScript.setAttribute("type", "text/javascript");
    initScript.setAttribute("src", path + "init.js");
    document.body.appendChild(initScript);

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
   * symbol: 点覆盖物的图标属性
   *   url: string, required. 图标的绝对地址.
   *   width: number, optional. 图标宽度.
   *          单位为px.
   *   height: number, optional. 图标高度.
   *           单位为px.
   *   xoffset: number, optional. 图标在横轴上的偏移量, >0图标往左偏移, <0图标往右偏移, 起始点为图标左上角.
   *            单位为px.
   *   yoffset: number, optional. 图标在纵轴上的偏移量, >0往上偏移, <0往下偏移, 起始点为图标左上角.
   *            单位为px.
   * @param params: string, json字符串
   *   defaultSymbol: optional, 默认图标.
   *   points: [{}], required.
   *     id: string, required. 编号
   *     type: string, optional. 类型
   *     fields: {}, optional. 属性
   *       点击以后在弹出框中显示fields中的键值对
   *     geometry: object, required. 几何属性.
   *       x: x坐标
   *       y: y坐标
   *     symbol: object, optional. 符号.
   *       会覆盖defaultSymbol.
   *       若defaultSymbol和symbol都没有定义, 则使用默认的图标
   * @sample
   *   map.addPoints('{"defaultSymbol":{"url":"images/RedSphere.png","xoffset":32,"yoffset":32},"points":[{"id":"pt001","type":"police","geometry":{"x":103.8535,"y":36.0342},"symbol":{"url":"images/BlueSphere.png","xoffset":32,"yoffset":32}},{"id":"pt002","type":"police","geometry":{"x":103.8431,"y":36.053}},{"id":"pt003","type":"police","geometry":{"x":103.8541,"y":36.05}}]}');
   * */
  addPoints: function(params) {
    require(["dojo/topic"], function(topic) {
      topic.publish("addPoints", params);
    });
  }
  /************************ Overlay END **************************/
};
