var express     = require('express');
var app         = express(); //Create express app
var mongoose    = require('mongoose');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var helmet      = require('helmet');


var config = require('./config');

mongoose.connect(config.database);  //Connect database

// ==== MIDDLEWARES ====
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(helmet());

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

// ==== MOUNT ROUTES ====
app.use('/api', require('./routes/index'));

app.get('/', function(req, res) {
  res.sendFile('./index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
/*
app.get('/', function(req,res){
  res.render('pages/index');
});
app.get('/login', function(req,res){
  res.render('pages/login');
});
*/
module.exports = app; // export app module
