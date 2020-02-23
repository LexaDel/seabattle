const gulp = require('gulp');
const prefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const scss = require('gulp-sass');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const rename = require('gulp-rename');

gulp.task('clean', () => {
    return gulp.src('./build/', {allowEmpty: true})
    .pipe(clean());
});

gulp.task('scss', gulp.series('clean', () => {
    return gulp.src('./src/scss/components/*.scss')
    .pipe(scss())
    .pipe(concat('seabattle.css'))
    .pipe(cssnano())
    .pipe(rename({
        basename: "seabattle",
        suffix: ".min",
        extname: ".css"
    }))
    .pipe(gulp.dest('./build/css/'))
}));

gulp.task('scss:watch', function () {
    gulp.watch('./src/scss/**/*.scss', gulp.series('scss'));
});
