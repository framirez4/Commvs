var express     = require('express');
var connectRoles = require('connect-roles');

var userController = require('../controllers/user');
var authController = require('../controllers/auth');
var user = require('../controllers/role');

var router = express.Router(); //create router

// ROUTES for USERS
router.route('/')
  .post(userController.postUsers)
  .get(authController.verifyToken, user.can('access admin function'), userController.getUsers);

router.route('/:user_id')
  .delete(authController.verifyToken, user.can('access admin function'), userController.deleteUsers);

module.exports = router;
