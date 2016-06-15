// Require modules
var connectRoles    = require('connect-roles');

// Require controllers
var commsController = require('../controllers/ownerships');
var authController  = require('../controllers/auth');
var user            = require('../controllers/role');

var router          = require('express').Router(); // Create router

//ROUTES for OWNERSHIPS
router.route('/:comm_id')
  .get(authController.verifyToken, user.can('update an owned comm data'), commsController.getOwnership) // Admin - generate an ownership code
  .post(authController.verifyToken, commsController.setOwnership)   // Allowed to every identified user, since it uses the logged account
  .delete(authController.verifyToken, commsController.removeOwnership);  // Allowed to every identified user, since it uses the logged account
module.exports = router;
