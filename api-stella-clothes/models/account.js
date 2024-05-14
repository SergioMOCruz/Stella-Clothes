const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  password : {
    type: String,
    required: true,
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
