var keystone = require('keystone');
const jwt = require('jsonwebtoken')
const { promisify } = require('util')
const { WebError, RestApiError } = requireRoot('lib/errors')

const AbstractService = require('./AbstractService')
const User = keystone.list('User').model
const RefreshToken = keystone.list('RefreshToken').model
const tokenList = {}

class SecurityService extends AbstractService {
	async login({ email, password }) {
		const userForToken = {
			"email": email,
			"password": password
		}

		const user = await User
			.findOne({ email })

		if (!user) {
			throw new WebError('Wrong credentials', 401)
		}

		if (!await promisify(user._.password.compare)(password)) {
			throw new WebError('Wrong credentials', 401)
		}

		// TODO: Check for different users
		const refreshTokens = await RefreshToken.find({user})
		// A lot of refresh tokens. Not more than 5. If more - we delete this tokens (Sessions)

		if (refreshTokens.length > 5) {
			try {
				await RefreshToken.deleteMany({user});
			} catch (err) {
				throw new WebError('Cannot delete Tokens');
			}
		}

		const data = await RefreshToken
			.create({ user })
		console.log('data', data)
		// return Token
		// 	.findOne({ _id: token._id })
		// 	.populate('user')

		// do the database authentication here, with user name and password combination.
		const token = jwt.sign(userForToken, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: process.env.JWT_TOKEN_LIFE })
		// const refreshToken = jwt.sign(userForToken, process.env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: process.env.JWT_REFRESH_TOKEN_LIFE })
		const response = {
			"status": "Logged in",
			"token": token,
			"tokenExpiredIn": process.env.JWT_TOKEN_LIFE,
			"refreshToken": data.refreshToken,
			"refreshExpiredIn": process.env.JWT_REFRESH_TOKEN_LIFE,
		}

		// TODO: put token here to DB ()
		// tokenList[refreshToken] = response
		// console.log(tokenList[refreshToken])
		console.log('tokenList', tokenList);
		console.log('response', response);
		return response;
	}

	async token({ refreshToken }) {
		// if (!containsToken) {

		// }

		const user = {
			"email": email,
			"password": password
		}
		// do the database authentication here, with user name and password combination.
		const token = jwt.sign(user, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: process.env.JWT_TOKEN_LIFE })

		try {
			return await jwt.verify(token, process.env.JWT_SECRET);
			console.log(data);
		} catch (err) {
			if (err instanceof jwt.JsonWebTokenError) {
				throw new WebError('Wrong credentials', 401)
			}
			throw new WebError('Something wrong on server', 400)
		}
	}

	async verify({ token }) {
		console.log(token)
		console.log(process.env.JWT_TOKEN_LIFE)
		if (!token || token.indexOf('Bearer ') !== 0) {
			throw new WebError('Wrong credentials', 401)
		}
		// Remove Bearer from string
		token = token.substring('Bearer '.length);

		if (token) {
			try {
				return await jwt.verify(token, process.env.JWT_SECRET);
				console.log(data);
			} catch (err) {
				if (err instanceof jwt.JsonWebTokenError) {
					throw new WebError('Wrong credentials', 401)
				}
				throw new WebError('Something wrong on server', 400)
			}
			// 	jwt.verify(token, config.secret, (err, decoded) => {
			// 	  if (err) {
			// 		return res.json({
			// 		  success: false,
			// 		  message: 'Token is not valid'
			// 		});
			// 	  } else {
			// 		req.decoded = decoded;
			// 		next();
			// 	  }
			// 	});
			//   } else {
			// 	return res.json({
			// 	  success: false,
			// 	  message: 'Auth token is not supplied'
			// 	});
		} else {
			throw new WebError('Wrong credentials', 401)
		}

		// jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET, (err, decoded) => {
		// 	if (err) {
		// 		next(err);
		// 		// return res.status(401).json({ "error": true, "message": 'Unauthorized access.' });
		// 	}
		// 	req.decoded = decoded;
		// 	next();
		// });

		// const userToken = await Token
		// 	.findOne({
		// 		token: token
		// 			.substring('Bearer '.length)
		// 	})
		// 	.populate({ path: 'user' })

		// if (!userToken) {
		// 	throw new WebError('Wrong credentials', 401)
		// }

		// return data;
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

	async refresh({ token }) {
		console.log(token);
		if (!token) {
			throw new WebError('Wrong credentials', 401)
		}

		token = token.substring('Bearer '.length);

		if (token) {
			var payload
			try {
				payload = await jwt.verify(token, process.env.JWT_SECRET)
				console.log(payload);
			} catch (e) {
				console.log(e)
				if (e instanceof jwt.JsonWebTokenError) {
					throw new WebError('Wrong credentials', 401)
				}
				throw new WebError('Something wrong on server', 401)
			}
			// We ensure that a new token is not issued until enough time has elapsed
			// In this case, a new token will only be issued if the old token is within
			// 30 seconds of expiry. Otherwise, return a bad request status
			const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
			console.log('test', nowUnixSeconds, payload, payload.exp - nowUnixSeconds)
			// TODO:
			// if (payload.exp - nowUnixSeconds > 30) {
			// 	throw new WebError('Wrong credentials', 401)
			// }

			// Now, create a new token for the current user, with a renewed expiration time
			const user = {
				"email": payload.email,
				"password": payload.password
			}
			const newToken = jwt.sign(user, process.env.JWT_SECRET, {
				algorithm: 'HS256',
				expiresIn: process.env.JWT_TOKEN_LIFE
			})
			const response = {
				"status": "Logged in",
				"token": token,
				"refreshToken": refreshToken,
			}

			// Set the new token as the users `token` cookie
			return response;
			// return newToken, { maxAge: process.env.JWT_TOKEN_LIFE * 1000 })
		} else {
			throw new WebError('Wrong credentials', 401)
		}
	}
}

module.exports = SecurityService
