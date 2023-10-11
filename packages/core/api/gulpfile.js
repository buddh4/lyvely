var gulp = require('gulp');
var del = require('del');

gulp.task('clean', function () {
  return del('dist/**', { force: true });
});

// Define your first task
function copyFonts() {
  return gulp.src('./src/captchas/utils/*.ttf').pipe(gulp.dest('./dist/captchas/utils/'));
}

// Define your second task
function copyMailTemplates() {
  return gulp.src('./src/mails/templates/*').pipe(gulp.dest('./dist/mails/templates/'));
}

gulp.task('copyAssets', gulp.parallel(copyFonts, copyMailTemplates));
