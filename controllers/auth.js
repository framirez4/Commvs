const jwt     = require('jsonwebtoken');
const config  = require('../config');
const User    = require('../models/user');
const utils = require('./utils');


exports.authenticate = (req, res) => {
  User.findOne({ 'email': req.body.email }).exec()
  .then((user) => {
      // No user found with that username
      if (!user) return res.json({ success: false, message: 'Authentication failed. User not found.' });
      else if (user) {
        // Make sure the password is correct
        user.verifyPassword(req.body.password)
        .then((isMatch) => {
          if(!isMatch) return res.json({ success: false, message: 'Authentication failed. Wrong password.'});

          // Limit the use time for an admin-token
          var token = user.role === 'admin' ?
            jwt.sign(user, config.secret.simple_key, { expiresIn: "2h" }) :
            jwt.sign(user, config.secret.simple_key, { expiresIn: "7d" });

          // return the information including token as JSON
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        });
      }

  })
  .catch((err) => {
    return res.json({ success: false, message: `Error while authenticating: ${err}` });
  });
};


exports.refreshToken = function(req, res) {
  console.log('OOOOOOOOOOOOMGGGGGGGGGGGGGGGGGGGG' + req.body.token);
  User.findById(
    req.decoded._doc._id,
    function( err, user ){
      if(req.decoded._doc.password !== user.password) return res.json({success: false, message: 'Token refresh was revoked'});

      var token = user.role == 'admin' ?
        jwt.sign(user, config.secret.simple_key, { expiresIn: "2h" }) :
        jwt.sign(user, config.secret.simple_key, { expiresIn: "7d" });

      // return the information including token as JSON
      res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
      });
    }
  );
};


exports.verifyToken = function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) return res.status(403).send({ success: false, message: 'No token provided.' });

  // decode token + verifies secret and checks exp
  jwt.verify(token, config.secret.simple_key, function(err, decoded) {
    if (err) return res.json({ success: false, message: 'Failed to authenticate token.' });

    // if everything is good, save to request for use in other routes
    req.decoded = decoded;
    next();
  });
};
