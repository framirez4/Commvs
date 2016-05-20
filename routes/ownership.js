// Require modules
var connectRoles    = require('connect-roles');

// Require controllers
var commsController = require('../controllers/ownerships');
var authController  = require('../controllers/auth');
var user            = require('../controllers/role');

var router          = require('express').Router(); // Create router

//ROUTES for OWNERSHIPS
router.route('/:comm_id')
  .get(authController.verifyToken, user.can('access admin function'), commsController.getOwnership) // Admin - generate an ownership code
  .post(authController.verifyToken, commsController.setOwnership)
  .delete(authController.verifyToken, commsController.removeOwnership);
module.exports = router;
