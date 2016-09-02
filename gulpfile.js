var gulp = require('gulp')
, stylus = require('gulp-stylus')
, rename = require('gulp-rename')
, minifyCss = require('gulp-minify-css')
, concat = require('gulp-concat')
, paths = {
    src: ['./src/style/palettes/*.styl','./src/style/containers/*.styl']
  , dist: ['./dist/']
  };

gulp.task('minify-css',function(){
  return gulp.src(paths.src)
  .pipe(stylus())
  .pipe(rename('gumga-layout.min.css'))
  .pipe(minifyCss())
  .pipe(gulp.dest('./dist'))
})