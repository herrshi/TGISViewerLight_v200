define([
  "dojo/_base/lang",
  "dojo/_base/html",
  "dojo/_base/array",
  "dojo/on",
  "dojo/Deferred"
], function(lang, html, array, on, Deferred) {
  var mo = {};

  var widgetProperties = [
    "inPanel",
    "hasLocale",
    "hasStyle",
    "hasConfig",
    "hasUIFile",
    "hasSettingPage",
    "hasSettingUIFile",
    "hasSettingLocale",
    "hasSettingStyle",
    "keepConfigAfterMapSwitched",
    "isController",
    "hasVersionManager",
    "isThemeWidget",
    "supportMultiInstance"
  ];

  mo.getPositionStyle = function(_position) {
    var style = {};
    if (!_position) {
      return style;
    }
    var position = lang.clone(_position);

    var ps = [
      "left",
      "top",
      "right",
      "bottom",
      "width",
      "height",
      "padding",
      "paddingLeft",
      "paddingRight",
      "paddingTop",
      "paddingBottom"
    ];
    for (var i = 0; i < ps.length; i++) {
      var p = ps[i];
      if (typeof position[p] === "number") {
        style[p] = position[p] + "px";
      } else if (typeof position[p] !== "undefined") {
        style[p] = position[p];
      } else {
        if (p.substr(0, 7) === "padding") {
          style[p] = 0;
        } else {
          style[p] = "auto";
        }
      }
    }

    if (typeof position.zIndex === "undefined") {
      //set zIndex=auto instead of 0, because inner dom of widget may need to overlay other widget
      //that has the same zIndex.
      style.zIndex = "auto";
    } else {
      style.zIndex = position.zIndex;
    }
    return style;
  };

  mo.processUrlInAppConfig = function(url) {
    if (!url) {
      return;
    }
    if (url.startWith("data:") || url.startWith("http") || url.startWith("/")) {
      return url;
    } else {
      return window.path + url;
    }
  };

  //if no beforeId, append to head tag, or insert before the id
  mo.loadStyleLink = function(id, href, beforeId) {
    var def = new Deferred(),
      styleNode,
      styleLinkNode;

    var hrefPath = require(mo.getRequireConfig()).toUrl(href);
    //the cache will use the baseUrl + module as the key
    if (require.cache["url:" + hrefPath]) {
      //when load css file into index.html as <style>, we need to fix the
      //relative path used in css file
      var cssStr = require.cache["url:" + hrefPath];
      var fileName = hrefPath.split("/").pop();
      var rPath = hrefPath.substr(0, hrefPath.length - fileName.length);
      cssStr = addRelativePathInCss(cssStr, rPath);
      if (beforeId) {
        styleNode = html.create(
          "style",
          {
            id: id,
            type: "text/css"
          },
          html.byId(beforeId),
          "before"
        );
      } else {
        styleNode = html.create(
          "style",
          {
            id: id,
            type: "text/css"
          },
          document.getElementsByTagName("head")[0]
        );
      }

      if (styleNode.styleSheet && !styleNode.sheet) {
        //for IE
        styleNode.styleSheet.cssText = cssStr;
      } else {
        styleNode.appendChild(html.toDom(cssStr));
      }
      def.resolve("load");
      return def;
    }

    if (beforeId) {
      styleLinkNode = html.create(
        "link",
        {
          id: id,
          rel: "stylesheet",
          type: "text/css",
          href: hrefPath
        },
        html.byId(beforeId),
        "before"
      );
    } else {
      styleLinkNode = html.create(
        "link",
        {
          id: id,
          rel: "stylesheet",
          type: "text/css",
          href: hrefPath
        },
        document.getElementsByTagName("head")[0]
      );
    }

    // def.resolve("load");
    on(styleLinkNode, "load", function() {
      def.resolve("load");
    });

    //for the browser which doesn't fire load event
    //safari update documents.stylesheets when style is loaded.
    var ti = setInterval(function() {
      var loadedSheet;
      if (
        array.some(document.styleSheets, function(styleSheet) {
          if (
            styleSheet.href &&
            styleSheet.href.substr(
              styleSheet.href.indexOf(href),
              styleSheet.href.length
            ) === href
          ) {
            loadedSheet = styleSheet;
            return true;
          }
        })
      ) {
        try {
          if (
            !def.isFulfilled() &&
            ((loadedSheet.cssRules && loadedSheet.cssRules.length) ||
              (loadedSheet.rules && loadedSheet.rules.length))
          ) {
            def.resolve("load");
          }
          clearInterval(ti);
        } catch (err) {
          //In FF, we can"t access .cssRules before style sheet is loaded,
          //but FF will emit load event. So, we catch this error and do nothing,
          //just wait for FF to emit load event and go on.
        }
      }
    }, 50);
    return def;
  };

  function addRelativePathInCss(css, rpath) {
    var m = css.match(/url\([^)]+\)/gi),
      i,
      m2;

    if (m === null || rpath === "") {
      return css;
    }
    for (i = 0; i < m.length; i++) {
      m2 = m[i].match(/(url\(["|"]?)(.*)((?:["|"]?)\))/i);
      if (m2.length >= 4) {
        var path = m2[2];
        if (!rpath.endWith("/")) {
          rpath = rpath + "/";
        }
        css = css.replace(m2[1] + path + m2[3], m2[1] + rpath + path + m2[3]);
      }
    }
    return css;
  }

  mo.getRequireConfig = function() {
    /* global jimuConfig */
    if (jimuConfig) {
      var packages = [];
      if (jimuConfig.widgetsPackage) {
        packages = packages.concat(jimuConfig.widgetsPackage);
      }
      if (jimuConfig.themesPackage) {
        packages = packages.concat(jimuConfig.themesPackage);
      }
      if (jimuConfig.configsPackage) {
        packages = packages.concat(jimuConfig.configsPackage);
      }
      return {
        packages: packages
      };
    } else {
      return {};
    }
  };

  /////////////widget and theme manifest processing/////////
  mo.widgetJson = (function() {
    var ret = {};

    ret.addManifest2WidgetJson = function(widgetJson, manifest) {
      lang.mixin(widgetJson, manifest.properties);
      widgetJson.name = manifest.name;
      // if(!widgetJson.label){
      //   widgetJson.label = manifest.label;
      // }
      widgetJson.label = manifest.label;
      widgetJson.manifest = manifest;
      widgetJson.isRemote = manifest.isRemote;
      if (widgetJson.isRemote) {
        widgetJson.itemId = manifest.itemId;
      }
      if (manifest.featureActions) {
        widgetJson.featureActions = manifest.featureActions;
      }

      if (!widgetJson.icon) {
        widgetJson.icon = manifest.icon;
      }

      if (!widgetJson.thumbnail) {
        widgetJson.thumbnail = manifest.thumbnail;
      }

      widgetJson.folderUrl = manifest.folderUrl;
      widgetJson.amdFolder = manifest.amdFolder;
    };

    ret.removeManifestFromWidgetJson = function(widgetJson) {
      //we set property to undefined, instead of delete them.
      //The reason is: configmanager can"t hanle delete properties for now
      if (!widgetJson.manifest) {
        return;
      }
      for (var p in widgetJson.manifest.properties) {
        widgetJson[p] = undefined;
      }
      widgetJson.name = undefined;
      widgetJson.label = undefined;
      widgetJson.featureActions = undefined;
      widgetJson.manifest = undefined;
    };
    return ret;
  })();

  mo.manifest = (function() {
    var ret = {};

    function addThemeManifestProperties(manifest) {
      manifest.panels.forEach(function(panel) {
        panel.uri = "panels/" + panel.name + "/Panel.js";
      });

      manifest.styles.forEach(function(style) {
        style.uri = "styles/" + style.name + "/style.css";
      });

      manifest.layouts.forEach(function(layout) {
        layout.uri = "layouts/" + layout.name + "/config.json";
        layout.icon = "layouts/" + layout.name + "/icon.png";
        layout.RTLIcon = "layouts/" + layout.name + "/icon_rtl.png";
      });
    }

    function addWidgetManifestProperties(manifest) {
      //because tingo db engine doesn"t support 2D, 3D property, so, change here
      if (typeof manifest["2D"] !== "undefined") {
        manifest.support2D = manifest["2D"];
      }
      if (typeof manifest["3D"] !== "undefined") {
        manifest.support3D = manifest["3D"];
      }

      if (
        typeof manifest["2D"] === "undefined" &&
        typeof manifest["3D"] === "undefined"
      ) {
        manifest.support2D = true;
      }

      delete manifest["2D"];
      delete manifest["3D"];

      if (typeof manifest.properties === "undefined") {
        manifest.properties = {};
      }

      if (typeof manifest.properties.isController === "undefined") {
        manifest.properties.isController = false;
      }
      if (typeof manifest.properties.isThemeWidget === "undefined") {
        manifest.properties.isThemeWidget = false;
      }
      if (typeof manifest.properties.hasVersionManager === "undefined") {
        manifest.properties.hasVersionManager = false;
      }

      widgetProperties.forEach(function(p) {
        if (typeof manifest.properties[p] === "undefined") {
          manifest.properties[p] = true;
        }
      });
    }

    ret.addManifestProperties = function(manifest) {
      if (!manifest.icon) {
        manifest.icon =
          manifest.folderUrl + "images/icon.png?wab_dv=" + window.deployVersion;
      }

      if (!manifest.thumbnail) {
        manifest.thumbnail = manifest.folderUrl + "images/thumbnail.png";
      }

      if (manifest.category === "theme") {
        addThemeManifestProperties(manifest);
      } else {
        addWidgetManifestProperties(manifest);
      }
    };

    ret.processManifestLabel = function(manifest, locale) {
      var langCode = locale.split("-")[0];
      manifest.label =
        (manifest.i18nLabels &&
          (manifest.i18nLabels[locale] ||
            manifest.i18nLabels[langCode] ||
            manifest.i18nLabels.defaultLabel)) ||
        manifest.label ||
        manifest.name;
      if (manifest.layouts) {
        array.forEach(manifest.layouts, function(layout) {
          var key = "i18nLabels_layout_" + layout.name;
          layout.label =
            (manifest[key] &&
              (manifest[key][locale] || manifest[key].defaultLabel)) ||
            layout.label ||
            layout.name;
        });
      }
      if (manifest.styles) {
        array.forEach(manifest.styles, function(_style) {
          var key = "i18nLabels_style_" + _style.name;
          _style.label =
            (manifest[key] &&
              (manifest[key][locale] || manifest[key].defaultLabel)) ||
            _style.label ||
            _style.name;
        });
      }
    };

    ret.addI18NLabel = function(manifest) {
      var def = new Deferred();
      if (manifest.i18nLabels) {
        def.resolve(manifest);
        return def;
      }
      manifest.i18nLabels = {};

      if (manifest.properties && manifest.properties.hasLocale === false) {
        def.resolve(manifest);
        return def;
      }

      //theme or widget label
      var nlsFile;
      if (manifest.isRemote) {
        nlsFile = manifest.amdFolder + "nls/strings.js";
      } else {
        nlsFile = manifest.amdFolder + "nls/strings";
      }
      require(["dojo/i18n!" + nlsFile], function(localeStrings) {
        var localesStrings = {};
        localesStrings[window.dojoConfig.locale] = localeStrings;
        addI18NLabelToManifest(manifest, null, localesStrings);
        def.resolve(manifest);
      });

      return def;
    };
    return ret;
  })();

  mo.getUriInfo = function(uri) {
    var pos,
      firstSeg,
      info = {},
      amdFolder;

    pos = uri.indexOf("/");
    firstSeg = uri.substring(0, pos);

    //config using package
    amdFolder = uri.substring(0, uri.lastIndexOf("/") + 1);
    info.folderUrl = window.path + amdFolder;
    info.amdFolder = amdFolder;

    info.url = info.folderUrl; //for backward compatibility

    if (/^http(s)?:\/\//.test(uri) || /^\/\//.test(uri)) {
      info.isRemote = true;
    }

    return info;
  };

  return mo;
});
