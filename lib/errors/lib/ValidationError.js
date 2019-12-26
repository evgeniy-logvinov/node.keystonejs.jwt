const WebError = require('./WebError');

class ValidationError extends WebError {
	constructor (invalidFields) {
		super('ValidationError', 400);
		Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.invalidFields = invalidFields || [];
	}
};

module.exports = ValidationError;
