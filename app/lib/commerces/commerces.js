// Load packages

const Commerce = require('../../models/commerce');
const User = require('../../models/user');
// var Ownkey = require('../models/ownkeys');

exports.postCommerce = function(req, res) {
    var commerce = Commerce(req.body);

    commerce.save()
        .then(commerce => res.json({ success: true, message: 'Commerce added to the list!', data: commerce }))
        .catch(err => res.json({ success: false, error: err }));
};

exports.getComms = function(req, res) {
    // Use the Commerce model to find all commerces
    console.log(req.query);
    if (!req.query.loc) req.query.loc = '';
    Commerce.find({
        //location: new RegExp('.*'+req.query.loc+'.*', 'i')
        location: new RegExp('.*\w*' + req.query.loc + '\w*.*', "ig")
    }, { ownership: 0 }, function(err, comms) {
        if (err) return res.send(err);
        res.json(comms);

    });
};

exports.getComm = function(req, res) {
    // Use the Commerce model to find a specific commerce
    Commerce.findById(req.params.comm_id, { ownership: 0 }, function(err, comms) {
        if (err) return res.send(err);
        if (!comms) return res.json({ success: false, message: { en: "Commerce could not be found", es: "No se ha podido encontrar el comercio" } });
        res.json(comms);
    });
};

exports.putComm = function(req, res) {
    // Use the Commerce model to find a specific commerce
    if (req.body.hasOwnProperty('_id')) delete req.body._id;
    if (req.body.hasOwnProperty('ownership')) delete req.body.ownership;

    Comm.update({ _id: req.params.comm_id },
        req.body,
        function(err, modified) {
            if (err) return res.send(err);
            if (modified.nModified === 0) {
                return res.json({
                    success: true,
                    message: {
                        en: 'No Commerce data was modified',
                        es: 'No se han modificado los datos del comercio'
                    }
                });
            } else {
                return res.json({
                    success: true,
                    message: {
                        en: 'Commerce data updated successfully',
                        es: 'Los datos del comercio se han actualizado correctamente'
                    }
                });
            }
        }
    );
};


exports.deleteComm = function(req, res) {
    Commerce.findById(
        req.params.comm_id,
        function(err, comm) {
            if (!comm) return res.json({ success: false, message: { en: "Commerce could not be found", es: "No se ha podido encontrar el comercio" } });
            // Use the Comm model to find a specific comm and remove it
            Comm.findByIdAndRemove(comm._id, function(err) {
                if (err) {
                    res.send(err);
                } else {
                    // If the Comm is found
                    User.update({ owns: comm._id }, { $pull: { owns: comm._id } }, { multi: true },
                        function(err, user) {
                            if (err) return res.json({ success: false, message: err });
                            res.json({ success: true, removed: comm._id, message: { en: 'Commerce removed and all its admins', es: 'Comercio eliminado y todos sus administradores' } });

                        }
                    );

                    //Will delete all the promos associated to this commerce too.

                }
            });
        }
    );

};