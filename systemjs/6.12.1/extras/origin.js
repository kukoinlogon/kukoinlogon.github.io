(function () {
  (function (global) {
    var systemJSPrototype = global.System.constructor.prototype;
    var exitingCreateScript = systemJSPrototype.createScript;

    systemJSPrototype.createScript = function (url) {
      if (global.location) {
        url = url + "?__kcorigin=" + global.location.host;
      }
      var script = exitingCreateScript.call(this, url);
      return script;
    };
  })(typeof self !== "undefined" ? self : global);
})();
