// Load required packages
const User = require('../models/user');
const Comm = require('../models/commerce');

// Create endpoint /bookmarks for POST

/**
 * Create endpoint for users to add a Bookmarkorite commerce
 * @param  {Object} req req.params.comm_id
 * @param  {Object} res
 * @return {Object}     {success, added, message}
 */
exports.postBookmark = function(req, res) {
  Comm.findOne(
    {_id: req.params.comm_id},
    function (err, comm) {
      if (!comm) return res.json({success: false, message: {en: "Commerce could not be found", es: "No se ha podido encontrar el comercio"}});
      User.findByIdAndUpdate(
        req.decoded['_doc']['_id'],
        {$addToSet: { bookmarks: comm._id }},
        function(err, user) {
          if (err) return res.json({ success: false, err });
          res.json({ success: true, added: comm._id, message: {en: 'Bookmark added: ' + comm.name + ' ('+comm._id+')' , es: 'Bookmarkorito añadido: ' + comm.name + ' ('+comm._id+')' } });
        }
      );
    }
  );
};

/**
 * Create endpoint for users to delete a Bookmarkorite commerce
 * @param  {Object} req req.params.comm_id
 * @param  {Object} res
 * @return {Object}     {success, removed, message}
 */
exports.deleteBookmark = function(req, res) {
  User.findByIdAndUpdate(
    req.decoded['_doc']['_id'],
    { $pull: { bookmarks: req.params.comm_id }},
    function(err, user) {
      if (err) return res.json({ success: false, err });
      res.json({ success: true, removed: req.params.comm_id, message: { en: 'Commerce removed from Bookmarkorites', es: 'Comercio eliminado de Bookmarkoritos'} });

    }
  );
};
