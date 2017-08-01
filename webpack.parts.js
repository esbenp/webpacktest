const webpack = require('webpack')
const fs = require('fs')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// const NpmInstallPlugin    = require('npm-install-webpack-plugin')
const eslintFormatter = require('eslint-friendly-formatter')
const Webpackhash = require('webpack-chunk-hash')
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin')

/**
 * configure eslint
 * @param {string} paths - paths to include
 * @param {string} configFiles - path of configure file
 * @returns {object} object to be merged into webpack option
 */
exports.eslint = function (paths, configFiles = './.eslintrc') {
    return {
        plugins: [
            new webpack.LoaderOptionsPlugin({
                options: {
                    eslint: {
                        // community formatter
                        formatter: eslintFormatter,
                        failOnError: true,
                        configFile: configFiles,
                    },
                },
            }),
        ],
        module: {
            rules: [{
                test: /\.jsx?$/,
                loader: 'eslint-loader',
                enforce: 'pre',
                include: paths,
            }],
        },
    }
}

exports.commonLoaders = function (paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.(png|jpg|gif)$/,
                    include: paths,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 2000,
                                name: './img/[name].[hash].[ext]',
                            },
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                progressive: true,
                                bypassOnDebug: true,
                                gifsicle: {
                                    interlaced: false,
                                },
                                optipng: {
                                    optimizationLevel: 3,
                                },
                                pngquant: {
                                    quality: '65-90',
                                    speed: 4,
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.(woff|woff2|ttf|eot)$/,
                    include: paths,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000,
                                name: './fonts/[name].[hash].[ext]',
                            },
                        },
                    ],
                },
                {
                    test: /\.svg$/,
                    include: paths,
                    use: [
                        {
                            loader: 'svg-sprite-loader',
                            options: {
                                symbolId: '[name]_[hash]',
                            },
                        },
                    ],
                },
                // JS LOADER
                // Reference: https://github.com/babel/babel-loader
                // Transpile .js files using babel-loader
                // Compiles ES6 and ES7 into ES5 code
                {
                    test: /\.jsx?$/,
                    include: paths,
                    use: [{
                        loader: 'babel-loader',
                        options: {
                            plugins: ['transform-decorators-legacy'],
                            presets: [
                                // ['es2015', {modules: false}],
                                'es2015-loose',
                                'react',
                                'stage-0',
                            ],
                            cacheDirectory: true,
                        },
                    }],
                },
            ],
        },
    }
}

/**
 * set up dev server
 * @returns {object} webpack option
 */
exports.devServer = function () {
    return {
        // watchOptions: {
        //     // Delay the rebuild after the first change
        //     aggregateTimeout: 300,
        //     // Poll using interval (in ms, accepts boolean too)
        //     poll: 1000
        // },
        // devServer: {
        //     // Enable history API fallback so HTML5 History API based
        //     // routing works. This is a good default that will come
        //     // in handy in more complicated setups.
        //     historyApiFallback: true,
        //
        //     // Unlike the cli flag, this doesn't set
        //     // HotModuleReplacementPlugin!
        //     hot: true,
        //     inline: true,
        //
        //     // Display only errors to reduce the amount of output.
        //     stats: {
        //         modules: false,
        //         cached: false,
        //         colors: true,
        //         chunk: false
        //     },
        //     publicPath: '/public/',
        //
        //     // Parse host and port from env to allow customization.
        //     //
        //     // If you use Vagrant or Cloud9, set
        //     // host: options.host || '0.0.0.0'
        //     //
        //     // 0.0.0.0 is available to all network devices
        //     // unlike default `localhost`.
        //     host: options.host, // Defaults to `localhost`
        //     contentBase: options.contentBase,
        //     port: options.port // Defaults to 8080
        //
        // },
        plugins: [
            new webpack.LoaderOptionsPlugin({ debug: true }),
            // Enable multi-pass compilation for enhanced performance
            // in larger projects. Good default.
            new webpack.HotModuleReplacementPlugin({
                multiStep: true,
            }),
            new webpack.NoEmitOnErrorsPlugin(),
            new webpack.IgnorePlugin(/vertx/),
            // new NpmInstallPlugin({ save: true })
        ],
    }
}

