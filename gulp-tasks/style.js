const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const styleInject = require("gulp-style-inject");

const cssDist = './dist/css/';

const scssBootstrap = './src/scss/bootstrap/bs.scss';
const scssPagesDir = './src/scss/pages/';
const scssSrcPages = ["index", "result", "details", "images", "info", "graph"];

const jspPagesDir = './src/css-exports/';
const jspPages = ["index", "result", "details", "images", "info"];
const cssExportsDest = "../_includes/css-exports"

const doStyle = ({ input, prod = false }) => {
    const sassConfig = prod ? {
        outputStyle: 'compressed',
        precision: 10
    } : {};
    gulp.src(input)
        .pipe(sourcemaps.init())
        .pipe(sass({
            ...sassConfig,
            includePaths: ['.'],
            onError: console.error.bind(console, 'Sass error:')
        }))
        .pipe(csso())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(cssDist));
};

gulp.task('style:bs', done => {
    doStyle({ input: scssBootstrap });
    done();
});

gulp.task('style:bs:prod', done => {
    doStyle({ input: scssBootstrap, prod: true });
    done();
});

gulp.task('style:pages', done => {
    scssSrcPages.forEach(page => {
        doStyle({ input: `${scssPagesDir}${page}.scss` });
    });
    done();
});

gulp.task('style:pages:prod', done => {
    scssSrcPages.forEach(page => {
        doStyle({ input: `${scssPagesDir}${page}.scss`, prod: true });
    });
    done();
});

gulp.task('injectToJsp', done => {
    jspPages.forEach(page => {
        gulp.src(`${jspPagesDir}${page}.jsp`)
            .pipe(styleInject())
            .pipe(gulp.dest(cssExportsDest));
    });
    done();
});

module.exports = gulp;

