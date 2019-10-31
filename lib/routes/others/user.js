const express = require('express')
const { authenticate } = require('../lib/middleware')
const { userService } = requireRoot('lib/services')

const router = express.Router()

router.get('/user', authenticate(),
	async (req, res, next) => {
		try {
			const user = await userService.getUser({ token: req.token })
			res.status(200).send(user)
		} catch (e) {
			next(e);
		}
	})

router.post('/user', authenticate(),
	async (req, res, next) => {
		try {
			const { email, phone, name } = req.body;
			const result = await userService.updateUser({ token: req.token, email, phone, name })
			res.status(200).send(result)
		} catch (e) {
			next(e);
		}
	})

router.put('/user',
	async (req, res, next) => {
		try {
			const { email, password, name } = req.body;
			await userService.createUser({ email, password, name })
			res.status(200).send('Done');
		} catch (e) {
			next(e);
		}
	})

module.exports = router;
