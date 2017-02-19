'use strict'

// Load required packages
require('dotenv').config()
const app = require('./app')   // Log main express app module
const config = require('./config') // Log config from files

// Start the server
var server = app.listen(config.server.port, function () {
  console.info(`Starting Kapeloi-server on port ${config.server.port}`)
})

module.exports = server
