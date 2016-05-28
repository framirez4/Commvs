var connectRoles = require('connect-roles');
var Comm = require('../models/comms');
var User = require('../models/user');


var user = new connectRoles({
  failureHandler: function (req, res, action) {
    var accept = req.headers.accept || '';
    res.status(403);
    if(~accept.indexOf('html')) {
      res.json({ message: 'access-denied' });
    } else {
      res.send('Access Denied - you don\'t have permission to: ' + action);
    }
  }
});

// Allow access to admins to admin-only functions
user.use('run admin-only functions', function (req) {
  if (req.decoded._doc.role === 'admin') {
    return true;
  }
});

// Allow access to admins or commerce owners to edit data.
user.use('update an owned comm data', function (req) {
  if (req.decoded._doc.role === 'admin') {
    return true;
  } else {
    if(req.decoded._doc.owns.indexOf(req.params.comm_id) > -1) return true;
  }
});


module.exports = user;
