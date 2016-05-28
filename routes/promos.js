// Require modules
var connectRoles    = require('connect-roles');

// Require controllers
var promosController = require('../controllers/promos');
var authController   = require('../controllers/auth');
var user             = require('../controllers/role');

var router           = require('express').Router(); // Create router

//ROUTES for COMMS
router.route('/')
  .get(promosController.getPromos); // Get a list of comms


router.route('/:comm_id')
  .post(authController.verifyToken, user.can('update an owned comm data'), promosController.postPromo) // Owner - Post a new promo
  .get(promosController.getPromo) // Get promos of a comm - Allowed for everyone
  .put(authController.verifyToken, user.can('update an owned comm data'), promosController.putPromo) // Owner - update a promo
  .delete(authController.verifyToken, user.can('update an owned comm data'), promosController.deletePromo); // Owner - delete a promo

module.exports = router;
