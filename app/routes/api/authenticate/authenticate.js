'use strict'

// ==== MAIN ROUTES FILE ====
const authController = require('../../../controllers/auth')
const router = require('express').Router() // create router

router.route('/')
  .post(authController.authenticate) // Authenticate any user. Returns a JWT. Allow access to all users

router.route('/refresh')
  .post(authController.verifyToken, authController.refreshToken)
  // Tokens have 1 week time expiration.
  // The app will refresh the token every time the app is opened, every hour or when significant changes come up
  // If a user doesn't open the app for a week, he'll have to login again, which is acceptable.

module.exports = router
