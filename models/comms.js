var mongoose = require('mongoose');

// Define our schema
var CommSchema   = new mongoose.Schema({
  _id: String,
  description: String,
  address: String,
  email: String,
  gps: String,
  phone: String,
  web: String,
  schedule: String,
  activity: String
});

// Virtual value to match _id as name
CommSchema.virtual('name').get(function() {
  return this._id;
});

// Export the Mongoose model
module.exports = mongoose.model('Comm', CommSchema);
