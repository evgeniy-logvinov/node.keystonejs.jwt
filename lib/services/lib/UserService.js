var keystone = require('keystone');

const User = keystone.list('User').model;
const RefreshToken = keystone.list('RefreshToken').model;
const { WebError, ValidationError } = requireRoot('lib/errors');

module.exports = class UserService {

	prepareSessions (sessions) {
		return sessions.map(session => (
			{
				id: session.id,
				userAgent: session.userAgent,
				ip: session.ip,
				createdAt: session.createdDate,
				lastActionAt: session.lastActionAt,
			}));
	}

	async getUser ({ token }) {
		return await User.findOne({ _id: token.userId }); ;
	}

	async getSessions ({ token }) {
		const user = await User.findOne({ _id: token.userId });

		if (!user) {
			throw new WebError('Cannot find user');
		}

		const sessions = await RefreshToken.find({ user, active: true });

		if (!sessions) {
			throw new WebError('Cannot find sessions for current user');
		}

		return this.prepareSessions(sessions);
	}

	async deleteAllSessions ({ token, refreshToken }) {
		const user = await User.findOne({ _id: token.userId });

		await RefreshToken.update({
			user,
			refreshToken: { $ne: refreshToken },
			active: true,
		}, { $set: { active: false } }, { multi: true });

		return { status: 'done' };
	}

	async deleteByIdSession ({ id, token }) {
		const user = await User.findOne({ _id: token.userId });

		if (!user) {
			throw new WebError('Cannot find user');
		}

		const session = await RefreshToken.findOne({ user, _id: id, active: true });

		if (!session) {
			throw new WebError('Cannot find this session');
		}

		await RefreshToken.updateOne({ _id: session.id }, { active: false }, { runValidators: true });
		return { status: 'done' };
	}

	async create ({ email, password, confirmPassword, emailPreferences = false, phone, name }) {
		try {
			const invlidFields = [];

			if (!checkEmail(email)) {
				invlidFields.push({ name: 'email', value: email, message: 'email is invalid' });
			}

			if (password !== confirmPassword) {
				invlidFields.push({ name: 'password', value: password, message: 'Password need to be equal with Confirm Password' });
			}

			if (!checkPhone(phone)) {
				invlidFields.push({ name: 'phone', value: phone, message: 'Phone is invalid' });
			}

			if (!name) {
				invlidFields.push({ name: 'name', value: name, message: 'Please fill name' });
			}

			if (!name.first && name.first <= 1 && !checkName(name.first)) {
				invlidFields.push({ name: 'name.first', value: name.first, message: 'First name is invalid' });
			}

			if (!name.last && name.last <= 1 && !checkName(name.last)) {
				invlidFields.push({ name: 'name.last', value: name.last, message: 'Last name is invalid' });
			}

			if (invlidFields.length) {
				throw new ValidationError(invlidFields);
			}

			return await User.create({ email, password, phone, emailPreferences, name: { first: name.first, last: name.last } });
		} catch (err) {
			if (err.name === 'MongoError' && err.code === 11000) {
				throw new WebError('User already exists', 409);
			} else {
				throw err;
			}
		}
	}

	async activation ({ id }) {
		if (!id) {
			throw new ValidationError('please fill id');
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
};
