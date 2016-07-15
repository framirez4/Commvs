// Load packages

var Comm = require('../models/comms');
var User = require('../models/user');
//var Ownkey = require('../models/ownkeys');



/**
 * Create endpoint to add a new Comm
 * @param  {Object} req reads token from header, only admins can insert.
 * From body: name, address, location, phone, description, email, gps, web, schedule, activity
 * ID is built automatically from location_name
 * @param  {Object} res
 * @return {Object}     {success, message, data}
 */
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

    res.json({ success: true, message: { en: 'Commerce added to the list!', es: 'Comercio añadido a la lista!' }, data: comm });
  });
};

/**
 * Create endpoint to get all comms. Needs refactor to paginate
 * @param  {Object} req
 * @param  {Object} res
 * @return {Array}     [{Comm}]
 */
exports.getComms = function(req, res) {
  // Use the Commerce model to find all commerces
  console.log(req.query);
  if(!req.query.loc) req.query.loc = '';
  Comm.find({
    //location: new RegExp('.*'+req.query.loc+'.*', 'i')
    location: new RegExp('.*\w*'+req.query.loc+'\w*.*', "ig")
  }, {ownership: 0}, function(err, comms) {
    if (err) return res.send(err);
    res.json(comms);

  });
};

/**
 * Entpoint to get a Comm by its ID
 * @param  {Object} req read req.params.comm_id
 * @param  {Object} res
 * @return {Object}     {Comm}
 */
exports.getComm = function(req, res) {
  // Use the Commerce model to find a specific commerce
  Comm.findById(req.params.comm_id, {ownership: 0}, function(err, comms) {
    if (err) return res.send(err);
    if (!comms) return res.json({ success: false, message: {en: "Commerce could not be found", es: "No se ha podido encontrar el comercio"} });
    res.json(comms);
  });
};

/**
 * Endpoint to update a comm by its ID
 * @param  {Object} req Read new data from req.body
 * @param  {Object} res
 * @return {Object}     {New comm data}
 */
exports.putComm = function(req, res) {
  // Use the Commerce model to find a specific commerce
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
            message: {
              en: 'No Commerce data was modified',
              es: 'No se han modificado los datos del comercio'
            }
          }
        );
      }
      else {
        return res.json(
          {
            success: true,
            message: {
              en: 'Commerce data updated successfully',
              es: 'Los datos del comercio se han actualizado correctamente'
            }
          }
        );
      }
    }
  );
};

/**
 * Endpoint to delete a commerce
 * @param  {Object} req req.params.comm_id to delete
 * @param  {Object} res
 * @return {Object}     {success,message}
 */
exports.deleteComm = function(req, res) {
  Comm.findById(
    req.params.comm_id,
    function ( err, comm ) {
      if (!comm) return res.json({ success: false, message: {en: "Commerce could not be found", es: "No se ha podido encontrar el comercio"} });
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
                res.json({ success: true, removed: comm._id, message: { en: 'Commerce removed and all its admins', es: 'Comercio eliminado y todos sus administradores' } });

              }
            );

          //Will delete all the promos associated to this commerce too.

          }
        });
    }
  )

};
