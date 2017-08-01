/**
 * app
 * @file
 * @author Zero <chuangjie.luo@funplus.com> on 21/11/2016
 * @version 0.0.1
 */

'use strict'

const common = require('./common')
const clone = require('clone')

module.exports = {
    *index () {
        let data = yield common.commonData('app')
        let account = this.cookies.get('account')
        data = clone(data)
        if(account) {
            data.uInfo.isLogin = true
            // data.stringUInfo = new Buffer(JSON.stringify(data.uInfo)).toString('base64')
            data.stringUInfo = encodeURIComponent(JSON.stringify(data.uInfo))
        }
        yield this.render('app', data)
    },
}

