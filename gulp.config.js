module.exports = function () {
    var src = "./src/";
    var app = src + "app/";
    var temp = "./.tmp/";
    var bowerDirectory = "./bower_components/";

    var config = {
        temp: temp,

        /**
         * Files paths
         */
        alljs: [
            src + "**/*.js",
            "./*.js"
        ],
        build: "./build/",
        src: src,
        css: temp + "*.css",
        fonts: [
            bowerDirectory + "font-awesome/fonts/**/*.*",
            bowerDirectory + "bootstrap/fonts/**/*.*",
        ],
        html: src + "**/*.html",
        htmltemplates: app + "**/*.html",
        images: src + "img/**/*.*",
        assets: src + "assets/**/*.*",
        index: src + "index.html",

        // app js, with no specs
        js: [
            app + "**/*.module.js",
            app + "**/*.js",
            "!" + "**/*.spec.js",
            "./lib/*.js",
        ],

        scss: src + "styles/*.scss",

        /**
         * optimized files
         */
        optimized: {
            app: "app.js",
            lib: "lib.js"
        },

        /**
         * template cache
         */
        templateCache: {
            file: "templates.js",
            options: {
                module: "aurignac.core",
                root: "app/",
                standAlone: false
            }
        },

        /**
         * Bower and NPM locations
         */
        bower: {
            json: require("./bower.json"),
            directory: bowerDirectory,
            ignorePath: "../../",
            overrides: {
                "bootstrap": {
                    "main": [
                        "./dist/js/bootstrap.js",
                        "./dist/css/bootstrap.css"
                    ]
                },
                "font-awesome": {
                    "main": "./css/font-awesome.css"
                },
                "jquery": {
                    "ignore": true
                },
                "angulartics": {
                    "main": "src/angulartics.js"
                }
            }
        }
    };

    config.getBowerFilesDefaultOptions = function () {
        var options = {
            overrides: config.bower.overrides
        };

        return options;
    };

    return config;
};
