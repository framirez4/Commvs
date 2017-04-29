'use strict'

// Require modules
const connectRoles = require('connect-roles')

// Require controllers
const bookmarksController = require('../../../lib/bookmarks')
const authController = require('../../../lib/auth')

const router = require('express').Router() // Create router

// ROUTES for COMMS
router.route('/:comm_id')
  // .get(authController.verifyToken, bookmarksController.getbookmarks) // Get a list of Bookmark comms
  .post(authController.verifyToken, bookmarksController.postBookmark) // Add a new Bookmark
  .delete(authController.verifyToken, bookmarksController.deleteBookmark) // Remove a Bookmark

module.exports = router
