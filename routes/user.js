// Require modules
var connectRoles    = require('connect-roles');

// Require controllers
var userController  = require('../controllers/user');
var authController  = require('../controllers/auth');
var user            = require('../controllers/role');

var router          = require('express').Router(); // Create router

// ROUTES for USERS
router.route('/')
  .post(userController.postUsers)
  .get(authController.verifyToken, user.can('access admin function'), userController.getUsers);

router.route('/:user_id')
  .delete(authController.verifyToken, user.can('access admin function'), userController.deleteUsers);

module.exports = router;
