var gulp         = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'),
    csscomb      = require('gulp-csscomb'),
    csso         = require('gulp-csso'),
    header       = require('gulp-header'),
    plumber      = require('gulp-plumber'),
    rename       = require('gulp-rename'),
    sass         = require('gulp-ruby-sass'),
    browserSync  = require('browser-sync'),
    reload       = browserSync.reload;

var pkg = require('./package.json');
var banner = ['/**',
              ' * Placeholder v<%= pkg.version %> - <%= pkg.description %>',
              ' * @link <%= pkg.homepage %>',
              ' * @copyright 2015-<%= new Date().getFullYear() %> <%= pkg.author %>',
              ' * @license <%= pkg.license %>',
                ' */',
                ''].join('\n');


// sass
gulp.task('sass', function(){
    return sass('sass/'+pkg.name+'.sass', { sourcemap: true })
          .pipe(plumber())
          .pipe(autoprefixer({
            browsers: ['Android >= 2.1',
                       'Chrome >= 21',
                       'Edge >= 12',
                       'Explorer >= 7',
                       'Firefox >= 17',
                       'Opera >= 12.1',
                       'Safari >= 6.0'],
            cascade: false}))
          .pipe(csscomb())
          .pipe(rename({basename: pkg.name}))
          .pipe(header(banner, { pkg : pkg } ))
          .pipe(gulp.dest('css'))
          .pipe(browserSync.stream())
          .pipe(csso())
      	  .pipe(rename({suffix: '.min'}))
          .pipe(header(banner, { pkg : pkg } ))
      	  .pipe(gulp.dest('css'))
          .pipe(browserSync.stream());
});

// serve
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: "."
        },
        notify: false
    });
});

// Watch
gulp.task('watch', function(){
    gulp.watch('sass/**/*', ['sass']);
    gulp.watch("*.html").on("change", reload);
});

gulp.task('default', ['sass', 'serve', 'watch']);
