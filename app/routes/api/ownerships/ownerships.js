'use strict'

// Require modules
const connectRoles = require('connect-roles')

// Require controllers
const commsController = require('../../../lib/ownerships')
const authController = require('../../../lib/auth')
const user = require('../../../lib/role')

const router = require('express').Router() // Create router

// ROUTES for OWNERSHIPS
router.route('/:comm_id')
  .get(authController.verifyToken, user.can('update an owned comm data'), commsController.getOwnership) // Admin - generate an ownership code
  .post(authController.verifyToken, commsController.setOwnership)   // Allowed to every identified user, since it uses the logged account
  .delete(authController.verifyToken, commsController.removeOwnership)  // Allowed to every identified user, since it uses the logged account

module.exports = router
