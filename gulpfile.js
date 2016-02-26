var gulp = require('gulp');
var shell = require('shelljs');

gulp.task('server', function() {
    command = "tsc index.ts --module commonjs"
    console.log('running', command)
    shell.exec(command)
});

gulp.task('app', function() {
    command = "tsc ./front-end/app/main.ts --module system --target es5 --experimentalDecorators --moduleResolution node --sourceMap"
    console.log('running', command)
    shell.exec(command)
})
