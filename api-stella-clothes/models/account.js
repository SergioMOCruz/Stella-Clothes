const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  password : {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  nif: {
    type: String,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {versionKey: false});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
