const express     = require('express');
const mongoose    = require('mongoose');
const morgan      = require('morgan');
const bodyParser  = require('body-parser');
const helmet      = require('helmet');
const cors        = require('cors');
const app         = express(); //Create express app

const config = require('./config');

mongoose.Promise = global.Promise;
mongoose.connect(config.database);  //Connect database

app
  .set('trust proxy', true)
  .set('trust proxy', 'loopback')

// ==== MIDDLEWARES ====
  // .use(morgan('dev'))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(cors())
  .use(helmet())

// ==== MOUNT ROUTES ====
  .use('/v1', require('./routes/index'));


module.exports = app; // export app module