//  /**
//  * set up css config
//  * @param options
//  * @returns {{module: {loaders: *[]}}}
//  */
// exports.setupCSS = function(options) {
//     return {
//         module: {
//             loaders: [
//                 {
//                     test: /\.s?css$/,
//                     include: options.paths,
//                     loaders: [
//                         'style',
//                         'css?sourceMap&localIdentName=' + options.localId + '!postcss',
//                         'sass'
//                     ],
//                 }
//             ],
//         },
//
//         /**
//          * PostCSS
//          * Reference: https://github.com/postcss/autoprefixer-core
//          * Add vendor prefixes to your css
//          */
//         postcss: [
//             willChange,
//             vmin,
//             autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
//             cssnext,
//             precss,
//             bem,
//             nested,
//         ],
//         sassLoader: {
//             includePaths: [options.paths]
//         }
//
//     }
// }

/**
 * set up css config
 * @param {object} options - options
 * @param {boolean} notHash - not hash
 * @returns {object} webpack option
 */
exports.extractCSS = function (options, notHash) {
    return {
        module: {
            rules: [
                {
                    test: /\.css$/,
                    loader: 'postcss-loader',
                    enforce: 'pre',
                    include: options.paths,
                },
                {
                    test: /\.s?css$/,
                    include: options.paths,

                    loader: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        allChunks: false,
                        use: [
                            {
                                loader: 'css-loader',
                                options: {
                                    importLoaders: 1,
                                },
                            },
//                            {
//                                loader: 'resolve-url-loader',
//                            },
                            {
                                loader: 'postcss-loader',
                            },
                            {
                                loader: 'sass-loader',
                            },
                        ],
                        // loader: [
                        //     {
                        //         loader: 'style-loader'
                        //     },
                        //
                        //     {
                        //         loader: 'css-loader',
                        //         options: {
                        //             sourceMap: true,
                        //             importLoaders: 1,
                        //             localIdentName: options.localId
                        //         }
                        //     },
                        //     {
                        //         loader: 'postcss-loader'
                        //     }
                        //     // ,
                        //     // {
                        //     //     loader: 'sass-loader'
                        //     // }
                        // ]
                    }),
                    // ,
                    // loader: ExtractTextPlugin.extract(
                    //     // Reference: https://github.com/webpack/style-loader
                    //     // Use style-loader in development for hot-loading
                    //     'style-loader',
                    //
                    //     // Reference: https://github.com/postcss/postcss-loader
                    //     // Postprocess your css with PostCSS plugins
                    //     // 'css?modules&sourceMap&localIdentName=' +
                    // options.localId + '!postcss',
                    //     'css-loader?sourceMap&localIdentName=' + options.localId + '!postcss',
                    //     'sass-loader'
                    // )
                },
            ],
        },
        plugins: [
            // Reference: https://github.com/webpack/extract-text-webpack-plugin
            // Extract css files
            // Disabled when in test mode or not in build mode
            new ExtractTextPlugin({
                filename: notHash ? '[name].bundle.css' : '[name].[contenthash].css',
                allChunks: false,
            }),
            // ,
            // new webpack.LoaderOptionsPlugin({
            //     options: {
            //         /**
            //          * sass config
            //          */
            //         sassLoader: {
            //             includePaths: [options.paths]
            //         }
            //     }
            // })
        ],
    }
}


/**
 * get rid of useless style
 * @param {string} basePath - basePath
 * @param {string} paths - paths
 * @returns {{plugins: *[]}} webpack option
 */
// exports.purifyCSS = function(basePath, paths) {
//     return {
//         plugins: [
//             new PurifyCSSPlugin({
//                 // basePath: process.cwd(),
//                 basePath: basePath,
//                 // `paths` is used to point PurifyCSS to files not
//                 // visible to Webpack. You can pass glob patterns
//                 // to it.
//                 paths: paths
//             })
//         ]
//     }
// }

