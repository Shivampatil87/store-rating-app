const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,  // Adjusted to a more reasonable length
    maxlength: 60
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    maxlength: 400
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'owner'],
    default: 'user'
  }
});

module.exports = mongoose.model('User', userSchema);
