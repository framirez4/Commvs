// Require modules
var connectRoles    = require('connect-roles');

// Require controllers
var userController  = require('../controllers/user');
var authController  = require('../controllers/auth');
var user            = require('../controllers/role');

var router          = require('express').Router(); // Create router

// ROUTES for USERS
router.route('/')
  .post(userController.postUsers) // Create new user
  .put(authController.verifyToken, userController.editPassword)
  .get(authController.verifyToken, user.can('access admin function'), userController.getUsers) // Admin - get a list of users
  .delete(authController.verifyToken, user.can('access admin function'), userController.deleteUsers); // Admin - retrieve a user

module.exports = router;
