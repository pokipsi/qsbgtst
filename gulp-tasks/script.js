const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');

const jsPagesDir = './src/js/';
const jsDist = './dist/js';
const jsSrcPages = ["index", "utils/utils"];
// const jsSrcPages = ["index"];

const doScript = ({ input, prod = false }) => {
    const preUglify = () => {
        return browserify({
            entries: [jsPagesDir + input]
        })
            .transform(babelify, {
                presets: ['@babel/env']
            })
            .bundle()
            .pipe(source(input))
            .pipe(rename({
                'extname': '.min.js'
            }))
            .pipe(buffer())
            .pipe(sourcemaps.init({
                loadMaps: true
            }))
    };
    const uglifyJs = inputStream => {
        return prod ? inputStream.pipe(uglify()) : inputStream;
    };
    uglifyJs(preUglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(jsDist));
};

gulp.task('build-js:prod', done => {
    jsSrcPages.forEach(page => {
        doScript({ input: `${page}.js`, prod: true });
    });
    done();
});

gulp.task('build-js', done => {
    jsSrcPages.forEach(page => {
        doScript({ input: `${page}.js` });
    });
    done();
});

module.exports = gulp;