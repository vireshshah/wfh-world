const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');

// Define the database model
const UserSchema = new mongoose.Schema({
  countryCodeAlpha3: {
    type: String,
    required: [true, 'Country code is required.'],
  },
  count: {
    type: Number
  },
  updated: { 
    type: Date
  }
}, {
  versionKey: false
});

// Use the unique validator plugin
//UserSchema.plugin(unique, { message: 'That {PATH} is already taken.' });
const User = module.exports = mongoose.model('user', UserSchema);
