var gulp = require('gulp');
var prefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var scss = require('gulp-sass');


gulp.task('scss', () => {
    return gulp.src('./scss/style.scss')
    .pipe(scss())
    .pipe(prefixer())
    .pipe(gulp.dest('./src/css/'))
})

gulp.task('clear', () => {
    return gulp.src('./src/css/style.css', {allowEmpty: true})
    .pipe(clean());
})