// Require modules
var connectRoles    = require('connect-roles');

// Require controllers
var userController  = require('../controllers/users');
var authController  = require('../controllers/auth');
var user            = require('../controllers/role');

var router          = require('express').Router(); // Create router

// ROUTES for USERS
router.route('/')
  .post(userController.postUsers) // Creates new user - Anyone can post a new user - default type is 'user'.

  .get(authController.verifyToken, user.can('run admin-only functions'), userController.getUsers) // Admin - get a list of users
  .delete(authController.verifyToken, user.can('run admin-only functions'), userController.deleteUsers); // Admin or owner. only the admin or the account owner can delete the account

router.route('/me') //Always uses the authenticated user
  .get(authController.verifyToken, userController.getMe) // Admin - get a list of users
router.route('/me/profile')
  .put(authController.verifyToken, userController.editUser)  //takes user from JWT and edits password
router.route('/me/password')
  .put(authController.verifyToken, userController.editPassword)  //takes user from JWT and edits password
module.exports = router;
