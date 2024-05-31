const gulp = require('gulp');
const del = require('del');

gulp.task('clean', function () {
  return del(['dist/**', './src/adapters/dayjs/locales/*'], { force: true });
});

gulp.task('copyLocales', function () {
  return gulp
    .src('./node_modules/dayjs/locale/*.js')
    .pipe(gulp.dest('./src/adapters/dayjs/locales'));
});
