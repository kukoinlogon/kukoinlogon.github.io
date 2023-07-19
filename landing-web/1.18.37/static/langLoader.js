/* eslint-disable no-restricted-globals */
(function() {
  // handle locale load
  window._KC_LOCALE_DATA = {};
  window._KC_PAGE_LANG_LOADER = function _KC_PAGE_LANG_LOADER(lang, locale) {
    if (!_KC_LOCALE_DATA[lang]) {
      _KC_LOCALE_DATA[lang] = locale;
    }
  };
  var defaultLang = 'en_US';
  var disableLang = {
    lang: 'zh_CN',
    mapTo: 'zh_HK'
  };
  var robot = 'land';
  var href = location.href;
  var origin = location.origin;
  var pathname = location.pathname;
  var webBase = pathname.includes(robot) ? robot : '';
  var allLang = [
    'en_US',
    'ru_RU',
    'ko_KR',
    'ja_JP',
    'pt_PT',
    // 'zh_CN',
    'nl_NL',
    'zh_HK',
    'de_DE',
    'fr_FR',
    'es_ES',
    'vi_VN',
    'tr_TR',
    'it_IT',
    'ms_MY',
    'id_ID',
    'hi_IN',
    'th_TH',
    'bn_BD',
    'pl_PL',
    'fil_PH',
    'ar_AE',
    'ur_PK',
  ];

  var arrToMap = function(langArr) {
    langArr = langArr || [];
    var map = {};
    langArr.forEach(function(lang) {
      if (lang === 'zh_HK') {
        map[lang] = 'zh-hant';
      } else if (lang === 'zh_CN') {
        map[lang] = 'zh-hans';
      } else {
        map[lang] = lang.split('_')[0];
      }
    });
    return map;
  };
  var allLangMap = arrToMap(allLang);
  var search = new URLSearchParams(location.search);
  var getCurrentPathLang = function() {
    if (['/' + robot + '/', '/' + robot, '/', ''].indexOf(pathname) > -1) {
      return {
        queryLang: defaultLang,
        langPathName: ''
      };
    }
    var pathRe = new RegExp('^\\/([^\\/]+)(?:\\/' + webBase + ')?');
    var execResult = pathRe.exec(pathname);
    var langPathName = execResult && execResult[1];
    var queryLang;
    Object.keys(allLangMap).find(function(lg) {
      if (allLangMap[lg] === langPathName) {
        queryLang = lg;
      }
    });
    return {
      queryLang: queryLang || defaultLang,
      langPathName: queryLang ? langPathName : ''
    };
  };
  var getLangFromUrl = function() {
    var queryLang = search.get('lang');
    if (allLang.indexOf(queryLang) > -1) {
      return queryLang;
    }
    return PathLangObj.queryLang;
  };

  var PathLangObj = getCurrentPathLang();
  window.initLang = disableLang.lang === getLangFromUrl() ? disableLang.mapTo : getLangFromUrl();

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.id = 'langPack';
  var langPath = document.currentScript.src.replace('langLoader', 'locales/' + window.initLang);
  script.src = langPath;
  document.head.appendChild(script);
  // handle locale load

  // handle langPath and routerBase
  // webbase initLang can decide routerBase 和 langPath
  var pathLang = allLangMap[window.initLang] === 'en' ? '' : allLangMap[window.initLang];
  // set routerBase
  window.routerBase = pathLang ? `/${pathLang}/${webBase}` : `/${webBase}`;
  // 1.drop lang in query
  search.delete('lang');

  // 2.transform url
  var oldHref = `${origin}/${PathLangObj.langPathName}`;
  var sliceHref = (origin + pathname).replace(oldHref, '');

  var newHref = [origin, pathLang, sliceHref]
    .map(function(str) {
      return str.replace(/^\//, '').replace(/\/$/, '');
    })
    .filter(function(str) {
      return !!str;
    })
    .join('/');

  var hasQuery = search.toString().length > 0;
  newHref = `${newHref}${hasQuery ? `?${search.toString()}` : ''}`;

  if (href !== newHref) {
    // update current url with langPath
    window.history.propertyIsEnumerable({}, '', newHref);
  }
})();
