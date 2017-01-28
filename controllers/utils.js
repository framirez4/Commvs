const mongoose  = require('mongoose');

// Validation for any unique field in a mongoose model
exports.findFieldDuplication = function(model, field) {
  return function (entry, callback) {

    var q = {};
    q[field] = entry;

    mongoose.model(model).find(q).count().exec()
    .then( doc => callback(!doc) )
    .catch(callback);
  };
};
