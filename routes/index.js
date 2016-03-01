var express     = require('express');

var authController = require('../controllers/auth');

//==== ROUTES ====
var router = express.Router(); //create router
router.use('/comms', require('./comms'));
router.use('/users', require('./user'));

router.get('/', function(req, res) {
  res.json({ message: 'Commvs api root directory' });
});
router.route('/authenticate')
  .post(authController.authenticate);


module.exports = router;
