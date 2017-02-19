'use strict'

// Load required packages
const User = require('../models/user')
const utils = require('./utils')

exports.postUsers = function (req, res) {
  var user = new User(req.body)

  user.save()
  .then(dbUser => res.json({ success: true, message: 'New user added!', user: dbUser }))
  .catch(err => res.json({ success: false, message: utils.filterValidationModelErrors(err.errors) }))
}

exports.getUsers = function (req, res) {
  User.find()
  .then(users => res.json({ success: true, message: users }))
  .catch(err => res.json_({ success: false, message: err }))
}

exports.getMe = function (req, res) {
  User.findOne({ _id: req.decoded['_doc']['_id'] })
  .then(dbUser => res.json({ success: true, message: dbUser }))
  .catch(err => res.json({ success: false, message: `There was an error finding the user`, Error: err }))
}

exports.editUser = function (req, res) {
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

exports.editPassword = function (req, res) {
  User.findOne({ _id: req.decoded['_doc']['_id'] })
  .then(user => user.update({ password: req.body.password }))
  .then(modified => res.json({ success: true, message: modified }))
  .catch(err => res.json({ success: false, message: `Password could not be changed`, Error: err }))
}

exports.deleteUsers = function (req, res) {
  User.findOne({ email: req.query.email })
  .then(dbUser => User.findByIdAndRemove(dbUser._id))
  .then(deletion => res.json({ success: true, message: 'User removed from our database' }))
  .catch(err => res.json({ success: false, message: `User not found or could not be deleted`, Error: err }))
}
