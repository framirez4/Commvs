var connectRoles = require('connect-roles');

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

user.use('access admin function', function (req) {
  if (req.decoded._doc.usertype === '0') {
    return true;
  }
})

module.exports = user;
