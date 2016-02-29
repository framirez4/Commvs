// Load required packages
var https   = require('https');
var config  = require('./config');
var app     = require('./app');

// Start the server
server = https.createServer(config.options, app).listen(config.port, function(){
  console.log('Starting Commvs https on port ' + config.port);
});
