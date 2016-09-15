var gulp = require('gulp')
, stylus = require('gulp-stylus')
, rename = require('gulp-rename')
, minifyCss = require('gulp-minify-css')
, concat = require('gulp-concat')
, paths = {
    src: ['./src/style/**/*.styl']
  , dist: ['./dist/']
  };

gulp.task('gen-css',function(){
  return gulp.src(['./src/style/containers/index.styl'])
  .pipe(stylus({
    'include css': true
  }))
  // .pipe(stylus())
  .pipe(concat('gumga-layout.css'))
  .pipe(gulp.dest('./dist'))
})
gulp.task('watch-css',function(){
  gulp.watch(paths.src,['gen-css'])
});
gulp.task('minify-css',function(){
  return gulp.src(['./dist/gumga-layout.css'])
  .pipe(rename('gumga-layout.min.css'))
  .pipe(minifyCss())
  .pipe(gulp.dest('./dist'))
})
