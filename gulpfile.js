'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('lint', function () {
  return gulp.src(['index.js', 'test/*.js', 'gulpfile.js', 'lib/*.js'])
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('test', function () {
  return gulp.src('test/*.js', {read: false}).pipe($.mocha());
});

gulp.task('default', ['lint', 'test']);
