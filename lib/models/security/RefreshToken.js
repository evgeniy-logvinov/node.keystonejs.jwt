var keystone = require('keystone');
const crypto = require('crypto')
const { promisify } = require('util')
const Types = keystone.Field.Types

const RefreshToken = new keystone.List('RefreshToken', {
	nocreate: true,
	noedit: true,
	hidden: true,
})

RefreshToken.add({
	refreshToken: { type: String },
	createdDate: { type: Date, default: Date.now, required: true },
	//TODO: check token life time
	expiredInDate: { type: Date, default: new Date(Date.now() + +process.env.JWT_REFRESH_TOKEN_LIFE), required: true },
	browser: { type: String },
	user_agent: { type: String },
	os: { type: String },
	ip: { type: String },
	user: { type: Types.Relationship, ref: 'User', required: true }
})

RefreshToken.schema.pre('save', function (next) {
	promisify(crypto.randomBytes)(256).then(
		random => {
			this.refreshToken = `${crypto.createHash('sha256').update(random).digest('base64')}`
			next()
		}
	)
})

RefreshToken.defaultColumns = 'refreshToken, user, createdDate'

RefreshToken.register()
