var gulp        =   require('gulp');
var shell       =   require('gulp-shell');
var runSequence =   require('run-sequence');
var ren         =   require('gulp-rename');

gulp.task("default", function(done){
    runSequence('build:core', 'copy:core', function() {
        done();
    });
});

gulp.task("build:core", shell.task(['gulp --gulpfile ..\\core\\gulpfile-clean.js', 'gulp --gulpfile ..\\core\\gulpfile.js']));
gulp.task("copy:core", function(){
    gulp.src('../core/dist/bundle.d.ts').pipe(ren('core.d.ts')).pipe(gulp.dest('./typing'));
    gulp.src('../core/dist/bundle.js').pipe(ren('core.js')).pipe(gulp.dest('./vendor'));
});