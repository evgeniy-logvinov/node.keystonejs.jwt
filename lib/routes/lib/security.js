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
    res.send({
      token: token.token,
      refreshToken: token.refreshToken,
      user: {
        _id: token.user._id,
        email: token.user.email
      }
    })
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

module.exports = router
