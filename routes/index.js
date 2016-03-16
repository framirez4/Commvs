// ==== MAIN ROUTES FILE ====
var authController = require('../controllers/auth');

var router = require('express').Router(); //create router

//==== ROUTES ====

//Teset root route
router.get('/', function(req, res) {
  res.json({ message: 'Commvs api root directory' });
});

//Main mounted routes
router.use('/comms', require('./comms'));
router.use('/users', require('./user'));
router.use('/favs',  require('./favs'));
router.route('/authenticate').post(authController.authenticate); // Authenticate any user. Returns a JWT.


module.exports = router;
