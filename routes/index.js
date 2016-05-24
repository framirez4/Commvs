// ==== MAIN ROUTES FILE ====
var authController = require('../controllers/auth');

var router = require('express').Router(); //create router

//==== ROUTES ====

//Teset root route
router.get('/', function(req, res) {
  res.json({ message: 'Kapeloi root directory for API v1. More info at Github repository.',
             repository: 'htttps://github.com/framirez4/kapeloi-server'
           });
});

//Main mounted routes
router.use('/comms', require('./comms'));
router.use('/promos', require('./promos'));
router.use('/users', require('./user'));
router.use('/favs',  require('./favs'));
router.use('/ownership',  require('./ownership'));
router.use('/authenticate', require('./authenticate')); // Authenticate any user. Returns a JWT.
router.use('/search', require('./search'));

module.exports = router;
