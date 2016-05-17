// Load packages

var Comm = require('../models/comms');
var User = require('../models/user');

// Get only the comm ownership object
exports.getOwnership = function(req, res) {
  // Use the Commerce model to find a specific commerce
  Comm.findById(req.params.comm_id, function(err, comms) {
    if(!comms) return res.json({success: false, message: "No comm found"});
    res.json({
      id: comms._id,
      name: comms.name,
      ownership: comms.ownership
    })

  });
};


exports.setOwnership = function(req, res) {
  Comm.findOneAndUpdate(
    { "ownership.key": req.body.key },
    { $addToSet: { "ownership.owners": req.decoded['_doc']['_id']}},
    function(err, comms){
      if(!comms) return res.json({success: false, message: "Wrong or unexistent ownership key"});
      console.log(req.decoded['_doc']['_id']);
      User.findByIdAndUpdate(
        req.decoded['_doc']['_id'],
        { $addToSet: { "owns": comms._id}},
        function(err, user){
          if(err) return res.json({ 'success': false, 'message': 'Error saving user' });
          res.json({success: true, added: comms._id, message: "Added user "+ req.decoded['_doc']['_id'] +" as admin for ["+ comms.name +"]" });
        }
      );
    }
  );
};

exports.removeOwnership = function(req, res) {
  Comm.findByIdAndUpdate(
    req.query.comm_id,
    { $pull: {"ownership.owners": req.decoded['_doc']['_id']}},
    function(err, comms) {
      if(!comms) return res.json({success: false, message: "Wrong or unexistent ownership key"});
      User.findByIdAndUpdate(
        req.decoded['_doc']['_id'],
        { $pull: {"owns": comms._id } },
        function(err, user){
          if (err) return res.json({ success: false, message: err });
          res.json({success: true, removed: comms._id, message: "Removed user "+ req.decoded['_doc']['_id'] +" as admin for ["+ comms.name +"]" });
        }
      );
    }
  );
};
