var express     = require('express');

var commsController = require('../controllers/comms');
var userController = require('../controllers/user');
var authController = require('../controllers/auth');
//==== ROUTES ====
// Create router at /api
var router = express.Router();

// http://localhost:3000/api
router.get('/', authController.verifyAccount, function(req, res) {
  res.json({ message: 'Commvs api root directory' });
});

//ROUTES for COMMS
router.route('/comms')
  .post(commsController.postComms)
  .get(commsController.getComms);

router.route('/comms/:comm_id')
  .get(commsController.getComm)
  .put(commsController.putComm)
  .delete(commsController.deleteComm);

// ROUTES for USERS
router.route('/users')
  .post(userController.postUsers)
  .get(authController.verifyAccount, userController.getUsers);

router.route('/users/:user_id')
  .delete(userController.deleteUsers);

router.route('/authenticate')
  .post(authController.authenticate);

  module.exports = router;
