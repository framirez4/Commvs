// Require modules
const connectRoles    = require('connect-roles');

// Require controllers
const searchController = require('../controllers/search');
const authController  = require('../controllers/auth');
const user            = require('../controllers/role');

const router          = require('express').Router(); // Create router

//ROUTES for COMMS
router.route('/')
  .get(searchController.searchComms); // Get a list of comms

module.exports = router;
