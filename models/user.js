// Load required packages
const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const bcrypt    = require('bcryptjs');

// Define our user schema
var UserSchema = new Schema({
  'email': {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    unique: true
  },
  'first_name': { type: String, required: true },
  'last_name': { type: String, required: true },
  'role': { type: String, enum: ['user', 'admin'], default: 'user' },
  'password': {
    type: String,
    required: true,
    minlength: [6, 'The value of {PATH} is shorter than the minimum allowed length ({MINLENGTH}).']
  },

  'loc': { type: String },

  'bookmarks': [{ type: String, unique: true, ref: 'Commerce' }],
  'owns': [{ type: String, unique: true, ref: 'Commerce' }]
});

// Execute before each user.save() call
UserSchema.pre('save', function(next) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return next();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.verifyPassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
  });
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
