const _ = require('lodash');
var keystone = require('keystone');

const User = keystone.list('User').model;
const RefreshToken = keystone.list('RefreshToken').model;
const { WebError } = requireRoot('lib/errors');

module.exports = class UserService {

	prepareSessions(sessions) {
		return sessions.map(session => (
			{
				id: session.id,
				userAgent: session.userAgent,
				ip: session.ip,
				createdAt: session.createdDate,
				lastActionAt: session.lastActionAt,
			}))
	}

	async getUser({ token }) {
		return await User.findOne({ _id: token.userId });;
	}

	async getSessions({ token }) {
		const user = await User.findOne({ _id: token.userId });
		const sessions = await RefreshToken.find({ user, active: true });

		return this.prepareSessions(sessions);
	}

	async deleteAllSessions({ token, refreshToken }) {
		const user = await User.findOne({ _id: token.userId });

		await RefreshToken.update({
			user,
			refreshToken: { $ne: refreshToken },
			active: true
		}, { "$set": { active: false } }, { "multi": true });

		return { status: 'done' };
	}

	async deleteByIdSession({ id, token }) {
		const user = await User.findOne({ _id: token.userId });
		const session = await RefreshToken.findOne({ user, _id: id, active: true });

		if (!session) {
			throw new WebError('Cannot find this session');
		}

		await RefreshToken.updateOne({ _id: session.id }, { active: false }, { runValidators: true });
		return { status: 'done' };
	}

	async create({ email, password, confirmPassword, emailPreferences = false, phone, name }) {
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

	async activation({ id }) {
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
