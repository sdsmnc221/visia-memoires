const gulp = require('gulp'),
      gutil = require('gulp-util'),autoprefixer = require('gulp-autoprefixer'),
      browserify = require('browserify'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer');
      babelify = require('babelify'),
      babel = require('gulp-babel'),
      cleancss = require('gulp-cleancss'),
      sass = require('gulp-sass'),
      minify = require('gulp-minify'),
      concat = require('gulp-concat'),
      connect = require('gulp-connect'),
      watch = require('gulp-sane-watch'),
      watchify = require('watchify');

const imgIn = ['dev/images/*.+(jpg|jpeg|gif|png|svg)', 'dev/images/**/*.+(jpg|jpeg|gif|png|svg)'],
      imgOut = 'dist/images',
      htmlIn = ['dev/*.html', 'dev/**/*.html', 'dev/*.ico', 'dev/*.pdf'],
      htmlOut = 'dist',
      cssIn = ['dev/styles/*.scss', 'dev/styles/**/*.scss'],
      cssOut = 'dist/styles',
      cssWatch = ['dev/styles/*.scss', 'dev/styles/**/*.scss', 'dev/libs/*.scss', 'dev/libs/**/*.scss'],
      jsWatch = ['dev/scripts/*.js', 'dev/scripts/**/*.js', 'dev/libs/*.js', 'dev/libs/**/*.js'],
      jsIn = 'dev/scripts/app.js',
      jsOut = 'dist/scripts',
      libsStyles = 'dev/libs/*.css',
      libsScripts = ['dev/libs/fetch.js',
                     'dev/libs/leaflet.js',
                     'dev/libs/GpPluginLeaflet.js',
                     'dev/libs/papaparse.min.js'],
      libsWatch = 'dev/libs',
      libsOut = 'dist/libs',
      dataIn = ['dev/data/*', 'dev/data/**/*']
      dataOut = 'dist/data';


//DATA
gulp.task('data', function() {
    gulp.src(dataIn)
        .pipe(gulp.dest(dataOut))
        .pipe(connect.reload());
});

//IMAGES
gulp.task('images', function() {
    gulp.src(imgIn)
        .pipe(gulp.dest(imgOut))
        .pipe(connect.reload());
});

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
    gulp.src(libsStyles)
        .pipe(concat('vendor.css'))
        .pipe(cleancss())
        .pipe(gulp.dest(libsOut))
        .pipe(connect.reload());
});

gulp.task('css', ['libs', 'sass']);


//COMPILE ES6
// gulp.task('babel', function() {
//     gulp.src(jsIn)
//         .pipe(babel())
//             .on('error', gutil.log)
//         .pipe(minify({ext: {min: '.min.js'}}))
//         .pipe(gulp.dest(jsOut))
//         .pipe(connect.reload());
// });

//BUNDLE & TRANSPILE JS
gulp.task('vendor', function() {
    gulp.src(libsScripts)
    .pipe(concat('vendor.js'))
    .pipe(minify({ext: {min: '.min.js'}}))
    .pipe(gulp.dest(libsOut))
    .pipe(connect.reload());
});

gulp.task('browserify', function() {
    return browserify({
            entries: jsIn,
            debug: true
        })
        .transform('babelify', {"presets": ["es2015"], "plugins": ["syntax-async-functions", "transform-regenerator", 'transform-runtime']})
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(minify({ext: {min: '.min.js'}}))
        .pipe(gulp.dest(jsOut))
        .pipe(connect.reload());
});

gulp.task('bundle', ['vendor', 'browserify']);


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
    watch(dataIn, function() {
        gulp.start('data');  
    });
    watch(imgIn, function() {
        gulp.start('images');  
    });
    watch(htmlIn, function() {
        gulp.start('html');  
    });
    watch(cssWatch, function() {
        gulp.start('sass');  
    });
    watch(jsWatch, function() {
        gulp.start('browserify');  
    });
    watch(libsWatch, function() {
        gulp.start('libs', 'vendor');  
    });
})

//PUT EVERYTHING TOGETHER
gulp.task('default', ['data', 'images', 'html', 'css', 'bundle', 'live', 'watch']);
// gulp.task('default', ['libs', 'images', 'html', 'sass', 'babel', 'live', 'watch']);