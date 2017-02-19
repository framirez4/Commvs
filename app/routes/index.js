'use strict'

// ==== MAIN ROUTES FILE ====
const router = require('express').Router() // create router
const api = require('./api')

// Test root route
router.get('/', function (req, res) {
  res.json({
    message: 'Kapeloi root directory for API v1. More info at Github repository.',
    repository: 'htttps://github.com/framirez4/kapeloi-server'
  })
})

// Main mounted routes
router.use('/commerces', api.commerces)
router.use('/promos', api.promos)
router.use('/users', api.users)
router.use('/bookmarks', api.bookmarks)
router.use('/ownership', api.ownership)
router.use('/authenticate', api.authenticate) // Authenticate any user. Returns a JWT.
router.use('/search', api.search)

module.exports = router
