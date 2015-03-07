"use strict";

// -- Dependencies -------------------------------------------------------------

var gulp = require('gulp');
var gutil = require("gulp-util");
var stylus = require("gulp-stylus");
var nodemon = require("gulp-nodemon");
var concat = require("gulp-concat");
var autoprefixer = require("gulp-autoprefixer");
var header = require("gulp-header");
var pkg = require("./package.json");

// -- Files --------------------------------------------------------------------

var assets = "public/";
var source = {
  styl: [
    "source/styles/normalize.styl",
    "source/styles/app.*.styl"
  ]
};

var banner = [
  "/**" +
  " * <%= pkg.name %>" +
  " * @version v<%= pkg.version %>" +
  " */" +
  ""
].join("\n");

// -- Tasks --------------------------------------------------------------------

gulp.task("styl", function() {
  gulp.src(source.styl)
    .pipe(concat(pkg.name + ".styl"))
    .pipe(stylus({ compress: true, errors: true }))
    .pipe(autoprefixer())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest(assets + "/css"));
  return;
});

gulp.task("watch", function() {
  gulp.watch(source.styl, [ "styl" ]);
  return;
});

gulp.task("build", function() {
  gulp.start([ "styl" ]);
  return;
});

gulp.task("server", function() {
  nodemon({
    script: "server.js",
    ext: "js",
    ignore: ".git"
  });
});

// -- Runs ---------------------------------------------------------------------

gulp.task("default", function() {
  gulp.start([ "build", "watch", "server" ]);
  return;
});
