define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "jimu/BaseWidget"
], function (
  declare,
  lang,
  BaseWidget
) {
  return declare([BaseWidget], {
    postCreate: function () {
      this.inherited(arguments);

    }
  });
});