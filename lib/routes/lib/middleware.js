const _ = require('lodash')
const { securityService } = requireRoot('lib/services')
const { WebError } = requireRoot('lib/errors')

/**
	Initialises the standard view locals
*/
exports.initLocals = function (req, res, next) {
	next()
}

/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.')
		res.redirect('/keystone/signin')
	} else {
		next()
	}
}

exports.authenticate = (scopes) => {
	return function (req, res, next) {
		securityService.token({ token: req.headers.authorization })
			.then(token => {
				req.token = token
				next()
			})
			.catch(e => {
				req.token = null
				next(e)
			})
	}
}

// Forced to have 4 arguments due to express convension about error handlers
// eslint-disable-next-line
exports.errorHandler = function (err, req, res, next) {
	// eslint-disable-next-line
	const status = (err instanceof WebError)
		? err.status
		: 500
	res.status(status).send({ error: { message: err.message, stack: err.stack } })
}
