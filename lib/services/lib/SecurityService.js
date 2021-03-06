var keystone = require('keystone');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { WebError, UnauthorizedAccessError } = requireRoot('lib/errors');

const UserService = require('./UserService');
const User = keystone.list('User').model;
const RefreshToken = keystone.list('RefreshToken').model;
const nodemailer = require('nodemailer');

module.exports = class SecurityService {

	async signup ({ email, password, confirmPassword, emailPreferences, phone, name }) {
		const user = await new UserService().create({ email, password, confirmPassword, emailPreferences, phone, name });

		if (process.env.SMTP_HAS_EMAIL_ACTIVATION === 'true') {
			await this.emailReminder(user);
		}

		return { id: user._id };
	}

	async activation ({ id }) {
		return await new UserService().activation({ id }); ;
	}

	async signin ({ email, password }, { userAgent, ip }) {
		const user = await User.findOne({ email });

		if (!user) {
			throw new UnauthorizedAccessError();
		}

		if (!await promisify(user._.password.compare)(password)) {
			throw new UnauthorizedAccessError();
		}

		// TODO: Check for different users
		const refreshTokens = await RefreshToken.find({ user, active: true });

		// A lot of refresh tokens. Not more than 5. If more - we delete this tokens to prevent token catch (Sessions)
		if (refreshTokens.length > 5) {
			try {
				await RefreshToken.updateMany({ user }, { $set: { active: false } }), { runValidators: true };
			} catch (err) {
				throw new WebError('Cannot delete Tokens');
			}
		}

		const data = await RefreshToken.create({ user, active: true, userAgent, ip });

		return this.getLoginResponse(this.signInToken(user._id), data);
	}

	async token ({ refreshToken }) {
		if (!refreshToken) {
			throw new UnauthorizedAccessError();
		}

		const refreshTokens = await RefreshToken.find({ refreshToken, active: true });

		if (refreshTokens.length !== 1) {
			throw new UnauthorizedAccessError();
		}

		if (refreshTokens[0].expiredInDate.getTime() - new Date().getTime() <= 0) {
			throw new UnauthorizedAccessError();
		}

		await RefreshToken.updateOne({ refreshToken }, { lastAction: Date.now() }, { runValidators: true });

		return { token: this.signInToken(refreshTokens[0].user) };
	}

	async verify ({ token }) {
		if (!token || token.indexOf('Bearer ') !== 0) {
			throw new UnauthorizedAccessError();
		}

		token = token.substring('Bearer '.length);

		if (token) {
			try {
				return await jwt.verify(token, process.env.JWT_SECRET);
			} catch (err) {
				if (err instanceof jwt.JsonWebTokenError) {
					throw new UnauthorizedAccessError();
				}

				throw new WebError('Something wrong on server', 400);
			}
		} else {
			throw new UnauthorizedAccessError();
		}
	}

	async signout ({ refreshToken }) {
		if (!refreshToken) {
			throw new UnauthorizedAccessError();
		}

		const activeRefreshTokens = await RefreshToken.findOne({ refreshToken, active: true });

		if (!activeRefreshTokens) {
			throw new UnauthorizedAccessError();
		}

		await this.inactivateRefreshToken({ refreshToken });

		return { status: 'Signed out' };
	}

	async refresh ({ refreshToken }, { userAgent, ip }) {
		if (!refreshToken) {
			throw new UnauthorizedAccessError();
		}

		const refreshTokens = await RefreshToken.find({ refreshToken, active: true });

		if (refreshTokens.length !== 1) {
			throw new UnauthorizedAccessError();
		}

		if (refreshTokens[0].expiredInDate.getTime() - new Date().getTime() <= 0) {
			await this.inactivateRefreshToken({ refreshToken });
			throw new UnauthorizedAccessError();
		}

		// If we want, we can remove refreshToken which try to get token to early
		// if (refreshTokens[0].expiredInDate.getTime() - new Date().getTime() > 3000) {
		// 	throw new UnauthorizedAccessError();
		// }

		await this.inactivateRefreshToken({ refreshToken });

		const data = await RefreshToken.create({ user: refreshTokens[0].user, active: true, userAgent, ip });
		return this.getLoginResponse(this.signInToken(refreshTokens[0].user), data);
	}

	async inactivateRefreshToken ({ refreshToken }) {
		try {
			await RefreshToken.updateOne({ refreshToken }, { active: false }, { runValidators: true });
		} catch (err) {
			throw new WebError('Cannot delete Token');
		}
	}

	signInToken (userId) {
		return jwt.sign({ userId }, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: process.env.JWT_TOKEN_LIFE });
	}

	getLoginResponse (token, refreshToken) {
		return {
			status: 'Logged in',
			token: token,
			tokenExpiredIn: new Date(Date.now() + +process.env.JWT_TOKEN_LIFE),
			tokenExpiredLife: process.env.JWT_TOKEN_LIFE,
			refreshToken: refreshToken.refreshToken,
			refreshExpiredLife: process.env.JWT_REFRESH_TOKEN_LIFE || 86400,
			refreshExpiredIn: refreshToken.expiredInDate,
		};
	}

	async emailReminder (userAccount) {
		try {
			let transporter = nodemailer.createTransport({
				host: process.env.SMTP_HOST || 'smtp.googlemail.com',
				port: process.env.SMTP_PORT || 465,
				secure: +process.env.SMTP_PORT === 465, // this is true as port is 465
				auth: {
					user: process.env.SMTP_MAIL || 'account@host',
					pass: process.env.SMTP_PASS,
				},
			});

			// create template based sender function
			let message = {
				from: `"${process.env.SMTP_SERVICE_NAME}" <${process.env.SMTP_MAIL || 'account@host'}>`,
				to: userAccount.email, // Recepient email address. Multiple emails can send separated by commas
				subject: 'Account activation',
				text: `Hello, ${userAccount.name.first} ${userAccount.name.last}! Please activate you account using by this link ${process.env.SMTP_ACTIVATION_ADDRESS || 'http://localhost:3000'}/${userAccount._id} (copy and past to browser)`,
				html: `Hello, <strong>${userAccount.name.first} ${userAccount.name.last}</strong>! Please activate you account by this link <p><a href="${process.env.SMTP_ACTIVATION_ADDRESS || 'http://localhost:3000'}/${userAccount._id}">Activate</a></p>`,
			};

			// use template based sender to send a message
			await transporter.sendMail(message);
		} catch (err) {
			throw new WebError('Cannot send message');
		}
	}
};
