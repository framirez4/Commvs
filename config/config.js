'use strict'

const environment = require('./components/environment')
const server = require('./components/server')
const mongodb = require('./components/mongodb')
const secret = require('./components/secret')

module.exports = Object.assign({}, environment, server, mongodb, secret)
