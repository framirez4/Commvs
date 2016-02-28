// Load required packages
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

var jwt = require('passport-jwt');
var JwtStrategy = jwt.Strategy;
var ExtractJwt = jwt.ExtractJwt;

var opts = {
  'jwtFromRequest': ExtractJwt.fromAuthHeader(),
  'secretOrKey': 'secret'
  /*'issuer': 'francescramirez@gmail.com',
  'audience': 'yoursite.net'*/
};

passport.use(new JwtStrategy(opts, function(jwt_payload, done){
  User.findOne({id: jwt_payload.sub}, function(err,user){
    if (err){ return done(err, false); }
    if (user) {
      done(null,user);
    } else {
      done(null,false);
    }
  });
}));

passport.use(new BasicStrategy(
  function(username, password, callback) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function(err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false });
exports.isAuthJwt = passport.authenticate('jwt', {session: false});
