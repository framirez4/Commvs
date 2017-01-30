// Load required packages
const User = require('../models/user');
const utils = require('./utils');

exports.postUsers = function (req, res) {
  var user = new User({
    'email': req.body.email,
    'first_name': req.body.first_name,
    'last_name': req.body.last_name,
    'password': req.body.password,
    'role': req.body.role || 'user',
    'loc': req.body.loc || ''
  });

  user.save()
  .then(dbUser => res.json({ success: true, message: 'New user added!', user: dbUser }))
  .catch(err => res.json({ success: false, message: utils.filterValidationModelErrors(err.errors) }));
};


exports.getUsers = function (req, res) {
  User.find()
  .then(users => res.json({ success: true, message: users }))
  .catch(err => res.json_({ success: false, message: err }));
};


exports.getMe = function (req, res) {
  User.findOne({ _id: req.decoded['_doc']['_id'] })
  .then(dbUser => res.json({ success: true, message: dbUser }))
  .catch(err => res.json({ success: false, message: err }));
};


exports.editUser = function (req, res) {
  // fields not allowed to edit for a user from the API
  delete req.body._id;
  delete req.body.password;
  delete req.body.role;
  delete req.body.owns;
  delete req.body.bookmarks;

  console.log(req.body);
  User.where({ _id: req.decoded._doc._id }).update(req.body)//.exec()
  .then((modified) =>{
    return modified.nModified === 0 ?
      res.json({ success: true, message: 'No profile data was modified' }) :
      res.json({ success: true, message: 'User profile updated successfully' });
  })
  .catch(err => res.json({ success: true, message: 'No profile data was modified' }));
};


exports.editPassword = function (req, res) {
  console.log('uuuuuuuuuuuser', req.body.password);
  // User.update({ _id: req.decoded._doc._id }, { password: req.body.password })
  User.findOne({ _id: req.decoded['_doc']['_id'] })
  .then(user => user.update({ password: req.body.password }))
  .then(modified => res.json({ success:true, message: modified }))
  .catch(err => res.json({ success:false, message: err }));
  // .then(function (user) {
  //   user.password = req.body.password;
  //   // Save the user and check for errors
  //   user.save()
  //   .then(dbUser => res.json({ success: true, message: 'New user added!', user: dbUser }))
  //   .catch(err => res.json({ success: false, message: utils.filterValidationModelErrors(err.errors) }));
  // })
  // .catch(err => {
  //   console.log('eeeeeeeeeeeeerrrr', err);
  //   res.json({ success:false, message: err });
  // });
};


exports.deleteUsers = function (req, res) {
  User.findOne({ email: req.query.email })
  .then(dbUser => User.findByIdAndRemove(dbUser._id))
  .then(deletion => res.json({ success:true, message: 'User removed from our database' }))
  .catch(err => res.json({ success: false, message: 'User not found or could not be deleted' }));
};
