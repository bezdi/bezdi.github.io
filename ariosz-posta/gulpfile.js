"use strict";

// Load plugins https://gist.github.com/jeromecoupe/0b807b0c1050647eb340360902c3203a
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cp = require("child_process");
const cssnano = require("cssnano");
const del = require("del");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
// const webpack = require("webpack");
// const webpackconfig = require("./webpack.config.js");
// const webpackstream = require("webpack-stream");

//Load plugins by bezdi
const sourcemaps = require('gulp-sourcemaps');
const svgSprite = require('gulp-svg-sprite');





// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./_site"
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}


// Optimize Images
function images() {
    return gulp
      .src("./assets/img/**/*")
      .pipe(newer("./_site/assets/img"))
      .pipe(
        imagemin([
          imagemin.gifsicle({ interlaced: true }),
          imagemin.jpegtran({ progressive: true,
            optimizationLevel: 10
        }),
          imagemin.optipng({ optimizationLevel: 10 }),
          imagemin.svgo({
            plugins: [
              {
                removeViewBox: false,
                collapseGroups: true
              }
            ]
          })
        ])
      )
      .pipe(gulp.dest("./_site/assets/img"));
  }

// CSS task
function css() {
    return gulp
        .src("./assets/scss/**/*.scss")
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "expanded" }))
        .on('error', function (err) {
            console.log(err.toString());

            this.emit('end');
        })
        .pipe(gulp.dest("./_site/assets/css/"))
        .pipe(rename({ suffix: ".min" }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest("./_site/assets/css/"))
        .pipe(browsersync.stream());
}



// tasks by bezdi

//svg sprite config
var baseDir = './assets/svgs-to-sprite',   // <-- Set to your SVG base directory -------source
    svgGlob = '**/*.svg',       // <-- Glob to match your SVG files
    outDir = './_site/assets/img/svg-sprite',     // <-- Main output directory
    config = {
        "dest": "./asd",
        "log": "info",
        "mode": {
            "symbol": {
                "sprite": "./symbolsprite.svg",
                // "inline": false,
                "example": true,
                "dest": "./"
            }
        }
    };
//svg to sprite
function sprite() {
    return gulp.src(svgGlob, { cwd: baseDir })
        .pipe(plumber())
        .pipe(svgSprite(config)).on('error', function (error) { console.log(error); })
        .pipe(gulp.dest(outDir))
}

// create folders
function folders() {
    return gulp
        .src('*.*', { read: false })
        .pipe(gulp.dest('./_site'))
        .pipe(gulp.dest('./assets'))
        .pipe(gulp.dest('./assets/scss'))
        .pipe(gulp.dest('./assets/img'))
        .pipe(gulp.dest('./assets/js'))
        .pipe(gulp.dest('./assets/svgs-to-sprite'));
}

//normalize
function normalize() {
    return gulp
        .src('./node_modules/normalize.css/normalize.css')
        .pipe(rename({ extname: ".scss" }))
        .pipe(rename({ prefix: "_" }))
        .pipe(gulp.dest('./assets/scss'));
}
//jquery
function jquery() {
    return gulp
        .src('./node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('./assets/js'));
}



// Watch files
function watchFiles() {
    gulp.watch("./assets/svg/**/*.svg", sprite);
    gulp.watch("./assets/scss/**/*.scss", css);
    gulp.watch("./_site/**/*", browserSyncReload);
    gulp.watch("./assets/img/**/*", images);
}



// define complex tasks
// const build = gulp.series(clean, gulp.parallel(css, images, jekyll, js));
const build = gulp.series(gulp.parallel(css));
const watch = gulp.parallel(watchFiles, browserSync);



// export tasks
exports.css = css;
exports.build = build;
exports.watch = watch;
exports.default = build;

// export tasks by bezdi
exports.sprite = sprite;
exports.folders = folders;
exports.normalize = normalize;
exports.jquery = jquery;

