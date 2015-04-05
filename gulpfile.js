var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var reactify = require('reactify');
var sass = require('gulp-sass');

gulp.task('browserify', function() {
  var b = browserify();
  b.transform(reactify);
  b.add('./src/js/main.js');
  return b.bundle()
    .pipe(source('main.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('css', function() {
  gulp.src('./src/css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('dist/css'));
});
    

gulp.task('copy', function() {
  gulp.src('src/index.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['browserify', 'copy', 'css']);

gulp.task('watch', function() {
  gulp.watch('src/**', ['default']);
});
