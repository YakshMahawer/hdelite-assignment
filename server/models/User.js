// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  otp: String,
  otpExpiresAt: Date,
  name: String,
  dob: String,
});

module.exports = mongoose.model('User', userSchema);

