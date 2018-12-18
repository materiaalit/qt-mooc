const gulp = require('gulp');
const plumber = require('gulp-plumber');
const webpack = require('webpack-stream');
const path = require('path');

const makeWebpackConfig = require('./webpack.config');
const isDevelopment = process.env.NODE_ENV === 'development';

gulp.task('script', () => {
  const webpackConfig = makeWebpackConfig({
    isDevelopment
  });

  let pipeline = gulp.src('./assets/javascripts/index.js');

  if(isDevelopment) {
    pipeline = pipeline.pipe(plumber());
  }

  return pipeline
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./source/javascripts'));
});
