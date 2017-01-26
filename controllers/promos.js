// Load packages

const Comm = require('../models/comms');
const User = require('../models/user');
//var Ownkey = require('../models/ownkeys');



/**
 * Create endpoint to add a new Promo
 * @param  {Object} req reads token from header, only owners can insert.
 * From body: name, address, location, phone, description, email, gps, web, schedule, activity
 * ID is built automatically from location_name
 * @param  {Object} res
 * @return {Object}     {success, message, data}
 */
exports.postPromo = function(req, res) {
  /*// Create a new instance of the Commerce model
  var promo = Comm({
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
  });*/
};

/**
 * Create endpoint to get all comms. Needs refactor to paginate
 * @param  {Object} req
 * @param  {Object} res
 * @return {Array}     [{Comm}]
 */
exports.getPromos = function(req, res) {
  /*// Use the Commerce model to find all commerces
  Comm.find({}, {ownership: 0}, function(err, comms) {
    if (err) {
      res.send(err);
    } else {
      res.json(comms);
    }
  });*/
};

/**
 * Entpoint to get a Comm by its ID
 * @param  {Object} req read req.params.comm_id
 * @param  {Object} res
 * @return {Object}     {Comm}
 */
exports.getPromo = function(req, res) {
  /*// Use the Commerce model to find a specific commerce
  Comm.findById(req.params.comm_id, {ownership: 0}, function(err, comms) {
    if (err) return res.send(err);
    if (!comms) return res.json({ message: 'Commerce not found' });
    res.json(comms);
  });*/
};

/**
 * Endpoint to update a comm by its ID
 * @param  {Object} req Read new data from req.body
 * @param  {Object} res
 * @return {Object}     {New comm data}
 */
exports.putPromo = function(req, res) {
  /*// Use the Commerce model to find a specific commerce
  if (req.body.hasOwnProperty('_id')) delete req.body._id
  if (req.body.hasOwnProperty('ownership')) delete req.body.ownership

  Comm.update(
    { _id: req.params.comm_id },
    req.body,
    function(err, modified){
      if (err) return res.send(err);
      if (modified.nModified == 0) {
        return res.json(
          {
            success: true,
            message: 'No Commerce data was modified'
          }
        );
      }
      else {
        return res.json(
          {
            success: true,
            message: 'Commerce data updated successfully'
          }
        );
      }
    }
  );*/
};

/**
 * Endpoint to delete a commerce
 * @param  {Object} req req.params.comm_id to delete
 * @param  {Object} res
 * @return {Object}     {success,message}
 */
exports.deletePromo = function(req, res) {
  /*Comm.findById(
    req.params.comm_id,
    function ( err, comm ) {
      if (!comm) return res.json({ success: false, message: 'Commerce not found'});
        // Use the Comm model to find a specific comm and remove it
        Comm.findByIdAndRemove(comm._id, function(err) {
          if (err){
            res.send(err);
          } else {
            // If the Comm is found
            User.update(
              {owns: comm._id},
              { $pull: { owns: comm._id }},
              {multi: true},
              function(err, user) {
                if (err) return res.json({ success: false, message: err });
                res.json({ success: true, removed: comm._id, message: 'Commerce removed and all its admins' });

              }
            );

          //Will delete all the promos associated to this commerce too.

          }
        });
    }
  )
*/
};
