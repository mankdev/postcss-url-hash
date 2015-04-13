/**
 * Created by rebel on 4/13/15.
 */
'use strict';

var fs = require('fs');
var crypto = require('crypto');
var log = console.log.bind(console, 'Hash store: ');


function hashStore() {

  var self = this;
  self.store = {};

  self.getHash = function (path) {
    log('going to get hash for ' + path);
    if (!self.store[path]) {
      log('path ' + path + ' not in store, going to calculate');

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

