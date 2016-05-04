// Load required packages
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;
var bcrypt    = require('bcrypt-nodejs');

// Define our user schema
var UserSchema = new Schema({
  '_id': {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  'password': {
    type: String,
    required: true,
    minlength: [4, 'The value of {PATH} `{VALUE}` is shorter than the minimum allowed length ({MINLENGTH}).']
  },
  'role': {
    type: String,
    default: 'user'
  },
  'favs': [{
    type: String, unique: true, ref: 'Comm'
  }],
  'owns': [{
    type: String, unique: true, ref: 'Comm'
  }]
});

// Virtual value to match _id as email
UserSchema.virtual('email').get(function() {
  return this._id;
});

// Execute before each user.save() call
UserSchema.pre('save', function(callback) {
  var user = this;

  // Break out if the password hasn't changed
  if (!user.isModified('password')) return callback();

  // Password changed so we need to hash it
  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

UserSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
