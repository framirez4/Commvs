// Load required packages
const User = require('../models/user');

/**
 * POST a new user
 * @param  {object} Reads req.body for email, first_name, last_name, email, password, role
 * @param  {object} res
 * @return {object}     { success, message }
 */
exports.postUsers = function(req, res) {
  var user = new User({
    '_id': req.body.email,
    'first_name': req.body.first_name,
    'last_name': req.body.last_name,
    'password': req.body.password,
    'role': req.body.role || 'user',
    'loc': req.body.loc || ''
  });

  user.save(function(err) {
    if (err){
      if(err.errmsg) return res.json({ success: false, message: err.errmsg });
      else
        if(err.errors){
          errors = {};
          if(err.errors['first_name']) {
            errors.first_name = {};
            errors.first_name.message = err.errors['first_name'].message;
            errors.first_name.type = err.errors['first_name'].properties.type;
          }
          if(err.errors['last_name']) {
            errors.last_name = {};
            errors.last_name.message = err.errors['last_name'].message;
            errors.last_name.type = err.errors['last_name'].properties.type;
          }
          if(err.errors['_id']) {
            errors.id = {};
            errors.id.message = err.errors['_id'].message;
            errors.id.type = err.errors['_id'].properties.type;
          }
          if(err.errors['password']) {
            errors.password = {};
            errors.password.message = err.errors['password'].message;
            errors.password.type = err.errors['password'].properties.type;
          }
          
          return res.json({ success: false, message: errors });
        }

    } else {
      return res.json({ success: true, message: {en: 'New user added!', es: 'Nuevo usuario añadido!'} });
    }
  });
};

/**
 * Create endpoint to get a list of users. Returns all users.
 * Needs to improve to limit the users shown.
 * @param  {Object} req
 * @param  {Object} res
 * @return {Object}     Returns a list for all users. ALL!
 */
exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err) return res.send(err);
    res.json(users);
  });
};

/**
 * Edit any user data fields
 * Excludes: _id, password, role, owns, favs
 * Ignores any unknown field
 * @param  {Object} req User from req.decoded._doc and new data at req.body
 * @param  {Object} res
 * @return {Object}     { success, message } Message to show if the action was successful and data was changed
 */
exports.editUser = function(req, res) {
  if (req.body.hasOwnProperty('_id')) delete req.body._id;
  if (req.body.hasOwnProperty('password')) delete req.body.password;
  if (req.body.hasOwnProperty('role')) delete req.body.role;
  if (req.body.hasOwnProperty('owns')) delete req.body.owns;
  if (req.body.hasOwnProperty('favs')) delete req.body.favs;
  User.update(
    { _id: req.decoded._doc._id },
    req.body,
    function(err, modified){
      if (err) return res.send(err);
      if (modified.nModified === 0)
        return res.json(
          { success: true,
            message: {
              en: 'No profile data was modified',
              es: 'Ningún dato del perfil ha sido modificado'
            }
          });
      else
        return res.json(
          { success: true,
            message: {
              en: 'User profile updated successfully',
              es: 'Los datos del perfil se han actualizado correctamente'
            }
          });
    }
  );
};

/**
 * Edit a password from a user and save to the database (runs mongoose .pre to salt the password)
 * @param  {Object} req req.decoded._doc from the authenticated user
 * @param  {Object} res
 * @return {Object}     { success, message }
 */
exports.editPassword = function(req, res) {
  User.findById( req.decoded['_doc']['_id'], function(err, user) {
    if (err) return res.send(err);

    user.password = req.body.password;

    // Save the user and check for errors
    user.save(function(err) {
      if (err && err.errors) return res.json({success: false, message: err.errors['password'].message});
      res.json(
        { success:true,
          message: {
            en: 'Password successfully changed',
            es: 'La contraseña se ha cambiado correctamente'
          }
        });

    });
  });

};

/**
 * Delete a user from db
 * @param  {Object} req reads req.query.email (?params) and a token
 * @param  {Object} res
 * @return {Object}     Returns a message if a user was found and deleted
 */
exports.deleteUsers = function(req, res) {
  User.findById(
    req.query.email,
    function ( err, user ) {
      if(!user) return res.json({ success: false, message: 'User not found'});

      User.findByIdAndRemove(user._id, function(err) {
        if (err) return res.send(err);
        res.json(
          { success:true,
            message: {
              en: 'User removed from our database',
              es: 'Usuario eliminado de nuestra base de datos'
            }
          });
      });
    }
  );
};

/**
 * Create endpoint /users/me to get the logged user data object
 * @param  {Object} req req.decoded._doc from the authenticated user
 * @param  {Object} res
 * @return {Object}     Returns the user information from the authentication token.
 */
exports.getMe = function(req, res) {
  User.findById(
    req.decoded['_doc']['_id'],
    function(err, user) {
      if (err) return res.send(err);

      res.json(user);
  });
};
