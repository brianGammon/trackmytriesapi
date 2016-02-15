/* eslint node/no-unpublished-require: 0 */
var gulp = require('gulp')
var $ = require('gulp-load-plugins')()
var nodemonIgnore = ['node_modules/**', 'migrations/**', 'sample_data/**', 'coverage/**']
var unitTestPaths = [
  'test/**/*_test.js'
]
var lintPaths = [
  '**/*.js', '!node_modules/**', '!sample_data/**', '!coverage/**'
]
var watchPaths = [
  '**/*.js', '!node_modules/**', '!migrations/**', '!sample_data/**', '!coverage/**'
]
var coverageJsPaths = [
  '**/*.js', '!node_modules/**', '!migrations/**', '!sample_data/**', '!coverage/**', '!test/**', '!gulpFile.js'
]

function mochaPipe () {
  return $.mocha({ reporter: 'spec', growl: true })
}

gulp.task('default', ['unitTest'], function () {
  $.nodemon({
    script: 'app/server.js',
    ext: 'js',
    ignore: nodemonIgnore
  })
  .on('restart', function () {
    console.log('Restarting...')
  })
})

gulp.task('lint', function () {
  var formatter = require('eslint-path-formatter')

  return gulp.src(lintPaths)
    .pipe($.plumber({errorHandler: function (err) {
      $.notify.onError({
        title: 'Error linting at ' + err.plugin,
        subtitle: ' ', // overrides defaults
        message: err.message.replace(/\u001b\[.*?m/g, ''),
        sound: ' ' // overrides defaults
      })(err)

      this.emit('end')
    }}))
    .pipe($.eslint())
    .pipe($.eslint.formatEach(formatter))
    .pipe($.eslint.failOnError())
})

gulp.task('test', ['unitTest', 'watchJs'])

gulp.task('watchJs', function () {
  $.watch(watchPaths, {read: false}, function () {
    gulp.start('unitTest')
  })
})

gulp.task('unitTest', ['lint'], function () {
  return gulp.src(unitTestPaths, {read: false})
    .pipe(mochaPipe())
})

gulp.task('coverageSetup', function () {
  return gulp.src(coverageJsPaths)
    // Covering files
    .pipe($.istanbul({includeUntested: true}))
    // Force `require` to return covered files
    .pipe($.istanbul.hookRequire())
})

gulp.task('coverage', ['coverageSetup'], function () {
  return gulp.src(unitTestPaths)
    .pipe(mochaPipe())
    // Creating the reports after tests ran
    .pipe($.istanbul.writeReports())
    // Enforce a coverage of at least 90%
    .pipe($.istanbul.enforceThresholds({ thresholds: { global: 10 } }))
})
