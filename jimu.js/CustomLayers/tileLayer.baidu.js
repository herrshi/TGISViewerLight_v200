//请引入 proj4.js 和 proj4leaflet.js
L.CRS.Baidu = new L.Proj.CRS(
  "EPSG:3395",
  "+proj=merc +lon_0=0 +k=1 +x_0=1440 +y_0=255 +datum=WGS84 +units=m +no_defs",
  {
    resolutions: (function() {
      level = 19;
      var res = [];
      res[0] = Math.pow(2, 18);
      for (var i = 1; i < level; i++) {
        res[i] = Math.pow(2, 18 - i);
      }
      return res;
    })(),
    origin: [0, 0],
    bounds: L.bounds([20037508.342789244, 0], [0, 20037508.342789244])
  }
);

L.tileLayer.baidu = function(option) {
  option = option || {};

  var layer;
  var subdomains = "0123456789";
  switch (option.layer) {
    //单图层
    case "vec":
    default:
      layer = L.tileLayer(
        option.url + "&styles=" + (option.bigFont ? "ph" : "pl"),
        {
          name: option.name,
          subdomains: subdomains,
          tms: true
        }
      );
      break;
    case "img_d":
      layer = L.tileLayer(option.url, {
        name: option.name,
        subdomains: subdomains,
        tms: true
      });
      break;
    case "img_z":
      layer = L.tileLayer(
        option.url + "&styles=" + (option.bigFont ? "sh" : "sl"),
        {
          name: option.name,
          subdomains: subdomains,
          tms: true
        }
      );
      break;

    case "custom": //Custom 各种自定义样式
      //可选值：dark,midnight,grayscale,hardedge,light,redalert,googlelite,grassgreen,pink,darkgreen,bluish
      option.customid = option.customid || "midnight";
      layer = L.tileLayer(option.url + "&customid=" + option.customid, {
        name: option.name,
        subdomains: "012",
        tms: true
      });
      break;

    case "time": //实时路况
      var time = new Date().getTime();
      layer = L.tileLayer(option.url + "&time=" + time, {
        name: option.name,
        subdomains: subdomains,
        tms: true
      });
      break;

    //合并
    case "img":
      layer = L.layerGroup([
        L.tileLayer.baidu({
          name: "底图",
          layer: "img_d",
          bigFont: option.bigFont
        }),
        L.tileLayer.baidu({
          name: "注记",
          layer: "img_z",
          bigFont: option.bigFont
        })
      ]);
      break;
  }
  return layer;
};
