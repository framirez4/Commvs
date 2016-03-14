// Load packages
var keygen = require('keygenerator');

var Comm = require('../models/comms');


// Create endpoint /api/comms for POSTS
exports.postComms = function(req, res) {
  // Create a new instance of the Commerce model
  var comm = new Comm();

  // Set the commerce properties that came from the POST data
  comm._id = req.body.name;
  comm.description = req.body.description;
  comm.phone = req.body.phone;
  comm.address = req.body.address;
  comm.email = req.body.email;
  comm.web = req.body.web;
  comm.gps = req.body.gps;
  comm.schedule = req.body.schedule;
  comm.activity = req.body.activity;

  // Save the commerce and check for errors
  comm.save(function(err) {
    if (err){
      res.json({ success: false, error: err });
    } else {
      res.json({ success: true, message: 'Commerce added to the list!', data: comm });
    }
  });
};

// Create endpoint /api/comms for GET
exports.getComms = function(req, res) {
  // Use the Commerce model to find all commerces
  Comm.find(function(err, comms) {
    if (err) {
      res.send(err);
    } else {
      res.json(comms);
    }
  });
};

// Create endpoint /api/comms/:name for GET_byId
exports.getComm = function(req, res) {

  var str = req.params.comm_id.replace(/_/g, " "); // Replace "_" for " "

  // Use the Commerce model to find a specific commerce
  console.log(str);
  Comm.findById(str, function(err, comms) {
    if (err) {
      res.send(err);
    } else {
      res.json(comms);
    }
  });
};

// Create endpoint /api/comms/:comm_id for PUT_byId
exports.putComm = function(req, num, raw) {
  var str = req.params.comm_id.replace(/_/g, " "); // Replace "_" for " "

  // Use the Commerce model to find a specific commerce
  Comm.findById(str, function(err, comms) {
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

  var str = req.params.comm_id.replace(/_/g, " "); // Replace "_" for " "

  // Use the Comm model to find a specific comm and remove it
  Comm.findByIdAndRemove(req.params.comm_id, function(err) {
    if (err){
      res.send(err);
    } else {
      res.json({ message: 'Commerce removed from the list!' });

    }
  });
};

exports.getOwnerKey = function(req, res) {
  res.json({ success: true, key: keygen.number() });
};
exports.setOwnerKey = function(req, res) {
  res.json({ message: 'setOnwerKey function directory' });
};
