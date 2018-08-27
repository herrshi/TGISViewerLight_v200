define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/query",
  "dojo/on",
  "jimu/BaseWidget"
], function(declare, lang, query, on, BaseWidget) {
  return declare([BaseWidget], {
    baseClass: "jimu-widget-POISearch",

    postCreate: function() {
      this.inherited(arguments);
      // console.log(document.getElementById("btnPoiSearch"));

      // $("#btnPoiSearch").on("click", function () {
      //   console.log("click");
      // });
    },

    startup: function() {
      this.inherited(arguments);
      $("." + this.baseClass).css("zIndex", 600);
      $("#btnPoiSearch").click(lang.hitch(this, this.onBtnPoiSearchClick));
      $("#btnPoiClear").click(lang.hitch(this, this.onBtnPoiClearClick));
    },

    onBtnPoiSearchClick: function() {
      var searchText = $("#txtSearchText").val();
      if (searchText === "") {
        return;
      }
      var url = this.config.url;
      url = url.replace(/{gisServer}/i, this.appConfig.map.gisServer);
      url = url.replace(/{key}/i, this.appConfig.map.key);
      url = url.replace(/{searchText}/i, searchText);
      console.log(url);

      $("#divResult").css("display", "block");
    },

    onBtnPoiClearClick: function() {
      $("#txtSearchText").val("");
      $("#divResult").css("display", "none");
    }
  });
});
