// Require modules
var connectRoles    = require('connect-roles');

// Require controllers
var searchController = require('../controllers/search');
var authController  = require('../controllers/auth');
var user            = require('../controllers/role');

var router          = require('express').Router(); // Create router

//ROUTES for COMMS
router.route('/')
  .get(searchController.searchComms) // Get a list of comms

module.exports = router;
