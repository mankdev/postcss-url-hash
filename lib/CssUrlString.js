'use strict';

var CSSUrlString = function (string) {

  this.before = '';
  var startIndex = string.indexOf('url(');
  if (startIndex > 0) {
    this.before = string.substring(0, startIndex);
    string = string.substr(startIndex);
  }

  this.after = '';
  var endIndex = string.indexOf(')');
  if (endIndex < string.length - 1) {
    this.after = string.substr(endIndex + 1);
    string = string.substring(0, endIndex + 1);
  }

  this.value = string.slice(4, -1);
  this.quotes = this.value[0];
  if (this.quotes === '\'' || this.quotes === '"') {
    this.value = string.slice(1, -1);
  } else {
    this.quotes = '';
  }
};

CSSUrlString.prototype.toString = function () {
  if (!this.quotes && (this.value.indexOf('\'') !== -1 || this.value.indexOf('"') !== -1)) {
    this.quotes = '\'';
  }
  if (this.quotes === '"') {
    this.quotes = '\'';
  }
  return this.before + 'url(' + this.quotes + this.value + this.quotes + ')' + this.after;
};

module.exports = CSSUrlString;
