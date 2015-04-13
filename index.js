'use strict';
var log = console.log.bind(console, 'Url-hash: ');

var postcss = require('postcss');
var url = require('url');
var fs = require('fs');
var path = require('path');
var HashStore = require('./lib/hash-store');
var CSSUrlString = require('./lib/CssUrlString');
var hashStore = new HashStore();

module.exports = postcss.plugin('postcss-url-hash', function (options) {
  var self = this;
  self.store = {};
  self.options = options || {};

  self.options.baseUrl = self.options.baseUrl || '/';

  if (self.options.basePath) {
    // Convert the provided base path to an absolute form
    self.options.basePath = path.resolve(self.options.basePath);
  } else {
    // Set to an absolute path to the working directory
    self.options.basePath = process.cwd();
  }


  self.resolveDataUrl = function (assetStr) {
    var hash, resolvedPath, assetUrl;

    assetUrl = url.parse(assetStr);

    // Find out where an asset really is
    resolvedPath = self.resolvePath(assetUrl.pathname);


    hash = hashStore.getHash(resolvedPath);

    if (assetUrl.search) {
      assetUrl.search += '&hash=' + hash;
    } else {
      assetUrl.search = '?hash=' + hash;
    }

    return url.format(assetUrl);
  };

  self.matchPath = function (assetPath) {
    var isFound, matchingPath;

    matchingPath = path.join(self.options.basePath, assetPath);
    log('matching path for %s is %s', assetPath, matchingPath);
    isFound = fs.existsSync(matchingPath);

    if (!isFound) {
      var exception = new Error('Asset not found or unreadable: ' + assetPath);
      exception.name = 'ENOENT';
      throw exception;
    }

    return matchingPath;
  };

  self.resolvePath = function (pathname) {
    var assetPath = decodeURI(pathname);
    log('assetPath = %o', assetPath);
    return self.matchPath(assetPath);
  };

  self.processDecl = function (decl) {
    if (decl.value && decl.value.indexOf('url(') > -1) {
      var cssUrlString = new CSSUrlString(decl.value);
      log(cssUrlString);
      log(cssUrlString.toString());

      cssUrlString.value = self.resolveDataUrl(cssUrlString.value);

      log(cssUrlString.toString());

      decl.value = cssUrlString.toString();
    }
  };

  return function (styles) {
    log('##########  START ###########');
    log(self.options);
    styles.eachDecl(self.processDecl);

  };
});
