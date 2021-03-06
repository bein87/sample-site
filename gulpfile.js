'use strict'

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon');

//gulp will start the server from ./server and will watch for changes in this file.
//if the file changed the server will restart.
//it will also monitor for changes any file inside ./public/ folder,
//and will refresh chrome if any file changed.

gulp.task('default', ['browser-sync'], function () {
})

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync.init(null, {
        proxy: "http://localhost:8000",
        files: ["public/**/*.*"],
        port: 7000,
    })
})

gulp.task('nodemon', function (cb) {

    var started = false

    return nodemon({
        script: 'server.js'
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb()
            started = true
        }
    })
})

//to be implemented - gulp running mongod
// var run = require('gulp-run');
// gulp.task('a', function() {
//     return gulp
//     .src('C:\\Program Files\\MongoDB\\bin\\')             // get input files.
//         .pipe(run('mongod --dbpath "C:\\users\\tzach bein\\desktop\\tzach\\db'))     // use awk to extract the even lines.
//         .pipe(gulp.dest('path/to/output'))  // profit.
//
// })