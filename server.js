// Load required packages
const config  = require('./config'); // Log config from files
const app     = require('./app');   // Log main express app module

// Start the server
var server = app.listen(config.port, function(){
  console.info(`Starting Kapeloi-server on port ${config.port}`);
});

module.exports = server;
