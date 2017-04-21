var gulp = require('gulp');
var gutil = require('gulp-util');
var stylus = require('gulp-stylus');
var nib = require('nib');
var jshint = require('gulp-jshint');
var del = require('del');
var vinylPaths = require('vinyl-paths');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');
var less = require('gulp-less');
var cssmin = require('gulp-cssmin');
var runSequence = require('run-sequence');
var stripCss = require('gulp-strip-css-comments');
var browserSync = require('browser-sync').create();


var paths = {
     js: 'src/js/*.js',
     jsConcatSrc: ['!src/js/scripts.concat.js', 'src/js/*.js'],
     jsDist: 'dist/js',
     jsSrc: 'src/js',
     vendorJS: 'src/vendor/*.js',
     jsConcatFilename: 'scripts.concat.js',
     jsMinFilename: 'scripts.min.js',
     vendorJsMinFilename: 'vendor.min.js',
     css:    'css',
     cssDist: 'dist/css',
     cssSrc: 'src/css',
     cssWatch: 'src/styl/**/*.styl',
     cssWatch2: 'src/styl/**/**/*.styl',
     cssMinFilename: 'main.min.css',
     cssConcatFilename: 'main.concat.css',
     cssStylFilename: '_main-styl.css',
     mainStyl: 'src/styl/main.styl',
     browserSyncFilepath: 'node_modules/browser-sync/index.js',
     browserSyncMinFilename: 'browser-sync-client.min.js',
     jqueryFilepath: 'node_modules/jquery/dist/jquery.min.js',
     jqueryMinFilename: 'jquery.min.js'
   };

var jsVendorFileList = [
		// Boostrap JS -----------
		//'node_modules/bootstrap/js/transition.js',
		//'node_modules/bootstrap/js/alert.js',
		//'node_modules/bootstrap/js/button.js',
		//'node_modules/bootstrap/js/carousel.js',
		//'node_modules/bootstrap/js/collapse.js',
		//'node_modules/bootstrap/js/dropdown.js',
		//'node_modules/bootstrap/js/modal.js',
		//'node_modules/bootstrap/js/tooltip.js',
		//'node_modules/bootstrap/js/popover.js',
		//'node_modules/bootstrap/js/scrollspy.js',
		//'node_modules/bootstrap/js/tab.js',
		//'node_modules/bootstrap/js/affix.js',
        //'node_modules/slick-carousel/slick/slick.js',
        '../node_modules/remodal/dist/remodal.js',
        '../node_modules/rangeslider.js/dist/rangeslider.js',
        'src/vendor/jquery.modal.min.js'
];

function handleError(level, error) {
   gutil.log(error.message);
   if (isFatal(level)) {
      process.exit(1);
   }
}
function onError(error) { handleError.call(this, 'error', error);}
function onWarning(error) { handleError.call(this, 'warning', error);}

gulp.task('default', function(callback) {
  runSequence('clean', 'styles', 'js', 'watch:styles', 'watch:js', callback);
});

gulp.task('build', function(callback) {
  runSequence('clean', 'styles', 'js', callback);
});

gulp.task('clean', function(callback) {
  runSequence('clean:dist', 'clean:src', 'clean:js', callback);
});

gulp.task('styles', function(callback) {
  runSequence('stylus', 'less', callback);
});

gulp.task('js', function(callback) {
  runSequence('lint', 'scripts:main', 'scripts:vendor', 'scripts:jquery', callback);
});

gulp.task('watch:styles', function(){
  return gulp.watch([paths.cssWatch, paths.cssWatch2], ['styles']);
});
gulp.task('watch:js', function(){
  return gulp.watch(paths.js, ['lint', 'scripts:main']);
});

gulp.task('stylus', function(){
  return gulp.src(paths.mainStyl)
    .pipe(stylus({
      import: ['nib'],
      use: [nib()],
      'include css': true
    }))
    .pipe(rename(paths.cssStylFilename))
    .pipe(gulp.dest(paths.cssSrc));
});

gulp.task('less', function(){
    return gulp.src('src/less/main.less')
        .pipe(less())
        .pipe(stripCss())
        .pipe(rename(paths.cssConcatFilename))
        .pipe(gulp.dest(paths.cssSrc))
        .pipe(cssmin())
        .pipe(rename(paths.cssMinFilename))
        .pipe(gulp.dest(paths.cssDist));
});




gulp.task('lint', function() {
  return gulp.src(['gulpfile.js', paths.js])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts:main', function() {
  return gulp.src(paths.jsConcatSrc)
    // Concatenate everything within the JavaScript folder.
    .pipe(concat(paths.jsConcatFilename))
    .pipe(gulp.dest(paths.jsSrc))
    // Strip all debugger code out.
    .pipe(stripDebug())
    // Minify the JavaScript.
    .pipe(uglify())
    .pipe(rename(paths.jsMinFilename))
    .pipe(gulp.dest(paths.jsDist));
});

gulp.task('scripts:vendor', function() {
  return gulp.src(jsVendorFileList)
    // Concatenate everything
    .pipe(concat(paths.jsConcatFilename))
    // Strip all debugger code out.
    .pipe(stripDebug())
    // Minify the JavaScript.
    .pipe(uglify())
    .pipe(rename(paths.vendorJsMinFilename))
    .pipe(gulp.dest(paths.jsDist +'/vendor/'));
});

gulp.task('scripts:jquery', function() {
  return gulp.src(paths.jqueryFilepath)
    // Strip all debugger code out.
    .pipe(stripDebug())
    // Minify the JavaScript.
    .pipe(uglify())
    .pipe(rename(paths.jqueryMinFilename))
    .pipe(gulp.dest(paths.jsDist +'/vendor/'));
});

gulp.task('scripts:browserSync', function() {
  return gulp.src(paths.browserSyncFilepath)
    // Strip all debugger code out.
    .pipe(stripDebug())
    // Minify the JavaScript.
    .pipe(uglify())
    .pipe(rename(paths.browserSyncMinFilename))
    .pipe(gulp.dest(paths.jsDist +'/vendor/'));
});

gulp.task('clean:dist', function () {
    gulp.src(paths.cssDist)
    .pipe(vinylPaths(del));
    return gulp.src(paths.jsDist)
    .pipe(vinylPaths(del));
});
gulp.task('clean:src', function () {
  return gulp.src(paths.cssSrc + "/" + paths.cssStylFilename)
    .pipe(vinylPaths(del))
    .on('error', gutil.log);
});
gulp.task('clean:js', function () {
  return gulp.src(paths.jsSrc + "/" + paths.jsConcatFilename)
    .pipe(vinylPaths(del))
    .pipe(gulp.dest('src'));
});
