'use strict'

const users = require('./users')
const authenticate = require('./authenticate')
const bookmarks = require('./bookmarks')
const commerces = require('./commerces')
const ownership = require('./ownership')
const promos = require('./promos')
const search = require('./search')

module.exports = {
  users: users,
  authenticate: authenticate,
  bookmarks: bookmarks,
  commerces: commerces,
  ownership: ownership,
  promos: promos,
  search: search
}
