var keystone = require('keystone');

const securityRouter = require('./lib/security')
const middlewareRouter = require('./lib/middleware')
const userRouter = require('./others/user')

const restful = require('restful-keystone')(keystone, {
    root: '/api/v1'
})

keystone.pre('routes', middlewareRouter.initLocals)

exports = module.exports = function (app) {
    app.all('/api/v1/*', keystone.middleware.cors)

    app.options('/api/v1/*', (req, res) => {
        res.sendStatus(200)
    })

    app.use('/api/v1/security', securityRouter)
    app.use('/api/v1/users', userRouter)

    app.get('/', (req, res) => {
        res.redirect('/keystone/')
    })
    app.use(middlewareRouter.errorHandler)
}