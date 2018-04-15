const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const merge2 = require('merge2');
const runSequence = require('run-sequence');

const paths = {
    dist: 'dist/',
    src: 'src/',
};

function getLintAutoFixFlag() {
    return process.argv.indexOf('--autofix') !== -1;
}

let fail = true;

function handleError(err) {
    console.log(err.toString());
    if (!fail) {
        this.emit('end');
    }
}

gulp.task('clean-dist', () => {
    return del([`${paths.dist}/**/*`]);
});

gulp.task('compile', () => {
    const distFullPath = __dirname + '/' + paths.dist;
    console.log(distFullPath);

    const tsResult = gulp.src([
        `${paths.src}/js/**/*`,
        `${paths.src}/ts/**/*`,
        ],{
            base: paths.src
        })
        .pipe(sourcemaps.init())
        .pipe(ts.createProject('tsconfig.json')())
        .once('error', handleError);

    return merge2(
        tsResult
            .dts
            .pipe(gulp.dest(paths.dist)),

        tsResult
            .js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(paths.dist))
    );
});

gulp.task('data', function () {
    return gulp.src([`${paths.src}/data/**/*`], {
        base: paths.src
    }).pipe(gulp.dest(paths.dist));
});

gulp.task('bundle', ['clean-dist'], (cb) => {
    runSequence('compile', 'data', cb);
});
