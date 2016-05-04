// Load packages

var Comm = require('../models/comms');
//var Ownkey = require('../models/ownkeys');


// Create endpoint /api/comms for POSTS
exports.postComms = function(req, res) {
  // Create a new instance of the Commerce model
  var comm = Comm({
      // Set the commerce properties that came from the POST data
    name: req.body.name,
    address: req.body.address,
    location: req.body.location,
    phone: req.body.phone,
    description: req.body.description,
    email: req.body.email,
    web: req.body.web,
    gps: req.body.gps,
    schedule: req.body.schedule,
    activity: req.body.activity
  });

  // Save the commerce and check for errors
  comm.save(function(err) {
    if (err) return res.json({ success: false, error: err });

    res.json({ success: true, message: 'Commerce added to the list!', data: comm });
  });
};

// Create endpoint /api/comms for GET
exports.getComms = function(req, res) {
  // Use the Commerce model to find all commerces
  Comm.find({}, {ownership: 0}, function(err, comms) {
    if (err) {
      res.send(err);
    } else {
      res.json(comms);
    }
  });
};

// Create endpoint /api/comms/:name for GET_byId
exports.getComm = function(req, res) {


  // Use the Commerce model to find a specific commerce
  Comm.findById(req.params.comm_id, {ownership: 0}, function(err, comms) {
    if (err) {
      res.send(err);
    } else {
      res.json(comms);
    }
  });
};

// Create endpoint /api/comms/:comm_id for PUT_byId
exports.putComm = function(req, num, raw) {

  // Use the Commerce model to find a specific commerce
  Comm.findById(req.params.comm_id, function(err, comms) {
    if (err){
      res.send(err);
    }
    // Update the existing comm quantity
    comms.name = req.body.name;

    // Save the comm and check for errors
    comms.save(function(err) {
      if (err) {
        res.send(err);
      } else {
        res.json(comms);
      }
    });
  });
};

// Create endpoint /api/comms/:comm_id for DELETE_byId
exports.deleteComm = function(req, res) {

  // Use the Comm model to find a specific comm and remove it
  Comm.findByIdAndRemove(req.params.comm_id, function(err) {
    if (err){
      res.send(err);
    } else {
      res.json({ message: 'Commerce removed from the list!' });

    }
  });
};
