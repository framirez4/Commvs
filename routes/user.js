// Require modules
var connectRoles    = require('connect-roles');

// Require controllers
var userController  = require('../controllers/user');
var authController  = require('../controllers/auth');
var user            = require('../controllers/role');

var router          = require('express').Router(); // Create router

// ROUTES for USERS
router.route('/')
  .post(userController.postUsers) // Creates new user - Anyone can post a new user - default type is 'user'.
  .put(authController.verifyToken, userController.editPassword)  //takes user from JWT and edits password
  .get(authController.verifyToken, user.can('access admin function'), userController.getUsers) // Admin - get a list of users
  .delete(authController.verifyToken, user.can('admin or owner'), userController.deleteUsers); // Admin or owner. only the admin or the account owner can delete the account

module.exports = router;
