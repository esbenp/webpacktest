/**
 * Created by Zero on 5/17/16.
 */

/**
 * Webpack config for development
 */


module.exports = require('./webpack.make')({
    ADJUST: true,
    publicPath: '//assets-dev-m.funplusgame.com/dev/static/',
})
