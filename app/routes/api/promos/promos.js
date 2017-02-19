'use strict'

// Require modules
const connectRoles = require('connect-roles')

// Require controllers
const promosController = require('../../../controllers/promos')
const authController = require('../../../controllers/auth')
const user = require('../../../controllers/role')

const router = require('express').Router() // Create router

// ROUTES for COMMS
router.route('/')
  .get(promosController.getPromos) // Get a list of comms

router.route('/:comm_id')
  .post(authController.verifyToken, user.can('update an owned comm data'), promosController.postPromo) // Owner - Post a new promo
  .get(promosController.getPromo) // Get promos of a comm - Allowed for everyone
  .put(authController.verifyToken, user.can('update an owned comm data'), promosController.putPromo) // Owner - update a promo
  .delete(authController.verifyToken, user.can('update an owned comm data'), promosController.deletePromo) // Owner - delete a promo

module.exports = router
