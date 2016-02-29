var Commerce = require('../models/commerces');


// Create endpoint /api/comms for POSTS
exports.postComms = function(req, res) {
  // Create a new instance of the Commerce model
  var commerce = new Commerce();

  // Set the commerce properties that came from the POST data
  commerce.name = req.body.name;
  commerce.description = req.body.description;
  commerce.phone = req.body.phone;
  commerce.userAdminId = req.user._id;

  // Save the commerce and check for errors
  commerce.save(function(err) {
    if (err){
      res.send(err);
    } else {
      res.json({ message: 'Commerce added to the list!', data: commerce });
    }
  });
};

// Create endpoint /api/comms for GET
exports.getComms = function(req, res) {
  // Use the Commerce model to find all commerces
  Commerce.find(function(err, comms) {
    if (err)
      res.send(err);

    res.json(comms);
  });
};

// Create endpoint /api/comms/:name for GET_byId
exports.getComm = function(req, res) {
  // Use the Commerce model to find a specific commerce
  Commerce.findById(req.params.comm_id, function(err, comms) {
    if (err)
      res.send(err);

    res.json(comms);
  });
};

// Create endpoint /api/comms/:comm_id for PUT_byId
exports.putComm = function(req, num, raw) {
  // Use the Commerce model to find a specific commerce
  Commerce.findById(req.params.comm_id, function(err, comms) {
    if (err)
      res.send(err);

    // Update the existing comm quantity
    comms.name = req.body.name;

    // Save the beer and check for errors
    comms.save(function(err) {
      if (err)
        res.send(err);

      res.json(comms);
    });
  });
};

// Create endpoint /api/beers/:comm_id for DELETE_byId
exports.deleteComm = function(req, res) {
  // Use the Beer model to find a specific beer and remove it
  Commerce.findByIdAndRemove(req.params.comm_id, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Commerce removed from the list!' });
  });
};

exports.getOwnerKey = function(req, res) {
  res.json({ message: 'getOnwerKey function directory' });
};
exports.setOwnerKey = function(req, res) {
  res.json({ message: 'setOnwerKey function directory' });
};
