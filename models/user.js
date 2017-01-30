// Load required packages
const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const bcrypt    = require('bcrypt');
const utils = require('../controllers/utils');
const saltRounds = 10;


// Define our user schema
var UserSchema = new Schema({
  'email': {
    type: String,
    required: [true, 'Please, fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    unique: true,
    validate: [ utils.findFieldDuplication('User', 'email'), 'This email adress is already associated to a user' ]
  },
  'password': {
    type: String,
    required: [true, 'Please, insert a valid password'],
    minlength: [6, 'The value of {PATH} is shorter than the minimum allowed length ({MINLENGTH}).']
  },
  'first_name': { type: String, required: [true, 'Please, insert your first name'] },
  'last_name': { type: String, required: [true, 'Please, insert your last name'] },
  'role': { type: String, enum: ['user', 'admin'], default: 'user' },

  'loc': { type: String },

  'bookmarks': [{ type: Schema.Types.ObjectId, unique: true, ref: 'Commerce' }],
  'owns': [{ type: Schema.Types.ObjectId, unique: true, ref: 'Commerce' }]
});

// Execute before each user.save() call
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next(); // Break out if the password hasn't changed

  bcrypt.hash(this.password, saltRounds)
  .then((hash) => {
    this.password = hash;
    return next();
  })
  .catch(next);
});


UserSchema.pre('update', function (next) {
  var updateFields = this.getUpdate()['$set'];//this._update['$set']
  if (!updateFields.hasOwnProperty('password')) return next();

  bcrypt.hash(updateFields.password, saltRounds)
  .then((hash) => {
    this._update['$set'].password = hash;
    return next();
  })
  .catch(next);
});


UserSchema.methods.verifyPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
