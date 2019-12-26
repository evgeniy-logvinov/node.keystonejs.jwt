const express = require('express');
const { securityService } = requireRoot('lib/services');
const { getRefreshToken, getClientInfo } = requireRoot('lib/utility');

const router = express.Router();

router.post('/signup', async (req, res, next) => {
	try {
		const { email, password, confirmPassword, emailPreferences, phone, name } = req.body;
		const token = await securityService.signup({ email, password, confirmPassword, emailPreferences, phone, name });
		res.send(token);
	} catch (e) {
		next(e);
	}
});

router.get('/signup/activation/:id', async (req, res, next) => {
	try {
		const { id } = req.params;
		const result = await securityService.activation({ id });
		res.send(result);
	} catch (e) {
		next(e);
	}
});

router.post('/signin', async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const token = await securityService.signin({ email, password }, getClientInfo(req));
		res.send(token);
	} catch (e) {
		next(e);
	}
});

router.post('/signout', async (req, res, next) => {
	try {
		const refreshToken = getRefreshToken(req);
		const logout = await securityService.signout({ refreshToken });
		res.send(logout);
	} catch (e) {
		next(e);
	}
});

router.get('/token', async (req, res, next) => {
	try {
		const refreshToken = getRefreshToken(req);
		const token = await securityService.token({ refreshToken });
		res.send(token);
	} catch (e) {
		next(e);
	}
});

router.post('/refresh', async (req, res, next) => {
	try {
		const refreshToken = getRefreshToken(req);
		const newRefreshToken = await securityService.refresh({ refreshToken }, getClientInfo(req));
		res.send(newRefreshToken);
	} catch (e) {
		next(e);
	}
});

module.exports = router;
