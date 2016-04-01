// Load required packages
var https   = require('https');

var config  = require('./config'); // Log config from files
var app     = require('./app');   // Log main express app module

app.set('trust proxy', true);
app.set('trust proxy', 'loopback');
// Start the server
app.listen(config.port, function(){
  console.log('Starting Commvs https on port ' + config.port);
});
