// Require modules
const connectRoles    = require('connect-roles');

// Require controllers
const commsController = require('../controllers/commerces');
const authController  = require('../controllers/auth');
const user            = require('../controllers/role');

const router          = require('express').Router(); // Create router

//ROUTES for COMMS
router.route('/')
  .get(commsController.getComms) // Get a list of comms. Allow everyone
  .post(authController.verifyToken, user.can('run admin-only functions'), commsController.postComms); // Admin - Post a new comm

router.route('/:comm_id')
  .get(commsController.getComm) // Get info of a comm. Allow everyone
  .put(authController.verifyToken, user.can('update an owned comm data'), commsController.putComm) // Allow Admin/Owner - update a comm
  .delete(authController.verifyToken, user.can('run admin-only functions'), commsController.deleteComm); // Admin - delete a comm

module.exports = router;
