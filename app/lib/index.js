'use strict'

const users = require('./users')
const auth = require('./auth')
const bookmarks = require('./bookmarks')
const commerces = require('./commerces')
const ownerships = require('./ownerships')
const promos = require('./promos')
const role = require('./role')
const search = require('./search')

const utils = require('./utils')

module.exports = Object.assign({},
  auth,
  bookmarks,
  commerces,
  ownerships,
  promos,
  role,
  search,
  users,
  utils
)
