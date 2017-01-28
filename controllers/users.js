// Load required packages
const User = require('../models/user');
const utils = require('./utils');

exports.postUsers = function(req, res) {
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


exports.getUsers = function(req, res) {
  User.find()
  .then(users => res.json({ success: true, message: users }))
  .catch(err => res.json_({ success: false, message: err }));
};


exports.getMe = function(req, res) {
  User.findOne({ email: req.decoded['_doc']['_id'] }).exec()
  .then(dbUser => res.json({ success: true, message: dbUser }))
  .catch(err => res.json({ success: false, message: err }));
};


exports.editUser = function(req, res) {

  // fields not allowed to edit for a user from the API
  if (req.body.hasOwnProperty('_id')) delete req.body._id;
  if (req.body.hasOwnProperty('password')) delete req.body.password;
  if (req.body.hasOwnProperty('role')) delete req.body.role;
  if (req.body.hasOwnProperty('owns')) delete req.body.owns;
  if (req.body.hasOwnProperty('bookmarks')) delete req.body.bookmarks;

  User.update({ _id: req.decoded._doc._id },
    req.body,
    function(err, modified){
      if (err) return res.send(err);
      return modified.nModified === 0 ?
        res.json({ success: true, message: 'No profile data was modified' }) :
        res.json({ success: true, message: 'User profile updated successfully' });
    }
  );
};


exports.editPassword = function(req, res) {
  User.findById( req.decoded['_doc']['_id'], function(err, user) {
    if (err) return res.send(err);

    user.password = req.body.password;

    // Save the user and check for errors
    user.save(function(err) {
      if (err && err.errors) return res.json({success: false, message: err.errors['password'].message});
      res.json({ success:true, message: 'Password successfully changed' });
    });
  });
};


exports.deleteUsers = function(req, res) {
  User.findOne({ email: req.query.email }).exec()
  .then(dbUser => User.findByIdAndRemove(dbUser._id))
  .then(deletion => res.json({ success:true, message: 'User removed from our database' }))
  .catch(err => res.json({ success: false, message: 'User not found or could not be deleted' }));
};
