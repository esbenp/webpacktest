/**
 * Created by Zero on 5/17/16.
 */


// Modules
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
// let HtmlWebpackPlugin = require('html-webpack-plugin')
const parts = require('./webpack.parts')


/**
 * Make webpack config
 * @param {Object} options Builder options
 * @param {boolean} options.TEST Generate a test config
 * @param {boolean} options.BUILD Generate a build config
 * @returns {Object} Webpack configuration object
 */
module.exports = function (options) {
    /**
     * Environment type
     * BUILD is for generating minified builds
     * TEST is for generating test builds
     */
    const BUILD = !!options.BUILD
    const TEST = !!options.TEST
    const DEV = !!options.DEV
    const ADJUST = !!options.ADJUST

    const DEV_PORT = 3200
    const PATH = {
        src: path.join(__dirname, 'v2SRC'),
        build: path.join(__dirname, 'public'),
        templates: path.join(__dirname, 'template'),
        node_modules: path.join(__dirname, 'node_modules'),
    }

    // alia used in path
    const ALIAS = {
        data: path.join(PATH.src, 'data'),
        lbimg: path.join(PATH.src, 'img'),
        view: path.join(PATH.src, 'view'),
        lbutil: path.join(PATH.src, 'lbutil'),
    }

    /**
     * new page should be added here
     * @type {string[]}
     */

    const PAGES = ['app']

    // /**
    //  * Environment values
    //  */
    // var NODE_ENV = process.env.NODE_ENV || 'dev'

    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    let common = {
        output: {},
        plugins: [],
        bail: true,
        // ,
        // context: __dirname
    }
    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    common = merge(common, parts.commonLoaders(PATH.src))

    const localIdentName = BUILD
        ? '[hash:base64]'
        : '[path][name]---[local]---[hash:base64:5]'

    if (!TEST) {
        const entries = {
        }
        PAGES.forEach((page) => {
            entries[`js/${page}`] = [
                'babel-polyfill',
                'whatwg-fetch',
                path.join(PATH.src, `view/pages/${page}/index`),
            ]
            entries[`css/${page}`] = path.join(PATH.src, `view/pages/${page}/index.scss`)
            if (DEV) {
                entries[`js/${page}`].push('webpack-hot-middleware/client')
            }
        })
        common = merge(common,
            {
                entry: entries,
                resolve: {
                    extensions: ['.js', '.jsx', 'css', 'scss'],
                    alias: ALIAS,
                    modules: [PATH.node_modules, 'node_modules'],
                },
                externals: {
                    wxsdk: 'wx',
                },
                output: {
                    // Absolute output directory
                    path: PATH.build,
                    // Output path from the view of the page
                    // Uses webpack-dev-server in development
                    publicPath: BUILD || ADJUST ? '../' : '/public/',
                    // Filename for entRy points
                    // Only adds hash in build mode
                    filename: BUILD || ADJUST ? '[name].[chunkhash].js' : '[name].bundle.js',
                    // Filename for non-entry points
                    // Only adds hash in build mode
                    chunkFilename: BUILD || ADJUST ? 'js/[name].[chunkhash].js' : 'js/[name].bundle.js',
                },
            },
            parts.extractBundle({
                names: ['js/vendor'],
                entries: [
                    [
                        'clone', 'whatwg-fetch', 'classnames', 'redux-thunk',
                        'moment', 'normalizr', 'react', 'react-event-listener',
                        'react-router', 'react-dom', 'babel-polyfill', 'redux', 'react-redux',
                        'immutable', 'humps', 'formsy-react', 'autotrack',
                        'react-addons-css-transition-group', 'react-virtualized',
                        'react-addons-shallow-compare', 'js-cookie', 'query-string',
                    ],
                ],
            })
        )
    }
    // for production
    if (BUILD) {
        common = merge(
            common,
            {
                devtool: 'source-map',
            },
            parts.extraManifestFile('../template/manifest.json'),
            parts.clean(PATH.build),
            parts.minify(),
//            parts.eslint(PATH.src, './.onlineeslintrc.json'),
            parts.extractCSS({
                paths: PATH.src,
                localId: localIdentName,
            }, false, webpack),
            parts.setFreeVariable('process.env.NODE_ENV', 'production'),
            parts.md5hash(),
            parts.webpack2Option(),
            parts.statsFile(path.join(PATH.templates, 'stats.json'))
        )
    }

    // for adjust
    if (ADJUST) {
        common = merge(
            common,
            {
                devtool: 'eval-source-map',
            },
            parts.extraManifestFile('../template/manifest.json'),
            parts.clean(PATH.build),
            parts.eslint(PATH.src, './.onlineeslintrc.json'),
            parts.extractCSS({
                paths: PATH.src,
                localId: localIdentName,
            }, false, webpack),
            parts.webpack2Option(),
            parts.statsFile(path.join(PATH.templates, 'stats.json'))
        )
    }

    // for developing
    if (DEV) {
        common = merge(
            common,
            {
                devtool: 'eval-source-map',
            },
            parts.extractCSS({
                paths: PATH.src,
                localId: localIdentName,

            }, true, webpack),
            parts.webpack2Option(),
            parts.devServer({
                host: process.env.HOST,
                port: process.env.port || DEV_PORT,
            })
        )
    }


    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     * Should be an empty object if it's generating a test build
     * Karma will set this when it's a test build
     */
    if (TEST) {
        common = merge(
            common,
            parts.webpack2Option(),
            {
                resolve: {
                    extensions: ['.js', '.jsx', 'css', 'scss'],
                    alias: ALIAS,
                },
                module: {
                    rules: [{
                        test: /\.js$/,
                        enforce: 'pre',
                        exclude: [
                            /node_modules/,
                            /\.test\.js$/,
                        ],
                        loader: 'isparta-loader',
                    }],
                },
                output: {},
                devtool: 'inline-source-map',
            }
        )
    }

    return common
}
