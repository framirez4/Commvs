var express     = require('express');
var mongoose    = require('mongoose');
var morgan      = require('morgan');
var bodyParser  = require('body-parser');
var helmet      = require('helmet');
var cors        = require('cors');
var app         = express(); //Create express app

var config = require('./config');
mongoose.connect(config.database);  //Connect database

function requireHTTPS(req, res, next){
  if(!req.secure) {
    return res.redirect('https://' + req.headers.host + req.url);
  }
  next();
}

// ==== MIDDLEWARES ====
//app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());


// ==== MOUNT ROUTES ====
app.use('/api', require('./routes/index'));


module.exports = app; // export app module
