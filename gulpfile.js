'use strict';

const gulp = require('gulp'),
    tsc = require('gulp-typescript'),
    webpack = require('webpack-stream'),
    merge = require('merge2'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    babel = require('gulp-babel');



gulp.task('typescript', () => {
    const project = tsc.createProject('./tsconfig.json', {
        declaration: true
    });
    
    let result = project.src()
    .pipe(tsc(project))
    
    let js = result.js
    .pipe(babel({
        presets: ['es2015']
        }))
    .pipe(gulp.dest('./lib/'));
    
    let dts = result.dts.pipe(gulp.dest('./lib'));
    
    return merge([js,dts]);
    
});

gulp.task('typescript:amd', () => {
    const project = tsc.createProject('./tsconfig.json', {
        declaration: false,
        module: 'amd'
    });
    let result = project.src()
    .pipe(tsc(project))
    
    let js = result.js
    .pipe(babel({
        presets: ['es2015']
        }))
    .pipe(gulp.dest('./dist/amd'));
    
   
    
    return js;
    
});

gulp.task('uglify', ['bundle'], () => {
    return gulp.src('./dist/orange.dom.js')
    .pipe(uglify())
    .pipe(rename('orange.dom.min.js'))
    .pipe(gulp.dest('dist'));
})

gulp.task('default', ['bundle', 'uglify', 'typescript:amd']);

gulp.task('bundle', ['typescript'], () => {
    
    return gulp.src('./lib/index.js')
    .pipe(webpack({
        
        output: {
            libraryTarget: 'umd',
            library: ['orange','dom'],
            filename: 'orange.dom.js'
        },
       
        externals: {
            orange: "orange"
        }
    }))
    .pipe(gulp.dest('dist'))
    
});



gulp.task('watch', () => {
    return gulp.watch('./src/**/*.ts', ['bundle']);
});