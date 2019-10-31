const SecurityService = require('./lib/SecurityService')
const UserService = require('./lib/UserService')

module.exports = {
	securityService: new SecurityService(),
	userService: new UserService()
}
