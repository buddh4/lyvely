const gulp = require('gulp');
const del = require('del');
const path = require('path');

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

function copyTranslations() {
  return gulp.src('./src/*/locales/**/*').pipe(
    gulp.dest(function (file) {
      // Get the folder structure after 'src' and replace it with 'dist'
      const relativePath = path.relative('./src', file.base);
      return path.join('./dist', relativePath);
    })
  );
}

gulp.task('copyAssets', gulp.parallel(copyFonts, copyMailTemplates, copyTranslations));
