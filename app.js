/**
 * Created by Zero on 5/17/16.
 */

const koa = require('koa')
const webpack = require('webpack')
const bodyParser = require('koa-bodyparser')
const gzip = require('koa-gzip')
const session = require('koa-session')
const router = require('./router')
const handlebars = require('koa-hbs')
const config = require('./config')
const webpackConfig = require('./webpack.config')

const compiler = webpack(webpackConfig)
const app = koa()

process.env.BABEL_ENV = process.env.ENV
process.env.NODE_ENV = process.env.ENV

app.config = config[process.env.ENV]

app.use(bodyParser())
app.use(session(app))
app.use(gzip())
// app.use(serve({
//     rootDir: __dirname + '/public',
//     rootPath: '/public',
//     gzip: true,
//     maxage: 1000 * 3600 * 24 * 1000
// }))
handlebars.registerHelper('helper.stringify', obj => JSON.stringify(obj))
app.use(handlebars.middleware({
    viewPath: `${__dirname}/template/views`,
    partialsPath: `${__dirname}/template/partials`,
    disableCache: true,
    extname: '.html',
}))

app.use(require('koa-webpack-dev-middleware')(compiler, {
    noInfo: true, publicPath: webpackConfig.output.publicPath,
}))
app.use(require('koa-webpack-hot-middleware')(compiler))


// app.use(function  *(next) {
//     yield next
//     console.log(this.request.url, JSON.stringify(this.request.headers))
// })

app.on('error', (e) => {
    console.error(e)
})

process.on('unhandledRejection', (reason) => {
    console.error(reason)
})

process.on('uncaughtException', (reason) => {
    console.error(reason)
})

router(app)


const port = app.config.port

 // const ip = '10.0.160.27'
 // app.listen(8888, ip)

app.listen(port)

console.log(`\nlistening: ${port}, live bet has set up`)
