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
app.use(helmet());

// ==== MOUNT ROUTES ====
app.use('/api', require('./routes/index'));

module.exports = app; // export app module
