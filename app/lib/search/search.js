// Load packages
const Commerce = require('../../models/commerce');
const User = require('../../models/user');

exports.searchCommerces = function(req, res) {
  Comm.find(
    { name: new RegExp(req.query.name, 'i'),
      location:  new RegExp(req.query.loc, 'i')
    },
    {ownership: 0},
    function( err, comms ) {
      if (err) res.send(err);
      res.json(comms);
    }
  );
};
