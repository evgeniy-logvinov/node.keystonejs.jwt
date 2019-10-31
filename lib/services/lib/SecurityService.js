var keystone = require('keystone');
const { promisify } = require('util')
const { WebError } = requireRoot('lib/errors')

const AbstractService = require('./AbstractService')
const User = keystone.list('User').model
const Token = keystone.list('Token').model

class SecurityService extends AbstractService {
	async login({ email, password }) {
		const user = await User
			.findOne({ email })

		if (!user) {
			throw new WebError('Wrong credentials', 401)
		}

		if (!await promisify(user._.password.compare)(password)) {
			throw new WebError('Wrong credentials', 401)
		}

		const token = await Token
			.create({ user: user })

		return Token
			.findOne({ _id: token._id })
			.populate('user')
	}

	async token({ token }) {
		if (!token || token.indexOf('Bearer ') !== 0) {
			throw new WebError('Wrong credentials', 401)
		}

		const userToken = await Token
			.findOne({
				token: token
					.substring('Bearer '.length)
			})
			.populate({ path: 'user' })

		if (!userToken) {
			throw new WebError('Wrong credentials', 401)
		}

		return userToken;
	}

	async logout({ token }) {
		if (!token || token.indexOf('Bearer ') !== 0) {
			throw new WebError('Wrong credentials', 401)
		}

		const result = await Token
			.findOne({
				token: token
					.substring('Bearer '.length)
			})
			.populate('user')
		if (!result) {
			throw new WebError('Wrong credentials', 401)
		}
		result.remove()
		return result
	}
}

module.exports = SecurityService
