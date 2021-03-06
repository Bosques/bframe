var gulp        =   require("gulp");
var runSequence =   require('run-sequence');

var reg         =   require('gulp-task-register');
reg([
    'clean'     // cleanup dist directory
    , 'pre'     // pre-build tasks (eg. build external projects and import the declarations)
    , 'vendor'  // eg. jQuery, BabylonJs
    , 'page'    // copy html files
    , 'asset'   // copy image, fonts, etc.
    , 'scss'    // compile scss files
    , 'ts'      // typescript compile & bundle
    , 'publish' // deploy dist files elsewhere
    , '_host'   // dev web server
    , '_watch:ts'       // watch typescript source code (gulpfile-watch.js->ts)
    , '_watch:vendor'   // watch vender source code update (gulpfile-watch.js->vendor)
    , '_watch:html'     // watch html page update (gulpfile-watch.js->html)
    , '_watch:asset'    // watch asset update (gulpfile-watch.js->asset)
    , '_watch:pre'      // watch pre-build source code change (eg. build core project)
]);
gulp.task("default", function(done){
    runSequence('pre','vendor', 'page', 'asset', 'scss', 'ts', function() {
        done();
    });
});
gulp.task("prod", function(done){
    // runSequence('clean', 'vendor', 'ts:prod', 'publish', function() {
    //     done();
    // });
});
