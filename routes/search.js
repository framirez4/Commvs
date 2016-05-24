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
  //.post(authController.verifyToken, user.can('access admin function'), commsController.postComms); // Admin - Post a new comm

/*router.route('/:comm_id')
  .get(commsController.getComm) // Get info of a comm
  //.put(authController.verifyToken, user.can('access admin function'), commsController.putComm) // Admin/Owner - update a comm
  //.delete(authController.verifyToken, user.can('access admin function'), commsController.deleteComm); // Admin - delete a comm
*/
module.exports = router;
