var express     = require('express');
var connectRoles = require('connect-roles');

var commsController = require('../controllers/comms');
var authController = require('../controllers/auth');
var user = require('../controllers/role');

var router = express.Router(); //create router

//ROUTES for COMMS
router.route('/')
  .post(authController.verifyToken, user.can('access admin function'), commsController.postComms)
  .get(commsController.getComms);

router.route('/:comm_id')
  .get(commsController.getComm)
  .put(authController.verifyToken, user.can('access admin function'), commsController.putComm)
  .delete(authController.verifyToken, user.can('access admin function'), commsController.deleteComm);

router.route('/:comm_id/ownerkey')
  .get(authController.verifyToken, user.can('access admin function'), commsController.getOwnerKey)
  .post(commsController.setOwnerKey);

module.exports = router;
