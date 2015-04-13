'use strict';

var fs = require('fs');
var crypto = require('crypto');


function hashStore() {

  var self = this;
  self.store = {};

  self.getHash = function (path) {
    if (!self.store[path]) {
      self.store[path] = calculateHash(path);
    }

    return self.store[path];
  };

  function calculateHash(path) {
    var data, md5;
    md5 = crypto.createHash('md5');
    data = fs.readFileSync(path);
    md5.update(data);
    return md5.digest('hex').slice(-10);
  }
}

module.exports = hashStore;

