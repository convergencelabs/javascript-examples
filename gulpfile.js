const gulp = require('gulp');
const del = require('del');
const merge = require('merge2');

gulp.task('default', ['docker-prep'], function() {

});

gulp.task('docker-prep', function () {
  const libTasks = merge(libs.map(lib => gulp.src("node_modules/" + lib + "/**/*").pipe(gulp.dest('docker-build/src/libs/' + lib))));

  return merge(
    [merge([
    gulp.src(['src/**/*']).pipe(gulp.dest('docker-build/src')),
    gulp.src(['docker/**/*']).pipe(gulp.dest('docker-build'))
  ]),
      libTasks]);
});

const libs = [
  "@convergence",
  "ace-builds",
  "chart.js",
  "director",
  "handlebars",
  "jquery",
  "materialize-css",
  "moment",
  "nouislider",
  "todomvc-common",
  "todomvc-app-css"
];