exports.md5hash = function () {
    return {
        plugins: [
            new Webpackhash({ algorithm: 'md5' }),
        ],
    }
}

/**
 * for production
 * @returns {{plugins: *[]}} webpack option
 */
exports.minify = function () {
    return {
        plugins: [
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoEmitOnErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false },
                sourceMap: true,
            }),
        ],
    }
}

/**
 * set up webpack 2 option, to be compatable with webpack 1
 * @returns {{plugins: *[]}} webpack option
 */
exports.webpack2Option = function () {
    return {
        plugins: [
            new webpack.LoaderOptionsPlugin({
                options: { context: __dirname },
            }),
            new webpack.optimize.ModuleConcatenationPlugin(),
        ],
    }
}

/**
 * set up node env
 * @param {string} key - key
 * @param {object} value - value
 * @returns {{plugins: *[]}} webpack option
 */
exports.setFreeVariable = function (key, value) {
    const env = {}
    env[key] = JSON.stringify(value)

    return {
        plugins: [
            new webpack.DefinePlugin(env),
        ],
    }
}

/**
 * extract manifest
 * @param {string} path - file path
 * @returns {{plugins: *[]}} - option
 */
exports.extraManifestFile = function (path) {
    return {
        plugins: [
            new ChunkManifestPlugin({
                filename: path,
                manifestVariable: '__webpackManifest',
            }),
        ],
    }
}

/**
 * extract common bundle - bundle
 * @param {object} options - options
 * @returns {{entry: {}, plugins: *[]}} webpack option
 */
exports.extractBundle = function (options) {
    const entries = {}
    options.names.forEach((name, index) => {
        entries[name] = options.entries[index]
    })

    return {
        // Define an entry point needed for splitting.
        entry: entries,
        plugins: [
            new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-gb|zh-cn/),
            new webpack.ContextReplacementPlugin(/intl[/\\]locale-data[/\\]jsonp$/, /en-US|zh/),
            // Extract bundle and manifest files. Manifest is
            // needed for reliable caching.
            new webpack.optimize.CommonsChunkPlugin({
                names: options.names,
                children: options.children,

                // options.name modules only
                minChunks: Infinity,
            }),
        ],
    }
}

/**
 * clean build directory
 * @param {string} path - path
 * @returns {{plugins: *[]}} webpack option
 */
exports.clean = function (path) {
    return {
        plugins: [
            new CleanWebpackPlugin([path], {
                // Without `root` CleanWebpackPlugin won't point to our
                // project and will fail to work.
                root: process.cwd(),
            }),
        ],
    }
}

/**
 * generate stats file
 * @param {string} paths - path
 * @returns {object} webpack option
 */
exports.statsFile = function (paths) {
    return {
        plugins: [
            function () {
                this.plugin('done', (stats) => {
                    const chunks = stats.toJson().assetsByChunkName
                    const result = {}
                    Object.keys(chunks).forEach((key) => {
                        if (Object.prototype.hasOwnProperty.call(chunks, key)) {
                            if (key.indexOf('css/') >= 0) {
                                result[key.replace('/', '_')] = chunks[key][1]
                            } else {
                                if (chunks[key] instanceof Array) {
                                    result[key.replace('/', '_')] =
                                        chunks[key][0].indexOf('/template/manifest.json') >= 0 ?
                                            chunks[key][1] :
                                            chunks[key][0]
                                } else {
                                    result[key.replace('/', '_')] = chunks[key]
                                }
                                if (key.indexOf('manifest') > 0) {
                                    result[key.replace('/', '_')] += `?date=${Date.now()}`
                                }
                            }
                        }
                    })
                    fs.writeFileSync(
                        paths,
                        JSON.stringify(result))
                })
            },
        ],
    }
}
// /**
//  * extract html plugin
//  * @param path
//  * @returns {{plugins: *[]}}
//  */
// exports.generateHtml = function(filename, template) {
//     return {
//         plugins: [
//             new HtmlWebpackPlugin({  // Also generate a test.html
//                 filename: filename,
//                 template: template
//             })
//         ]
//     }
// }
