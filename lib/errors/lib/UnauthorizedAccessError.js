const WebError = require('./WebError');

class UnauthorizedAccessError extends WebError {
	constructor () {
		super('Wrong credentials', 401);
		Error.captureStackTrace(this, this.constructor);
		this.name = this.constructor.name;
	}
};

module.exports = UnauthorizedAccessError;
