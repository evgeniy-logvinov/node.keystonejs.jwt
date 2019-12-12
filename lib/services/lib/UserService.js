const _ = require('lodash')
var keystone = require('keystone');

const AbstractService = require('./AbstractService')
const User = keystone.list('User').model
const { WebError } = requireRoot('lib/errors')
const nodemailer = require("nodemailer");
// var smtpTransport = require('nodemailer-smtp-transport');

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

		const userAccount = await User.create({ email, password, phone, emailPreferences, name: { first: name.first, last: name.last } });
		if (process.env.SMTP_HAS_EMAIL_ACTIVATION === 'true') {
			await this.emailReminder(userAccount);
		}

		return { success: 'Done' };
	}

	async emailReminder(userAccount) {
		let transporter = nodemailer.createTransport({
			host: process.env.SMTP_HOST,
			port: process.env.SMTP_PORT,
			secure: true, // this is true as port is 465
			auth: {
				user: process.env.SMTP_MAIL,
				pass: process.env.SMTP_PASS,
			}
		});

		// create template based sender function
		let message = {
			from: `"${process.env.SMTP_SERVICE_NAME}" <${process.env.SMTP_MAIL}>`,
			to: userAccount.email, // Recepient email address. Multiple emails can send separated by commas
			subject: 'Account activation',
			text: `Hello, ${userAccount.name.first} ${userAccount.name.last}! Please activate you account using by this link ${process.env.SMTP_ACTIVATION_ADDRESS}/${userAccount._id} (copy and past to browser)`,
			html: `Hello, <strong>${userAccount.name.first} ${userAccount.name.last}</strong>! Please activate you account by this link <p><a href="${process.env.SMTP_ACTIVATION_ADDRESS}/${userAccount._id}">Activate</a></p>`,
		}

		// use template based sender to send a message
		try {
			await transporter.sendMail(message);
		} catch (err) {
			throw new WebError('Cannot send message');
		}
	}
}

module.exports = UserService
