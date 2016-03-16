var jwt     = require('jsonwebtoken');
var config  = require('../config');
var User    = require('../models/user');

exports.authenticate = function(req, res) {
  User.findOne({ '_id': req.body.email }, function (err, user) {
    if(err){ return err }
    else {
            // No user found with that username
        if (!user) {
          res.json({ success: false, message: 'Authentication failed. User not found.' });
        }
        else if (user) {
          // Make sure the password is correct
          user.verifyPassword(req.body.password, function(err, isMatch) {
          if(!isMatch) {
            res.json({ success: false, message: 'Authentication failed. Wrong password.'});
          } else if (isMatch) {
            // if user is found and password is right, create a token
            /*if (user.role == 'admin'){
              var token = jwt.sign(user, config.secret.simple_key, { expiresIn: "2h" });
            } else {
              var token = jwt.sign(user, config.secret.simple_key);
            }*/
            var token = jwt.sign(user, config.secret.simple_key);

            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token
            });
          };
        });
      };
    }

  });
};

// route middleware to verify a token
exports.verifyToken = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret.simple_key, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });
  } else {
    // if there is no token, return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
};
