"use strict";

// -- Dependencies -------------------------------------------------------------

var gulp = require('gulp');
var gutil = require('gulp-util');
var stylus = require('gulp-stylus');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var header = require('gulp-header');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var pkg = require('./package.json');

// -- Files --------------------------------------------------------------------

var assets = "public/";
var src = {
  styl: [ "source/styles/normalize.styl", "source/styles/app.*.styl" ],
  scripts: "source/scripts/app.*.js"
};

var banner = [
  "/**" +
  " * <%= pkg.name %>" +
  " * @version v<%= pkg.version %>" +
  " */" +
  ""
].join("\n");

// -- Tasks --------------------------------------------------------------------

gulp.task('styl', function() {
  gulp.src(src.styl)
    .pipe(concat(pkg.name + ".styl"))
    .pipe(stylus({ compress: true, errors: true }))
    .pipe(autoprefixer())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest(assets + "/css"));
  return;
});

gulp.task('browserify', function() {
  return browserify('./source/scripts/app.main.js')
    .bundle()
    .pipe(source('bundle.js'))
    //.pipe(buffer())
    //.pipe(uglify())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('./public/js'));
});

gulp.task('watch', function() {
  gulp.watch(src.styl, [ "styl" ]);
  gulp.watch(src.scripts, [ "browserify" ]);
  return;
});

gulp.task('build', function() {
  gulp.start([ "styl", "browserify" ]);
  return;
});

gulp.task('server', function() {
  nodemon({
    script: "server.js",
    ext: "js",
    ignore: ".git"
  });
});

// -- Runs ---------------------------------------------------------------------

gulp.task('default', function() {
  gulp.start([ "build", "watch", "server" ]);
  return;
});
