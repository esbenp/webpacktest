/**
 * Created by Zero on 5/17/16.
 * @desc home page controller
 */

'use strict'

const path = require('path')
const fs = require('fs')

function _readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (err, res) => {
            if(err) {
                reject(err)
                throw err
            } else {
                resolve(res)
            }
        })
    })
}

module.exports = {
    commonData: function (name) {

        let staticFiles = {
            'statics': {
                'js_vendor': 'public/js/vendor.bundle.js',
                'js_manifest': 'public/js/manifest.bundle.js',
                'css_base': 'public/css/base.bundle.css',
                'js_base': 'public/js/base.bundle.js',
                [`js_${name}`]: `public/js/${name}.bundle.js`,
                [`css_${name}`]: `public/css/${name}.bundle.css`,
            }
        }
        
        let jsonPromise = _readFile(path.join(__dirname, './json/common.json'))
        let i18nJsonPromise = _readFile(path.join(__dirname, './json/i18n.json'))


        return Promise.all([jsonPromise, i18nJsonPromise]).then((arr) => {
            let commonData = JSON.parse(arr[0])
//            let data = JSON.parse(arr[1])
            let i18nData = JSON.parse(arr[1])

            let data = Object.assign(commonData, i18nData, staticFiles)
            // data.stringLanguage = new Buffer(JSON.stringify(data.language)).toString('base64')
            // data.stringUInfo = new Buffer(JSON.stringify(data.uInfo)).toString('base64')
            // data.stringText = new Buffer(JSON.stringify(data.text)).toString('base64')
            // data.stringGames = new Buffer(JSON.stringify(data.games)).toString('base64')
            data.stringLanguage = encodeURIComponent(JSON.stringify(data.language))
            data.stringUInfo = encodeURIComponent(JSON.stringify(data.uInfo))
            data.stringText = encodeURIComponent(JSON.stringify(data.text))
            data.stringGames = encodeURIComponent(JSON.stringify(data.games))
            data.stringCategories = encodeURIComponent(JSON.stringify(data.categories))
            data.operationConfig = encodeURIComponent(JSON.stringify(data.operationConfig))
            data.serverTime = data.serverTime
            return data
        })
    },
    jsonData: function (name) {
        return _readFile(path.join(__dirname, `./json/${name}.json`)).then((str) => {
            return JSON.parse(str)
        })
    },
    tplData: function (name, lang = 'en') {
        return _readFile(path.join(__dirname, `../../template/static_pages/${lang}/${name}.html`))
    }
}
