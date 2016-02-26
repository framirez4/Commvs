// Load required packages
var User = require('../models/user');

// Create endpoint /api/users for POST
exports.postUsers = function(req, res) {
  var user = new User({
    username: req.body.username,
    password: req.body.password,
    email:    req.body.email,
    usertype: req.body.usertype || 1
  });

  user.save(function(err) {
    if (err){
      res.send(err.errors);
    } else {
      res.json({ message: 'New user added!' });
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

exports.deleteUsers = function(req, res) {
  User.findByIdAndRemove(req.params.user_id, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'User removed from the list!' });
  });
};
