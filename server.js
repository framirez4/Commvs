// Load required packages
var fs = require('fs');
var https = require('https');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var passport = require('passport');

var commsController = require('./controllers/comms');
var userController = require('./controllers/user');
var authController = require('./controllers/auth');
var clientController = require('./controllers/client');
var oauth2Controller = require('./controllers/oauth2');

//Configuration
//Blockin read file
var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
var port = process.env.PORT || 3000;
// Connect to database
mongoose.connect('mongodb://localhost:27017/commvs');

// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

// Use the passport package in our application
//app.use(passport.initialize());

// Create router at /api
var router = express.Router();

// http://localhost:3000/api
router.get('/', function(req, res) {
  res.json({ message: 'Commvs api root directory' });
});

//ROUTES for COMMS
router.route('/comms')
  .post(/*authController.isAuthenticated, */commsController.postComms)
  .get(/*authController.isAuthenticated, */commsController.getComms);

router.route('/comms/:comm_id')
  .get(/*authController.isAuthenticated, */commsController.getComm)
  .put(/*authController.isAuthenticated, */commsController.putComm)
  .delete(/*authController.isAuthenticated, */commsController.deleteComm);

// ROUTES for USERS
router.route('/users')
  .post(userController.postUsers)
  .get(/*authController.isAuthenticated, */userController.getUsers);

router.route('/users/:user_id')
  .delete(/*authController.isAuthenticated, */userController.deleteUsers);

// Create endpoint handlers for /clients
router.route('/clients')
  .post(/*authController.isAuthenticated, */clientController.postClients)
  .get(/*authController.isAuthenticated, */clientController.getClients);

  // Create endpoint handlers for oauth2 authorize
  router.route('/oauth2/authorize')
    .get(/*authController.isAuthenticated, */oauth2Controller.authorization)
    .post(/*authController.isAuthenticated, */oauth2Controller.decision);

  // Create endpoint handlers for oauth2 token
  router.route('/oauth2/token')
    .post(/*authController.isClientAuthenticated, */oauth2Controller.token);

app.use('/api', router);

// Start the server
server = https.createServer(options, app).listen(port, function(){
  console.log('Starting Commvs https on port ' + port);
});
