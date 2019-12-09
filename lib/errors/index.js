const WebError = require('./lib/WebError')
const UnauthorizedAccessError = require('./lib/UnauthorizedAccessError')
const RestApiError = require('./lib/RestApiError')

module.exports = {
	WebError,
	RestApiError,
	UnauthorizedAccessError
}
