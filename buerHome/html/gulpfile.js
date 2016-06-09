
var gulp = require('gulp');

var imagemin = require('gulp-imagemin');
var cssnano = require('gulp-cssnano');
var uglify = require('gulp-uglify');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var sass  = require('gulp-sass');

gulp.task('image-min', () =>
    gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
);

gulp.task('css', function() {
    return gulp.src('./css/*.css')
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));
});

gulp.task('js',function(){
    return gulp.src('./js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('html', function () {
    return gulp.src('index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cssnano({zIndex:false}))) 
        .pipe(gulp.dest('dist'));
});

gulp.task('build',['image-min','html']);

gulp.task('sass',()=>{
    gulp.src('css/resume.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif('*.css', cssnano({zIndex:false})))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('watch',()=>{
    gulp.watch('css/resume.scss',['sass']);
});


