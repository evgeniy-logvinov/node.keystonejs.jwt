const express = require('express')
const { securityService } = requireRoot('lib/services')

const router = express.Router()

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body

  try {
    const token = await securityService.login({
      email: email,
      password
    })
    res.send(token)
  } catch (e) {
    next(e);
  }
})

router.post('/logout', async (req, res, next) => {
  const { authorization } = req.headers
  try {
    await securityService.logout({
      token: authorization
    })

    res.send({
      ok: true
    })
  } catch (e) {
    next(e);
  }
})

router.post('/refresh', async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
  try {
    const data = await securityService.refresh({token})
    console.log(data)
    res.send(data)
  } catch (e) {
    next(e);
  }
})

module.exports = router
