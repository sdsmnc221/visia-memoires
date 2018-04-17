const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const connect = require('gulp-connect');
const cleancss = require('gulp-cleancss');
const sass = require('gulp-sass');
const gulp = require('gulp');
const gutil = require('gulp-util');
const minify = require('gulp-minify');
const watch = require('gulp-sane-watch');

const htmlIn = ['dev/*.html', 'dev/**/*.html', 'dev/*.ico', 'dev/*.pdf'],
      htmlOut = 'dist',
      cssIn = ['dev/styles/*.scss', 'dev/styles/**/*.scss', 'dev/libs/*.css', 'dev/libs/**/*.css'],
      cssOut = 'dist/styles',
      cssDist = ['dist/styles/*.css', 'dist/styles/**/*.css'],
      cssWatch = ['dev/styles/*.scss', 'dev/styles/**/*.scss', 'dev/libs/*.scss', 'dev/libs/**/*.scss'],
      jsIn = ['dev/scripts/*.js', 'dev/scripts/**/*.js'],
      jsOut = 'dist/scripts',
      libsStylesB = ['dev/libs/normalize.css'
                ],
      libsScriptsB = [
                'dev/libs/jquery.min.js',
                'dev/libs/sweetalert.min.js',
                ],
      libsIn = [
                'dev/libs/normalize.css',
                'dev/libs/jquery.min.js',
                'dev/libs/sweetalert.min.js'
      ]
      libsOut = 'dist/libs',
      imgIn = ['dev/images/*.+(jpg|jpeg|gif|png|svg)', 'dev/images/**/*.+(jpg|jpeg|gif|png|svg)'],
      imgOut = 'dist/images';

//GULP UTIL - LOGGING MESSAGES
// gulp.task('log', function() {
//     gutil.log(gutil.colors.inverse('toto'));
// });

//HTML
gulp.task('html', function() {
    gulp.src(htmlIn)
        .pipe(gulp.dest(htmlOut))
        .pipe(connect.reload());
});

//COMPILE SASS
gulp.task('sass', function() {
    gulp.src(cssIn)
        .pipe(sass({style: 'expanded'}))
            .on('error', gutil.log)
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'ie >= 9', 'Android >= 2.3', 'ios >= 7'],
        }))
            .on('error', gutil.log)
        .pipe(cleancss())
        .pipe(gulp.dest(cssOut))
        .pipe(connect.reload());
});

//LIBS
gulp.task('libs', function() {
    gulp.src(libsIn)
        .pipe(gulp.dest(libsOut))
        .pipe(connect.reload());
});

//IMAGES
gulp.task('images', function() {
    gulp.src(imgIn)
        .pipe(gulp.dest(imgOut))
        .pipe(connect.reload());
});

//BUNDLE JS SCRIPTS
gulp.task('bundle', function() {
    gulp.src(libsScriptsB)
    .pipe(concat('bundle.index.js'))
    .pipe(minify({ext: {min: '.min.js'}}))
    .pipe(gulp.dest(libsOut));
});

//COMPILE ES6
gulp.task('babel', function() {
    gulp.src(jsIn)
        .pipe(babel())
            .on('error', gutil.log)
        .pipe(minify({ext: {min: '.min.js'}}))
        .pipe(gulp.dest(jsOut))
        .pipe(connect.reload());
});


//LIVE RELOAD
gulp.task('live', function() {
    connect.server({
        root: 'dist',
        livereload: true
    })
});

//WATCH FOR CHANGES
gulp.task('watch', function() {
    // gulp.watch(htmlIn, ['html']);
    // gulp.watch(cssWatch, ['sass']);
    // gulp.watch(jsIn, ['babel']);
    watch(htmlIn, function() {
        gulp.start('html');  
    });
    watch(cssWatch, function() {
        gulp.start('sass');  
    });
    watch(jsIn, function() {
        gulp.start('babel');  
    });
})

//PUT EVERYTHING TOGETHER
gulp.task('default', ['libs', 'bundle', 'html', 'sass', 'babel', 'live', 'watch']);
// gulp.task('default', ['libs', 'images', 'html', 'sass', 'babel', 'live', 'watch']);