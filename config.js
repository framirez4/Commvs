const fs = require('fs');
const dotenv = require('dotenv').config({path: __dirname +'/.env'}); // Load .env config.

module.exports = {
  'secret': { 'simple_key': process.env.SECRET || 'secret' },
  'database': process.env.DB_HOST || 'mongodb://localhost:27017/kapeloi',
  'port': process.env.PORT || 3000
};
