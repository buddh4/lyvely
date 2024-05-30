const gulp = require('gulp');
const del = require('del');

gulp.task('clean', function () {
  return del('dist/**', { force: true });
});

function copyFonts() {
  return gulp
    .src('./src/captcha/utils/*.ttf', { encoding: false })
    .pipe(gulp.dest('./dist/captcha/utils/'));
}

function copyMailTemplates() {
  return gulp.src('./src/mails/templates/*').pipe(gulp.dest('./dist/mails/templates/'));
}

gulp.task('copyAssets', gulp.parallel(copyFonts, copyMailTemplates));
