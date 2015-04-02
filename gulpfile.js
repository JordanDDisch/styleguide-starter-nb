//load plugins
var gulp             = require('gulp'),
    $                = require('gulp-load-plugins')(),
    sass             = require('gulp-sass'),
    autoprefixer     = require('gulp-autoprefixer'),
    clean            = require('gulp-clean'),
    del              = require('del'),
    minifyCSS        = require('gulp-minify-css'),
    include          = require('gulp-include'),
    browserSync      = require('browser-sync'),
    reload           = browserSync.reload;



// Build styleguide.
gulp.task('styleguide', ['clean:styleguide'], $.shell.task([
  // kss-node [source folder of files to parse] [destination folder] --template [location of template files]
  'kss-node <%= source %> <%= destination %> --template <%= template %>'
], {
    templateData: {
      source:       'scss',
      destination:  'dist',
      template:     'template'
    }
  }
));


// Clean styleguide directory.
gulp.task('clean:styleguide', del.bind(null, ['dist/*.html', 'public'], {force: true}));


gulp.task('clean-css', function () {
    return gulp.src('dist/css', {read: false})
        .pipe(clean());
});

// Static server
gulp.task('watch', function() {
    browserSync({
        server: {
            baseDir: "./dist"
        }
    });

    gulp.watch(['scss/**/*.scss', 'scss/**/*.html'], ['styles', 'styleguide']);

});

gulp.task('styles', function() {
    return gulp.src('scss/styles.scss')
        .pipe(include())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/css')).pipe(reload({stream: true}));
});

gulp.task('default', function(){
    gulp.start('styleguide', 'styles');
});


