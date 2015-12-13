var gulp = require('gulp');
var shell = require('shelljs');

gulp.task('default', function() {
    command = "tsc index.ts --module commonjs"
    console.log('running', command)
    shell.exec(command)
});
