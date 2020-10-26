const exec = require('child_process').exec;

const gulp = require('gulp');
const copydir = require('copy-dir');
const rmdir = require('rmdir');

var requireDir = require('require-dir');
requireDir('./gulp-tasks');

gulp.task('copyHtml', done => {
    gulp.src('src/html/*.html')
        .pipe(gulp.dest('dist/html')
    );
    done();
});

gulp.task('copyFonts', done => {
    gulp.src('src/fonts/*')
        .pipe(gulp.dest('dist/fonts')
    );
    done();
});

gulp.task('copyImages', done => {
    gulp.src('src/img/*')
        .pipe(gulp.dest('dist/img')
    );
    done();
});

const createOutput = (rev, onSuccess) => {
    //clean send directory
    rmdir('send');
    copydir('dist', `send/REV_j${rev}`, (err) => {
        if(err){
            console.log(err);
        } else {
            console.log('ok');
            if(onSuccess) onSuccess();
        }
    });
};

gulp.task("create-output", done => {
    const rev = process.argv[4];
    createOutput(rev);
    done();
});

//upload files to s3
gulp.task("s3", done => {
    const rev = process.argv[4];
    createOutput(rev, () => {
        console.log('Please wait...');
        exec(`aws s3 sync send/ s3://ooyyo10/ --cache-control max-age=31536000 --acl public-read --exclude *.map`, (err, stdout, stderr) => {
            if(stdout) console.log(`stdout ${stdout}`);
            if(stderr) console.log(`stderr ${stderr}`);
        });
    });
    done();
});

//create & inject production content
gulp.task('prepare', gulp.series('copyFonts', 'copyHtml', 'build-js:prod', 'style:bs:prod', 'style:pages:prod'), () => {});
gulp.task('inject', gulp.series('injectToJsp'), () => {});

// copy static files
gulp.task('copy-static', gulp.parallel('copyFonts', 'copyHtml'), () => {});

//js
gulp.task('js', gulp.series('build-js'), () => {});

//tasks for styling
gulp.task('sass-pages', gulp.series('style:pages'), () => {});
gulp.task('sass-bs', gulp.series('style:bs'), () => {});
gulp.task('sass', gulp.parallel('style:pages', 'style:bs'), () => {});

//js + style
gulp.task('fast', gulp.parallel('style:pages', 'build-js'), () => {});

/*
 
 IMAGES

aws s3 sync ~/NetBeansProjects/ooyyo-justice/src/main/webapp/images s3://ooyyo10/images --cache-control max-age=31536000
 
 DEPLOY

1) create production files

$ gulp prepare
$ gulp inject

2) update revision.jsp, commit

3) send files to s3, use revision number as parameter

$ gulp s3 --rev 20200628


aws s3 ls s3://ooyyo10

//copy file
aws s3 cp /home/adj/OOYYOfiles/OOYYO_IMAGES/flags/sprite/sprite-flags-round-v2.png s3://ooyyo10/images/flags/sprite-flags-round-v2.png --acl public-read
 

aws s3 cp /home/adj/NetBeansProjects/ooyyo-justice/src/main/webapp/xml/OoyyoFormat.xml s3://ooyyo10/ooyyo_format/OoyyoFormat.xml --acl public-read

aws s3 cp /home/adj/NetBeansProjects/ooyyo-justice/src/main/webapp/resources/src/fonts s3://ooyyo10/fonts --acl public-read


 */
