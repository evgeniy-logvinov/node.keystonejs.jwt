class RestApiError extends Error {
	constructor(message, status) {
		super(message)
		Error.captureStackTrace(this, this.constructor)
		this.name = this.constructor.name
		const error = {
			code: 400,
			title: this.message
		}
		this.errors = [error]
		this.status = "fail"
	}
};

module.exports = RestApiError
