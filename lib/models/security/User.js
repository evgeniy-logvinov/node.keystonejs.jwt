var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
var User = new keystone.List('User', { track: true });

User.add({
	name: { type: Types.Name, required: true, index: true },
	phone: { type: Types.Text, min: 9, max: 20, initial: true },
	activated: { type: Boolean, initial: true, default: process.env.SMTP_HAS_EMAIL_ACTIVATION !== 'true' },
	email: { type: Types.Email, initial: true, required: true, unique: true, index: true },
	emailPreferences: { type: Boolean, initial: true, required: true, default: true },
	password: { type: Types.Password, initial: true, required: true },
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function () {
	return this.isAdmin;
});

/**
 * Registration
 */
User.defaultColumns = 'name, email, isAdmin';
User.register();
