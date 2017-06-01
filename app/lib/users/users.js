'use strict'

// Load required packages
const winston = require('winston')
const config = require('../../../config')
winston.level = config.env

const User = require('../../models/user')
const utils = require('../utils')

function addUser (req, res) {
  const userData = req.body
  const newUser = new User(userData)

  newUser.save()
    .then(dbUser => res.status(200).json({ success: true, message: 'New user added!', user: dbUser }))
    .catch(err => res.status(400).json({ success: false, message: utils.filterValidationModelErrors(err.errors) }))
}

function deleteUser (req, res) {
  const deleteQuery = req.query

  User.deleteUser(deleteQuery)
    .then(deletion => {
      if (!deletion) throw deleteQuery
      return res.status(200).json({ success: true, message: 'User removed from our database', user: deletion })
    })
    .catch(err => res.status(400).json({ success: false, message: `User not found or could not be deleted`, Error: err }))
}

function getUsers (req, res) {
  User.find()
    .then(users => res.status(200).json({ success: true, message: users }))
    .catch(err => res.status(400).json_({ success: false, message: err }))
}

function getMe (req, res) {
  User.findOne({ _id: req.decoded['_doc']['_id'] })
    .then(dbUser => res.status(200).json({ success: true, message: dbUser }))
    .catch(err => res.status(400).json({ success: false, message: `There was an error finding the user`, Error: err }))
}

function editUser (req, res) {
  // fields not allowed to edit for a user from the API
  delete req.body._id
  delete req.body.password
  delete req.body.role
  delete req.body.owns
  delete req.body.bookmarks

  User.where({ _id: req.decoded._doc._id }).update(req.body)
    .then((modified) => {
      return modified.nModified === 0
      ? res.json({ success: true, message: 'No profile data was modified' })
      : res.json({ success: true, message: 'User profile updated successfully' })
    })
    .catch(err => res.json({ success: true, message: `No profile data was modified`, Error: err }))
}

function editPassword (req, res) {
  User.findOne({ _id: req.decoded['_doc']['_id'] })
    .then(user => user.update({ password: req.body.password }))
    .then(modified => res.json({ success: true, message: modified }))
    .catch(err => res.json({ success: false, message: `Password could not be changed`, Error: err }))
}

module.exports = {
  addUser: addUser,
  getUsers: getUsers,
  getMe: getMe,
  editUser: editUser,
  editPassword: editPassword,
  deleteUser: deleteUser
}
