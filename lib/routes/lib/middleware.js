const { securityService } = requireRoot('lib/services');
const { WebError, ValidationError } = requireRoot('lib/errors');
const { getAccessToken } = requireRoot('lib/utility');
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
	console.log('Error', err);
	// eslint-disable-next-line
	const status = (err instanceof WebError)
		? err.status
		: 500;
	let error = { message: err.message };
	if (err instanceof ValidationError) {
		error.invalidFields = err.invalidFields;
	}

	res.status(status).send({ error });
};
