'use strict';

var CSSUrlString = function (string) {
  var log = console.log.bind(console, 'cssUrl: ');
  log(string);
  this.value = string.slice(4, -1);
  log(this.value);
  this.quotes = this.value[0];
  if (this.quotes === '\'' || this.quotes === '"') {
    this.value = string.slice(1, -1);
  } else {
    this.quotes = '';
  }
  log(this.value);

};

CSSUrlString.prototype.toString = function () {
  if (!this.quotes && (this.value.indexOf('\'') !== -1 || this.value.indexOf('"') !== -1)) {
    this.quotes = '\'';
  }
  if (this.quotes === '"') {
    this.quotes = '\'';
  }
  return 'url(' + this.quotes + this.value + this.quotes + ')';
};

module.exports = CSSUrlString;
