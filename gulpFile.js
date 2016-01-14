var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    ignorePaths = ['node_modules/**', 'migrations/**', 'sample_data/**', 'coverage/**'];
    unitTestPaths = [
      'test/**/*_test.js'
    ],
    jsPaths = [
      '**/*.js', '!node_modules/**', '!migrations/**', '!sample_data/**', '!coverage/**'
    ],
    coverageJsPaths = [
      '**/*.js', '!node_modules/**', '!migrations/**', '!sample_data/**', '!coverage/**', '!test/**', '!gulpFile.js'
    ];

function mochaPipe() {
  return $.mocha({ reporter: 'spec', growl: true });
}

gulp.task('default', ['unitTest'], function() {
  $.nodemon({
    script: 'app/server.js',
    ext: 'js',
    ignore: ignorePaths
  })
  .on('restart',function(){
    console.log('Restarting...');
  });
});

gulp.task('test', ['unitTest', 'watchJs']);

gulp.task('watchJs', function() {
  $.watch(jsPaths, {read: false}, function() {
    gulp.start('unitTest');
  });
});

gulp.task('unitTest', function() {
  return gulp.src(unitTestPaths, {read: false})
    .pipe(mochaPipe());
});

gulp.task('coverageSetup', function () {
  return gulp.src(coverageJsPaths)
    // Covering files
    .pipe($.istanbul({includeUntested:true}))
    // Force `require` to return covered files
    .pipe($.istanbul.hookRequire());
});

gulp.task('coverage', ['coverageSetup'], function () {
  return gulp.src(unitTestPaths)
    .pipe(mochaPipe())
    // Creating the reports after tests ran
    .pipe($.istanbul.writeReports())
    // Enforce a coverage of at least 90%
    .pipe($.istanbul.enforceThresholds({ thresholds: { global: 10 } }));
});
