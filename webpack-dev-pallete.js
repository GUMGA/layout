var replace = require("replace");
var gulp = require('gulp');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');

gulp.task('bundle-css', function () {
  var stl = gulp.src(['src/style/containers/index.styl'])
  .pipe(stylus({
    'include css': true
  }))
  .pipe(concat('gumga-layout.css'))
  .pipe(gulp.dest('./dist'));
})

function replaceValue(key, value){
  replace({
      regex: key,
      replacement: value,
      paths: ['./dist/gumga-layout.css'],
      recursive: true,
      silent: true
  });
}

function replaceValues(darkPrimary, primary, lightPrimary, textIcons, accent, primaryText, secundaryText, divider, background){
  replaceValue('darkPrimary_value', darkPrimary);
  replaceValue('primary_value', primary);
  replaceValue('lightPrimary_value', lightPrimary);
  replaceValue('textIcons_value', textIcons);
  replaceValue('accent_value', accent);
  replaceValue('primaryText_value', primaryText);
  replaceValue('secundaryText_value', secundaryText);
  replaceValue('divider_value', divider);
  replaceValue('background_value', background);
};

gulp.start('bundle-css', function(){
  startReplace();
});

function startReplace(){
  setTimeout(() => {
    replaceValues('#0097A7', '#00BCD4', '#B2EBF2', '#FFFFFF', '#009688', '#212121', '#757575', '#EAEAEA', '#ECEFF1');
  }, 3000)
}