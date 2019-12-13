const _ = require('lodash');
const { securityService } = requireRoot('lib/services');
const { WebError } = requireRoot('lib/errors');
const { getAccessToken } = require('./utility');
/**
	Initialises the standard view locals
*/
exports.initLocals = function (req, res, next) {
	next();
};

exports.authenticate = (scopes) => {
	return function (req, res, next) {
		const token = getAccessToken(req);
		securityService.verify({ token })
			.then(token => {
				req.token = token;
				next();
			})
			.catch(e => {
				req.token = null;
				next(e);
			});
	};
};

// Forced to have 4 arguments due to express convension about error handlers
// eslint-disable-next-line
exports.errorHandler = function (err, req, res, next) {
	console.log('Error', err)
	// eslint-disable-next-line
	const status = (err instanceof WebError)
		? err.status
		: 500;
	res.status(status).send({ error: { message: err.message } });
};
