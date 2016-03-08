'use strict'

/* eslint node/no-unpublished-require: 0 */
let gulp = require('gulp')
let $ = require('gulp-load-plugins')()

let unitTestPaths = [
  'test/**/*_test.js'
]

gulp.task('default', ['unitTest'], () => {
  let nodemonIgnore = ['node_modules/**', 'migrations/**', 'sample_data/**', 'coverage/**']

  $.nodemon({
    script: 'app/server.js',
    ext: 'js',
    ignore: nodemonIgnore
  })
  .on('restart', () => {
    console.log('Restarting...')
  })
})

gulp.task('lint', () => {
  let formatter = require('eslint-path-formatter')
  let lintPaths = [
    '**/*.js', '!node_modules/**', '!sample_data/**', '!coverage/**'
  ]

  return gulp.src(lintPaths)
    // Cannot use arrow function in this case
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

gulp.task('test', ['coverage', 'watchJs'])

gulp.task('watchJs', () => {
  let watchPaths = [
    '**/*.js', '!node_modules/**', '!migrations/**', '!sample_data/**', '!coverage/**'
  ]

  $.watch(watchPaths, {read: false}, () => {
    gulp.start('coverage')
  })
})

gulp.task('unitTest', ['lint'], () => {
  return gulp.src(unitTestPaths, {read: false})
    .pipe(mochaPipe())
})

gulp.task('coverageSetup', () => {
  let coverageJsPaths = [
    '**/*.js', '!node_modules/**', '!migrations/**', '!sample_data/**', '!coverage/**', '!test/**', '!gulpFile.js'
  ]

  return gulp.src(coverageJsPaths)
    // Covering files
    .pipe($.istanbul({includeUntested: true}))
    // Force `require` to return covered files
    .pipe($.istanbul.hookRequire())
})

gulp.task('coverage', ['coverageSetup', 'lint'], () => {
  return gulp.src(unitTestPaths, {read: false})
    .pipe(mochaPipe())
    // Creating the reports after tests ran
    .pipe($.istanbul.writeReports())
    // Enforce a coverage of at least 90%
    .pipe($.istanbul.enforceThresholds({ thresholds: { global: 10 } }))
})

function mochaPipe () {
  return $.mocha({ reporter: 'spec', growl: true })
}
