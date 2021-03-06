// Well, it's pretty stupid to have a Gulpfile, but Warlock doesn't exist yet!
// FIXME(jdm): Migrate to Warlock.

var gulp = require( 'gulp' );
var istanbul = require( 'gulp-istanbul' );
var mocha = require( 'gulp-mocha' );
var coveralls = require( 'gulp-coveralls' );
var jshint = require( 'gulp-jshint' );
var stylish = require( 'jshint-stylish' );

gulp.task( 'lint', function () {
  return gulp.src([ 'lib/**/*.js', 'gulpfile.js' ])
    .pipe( jshint() )
    .pipe( jshint.reporter( stylish ) )
    .pipe( jshint.reporter( 'fail' ) );
});

gulp.task( 'test', [ 'lint' ], function ( cb ) {
  gulp.src([ 'lib/**/*.js', '!lib/**/*.spec.js' ])
    .pipe( istanbul() )
    .on( 'finish', function () {
      gulp.src([ 'lib/**/*.spec.js' ])
        .pipe( mocha({ reporter: 'spec', slow: 50 }) )
        .pipe( istanbul.writeReports({ reporters: [ 'html', 'text-summary', 'text', 'lcov' ] }) )
        .on( 'end', cb );
    });
});

gulp.task( 'coveralls', [ 'test' ], function () {
  return gulp.src([ 'coverage/lcov.info' ])
    .pipe( coveralls() );
});

gulp.task( 'ci', [ 'test', 'coveralls' ] );

gulp.task( 'default', [ 'test' ] );

