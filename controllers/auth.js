const jwt     = require('jsonwebtoken');
const config  = require('../config');
const User    = require('../models/user');
const utils = require('./utils');


exports.authenticate = (req, res) => {
  var query = { email: req.body.email };
  var password = req.body.password;

  authenticateUser(query, password, false)
  .then(token => res.json({ success: false, message: token }))
  .catch( err => res.json({ success: false, message: `Error while authenticating: ${err}` }));
};


exports.refreshToken = function(req, res) {
  var query = { _id: req.decoded._doc._id };
  var hashedPassword = req.decoded._doc.password;

  authenticateUser(query, hashedPassword, true)
  .then( token => res.json({ success: false, message: token }))
  .catch( err => res.json({ success: false, message: `Error while authenticating: ${err}` }));
};


var authenticateUser = function (query, password, hashed) {
  return new Promise( (resolve, reject) => {
    var user;
    console.log(query, password);
    User.findOne( query )
    .then( _user => {
      if (!_user) return reject('User not found.'); // No user found with that username
      user = _user;

      return !hashed ? user.verifyPassword(password) : user.verifyHashedPassword(password);
    })
    .then( isMatch => {
      if (!isMatch) return reject('Password was revoked');

      var expiration = user.role == 'admin' ? { expiresIn: "2h" } : { expiresIn: "7d" };
      var token = jwt.sign(user, config.secret.simple_key, expiration);

      // return the information including token as JSON
      return resolve({
        success: true,
        message: 'Enjoy your token!',
        token: token,
        expiration: expiration.expiresIn
      });
    })
    .catch(reject);
  });
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
