var
  //TGISViewer所在的url
  path = null;
  //项目配置文件
  projectConfig = null;
  //全部加载完成以后的回调
  loadFinishCallback= null;

var TMap = {
  createNew: function (options, divId, callback) {
    window.path = addSlash(options.viewerUrl);
    window.projectConfig = options.config;
    window.loadFinishCallback = callback;

    var leafletCssLink = document.createElement("link");
    leafletCssLink.setAttribute("rel", "stylesheet");
    leafletCssLink.setAttribute("type", "text/css");
    leafletCssLink.setAttribute("href", path + "libs/leaflet/leaflet.css");
    document.head.appendChild(leafletCssLink);

    var leafletScript = document.createElement("script");
    leafletScript.setAttribute("type", "text/javascript");
    leafletScript.setAttribute("src", path + "libs/leaflet/leaflet.js");
    document.body.appendChild(leafletScript);
    //

    return TMap;

    function addSlash(url) {
      if (url.substr(url.length - 1, url.length) !== "/") {
        url += "/";
      }
      return url;
    }
  }
};