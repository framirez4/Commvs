// Load required packages
var User = require('../models/user');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  var user = new User({
    '_id': req.body.email,
    'password': req.body.password,
    'role': req.body.role || 'user'
  });


  user.save(function(err) {
    if (err){

      //res.json({ success: false, error: err.errmsg });
      if(err.errmsg) {
        res.json({ success: false, message: err.errmsg });

      } else {
        if(err.errors){
          errors = [];
          if(err.errors['_id']){errors.push(err.errors['_id'].message)};
          if(err.errors['password']){errors.push(err.errors['password'].message)};

          res.json({ success: false, message: errors });
        }
      }

    } else {
      res.json({ success: true, message: 'New user added!' });
    }
  });
};

// Create endpoint /api/users for GET
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err)
      res.send(err);

    res.json(users);
  });
};
exports.editPassword = function(req, res) {

  User.findById( req.decoded['_doc']['_id'], function(err, user) {
    if (err)
      res.send(err);

    // Update the existing comm quantity
    user.password = req.body.password;

    // Save the user and check for errors
    user.save(function(err) {
      if (err && err.errors){
        res.json({success: false, message: err.errors['password'].message});
      } else {
        res.json({success:true, message: 'Password successfully changed'});
      }

    });
  });
};

exports.deleteUsers = function(req, res) {
  User.findByIdAndRemove(req.body.email, function(err) {
    if (err){
      res.send(err);
    } else {
      res.json({ message: 'User removed from our database' });
    }
  });
};
