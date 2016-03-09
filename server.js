// Load required packages
var https   = require('https');

var config  = require('./config'); // Log config from files
var app     = require('./app');   // Log main express app module

// Start the server
server = https.createServer(config.options, app).listen(config.port, function(){
  console.log('Starting Commvs https on port ' + config.port);
});
