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
  }
};