// Require modules
var connectRoles    = require('connect-roles');

// Require controllers
var commsController = require('../controllers/comms');
var authController  = require('../controllers/auth');
var user            = require('../controllers/role');

var router          = require('express').Router(); // Create router

//ROUTES for COMMS
router.route('/')
  .get(commsController.getComms) // Get a list of comms
  .post(authController.verifyToken, user.can('access admin function'), commsController.postComms); // Admin - Post a new comm

router.route('/:comm_id')
  .get(commsController.getComm) // Get info of a comm
  .put(authController.verifyToken, user.can('access admin function'), commsController.putComm) // Admin/Owner - update a comm
  .delete(authController.verifyToken, user.can('access admin function'), commsController.deleteComm); // Admin - delete a comm

router.route('/:comm_id/ownerkey')
  .get(authController.verifyToken, user.can('access admin function'), commsController.getOwnerKey) // Admin - generate an ownership code
  .post(commsController.setOwnerKey); // Owner - validate an ownership code

module.exports = router;
