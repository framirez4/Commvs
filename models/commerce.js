// Load packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const keygen  = require('keygenerator');

//var Ownership = require('./ownershop.js');

// Define our schema
var CommSchema   = new Schema({
  _id: String,
  name: { type: String, required: true },
  address: String,
  location: { type: String, required: true },
  phone: String,
  description: String,
  email: String,
  gps: String,
  web: String,
  schedule: String,
  activity: String,
  promos: [{
    name: { type: String, required: true },
    description: { type: String },
    valid: {
      start: { type: Date, required: true, default: Date.now },
      end: { type: Date, required: true}
    }
  }],
  ownership: {
    key: { type: Number, unique: true, length: [8, 'The value of key must be {length}'] },
    owners: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  }
});

CommSchema.pre('save', function(callback) {
  var comm = this;

  //if _id is not null, callback
  if(comm._id !== null) return callback();

  var str_name  = (comm.name).replace(/ /g, "-").replace(/\'/g, "").toLowerCase();
  var str_loc   = (comm.location).replace(/ /g, "-").replace(/\'/g, "").toLowerCase();
  var str       = (str_loc + "_" + str_name);
  this._id = str;
  callback();

});
// Pre generate a new key for comm
CommSchema.pre('save', function(callback){
  if(this.ownership.key !== undefined) return callback();
  this.ownership.key = keygen.number();
  callback();
});

// Export the Mongoose model
module.exports = mongoose.model('Commerce', CommSchema);
