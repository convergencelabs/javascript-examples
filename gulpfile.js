const gulp = require('gulp');
const del = require('del');
const merge = require('merge2');

const clean = () => {
  return del['docker-build'];
}


const prop = () => {
  const libTasks = merge(
    libs.map(lib => gulp.src("node_modules/" + lib + "/**/*")
      .pipe(gulp.dest('docker-build/src/libs/' + lib))
    )
  );

  return merge(
    [merge([
      gulp.src(['src/**/*']).pipe(gulp.dest('docker-build/src')),
      gulp.src(['docker/**/*']).pipe(gulp.dest('docker-build'))
    ]), libTasks]
  );
}


const copyLibs = () => {
  return merge(
    libs.map(lib => gulp.src("node_modules/" + lib + "/**/*")
      .pipe(gulp.dest('source/libs/' + lib))

    )
  );
}


module.exports = {
  clean,
  copyLibs
};
