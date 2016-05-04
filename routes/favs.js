// Require modules
var connectRoles    = require('connect-roles');

// Require controllers
var favsController  = require('../controllers/favs');
var authController  = require('../controllers/auth');
var user            = require('../controllers/role');

var router          = require('express').Router(); // Create router

//ROUTES for COMMS
router.route('/')
  //.get(authController.verifyToken, favsController.getFavs) // Get a list of fav comms
  .post(authController.verifyToken, favsController.postFav) // Add a new fav
  .delete(authController.verifyToken, favsController.deleteFav); // Remove a fav

module.exports = router;
