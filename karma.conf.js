/**
 * Created by Zero on 5/17/16.
 */
// Reference: http://karma-runner.github.io/0.13/config/configuration-file.html
const webpackTest = require('./webpack.test')

module.exports = function (config) {
    config.set({
        frameworks: [
            // Reference: https://github.com/karma-runner/karma-mocha
            // Set framework to mocha
            'mocha',
            'chai-as-promised',
            'chai',
        ],

        reporters: [
            // Reference: https://github.com/mlex/karma-spec-reporter
            // Set reporter to print detailed results to console
            'spec',

            // Reference: https://github.com/karma-runner/karma-coverage
            // Output code coverage files
            'coverage',
        ],

        files: [
            // Reference: https://www.npmjs.com/package/phantomjs-polyfill
            // Needed because React.js requires bind and phantomjs does not support it
            // 'node_modules/phantomjs-polyfill/bind-polyfill.js',
            'node_modules/babel-polyfill/dist/polyfill.js',
            'node_modules/whatwg-fetch/fetch.js',

            'v2SRC/lbutil/globalVariableForUnitTest.js',
            // Grab all files in the tests directory that contain _test.
            { pattern: 'v2SRC/**/*_test.*' },
        ],

        plugins: [
            'karma-webpack',
            'karma-coverage',
            'karma-sourcemap-loader',
            'karma-spec-reporter',
            'karma-mocha',
            'karma-chai',
            'karma-chai-as-promised',
            // 'karma-phantomjs-launcher'
            'karma-chrome-launcher',
        ],

        preprocessors: {
            // Reference: http://webpack.github.io/docs/testing.html
            // Reference: https://github.com/webpack/karma-webpack
            // Convert files with webpack and load sourcemaps
            'v2SRC/**/*_test.*': ['webpack', 'sourcemap'],
        },

        browsers: [
            // Run tests using PhantomJS
            // 'PhantomJS'
            'Chrome',
        ],
        // customLaunchers: {
        //     Chrome_without_security: {
        //         base: 'Chrome',
        //         flags: ['--disable-web-security']
        //     }
        // },

        singleRun: true,

        // Configure code coverage reporter
        coverageReporter: {
            dir: 'coverage/',
            type: 'html',
        },

        port: 3700,
        colors: true,

        // Test webpack config
        webpack: webpackTest,

        // Hide webpack build information from output
        webpackMiddleware: {
            noInfo: true,
        },
    })
}

