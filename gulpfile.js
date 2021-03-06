// voir https://github.com/johnpapa/pluralsight-gulp et http://www.pluralsight.com/courses/javascript-build-automation-gulpjs

var gulp = require('gulp'),
    args = require('yargs').argv,
    config = require('./gulp.config')(),
    del = require('del'),
    _ = require('lodash'),
    path = require('path'),
    browserSync = require('browser-sync').create(),
    bowerFiles = require('main-bower-files'),
    $ = require('gulp-load-plugins')({ lazy: true });

/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function () {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscsCustom({
            esnext: true
        }))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }));
    // .pipe(jshint.reporter('fail')); // Fait planter la tâche si erreurs de validation JSHint
});

/**
 * Injects in an angular module the environment-dependent variables defined in config.module.json
 * If no 'env' argument provided, default to local environment
 */
gulp.task('ng-conf', function () {
  gulp.src('config.module.json')
    .pipe($.ngConfig('aurignac.config', {
      wrap: true,
      environment: args.env || 'local'
    }))
    .pipe(gulp.dest(config.src + 'app/'));
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', ['clean-fonts'], function() {
    log('Copying fonts');

    return gulp
        .src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', ['clean-images'], function() {
    log('Compressing and copying images');

    return gulp
        .src(config.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'img'));
});

/**
 * Copy assets to build folder
 * @return {Stream}
 */
gulp.task('assets', ['clean-assets'], function() {
    log('Copying assets');

    return gulp
        .src(config.assets)
        .pipe(gulp.dest(config.build + 'assets'));
});

/**
 * Compile sass to css
 * @return {Stream}
 */
gulp.task('styles', ['clean-styles'], function () {
    log('Compiling SCSS --> CSS');

    return gulp
        .src(config.scss)
        .pipe($.sass())
        .on('error', $.sass.logError)
        .pipe($.autoprefixer({ browers: ['last 2 versions', '> 5%'] }))
        .pipe(gulp.dest(config.temp));
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', ['clean-code'], function() {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.if(args.verbose, $.bytediff.start()))
        .pipe($.minifyHtml({empty: true}))
        .pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});

/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
gulp.task('wiredep', function () {
    log('Wire up the bower css js and our app js into index.html');
    var options = config.getBowerFilesDefaultOptions();

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(bowerFiles(options), { read: false }), { name: 'bower' }))
        .pipe($.inject(gulp.src(config.js, { read: false })))
        .pipe(gulp.dest(config.src));
});

gulp.task('inject', ['wiredep', 'styles'], function () {
    log('Wire up the app css into index.html, and call wiredep');

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css, { read: false })))
        .pipe(gulp.dest(config.src));
});

/**
 * Optimize all files, move to a build folder,
 * and inject them into the new index.html
 * @return {Stream}
 */
gulp.task('optimize', ['inject', 'templatecache'], function() {
    log('Optimizing the js, css, and html');

    var assets = $.useref.assets({searchPath: './'});
    // Filters are named for the gulp-useref path
    var cssFilter = $.filter('**/*.css', {restore: true});
    var jsAppFilter = $.filter('**/' + config.optimized.app, {restore: true});
    var jslibFilter = $.filter('**/' + config.optimized.lib, {restore: true});

    var templateCache = config.temp + config.templateCache.file;

    return gulp
        .src(config.index)
        .pipe($.plumber())
        .pipe(inject(templateCache, 'templates'))
        .pipe(analytics())
        .pipe(assets) // Gather all assets from the html with useref

        // Get the css
        .pipe(cssFilter)
        .pipe($.csso())
        .pipe(cssFilter.restore)

        // Get the custom javascript
        .pipe(jsAppFilter)
        .pipe($.ngAnnotate({add: true}))
        .pipe($.uglify())
        .pipe(getHeader())
        .pipe(jsAppFilter.restore)

        // Get the vendor javascript
        .pipe(jslibFilter)
        .pipe($.uglify()) // another option is to override wiredep to use min files
        .pipe(jslibFilter.restore)

        // Take inventory of the file names for future rev numbers
        .pipe($.rev())
        // Apply the concat and file replacement with useref
        .pipe(assets.restore())
        .pipe($.useref())
        // Replace the file names in the html with rev numbers
        .pipe($.revReplace())
        .pipe(gulp.dest(config.build));
});

/**
 * Build everything
 * This is separate so we can run tests on
 * optimize before handling image or fonts
 */
gulp.task('build', ['optimize', 'images', 'assets', 'fonts'], function() {
    log('Building everything');

    const paypalScript = 'https://www.paypal.com/sdk/js?currency=EUR&client-id=Aap-rFAyPgwgDHm02iBmIYjwjyDmcRcEbXeacaKIrTMH1cFtbtNmfZLgfdhLBHTBcxvxxjcvdYH_84tz';
    return gulp.src(config.build + 'index.html')
        .pipe($.replace(/<!-- head:paypal -->[\s\S]*<!-- end:head:paypal -->/, `<script src="${paypalScript}"></script>`))
        .pipe(gulp.dest(config.build));
});

/**
 * serve the dev environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-dev', ['inject'], function() {
    startBrowserSync(true /*isDev*/);
});

/**
 * serve the build environment
 * --debug-brk or --debug
 * --nosync
 */
gulp.task('serve-build', ['build'], function () {
    del(config.temp);

    var msg = {
        title: 'gulp build',
        subtitle: 'Deployed to the build folder',
        message: 'Running `gulp serve-build`'
    };

    log(msg);
    notify(msg);

    startBrowserSync(false /*isDev*/);
});

