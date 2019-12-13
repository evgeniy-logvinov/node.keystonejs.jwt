const express = require('express');
const { authenticate } = require('../lib/middleware');
const { userService } = requireRoot('lib/services');

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

module.exports = router;
