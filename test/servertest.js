// Load required packages
var https   = require('https');

var config  = require('../config'); // Log config from files
var app     = require('../app');   // Log main express app module

// Start the server
var server = app.listen(5555, function(){
  console.log('Starting Commvs https on port ' + 5555);
});

module.exports = server;
