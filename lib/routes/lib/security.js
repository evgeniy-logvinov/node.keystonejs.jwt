const express = require('express');
const { securityService } = requireRoot('lib/services');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
	const { email, password, confirmPassword, emailPreferences, phone, name } = req.body;

	try {
		const token = await securityService.signup({ email, password, confirmPassword, emailPreferences, phone, name: JSON.parse(name) });
		res.send(token);
	} catch (e) {
		next(e);
	}
});

router.get('/signup/activate/:id', async (req, res, next) => {
	const { id } = req.params;
	try {
		const result = await securityService.activate({ id });
		res.send(result);
	} catch (e) {
		next(e);
	}
});

router.post('/signin', async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const token = await securityService.signin({ email, password }, getClientInfo(req));
		res.send(token);
	} catch (e) {
		next(e);
	}
});

router.post('/signout', async (req, res, next) => {
	const refreshToken = getRefreshToken(req);

	try {
		const logout = await securityService.signout({ refreshToken });
		res.send(logout);
	} catch (e) {
		next(e);
	}
});

router.get('/token', async (req, res, next) => {
	const refreshToken = getRefreshToken(req);

	try {
		const token = await securityService.token({ refreshToken });
		res.send(token);
	} catch (e) {
		next(e);
	}
});

router.post('/refresh', async (req, res, next) => {
	const refreshToken = getRefreshToken(req);

	try {
		const newRefreshToken = await securityService.refresh({ refreshToken }, getClientInfo(req));
		res.send(newRefreshToken);
	} catch (e) {
		next(e);
	}
});

const getRefreshToken = (req) => req.body.refreshToken || req.query.refreshToken || req.headers['x-refresh-token'] || req.headers.refreshToken;
const getClientInfo = (req) => {
	const userAgent = req.headers['user-agent'];
	const ip = req.headers['x-forwarded-for']
    || req.connection.remoteAddress
    || req.socket.remoteAddress
    || (req.connection.socket ? req.connection.socket.remoteAddress : null);
	return { userAgent, ip };
};


module.exports = router;
