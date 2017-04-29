'use strict'

const authenticate = require('./authenticate')
const bookmarks = require('./bookmarks')
const commerces = require('./commerces')
const ownerships = require('./ownerships')
const promos = require('./promos')
const search = require('./search')
const users = require('./users')

module.exports = {
  authenticate: authenticate,
  bookmarks: bookmarks,
  commerces: commerces,
  ownerships: ownerships,
  promos: promos,
  search: search,
  users: users
}