/**
 * Remove all fonts from the build folder
 * @param {Function} done - callback when complete
 */
gulp.task('clean-fonts', function(done) {
    clean(config.build + 'fonts/**/*.*', done);
});

/**
 * Remove all images from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-images', function(done) {
    clean(config.build + 'img/**/*.*', done);
});

/**
 * Remove all assets from the build folder
 * @param {Function} done - callback when complete
 */
gulp.task('clean-assets', function(done) {
    clean(config.build + 'assets/**/*.*', done);
});

/**
 * Remove all styles from the build and temp folders
 * @param {Function} done - callback when complete
 */
gulp.task('clean-styles', function (done) {
    var files = [].concat(
        config.temp + '**/*.css',
        config.build + 'styles/**/*.css'
    );

    clean(files, done);
});

/**
 * Remove all js and html from the build and temp folders
 * @param {Function} done - callback when complete
 */
gulp.task('clean-code', function(done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + 'js/**/*.js',
        config.build + '**/*.html'
    );

    clean(files, done);
});

gulp.task('scss-watcher', function () {
    gulp.watch(config.scss, ['styles']);
});

/**
 * Optimize the code and re-load browserSync
 */
gulp.task('browserSyncReload', ['optimize'], browserSync.reload);

////////////////////////////

/**
 * Start BrowserSync
 * --nosync will avoid browserSync
 * --browser to specify browser
 */
function startBrowserSync(isDev, specRunner) {
    if (args.nosync || browserSync.active) {
        return;
    }

    log('Starting BrowserSync');

    // If build: watches the files, builds, and restarts browser-sync.
    // If dev: watches sass, compiles it to css, browser-sync handles reload
    if (isDev) {
        gulp.watch([config.scss], ['styles'])
            .on('change', changeEvent);
    } else {
        gulp.watch([config.scss, config.js, config.html], ['browserSyncReload'])
            .on('change', changeEvent);
    }

    var options = {
        proxy: isDev ? 'www.asp.test:9999' : 'build.asp.test:9999',
        files: isDev ? [
            config.src + '**/*.*',
            '!' + config.scss,
            config.temp + '**/*.css',
            './lib/*.*'
        ] : [],
        ghostMode: { // these are the defaults t,f,t,t
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'asp-front',
        notify: true,
        reloadDelay: 500,
        browser: args.browser || 'default'
    };

    if (specRunner) {
        options.startPath = config.specRunnerFile;
    }

    browserSync.init(options);
}

/**
 * When files change, log it
 * @param {Object} event - event that fired
 */
function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.src + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}

/**
 * Delete all files in a given path
 * @param  {Array} path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    log('Cleaning: ' + path);
    del(path).then(function (path) {
        done && done();
    });
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src - glob pattern for source files
 * @param   {String} label - The label name
 * @param   {Array} order - glob pattern for sort order of the files
 * @returns {Stream} The stream
 */
function inject(src, label, order) {
    var options = {read: false};
    if (label) {
        options.name = 'inject:' + label;
    }

    return $.inject(orderSrc(src, order), options);
}

/**
 * Order a stream
 * @param   {Stream} src - The gulp.src stream
 * @param   {Array} order - Glob array pattern
 * @returns {Stream} The ordered stream
 */
function orderSrc(src, order) {
    //order = order || ['**/*'];
    return gulp
        .src(src)
        .pipe($.if(order, $.order(order)));
}

/**
 * Inject analytics code in html
 * @returns {Stream} The stream
 */
function analytics() {
    log('Inject analytics js code');

    return $.inject(gulp.src(config.src + 'analytics.html'), {
        starttag: '<!-- inject:analytics -->',
        removeTags: true,
        transform: function (filePath, file) {
            // return file contents as string
            return file.contents.toString('utf8');
        }
    });
}

/**
 * Format and return the header for files
 * @return {String} - Formatted file header
 */
function getHeader() {
    var pkg = require('./package.json');
    var template = ['/**',
        ' * <%= pkg.name %> - <%= pkg.description %>',
        ' * @contributors <%= pkg.contributors %>',
        ' * @version v<%= pkg.version %>',
        // ' * @link <%= pkg.homepage %>',
        // ' * @license <%= pkg.license %>',
        ' */',
        ''
    ].join('\n');
    return $.header(template, {
        pkg: pkg
    });
}

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
    var notifier = require('node-notifier');
    var notifyOptions = {
        sound: 'Bottle',
        contentImage: path.join(__dirname, 'gulp.png'),
        icon: path.join(__dirname, 'gulp.png')
    };

    _.assign(notifyOptions, options);
    notifier.notify(notifyOptions);
}

/**
 * Formatter for bytediff to display the size changes after processing
 * @param  {Object} data - byte data
 * @return {String} Difference in bytes, formatted
 */
function bytediffFormatter(data) {
    var difference = (data.savings > 0) ? ' smaller.' : ' larger.';
    return data.fileName + ' went from ' +
        (data.startSize / 1000).toFixed(2) + ' kB to ' +
        (data.endSize / 1000).toFixed(2) + ' kB and is ' +
        formatPercent(1 - data.percent, 2) + '%' + difference;
}

/**
 * Format a number as a percentage
 * @param  {Number} num - Number to format as a percent
 * @param  {Number} precision - Precision of the decimal
 * @return {String} Formatted perentage
 */
function formatPercent(num, precision) {
    return (num * 100).toFixed(precision);
}