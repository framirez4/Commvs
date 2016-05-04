// ==== MAIN ROUTES FILE ====
var authController = require('../controllers/auth');
var connectRoles    = require('connect-roles');

var router = require('express').Router(); //create router


router.route('/')
.post(authController.authenticate); // Authenticate any user. Returns a JWT.

module.exports = router;
