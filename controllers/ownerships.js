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
  Comm.findById(
    req.params.comm_id,
    function ( err, comm ){
      if ( !comm ) return res.json({ success: false, message: "Commerce could not be found" });
      if ( comm.ownership.key == req.body.key ) {
        if ( comm.ownership.owners.indexOf(req.decoded['_doc']['_id']) < 0 ) {
          comm.ownership.owners.push(req.decoded['_doc']['_id']);
          comm.save();
          User.findByIdAndUpdate(
            req.decoded['_doc']['_id'],
            { $addToSet: { "owns": comm._id}},
            function(err, user){
              if(err) return res.json({ 'success': false, 'message': 'Error saving user' });
              res.json({success: true, added: comm._id, message: "Added user "+ req.decoded['_doc']['_id'] +" as admin for ["+ comm.name +"]" });
            }
          );
        }
      }
    }
  );
};

exports.removeOwnership = function(req, res) {
  Comm.findByIdAndUpdate(
    req.params.comm_id,
    { $pull: {"ownership.owners": req.decoded['_doc']['_id']}},
    function(err, comms) {
      if(!comms) return res.json({success: false, message: "Commerce could not be found"});
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
