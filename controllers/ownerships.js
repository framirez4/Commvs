// Load packages

var Comm = require('../models/comms');

exports.getOwnership = function(req, res) {

  // Use the Commerce model to find a specific commerce
  Comm.findById(req.params.comm_id, function(err, comms) {
    if(!comms) return res.json({success: false, message: "No comm found"});

    res.json({
      name: comms.name,
      ownership: comms.ownership
    })

  });
};
exports.setOwnership = function(req, res) {

  Comm.findOneAndUpdate({ "ownership.key": req.body.key },
    { $addToSet: { "ownership.owners": req.decoded['_doc']['_id']}},
    function(err, comms){
      if(!comms) return res.json({success: false, message: "Wrong or unexistent ownership key"});

      res.json({success: true, message: "Added user "+ req.decoded['_doc']['_id'] +" as admin for ["+ comms.name +"]" });
    }
  );
};

exports.removeOwnership = function(req, res) {
  Comm.findOneAndUpdate({ "ownership.key": req.body.key },
  { $pull: {"ownership.owners": req.decoded['_doc']['_id']}},
  function(err, comms) {
    if(!comms) return res.json({success: false, message: "Wrong or unexistent ownership key"});

    res.json({success: true, message: "Removed user "+ req.decoded['_doc']['_id'] +" as admin for ["+ comms.name +"]" });
  });
};
