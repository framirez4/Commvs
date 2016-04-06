// Load required packages
var User = require('../models/user');
var Comm = require('../models/comms');

// Create endpoint /api/users for POST
exports.postFav = function(req, res) {

  User.findByIdAndUpdate(
    req.decoded['_doc']['_id'],
    {$addToSet: { favs: req.body.comm_id }},
    function(err, user) {
      if (err){
        res.json({ success: false, err });
      } else {
        res.json({ success: true, message: 'Fav added: ' + req.body.comm_id });
      }
    }
  );
};

exports.deleteFav = function(req, res) {
  User.findByIdAndUpdate(
    req.decoded['_doc']['_id'],
    { $pull: { favs: req.query.comm_id }},
    function(err, user) {
      if (err){
        res.json({ success: false, err });
      } else {
        res.json({ success: true, message: 'Fav removed: ' + req.body.comm_id });
      }
    }
  );
};
