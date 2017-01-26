const jwt     = require('jsonwebtoken');
const config  = require('../config');
const User    = require('../models/user');

/**
 * Authenticate a user
 * @param  {object} req Reads req.body.email and req.body.password
 * @param  {object} res
 * @return {object}     {success, message, token}
 */
exports.authenticate = function(req, res) {
  User.findOne({ '_id': req.body.email }, function (err, user) {
    if(err){ return err; }
    else {
      // No user found with that username
      if (!user) return res.json({ success: false, message: 'Authentication failed. User not found.' });
      else if (user) {
        // Make sure the password is correct
        user.verifyPassword(req.body.password, function(err, isMatch) {
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
    }
  });
};

/**
 * Endpoint to update the token for a new one before it expiresIn
 * @param  {Object} req reads the header to get the (still) valid token and save it to req.decoded._doc
 * @param  {Object} res
 * @return {Object}     Returns a brand new fresh JWT. { success, message, token }
 */
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

/**
 * Route middleware to verify a token
 * @param  {Object}   req  Reads req.body.token, req.query.token, req.headers[x-access-token]
 * @param  {Object}   res
 * @param  {Function} next Callback to use the next middleware
 * @return {Object}        {success, message} if failed on verify, otherwise it goes on.
 */
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
