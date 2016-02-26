var jwt         = require('jsonwebtoken');
var config         = require('../config');
var User = require('../models/user');

exports.authenticate = function(req, res) {
  User.findOne({ username: req.body.username }, function (err, user) {
      // No user found with that username
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      }
      else if (user) {
        // Make sure the password is correct
        user.verifyPassword(req.body.password, function(err, isMatch) {
        if(err){ res.json(
          { success:false, message: 'Authentication failed. Wrong password.'});
        } else if (isMatch) {
          // if user is found and password is right
          // create a token
          var token = jwt.sign(user, config.secret, {
            expiresInMinutes: 1440 // expires in 24 hours
          });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        };
      });
    };
  });
};
