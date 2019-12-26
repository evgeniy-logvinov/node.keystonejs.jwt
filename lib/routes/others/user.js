const express = require('express');
const { authenticate } = require('../lib/middleware');
const { userService } = requireRoot('lib/services');
const { getRefreshToken } = requireRoot('lib/utility');

const router = express.Router();

router.get('/user', authenticate(),
	async (req, res, next) => {
		try {
			const user = await userService.getUser({ token: req.token });
			res.status(200).send(user);
		} catch (e) {
			next(e);
		}
	});

router.get('/sessions', authenticate(),
	async (req, res, next) => {
		try {
			const user = await userService.getSessions({ token: req.token });
			res.status(200).send(user);
		} catch (e) {
			next(e);
		}
	});

router.delete('/sessions/delete/:id', authenticate(),
	async (req, res, next) => {
		try {
			const id = req.params.id;
			const user = await userService.deleteByIdSession({ id, token: req.token });
			res.status(200).send(user);
		} catch (e) {
			next(e);
		}
	});

router.delete('/sessions/delete-all', authenticate(),
	async (req, res, next) => {
		try {
			const refreshToken = getRefreshToken(req);
			const user = await userService.deleteAllSessions({ token: req.token, refreshToken });
			res.status(200).send(user);
		} catch (e) {
			next(e);
		}
	});

module.exports = router;
