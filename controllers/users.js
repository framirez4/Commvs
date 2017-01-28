// Load required packages
const User = require('../models/user');

exports.postUsers = function(req, res) {
  var user = new User({
    'email': req.body.email,
    'first_name': req.body.first_name,
    'last_name': req.body.last_name,
    'password': req.body.password,
    'role': req.body.role || 'user',
    'loc': req.body.loc || ''
  });

  user.save(function (err) {
    if (err) {
      if (err.errmsg) console.log('Error while generating new user:', err.errmsg);

      for (var key in err.errors) {
        err.errors[key] = err.errors[key].properties;
      }
      return res.json({ success: false, message: err.errors });
    }


    return res.json({ success: true, message: 'New user added!' });
  });
};


exports.getUsers = function(req, res) {
  User.find(function(err, users) {
    if (err) return res.send(err);
    res.json(users);
  });
};

exports.editUser = function(req, res) {

  // fields not allowed to edit for a user from the API
  if (req.body.hasOwnProperty('_id')) delete req.body._id;
  if (req.body.hasOwnProperty('password')) delete req.body.password;
  if (req.body.hasOwnProperty('role')) delete req.body.role;
  if (req.body.hasOwnProperty('owns')) delete req.body.owns;
  if (req.body.hasOwnProperty('bookmarks')) delete req.body.bookmarks;

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
