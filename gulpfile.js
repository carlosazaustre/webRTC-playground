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
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var transform = require('vinyl-transform');
var browserify = require('browserify');
var pkg = require('./package.json');

// -- Files --------------------------------------------------------------------

var assets = "public/";
var src = {
  styl: [
    "source/styles/normalize.styl",
    "source/styles/app.*.styl"
  ],
  scripts: [
    "source/scripts/*.js"
  ]
};

var banner = [
  "/**" +
  " * <%= pkg.name %>" +
  " * @version v<%= pkg.version %>" +
  " */" +
  ""
].join("\n");

// -- Helpers ------------------------------------------------------------------

var getBundleName = function() {
  return pkg.version + '.' + pkg.name + '.' + 'min';
}

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
  return browserify('./source/scripts/main.js')
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./public/js'));
});
/*gulp.task('javascript', function() {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });

  return gulp.src(source.scripts)
    .pipe(browserified)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js'));
});
*/
gulp.task('watch', function() {
  gulp.watch(src.styl, [ "styl" ]);
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
