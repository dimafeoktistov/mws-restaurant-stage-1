const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const babel = require('gulp-babel');

gulp.task(
  'default',
  ['copy-html', 'copy-images', 'styles', 'scripts-main', 'scripts-page'],
  function() {
    gulp.watch('src/sass/**/*.scss', ['styles']);
    gulp.watch('src/*.html', ['copy-html']);
    gulp.watch('src/js/main/*.js', ['scripts-main']);
    gulp.watch('src/js/page/*.js', ['scripts-page']);
    gulp.watch('./dist/index.html').on('change', browserSync.reload);
    gulp.watch('src/sass/**/*.scss').on('change', browserSync.reload);

    browserSync.init({
      server: './dist'
    });
  }
);

gulp.task('scripts-main', function() {
  gulp
    .src('src/js/main/*.js')
    .pipe(concat('restaurant_main.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-page', function() {
  gulp
    .src('src/js/page/*.js')
    .pipe(concat('restaurant_info.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dist-main', function() {
  gulp
    .src('src/js/main/*.js')
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['env']
      })
    )
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dist-page', function() {
  gulp
    .src('src/js/page/*.js')
    .pipe(sourcemaps.init())
    .pipe(
      babel({
        presets: ['env']
      })
    )
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copy-html', function() {
  gulp.src('src/*.html').pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
  gulp.src('src/img/*').pipe(gulp.dest('dist/img'));
});

gulp.task('styles', function() {
  gulp
    .src('src/sass/**/*.scss')
    .pipe(
      sass({
        outputStyle: 'compressed'
      }).on('error', sass.logError)
    )
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions']
      })
    )
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('minimize', () =>
  gulp
    .src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
);
