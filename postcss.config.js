
// const configSuitcss = require('stylelint-config-suitcss')
module.exports = {
    plugins: {
        // 'stylelint': configSuitcss,
        'postcss-will-change': {},
        'postcss-vmin': {},
//        precss: {},
//        'postcss-cssnext': {
//            browsers: ['last 2 versions', '> 2%'],
//        },
        lost: {},
        'postcss-pxtorem': {},
        cssnano: {
            reduceIdents: { keyframes: false },
            zindex: false,
            discardUnused: false,
        },
        'postcss-color-function': {},
    },
}
