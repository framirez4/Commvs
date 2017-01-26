// ==== MAIN ROUTES FILE ====
const authController = require('../controllers/auth');

const router = require('express').Router(); //create router

//==== ROUTES ====

//Test root route
router.get('/', function(req, res) {
  res.json({ message: 'Kapeloi root directory for API v1. More info at Github repository.',
             repository: 'htttps://github.com/framirez4/kapeloi-server'
           });
});

//Main mounted routes
router.use('/comms', require('./commerces'));
router.use('/promos', require('./promos'));
router.use('/users', require('./users'));
router.use('/bookmarks',  require('./bookmarks'));
router.use('/ownership',  require('./ownership'));
router.use('/authenticate', require('./authenticate')); // Authenticate any user. Returns a JWT.
router.use('/search', require('./search'));

module.exports = router;
