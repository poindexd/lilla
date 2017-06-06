const fs = require('fs');
const gulp = require('gulp');
const connect = require('gulp-connect');
const pug = require('gulp-pug');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const data = require('gulp-data');

// Start dev server
gulp.task('server', function() {
  connect.server({
    port: 1004,
    root: 'dist',
    livereload: true
  });
});

gulp.task('sass', function () {
  return gulp.src('sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('dist/css'))
    .pipe(connect.reload());
});

gulp.task('pug', function(){
	return gulp.src('pug/**/*.pug')
		.pipe(data(function(file){
			var re = /.*templates[\/|\\](.*)[\/|\\].*/;
			var name = file.path.replace(re, "$1");
			var path = './pug/templates/' + name + '/data.json';
      return (fs.existsSync(path)) ? require(path) : {};
		}))
		.pipe(pug())
		.pipe(gulp.dest('dist/pug'))
		.pipe(connect.reload());
});

gulp.task('js', function(){
	return gulp.src('js/**/*.js')
		.pipe(uglify({
			showStack: true
		}).on('error', console.error.bind(console)))
		.pipe(gulp.dest('dist/js'))
		.pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('pug/**/*.pug', ['pug']);
  gulp.watch('js/**/*.js', ['js']);
  gulp.watch('sass/**/*.scss', ['sass']);
});

gulp.task('default', [
	'pug',
	'js',
	'sass',
	'server',
	'watch'
]);