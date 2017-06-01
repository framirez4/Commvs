const mongoose = require('mongoose')

// Validation for any unique field in a mongoose model
exports.findFieldDuplication = function (model, field) {
  return function (entry, callback = () => {}) {
    var q = {}
    q[field] = entry

    mongoose.model(model).find(q).count().exec()
    .then(doc => callback(doc))
    .catch(callback)
  }
}

exports.filterValidationModelErrors = function (errors = []) {
  for (var key in errors) {
    errors[key] = errors[key].properties
  }

  return errors
}
