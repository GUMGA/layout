var gulp = require('gulp')

var stylus = require('gulp-stylus')
var rename = require('gulp-rename')
var minify = require('gulp-minify-css')
var concat = require('gulp-concat')

var browserify = require('browserify')
var watchify = require('watchify')
var babelify = require('babelify')

var fs = require('fs')
var path = require('path')
var source = require('vinyl-source-stream')
var buffer = require('vinyl-buffer')
var merge = require('utils-merge')

var rename = require('gulp-rename')
var uglify = require('gulp-uglify')
var sourcemaps = require('gulp-sourcemaps')

var livereload = require('gulp-livereload')

/* nicer browserify errors */
var gutil = require('gulp-util')
var chalk = require('chalk')

var liveserver = require('gulp-live-server');
var server = liveserver.static()

function map_error(err) {
  if (err.fileName) {
    // regular error
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.fileName.replace(__dirname + '/src/components/', ''))
      + ': '
      + 'Line '
      + chalk.magenta(err.lineNumber)
      + ' & '
      + 'Column '
      + chalk.magenta(err.columnNumber || err.column)
      + ': '
      + chalk.blue(err.description))
  } else {
    // browserify error..
    gutil.log(chalk.red(err.name)
      + ': '
      + chalk.yellow(err.message))
  }

  this.end()
}

gulp.task('serve', function() {
  //1. serve with default settings 
  var server = liveserver.static(); 
  server.start();
 
  //use gulp.watch to trigger server actions(notify, start or stop) 
  gulp.watch(['dist/*.css','dist/*.js', 'index.html'], function (file) {
    server.notify.apply(server, [file]);
  });
});

gulp.task('watchify', function () {
  var args = merge(watchify.args, { debug: true })
  var bundler = watchify(browserify('./src/components/index.js', args)).transform(babelify, { /* opts */ })
  bundle_js(bundler)
  bundler.on('update', function () {
    gutil.log(chalk.yellow('JS files updated.'))
    bundle_js(bundler)
  })
  gulp.watch(['./src/style/**/*.styl'], ['bundle_css'])
})

gulp.task('bundle_css', function () {
  gutil.log(chalk.yellow('CSS files updated.'))
  bundle_css()
})

function bundle_css() {
  return gulp.src(['./src/style/containers/index.styl'])
  .pipe(stylus({
    'include css': true
  }))
  // .pipe(stylus())
  .pipe(concat('gumga-layout.css'))
  .pipe(gulp.dest('./dist'))
  // .pipe(livereload())
}

gulp.task('minify_css', minify_css)

function minify_css() {
  return gulp.src(['./dist/gumga-layout.css'])
  .pipe(rename('gumga-layout.min.css'))
  .pipe(minify())
  .pipe(gulp.dest('./dist'))
}


gulp.task('bundle_js', bundle_js)

function bundle_js(bundler) {
  return bundler.bundle()
    .on('error', map_error)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist'))
    .pipe(rename('gumga-layout.min.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
      // capture sourcemaps from transforms
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'))
    // .pipe(livereload())
}

gulp.task('export', build)
function build() {
  var dest,
      dir = (gutil.env.dest) ? gutil.env.dest : 'gumga-layout' 
  if (path.isAbsolute(dir)) {
    dest = dir
  } else {
    var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
    dest = home + '/' + dir
  }
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest)
  }
  var destIcons = dest + '/icons/'
  fs.mkdirSync(destIcons)
  gulp.src('./bower_components/material-design-icons/iconfont/*.{eot,woff2,woff,ttf}')
    .pipe(gulp.dest(destIcons))
  gulp.src('./dist/*.min.{js,css}')
    .pipe(gulp.dest(dest))
}

// Without watchify
gulp.task('browserify', function () {
  var bundler = browserify('./src/components/index.js', { debug: true }).transform(babelify, {/* options */ })

  return bundle_js(bundler)
})

// Without sourcemaps
gulp.task('browserify-production', function () {
  var bundler = browserify('./src/components/index.js').transform(babelify, {/* options */ })

  return bundler.bundle()
    .on('error', map_error)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(rename('gumga-layout.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist'))
})

gulp.task('production', function() {
  
})