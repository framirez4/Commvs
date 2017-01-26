// Require modules
const connectRoles    = require('connect-roles');

// Require controllers
const favsController  = require('../controllers/favs');
const authController  = require('../controllers/auth');
const user            = require('../controllers/role');

const router          = require('express').Router(); // Create router

//ROUTES for COMMS
router.route('/:comm_id')
  //.get(authController.verifyToken, favsController.getFavs) // Get a list of fav comms
  .post(authController.verifyToken, favsController.postFav) // Add a new fav
  .delete(authController.verifyToken, favsController.deleteFav); // Remove a fav

module.exports = router;
