'use strict';

var postcss = require('postcss');
var url = require('url');
var fs = require('fs');
var path = require('path');
var HashStore = require('./lib/hash-store');
var CSSUrlString = require('./lib/CssUrlString');
var hashStore = new HashStore();
var log = function () {
};

module.exports = postcss.plugin('postcss-url-hash', function (options) {
  options = options || {};

  options.baseUrl = options.baseUrl || '/';

  if (options.basePath) {
    // Convert the provided base path to an absolute form
    options.basePath = path.resolve(options.basePath);
  } else {
    // Set to an absolute path to the working directory
    options.basePath = process.cwd();
  }

  if (options.debug) {
    log = console.log.bind(console, 'Url-hash: ');
  }

  function resolveDataUrl(assetStr) {
    var hash, resolvedPath, assetUrl;

    assetUrl = url.parse(assetStr);

    if (assetUrl.protocol || assetUrl.host || assetUrl.pathname.indexOf('//') === 0) {
      return assetStr;
    }

    // Find out where an asset really is
    resolvedPath = resolvePath(assetUrl.pathname);

    hash = hashStore.getHash(resolvedPath);

    if (assetUrl.search) {
      assetUrl.search += '&hash=' + hash;
    } else {
      assetUrl.search = '?hash=' + hash;
    }

    return url.format(assetUrl);
  }

  function matchPath(assetPath) {
    var isFound, matchingPath;

    matchingPath = path.join(options.basePath, assetPath);
    log('matching path for ' + assetPath, ' is ', matchingPath);
    isFound = fs.existsSync(matchingPath);

    if (!isFound) {
      var exception = new Error('Asset not found or unreadable: ' + assetPath);
      exception.name = 'ENOENT';
      throw exception;
    }

    return matchingPath;
  }

  function resolvePath(pathname) {
    var assetPath = decodeURI(pathname);
    log('assetPath = ', assetPath);
    return matchPath(assetPath);
  }

  function processDecl(decl) {
    if (decl.value && decl.value.indexOf('url(') > -1 && decl.value.indexOf('url(data:') === -1) {
      var cssUrlString = new CSSUrlString(decl.value);
      log(cssUrlString);
      log(cssUrlString.toString());

      try {
        cssUrlString.value = resolveDataUrl(cssUrlString.value);
      } catch(e) {
        if (options.silent) return;
        throw e;
      }

      log(cssUrlString.toString());

      decl.value = cssUrlString.toString();
    }
  }

  return function (styles) {
    log('##########  START ###########');
    log(options);
    styles.eachDecl(processDecl);

  };
});
