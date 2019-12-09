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
  const refreshToken = req.body.refreshToken || req.query.refreshToken || req.headers['x-refresh-token'] || req.headers.refreshToken;
  try {
    const logout = await securityService.logout({ refreshToken })

    res.send(logout)
  } catch (e) {
    next(e);
  }
})

router.get('/token', async (req, res, next) => {
  const refreshToken = req.body.refreshToken || req.query.refreshToken || req.headers['x-refresh-token'] || req.headers.refreshToken;
  try {
    const token = await securityService.token({ refreshToken })
    res.send(token)
  } catch (e) {
    next(e);
  }
})

router.post('/refresh', async (req, res, next) => {
  const refreshToken = req.body.refreshToken || req.query.refreshToken || req.headers['x-refresh-token'] || req.headers.refreshToken;
  try {
    const newRefreshToken = await securityService.refresh({ refreshToken })
    res.send(newRefreshToken)
  } catch (e) {
    next(e);
  }
})

module.exports = router
