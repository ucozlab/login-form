'use strict';

var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    cleanCSS     = require('gulp-clean-css'),
    autoprefixer = require('gulp-autoprefixer'),
    webserver    = require('gulp-webserver');

gulp.task('compile-scss', function() {
    gulp.src('assets/styles/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(cleanCSS({advanced : false}))
        .pipe(gulp.dest('./public/css/'));
});

gulp.task('watch-scss', function() {
    gulp.watch('assets/styles/*.scss', ['compile-scss']);
});

gulp.task('webserver', function() {
    gulp.src('public')
        .pipe(webserver({
            livereload: true,
            fallback: "index.html",
            port: 8080,
            open: true
        }));
});

//Watch task
gulp.task('default', ['webserver', 'compile-scss', 'watch-scss'] );
