const _ = require('lodash');
var keystone = require('keystone');

const User = keystone.list('User').model;
const { WebError } = requireRoot('lib/errors');

module.exports = class UserService {

	async getUser ({ token }) {
		const user = await User.findOne({ _id: token.userId });
		return user;
	}

	async create ({ email, password, confirmPassword, emailPreferences = false, phone, name }) {
		if (!email) {
			throw new WebError('please fill email');
		}

		if (!password) {
			throw new WebError('please fill password');
		}

		if (!confirmPassword) {
			throw new WebError('please fill confirm password');
		}

		if (!phone) {
			throw new WebError('please fill phone');
		}

		if (!name.first) {
			throw new WebError('please fill first name');
		}

		if (!name.last) {
			throw new WebError('please fill last name');
		}

		if (password !== confirmPassword) {
			throw new WebError('password and confirm password don`t same');
		}

		return await User.create({ email, password, phone, emailPreferences, name: { first: name.first, last: name.last } });
	}

	async activate ({ id }) {
		if (!id) {
			throw new WebError('please fill id');
		}

		let user = await User.findOne({ _id: id });

		if (!user) {
			throw new WebError(`Cannot find user with id ${id}`);
		}

		if (user.activated) {
			throw new WebError('User already activated');
		}

		user.activated = true;
		user.save();

		return { succes: 'done' };
	}
}
