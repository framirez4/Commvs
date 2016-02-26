// Load required packages
var fs          = require('fs');
var https       = require('https');
var express     = require('express');
var mongoose    = require('mongoose');
var bodyParser  = require('body-parser');
var morgan      = require('morgan');
var jwt         = require('jsonwebtoken');

var config = require('./config');

var commsController = require('./controllers/comms');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');

// Create our Express application
var app = express();

// ==== Configuration ====
var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
mongoose.connect(config.database); //connect to database
var port = process.env.PORT || 3000; //configure port
app.set('superSecret', config.secret); // secret variable


// Use the body-parser package in our application
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

//==== ROUTES ====
// Create router at /api
var router = express.Router();

// route middleware to verify a token
router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});

// http://localhost:3000/api
router.get('/', function(req, res) {
  res.json({ message: 'Commvs api root directory' });
});

//ROUTES for COMMS
router.route('/comms')
  .post(commsController.postComms)
  .get(commsController.getComms);

router.route('/comms/:comm_id')
  .get(commsController.getComm)
  .put(commsController.putComm)
  .delete(commsController.deleteComm);

// ROUTES for USERS
router.route('/users')
  .post(userController.postUsers)
  .get(userController.getUsers);

router.route('/users/:user_id')
  .delete(userController.deleteUsers);

router.route('/authenticate')
  .post(authController.authenticate);

app.use('/api', router);

// Start the server
server = https.createServer(options, app).listen(port, function(){
  console.log('Starting Commvs https on port ' + port);
});
