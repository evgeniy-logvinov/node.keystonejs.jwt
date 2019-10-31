var keystone = require('keystone');
const crypto = require('crypto')
const { promisify } = require('util')
const Types = keystone.Field.Types

const Token = new keystone.List('Token', {
	nocreate: true,
	noedit: true,
	hidden: true,
})

Token.add({
	token: { type: String },
	createdDate: { type: Date, default: Date.now, required: true },
	user: { type: Types.Relationship, ref: 'User', required: true }
})

Token.schema.pre('save', function (next) {
	promisify(crypto.randomBytes)(128).then(
		random => {
			this.token = `${crypto.createHash('sha256').update(random).digest('base64')}`
			next()
		}
	)
})

Token.defaultColumns = 'token, user, createdDate'

Token.register()
