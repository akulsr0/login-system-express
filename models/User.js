const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  age: { type: Number },
  password: { type: String },
  dateRegistered: { type: Date, default: new Date() }
});

module.exports = user = mongoose.model('user', userSchema);
