/**
 * Created by Zero on 5/17/16.
 */

const Router = require('koa-router')
const innerApp = require('./controllers/app')

module.exports = function (app) {
    const router = new Router()

    router.get('*', innerApp.index)

    app.use(router.middleware())
}
