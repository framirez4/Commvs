'use strict'

// Require modules
const connectRoles = require('connect-roles')

// Require controllers
const searchController = require('../../../lib/search')
const authController = require('../../../lib/auth')
const user = require('../../../lib/role')

const router = require('express').Router() // Create router

// ROUTES for COMMS
router.route('/')
  .get(searchController.searchCommerces) // Get a list of comms

module.exports = router
