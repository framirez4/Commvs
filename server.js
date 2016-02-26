// Load required packages
var fs = require('fs');
var https = require('https');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var passport = require('passport');

var commsController = require('./controllers/comms');
var userController = require('./controllers/user');

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

app.use('/api', router);

// Start the server
server = https.createServer(options, app).listen(port, function(){
  console.log('Starting Commvs https on port ' + port);
});
