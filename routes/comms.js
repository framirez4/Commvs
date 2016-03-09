// Require modules
var connectRoles    = require('connect-roles');

// Require controllers
var commsController = require('../controllers/comms');
var authController  = require('../controllers/auth');
var user            = require('../controllers/role');

var router          = require('express').Router(); // Create router

//ROUTES for COMMS
router.route('/')
  .get(commsController.getComms)
  .post(authController.verifyToken, user.can('access admin function'), commsController.postComms);

router.route('/:comm_id')
  .get(commsController.getComm)
  .put(authController.verifyToken, user.can('access admin function'), commsController.putComm)
  .delete(authController.verifyToken, user.can('access admin function'), commsController.deleteComm);

router.route('/:comm_id/ownerkey')
  .get(authController.verifyToken, user.can('access admin function'), commsController.getOwnerKey)
  .post(commsController.setOwnerKey);

module.exports = router;
