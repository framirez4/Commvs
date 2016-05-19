// Load required packages
var User = require('../models/user');
var Comm = require('../models/comms');

// Create endpoint /favs for POST

/**
 * Create endpoint for users to add a favorite commerce
 * @param  {Object} req req.params.comm_id
 * @param  {Object} res
 * @return {Object}     {success, added, message}
 */
exports.postFav = function(req, res) {
  Comm.findOne(
    {_id: req.params.comm_id},
    function (err, comm) {
      if (!comm) return res.json({success: false, message: 'Commerce to add not found'});
      User.findByIdAndUpdate(
        req.decoded['_doc']['_id'],
        {$addToSet: { favs: comm._id }},
        function(err, user) {
          if (err) return res.json({ success: false, err });
          res.json({ success: true, added: comm._id, message: 'Fav added: ' + comm.name + ' ('+comm._id+')' });
        }
      );
    }
  )

};

/**
 * Create endpoint for users to delete a favorite commerce
 * @param  {Object} req req.params.comm_id
 * @param  {Object} res
 * @return {Object}     {success, removed, message}
 */
exports.deleteFav = function(req, res) {
  User.findByIdAndUpdate(
    req.decoded['_doc']['_id'],
    { $pull: { favs: req.params.comm_id }},
    function(err, user) {
      if (err) return res.json({ success: false, err });
      res.json({ success: true, removed: req.params.comm_id, message: 'Commerce removed from favorites' });

    }
  );
};
