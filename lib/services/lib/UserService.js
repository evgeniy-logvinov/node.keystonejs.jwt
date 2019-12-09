const _ = require('lodash')
var keystone = require('keystone');

const AbstractService = require('./AbstractService')
const User = keystone.list('User').model
const { WebError } = requireRoot('lib/errors')

class UserService extends AbstractService {

	async getUser({ token }) {
		const user = await User.findOne({ _id: token.userId })
		return user;
	}

	async updateUser({ token, email, phone, name }) {
		let options = { name: {} };

		if (name.first) {
			options.name.first = name.first;
		}
		if (name.last) {
			options.name.last = name.last;
		}

		if (email) {
			options.email = email;
		}

		if (phone) {
			options.phone = phone;
		}

		const res = await User.findOneAndUpdate({ _id: token.user._id }, options);

		return res;
	}

	createUser({email, password, name}) {
		if (!email) {
			throw new WebError('please fill email');
		}

		if (!password) {
			throw new WebError('please fill password');
		}

		if (!name.first) {
			throw new WebError('please fill first name');
		}

		if (!name.last) {
			throw new WebError('please fill last name');
		}

		return User.create({ email: email, password: password, name: { first: name.first, last: name.last } })
	}
}

module.exports = UserService
