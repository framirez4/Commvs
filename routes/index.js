var express     = require('express');


var userController = require('../controllers/user');
var authController = require('../controllers/auth');

var connectRoles = require('connect-roles');

var user = require('../controllers/role');

//==== ROUTES ====
var router = express.Router(); //create router


router.get('/', function(req, res) {
  res.json({ message: 'Commvs api root directory' });
});

router.use('/comms', require('./comms'));

router.use('/users', require('./user'));

router.route('/authenticate')
  .post(authController.authenticate);

module.exports = router;
