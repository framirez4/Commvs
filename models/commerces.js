var mongoose = require('mongoose');

// Define our schema
var CommerceSchema   = new mongoose.Schema({
  name: String,
  description: String,
  phone: String,
  userAdminId: String
  /*address: String,
  email: String,
  web: String,
  schedule: String,
  activity: String,
*/
});

// Export the Mongoose model
module.exports = mongoose.model('Commerce', CommerceSchema);
