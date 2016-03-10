var destDir = 'client_build';
var srcDir = 'client_src';
var gulp = require('gulp');
var bower = require('gulp-bower');
var gulpif = require('gulp-if');
var concat = require('gulp-concat');
var less = require('gulp-less');
var argv = require('yargs').argv;
var debug = require( 'gulp-debug' );
var clean = require( 'gulp-clean' );
var livereload = require('gulp-livereload');
var csscomb = require('gulp-csscomb');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var runSequence = require('run-sequence');
var minifyCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var htmlhint = require("gulp-htmlhint");
var htmlmin = require("gulp-htmlmin");
var sourcemaps = require('gulp-sourcemaps');
var lazypipe = require('lazypipe');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('copy-static', function () {
    return gulp.src([srcDir+'/**/*.{png,jpg,svg,html}','!node_modules/**','!'+srcDir +'/libs/**'])
        .pipe( gulp.dest(destDir) )
        .pipe(livereload());
});

gulp.task('bower', function () {
    return bower(srcDir+'/libs');
});

gulp.task('css_conc', function () {
    return gulp.src(srcDir+'/**/*.less')
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(destDir+'/static'))
});
gulp.task('css',['css_conc'], function () {
    return gulp.src(destDir+'/static/**/*.css')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(gulpif(argv.prod, minifyCss()))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(destDir+'/static'))
});

gulp.task('libs', function (){
    return gulp.src(srcDir+'/**/*.min.js')
        .pipe(gulp.dest(destDir))
});

gulp.task('clean', function () {
    return gulp.src( destDir+'/*', { read: false } )
        .pipe( clean( { force: true } ) );
});


gulp.task('watch', function () {
    livereload({ start: true })
    gulp.watch(srcDir+'/**/*.html', [ 'copy-static' ] );
    gulp.watch(srcDir+'/**/*.@(png|jpg|svg)', [ 'copy-static' ] );
    gulp.watch(srcDir+'/**/*.@(less)', [ 'css' ] );
    gulp.watch(srcDir+'/**/*.js', [ 'js' ] );
});


gulp.task('csscomb', function () {
    return gulp.src(srcDir+'/**/*.less')
        .pipe(csscomb().on('error', handleError))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

gulp.task('htmlhint', function () {
    return gulp.src(srcDir+"")
});

gulp.task('js', function () {
    var uglifyJSChannel = lazypipe()
        .pipe(sourcemaps.init)
        .pipe(uglify)
        .pipe(sourcemaps.write, "/");
    return gulp.src(srcDir+"/js/**/*.js")
        .pipe(concat("script.js"))
        .pipe(gulpif(argv.prod,uglifyJSChannel()))
        .pipe(gulp.dest(destDir+"/js"))
        .pipe(livereload());
});

gulp.task('jshint', function () {
    return gulp.src(srcDir+'/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter());
});

gulp.task('jscs', function () {
    return gulp.src(srcDir+'/js/**/*.js')
        .pipe(jscs({fix: true}))
        .pipe(jscs.reporter('console'))
        .pipe(gulp.dest(srcDir+'/js'));
});

gulp.task('default', ['libs','build']);
gulp.task('build', function(callback){
    runSequence('copy-static','css','js',callback)
});
gulp.task('style',function(callback){
    runSequence('jshint','jscs',['csscomb','htmlhint'],callback)
});

function handleError(err) {
    console.log(err.toString());
    this.emit('end');
    return this;
};